import gsap from "gsap";
import { durationSeconds, prefersReducedMotion } from "./duration";

export function killMotion(target: gsap.TweenTarget): void {
  gsap.killTweensOf(target);
}

function runOrSkip(el: HTMLElement | null, token: string, fallbackMs: number, from: gsap.TweenVars, to: gsap.TweenVars, onDone?: () => void): void {
  if (!el || prefersReducedMotion()) {
    if (el) gsap.set(el, { opacity: 1 });
    onDone?.();
    return;
  }
  gsap.killTweensOf(el);
  gsap.fromTo(el, from, {
    ...to,
    duration: durationSeconds(token, fallbackMs),
    ease: "none",
    onComplete: onDone,
  });
}

/** Overlay stays fully visible (Skip on first frame). Fade is exit-only, ≤ token boot duration. */
export function playBootOut(el: HTMLElement | null, onDone: () => void): void {
  if (!el || prefersReducedMotion()) {
    onDone();
    return;
  }
  gsap.killTweensOf(el);
  gsap.to(el, {
    opacity: 0,
    duration: durationSeconds("--kellos-duration-boot", 400),
    ease: "none",
    onComplete: onDone,
  });
}

export function playWindowOpen(el: HTMLElement | null): void {
  runOrSkip(el, "--kellos-duration-window", 180, { opacity: 0 }, { opacity: 1 });
}

export function playWindowFocus(el: HTMLElement | null): void {
  runOrSkip(el, "--kellos-duration-focus", 120, { opacity: 0.92 }, { opacity: 1 });
}

export function playWindowClose(el: HTMLElement | null, onDone: () => void): void {
  if (!el || prefersReducedMotion()) {
    onDone();
    return;
  }
  gsap.killTweensOf(el);
  gsap.to(el, {
    opacity: 0,
    duration: durationSeconds("--kellos-duration-window", 180),
    ease: "none",
    onComplete: onDone,
  });
}

export function playMenuIn(el: HTMLElement | null): void {
  runOrSkip(el, "--kellos-duration-menu", 150, { opacity: 0 }, { opacity: 1 });
}

/** Update ceremony enters like the boot overlay: a fade, never blocking the Skip button. */
export function playCeremonyIn(el: HTMLElement | null): void {
  runOrSkip(el, "--kellos-duration-boot", 400, { opacity: 0 }, { opacity: 1 });
}

/** Exit-only fade for the update ceremony. Skippable; reduced motion resolves immediately. */
export function playCeremonyOut(el: HTMLElement | null, onDone: () => void): void {
  if (!el || prefersReducedMotion()) {
    onDone();
    return;
  }
  gsap.killTweensOf(el);
  gsap.to(el, {
    opacity: 0,
    duration: durationSeconds("--kellos-duration-boot", 400),
    ease: "none",
    onComplete: onDone,
  });
}
