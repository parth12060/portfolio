"use client";

import { useCallback, useEffect, useState } from "react";
import type { TocHeading } from "@/lib/blog";

const RING = 2 * Math.PI * 16; // circumference of the r=16 progress circle

/**
 * Floating table of contents modelled on ramx.in. Collapsed, it is a pill showing
 * the current section (rolling like a ticker) and a reading-progress ring.
 * Clicking it expands a panel listing every heading, over a blurred page.
 */
export function ArticleToc({ headings, articleId }: { headings: TocHeading[]; articleId: string }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id));
    const onScroll = () => {
      const article = document.getElementById(articleId);
      if (article) {
        const start = article.offsetTop;
        const end = start + article.offsetHeight - window.innerHeight;
        setProgress(Math.min(1, Math.max(0, (window.scrollY - start + 200) / Math.max(1, end - start + 200))));
      }
      let current = 0;
      els.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < 240) current = i;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings, articleId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const goTo = useCallback((id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }, []);

  if (headings.length === 0) return null;

  const current = (
    <div className="flex min-w-0 flex-1 items-center justify-center gap-3 overflow-hidden">
      <span className="size-2 shrink-0 rounded-full bg-white" aria-hidden="true" />
      <div className="relative h-5 min-w-0 flex-1 overflow-hidden" aria-live="polite">
        <div
          className="absolute top-0 left-0 w-full transition-transform duration-300 ease-out"
          style={{ transform: `translateY(-${active * 20}px)` }}
        >
          {headings.map((h, i) => (
            <div key={h.id} className="flex h-5 min-w-0 items-center text-[13px] font-medium text-white" aria-hidden={i !== active}>
              <span className="block w-full truncate">{h.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ring = (
    <div className="relative mr-1 size-7 shrink-0" aria-hidden="true">
      <svg className="size-full -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="none" className="stroke-white/30" strokeWidth="4" />
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-white transition-[stroke-dashoffset] duration-150"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={RING}
          strokeDashoffset={RING * (1 - progress)}
        />
      </svg>
    </div>
  );

  return (
    <>
      {/* Soft fade at the bottom edge so text scrolls under the pill. */}
      <div
        aria-hidden="true"
        className="from-background pointer-events-none fixed inset-x-0 bottom-0 z-10 h-[60px] bg-gradient-to-t to-transparent backdrop-blur-[5px] [mask-image:linear-gradient(to_top,black_50%,transparent)]"
      />

      {open && (
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="fade-in fixed inset-0 z-[99] bg-black/10 backdrop-blur-[4px]"
        />
      )}

      <nav
        aria-label="Table of contents"
        className={`fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 ${open ? "max-w-[calc(100vw-2rem)]" : "max-w-[calc(100vw-9rem)] sm:max-w-none"} overflow-hidden bg-[#09090B] shadow-2xl ring-1 ring-white/10 transition-[width,border-radius,opacity,transform] duration-300 ease-out dark:bg-[#1a1a1a] fade-in-up`}
        style={{ width: open ? 400 : 280, borderRadius: open ? 24 : 30 }}
      >
        {open ? (
          <div className="relative w-full p-3">
            <div className="flex flex-col pb-12">
              <p className="mb-2 shrink-0 px-2 text-xs font-semibold tracking-wider text-white/40 uppercase">Table of Contents</p>
              <ol className="toc-scrollbar flex max-h-[min(400px,60vh)] flex-col gap-1 overflow-y-auto pr-2">
                {headings.map((h, i) => (
                  <li key={h.id}>
                    <button
                      type="button"
                      onClick={() => goTo(h.id)}
                      aria-current={i === active ? "location" : undefined}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        i === active
                          ? "bg-white/10 text-white"
                          : `hover:bg-white/5 hover:text-white ${h.level === 3 ? "text-white/40" : "text-white/60"}`
                      }`}
                      style={{ paddingLeft: h.level === 3 ? "1.5rem" : "0.75rem" }}
                    >
                      <span className="min-w-0 flex-1 truncate">{h.text}</span>
                      {i === active && <span className="ml-2 size-1.5 shrink-0 rounded-full bg-white" aria-hidden="true" />}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close table of contents"
              className="absolute bottom-0 left-0 flex h-[50px] w-full items-center justify-between gap-3 border-t border-white/5 p-3"
            >
              {current}
              {ring}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={false}
            aria-label={`Table of contents. Current section: ${headings[active]?.text}`}
            className="flex h-12 w-full items-center justify-between gap-3 px-4"
          >
            {current}
            {ring}
          </button>
        )}
      </nav>
    </>
  );
}
