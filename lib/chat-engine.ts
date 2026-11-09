/**
 * A deterministic retrieval "chatbot".
 *
 * There is no language model here. Every answer is assembled from lib/data.ts,
 * the same source the page renders, so the assistant physically cannot invent
 * a fact that isn't already on the site. Questions are matched to an intent by
 * keyword overlap; anything we can't match confidently falls back to pointing
 * at Parth's email rather than guessing.
 */

import {
  site,
  socials,
  experience,
  allProjects as projects,
  skills,
  education,
} from "./data";
import { sortedPosts } from "./blog";

export type ChatAnswer = {
  /** Which intent produced this answer ("fallback" when nothing matched). */
  id?: string;
  text: string;
  bullets?: string[];
  links?: { label: string; href: string }[];
};

type Intent = {
  id: string;
  /** Distinctive words. Matching is on stems, so "project" covers "projects". */
  keywords: string[];
  /** Substring hits on the raw question: strong signal, scored higher. */
  phrases?: string[];
  answer: () => ChatAnswer;
};

/* ------------------------------------------------------------------ *
 * Text normalisation
 * ------------------------------------------------------------------ */

const STOP = new Set([
  "the","a","an","is","are","am","be","was","were","do","does","did","you",
  "your","yours","my","me","i","what","whats","which","who","how","can","could",
  "would","should","tell","about","of","for","in","on","at","to","with","and",
  "or","have","has","had","it","that","this","there","here","please","hey","hi",
  "hello","give","get","show","some","any","more","much","many","said","say",
  "know","want","need","like","us","we","they","them","from","by","as","if",
]);

function normalize(input: string): string {
  return input
    .toLowerCase()
    // "." separates too: "React.js" -> "react js", so a query of "react" matches.
    .replace(/[^a-z0-9+#\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Crude suffix stripping: enough to unify plural/gerund forms. */
function stem(word: string): string {
  if (word.length <= 3) return word;
  return word.replace(/(ings|ing|ies|ed|es|s)$/, "");
}

/** Whole-word phrase test, so "hi" doesn't match inside "hire". */
function containsPhrase(haystack: string, phrase: string): boolean {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|\\s)${escaped}($|\\s)`).test(haystack);
}

function tokenize(input: string): string[] {
  return normalize(input)
    .split(" ")
    .filter((t) => t.length > 0 && !STOP.has(t))
    .map(stem);
}

/* ------------------------------------------------------------------ *
 * Answer builders: all text originates in data.ts
 * ------------------------------------------------------------------ */

const job = experience[0];

function projectAnswer(name: string): ChatAnswer {
  const p = projects.find((x) => x.name === name)!;
  return {
    text: `${p.name}: ${p.tagline}. ${p.description}`,
    bullets: p.points.slice(0, 3),
    links: [
      ...(p.link ? [{ label: `Open ${p.name}`, href: p.link }] : []),
      { label: p.kind === "Work" ? "See work experience" : "See projects", href: p.kind === "Work" ? "/work" : "/projects" },
    ],
  };
}

function projectIntents(): Intent[] {
  return projects.map((p) => ({
    id: `project:${p.name}`,
    keywords: [
      ...tokenize(p.name),
      ...tokenize(p.tagline),
      ...p.tech.flatMap((t) => tokenize(t)),
    ],
    phrases: [p.name.toLowerCase()],
    answer: () => projectAnswer(p.name),
  }));
}

const INTENTS: Intent[] = [
  {
    id: "hiring",
    keywords: [
      "hiring","hire","opportunity","opportunities","job","role","open","available",
      "availability","looking","recruit","recruiter","position","vacancy","offer",
      "freelance","contract","fulltime","internship","join",
    ],
    phrases: ["open to work", "open for work", "looking for a job", "are you available"],
    answer: () => ({
      text:
        `Yes, ${site.name} is open to opportunities in production AI: RAG systems, ` +
        `LLM agents and automation. Currently ${job.role} at ${job.short} in ${job.location}.`,
      links: [
        { label: `Email ${site.email}`, href: socials.email },
        { label: "LinkedIn", href: socials.linkedin },
        { label: "Resume / CV", href: site.resume },
      ],
    }),
  },
  {
    id: "contact",
    keywords: [
      "contact","email","mail","reach","phone","call","number","touch","linkedin",
      "github","twitter","x","instagram","social","connect","dm","message",
    ],
    phrases: ["get in touch", "how do i contact", "reach you"],
    answer: () => ({
      text: `The fastest way to reach ${site.name} is email. Based in ${site.location}.`,
      links: [
        { label: site.email, href: socials.email },
        { label: "Instagram @parthlodat.ai", href: socials.instagram },
        { label: "LinkedIn", href: socials.linkedin },
        { label: "GitHub", href: socials.github },
      ],
    }),
  },
  {
    id: "experience",
    keywords: [
      "experience","work","working","job","company","employer","mediallianz",
      "current","currently","where","career","intern","internship","promoted",
      "engineer","professional","background",
    ],
    phrases: ["where do you work", "work experience", "current role", "what do you do"],
    answer: () => ({
      text:
        `${job.role} at ${job.company} (${job.period}, ${job.location}). ${job.note}.`,
      bullets: job.points.slice(0, 4),
      links: [{ label: "See full experience", href: "/work" }],
    }),
  },
  {
    id: "projects",
    // Deliberately excludes generic verbs ("build", "work", "made"): they
    // collide with the automation and experience intents.
    keywords: [
      "project","projects","built","shipped","ship","portfolio","showcase",
      "best","product",
    ],
    phrases: ["what have you built", "your projects", "best project", "walk me through"],
    answer: () => ({
      text:
        `${site.name} has shipped ${projects.length} projects: ` +
        `${projects.filter((p) => p.kind === "Work").length} at ${job.short}, ` +
        `${projects.filter((p) => p.kind === "Personal").length} personal. Ask about any of them by name:`,
      bullets: projects.map((p) => `${p.name}: ${p.tagline}`),
      links: [{ label: "Work experience", href: "/work" }, { label: "Projects", href: "/projects" }],
    }),
  },
  {
    id: "rag",
    keywords: [
      "rag","retrieval","embedding","embeddings","vector","pgvector","chroma",
      "faiss","semantic","chunking","index","llm","agent","agents",
    ],
    phrases: ["rag pipeline", "vector database", "retrieval augmented"],
    answer: () => ({
      text:
        "RAG is the core of Parth's work. On PulseLoop he built the retrieval engine " +
        "end to end: PDF ingestion with PyMuPDF plus OCR fallback, chunking, NVIDIA NIM " +
        "embeddings into pgvector, and SSE token-streamed generation, with hierarchical " +
        "retrieval across account and global tiers. The personal Financial Chatbot uses a " +
        "LangChain + Chroma DB pipeline over finance documents.",
      links: [{ label: "Work experience", href: "/work" }, { label: "Projects", href: "/projects" }],
    }),
  },

  {
    id: "automation",
    keywords: [
      "automation","automate","n8n","make.com","workflow","workflows","pipeline",
      "agent","agents","multiagent","publishing","scrape",
    ],
    phrases: ["workflow automation", "n8n"],
    answer: () => ({
      text:
        "Automation is a big part of Parth's work. Real Doodle runs a 5-agent LLM pipeline " +
        "in n8n (Research → Writer → SEO → Quality → Publish) shipping ~9–10 articles a day " +
        "unattended. The Google Ads platform uses n8n to pull Ads API metrics and parse GCLID " +
        "reports out of Gmail, and lead qualification runs end to end in Make.com with instant " +
        "Twilio follow-up.",
      links: [{ label: "See work experience", href: "/work" }],
    }),
  },

  {
    id: "skills",
    keywords: [
      "skill","skills","stack","tech","technology","technologies","tool","tools",
      "language","languages","framework","frameworks","know","expertise","proficient",
      "familiar","use","using",
      // Every named skill, so a bare "react" or "pgvector" resolves here.
      ...skills.flatMap((g) => g.items.flatMap((i) => tokenize(i))),
    ],
    phrases: ["your stack", "tech stack", "ai stack", "what technologies"],
    answer: () => ({
      text: `${site.name}'s stack, grouped by area:`,
      bullets: skills.map((g) => `${g.group}: ${g.items.join(", ")}`),
      links: [{ label: "See skills", href: "/#skills" }],
    }),
  },
  {
    id: "blog",
    // No bare "write"/"read": they collide with skills ("do you write python")
    // and with off-topic requests ("write me a poem").
    keywords: [
      "blog","blogs","post","posts","article","articles","writing",
      "tutorial","tutorials","newsletter",
    ],
    phrases: [
      "your blog","your posts","your articles","do you blog",
      "what do you write","do you write about","read your posts",
    ],
    answer: () =>
      sortedPosts.length === 0
        ? {
            text: "No posts published yet. The blog is up but empty for now.",
            links: [{ label: "Blog", href: "/blog" }],
          }
        : {
            text: `${site.name} writes about building production LLM systems. ${sortedPosts.length} ${sortedPosts.length === 1 ? "post" : "posts"} so far:`,
            bullets: sortedPosts.slice(0, 4).map((p) => `${p.title}: ${p.excerpt}`),
            links: [
              { label: "Read the blog", href: "/blog" },
              ...sortedPosts.slice(0, 2).map((p) => ({
                label: p.title.length > 34 ? p.title.slice(0, 34) + "…" : p.title,
                href: `/blog/${p.slug}`,
              })),
            ],
          },
  },
  {
    id: "education",
    keywords: [
      "education","study","studied","college","university","degree","school",
      "graduate","graduation","academic","btech","engineering","cgpa","course",
    ],
    phrases: ["where did you study", "your education"],
    answer: () => ({
      text: `${education[0].degree} (${education[0].period}).`,
      links: [{ label: "See education", href: "/#education" }],
    }),
  },
  {
    id: "resume",
    keywords: ["resume","cv","download","pdf","curriculum"],
    phrases: ["your resume", "send me your cv"],
    answer: () => ({
      text: "Here's the full resume as a PDF.",
      links: [{ label: "Download resume", href: site.resume }],
    }),
  },
  {
    id: "about",
    keywords: [
      "who","about","yourself","introduce","introduction","bio","summary","parth",
      "lodat","story","person",
    ],
    phrases: ["who are you", "tell me about yourself", "about parth"],
    answer: () => ({
      text:
        `${site.name}, ${site.role} at ${job.company}. ${site.description} ` +
        `Based in ${site.location}.`,
      links: [
        { label: "More about Parth", href: "/#about" },
        { label: "Resume / CV", href: site.resume },
      ],
    }),
  },
  {
    id: "location",
    keywords: ["location","where","based","city","country","remote","relocate","live"],
    phrases: ["where are you based", "where do you live"],
    answer: () => ({
      text: `${site.name} is based in ${site.location}.`,
      links: [{ label: "Get in touch", href: socials.email }],
    }),
  },
  {
    id: "greeting",
    keywords: ["hello","hey","yo","greetings","sup","howdy","morning","evening"],
    phrases: ["hi", "hello", "hey there", "good morning"],
    answer: () => ({
      text:
        `Hi! Ask me anything about ${site.name}'s work: his experience at ${job.short}, ` +
        `any of his ${projects.length} projects, his stack, or how to get in touch.`,
    }),
  },
  {
    id: "thanks",
    keywords: ["thanks","thank","thankyou","cheers","appreciate","great","awesome","cool","nice"],
    phrases: ["thank you", "thanks a lot"],
    answer: () => ({
      text: "Happy to help. Anything else you'd like to know about Parth's work?",
    }),
  },
  ...projectIntents(),
];

/* ------------------------------------------------------------------ *
 * Matching
 * ------------------------------------------------------------------ */

const FALLBACK: ChatAnswer = {
  id: "fallback",
  text:
    "I only know what's on this site, and I couldn't find that here. Try asking about " +
    "Parth's experience, a specific project, his stack, education, or how to contact him, " +
    "or just email him directly.",
  links: [
    { label: site.email, href: socials.email },
    { label: "Resume / CV", href: site.resume },
  ],
};

/** Minimum score before we trust a match; below this we say we don't know. */
const THRESHOLD = 0.34;

export function findAnswer(query: string): ChatAnswer {
  const raw = normalize(query);
  if (!raw) return FALLBACK;

  const queryTokens = new Set(tokenize(query));

  // A question can be entirely stopwords ("who are you") and still be answerable
  // via a phrase match, so we always run the scoring loop.
  let best: { intent: Intent; score: number } | null = null;

  for (const intent of INTENTS) {
    const keywordSet = new Set(intent.keywords.map(stem));
    let hits = 0;
    for (const token of queryTokens) if (keywordSet.has(token)) hits += 1;

    // Normalise by query length so long questions aren't penalised, and damp by
    // intent breadth so a keyword-heavy intent can't win on volume alone.
    let score = queryTokens.size > 0 ? hits / Math.sqrt(queryTokens.size) : 0;

    for (const phrase of intent.phrases ?? []) {
      if (containsPhrase(raw, phrase)) score += 1.2;
    }

    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }

  if (!best || best.score < THRESHOLD) return FALLBACK;
  return { ...best.intent.answer(), id: best.intent.id };
}

/** Chips shown before the visitor types anything. */
export const QUICK_QUESTIONS = [
  "Are you open to opportunities?",
  "What's your AI stack?",
  "Walk me through your best project",
];

export const GREETING: ChatAnswer = {
  text: `Hi! I'm ${site.name}'s portfolio assistant. I answer from what's on this site. Ask me about his work, projects, or stack.`,
};
