import { Reveal } from "./reveal";

export function Section({
  id,
  eyebrow,
  title,
  children,
  className = "",
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mt-20 scroll-mt-24 border-t border-border pt-8 ${className}`}>
      <Reveal>
        <p className="text-secondary-fg font-mono text-[10px] uppercase tracking-[0.16em]">{eyebrow}</p>
        <h2 className="editorial-title mt-2 text-[30px] leading-tight sm:text-[34px]">{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}
