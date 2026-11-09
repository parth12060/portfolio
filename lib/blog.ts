/**
 * Blog posts.
 *
 * Published articles are composed from typed content blocks.
 *
 * To publish, append a BlogPost. Everything else follows automatically: the
 * homepage "Featured / Blogs" section (opt in with `featured: true`, max 2),
 * the /blog index, the Popular Tags row, the /blog/[slug] page, and the chat
 * assistant's blog answers.
 *
 *   {
 *     slug: "my-post",              // becomes /blog/my-post
 *     title: "My Post",
 *     excerpt: "One or two sentences for the card.",
 *     date: "2026-08-01",           // ISO; sorted newest-first
 *     tags: ["rag", "postgres"],
 *     featured: true,
 *     body: [
 *       { type: "p", text: "..." },
 *       { type: "h2", text: "..." },
 *       { type: "ul", items: ["...", "..."] },
 *       { type: "code", lang: "sql", code: "SELECT 1;" },
 *       { type: "quote", text: "..." },
 *     ],
 *   }
 *
 * Bodies are typed blocks rather than MDX, so posts stay type-checked and the
 * site stays fully static with no extra build pipeline.
 */

import { ragDebuggingPost } from "./posts/rag-debugging";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; lang?: string; code: string }
  | { type: "quote"; text: string }
  | { type: "links"; items: { label: string; href: string }[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  seoTitle?: string;
  image?: string;
  imageAlt?: string;
  /** ISO date: used for sorting and rendered as a long date. */
  date: string;
  /** ISO date of the last substantive revision. Emitted as dateModified. */
  updated?: string;
  tags: string[];
  featured?: boolean;
  body: BlogBlock[];
};

export const posts: BlogPost[] = [ragDebuggingPost];

export function headingId(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

/* ------------------------------------------------------------------ */

export const blogIntro =
  "Notes on building production LLM systems: retrieval, agents, and the parts that only show up once something is running.";

export const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export const featuredPosts = sortedPosts.filter((p) => p.featured).slice(0, 2);

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

/** Tags ordered by how often they're used. */
export function popularTags(): string[] {
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** ~200 wpm over the rendered body text. */
export function readingMinutes(post: BlogPost): number {
  const words = post.body
    .map((b) =>
      b.type === "ul" ? b.items.join(" ") : b.type === "code" ? "" :
      b.type === "links" ? b.items.map((item) => item.label).join(" ") :
      b.type === "table" ? [...b.headers, ...b.rows.flat()].join(" ") : b.text
    )
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** The serializable slice of a post that list components (client side) need. */
export type ListPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateLabel: string;
  tags: string[];
  image?: string;
};

export function toListPost(post: BlogPost): ListPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    dateLabel: formatDate(post.date),
    tags: post.tags,
    image: post.image,
  };
}

export type TocHeading = { id: string; text: string; level: 2 | 3 };

export function tocHeadings(post: BlogPost): TocHeading[] {
  return post.body.flatMap((b) =>
    b.type === "h2" || b.type === "h3"
      ? [{ id: headingId(b.text), text: b.text, level: b.type === "h2" ? 2 : 3 } as TocHeading]
      : []
  );
}
