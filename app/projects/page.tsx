import type { Metadata } from "next";
import { ProjectBrowser } from "@/components/project-browser";
import { projects, site } from "@/lib/data";
import { ogDefaults, twitterDefaults } from "@/lib/seo";

const title = `AI and Machine Learning Projects | ${site.name}`;
const description =
  "AI projects by Parth Lodat: ShipCheck, a tool that exploits and fixes vulnerabilities in AI-generated code, plus a RAG chatbot and movie recommender.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${site.url}/projects` },
  openGraph: {
    ...ogDefaults,
    title,
    description,
    type: "website",
    url: `${site.url}/projects`,
    images: [{ url: "/social-preview.png", width: 1200, height: 630, alt: `${site.name} | AI Engineer` }],
  },
  twitter: {
    ...twitterDefaults,
    title,
    description,
    images: ["/social-preview.png"],
  },
};

export default function ProjectsPage() {
  return (
    <div className="space-y-8 pt-10 sm:pt-14">
      <header className="fade-in-up space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Projects</h1>
        <p className="text-secondary-fg mx-auto max-w-2xl text-lg">
          Personal projects exploring AI, machine learning, and useful interfaces.
        </p>
      </header>
      <hr className="border-border" />
      <section aria-labelledby="all-projects">
        <h2 id="all-projects" className="text-2xl font-semibold">
          All Projects
          <span className="text-secondary-fg ml-2 text-sm font-normal">
            ({projects.length} {projects.length === 1 ? "project" : "projects"})
          </span>
        </h2>
        <ProjectBrowser />
      </section>
    </div>
  );
}
