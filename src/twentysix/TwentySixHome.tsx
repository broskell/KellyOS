import { useEffect } from "react";
import "./styles/tokens26.css";
import "./styles/hero.css";
import { useSmoothScroll } from "./motion/scroll";
import { SectionPlaceholder } from "./components/SectionPlaceholder";
import { Section } from "./components/primitives/Section";
import { Reveal } from "./components/primitives/Reveal";
import { ImageWithFallback } from "./components/primitives/ImageWithFallback";
import { Dock } from "./components/Dock";
import { About } from "./components/About";
import { Projects } from "./components/Projects";
import { TechStack } from "./components/TechStack";
import { Contact } from "./components/Contact";
import WarpText from "./components/WarpText";
import LightRays from "./components/LightRays";
import { Socials } from "./components/Socials";

/** Portrait lives in public/content-assets/. ImageWithFallback → "SK" initials
 *  placeholder if the file is absent, so the hero never breaks. */
const PORTRAIT_SRC = "/content-assets/portrait.jpg";

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
      {/* Hero (Chunk 1) — full-bleed split: full-body portrait + headline */}
      <Section id="home" label="Introduction" container="none" className="t26-hero-section">
        {/* Ambient light rays behind everything */}
        <div className="t26-hero__rays" aria-hidden="true">
          <LightRays
            raysOrigin="top-center"
            raysColor="#00ffff"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
          />
        </div>

        <div className="t26-hero">
          <Reveal className="t26-hero__portrait" direction="up">
            <ImageWithFallback
              src={PORTRAIT_SRC}
              alt="Saathvik Kellampalli"
              initials="SK"
              ratio="auto"
              grayscale={false}
              frame={false}
              recover={false}
              eager
              imgClassName="t26-hero__portrait-img"
              style={{ width: "100%", height: "95%" }}
            />
          </Reveal>

          <Reveal className="t26-hero__body" direction="up" delay={0.1}>
            <h1 className="t26-hero__name">
              <WarpText
                text={"Saathvik\nKellampalli"}
                color="#f8f5ff"
                warpStrength={0.08}
                warpScale={1.7}
                speed={0.55}
                pointerInfluence={0.42}
                pointerStrength={0.38}
                refraction={0.018}
                ripple
                fontSize="clamp(4rem, 14vw, 12rem)"
                fontWeight={800}
                style={{ height: "clamp(240px, 24vw, 200px)" }}
              />
            </h1>
            <p className="t26-lead t26-hero__desc">
              Student developer focused on AI, ML, DSA, Linux, and OpenSource, building practical solutions through code and continuous learning.
            </p>
            <Socials className="t26-hero__socials" />
          </Reveal>
        </div>
      </Section>

      <About />
      <Projects />
      <TechStack />
      <SectionPlaceholder
        id="timeline"
        index="04 / Journey"
        title="Timeline"
        note="Curved GSAP path with year nodes (Chunk 2)"
        minH={420}
      />
      <Contact />

      {/* Footer (Chunk 7) — extra bottom space so the fixed dock never overlaps */}
      <Section as="footer" id="footer" label="Footer">
        <hr className="t26-hairline" />
        <Reveal>
          <p
            className="t26-caption"
            style={{ marginTop: "2rem", paddingBottom: "6rem" }}
          >
            © {new Date().getFullYear()} Saathvik Kellampalli · footer + minimal name hover (Chunk 7)
          </p>
        </Reveal>
      </Section>

      {/* Persistent glass dock — bottom nav on every 26' screen */}
      <Dock />
    </div>
  );
}
