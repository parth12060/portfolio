import { Mail, Instagram, MapPin, Github, Linkedin, ArrowUpRight } from "lucide-react";
import { Section } from "./section";
import { Reveal } from "./reveal";
import { site, socials } from "@/lib/data";
import { InstagramPreview } from "./instagram-preview";
import { ContactForm } from "./contact-form";

const links = [
  { label: site.email, href: socials.email, Icon: Mail },
  { label: "@parthlodat.ai", href: socials.instagram, Icon: Instagram, external: true },
  { label: "LinkedIn", href: socials.linkedin, Icon: Linkedin, external: true },
  { label: "GitHub", href: socials.github, Icon: Github, external: true },
];

export function Contact() {
  return (
    <Section id="contact" eyebrow="Get in touch" title="Contact">
      <Reveal>
        <p className="text-secondary-fg mt-2 text-[15px] leading-relaxed">
          Open to opportunities in production AI: RAG systems, LLM agents and
          automation. Tell me about your project and I&apos;ll get back to you.
        </p>
      </Reveal>

      <ContactForm />

      <Reveal>
        <p className="text-secondary-fg mt-8 text-sm">Or reach me directly</p>

        <div className="mt-3 flex items-center gap-2">
          <MapPin className="text-secondary-fg size-4" strokeWidth={1.75} />
          <span className="text-secondary-fg text-sm">{site.location}</span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {links.map(({ label, href, Icon, external }) => href === socials.instagram ? (
            <InstagramPreview key={label} contact />
          ) : (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="border-border bg-card/60 hover:border-foreground/20 hover:bg-accent group flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors"
            >
              <Icon className="text-secondary-fg size-4 shrink-0" strokeWidth={1.75} />
              <span className="flex-1 truncate text-sm">{label}</span>
              <ArrowUpRight
                className="text-secondary-fg size-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </a>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
