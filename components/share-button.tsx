"use client";

import { useRef, useState } from "react";
import { Check, Copy, Linkedin, X as Close } from "lucide-react";

const XLogo = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
    <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L2.8 2h6.4l4.4 5.8L18.9 2Zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20Z" />
  </svg>
);

/** "Share" button that opens a dialog with copy-link, X and LinkedIn, like ramx.in. */
export function ShareButton({ title, url }: { title: string; url: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the URL is still selectable in the field */
    }
  };

  const btn =
    "border-border hover:bg-accent inline-flex items-center justify-center gap-1.5 rounded-lg border transition-colors";

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className={`${btn} h-9 px-4 text-sm font-medium`}>
        Share
      </button>
      <dialog
        ref={ref}
        aria-labelledby="share-title"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="share-dialog bg-background text-foreground border-border m-auto w-[min(28rem,calc(100vw-2rem))] rounded-xl border p-6 shadow-2xl"
      >
        <h2 id="share-title" className="text-lg font-semibold">Share this post</h2>
        <p className="text-secondary-fg mt-1 text-sm">“{title}”</p>

        <label htmlFor="share-url" className="mt-5 block text-sm font-medium">Copy link</label>
        <div className="mt-2 flex gap-2">
          <input
            id="share-url"
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            className="border-border bg-card text-secondary-fg h-9 min-w-0 flex-1 rounded-lg border px-3 text-sm"
          />
          <button type="button" onClick={copy} aria-label={copied ? "Link copied" : "Copy link"} className={`${btn} size-9 shrink-0`}>
            {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          </button>
        </div>

        <p className="mt-5 text-sm font-medium">Share on</p>
        <div className="mt-2 flex gap-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btn} h-8 px-3 text-sm`}
          >
            <XLogo /> Twitter / X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btn} h-8 px-3 text-sm`}
          >
            <Linkedin className="size-4" aria-hidden="true" /> LinkedIn
          </a>
        </div>

        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Close"
          className="text-secondary-fg hover:bg-accent hover:text-foreground absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-lg transition-colors"
        >
          <Close className="size-4" aria-hidden="true" />
        </button>
      </dialog>
    </>
  );
}
