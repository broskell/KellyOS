/**
 * Scroll-reveal helpers for the 26' edition. Token-timed, reduced-motion gated.
 * Elements start hidden via the .t26-reveal class (opacity:0); these bring them in.
 */
import gsap from "gsap";
import { durationSeconds, prefersReducedMotion } from "../../motion/duration";
import { registerScroll } from "./scroll";

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

export interface RevealOptions {
  direction?: RevealDirection;
  distance?: number;
  delay?: number;
  durationToken?: string;
  fallbackMs?: number;
  start?: string;
  once?: boolean;
}

function offsetFor(direction: RevealDirection, distance: number): { x: number; y: number } {
  switch (direction) {
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
}

/** Reveal a single element on scroll. Returns a cleanup fn. */
export function revealOnScroll(el: HTMLElement | null, opts: RevealOptions = {}): () => void {
  if (!el) return () => {};
  registerScroll();

  const {
    direction = "up",
    distance = 32,
    delay = 0,
    durationToken = "--t26-dur",
    fallbackMs = 600,
    start = "top 82%",
    once = true,
  } = opts;

  if (prefersReducedMotion()) {
    gsap.set(el, { opacity: 1, x: 0, y: 0 });
    return () => {};
  }

  const { x, y } = offsetFor(direction, distance);
  const tween = gsap.fromTo(
    el,
    { opacity: 0, x, y },
    {
      opacity: 1,
      x: 0,
      y: 0,
      delay,
      duration: durationSeconds(durationToken, fallbackMs),
      ease: "power3.out",
      scrollTrigger: { trigger: el, start, once, toggleActions: "play none none none" },
    },
  );

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

/** Stagger-reveal a set of children on scroll. Returns a cleanup fn. */
export function revealStagger(
  container: HTMLElement | null,
  targets: Element[] | NodeListOf<Element>,
  opts: RevealOptions & { stagger?: number } = {},
): () => void {
  if (!container || !targets || targets.length === 0) return () => {};
  registerScroll();

  const {
    direction = "up",
    distance = 28,
    durationToken = "--t26-dur",
    fallbackMs = 600,
    start = "top 80%",
    stagger = 0.09,
    once = true,
  } = opts;

  const items = Array.from(targets);
  if (prefersReducedMotion()) {
    gsap.set(items, { opacity: 1, x: 0, y: 0 });
    return () => {};
  }

  const { x, y } = offsetFor(direction, distance);
  const tween = gsap.fromTo(
    items,
    { opacity: 0, x, y },
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration: durationSeconds(durationToken, fallbackMs),
      ease: "power3.out",
      stagger,
      scrollTrigger: { trigger: container, start, once, toggleActions: "play none none none" },
    },
  );

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}
