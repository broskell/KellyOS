import type { AppManifestEntry, RegistrySurface } from "./types";
import {
  APP_REGISTRY,
  FEATURED_CASE_STUDY_SLUG,
  appsOn,
} from "./manifest";

export type LaunchTarget = {
  id: AppManifestEntry["id"];
  title: string;
  path: string;
  kind: AppManifestEntry["kind"];
};

/** Path the WM/router can actually open. Empty-route rows (KELL.AI, OS Update, Search overlay) return null. */
export function launchPathFor(app: AppManifestEntry): string | null {
  if (app.id === "reader") return app.readerRoute ?? "/read/about";
  if (app.id === "caseStudy") return `/project/${FEATURED_CASE_STUDY_SLUG}`;
  if (!app.route || app.route.includes(":")) return null;
  return app.route;
}

export function isCommandLaunchable(app: AppManifestEntry): boolean {
  return launchPathFor(app) !== null;
}

function keywords(app: AppManifestEntry): string[] {
  const path = launchPathFor(app);
  const keys = [app.id, app.slug, app.title, app.windowTitle];
  if (path) keys.push(path);
  if (app.id === "caseStudy") keys.push(FEATURED_CASE_STUDY_SLUG, "langchain");
  return keys.map((k) => k.toLowerCase());
}

export function launchTargetFor(app: AppManifestEntry): LaunchTarget | null {
  const path = launchPathFor(app);
  if (!path) return null;
  return { id: app.id, title: app.title, path, kind: app.kind };
}

/** Registry rows that a given surface may open — never a hardcoded app list. */
export function launchTargetsOn(surface: RegistrySurface): LaunchTarget[] {
  return appsOn(surface)
    .map(launchTargetFor)
    .filter((t): t is LaunchTarget => t !== null);
}

export function allLaunchTargets(): LaunchTarget[] {
  return APP_REGISTRY.map(launchTargetFor).filter((t): t is LaunchTarget => t !== null);
}

function score(query: string, app: AppManifestEntry): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const keys = keywords(app);
  if (keys.includes(q)) return 3;
  if (keys.some((k) => k.startsWith(q))) return 2;
  if (keys.some((k) => k.includes(q))) return 1;
  return 0;
}

export function searchRegistry(query: string, surface: RegistrySurface = "search"): LaunchTarget[] {
  const q = query.trim();
  const apps = appsOn(surface).filter(isCommandLaunchable);
  if (!q) return apps.map(launchTargetFor).filter((t): t is LaunchTarget => t !== null);
  return apps
    .map((app) => ({ app, s: score(q, app) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.app.title.localeCompare(b.app.title))
    .map((x) => launchTargetFor(x.app))
    .filter((t): t is LaunchTarget => t !== null);
}

export type ResolveResult =
  | { ok: true; target: LaunchTarget }
  | { ok: false; reason: "empty" | "none" | "ambiguous"; matches: LaunchTarget[] };

/** Terminal `open` and Search Enter: same registry, optional surface filter. */
export function resolveOpenQuery(
  raw: string,
  surface: RegistrySurface = "terminalOpen",
): ResolveResult {
  const q = raw.trim();
  if (!q) return { ok: false, reason: "empty", matches: launchTargetsOn(surface) };
  const hits = searchRegistry(q, surface);
  if (hits.length === 1) return { ok: true, target: hits[0] };
  if (hits.length === 0) return { ok: false, reason: "none", matches: [] };
  const exact = hits.filter(
    (t) =>
      t.id.toLowerCase() === q.toLowerCase() ||
      t.title.toLowerCase() === q.toLowerCase() ||
      t.path.toLowerCase() === q.toLowerCase() ||
      t.path.toLowerCase() === `/${q.toLowerCase()}`,
  );
  if (exact.length === 1) return { ok: true, target: exact[0] };
  return { ok: false, reason: "ambiguous", matches: hits };
}
