import { Section } from "./section";
import { ProjectBrowser } from "./project-browser";
import { SeeAllLink } from "./see-all-link";
import { projects } from "@/lib/data";

/** Projects shown on the homepage; the rest live on /projects. */
const PREVIEW = 2;

export function Projects() {
  return (
    <Section id="projects" eyebrow="Featured" title="Projects">
      <p className="text-secondary-fg mt-2 text-[15px]">
        Personal projects exploring AI, machine learning, and useful interfaces.
      </p>
      <ProjectBrowser limit={PREVIEW} />
      <SeeAllLink href="/projects">
        {projects.length > PREVIEW ? `See all ${projects.length} projects` : "See all projects"}
      </SeeAllLink>
    </Section>
  );
}
