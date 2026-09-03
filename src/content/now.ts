import { makeBlocks } from "./makeBlocks";
import type { ContentBlock, VersionId } from "./types";

export type NowCategory =
  | "learning"
  | "building"
  | "openSource"
  | "applying"
  | "stuckOn"
  | "studying";

export interface NowEntry {
  id: string;
  category: NowCategory;
  /** Phase 0 label before the em dash (Learning, Building, …). */
  label: string;
  text: string;
}

export interface NowSnapshot {
  id: string;
  introducedIn: VersionId;
  /** ISO date for staleness math. Visitor-facing copy stays “August 2026”. */
  updatedAt: string;
  updatedLabel: string;
  stalenessThresholdDays: number;
  entries: NowEntry[];
}

/** Phase 0 app-content.md §3. Month-level date; day is only a sort key, not a claimed day. */
export const nowSnapshot: NowSnapshot = {
  id: "now_2026_08",
  introducedIn: "v3",
  updatedAt: "2026-08-01",
  updatedLabel: "August 2026",
  stalenessThresholdDays: 45,
  entries: [
    {
      id: "now_learning",
      category: "learning",
      label: "Learning",
      text: "DSA, networking, backend, and ML. ML is the one I'm actually stuck on; the coursework made sense and applying it independently hasn't yet.",
    },
    {
      id: "now_building",
      category: "building",
      label: "Building",
      text: "Kelly.OS, this site. It's being built in phases with the architecture decisions written down as I go, which is the first time I've worked that way.",
    },
    {
      id: "now_oss",
      category: "openSource",
      label: "Open source",
      text: "looking for the next contribution after the LangChain merge. Nothing in flight right now.",
    },
    {
      id: "now_jobs",
      category: "applying",
      label: "Job applications",
      text: "paused. I stopped for the moment to fix gaps rather than interview into them.",
    },
    {
      id: "now_sem3",
      category: "studying",
      label: "Semester 3",
      text: "ongoing at IIT Jodhpur.",
    },
  ],
};

export function daysSinceNowUpdate(at: Date, snapshot: NowSnapshot = nowSnapshot): number {
  const updated = Date.parse(`${snapshot.updatedAt}T00:00:00Z`);
  return Math.floor((at.getTime() - updated) / 86_400_000);
}

export function nowIsStale(at: Date = new Date(), snapshot: NowSnapshot = nowSnapshot): boolean {
  return daysSinceNowUpdate(at, snapshot) > snapshot.stalenessThresholdDays;
}

export function nowBlocks(at: Date = new Date(), snapshot: NowSnapshot = nowSnapshot): ContentBlock[] {
  const stale = nowIsStale(at, snapshot);
  return makeBlocks([
    {
      id: "now_date",
      type: "callout",
      variant: stale ? "caution" : "note",
      title: stale ? "Updated (stale)" : "Updated",
      text: snapshot.updatedLabel,
    },
    {
      id: "now_list",
      type: "list",
      style: "bullet",
      items: snapshot.entries.map((e) => `**${e.label}** — ${e.text}`),
    },
  ]);
}
