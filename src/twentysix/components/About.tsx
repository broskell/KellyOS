import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/about.css";
import { Section } from "./primitives/Section";
import { Reveal } from "./primitives/Reveal";
import TextLoop from "./TextLoop";
import { RotatedCard } from "./about/RotatedCard";
import { revealStagger } from "../motion/reveal";
import { registerScroll } from "../motion/scroll";
import { prefersReducedMotion } from "../../motion/duration";
import { smoothScrollTo } from "../motion/scroll";
import {
  role,
  bio,
  jumpLinks,
  interests,
  quote,
  achievements,
  education,
} from "../data/about";

/**
 * About & Education (#about). Strictly monochrome (black / white / grey).
 *
 * The bio + education render as rotated cards inside a pinned "stage": on scroll
 * the "Who I Am" card enters, then each successive card slides in from the right
 * while the previous one fades off to the left (a GSAP pinned + scrubbed
 * timeline). On mobile / reduced motion the cards fall back to a stacked reveal.
 * Interests, core values, a pull-quote, and achievements follow.
 */
export function About() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const achieveRef = useRef<HTMLDivElement>(null);

  // Interests → the looping wave ribbon.
  const interestsText = interests.map((i) => i.label).join(" ✦ ");

  useEffect(() => {
    registerScroll();
    const cleanups: Array<() => void> = [];

    // Rotated cards (About + Education).
    const stage = cardsRef.current;
    const cardList = stage
      ? Array.from(stage.querySelectorAll<HTMLElement>(".t26-rcard"))
      : [];
    const isMobile =
      typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

    if (stage && cardList.length) {
      if (prefersReducedMotion()) {
        // Everything visible in normal flow — no motion.
        gsap.set(cardList, { opacity: 1, x: 0, y: 0, rotate: 0 });
      } else if (isMobile) {
        // Simple stacked reveal from the right (pinning is jittery on touch).
        cardList.forEach((card) => {
          const tw = gsap.fromTo(
            card,
            { opacity: 0, x: 60, y: 24, rotate: 3 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              rotate: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 85%", once: true },
            },
          );
          cleanups.push(() => {
            tw.scrollTrigger?.kill();
            tw.kill();
          });
        });
      } else {
        // Desktop: a pinned stage where cards swap. "Who I Am" enters, then each
        // next card slides in from the right as the previous fades off left.
        const maxH = Math.max(...cardList.map((c) => c.offsetHeight));
        stage.style.height = `${maxH}px`;
        stage.classList.add("t26-rcards--stage");

        // Pre-stage every card off to the right, hidden.
        gsap.set(cardList, { opacity: 0, xPercent: 55, yPercent: 5, rotate: 3.5 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: stage,
            start: "center 55%",
            end: `+=${cardList.length * 105}%`,
            pin: true,
            pinSpacing: true,
            scrub: 1.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // First card in.
        tl.to(cardList[0], {
          opacity: 1,
          xPercent: 0,
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power2.out",
        });
        tl.to({}, { duration: 0.7 }); // hold

        for (let i = 1; i < cardList.length; i++) {
          // Previous card fades off to the left; next enters from the right.
          // They overlap (cross-fade) so the swap reads as one smooth motion.
          tl.to(cardList[i - 1], {
            opacity: 0,
            xPercent: -55,
            yPercent: -4,
            rotate: -3.5,
            duration: 1,
          });
          tl.to(
            cardList[i],
            { opacity: 1, xPercent: 0, yPercent: 0, rotate: 0, duration: 1, ease: "power2.out" },
            "<0.35",
          );
          tl.to({}, { duration: 0.7 }); // hold
        }

        ScrollTrigger.refresh();
        // Re-measure once fonts settle (card heights can shift).
        const onLoad = () => ScrollTrigger.refresh();
        window.addEventListener("load", onLoad);

        cleanups.push(() => {
          window.removeEventListener("load", onLoad);
          tl.scrollTrigger?.kill();
          tl.kill();
          stage.classList.remove("t26-rcards--stage");
          stage.style.height = "";
          gsap.set(cardList, { clearProps: "all" });
        });
      }
    }

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
        <p className="t26-about__role">
          <span className="t26-muted">Who I Am —</span> {role}
        </p>
      </Reveal>

      {/* Bio + Education — stacked rotated blue-label / tan-paper cards */}
      <div className="t26-rcards" ref={cardsRef} aria-label="About and education">
        {/* About Me */}
        <RotatedCard side="left" tag="Introduction" label="Who I Am">
          {bio.map((p, i) => (
            <p key={i} className="t26-rcard__p">
              {p}
            </p>
          ))}
        </RotatedCard>

        {/* Education */}
        {education.map((e, i) => (
          <RotatedCard
            key={e.institution}
            side={i % 2 === 0 ? "right" : "left"}
            tag="Education"
            label={e.institution}
          >
            <p className="t26-rcard__prog">{e.program}</p>
            <p className="t26-rcard__dur">{e.duration}</p>
            {e.rows?.map((r) => (
              <p key={r.label} className="t26-rcard__row">
                <span className="t26-rcard__k">{r.label}</span>
                <span className="t26-rcard__v">{r.value}</span>
              </p>
            ))}
          </RotatedCard>
        ))}
      </div>

      {/* Jump links */}
      <Reveal className="t26-about__block">
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
