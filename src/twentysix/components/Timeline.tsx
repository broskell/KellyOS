import { useEffect, useRef } from "react";
import gsap from "gsap";
import "../styles/timeline.css";
import { Section } from "./primitives/Section";
import { Reveal } from "./primitives/Reveal";
import { WavePath } from "@/components/ui/wave-path";
import { registerScroll } from "../motion/scroll";
import { prefersReducedMotion } from "../../motion/duration";
import { timeline } from "../data/timeline26";

/**
 * Timeline (#timeline) — "The Story So Far".
 *
 * An alternating vertical timeline:
 *   story1 (left)
 *         |
 *         . story 2 (right)
 *         |
 *   story3 (left)
 *
 * Each story card is topped by the interactive `WavePath` line.
 */
export function Timeline() {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerScroll();
    const stack = stackRef.current;
    if (!stack) return;
    const phases = Array.from(stack.querySelectorAll<HTMLElement>(".t26-tl-phase"));

    if (prefersReducedMotion()) {
      gsap.set(phases, { opacity: 1, y: 0, x: 0 });
      return;
    }

    const cleanups: Array<() => void> = [];
    phases.forEach((phase, index) => {
      const isLeft = index % 2 === 0;
      const xOffset = isLeft ? -36 : 36;
      const tw = gsap.fromTo(
        phase,
        { opacity: 0, y: 40, x: window.innerWidth > 768 ? xOffset : 0 },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: phase, start: "top 85%", once: true },
        },
      );
      cleanups.push(() => {
        tw.scrollTrigger?.kill();
        tw.kill();
      });
    });

    return () => cleanups.forEach((fn) => fn && fn());
  }, []);

  return (
    <Section id="timeline" label="Timeline" container="none" className="t26-tl">
      <div className="t26-container">
        <Reveal>
          <div className="t26-tl__head">
            <span className="t26-eyebrow t26-eyebrow--accent">04 / Journey</span>
            <hr className="t26-hairline" />
          </div>
          <h2 className="t26-tl__title">The Story So Far</h2>
          <p className="t26-lead t26-tl__sub">
            My timeline — drag any line to feel it flex.
          </p>
        </Reveal>
      </div>

      <div className="t26-tl__timeline" ref={stackRef}>
        {/* Central vertical line axis */}
        <div className="t26-tl-line" aria-hidden="true" />

        {timeline.map((e, index) => {
          const isLeft = index % 2 === 0;

          return (
            <article
              key={e.id}
              className={`t26-tl-phase ${isLeft ? "t26-tl-phase--left" : "t26-tl-phase--right"}`}
              aria-label={`${e.date} — ${e.title}`}
            >
              {/* Central node dot on the timeline axis */}
              <div className="t26-tl-node-wrapper" aria-hidden="true">
                <div className={`t26-tl-node ${e.ongoing ? "t26-tl-node--ongoing" : ""}`}>
                  {e.ongoing && <span className="t26-tl-node__pulse" />}
                </div>
              </div>

              {/* Story card content */}
              <div className="t26-tl-phase__card">
                <div className="t26-tl-phase__wave" aria-hidden="true">
                  <WavePath className="t26-tl-phase__line" />
                </div>

                <header className="t26-tl-phase__head">
                  <span className="t26-tl-phase__date">
                    {e.ongoing && (
                      <span className="t26-tl-phase__pulse" aria-hidden="true" />
                    )}
                    {e.date}
                  </span>
                  <h3 className="t26-tl-phase__title">{e.title}</h3>
                  {e.subtitle && (
                    <p className="t26-tl-phase__subtitle">{e.subtitle}</p>
                  )}
                  {e.meta && <p className="t26-tl-phase__meta">{e.meta}</p>}
                </header>

                <div className="t26-tl-phase__groups">
                  {e.groups.map((g, gi) => (
                    <div key={g.heading ?? gi} className="t26-tl-group-block">
                      <div className="t26-tl-group">
                        {g.heading && (
                          <p className="t26-tl-group__heading">{g.heading}</p>
                        )}
                        <ul className="t26-tl-group__list">
                          {g.points.map((p, pi) => (
                            <li key={pi} className="t26-tl-group__item">
                              <span className="t26-tl-group__mark" aria-hidden="true">
                                ▹
                              </span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Stats rendered directly under the university track (group 0) */}
                      {gi === 0 && e.stats && e.stats.length > 0 && (
                        <div className="t26-tl-phase__stats">
                          {e.stats.map((s) => (
                            <span key={s.label} className="t26-tl-stat">
                              <span className="t26-tl-stat__label">{s.label}</span>
                              <span className="t26-tl-stat__value">{s.value}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
