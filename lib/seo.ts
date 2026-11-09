import { site, socials } from "./data";

/**
 * Shared Open Graph and Twitter defaults.
 *
 * Next.js replaces, rather than merges, a parent's `openGraph` and `twitter`
 * objects when a page defines its own. Without spreading these in, subpages
 * silently lose og:site_name, og:locale and twitter:creator.
 */
export const ogDefaults = {
  siteName: `${site.name} | ${site.role}`,
  locale: "en_IN",
} as const;

/** "@handle", derived from the X profile URL so it can't drift. */
const xHandle = `@${new URL(socials.x).pathname.replace(/^\/+|\/+$/g, "")}`;

export const twitterDefaults = {
  card: "summary_large_image",
  creator: xHandle,
} as const;
