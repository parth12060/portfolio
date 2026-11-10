import Script from "next/script";
import { site } from "@/lib/data";

/**
 * Google Analytics 4 via the Google tag, exactly as Analytics → "Set up a Google tag" gives it.
 * Loads after the page is interactive so it never slows the first paint.
 * Page views on client-side navigation are tracked by GA4's enhanced measurement
 * ("page changes based on browser history events", on by default).
 * Renders nothing until site.gaId holds a real tag ID, and nothing in local dev.
 */
export function GoogleAnalytics() {
  const id = site.gaId;
  if (!/^(GTM|G)-[A-Z0-9]+$/.test(id) || process.env.NODE_ENV !== "production") return null;

  // GTM-… is the new Google tag (gtm.js); G-… is a classic Measurement ID (gtag.js + config).
  const isGoogleTag = id.startsWith("GTM-");
  const src = isGoogleTag
    ? `https://www.googletagmanager.com/gtm.js?id=${id}`
    : `https://www.googletagmanager.com/gtag/js?id=${id}`;
  const init =
    "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());" +
    (isGoogleTag ? "" : `gtag('config','${id}');`);

  return (
    <>
      <Script src={src} strategy="afterInteractive" />
      <Script id="google-tag" strategy="afterInteractive">
        {init}
      </Script>
    </>
  );
}
