import type { AppManifestEntry, RegistrySurface } from "./types";

const none: Record<RegistrySurface, boolean> = {
  desktopIcon: false,
  startMenu: false,
  search: false,
  terminalOpen: false,
  mobileGrid: false,
  staticFallback: false,
  osUpdate: false,
};

function surfaces(on: RegistrySurface[]): Record<RegistrySurface, boolean> {
  const next = { ...none };
  for (const s of on) next[s] = true;
  return next;
}

/**
 * Canonical V1 registry. Reader Mode is Tier 1 by Phase 1 decision
 * (app-inventory.md still lists it under Tier 2 placement — overridden).
 * Gallery is a view inside Projects, not an entry.
 */
export const APP_REGISTRY: AppManifestEntry[] = [
  {
    id: "about",
    slug: "about",
    title: "About Me",
    windowTitle: "About Me — Saathvik Kellampalli",
    tier: 1,
    icon: "about",
    route: "/about",
    readerRoute: "/read/about",
    kind: "app",
    surfaces: surfaces([
      "desktopIcon",
      "startMenu",
      "search",
      "terminalOpen",
      "mobileGrid",
      "staticFallback",
    ]),
  },
  {
    id: "projects",
    slug: "projects",
    title: "Projects",
    windowTitle: "Projects",
    tier: 1,
    icon: "projects",
    route: "/projects",
    readerRoute: "/read/projects",
    kind: "app",
    surfaces: surfaces([
      "desktopIcon",
      "startMenu",
      "search",
      "terminalOpen",
      "mobileGrid",
      "staticFallback",
    ]),
  },
  {
    id: "caseStudy",
    slug: "case-study",
    title: "Case Study Reader",
    windowTitle: "Case Study",
    tier: 1,
    icon: "projects",
    route: "/project/:slug",
    readerRoute: "/read/project/:slug",
    kind: "document",
    surfaces: surfaces(["search", "terminalOpen", "staticFallback"]),
  },
  {
    id: "skills",
    slug: "skills",
    title: "Skills",
    windowTitle: "Skills — evidence type, not ability",
    tier: 1,
    icon: "skills",
    route: "/skills",
    readerRoute: "/read/skills",
    kind: "app",
    surfaces: surfaces([
      "desktopIcon",
      "startMenu",
      "search",
      "terminalOpen",
      "mobileGrid",
      "staticFallback",
    ]),
  },
  {
    id: "resume",
    slug: "resume",
    title: "Résumé",
    windowTitle: "Résumé",
    tier: 1,
    icon: "resume",
    route: "/resume",
    readerRoute: "/read/resume",
    kind: "app",
    surfaces: surfaces([
      "desktopIcon",
      "startMenu",
      "search",
      "terminalOpen",
      "mobileGrid",
      "staticFallback",
    ]),
  },
  {
    id: "contact",
    slug: "contact",
    title: "Contact",
    windowTitle: "Contact",
    tier: 1,
    icon: "contact",
    route: "/contact",
    readerRoute: "/read/contact",
    kind: "app",
    surfaces: surfaces([
      "desktopIcon",
      "startMenu",
      "search",
      "terminalOpen",
      "mobileGrid",
      "staticFallback",
    ]),
  },
  {
    id: "reader",
    slug: "reader",
    title: "Reader Mode",
    windowTitle: "Reader Mode",
    tier: 1,
    icon: "reader",
    route: "/read/about",
    readerRoute: "/read/about",
    kind: "shell",
    surfaces: surfaces(["startMenu", "search", "staticFallback"]),
  },
  {
    id: "now",
    slug: "now",
    title: "Now",
    windowTitle: "Now",
    tier: 2,
    icon: "now",
    route: "/now",
    readerRoute: "/read/now",
    kind: "app",
    surfaces: surfaces([
      "desktopIcon",
      "startMenu",
      "search",
      "terminalOpen",
      "mobileGrid",
      "staticFallback",
    ]),
  },
  {
    id: "timeline",
    slug: "timeline",
    title: "Timeline",
    windowTitle: "Timeline",
    tier: 2,
    icon: "timeline",
    route: "/timeline",
    readerRoute: "/read/timeline",
    kind: "app",
    surfaces: surfaces([
      "desktopIcon",
      "startMenu",
      "search",
      "terminalOpen",
      "mobileGrid",
      "staticFallback",
    ]),
  },
  {
    id: "recycle",
    slug: "recycle",
    title: "Recycle Bin",
    windowTitle: "Recycle Bin",
    tier: 2,
    icon: "recycle",
    route: "/recycle",
    readerRoute: "/read/recycle",
    kind: "app",
    surfaces: surfaces([
      "desktopIcon",
      "startMenu",
      "search",
      "terminalOpen",
      "mobileGrid",
      "staticFallback",
    ]),
  },
  {
    id: "search",
    slug: "search",
    title: "Search",
    windowTitle: "Search",
    tier: 2,
    icon: "about",
    route: "",
    readerRoute: null,
    kind: "shell",
    surfaces: surfaces(["search"]),
  },
  {
    id: "terminal",
    slug: "terminal",
    title: "Terminal",
    windowTitle: "Terminal",
    tier: 3,
    icon: "about",
    route: "/terminal",
    readerRoute: null,
    kind: "app",
    surfaces: surfaces(["search", "terminalOpen"]),
  },
  {
    id: "kellai",
    slug: "kell-ai",
    title: "Kelly.AI",
    windowTitle: "Kelly.AI",
    tier: 3,
    icon: "about",
    route: "/kell-ai",
    readerRoute: null,
    kind: "app",
    surfaces: surfaces(["search", "terminalOpen"]),
  },
  {
    id: "settings",
    slug: "settings",
    title: "Settings",
    windowTitle: "Settings",
    tier: 3,
    icon: "about",
    route: "/settings",
    readerRoute: null,
    kind: "app",
    surfaces: surfaces(["search", "terminalOpen", "osUpdate"]),
  },
  {
    id: "osUpdate",
    slug: "os-update",
    title: "OS Update",
    windowTitle: "OS Update",
    tier: 3,
    icon: "about",
    route: "/os-update",
    readerRoute: null,
    kind: "app",
    surfaces: surfaces(["osUpdate", "search", "terminalOpen"]),
  },
];

export function appsOn(surface: RegistrySurface): AppManifestEntry[] {
  return APP_REGISTRY.filter((a) => a.surfaces[surface]);
}

/** Visitor chrome: Start, desktop, mobile grid. Empty-route rows stay data only. */
export function isVisitorLaunchable(app: AppManifestEntry): boolean {
  if (app.id === "reader") {
    return Boolean(app.readerRoute ?? app.route);
  }
  return Boolean(app.route) && !app.route.includes(":");
}

export function appsLaunchableOn(surface: RegistrySurface): AppManifestEntry[] {
  return appsOn(surface).filter(isVisitorLaunchable);
}

export function appById(id: AppManifestEntry["id"]): AppManifestEntry | undefined {
  return APP_REGISTRY.find((a) => a.id === id);
}

export function appByRoute(pathname: string): AppManifestEntry | undefined {
  if (pathname === "/" || pathname === "/about") return appById("about");
  if (pathname.startsWith("/project/")) return appById("caseStudy");
  if (pathname.startsWith("/read/project/")) return appById("caseStudy");
  if (pathname.startsWith("/read/")) {
    const rest = pathname.slice("/read/".length);
    if (rest === "about" || rest === "") return appById("about");
    return APP_REGISTRY.find((a) => a.readerRoute === pathname || a.slug === rest);
  }
  return APP_REGISTRY.find((a) => a.route === pathname);
}

export function readerPathFor(pathname: string): string {
  if (pathname.startsWith("/read/")) return pathname === "/read" || pathname === "/read/" ? "/read/about" : pathname;
  if (pathname === "/" || pathname === "/about") return "/read/about";
  const m = pathname.match(/^\/project\/([^/]+)$/);
  if (m) return `/read/project/${m[1]}`;
  const entry = APP_REGISTRY.find((a) => a.route === pathname);
  return entry?.readerRoute ?? "/read/about";
}

export const FEATURED_CASE_STUDY_SLUG = "langchain-openrouter-provider";
