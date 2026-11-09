# Portfolio website audit

Completed November 9, 2026. Scope: the local development site and an isolated production build. Nothing was deployed publicly.

## Result

The local site passes the checks below after fixes. This is a technical readiness audit, not a guarantee of search rankings, a full WCAG certification, or a real-user performance measurement.

| Check | Result |
| --- | --- |
| Production build and TypeScript | Passed; all four content routes prerender |
| Homepage, Projects, blog index, RAG article | All return HTTP 200 |
| Main headings and metadata | One H1, unique title, description, canonical URL, and social image on every content page |
| Structured data | Homepage Person and article BlogPosting JSON parse correctly and describe the visible content |
| Internal paths | Five distinct linked paths checked, including the résumé PDF; no failed responses |
| Images and metadata assets | 18 distinct asset URLs checked; no failed responses |
| Anchor links and IDs | No broken static section links or duplicate IDs |
| Missing pages | Unknown general and blog routes return HTTP 404 with noindex |
| Sitemap and robots | Both return HTTP 200; all four content routes appear in the sitemap |
| Favicons | SVG icon and ICO favicon available |
| Responsive layout | All four content pages checked at 320px, 768px, and 1280px; no document overflow detected. Article also inspected at 375px |
| Browser console | No warnings or errors observed during the production page sweep |
| Image and button labels | No missing image alt attributes or unnamed buttons in the tested production DOM |
| Text contrast | Main, secondary, and accent colors on their standard backgrounds passed 4.5:1 in both themes; lowest tested pair was 5.26:1 |
| External links | Eight returned HTTP 200; LinkedIn returned its automated-access response, HTTP 999, so its profile was not independently verified |

## Interaction checks

- Navigation links and section destinations resolve.
- Experience details, project highlights, and FAQ disclosures open with the keyboard.
- Article contents expand and link to the correct headings.
- The assistant answers a blog question and an experience question.
- Its experience link now navigates from an article back to the homepage section.
- Escape closes the assistant and returns focus to its launcher.
- Light mode survives a reload; the theme can be switched back.
- The long Hugging Face Transformers badge expands within a 320px viewport.
- The Instagram preview opens on keyboard focus and remains within the mobile viewport. Its destination is the supplied Instagram profile. The preview is a static snapshot, not a live feed.

## Issues fixed

1. Added homepage and Projects canonical URLs.
2. Added site metadata base, consistent social-preview images, and page-specific Projects sharing metadata.
3. Added homepage Person structured data using existing profile information.
4. Added SVG and ICO favicons.
5. Corrected project heading levels on the standalone Projects page.
6. Added a keyboard skip link and increased theme-toggle and project-disclosure target sizes.
7. Restored keyboard focus after closing the assistant and added visible input focus styling.
8. Corrected assistant section links that previously broke when used from blog pages.
9. Fixed the assistant's singular post count.
10. Replaced the unavailable lint command with an explicit type-check command and added repeatable chat and SEO checks.

## Performance evidence and limits

The optimized Next.js build reports first-load JavaScript of approximately 139 kB for the homepage, 135 kB for Projects, 112 kB for the blog index, and 111 kB for the article. These are build-reported bundle figures, not Lighthouse scores or Core Web Vitals.

No Lighthouse score, throttled-device benchmark, LCP/INP/CLS field assessment, screen-reader audit, or full cross-browser matrix was completed. Desktop and responsive checks used the available in-app browser. HTTP 200 on an external social link does not establish that every visitor can access the underlying profile without signing in.

## Before public launch

The owner has not chosen a domain. `https://parthlodat.in` remains the existing placeholder in `lib/data.ts`; its use in canonical URLs and sitemap entries was checked for consistency, not ownership or availability.

Before deployment:

1. Choose the real public domain and update `site.url` in `lib/data.ts`.
2. Update domain text in the share-image artwork and article cover, then regenerate their PNG files.
3. Deploy through a Next.js-compatible host and verify HTTPS, redirects, public images, robots.txt, and sitemap.xml.
4. Run the crawl against that deployment, validate structured data with Google's Rich Results Test, and submit the sitemap through Search Console.
5. Measure mobile performance on the deployed site and monitor real-user Core Web Vitals when sufficient traffic exists.

The current local tests cannot establish Google indexing, ranking, traffic growth, or public-domain configuration.

## Repeat the checks

```sh
npm run typecheck
npm test
npm run audit:seo -- --base http://127.0.0.1:3001
```

For an isolated production audit, use separate terminals:

```sh
NEXT_DIST_DIR=.next-audit npm run build
NEXT_DIST_DIR=.next-audit npm run start -- --hostname 127.0.0.1 --port 3002
npm run audit:seo -- --base http://127.0.0.1:3002
```

The crawl uses Python 3's standard library and derives content routes from sitemap.xml. The assistant tests verify intent matching, cross-page links, fallback behavior, and singular post wording.

## Sources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Article structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/article)

Machine-readable evidence: `seo-crawl.json` and `external-links.json` in this folder.
