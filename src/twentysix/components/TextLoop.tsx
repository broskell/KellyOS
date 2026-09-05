import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "../../motion/duration";

export interface TextLoopProps {
  /** The phrase that loops. */
  text: string;
  /** "wave" bends the baseline into a sine; anything else is a straight line. */
  shape?: "wave" | "line";
  /** Scroll speed in px/second. */
  speed?: number;
  direction?: "forward" | "backward";
  /** Glyph placed between each repetition of `text`. */
  separator?: string;
  /** Wave amplitude in px (ignored when shape !== "wave"). */
  curviness?: number;
  /** Wavelength in px — how long one full wave is. */
  wavelength?: number;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  uppercase?: boolean;
  color?: string;
  /** Draw a thick band behind the text along the same path. */
  ribbon?: boolean;
  ribbonColor?: string;
  ribbonWidth?: number;
  pauseOnHover?: boolean;
  className?: string;
  fontFamily?: string;
  ariaLabel?: string;
}

let __tlId = 0;

/**
 * TextLoop — a phrase repeated along a wavy (or straight) path that scrolls
 * seamlessly, optionally on a ribbon band. GSAP-driven (the 26' motion system),
 * pauses on hover, and stands still under reduced motion.
 *
 * Seamless loop: the text is tiled in identical blocks and the path offset is
 * animated by exactly one block width, so the pattern maps onto itself.
 */
export default function TextLoop({
  text,
  shape = "wave",
  speed = 70,
  direction = "forward",
  separator = "✦",
  curviness = 26,
  wavelength = 300,
  fontSize = 44,
  fontWeight = 800,
  letterSpacing = 2,
  uppercase = true,
  color = "#000000",
  ribbon = true,
  ribbonColor = "#ffffff",
  ribbonWidth = 90,
  pauseOnHover = true,
  className,
  fontFamily = "var(--f-ui)",
  ariaLabel,
}: TextLoopProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const gradId = useMemo(() => `tl-path-${++__tlId}`, []);

  const [width, setWidth] = useState(0);
  const [unit, setUnit] = useState(0); // px length of one text block

  const raw = uppercase ? text.toUpperCase() : text;
  const block = `${raw} ${separator} `; // en-spaces around the separator

  // Track container width (responsive).
  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? el.clientWidth;
      setWidth(Math.round(w));
    });
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Measure one block's rendered length (re-measure once webfonts are ready).
  useLayoutEffect(() => {
    const measure = () => {
      if (measureRef.current) {
        const len = measureRef.current.getComputedTextLength();
        if (len > 0) setUnit(len);
      }
    };
    measure();
    const fonts = (document as unknown as { fonts?: { ready: Promise<unknown> } }).fonts;
    fonts?.ready.then(measure);
  }, [block, fontSize, fontWeight, letterSpacing, width]);

  const amp = shape === "wave" ? curviness : 0;
  const height = Math.max(fontSize, 2 * amp + ribbonWidth) + 24;
  const cy = height / 2;

  // How many blocks to tile so the visible width stays filled through one shift.
  const reps = unit > 0 ? Math.ceil((width + unit) / unit) + 2 : 8;
  const spanX = unit > 0 ? reps * unit + width : Math.max(width * 2, 1200);
  const content = unit > 0 ? block.repeat(reps) : block;

  // Build the wave path across spanX (sampled sine; straight line when amp = 0).
  const d = useMemo(() => {
    if (amp === 0) return `M 0 ${cy} L ${spanX} ${cy}`;
    const step = 10;
    let path = `M 0 ${cy}`;
    for (let x = step; x <= spanX; x += step) {
      const y = cy + amp * Math.sin((2 * Math.PI * x) / wavelength);
      path += ` L ${x} ${y.toFixed(2)}`;
    }
    return path;
  }, [amp, spanX, cy, wavelength]);

  // Animate the scroll.
  useEffect(() => {
    const tp = textPathRef.current;
    if (!tp || unit <= 0) return;
    if (prefersReducedMotion()) {
      gsap.set(tp, { attr: { startOffset: 0 } });
      return;
    }
    const dist = direction === "forward" ? -unit : unit;
    const tween = gsap.fromTo(
      tp,
      { attr: { startOffset: 0 } },
      { attr: { startOffset: dist }, duration: unit / Math.max(1, speed), ease: "none", repeat: -1 },
    );

    const host = hostRef.current;
    const enter = () => tween.pause();
    const leave = () => tween.resume();
    if (pauseOnHover && host) {
      host.addEventListener("mouseenter", enter);
      host.addEventListener("mouseleave", leave);
    }
    return () => {
      tween.kill();
      if (pauseOnHover && host) {
        host.removeEventListener("mouseenter", enter);
        host.removeEventListener("mouseleave", leave);
      }
    };
  }, [unit, direction, speed, pauseOnHover, spanX]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ width: "100%", overflow: "hidden", lineHeight: 0 }}
      role="img"
      aria-label={ariaLabel ?? raw}
    >
      <svg
        width={width || "100%"}
        height={height}
        viewBox={`0 0 ${width || 1} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block", overflow: "visible" }}
        aria-hidden="true"
      >
        <defs>
          <path id={gradId} ref={pathRef} d={d} fill="none" />
        </defs>
        {ribbon && (
          <use
            href={`#${gradId}`}
            stroke={ribbonColor}
            strokeWidth={ribbonWidth}
            strokeLinecap="round"
            fill="none"
          />
        )}
        <text
          fontSize={fontSize}
          fontWeight={fontWeight}
          fill={color}
          letterSpacing={letterSpacing}
          dominantBaseline="middle"
          style={{ fontFamily }}
        >
          <textPath ref={textPathRef} href={`#${gradId}`} startOffset={0}>
            {content}
          </textPath>
        </text>
        {/* Hidden single-block measurer (kept in layout via visibility:hidden). */}
        <text
          ref={measureRef}
          fontSize={fontSize}
          fontWeight={fontWeight}
          letterSpacing={letterSpacing}
          style={{ fontFamily, visibility: "hidden" }}
        >
          {block}
        </text>
      </svg>
    </div>
  );
}
