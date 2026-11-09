import { site } from "@/lib/data";
import { Signature } from "@/components/signature";

export function Footer() {
  return (
    <footer className="border-border mt-24 border-t py-10">
      <Signature className="text-secondary-fg mx-auto mb-8 block h-8 w-auto" />
      <p className="text-secondary-fg text-[15px] leading-relaxed">
        Build it end to end. Then make it run without you.
      </p>
      <div className="text-secondary-fg mt-6 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span>Designed &amp; developed by {site.name}</span>
        <span>© {new Date().getFullYear()}. All rights reserved.</span>
      </div>
    </footer>
  );
}
