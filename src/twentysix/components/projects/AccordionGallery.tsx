import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import "./AccordionGallery.css";

/**
 * AccordionGallery — expanding image slats (a React-Bits-style accordion), ported
 * into the 26' monochrome system and wired for the Projects section: hovering /
 * focusing a slat expands it (cover + title + tagline + "VIEW PROJECT"); clicking
 * or pressing Enter/Space on a slat calls `onOpen(index)` so the parent can raise
 * the project-detail modal (instead of the original component's link navigation).
 *
 * Presentational + motion only. All project data + the modal live in the parent.
 */
export interface AccordionItem {
  /** Cover image URL/path. When absent, an initials tile is rendered. */
  image?: string;
  /** Short title shown on the active slat. */
  label: string;
  /** One-line summary under the title on the active slat. */
  tagline?: string;
  /** Alt text for the cover (falls back to label). */
  alt?: string;
}

export interface AccordionGalleryProps {
  items: AccordionItem[];
  /** Which slat is expanded on first paint. */
  defaultIndex?: number;
  /** Called with the slat index when a slat is clicked / activated. */
  onOpen?: (index: number) => void;
  height?: number;
  gap?: number;
  radius?: number;
  /** Share of the row the active slat grows to (0.2–0.9). */
  expandRatio?: number;
  orientation?: "horizontal" | "vertical";
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  /** "hover" expands on pointer/focus; "none" only via keyboard arrows. */
  trigger?: "hover" | "none";
  grayscale?: boolean;
  className?: string;
}

const AccordionGallery = ({
  items,
  defaultIndex = 0,
  onOpen,
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.5,
  orientation = "horizontal",
  duration = 0.6,
  ease = "power3.out",
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = "hover",
  grayscale = true,
  className = "",
}: AccordionGalleryProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Array<HTMLElement | null>>([]);
  const mediaRefs = useRef<Array<HTMLElement | null>>([]);
  const barRefs = useRef<Array<HTMLElement | null>>([]);
  const textRefs = useRef<Array<HTMLElement | null>>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const vertical = orientation === "vertical";
  const count = items.length;
  const [active, setActive] = useState(
    Math.min(Math.max(defaultIndex, 0), Math.max(count - 1, 0)),
  );
  // Covers that 404 / fail to load → fall back to the initials tile.
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !prefersReduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

        if (media) {
          const gray = grayscale ? (isActive ? 0 : 1) : 0;
          if (vertical) {
            // Vertical slats are wide banners → the cover fills the slat directly
            // (no centered-square parallax, which cropped the banner's sides).
            tl.to(
              media,
              {
                xPercent: 0,
                yPercent: 0,
                x: 0,
                y: 0,
                "--ag-gray": gray,
                "--ag-dim": isActive ? 0 : 0.4,
                duration: dur,
                ease,
              },
              0,
            );
          } else {
            const drift = Math.max(-1.5, Math.min(1.5, active - i));
            const shift = drift * parallax * mediaSize * 0.06;
            tl.to(
              media,
              {
                xPercent: -50,
                yPercent: -50,
                x: isActive ? 0 : shift,
                y: 0,
                "--ag-gray": gray,
                "--ag-dim": isActive ? 0 : 0.4,
                duration: dur,
                ease,
              },
              0,
            );
          }
        }

        if (bar && text) {
          if (isActive) {
            tl.to(
              [bar, text],
              { opacity: 1, x: 0, duration: dur, ease, stagger: prefersReduced ? 0 : stagger },
              0,
            );
          } else {
            tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
          }
        }
      });

      tlRef.current = tl;
    },
    [
      active,
      count,
      expandRatio,
      duration,
      ease,
      vertical,
      tilt,
      parallax,
      grayscale,
      stagger,
      prefersReduced,
    ],
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
      mediaSizeRef.current = size;
      el.style.setProperty("--ag-media-size", `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio, vertical]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    [],
  );

  const handleEnter = (i: number) => {
    if (trigger === "hover") setActive(i);
  };

  const open = (i: number) => {
    setActive(i);
    onOpen?.(i);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i + 1) % count);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i - 1 + count) % count);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open(i);
    }
  };

  const initials = (label: string) =>
    label
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? " accordion-gallery--vertical" : ""}${
        className ? ` ${className}` : ""
      }`}
      style={
        {
          "--ag-gap": `${gap}px`,
          "--ag-radius": `${radius}px`,
          height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`,
        } as React.CSSProperties
      }
      role="list"
      aria-label="Selected projects"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        return (
          <div
            key={i}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className={`ag-panel${isActive ? " ag-panel--active" : ""}`}
            style={{ borderRadius: `${radius}px` }}
            onClick={() => open(i)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => trigger === "hover" && setActive(i)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? "true" : undefined}
            aria-label={`${item.label}${item.tagline ? ` — ${item.tagline}` : ""}. Open details.`}
          >
            <span className="ag-panel__frame">
              <span
                className="ag-panel__media"
                ref={(el) => {
                  mediaRefs.current[i] = el;
                }}
              >
                {item.image && !failed[i] ? (
                  <img
                    src={item.image}
                    alt=""
                    draggable={false}
                    onError={() => setFailed((f) => ({ ...f, [i]: true }))}
                  />
                ) : (
                  <span className="ag-panel__fallback" aria-hidden="true">
                    {initials(item.label)}
                  </span>
                )}
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>

            <span className="ag-panel__label" aria-hidden="true">
              <span className="ag-panel__index">{String(i + 1).padStart(2, "0")}</span>
              <span
                className="ag-panel__bar"
                ref={(el) => {
                  barRefs.current[i] = el;
                }}
              />
              <span
                className="ag-panel__text"
                ref={(el) => {
                  textRefs.current[i] = el;
                }}
              >
                <span className="ag-panel__title">{item.label}</span>
                {item.tagline ? (
                  <span className="ag-panel__tagline">{item.tagline}</span>
                ) : null}
                <span className="ag-panel__cta">
                  View project
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default AccordionGallery;
