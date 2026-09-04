/**
 * 26' smooth-scroll + ScrollTrigger wiring.
 *
 * All GSAP usage for the 2026 edition is centralized under src/twentysix/motion/.
 * Durations come from the CSS motion tokens in tokens26.css (via durationSeconds),
 * and every animation is gated on prefers-reduced-motion, mirroring the retro
 * src/motion/play.ts convention.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { prefersReducedMotion } from "../../motion/duration";

let registered = false;
export function registerScroll(): void {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

let lenis: Lenis | null = null;

/** Programmatic scroll used by the dock / terminal nav. Falls back to native. */
export function smoothScrollTo(
  target: string | HTMLElement | number,
  opts?: { offset?: number; immediate?: boolean },
): void {
  const offset = opts?.offset ?? 0;
  if (lenis) {
    lenis.scrollTo(target, {
      offset,
      immediate: opts?.immediate ?? prefersReducedMotion(),
    });
    return;
  }
  // Fallback: native scroll (reduced motion, touch, or Lenis unavailable).
  const el =
    typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (typeof el === "number") {
    window.scrollTo({ top: el + offset, behavior: opts?.immediate ? "auto" : "smooth" });
  } else if (el instanceof HTMLElement) {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: opts?.immediate ? "auto" : "smooth" });
  }
}

/**
 * Initializes Lenis and binds it to the GSAP ticker + ScrollTrigger.
 * Disabled under reduced motion (native scroll is used instead).
 * Call once from the 26' route root.
 */
export function useSmoothScroll(enabled = true): void {
  useEffect(() => {
    registerScroll();
    if (!enabled || prefersReducedMotion()) {
      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }

    const instance = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // touch left native for correctness; wheel is smoothed.
      touchMultiplier: 1.2,
    });
    lenis = instance;

    instance.on("scroll", ScrollTrigger.update);

    const onRaf = (time: number) => {
      // GSAP ticker time is in seconds; Lenis expects ms.
      instance.raf(time * 1000);
    };
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(onRaf);
      instance.destroy();
      lenis = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [enabled]);
}
