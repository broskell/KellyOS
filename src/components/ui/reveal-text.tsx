"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";

export const MinimalistTextEffect = ({
  text,
  duration,
  className,
  svgClassName,
  textClassName,
  viewBox = "0 0 150 50",
  preserveAspectRatio = "xMidYMid meet",
  fontSize = 16,
  baseOpacity = 0,
  revealOpacity = 1,
  persistAfterHover = false,
  maskRadius = "30%",
  gradientStops,
  x = "50%",
  y = "50%",
  textLength,
  lengthAdjust = "spacingAndGlyphs",
  reveal = "spotlight",
}: {
  text: string;
  duration?: number;
  className?: string;
  svgClassName?: string;
  textClassName?: string;
  viewBox?: string;
  preserveAspectRatio?: string;
  fontSize?: number;
  baseOpacity?: number;
  revealOpacity?: number;
  persistAfterHover?: boolean;
  maskRadius?: string;
  gradientStops?: [string, string, string];
  x?: string | number;
  y?: string | number;
  /** Force the text to span an exact width (SVG userspace units) — makes the
   *  wordmark fill edge-to-edge. Applied to both the base and reveal layers. */
  textLength?: number | string;
  lengthAdjust?: "spacing" | "spacingAndGlyphs";
  /** "spotlight" (default): a radial light/shadow follows the cursor, revealing
   *  the text under it. "full": the WHOLE word fades in on hover with a fixed
   *  left→right light-to-shadow gradient (no cursor tracking, no mask). */
  reveal?: "spotlight" | "full";
}) => {
  const id = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ cx: "50%", cy: "50%" });
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      if (typeof window !== "undefined") {
        setIsDark(document.documentElement.classList.contains("dark"));
      }
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;

      setRipplePosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  const stopColors: [string, string, string] = gradientStops
    ? gradientStops
    : isDark
    ? ["#f3f4f6", "#52525b", "#18181b"]
    : ["#ffffff", "#a3a3a3", "#171717"];

  const stops = [
    <stop key="0" offset="0%" stopColor={stopColors[0]} />,
    <stop key="1" offset="50%" stopColor={stopColors[1]} />,
    <stop key="2" offset="100%" stopColor={stopColors[2]} />,
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
      className={["w-full h-full", className].filter(Boolean).join(" ")}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={viewBox}
        preserveAspectRatio={preserveAspectRatio}
        xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={(e) => {
          setIsHovered(true);
          setHasInteracted(true);
          setCursor({ x: e.clientX, y: e.clientY });
        }}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={(e) => {
          setHasInteracted(true);
          setCursor({ x: e.clientX, y: e.clientY });
        }}
        className={["select-none", svgClassName].filter(Boolean).join(" ")}
        style={{ display: "block", margin: "0 auto" }}
      >
        <defs>
          <radialGradient
            id={`${id}-monoGradient`}
            gradientUnits="userSpaceOnUse"
            r="35%"
            cx={ripplePosition.cx}
            cy={ripplePosition.cy}
          >
            {stops}
          </radialGradient>

          {/* Fixed left→right light-to-shadow ramp for `reveal="full"`. */}
          <linearGradient id={`${id}-linearGradient`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={stopColors[0]} />
            <stop offset="55%" stopColor={stopColors[1]} />
            <stop offset="100%" stopColor={stopColors[2]} />
          </linearGradient>

          <radialGradient
            id={`${id}-inverseMask`}
            gradientUnits="userSpaceOnUse"
            r={maskRadius}
            cx={ripplePosition.cx}
            cy={ripplePosition.cy}
          >
            <stop offset="0%" stopColor="white" />
            <stop offset="45%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>

          <filter id={`${id}-grain`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.35"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.34" />
            </feComponentTransfer>
            <feComposite operator="in" in2="SourceGraphic" />
            <feBlend mode="screen" in2="SourceGraphic" />
          </filter>

          <mask id={`${id}-revealMask`}>
            <rect x="0" y="0" width="100%" height="100%" fill={`url(#${id}-inverseMask)`} />
          </mask>
        </defs>

        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="currentColor"
          opacity={baseOpacity}
          {...(textLength != null ? { textLength, lengthAdjust } : {})}
          filter={`url(#${id}-grain)`}
          className={["font-mono font-light tracking-wider", textClassName]
            .filter(Boolean)
            .join(" ")}
          style={{ fontSize }}
          aria-hidden="true"
        >
          {text}
        </text>

        <motion.text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={
            reveal === "full"
              ? `url(#${id}-linearGradient)`
              : `url(#${id}-monoGradient)`
          }
          {...(reveal === "full" ? {} : { mask: `url(#${id}-revealMask)` })}
          {...(textLength != null ? { textLength, lengthAdjust } : {})}
          className={["font-mono font-light tracking-wider", textClassName]
            .filter(Boolean)
            .join(" ")}
          style={{ fontSize }}
          animate={{
            opacity: isHovered || (persistAfterHover && hasInteracted) ? revealOpacity : 0,
          }}
          transition={{
            duration: duration ?? 0.6,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.text>
      </svg>
    </div>
  );
};
