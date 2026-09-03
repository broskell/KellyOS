/**
 * Launch identity. Chrome and metadata say **Kelly.OS 1.0**.
 * Optional subtitle: ORIGIN era. Never a naked ORIGIN as the OS title.
 * The scrollytelling **project** ORIGIN is a project name, not a version string.
 *
 * Override the public origin at build with KELLOS_SITE_URL or VITE_SITE_URL.
 */

export const OS_PRODUCT = "Kelly.OS 1.0";
export const OS_ERA_SUBTITLE = "ORIGIN era";
export const OG_IMAGE_PATH = "/og.png";
export const OG_IMAGE_ALT =
  "Kelly.OS 1.0 wordmark on Win95-style chrome. ORIGIN era. Not a project screenshot.";

/** Default production origin until a custom domain is attached. */
export const DEFAULT_SITE_ORIGIN = "https://kellos.vercel.app";

export function siteOrigin(): string {
  const node =
    typeof process !== "undefined" ? process.env.KELLOS_SITE_URL?.trim() : undefined;
  const vite = import.meta.env.VITE_SITE_URL?.trim();
  const raw = node || vite || DEFAULT_SITE_ORIGIN;
  return raw.replace(/\/$/, "");
}

export function canonicalFor(path: string): string {
  const origin = siteOrigin();
  if (path === "/") return `${origin}/`;
  const clean = path.endsWith("/") ? path.slice(0, -1) : path;
  return `${origin}${clean}`;
}

export function ogImageUrl(): string {
  return `${siteOrigin()}${OG_IMAGE_PATH}`;
}

export interface PageHead {
  path: string;
  title: string;
  description: string;
}

const DISCLOSURE = "I develop AI-assisted, and I say so on the page.";

export const PAGE_HEADS: PageHead[] = [
  {
    path: "/",
    title: `${OS_PRODUCT} — Saathvik Kellampalli`,
    description: `Developer portfolio as an OS. ${OS_PRODUCT} (${OS_ERA_SUBTITLE}). ${DISCLOSURE}`,
  },
  {
    path: "/about",
    title: `About Me — ${OS_PRODUCT}`,
    description: `About Me. ${DISCLOSURE}`,
  },
  {
    path: "/projects",
    title: `Projects — ${OS_PRODUCT}`,
    description: "One case study plus a gallery view. Named rows are not case studies.",
  },
  {
    path: "/project/langchain-openrouter-provider",
    title: `Landing a feature in LangChain in 24 hours — ${OS_PRODUCT}`,
    description: "The only externally verified engineering work in this portfolio.",
  },
  {
    path: "/skills",
    title: `Skills — ${OS_PRODUCT}`,
    description: "Evidence tiers, not percentages.",
  },
  {
    path: "/resume",
    title: `Résumé — ${OS_PRODUCT}`,
    description: "On-page résumé. PDF withheld until current.",
  },
  {
    path: "/contact",
    title: `Contact — ${OS_PRODUCT}`,
    description: "Email, GitHub, LinkedIn, X. Phone and Discord are not published.",
  },
  {
    path: "/recycle",
    title: `Recycle Bin — ${OS_PRODUCT}`,
    description: "Abandoned projects.",
  },
  {
    path: "/now",
    title: `Now — ${OS_PRODUCT}`,
    description: "Current activity, visibly dated.",
  },
  {
    path: "/timeline",
    title: `Timeline — ${OS_PRODUCT}`,
    description: "2023 to present, grouped by version era. Kelly.OS 1.0 is ORIGIN era.",
  },
  {
    path: "/terminal",
    title: `Terminal — ${OS_PRODUCT}`,
    description: "Command surface. open and ls read the app registry.",
  },
  {
    path: "/settings",
    title: `Settings — ${OS_PRODUCT}`,
    description: "Wordmark and reduced-motion note. Not a theme lab.",
  },
  {
    path: "/read/about",
    title: `About Me — Reader Mode — ${OS_PRODUCT}`,
    description: `About Me. ${DISCLOSURE}`,
  },
  {
    path: "/read/projects",
    title: `Projects — Reader Mode — ${OS_PRODUCT}`,
    description: "One case study plus a gallery view.",
  },
  {
    path: "/read/project/langchain-openrouter-provider",
    title: `LangChain case study — Reader Mode — ${OS_PRODUCT}`,
    description: "The only externally verified engineering work in this portfolio.",
  },
  {
    path: "/read/skills",
    title: `Skills — Reader Mode — ${OS_PRODUCT}`,
    description: "Evidence tiers, not percentages.",
  },
  {
    path: "/read/resume",
    title: `Résumé — Reader Mode — ${OS_PRODUCT}`,
    description: "On-page résumé.",
  },
  {
    path: "/read/contact",
    title: `Contact — Reader Mode — ${OS_PRODUCT}`,
    description: "Email, GitHub, LinkedIn, X.",
  },
  {
    path: "/read/recycle",
    title: `Recycle Bin — Reader Mode — ${OS_PRODUCT}`,
    description: "Abandoned projects.",
  },
  {
    path: "/read/now",
    title: `Now — Reader Mode — ${OS_PRODUCT}`,
    description: "Current activity, visibly dated.",
  },
  {
    path: "/read/timeline",
    title: `Timeline — Reader Mode — ${OS_PRODUCT}`,
    description: "2023 to present, grouped by version era.",
  },
];

const byPath = new Map(PAGE_HEADS.map((p) => [p.path, p]));

export function headForPath(pathname: string): PageHead & { canonical: string; ogImage: string } {
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const page = byPath.get(path) ?? PAGE_HEADS[0]!;
  return {
    ...page,
    canonical: canonicalFor(page.path),
    ogImage: ogImageUrl(),
  };
}

export function sitemapPaths(): string[] {
  return PAGE_HEADS.filter((p) => !p.path.startsWith("/terminal") && !p.path.startsWith("/settings")).map(
    (p) => p.path,
  );
}
