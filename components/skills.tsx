import { Section } from "./section";
import { Reveal } from "./reveal";
import { skills } from "@/lib/data";
import { TechnologyList } from "./technology-list";

export function Skills() {
  return (
    <Section id="skills" eyebrow="Technical" title="Skills">
      <div className="mt-8 flex flex-col gap-6">
        {skills.map((group, i) => (
          <Reveal key={group.group} delay={i * 60}>
            <div>
              <p className="text-secondary-fg text-xs tracking-widest uppercase">
                {group.group}
              </p>
              <TechnologyList items={group.items} className="mt-3" />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
