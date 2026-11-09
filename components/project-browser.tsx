import { Globe, Github } from "lucide-react";
import { Reveal } from "./reveal";
import { projects } from "@/lib/data";
import { TechnologyList } from "./technology-list";
import { ProjectCover } from "./project-cover";

/** Project cards in the hemantkadam.in style: cover, title with link icons, short description, technologies. */
export function ProjectBrowser({
  headingLevel = 3,
  limit,
}: {
  headingLevel?: 2 | 3;
  /** Show only the first N projects (homepage preview). */
  limit?: number;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const SubHeading = headingLevel === 2 ? "h3" : "h4";
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      {projects.slice(0, limit).map((project, i) => {
        const isGithub = project.link?.includes("github.com");
        return (
          <Reveal key={project.name} delay={(i % 2) * 70}>
            <article className="border-border bg-card group flex h-full flex-col overflow-hidden rounded-xl border transition-shadow duration-200 hover:shadow-md">
              <ProjectCover name={project.name} image={project.image} imageAlt={project.imageAlt} />
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-center justify-between gap-4">
                  <Heading className="text-xl leading-tight font-semibold">{project.name}</Heading>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${isGithub ? "View source for" : "Visit"} ${project.name}`}
                      title={isGithub ? "Source code" : "Live demo"}
                      className="text-secondary-fg hover:text-foreground -m-1.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors"
                    >
                      {isGithub ? <Github className="size-5" aria-hidden="true" /> : <Globe className="size-5" aria-hidden="true" />}
                    </a>
                  )}
                </div>
                <p className="text-secondary-fg line-clamp-3 leading-relaxed">{project.description}</p>
                <div className="mt-auto">
                  <SubHeading className="text-secondary-fg mb-2 text-sm font-medium">Technologies</SubHeading>
                  <TechnologyList items={project.tech} />
                </div>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
