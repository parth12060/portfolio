import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/data";
import { ogDefaults, twitterDefaults } from "@/lib/seo";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Oneko } from "@/components/oneko";
import { ChatWidget } from "@/components/chat-widget";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

// Blog article titles and headings, matching ramx.in.
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
  display: "swap",
});

const homeTitle = `${site.name} | AI Engineer Building RAG and LLM Systems`;
const homeDescription =
  "AI Engineer in Mumbai building production LLM systems: RAG pipelines, real-time signal detection, and multi-agent automation with Python and Next.js.";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#100f0f" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: homeTitle,
  description: homeDescription,
  keywords: [
    "Parth Lodat",
    "AI Engineer",
    "RAG",
    "LLM Agents",
    "LangChain",
    "Next.js",
    "Machine Learning",
    "Mumbai",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    ...ogDefaults,
    title: homeTitle,
    description: homeDescription,
    type: "website",
    url: site.url,
    images: [{ url: "/social-preview.png", width: 1200, height: 630, alt: "Parth Lodat, AI Engineer. RAG, agents, and automation." }],
  },
  twitter: {
    ...twitterDefaults,
    title: homeTitle,
    description: homeDescription,
    images: ["/social-preview.png"],
  },
};

const themeScript = `
(function(){
  document.documentElement.classList.add('js');
  try {
    var t = localStorage.getItem('theme');
    var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (t === 'dark' || (!t && d)) document.documentElement.classList.add('dark');
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${hanken.variable} ${instrument.variable} antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-3 focus:text-foreground">Skip to content</a>
        <Nav />
        <main id="main-content" tabIndex={-1} className="container mx-auto max-w-3xl px-4 pb-8">
          {children}
          <Footer />
        </main>
        <Oneko />
        <ChatWidget />
      </body>
    </html>
  );
}
