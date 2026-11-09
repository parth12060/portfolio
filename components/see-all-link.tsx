import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Centered "See all" button that closes each homepage preview section. */
export function SeeAllLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 flex justify-center">
      <Link
        href={href}
        className="group border-border bg-card/60 hover:bg-accent inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors"
      >
        {children}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
      </Link>
    </div>
  );
}
