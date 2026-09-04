import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { revealOnScroll, type RevealDirection } from "../../motion/reveal";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  direction?: RevealDirection;
  distance?: number;
  delay?: number;
  className?: string;
  start?: string;
  id?: string;
}

/**
 * Wraps content in a scroll-reveal. Starts hidden (.t26-reveal) and animates in
 * once when scrolled into view. Reduced motion shows it immediately.
 */
export function Reveal({
  children,
  as: Tag = "div",
  direction = "up",
  distance,
  delay,
  className,
  start,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    return revealOnScroll(ref.current, { direction, distance, delay, start });
  }, [direction, distance, delay, start]);

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={["t26-reveal", className].filter(Boolean).join(" ")}
    >
      {children}
    </Tag>
  );
}
