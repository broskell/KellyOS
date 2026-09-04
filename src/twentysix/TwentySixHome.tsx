import { useEffect } from "react";
import "./styles/tokens26.css";
import { useSmoothScroll } from "./motion/scroll";
import { SectionPlaceholder } from "./components/SectionPlaceholder";
import { Section } from "./components/primitives/Section";
import { Reveal } from "./components/primitives/Reveal";

/**
 * Kelly.OS 2026 — the modern minimalist portfolio, landing target of the 96'→26'
 * transition (route /2026). Single page, smooth scroll.
 *
 * Chunk 0: design-system foundation + section slots in final order. Each slot is
 * replaced by its real section / sent 21st component in later chunks:
 *   Hero(1) · About(2) · Projects(3) · TechStack(4) · Timeline(5) · Contact(6) · Footer(7)
 */
export function TwentySixHome() {
  useSmoothScroll(true);

  // Paint the page canvas black behind the era root (avoid retro base bleeding
  // through on overscroll), restore on unmount back to the 96' desktop.
  useEffect(() => {
    const html = document.documentElement;
    const prevHtml = html.style.background;
    const prevBody = document.body.style.background;
    html.style.background = "#070707";
    document.body.style.background = "#070707";
    // Release the retro app's fixed-viewport lock so the page can scroll.
    html.setAttribute("data-era26-active", "");
    return () => {
      html.style.background = prevHtml;
      document.body.style.background = prevBody;
      html.removeAttribute("data-era26-active");
    };
  }, []);

  return (
    <div data-era26="" className="t26-root">
      {/* Hero (Chunk 1) — full-viewport intro */}
      <Section id="home" label="Introduction" container="none">
        <div className="t26-container" style={{ minHeight: "78vh", display: "flex", alignItems: "center" }}>
          <Reveal>
            <p className="t26-eyebrow">Kelly.OS · 2026 edition</p>
            <h1 className="t26-display" style={{ marginTop: "0.75rem" }}>
              Saathvik
              <br />
              Kellampalli
            </h1>
            <p className="t26-lead" style={{ marginTop: "1.5rem", maxWidth: "48ch" }}>
              Developer &amp; designer. This is the minimalist edition — the 1996 desktop was
              chapter one.
            </p>
            <p className="t26-caption" style={{ marginTop: "2rem" }}>
              hero · portrait + particle text · socials + resume — arriving next
            </p>
          </Reveal>
        </div>
      </Section>

      <SectionPlaceholder
        id="about"
        index="01 / About"
        title="About me"
        note="Rotated cards, scroll-in from the right · education + CGPA (Chunk 2)"
      />
      <SectionPlaceholder
        id="projects"
        index="02 / Work"
        title="Selected projects"
        note="Expanding slats → modal with stack, live, repo, description (Chunk 3)"
        minH={360}
      />
      <SectionPlaceholder
        id="techstack"
        index="03 / Stack"
        title="Tech stack"
        note="Rotating globe → skill bars · GitHub + LeetCode graphs (Chunk 4)"
        minH={360}
      />
      <SectionPlaceholder
        id="timeline"
        index="04 / Journey"
        title="Timeline"
        note="Curved GSAP path with year nodes (Chunk 2)"
        minH={420}
      />
      <SectionPlaceholder
        id="contact"
        index="05 / Contact"
        title="Get in touch"
        note="Contact component (Chunk 7)"
      />

      {/* Footer (Chunk 7) */}
      <Section as="footer" id="footer" label="Footer">
        <hr className="t26-hairline" />
        <Reveal>
          <p className="t26-caption" style={{ marginTop: "2rem" }}>
            © {new Date().getFullYear()} Saathvik Kellampalli · footer + minimal name hover (Chunk 7)
          </p>
        </Reveal>
      </Section>
    </div>
  );
}
