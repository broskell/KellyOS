import { useEffect, useRef, useState } from "react";
import "../styles/projects.css";
import { Section } from "./primitives/Section";
import { Reveal } from "./primitives/Reveal";
import AccordionGallery from "./projects/AccordionGallery";
import type { AccordionItem } from "./projects/AccordionGallery";
import { ProjectModal } from "./projects/ProjectModal";
import { projects, type Project26 } from "../data/projects26";

/**
 * Projects (#projects). Selected work as expanding image slats (AccordionGallery);
 * clicking a slat raises the ProjectModal with the stack, description, and links.
 *
 * The accordion is vertical (stacked slats that expand in height); only the
 * sizing changes between mobile and desktop.
 */
export function Projects() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const items: AccordionItem[] = projects.map((p) => ({
    image: p.cover,
    label: p.title,
    tagline: p.tagline,
    alt: `${p.title} — ${p.tagline}`,
  }));

  const active: Project26 | null = openIndex === null ? null : projects[openIndex] ?? null;

  return (
    <Section id="projects" label="Selected projects" className="t26-projects">
      <Reveal>
        <div className="t26-projects__head">
          <span className="t26-eyebrow t26-eyebrow--accent">02 / Work</span>
          <hr className="t26-hairline" />
        </div>
        <p className="t26-projects__intro">
          <span className="t26-muted">Selected work —</span> hover a slat to preview, click to
          open the full case with its stack, links, and write-up.
        </p>
      </Reveal>

      <Reveal className="t26-projects__row" delay={0.05}>
        <div ref={rowRef}>
          <AccordionGallery
            items={items}
            defaultIndex={0}
            onOpen={(i) => setOpenIndex(i)}
            orientation="vertical"
            height={isMobile ? 300 : 520}
            expandRatio={isMobile ? 0.62 : 0.52}
            gap={12}
            radius={16}
          />
        </div>
      </Reveal>

      <ProjectModal project={active} onClose={() => setOpenIndex(null)} />
    </Section>
  );
}
