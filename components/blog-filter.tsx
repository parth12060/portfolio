"use client";

import { useMemo, useState } from "react";
import { BlogList } from "./blog-list";
import type { ListPost } from "@/lib/blog";

/** Tag pills shown before "Show all" (ramx shows the five most-used tags). */
const VISIBLE_TAGS = 5;

export function BlogFilter({ posts }: { posts: ListPost[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [posts]);

  const hidden = tags.length - VISIBLE_TAGS;
  const shown = expanded ? tags : tags.slice(0, VISIBLE_TAGS);
  const filtered = active ? posts.filter((p) => p.tags.includes(active)) : posts;

  return (
    <>
      <div className="fade-in-up flex flex-wrap gap-2" style={{ animationDelay: "0.1s" }} role="group" aria-label="Filter posts by topic">
        <Pill label="All" count={posts.length} selected={active === null} onClick={() => setActive(null)} />
        {shown.map(([tag, count]) => (
          <Pill key={tag} label={tag} count={count} selected={active === tag} onClick={() => setActive(active === tag ? null : tag)} />
        ))}
        {hidden > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="bg-muted text-secondary-fg hover:text-foreground inline-flex h-9 items-center rounded-full px-3.5 text-[15px] transition-colors"
          >
            {expanded ? "Show less" : `${hidden} Show all`}
          </button>
        )}
      </div>

      <div className="mt-10">
        {/* Re-keying replays the rise-in animation when the filter changes. */}
        <BlogList key={active ?? "all"} posts={filtered} />
      </div>
    </>
  );
}

function Pill({
  label,
  count,
  selected,
  onClick,
}: {
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-2.5 rounded-full px-3.5 text-[15px] transition-colors active:scale-[0.98] ${
        selected ? "bg-foreground text-background" : "bg-muted text-secondary-fg hover:text-foreground"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 text-[11px] leading-[18px] tabular-nums ${
          selected ? "bg-background/15" : "bg-background/60"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
