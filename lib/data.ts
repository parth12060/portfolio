export const site = {
  name: "Parth Lodat",
  role: "AI Engineer",
  title: "Parth Lodat | AI Engineer",
  description:
    "AI Engineer building production LLM systems end to end: RAG pipelines, real-time signal detection and multi-agent automation.",
  url: "https://parthlodat.in",
  email: "parthlodat.dev@gmail.com",
  location: "Mumbai, India",
  resume: "/Parth_Lodat_Resume.pdf",
  initials: "PL",
};

export const socials = {
  github: "https://github.com/parth12060",
  linkedin: "https://www.linkedin.com/in/parth-lodat-dev/",
  x: "https://x.com/PARTHLODAT",
  instagram: "https://www.instagram.com/parthlodat.ai/",
  email: `mailto:${site.email}`,
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blog" },
];

export type Project = {
  name: string;
  tagline: string;
  period?: string;
  /** Work = Mediallianz (shown under Experience). Personal = own builds. */
  kind: "Work" | "Personal";
  featured?: boolean;
  link?: string;
  description: string;
  points: string[];
  tech: string[];
  /** Optional raster cover, e.g. "/projects/shipcheck.png" (12:7, 1440x840). Overrides the illustrated SVG cover. */
  image?: string;
  imageAlt?: string;
};

export const allProjects: Project[] = [
  {
    name: "PulseLoop",
    tagline: "AI Sales Intelligence Platform (RAG)",
    kind: "Work",
    featured: true,
    description:
      "A four-service AI sales-intelligence platform with a FastAPI RAG engine over pgvector and streaming LLM coaching for reps and managers.",
    points: [
      "Architected a four-service sales intelligence platform with a FastAPI retrieval engine, Node.js/TypeScript API, background worker, and React interface, backed by PostgreSQL, pgvector, Redis, and Docker.",
      "Built the document-to-answer pipeline: PDF ingestion with OCR fallback, text chunking, NVIDIA NIM embeddings, vector retrieval, and streamed responses for chat, sales pitches, and creative generation.",
      "Added live call analysis over 45-second transcript windows, using rules to handle clear cases and sending only ambiguous signals to the LLM.",
      "Delivered post-call coaching using account-specific and shared knowledge, with JWT authentication and separate dashboards for sales reps, managers, learning teams, and admins.",
    ],
    tech: ["FastAPI", "pgvector", "PostgreSQL", "Redis", "Docker", "TypeScript", "React", "NVIDIA NIM", "PyMuPDF", "SSE", "JWT"],
  },
  {
    name: "Real Doodle",
    tagline: "Autonomous AI Publishing Pipeline",
    kind: "Work",
    featured: true,
    link: "https://realdoodle.com",
    description:
      "A 5-agent LLM pipeline that researches, writes, optimises and publishes ~9–10 articles a day with zero manual editing.",
    points: [
      "Built a five-agent workflow in n8n and GPT covering research, writing, SEO, quality review, and publishing. It runs every 2.5 hours and publishes about 9–10 articles a day without manual editing.",
      "Grounded articles in live search results and added story deduplication across 60+ national teams to reduce repeated coverage.",
      "Automated image sourcing, WordPress publishing, metadata, categories, and tags in one execution per article, keeping the workflow within a 2,500-execution monthly limit.",
    ],
    tech: ["n8n", "GPT", "LLM Agents", "WordPress", "SEO", "Prompt Engineering"],
  },
  {
    name: "Google Ads Analytics",
    tagline: "CPA Reconciliation Dashboard",
    kind: "Work",
    featured: true,
    description:
      "A Next.js dashboard reconciling reported ad spend against true conversions, providing the source of truth the business runs on.",
    points: [
      "Built a Next.js and React dashboard to reconcile reported ad spend with actual conversions across three markets, replacing daily spreadsheet reconciliation.",
      "Connected Google Ads metrics and daily click-ID reports from Gmail through n8n, using incremental sync to avoid redundant API calls.",
      "Added campaign-level cost-per-acquisition and conversion comparisons, six comparison modes, date filters, Recharts visualizations, and PNG/CSV exports.",
    ],
    tech: ["Next.js", "React", "Recharts", "n8n", "Google Ads API v23", "Gmail API"],
  },
  {
    name: "Lead Qualification & Enrichment",
    tagline: "CRM Routing Automation",
    kind: "Work",
    featured: true,
    description:
      "An end-to-end automation that scores inbound leads and fires instant follow-up, cutting response time from hours to seconds.",
    points: [
      "Connected Facebook Lead Ads to enrichment, CRM updates, and routed follow-up in Make.com, removing manual handoffs between tools.",
      "Scored leads as qualified, warm, or disqualified and triggered instant Twilio SMS and email follow-ups, cutting response time from hours to seconds.",
    ],
    tech: ["Make.com", "Facebook Lead Ads", "Twilio", "CRM"],
  },
  {
    name: "ShipCheck",
    tagline: "Verification gate for AI-generated code",
    period: "Oct 2026",
    kind: "Personal",
    link: "https://parthdevai-shipcheck.static.hf.space",
    description:
      "A verification gate for AI-generated code. It attacks suspected vulnerabilities in a pull request inside a sandbox, fixes what it breaks, re-attacks the fix, and opens a draft PR for a human to merge.",
    points: [
      "On the demo app, ShipCheck confirmed, fixed, and re-verified 4 of 4 planted vulnerabilities: SQL injection, command injection, path traversal, and XSS.",
      "Built the fix engine: Nemotron Super writes a search-and-replace patch from the exploit evidence, the same attack is re-run against the patched code, and the repository's tests must pass. A patch that fails either check is retried with the failure output.",
      "Built the scan orchestrator that chains triage, attack planning, probing, risk scoring, and fixing, running each attack in its own forked sandbox.",
      "Built the GitHub bot that opens a draft pull request with the exploit evidence, only for fixes that passed verification. It never merges.",
      "Built the FastAPI dashboard and a recorded replay of a real scan, so the public demo works without running untrusted code or spending model credits.",
      "Extended the Nemotron Ultra attack planner to read the full source of affected files.",
    ],
    tech: ["Python", "FastAPI", "NVIDIA Nemotron", "Docker", "Pydantic", "Semgrep", "Tavily", "GitHub API"],
  },
  {
    name: "Financial Chatbot",
    tagline: "RAG over finance documents",
    kind: "Personal",
    link: "https://github.com/parth12060/FinAdvisor",
    description:
      "A financial-domain chatbot using a RAG pipeline for accurate, context-aware answers from a document knowledge base.",
    points: [
      "Developed a financial domain chatbot using RAG for accurate, context-aware answers from a document knowledge base.",
      "Built an end-to-end pipeline for PDF ingestion → text chunking → embeddings → semantic retrieval using Chroma DB, indexing finance-related documents.",
      "Built the frontend UI in Next.js + React with a reusable component structure for scalable UI development.",
      "Integrated chatbot APIs using Next.js API routes and implemented secure login via NextAuth.",
    ],
    tech: ["RAG", "Chroma DB", "LangChain", "Next.js", "React", "NextAuth", "Embeddings"],
  },
  {
    name: "Movie Recommendation System",
    tagline: "Similarity-based ML recommender",
    kind: "Personal",
    description:
      "A personalised movie recommender built on similarity-based machine learning with an interactive Streamlit UI.",
    points: [
      "Developed a Movie Recommendation System providing personalised recommendations using similarity-based Machine Learning.",
      "Built an interactive Streamlit UI with a movie selection dropdown, recommendation trigger and results display.",
      "Implemented a Trending Movies carousel UI to enhance the overall user experience.",
      "Integrated the TMDB API to fetch movie posters and metadata for recommended movies.",
      "Performed dataset validation and preprocessing, and generated model artifacts.",
      "Used serialized artifacts for fast inference and optimized loading.",
    ],
    tech: ["Python", "Scikit-learn", "Streamlit", "TMDB API", "Pandas"],
  },
];

// Professional builds belong to the employment history; the project gallery
// holds personal work. Keep a shared source for the portfolio assistant.
export const workProjects = allProjects.filter((project) => project.kind === "Work");
export const projects = allProjects.filter((project) => project.kind !== "Work");

export const experience = [
  {
    company: "Mediallianz Marketing & Digital Media Solutions LLP",
    short: "Mediallianz",
    website: "https://www.mediallianz.com/",
    logo: "/company-logos/mediallianz.png",
    role: "AI Engineer",
    note: "Promoted from AI Engineer Intern (Jan–Jul 2026)",
    period: "Jan 2026 – Present",
    location: "Mumbai, India",
    current: true,
    summary: "Building AI products and automation for sales teams, publishing, marketing analytics, and lead operations.",
    highlights: [
      { name: "PulseLoop", text: "Built a four-service AI sales intelligence platform with document search, streamed answers, and role-based dashboards for sales and learning teams." },
      { name: "Sales coaching", text: "Added live call analysis and post-call coaching, using account-specific knowledge and sending only ambiguous call signals to the LLM." },
      { name: "Real Doodle", text: "Shipped a five-agent publishing pipeline that researches, writes, reviews, and publishes about 9–10 articles a day without manual editing." },
      { name: "Google Ads Analytics", text: "Replaced daily spreadsheet reconciliation with a dashboard comparing ad spend and actual conversions across three markets." },
      { name: "Lead automation", text: "Connected lead capture, enrichment, CRM routing, and Twilio follow-ups, cutting response time from hours to seconds." },
    ],
    tech: [
      "Python", "FastAPI", "Node.js", "TypeScript", "React", "Next.js", "LangChain",
      "pgvector", "PostgreSQL", "Redis", "Docker", "NVIDIA NIM", "PyMuPDF",
      "n8n", "GPT", "AI Agents", "WordPress", "Google Ads API v23", "Twilio", "Postman",
    ],
    projects: workProjects,
    points: workProjects.map((project) => `${project.name}: ${project.description}`),
  },
];

export const skills = [
  {
    group: "AI / ML",
    items: ["Machine Learning", "NLP", "RAG Pipelines", "Embeddings", "LLM Agents", "Recommendation Systems"],
  },
  {
    group: "Frameworks / Libraries",
    items: ["LangChain", "PyTorch", "Scikit-learn", "Hugging Face Transformers"],
  },
  {
    group: "Frontend",
    items: ["React.js", "Next.js", "JavaScript (ES6+)", "HTML5", "CSS3"],
  },
  {
    group: "Backend & Data",
    items: ["Python", "FastAPI", "Node.js", "TypeScript", "SQL", "PostgreSQL", "pgvector", "Chroma DB", "Redis", "Docker"],
  },
  {
    group: "AI Automation",
    items: ["n8n", "Make.com"],
  },
];

export const education = [
  {
    degree: "B.E. Computer Engineering",
    period: "2022–2026",
  },
];

export const about = [
  {
    title: "Who Am I?",
    body: "I'm an AI Engineer building document search, sales intelligence, and agents that research and publish independently. I work across the full product: preparing data, building AI pipelines, and creating interfaces that make the technology easy to use.",
  },
  {
    title: "What Drives Me",
    body: "I'm motivated by seeing something I've built save someone time. I focus on AI grounded in real information and dependable automations that take repetitive work off people's hands. The goal is to make everyday work easier with tools people can trust.",
  },
  {
    title: "Beyond Code",
    body: "Outside of engineering, I love playing acoustic guitar and have taken the LCM Grade 6 Acoustic Guitar exam. I also create AI content on Instagram, sharing what I learn and the ideas that catch my curiosity.",
  },
  {
    title: "Open for Business",
    body: "I'm open to AI engineering opportunities and collaborations. Whether you're exploring an idea or developing a product, I can help connect the AI, backend, and user experience. Let's turn a real problem into something people can rely on.",
  },
];

export const faq = [
  {
    q: "Are you open for job opportunities?",
    a: "Yes. I'm currently an AI Engineer at Mediallianz and I'm open to conversations about building production LLM systems: RAG, agents and automation.",
  },
  {
    q: "What do you actually build?",
    a: "Production LLM systems end to end: RAG pipelines over pgvector and Chroma, real-time signal detection on transcripts, multi-agent publishing pipelines in n8n, and the React/Next.js dashboards on top of them.",
  },
  {
    q: "How can I contact you?",
    a: `The fastest way is email at ${site.email}. You can also find me on Instagram as @parthlodat.ai, or on LinkedIn, GitHub and X.`,
  },
  {
    q: "Where can I see your work?",
    a: "My Experience section covers four platforms built at Mediallianz. The Projects section showcases my personal builds, with demos or source code linked where available.",
  },
];
