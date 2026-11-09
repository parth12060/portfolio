"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { nav } from "@/lib/data";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b bg-background/70 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="container mx-auto max-w-3xl px-4 py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <nav aria-label="Main navigation" className="flex items-center gap-4 sm:gap-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`inline-flex min-h-11 items-center text-sm transition-colors ${
                  isActive(item.href) ? "text-foreground" : "text-secondary-fg hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
