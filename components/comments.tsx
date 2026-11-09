"use client";

import { useEffect, useRef, useState } from "react";

const themeFor = () =>
  document.documentElement.classList.contains("dark") ? "github-dark" : "github-light";

/**
 * GitHub-issue comments via utterances, configured like ramx.in: one issue per
 * post titled "blog/<slug>". Loads only when the reader scrolls near it, and
 * follows the site's light/dark toggle.
 */
export function Comments({ repo, slug }: { repo: string; slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!near || !el) return;
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("repo", repo);
    script.setAttribute("issue-term", `blog/${slug}`);
    script.setAttribute("theme", themeFor());
    el.replaceChildren(script);

    // Keep the widget in step with the site's theme toggle.
    const mo = new MutationObserver(() => {
      el.querySelector<HTMLIFrameElement>("iframe.utterances-frame")?.contentWindow?.postMessage(
        { type: "set-theme", theme: themeFor() },
        "https://utteranc.es"
      );
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      mo.disconnect();
      el.replaceChildren();
    };
  }, [near, repo, slug]);

  return <div ref={ref} className="min-h-[260px]" />;
}
