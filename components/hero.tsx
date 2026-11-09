import { FileText, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { site, socials } from "@/lib/data";
import { ProfilePhoto } from "./profile-photo";
import { InstagramPreview } from "./instagram-preview";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialLinks = [
  { href: socials.x, label: "X (Twitter)", Icon: XIcon },
  { href: socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: socials.github, label: "GitHub", Icon: Github },
  { href: socials.email, label: "Email", Icon: Mail },
];

export function Hero() {
  return (
    <section id="top" className="animate-fade-in-blur pt-12 sm:pt-20">
      <div className="flex items-center gap-5">
        <ProfilePhoto size={76} priority className="border-2" />
        <div>
          <p className="text-signature font-mono text-[10px] uppercase tracking-[0.16em]">AI engineer · Mumbai, India</p>
          <h1 className="editorial-title mt-2 text-4xl leading-tight sm:text-5xl">Hey, I&apos;m Parth.</h1>
        </div>
      </div>

      <div className="text-secondary-fg mt-8 space-y-5 text-base leading-8 sm:text-[17px]">
        <p>
          I&apos;m an AI engineer who likes figuring things out and building something
          useful along the way. These days, that means working with AI, connecting
          data, agents, and interfaces to make everyday work a little easier.
        </p>
        <p>
          At <a href="#experience" className="intro-link">Mediallianz</a>, I build
          tools that help sales teams find answers, turn ideas into published
          articles, and take repetitive tasks off people&apos;s plates. I enjoy
          working across the whole product, from the AI behind it to the details
          someone clicks on.
        </p>
        <p>
          Away from the keyboard, I&apos;m usually playing acoustic guitar or sharing
          what I&apos;m learning about AI on <InstagramPreview inline />. I also make
          time for <a href="#projects" className="intro-link">personal projects</a>,
          where curiosity gets to decide what I build next.
        </p>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
        <a
          href="#contact-form"
          data-contact-topic="A project"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-signature"
        >
          Let&apos;s talk <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
        <a
          href={site.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary-fg hover:text-foreground inline-flex min-h-11 items-center gap-2 text-sm transition-colors"
        >
          <FileText className="size-4" strokeWidth={1.75} />
          Resume / CV
        </a>
        <div className="flex items-center gap-1 sm:ml-auto">
          {socialLinks.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-secondary-fg hover:text-signature inline-flex size-11 items-center justify-center rounded-lg transition-colors"
            >
              <Icon className="size-[18px]" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
