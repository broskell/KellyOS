import { useEffect, useState } from "react";
import "../styles/techstack.css";
import { Section } from "./primitives/Section";
import { Reveal } from "./primitives/Reveal";
import { TechSphere } from "./tech/TechSphere";
import { SkillModal } from "./tech/SkillModal";
import { GitHubGraph } from "./tech/GitHubGraph";
import { LeetCodeGraph } from "./tech/LeetCodeGraph";
import { prefersReducedMotion } from "../../motion/duration";
import { type Tech } from "../data/tech";

/**
 * Tech Stack (#techstack). Two columns:
 *  · Left  — the tech logos as either an interactive sphere or a plain grid
 *            (toggle below); clicking a logo raises a popup with that skill's
 *            evidence-tier "range" bar (<SkillModal/>). No panel until clicked.
 *  · Right — the live GitHub contribution graph, with the LeetCode graph below.
 *
 * The grid view is the recruiter-friendly "scan everything at once" mode. On
 * touch / reduced-motion the sphere isn't offered — it's always the grid.
 */
export function TechStack() {
  const [active, setActive] = useState<Tech | null>(null);
  const [view, setView] = useState<"globe" | "grid">("globe");
  const [canGlobe, setCanGlobe] = useState(true);

  // The sphere is only offered on non-touch, motion-OK viewports.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const sync = () => setCanGlobe(!mq.matches && !prefersReducedMotion());
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const mode: "globe" | "grid" = canGlobe && view === "globe" ? "globe" : "grid";

  return (
    <Section id="techstack" label="Tech stack" className="t26-techstack">
      <Reveal>
        <div className="t26-techstack__head">
          <span className="t26-eyebrow t26-eyebrow--accent">03 / Stack</span>
          <hr className="t26-hairline" />
        </div>
        <p className="t26-techstack__intro">
          <span className="t26-muted">Tools of the trade —</span> click any logo to see how
          strong the evidence behind that skill is. Prefer a quick scan?{" "}
          <span className="t26-muted">Switch to the grid.</span> Contribution activity is pulled
          live from GitHub and LeetCode.
        </p>
      </Reveal>

      <div className="t26-techstack__grid">
        <Reveal className="t26-techstack__left" delay={0.05}>
          <TechSphere mode={mode} selectedId={active?.id ?? null} onSelect={setActive} />

          {canGlobe && (
            <div
              className="t26-techview"
              role="group"
              aria-label="Choose how to view the tech stack"
            >
              <button
                type="button"
                className={"t26-techview__btn" + (view === "globe" ? " is-active" : "")}
                aria-pressed={view === "globe"}
                onClick={() => setView("globe")}
              >
                Globe
              </button>
              <button
                type="button"
                className={"t26-techview__btn" + (view === "grid" ? " is-active" : "")}
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
              >
                Grid
              </button>
            </div>
          )}
        </Reveal>

        <Reveal className="t26-techstack__right" delay={0.1}>
          <GitHubGraph />
          <LeetCodeGraph />
        </Reveal>
      </div>

      <SkillModal tech={active} onClose={() => setActive(null)} />
    </Section>
  );
}
