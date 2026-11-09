import { ChevronDown } from "lucide-react";
import { Reveal } from "./reveal";
import { Section } from "./section";
import { faq } from "@/lib/data";

export function Faq() {
  return (
    <Section id="faq" eyebrow="Questions" title="FAQ">
      <div className="mt-8 flex flex-col gap-2">
        {faq.map((item, i) => (
          <Reveal key={item.q} delay={i * 50}>
            <details className="group border-border bg-card/60 rounded-xl border px-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-medium">
                {item.q}
                <ChevronDown
                  className="text-secondary-fg size-4 shrink-0 transition-transform group-open:rotate-180"
                  strokeWidth={2}
                />
              </summary>
              <p className="text-secondary-fg pb-4 text-[15px] leading-relaxed">
                {item.a}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
