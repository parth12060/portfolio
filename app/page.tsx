import { Hero } from "@/components/hero";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { About } from "@/components/about";
import { Education } from "@/components/education";
import { Skills } from "@/components/skills";
import { Blogs } from "@/components/blogs";
import { Faq } from "@/components/faq";
import { Contact } from "@/components/contact";
import type { Metadata } from "next";
import { site, socials } from "@/lib/data";

export const metadata: Metadata = {
  alternates: { canonical: site.url },
};

const profileData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${site.url}/#person`,
  name: site.name,
  jobTitle: site.role,
  description: site.description,
  url: site.url,
  image: `${site.url}/parth-lodat.png`,
  sameAs: [socials.github, socials.linkedin, socials.x, socials.instagram],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileData).replace(/</g, "\\u003c") }} />
      <Hero />
      <Experience />
      <Projects />
      <About />
      <Education />
      <Skills />
      <Blogs />
      <Faq />
      <Contact />
    </>
  );
}
