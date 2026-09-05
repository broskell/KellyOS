import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import type { Project26 } from "../../data/projects26";
import { ImageWithFallback } from "../primitives/ImageWithFallback";
import { IconGithub } from "../icons";
import { prefersReducedMotion } from "../../../motion/duration";
import Silk from "./Silk";
import SpecularButton from "./SpecularButton";
import { setSmoothScrollPaused } from "../../motion/scroll";

/**
 * ProjectModal — the project-detail dialog raised when a slat is opened. Shows the
 * cover, stack chips, description, highlights, and Live / GitHub links.
 *
 * Accessible: role="dialog" + aria-modal, labelled by the title, focus trap,
 * Esc / scrim to close, body scroll lock while open, and focus restored to the
 * trigger on close. Motion is a scrim fade + panel rise, gated by reduced-motion.
 */
interface ProjectModalProps {
  project: Project26 | null;
  onClose: () => void;
}

const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path
      d="M7 17 17 7M9 7h8v8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const scrimRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const open = project !== null;

  // Enter animation + capture the element to restore focus to on close.
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
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        );
      }
    }

    // Move focus into the dialog.
    const focusTarget = panel?.querySelector<HTMLElement>("[data-autofocus]") ?? panel;
    focusTarget?.focus();

    return () => {
      restoreFocusRef.current?.focus?.();
    };
  }, [open]);

  // Body scroll lock while open. Lenis smooths the wheel on window itself, so
  // hiding body overflow isn't enough — pause Lenis too, and let the modal's own
  // scroller (data-lenis-prevent) take the wheel natively.
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

  if (!open || !project) return null;

  const live = project.links?.live?.trim();
  const repo = project.links?.repo?.trim();
  const reduced = prefersReducedMotion();
  const initials = project.title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className="t26-pm"
      role="presentation"
      onClick={(e) => {
        if (e.target === scrimRef.current) onClose();
      }}
    >
      <div className="t26-pm__scrim" ref={scrimRef} />
      <div
        className="t26-pm__panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        {!reduced && (
          <div className="t26-pm__silk" aria-hidden="true">
            <Silk color="#333333" speed={18.9} scale={1.1} noiseIntensity={1.1} rotation={0} />
          </div>
        )}

        <button
          type="button"
          className="t26-pm__close"
          onClick={onClose}
          aria-label="Close project details"
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

        <div className="t26-pm__scroll" data-lenis-prevent>
          <div className="t26-pm__cover">
            <ImageWithFallback
              src={project.cover ?? ""}
              alt={`${project.title} cover`}
              initials={initials}
              ratio="16/9"
              grayscale={false}
            />
          </div>

          <div className="t26-pm__body">
          <div className="t26-pm__head">
            {project.year ? <span className="t26-eyebrow">{project.year}</span> : null}
            <h3 id={titleId} className="t26-pm__title">
              {project.title}
            </h3>
            <p className="t26-pm__tagline">{project.tagline}</p>
          </div>

          {project.stack.length ? (
            <ul className="t26-pm__stack" aria-label="Tech stack">
              {project.stack.map((s) => (
                <li key={s} className="t26-pm__chip">
                  {s}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="t26-pm__desc">
            {project.description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {project.highlights?.length ? (
            <ul className="t26-pm__highlights">
              {project.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          ) : null}

          {(live || repo || project.status) && (
            <div className="t26-pm__actions">
              {live &&
                (reduced ? (
                  <a
                    className="t26-btn t26-btn--solid"
                    href={live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live <ExternalIcon />
                  </a>
                ) : (
                  <SpecularButton
                    href={live}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="md"
                    radius={12}
                    lineColor="#ffffff"
                    baseColor="#4a4a4a"
                    textColor="#f2f2f2"
                    tint="#ffffff"
                    tintOpacity={0.06}
                    autoAnimate
                    aria-label={`Open ${project.title} live site`}
                  >
                    Live <ExternalIcon />
                  </SpecularButton>
                ))}
              {repo &&
                (reduced ? (
                  <a className="t26-btn" href={repo} target="_blank" rel="noopener noreferrer">
                    <IconGithub width={18} height={18} /> GitHub
                  </a>
                ) : (
                  <SpecularButton
                    href={repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="md"
                    radius={12}
                    lineColor="#ffffff"
                    baseColor="#4a4a4a"
                    textColor="#f2f2f2"
                    tint="#ffffff"
                    tintOpacity={0.06}
                    autoAnimate
                    aria-label={`Open ${project.title} GitHub repository`}
                  >
                    <IconGithub width={18} height={18} /> GitHub
                  </SpecularButton>
                ))}
              {project.status && <span className="t26-pm__status">{project.status}</span>}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
