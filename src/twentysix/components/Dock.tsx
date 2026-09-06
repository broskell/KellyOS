import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/dock.css";
import { dockItems } from "../data/dock";
import { smoothScrollTo } from "../motion/scroll";

/**
 * The hidden SVG filter that warps whatever shows through the glass — the core
 * of the liquid-glass look. One instance per page (the dock references it by id).
 */
function GlassFilter() {
  return (
    <svg className="t26-dock-filter" aria-hidden="true">
      <filter
        id="t26-glass-distortion"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        filterUnits="objectBoundingBox"
      >
        {/* Neutral refraction only: grayscale noise → blur → displace. The
            colour-mapping + specular primitives from the original are dropped so
            the glass stays monochrome (no chromatic hue on the dark canvas). */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.006 0.006"
          numOctaves="2"
          seed="17"
          result="noise"
        />
        <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
        <feGaussianBlur in="mono" stdDeviation="2" result="softMap" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="softMap"
          scale="42"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}

const sectionIds = dockItems
  .filter((i) => i.kind !== "link")
  .map((i) => i.to);

/** Smooth-scroll to a section (Lenis when active, native fallback). */
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) smoothScrollTo(el, { offset: 0 });
}

/**
 * Persistent macOS-style glass dock, fixed to the bottom on every 26' screen.
 * Section items smooth-scroll and reflect the section in view (scroll-spy); the
 * resume item opens the PDF in a new tab.
 */
export function Dock() {
  const [active, setActive] = useState<string>("home");

  // Scroll-spy: highlight the section currently occupying the viewport centre.
  useEffect(() => {
    const observed = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (observed.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    observed.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="t26-dock-wrap" aria-label="Section navigation">
      <GlassFilter />
      <div className="t26-dock">
        <div className="t26-dock__refract" aria-hidden="true" />
        <div className="t26-dock__tint" aria-hidden="true" />
        <div className="t26-dock__spec" aria-hidden="true" />

        <ul className="t26-dock__items">
          {dockItems.map((item, idx) => {
            const isLink = item.kind === "link";
            const isExternal = item.to.startsWith("http") || item.to.endsWith(".pdf");
            const prevIsSection = idx > 0 && dockItems[idx - 1].kind !== "link";
            const showSep = isLink && prevIsSection;

            return (
              <li
                key={item.id}
                className={item.desktopOnly ? "t26-dock__li--desktop-only" : undefined}
                style={{ display: item.desktopOnly ? undefined : "contents" }}
              >
                {showSep && <span className="t26-dock__sep" aria-hidden="true" />}
                {isLink ? (
                  isExternal ? (
                    <a
                      className={`t26-dock__item ${item.desktopOnly ? "t26-dock__item--desktop-only" : ""}`}
                      href={item.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                    >
                      {item.icon}
                      <span className="t26-dock__tip">{item.label}</span>
                    </a>
                  ) : (
                    <Link
                      className={`t26-dock__item ${item.desktopOnly ? "t26-dock__item--desktop-only" : ""}`}
                      to={item.to}
                      aria-label={item.label}
                    >
                      {item.icon}
                      <span className="t26-dock__tip">{item.label}</span>
                    </Link>
                  )
                ) : (
                  <button
                    type="button"
                    className={`t26-dock__item ${item.desktopOnly ? "t26-dock__item--desktop-only" : ""}`}
                    aria-label={item.label}
                    aria-current={active === item.to ? "true" : undefined}
                    onClick={() => scrollToSection(item.to)}
                  >
                    {item.icon}
                    <span className="t26-dock__tip">{item.label}</span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
