import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import { TIER_META, logoUrl, type Tech } from "../../data/tech";
import { prefersReducedMotion } from "../../../motion/duration";
import { setSmoothScrollPaused } from "../../motion/scroll";

/**
 * SkillModal — the popup raised when a logo is clicked on the sphere / grid.
 * Shows the skill's logo, name, and its evidence-tier "range" bar + one line of
 * evidence. There is no persistent panel; the range only appears on click.
 *
 * Accessible: role="dialog" + aria-modal, labelled by the name, focus trap,
 * Esc / scrim to close, Lenis paused + body lock while open, focus restored to
 * the trigger on close. Motion is a scrim fade + panel rise (reduced-motion gated).
 */
interface SkillModalProps {
  tech: Tech | null;
  onClose: () => void;
}

export function SkillModal({ tech, onClose }: SkillModalProps) {
  const scrimRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const open = tech !== null;

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;

    const scrim = scrimRef.current;
    const panel = panelRef.current;
    if (scrim && panel) {
      if (prefersReducedMotion()) {
        gsap.set([scrim, panel], { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
        gsap.fromTo(
          panel,
          { opacity: 0, y: 28, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" },
        );
      }
    }

    const focusTarget = panel?.querySelector<HTMLElement>("[data-autofocus]") ?? panel;
    focusTarget?.focus();

    return () => {
      restoreFocusRef.current?.focus?.();
    };
  }, [open]);

  // Body lock + Lenis pause (Lenis smooths the wheel on window itself).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setSmoothScrollPaused(true);
    return () => {
      document.body.style.overflow = prev;
      setSmoothScrollPaused(false);
    };
  }, [open]);

  // Esc to close + focus trap.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;
      if (e.shiftKey && activeEl === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !tech) return null;

  const meta = TIER_META[tech.tier];
  const filled = 4 - tech.tier; // tier 1→3 segments, 2→2, 3→1

  return (
    <div
      className="t26-sm"
      role="presentation"
      onClick={(e) => {
        if (e.target === scrimRef.current) onClose();
      }}
    >
      <div className="t26-sm__scrim" ref={scrimRef} />
      <div
        className="t26-sm__panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <button
          type="button"
          className="t26-sm__close"
          onClick={onClose}
          aria-label="Close skill details"
          data-autofocus
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6 6 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="t26-skill">
          <div className="t26-skill__head">
            <span className="t26-skill__logo" aria-hidden="true">
              <img src={logoUrl(tech.slug)} alt="" />
            </span>
            <div className="t26-skill__id">
              <h3 id={titleId} className="t26-skill__name">
                {tech.name}
              </h3>
              <span className="t26-skill__cat">{tech.category}</span>
            </div>
          </div>

          <div
            className="t26-skill__bar"
            role="meter"
            aria-valuemin={1}
            aria-valuemax={3}
            aria-valuenow={filled}
            aria-label={`Evidence tier: ${meta.label}`}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={"t26-skill__seg" + (i < filled ? " is-on" : "")}
                style={{ animationDelay: `${i * 90}ms` }}
              />
            ))}
          </div>

          <div className="t26-skill__meta">
            <span className="t26-skill__tier">
              Tier {tech.tier} — {meta.label}
            </span>
            <p className="t26-skill__blurb">{meta.blurb}</p>
          </div>

          <p className="t26-skill__evidence">{tech.evidence}</p>
        </div>
      </div>
    </div>
  );
}
