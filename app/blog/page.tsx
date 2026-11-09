import type { Metadata } from "next";
import { BlogFilter } from "@/components/blog-filter";
import { sortedPosts, toListPost } from "@/lib/blog";
import { site } from "@/lib/data";
import { ogDefaults, twitterDefaults } from "@/lib/seo";

const title = `AI Engineering Blog: RAG and LLM Notes | ${site.name}`;
const description =
  "Practical notes on building production LLM systems: debugging RAG pipelines, measuring retrieval quality, and fixing what breaks once AI is live.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${site.url}/blog` },
  openGraph: {
    ...ogDefaults,
    title,
    description,
    url: `${site.url}/blog`,
    type: "website",
    images: [{ url: "/social-preview.png", width: 1200, height: 630, alt: `${site.name} | AI Engineer` }],
  },
  twitter: {
    ...twitterDefaults,
    title,
    description,
    images: ["/social-preview.png"],
  },
};

export default function BlogIndex() {
  return (
    <>
      <header className="fade-in-up pt-10 pb-10 sm:pt-14">
        <h1 className="text-2xl font-bold">Blog</h1>
        <p className="text-secondary-fg mt-1 text-lg">
          Notes on building production AI: RAG, agents, and the parts that only break once something is live.
        </p>
      </header>

      {sortedPosts.length === 0 ? (
        <p className="text-secondary-fg text-[15px]">No posts yet. Check back soon.</p>
      ) : (
        <BlogFilter posts={sortedPosts.map(toListPost)} />
      )}
    </>
  );
}
