import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Undo2 } from "lucide-react";
import {
  posts,
  sortedPosts,
  getPost,
  formatDate,
  headingId,
  toListPost,
  tocHeadings,
  type BlogBlock,
} from "@/lib/blog";
import { ArticleToc } from "@/components/article-toc";
import { ShareButton } from "@/components/share-button";
import { BlogList } from "@/components/blog-list";
import { site } from "@/lib/data";
import { ogDefaults, twitterDefaults } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

/** Prerender every post so the site stays fully static. */
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: `Not found | ${site.name}` };
  const url = new URL(`/blog/${post.slug}`, site.url).href;
  const images = post.image ? [{ url: new URL(post.image, site.url).href, width: 1200, height: 630, alt: post.imageAlt ?? post.title }] : [];
  return {
    title: `${post.seoTitle ?? post.title} | ${site.name}`,
    description: post.excerpt,
    alternates: { canonical: url },
    authors: [{ name: site.name, url: `${site.url}/#about` }],
    openGraph: {
      ...ogDefaults,
      title: post.title,
      description: post.excerpt,
      type: "article",
      url,
      publishedTime: post.date,
      ...(post.updated ? { modifiedTime: post.updated } : {}),
      authors: [site.name],
      tags: post.tags,
      images,
    },
    twitter: { ...twitterDefaults, title: post.title, description: post.excerpt, images },
  };
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 id={headingId(block.text)} className="font-display relative mt-12 mb-4 scroll-mt-28 text-3xl leading-tight transition-all duration-300 sm:hover:before:absolute sm:hover:before:-left-12 sm:hover:before:text-secondary-fg sm:hover:before:content-['##']">{block.text}</h2>
      );
    case "h3":
      return <h3 id={headingId(block.text)} className="font-display relative mt-8 mb-3 scroll-mt-28 text-2xl leading-tight transition-all duration-300 sm:hover:before:absolute sm:hover:before:-left-16 sm:hover:before:text-secondary-fg sm:hover:before:content-['###']">{block.text}</h3>;
    case "p":
      return (
        <p className="text-secondary-fg mt-4 text-[17px] leading-[1.85]">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul className="mt-4 flex flex-col gap-2">
          {block.items.map((item) => (
            <li
              key={item}
              className="text-secondary-fg flex gap-2.5 text-[17px] leading-relaxed"
            >
              <span
                className="bg-secondary-fg mt-[11px] size-1 shrink-0 rounded-full"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "code":
      return (
        <div tabIndex={0} role="region" aria-label={`${block.lang ?? "Text"} code example`} className="border-border bg-card/60 mt-5 overflow-x-auto rounded-xl border focus-visible:outline-2 focus-visible:outline-offset-4">
          {block.lang && <div className="border-border text-secondary-fg border-b px-4 py-2 font-mono text-xs">{block.lang}</div>}
          <pre className="p-4 text-[13px] leading-relaxed">
            <code className={block.lang ? `language-${block.lang}` : undefined}>{block.code}</code>
          </pre>
        </div>
      );
    case "quote":
      return (
        <blockquote className="border-foreground text-secondary-fg my-6 border-l-4 pl-4 text-[17px] leading-[1.8] italic">
          {block.text}
        </blockquote>
      );
    case "links":
      return (
        <ul className="mt-4 space-y-2 text-[15px]">
          {block.items.map((item) => (
            <li key={item.href}><Link href={item.href} className="decoration-foreground/40 hover:decoration-foreground inline-flex min-h-8 items-center font-medium underline underline-offset-4 transition-colors">{item.label}</Link></li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div tabIndex={0} role="region" aria-label="RAG troubleshooting table" className="border-border mt-6 overflow-x-auto rounded-xl border focus-visible:outline-2 focus-visible:outline-offset-4">
          <table className="w-full text-left text-sm leading-6">
            <thead className="bg-card"><tr>{block.headers.map((header) => <th key={header} scope="col" className="min-w-48 px-4 py-3 font-semibold">{header}</th>)}</tr></thead>
            <tbody>{block.rows.map((row, index) => <tr key={index} className="border-border border-t">{row.map((cell, column) => <td key={column} className="text-secondary-fg px-4 py-3 align-top">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
  }
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const url = new URL(`/blog/${post.slug}`, site.url).href;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    // Point at the homepage Person entity so search engines link the two.
    author: { "@type": "Person", "@id": `${site.url}/#person`, name: site.name, url: `${site.url}/#about` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "en",
    ...(post.image ? { image: [new URL(post.image, site.url).href] } : {}),
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };
  const headings = tocHeadings(post);
  const related = sortedPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => b.tags.filter((t) => post.tags.includes(t)).length - a.tags.filter((t) => post.tags.includes(t)).length)
    .slice(0, 3)
    .map(toListPost);

  return (
    <div className="pt-8 sm:pt-10">
      {[structuredData, breadcrumbs].map((data) => (
        <script key={data["@type"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
      ))}

      <Link
        href="/blog"
        className="hover:bg-accent fade-in-up -ml-2.5 inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium transition-colors"
      >
        <Undo2 className="size-4" aria-hidden="true" />
        Back to Blog
      </Link>

      <article id="article" className="mt-8">
        {post.image && (
          <Image
            src={post.image}
            alt={post.imageAlt ?? post.title}
            width={1200}
            height={630}
            sizes="(max-width: 768px) 100vw, 736px"
            priority
            className="fade-in-up mb-10 h-auto w-full rounded-xl object-cover"
          />
        )}

        <header className="mb-8 space-y-4">
          <h1 className="font-display fade-in-up text-4xl leading-tight lg:text-5xl" style={{ animationDelay: "0.05s" }}>
            {post.title}
          </h1>
          <p className="text-secondary-fg fade-in-up text-xl" style={{ animationDelay: "0.1s" }}>{post.excerpt}</p>
          <div className="fade-in-up flex flex-wrap items-center justify-between gap-4" style={{ animationDelay: "0.15s" }}>
            <div className="text-secondary-fg flex items-center gap-2 text-sm">
              <CalendarDays className="size-5" aria-hidden="true" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <Link href="/#about" rel="author" className="hover:text-foreground transition-colors">{site.name}</Link>
            </div>
            <ShareButton title={post.title} url={url} />
          </div>
          <hr className="border-border !mt-6" />
        </header>

        <div className="article-body">
          {post.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </article>

      <ArticleToc headings={headings} articleId="article" />

      <section aria-labelledby="related-heading" className="border-border mt-16 border-t pt-10">
        {related.length > 0 && (
          <>
            <h2 id="related-heading" className="text-2xl font-bold">Related Posts</h2>
            <div className="mt-6">
              <BlogList posts={related} showTags={false} headingLevel="h3" />
            </div>
          </>
        )}
        <div className={`flex justify-center ${related.length > 0 ? "border-border mt-8 border-t pt-8" : ""}`}>
          {related.length === 0 && <h2 id="related-heading" className="sr-only">More posts</h2>}
          <Link href="/blog" className="bg-foreground text-background inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-opacity hover:opacity-90">
            View All Blogs
          </Link>
        </div>
      </section>
    </div>
  );
}
