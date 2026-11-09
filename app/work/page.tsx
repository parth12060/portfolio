import type { Metadata } from "next";
import { ExperienceList } from "@/components/experience";
import { site } from "@/lib/data";
import { ogDefaults, twitterDefaults } from "@/lib/seo";

const title = `Work Experience: AI Engineer at Mediallianz | ${site.name}`;
const description =
  "Parth Lodat's work as an AI Engineer at Mediallianz in Mumbai: RAG retrieval for sales intelligence, AI content pipelines, and multi-agent automation.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${site.url}/work` },
  openGraph: {
    ...ogDefaults,
    title,
    description,
    type: "website",
    url: `${site.url}/work`,
    images: [{ url: "/social-preview.png", width: 1200, height: 630, alt: `${site.name} | AI Engineer` }],
  },
  twitter: {
    ...twitterDefaults,
    title,
    description,
    images: ["/social-preview.png"],
  },
};

export default function WorkPage() {
  return (
    <>
      <header className="fade-in-up pt-10 sm:pt-14">
        <p className="text-secondary-fg text-sm">My professional journey</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Work</h1>
        <p className="text-secondary-fg mt-4 text-base leading-relaxed md:text-lg">
          Building AI products and automations that make everyday work easier.
        </p>
      </header>
      <section aria-label="Work experience">
        <ExperienceList />
      </section>
    </>
  );
}
