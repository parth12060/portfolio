import { GraduationCap } from "lucide-react";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { education } from "@/lib/data";

export function Education() {
  return (
    <Section id="education" eyebrow="Academic" title="Education">
      <div className="mt-8 flex flex-col gap-4">
        {education.map((item, i) => (
          <Reveal key={item.degree} delay={i * 70}>
            <div className="border-border bg-card/60 flex items-start gap-4 rounded-xl border p-5">
              <span className="border-border bg-background text-secondary-fg flex size-10 shrink-0 items-center justify-center rounded-full border">
                <GraduationCap className="size-5" strokeWidth={1.75} />
              </span>
              <div className="flex-1">
                <h3 className="font-semibold">{item.degree}</h3>
                <p className="text-secondary-fg mt-2 text-sm">{item.period}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
