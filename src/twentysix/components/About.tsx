import { useEffect, useRef } from "react";
import gsap from "gsap";
import "../styles/about.css";
import { Section } from "./primitives/Section";
import { Reveal } from "./primitives/Reveal";
import TextLoop from "./TextLoop";
import { revealStagger } from "../motion/reveal";
import { registerScroll } from "../motion/scroll";
import { durationSeconds, prefersReducedMotion } from "../../motion/duration";
import { smoothScrollTo } from "../motion/scroll";
import {
  role,
  bio,
  jumpLinks,
  interests,
  coreValues,
  quote,
  achievements,
  education,
} from "../data/about";

/**
 * About & Education (#about). Monochrome editorial with a restrained blue accent
 * (from the portfolio card art). Bio on the left; the education panels slide up
 * from the right on scroll (GSAP + ScrollTrigger). Interests, core values, a
 * pull-quote, and achievements follow, each revealing on scroll.
 */
export function About() {
  const eduRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const achieveRef = useRef<HTMLDivElement>(null);

  // Interests → the looping wave ribbon.
  const interestsText = interests.map((i) => i.label).join(" ✦ ");

  useEffect(() => {
    registerScroll();
    const cleanups: Array<() => void> = [];

    // Education: slide UP and IN FROM THE RIGHT, staggered.
    const eduItems = eduRef.current?.querySelectorAll<HTMLElement>(".t26-edu");
    if (eduItems && eduItems.length) {
      if (prefersReducedMotion()) {
        gsap.set(eduItems, { opacity: 1, x: 0, y: 0 });
      } else {
        const tw = gsap.fromTo(
          eduItems,
          { opacity: 0, x: 90, y: 56 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: durationSeconds("--t26-dur-slow", 1050),
            ease: "power3.out",
            stagger: 0.14,
            scrollTrigger: { trigger: eduRef.current, start: "top 78%", once: true },
          },
        );
        cleanups.push(() => {
          tw.scrollTrigger?.kill();
          tw.kill();
        });
      }
    }

    cleanups.push(
      revealStagger(
        valuesRef.current,
        valuesRef.current?.querySelectorAll(".t26-value") ?? [],
        { direction: "up", stagger: 0.1 },
      ),
    );
    cleanups.push(
      revealStagger(
        achieveRef.current,
        achieveRef.current?.querySelectorAll(".t26-ach") ?? [],
        { direction: "up", stagger: 0.1 },
      ),
    );

    return () => cleanups.forEach((fn) => fn && fn());
  }, []);

  return (
    <Section id="about" label="About me" className="t26-about">
      {/* Header */}
      <Reveal>
        <div className="t26-about__head">
          <span className="t26-eyebrow t26-eyebrow--accent">01 / About</span>
          <hr className="t26-hairline" />
        </div>
        <h2 className="t26-h1 t26-about__title">About Me</h2>
        <p className="t26-about__role">
          <span className="t26-muted">Who I Am —</span> {role}
        </p>
      </Reveal>

      {/* Bio + Education */}
      <div className="t26-about__grid">
        <Reveal className="t26-about__prose" delay={0.05}>
          {bio.map((p, i) => (
            <p key={i} className={i === 0 ? "t26-lead" : "t26-about__p"}>
              {p}
            </p>
          ))}
          <nav className="t26-about__links" aria-label="Jump to section">
            {jumpLinks.map((l) => (
              <button
                key={l.to}
                type="button"
                className="t26-jumplink"
                onClick={() => {
                  const el = document.getElementById(l.to);
                  if (el) smoothScrollTo(el);
                }}
              >
                <span aria-hidden="true">▹</span> {l.label}
              </button>
            ))}
          </nav>
        </Reveal>

        <div className="t26-about__edu" ref={eduRef} aria-label="Education">
          {education.map((e, i) => (
            <article key={i} className="t26-edu">
              <header className="t26-edu__bar">
                <span className="t26-edu__dot" />
                <span className="t26-edu__dot" />
                <span className="t26-edu__dot" />
                <span className="t26-edu__prompt">
                  saathvik@portfolio:~$ cat education/{i === 0 ? "iitj" : "lst"}.txt
                </span>
              </header>
              <div className="t26-edu__body">
                <h3 className="t26-edu__inst">{e.institution}</h3>
                <p className="t26-edu__prog">{e.program}</p>
                <p className="t26-edu__dur">{e.duration}</p>
                {e.rows?.map((r) => (
                  <p key={r.label} className="t26-edu__row">
                    <span className="t26-edu__k">{r.label}</span>
                    <span className="t26-edu__v">{r.value}</span>
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Interests — looping wave ribbon */}
      <Reveal className="t26-about__block">
        <p className="t26-eyebrow">Interests &amp; Passions</p>
      </Reveal>
      <Reveal className="t26-interests-loop" delay={0.05}>
        <TextLoop
          text={interestsText}
          shape="wave"
          speed={90}
          direction="forward"
          separator="✦"
          curviness={10}
          fontSize={46}
          fontWeight={800}
          letterSpacing={2}
          uppercase
          color="#000000"
          ribbon
          ribbonColor="#ffffff"
          ribbonWidth={86}
          pauseOnHover={false}
          ariaLabel={`Interests: ${interestsText}`}
        />
      </Reveal>

      {/* Core Values */}
      <Reveal className="t26-about__block">
        <p className="t26-eyebrow">Core Values</p>
      </Reveal>
      <div className="t26-values" ref={valuesRef}>
        {coreValues.map((v) => (
          <article key={v.n} className="t26-value">
            <span className="t26-value__n">{v.n}</span>
            <h3 className="t26-value__t">{v.title}</h3>
            <p className="t26-value__b">{v.body}</p>
          </article>
        ))}
      </div>

      {/* Quote */}
      <Reveal className="t26-about__block">
        <blockquote className="t26-quote">{quote}</blockquote>
      </Reveal>

      {/* Achievements */}
      <Reveal className="t26-about__block">
        <p className="t26-eyebrow">Achievements</p>
      </Reveal>
      <div className="t26-achievements" ref={achieveRef}>
        {achievements.map((a) => (
          <article key={a.highlight} className="t26-ach">
            <span className="t26-ach__h">{a.highlight}</span>
            <span className="t26-ach__d">{a.detail}</span>
          </article>
        ))}
      </div>
    </Section>
  );
}
