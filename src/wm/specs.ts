import { FEATURED_CASE_STUDY_SLUG, appByRoute } from "../registry/manifest";
import type { WindowSpec } from "./core";

export const TIP_ID = "tip:getting-around";

export function specForPath(pathname: string): WindowSpec | null {
  if (pathname.startsWith("/read")) return null;

  const project = pathname.match(/^\/project\/([^/]+)$/);
  if (project) {
    const slug = project[1] ?? FEATURED_CASE_STUDY_SLUG;
    return {
      id: `doc:caseStudy:${slug}`,
      appId: "caseStudy",
      title: slug === FEATURED_CASE_STUDY_SLUG ? `Case Study — ${slug}` : "Case Study",
      route: `/project/${slug}`,
      kind: "document",
    };
  }

  const path = pathname === "/" ? "/about" : pathname;
  const entry = appByRoute(path);
  if (!entry || !entry.route || entry.route.includes(":") || entry.kind === "shell") return null;
  return {
    id: `app:${entry.id}`,
    appId: entry.id,
    title: entry.title,
    route: entry.route === "/about" ? (pathname === "/" ? "/" : "/about") : entry.route,
    kind: "app",
  };
}

export function tipSpec(route: string): WindowSpec {
  return {
    id: TIP_ID,
    appId: "help",
    title: "Getting around",
    route,
    kind: "tip",
    preferred: { w: 320, h: 340 },
  };
}

export function pathAfterClosingWindow(
  closed: { kind: WindowSpec["kind"]; route: string },
  nextFocusedRoute: string | null,
  currentPath: string,
): string | null {
  if (closed.kind === "tip") return null;
  if (nextFocusedRoute && nextFocusedRoute !== currentPath) return nextFocusedRoute;
  if (closed.route !== "/" && currentPath !== "/") return "/";
  return null;
}

export function knownDesktopPath(pathname: string): boolean {
  if (pathname === "/" || pathname === "/about") return true;
  if (pathname === "/projects" || pathname === "/skills" || pathname === "/resume") return true;
  if (pathname === "/contact" || pathname === "/recycle") return true;
  if (pathname === "/now" || pathname === "/timeline") return true;
  if (pathname === "/terminal" || pathname === "/settings") return true;
  if (pathname === "/os-update" || pathname === "/kell-ai") return true;
  if (pathname === "/paint" || pathname === "/wallpaper") return true;
  if (pathname.startsWith("/project/")) return true;
  return false;
}
