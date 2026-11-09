import { ArrowUpRight, Instagram } from "lucide-react";
import { socials } from "@/lib/data";

/** Link to the Instagram profile, styled for each place it appears (no hover popup). */
export function InstagramPreview({ inline = false, contact = false }: { inline?: boolean; contact?: boolean }) {
  return (
    <a
      href={socials.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative inline-flex max-w-full items-center focus-visible:outline-2 focus-visible:outline-offset-4 ${contact ? "group gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 text-sm transition-colors hover:border-foreground/20 hover:bg-accent" : inline ? "intro-link gap-2 rounded-md align-baseline" : "mt-3 min-h-11 gap-2 rounded-md text-sm font-medium"}`}
      aria-label="Visit @parthlodat.ai on Instagram (opens in a new tab)"
    >
      {!inline && <Instagram className={`size-4 shrink-0 ${contact ? "text-secondary-fg" : "text-pink-500"}`} aria-hidden="true" />}
      <span className={contact ? "flex-1" : inline ? undefined : "underline decoration-border underline-offset-4"}>{inline ? "Instagram" : "@parthlodat.ai"}</span>
      {!inline && <ArrowUpRight className="size-3.5 text-secondary-fg" aria-hidden="true" />}
    </a>
  );
}
