# Parth Lodat Portfolio

Next.js 15 App Router, React 19, Tailwind CSS 4, and TypeScript.

## Development

```sh
npm install
npm run dev -- --hostname 127.0.0.1 --port 3001
```

Open http://127.0.0.1:3001.

## Production

```sh
npm run build
npm start
```

Content pages are prerendered. Use a Next.js-compatible host such as Vercel or a Node server; the current project is not configured for deployment to a generic static-file host, and it uses Next.js image optimization.

## Content

- `lib/data.ts`: profile, social links, work experience, projects, skills, education, about text, and FAQs.
- `lib/blog.ts`: article types, index, dates, and reading-time helpers.
- `lib/posts/`: individual articles, currently the RAG debugging guide.
- `public/Parth_Lodat_Resume.pdf`: downloadable résumé.
- `public/instagram-profile-header.png`: static Instagram preview snapshot; it does not update followers or posts automatically.
- `app/globals.css`: colors, typography, themes, and interaction styling.

The homepage shows personal projects; work projects are explained within the experience section. Blog content drives the homepage preview, blog index, article pages, sitemap, and assistant responses.

## Website checks

```sh
npm run typecheck
npm test
npm run audit:seo -- --base http://127.0.0.1:3001
```

The SEO crawl requires Python 3 and a running local server. It reads the sitemap, checks metadata and links, verifies image responses, and tests missing-page behavior. Results are written to `/tmp/portfolio-seo-audit.json` by default; use `--output` to choose another destination.

For production testing without interrupting development:

```sh
NEXT_DIST_DIR=.next-audit npm run build
NEXT_DIST_DIR=.next-audit npm run start -- --hostname 127.0.0.1 --port 3002
```

See `reports/website-audit.md` for the tested scope, fixes, evidence, and outstanding launch checks.

## Before publishing

A public domain has not been selected. The existing `site.url` value, `https://parthlodat.in`, is a placeholder. Set it to the chosen domain before deploying; canonical URLs, sitemap entries, structured data, and absolute sharing-image URLs depend on it. Update the domain text embedded in the social and article artwork too.

Then verify public HTTPS, redirects, indexing access, and performance, and submit the sitemap through Google Search Console.

## Portfolio assistant

`lib/chat-engine.ts` matches questions to predefined intents and builds answers from the site's data. It uses no language model or API key. It can select an irrelevant intent, so it should not be described as infallible; unknown questions receive a fallback response. `scripts/check-chat.cjs` covers important matching and cross-page navigation cases.
