import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { experience } from "@/lib/data";
import { TechnologyList } from "./technology-list";
import { SeeAllLink } from "./see-all-link";

/** How much of each job the homepage preview shows before "Show all work experience". */
const PREVIEW_HIGHLIGHTS = 3;
const PREVIEW_TECH = 10;

/** Homepage preview: one compact card per job, linking to the full /work page. */
export function Experience() {
  return (
    <Section id="experience" eyebrow="My professional journey" title="Work Experience">
      <p className="text-secondary-fg mt-2 text-[15px] leading-relaxed">
        Building AI products and automations that make everyday work easier.
      </p>
      <div className="mt-8 space-y-4">
        {experience.map((job, i) => (
          <Reveal key={job.company} delay={i * 80}>
            <article className="border-border bg-card/60 rounded-xl border p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="border-border flex size-12 shrink-0 items-center justify-center rounded-xl border bg-white p-2.5">
                    <Image src={job.logo} alt={`${job.short} logo`} width={36} height={36} className="size-full object-contain" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                      <h3 className="text-lg font-semibold">{job.short}</h3>
                      {job.current && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-400">
                          <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-secondary-fg mt-0.5 text-[15px]">{job.role}</p>
                  </div>
                </div>
                <div className="text-secondary-fg pl-[60px] text-sm leading-6 sm:shrink-0 sm:pl-0 sm:text-right">
                  <p>{job.period}</p>
                  <p>{job.location}</p>
                </div>
              </div>
              <p className="text-secondary-fg mt-4 text-[15px] leading-relaxed">{job.summary}</p>

              <div className="border-border mt-5 border-t pt-5">
                <h4 className="text-sm font-semibold">Highlights</h4>
                <ul className="mt-3 space-y-3">
                  {job.highlights.slice(0, PREVIEW_HIGHLIGHTS).map((h) => (
                    <li key={h.name} className="text-secondary-fg flex gap-2.5 text-[15px] leading-relaxed">
                      <span className="bg-secondary-fg mt-[9px] size-1 shrink-0 rounded-full" aria-hidden="true" />
                      <span><strong className="text-foreground font-medium">{h.name}.</strong> {h.text}</span>
                    </li>
                  ))}
                </ul>
                {job.highlights.length > PREVIEW_HIGHLIGHTS && (
                  <p className="text-secondary-fg mt-3 text-sm">
                    Also: {job.highlights.slice(PREVIEW_HIGHLIGHTS).map((h) => h.name).join(", ")}
                  </p>
                )}
              </div>

              <div className="mt-5">
                <h4 className="text-sm font-semibold">Tech stack</h4>
                <TechnologyList items={job.tech.slice(0, PREVIEW_TECH)} className="mt-3" />
                {job.tech.length > PREVIEW_TECH && (
                  <p className="text-secondary-fg mt-2 text-sm">+{job.tech.length - PREVIEW_TECH} more on the work page</p>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <SeeAllLink href="/work">Show all work experience</SeeAllLink>
    </Section>
  );
}

/** The job timeline, shared by the homepage section and the /work page. */
export function ExperienceList() {
  return (
      <div className="mt-10 space-y-10">
        {experience.map((job, i) => (
          <Reveal key={job.company} delay={i * 80}>
            <article className="relative min-w-0 sm:pl-16">
              <span className="border-border bg-background absolute left-0 top-1 hidden size-9 items-center justify-center rounded-full border text-sm font-medium sm:flex" aria-hidden="true">
                {i + 1}
              </span>
              <span className="bg-border absolute bottom-0 left-[17px] top-12 hidden w-px sm:block" aria-hidden="true" />

              <header>
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start md:gap-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <a href={job.website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${job.short}'s website`} className="border-border flex size-12 shrink-0 items-center justify-center rounded-xl border bg-white p-2.5 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 sm:size-14">
                      <Image src={job.logo} alt={`${job.short} logo`} width={36} height={36} className="size-full object-contain" />
                    </a>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                        <h3 className="text-lg font-semibold sm:text-xl">{job.short}</h3>
                        {job.current && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-400">
                            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-secondary-fg mt-1 text-[15px]">{job.role}</p>
                    </div>
                  </div>
                  <div className="text-secondary-fg pl-[60px] text-sm leading-6 sm:pl-[68px] md:shrink-0 md:pl-0 md:text-right">
                    <p>{job.period}</p>
                    <p>{job.location}</p>
                  </div>
                </div>
                <p className="text-secondary-fg mt-4 text-sm leading-relaxed">{job.note}</p>
              </header>

              <div className="border-border mt-5 border-t pt-5">
                <h4 className="text-sm font-semibold">Technologies &amp; Tools</h4>
                <TechnologyList items={job.tech} className="mt-3" />
              </div>

              <div className="mt-7">
                <h4 className="text-sm font-semibold">What I&apos;ve done</h4>
                <ul className="mt-3 space-y-3">
                  {job.highlights.map((highlight) => (
                    <li key={highlight.name} className="text-secondary-fg flex gap-2.5 text-[15px] leading-relaxed">
                      <span className="bg-secondary-fg mt-[9px] size-1 shrink-0 rounded-full" aria-hidden="true" />
                      <span><strong className="text-foreground font-medium">{highlight.name}.</strong> {highlight.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <details className="group/details border-border mt-6 border-t">
                <summary className="text-secondary-fg hover:text-foreground flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
                  Explore the project details
                  <ChevronDown className="size-4 shrink-0 transition-transform group-open/details:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
                </summary>
                <div className="space-y-6 pb-3 pt-3">
                  {job.projects.map((project, index) => (
                    <section key={project.name} aria-labelledby={`experience-${i}-project-${index}`}>
                      <h5 id={`experience-${i}-project-${index}`} className="text-base font-semibold">
                        {project.link ? (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4">
                            {project.name}<ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
                          </a>
                        ) : project.name}
                      </h5>
                      <p className="text-secondary-fg mt-1 text-sm">{project.tagline}</p>
                      <ul className="mt-3 space-y-2.5">
                        {project.points.map((point) => (
                          <li key={point} className="text-secondary-fg flex gap-2.5 text-sm leading-relaxed">
                            <span className="bg-secondary-fg mt-2 size-1 shrink-0 rounded-full" aria-hidden="true" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </details>
            </article>
          </Reveal>
        ))}
      </div>
  );
}
