"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { ListPost } from "@/lib/blog";

/**
 * Post list modelled on ramx.in: items rise in one after another, and on wide
 * screens with a mouse, hovering a post blurs the rest and shows its cover in a
 * card that follows the cursor horizontally.
 */
export function BlogList({
  posts,
  showTags = true,
  headingLevel = "h2",
}: {
  posts: ListPost[];
  showTags?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const [canPreview, setCanPreview] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (min-width: 1024px)");
    const update = () => setCanPreview(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div className="blog-list flex flex-col">
      {posts.map((post, i) => (
        <div key={post.slug} className="blog-list-item" style={{ animationDelay: `${i * 0.05}s` }}>
          <BlogListItem post={post} showTags={showTags} Heading={headingLevel} canPreview={canPreview} />
        </div>
      ))}
    </div>
  );
}

function BlogListItem({
  post,
  showTags,
  Heading,
  canPreview,
}: {
  post: ListPost;
  showTags: boolean;
  Heading: "h2" | "h3";
  canPreview: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState(false);
  const [x, setX] = useState(0);
  const showPreview = canPreview && hovered && !!post.image;

  return (
    <article
      ref={ref}
      className="group relative isolate py-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => {
        const box = ref.current?.getBoundingClientRect();
        if (box) setX(Math.min(e.clientX - box.left, box.width - 340));
      }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      >
        <div className="min-w-0 flex-1 space-y-1">
          <Heading className="group-hover:text-foreground text-lg font-semibold leading-tight transition-colors">
            {post.title}
          </Heading>
          <p className="text-secondary-fg line-clamp-2 text-sm">{post.excerpt}</p>
          {showTags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {post.tags.map((t) => (
                <span key={t} className="bg-muted text-secondary-fg inline-flex items-center rounded-md px-2 py-0.5 text-xs">
                  {t}
                </span>
              ))}
            </div>
          )}
          <time dateTime={post.date} className="text-secondary-fg hidden items-center gap-1.5 pt-0.5 text-xs sm:flex">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {post.dateLabel}
          </time>
        </div>
        <div className="flex flex-row items-center justify-between gap-4 sm:contents">
          <time dateTime={post.date} className="text-secondary-fg flex items-center gap-1.5 text-xs sm:hidden">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {post.dateLabel}
          </time>
          <span className="text-secondary-fg group-hover:text-foreground inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm transition-colors">
            Read more<span className="sr-only"> about {post.title}</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </Link>

      {showPreview && (
        <div
          aria-hidden="true"
          className="blog-preview ring-border pointer-events-none absolute top-4 z-[60] mt-[100px] ml-10 overflow-hidden rounded-xl shadow-2xl ring-1"
          style={{ left: Math.max(0, x), transition: "left 0.15s ease-out" }}
        >
          <Image src={post.image!} alt="" width={300} height={158} sizes="300px" className="h-[158px] w-[300px] object-cover" />
        </div>
      )}
    </article>
  );
}
