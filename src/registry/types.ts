/**
 * App Registry — data shape only (Phase 2).
 * One manifest feeds desktop, Start, Ctrl+K, terminal `open`, mobile, static fallback.
 * Search overlay, Terminal, and Settings runtimes consume this data — they do not keep their own lists.
 * Kelly.AI / OS Update remain empty-route rows.
 */

export type AppId =
  | "about"
  | "projects"
  | "caseStudy"
  | "skills"
  | "resume"
  | "contact"
  | "reader"
  | "now"
  | "timeline"
  | "recycle"
  | "search"
  | "terminal"
  | "kellai"
  | "settings"
  | "osUpdate";

export type AppTier = 1 | 2 | 3;

export type PixelIconName =
  | "about"
  | "projects"
  | "skills"
  | "resume"
  | "contact"
  | "recycle"
  | "now"
  | "timeline"
  | "reader";

/** Surfaces that consume the same row. A new app is a registry entry, not six edits. */
export type RegistrySurface =
  | "desktopIcon"
  | "startMenu"
  | "search"
  | "terminalOpen"
  | "mobileGrid"
  | "staticFallback"
  | "osUpdate";

export interface AppManifestEntry {
  id: AppId;
  /** Human-readable, URL-facing. NEVER a primary key. */
  slug: string;
  title: string;
  windowTitle: string;
  tier: AppTier;
  icon: PixelIconName;
  /**
   * OS-chrome path. `:slug` is a pattern for documents.
   * Empty string = reserved (Search overlay, Kelly.AI, OS Update).
   */
  route: string;
  readerRoute: string | null;
  kind: "app" | "document" | "shell";
  surfaces: Record<RegistrySurface, boolean>;
}
