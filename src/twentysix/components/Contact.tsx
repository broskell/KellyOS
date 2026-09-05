import { useEffect, useRef, useState } from "react";
import "../styles/contact.css";
import { Section } from "./primitives/Section";
import { Reveal } from "./primitives/Reveal";
import { Socials } from "./Socials";
import Beams from "./contact/Beams";
import { ContactForm } from "./contact/ContactForm";
import SpecularButton from "./projects/SpecularButton";
import { prefersReducedMotion } from "../../motion/duration";

const EMAIL = "saathvik.kp@gmail.com";

/**
 * Contact (#contact). A closing call-to-action laid over an ambient field of
 * noise-displaced light beams (React-Bits Beams). Two columns on desktop: the
 * pitch + email + socials on the left, a contact form on the right. The beams
 * read as soft grey light streaks on the page canvas — monochrome, in keeping
 * with the 26' system.
 *
 * The WebGL Canvas mounts as soon as the section is within ~1.5 screens of the
 * viewport (so it is warmed up and running by the time it scrolls in) and is
 * skipped entirely under reduced-motion, where a plain gradient stands in.
 */
export function Contact() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  // Mount the Canvas well before the section reaches the viewport so the shader
  // has compiled and is animating by the time the user arrives — then unmount it
  // again once it is far off-screen so it never runs needlessly.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "1400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showBeams = visible && !reduced;

  return (
    <Section
      id="contact"
      label="Get in touch"
      container="none"
      className="t26-contact"
    >
      <div ref={rootRef} className="t26-contact__stage">
        {/* Ambient beams backdrop */}
        <div className="t26-contact__beams" aria-hidden="true">
          {showBeams && (
            <Beams
              beamWidth={2}
              beamHeight={22}
              beamNumber={16}
              lightColor="#ffffff"
              beamColor="#0a0a0a"
              backgroundColor="#070707"
              speed={2}
              noiseIntensity={1.6}
              scale={0.2}
              rotation={30}
            />
          )}
        </div>
        {/* Legibility veil over the beams */}
        <div className="t26-contact__veil" aria-hidden="true" />

        <div className="t26-container t26-contact__inner">
          <Reveal>
            <div className="t26-contact__head">
              <span className="t26-eyebrow t26-eyebrow--accent">05 / Contact</span>
              <hr className="t26-hairline" />
            </div>
          </Reveal>

          <div className="t26-contact__grid">
            {/* Left — pitch, email CTA, socials */}
            <div className="t26-contact__pitch">
              <Reveal delay={0.05}>
                <h2 className="t26-contact__title">
                  Let's build
                  <br />
                  something.
                </h2>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="t26-lead t26-contact__lead">
                  Open to internships, freelance builds, and collaborations. Have an
                  idea, a role, or just want to say hi? My inbox is always open.
                </p>
              </Reveal>

              <Reveal delay={0.15} className="t26-contact__actions">
                <SpecularButton
                  href={`mailto:${EMAIL}`}
                  size="lg"
                  radius={14}
                  lineColor="#ffffff"
                  baseColor="#4a4a4a"
                  tintOpacity={0.06}
                  autoAnimate
                  aria-label={`Email ${EMAIL}`}
                >
                  {EMAIL}
                </SpecularButton>
                <Socials
                  className="t26-contact__socials"
                  exclude={["gmail"]}
                  order={["linkedin", "instagram", "github", "leetcode"]}
                />
              </Reveal>
            </div>

            {/* Right — contact form */}
            <Reveal className="t26-contact__formwrap" delay={0.1} direction="up">
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
