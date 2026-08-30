/** Read motion durations from frozen CSS tokens. Safe to call from the bind layer — not from wm/core. */

export function parseDurationToMs(raw: string, fallbackMs: number): number {
  const t = raw.trim().toLowerCase();
  if (!t) return fallbackMs;
  let ms: number;
  if (t.endsWith("ms")) ms = Number.parseFloat(t);
  else if (t.endsWith("s")) ms = Number.parseFloat(t) * 1000;
  else ms = Number.parseFloat(t);
  if (!Number.isFinite(ms) || ms < 0) return fallbackMs;
  return ms;
}

export function durationMs(token: string, fallbackMs: number): number {
  if (typeof document === "undefined") return fallbackMs;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token);
  return parseDurationToMs(raw, fallbackMs);
}

export function durationSeconds(token: string, fallbackMs: number): number {
  return durationMs(token, fallbackMs) / 1000;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
