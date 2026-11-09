import { Section } from "./section";
import { BlogList } from "./blog-list";
import { SeeAllLink } from "./see-all-link";
import { sortedPosts, toListPost } from "@/lib/blog";

export function Blogs() {
  const latest = sortedPosts.slice(0, 3);
  return (
    <Section id="blogs" eyebrow="Notes from the workbench" title="Blogs">
      <p className="text-secondary-fg mt-2 text-[15px]">
        {latest.length ? "Things I've built, lessons I've learned, and ideas worth sharing." : "No posts yet. Writing is on the way."}
      </p>
      {latest.length > 0 && (
        <div className="mt-4">
          <BlogList posts={latest.map(toListPost)} showTags={false} headingLevel="h3" />
        </div>
      )}
      <SeeAllLink href="/blog">{latest.length ? "See all blogs" : "Visit the blog"}</SeeAllLink>
    </Section>
  );
}
