import { versionRank } from "./versionFlags";
import type { VersionId } from "./types";

/**
 * Version flags at content load (blueprint §4.2 / §3.7). New visitors always boot
 * the newest version. The update ceremony exists for returning visitors only.
 * This module is pure logic plus thin storage wrappers — no React, no DOM APIs
 * beyond the guarded storage accessors. Components must not ask "which version
 * are we in?"; they read already-filtered data from VersionContext.
 */

const SEEN_KEY = "kellos-seen-version";
const VIEWING_KEY = "kellos-viewing-version";

/** The version the visitor last acknowledged as the latest. */
export type VisitClass =
  | { kind: "new"; boot: VersionId }
  | { kind: "returning-current"; boot: VersionId }
  | { kind: "returning-updated"; boot: VersionId; from: VersionId; to: VersionId };

/**
 * Decide what a visit is from the persisted "seen latest" marker.
 * - No marker → a genuinely new visitor. Boot latest, no ceremony.
 * - Marker === latest → returning visitor already current. Boot latest, no ceremony.
 * - Marker older than latest → the site grew since their last visit. Run the ceremony.
 */
export function classifyVisit(seen: VersionId | null, latest: VersionId): VisitClass {
  if (seen === null) return { kind: "new", boot: latest };
  if (versionRank(seen) < versionRank(latest)) {
    return { kind: "returning-updated", boot: latest, from: seen, to: latest };
  }
  return { kind: "returning-current", boot: latest };
}

function isVersionId(v: string | null): v is VersionId {
  return v === "v1" || v === "v2" || v === "v3";
}

function safeRead(storage: () => Storage | undefined, key: string): VersionId | null {
  try {
    const s = storage();
    const raw = s?.getItem(key) ?? null;
    return isVersionId(raw) ? raw : null;
  } catch {
    return null;
  }
}

function safeWrite(storage: () => Storage | undefined, key: string, id: VersionId): void {
  try {
    storage()?.setItem(key, id);
  } catch {
    /* private mode / blocked storage — version system degrades to "always latest" */
  }
}

const localStore = () => (typeof window !== "undefined" ? window.localStorage : undefined);
const sessionStore = () => (typeof window !== "undefined" ? window.sessionStorage : undefined);

/** Persisted across visits: the latest version this visitor has acknowledged. */
export function readSeenVersion(): VersionId | null {
  return safeRead(localStore, SEEN_KEY);
}
export function writeSeenVersion(id: VersionId): void {
  safeWrite(localStore, SEEN_KEY, id);
}

/**
 * Session-scoped only: which era the visitor is currently exploring via the
 * switcher. Kept in sessionStorage so a fresh visit always starts at latest —
 * "new visitors boot latest" stays true — while a route change mid-session
 * keeps the chosen era.
 */
export function readViewingVersion(): VersionId | null {
  return safeRead(sessionStore, VIEWING_KEY);
}
export function writeViewingVersion(id: VersionId): void {
  safeWrite(sessionStore, VIEWING_KEY, id);
}

/**
 * Cumulative visibility: viewing an era shows everything present up to and
 * including it — Kelly.OS 2.0 knew eras 1 and 2, not yet era 3. Used to filter
 * timeline entries (which carry `versionEra`) at content load.
 */
export function visibleUpTo<T extends { versionEra: VersionId }>(
  entries: T[],
  viewing: VersionId,
): T[] {
  return entries.filter((e) => versionRank(e.versionEra) <= versionRank(viewing));
}
