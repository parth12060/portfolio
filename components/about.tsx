import { Blocks, Compass, AudioLines, Send, ArrowUpRight } from "lucide-react";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { about } from "@/lib/data";
import { InstagramPreview } from "./instagram-preview";

const cardStyles = [
  { Icon: Blocks, color: "text-sky-500 bg-sky-500/10" },
  { Icon: Compass, color: "text-amber-500 bg-amber-500/10" },
  { Icon: AudioLines, color: "text-violet-500 bg-violet-500/10" },
  { Icon: Send, color: "text-emerald-500 bg-emerald-500/10" },
];

export function About() {
  return (
    <Section id="about" eyebrow="A little about me" title="Who I am">
      <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
        {about.map((item, i) => {
          const { Icon, color } = cardStyles[i];
          return (
            <Reveal key={item.title} delay={(i % 2) * 70} className="about-card-reveal">
              <article className="border-border h-full border-t pt-5">
                <h3 className="flex items-center gap-3 text-lg font-semibold">
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${color}`}><Icon className="size-4" aria-hidden="true" /></span>
                  {item.title}
                </h3>
                <p className="text-secondary-fg mt-4 text-[15px] leading-7">
                  {item.body}
                </p>
                {i === 2 && <InstagramPreview />}
                {i === 3 && (
                  <a href="#contact-form" data-contact-topic="A project" className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium underline decoration-border underline-offset-4 hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-4">
                    Let&apos;s talk about your project <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
