import type { OSVersion, VersionId } from "./types";

/**
 * Visitor-side OS version records. V1.0 ships with zero backend, so these are
 * hand-authored here from docs/version-narrative.md (the same source the server
 * seed uses). When an emitted ContentBundle exists, bundle.versions wins — see
 * live.ts. Versions are feature flags over one data set, never separate builds.
 *
 * `features: []` on purpose: there are no invented feature flags. What each era
 * introduced is expressed as real content (timeline entries carry `versionEra`),
 * not as a fabricated flag table.
 */
export const OS_VERSIONS: OSVersion[] = [
  {
    id: "v1",
    number: "1.0",
    codename: "ORIGIN",
    eraStart: "2023-01",
    eraEnd: "2025-08",
    eraSummary:
      "Intermediate (MPC), and technology as something adjacent to school rather than a practice. Paid data-cleaning work on Fiverr in 2024. No real software engineering. Ends with the June–August 2025 prep gap. The honest reading: money was earned, but nothing was built.",
    sequence: 1,
    isLatest: false,
    features: [],
    releasedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "v2",
    number: "2.0",
    eraStart: "2025-09",
    eraEnd: "2026-05",
    eraSummary:
      "Two programmes in parallel — BS Applied AI & Data Science at IIT Jodhpur, and LeapStart School of Technology. The volume era. Enormous breadth acquired, most of it taught rather than earned through failure.",
    sequence: 2,
    isLatest: false,
    features: [],
    releasedAt: "2025-09-01T00:00:00Z",
  },
  {
    id: "v3",
    number: "3.0",
    eraStart: "2026-06",
    eraSummary:
      "The first era with external verification in it. Ongoing. No end date claimed. No 4.0 is claimed. New visitors always boot the newest version.",
    sequence: 3,
    isLatest: true,
    features: [],
    releasedAt: "2026-06-01T00:00:00Z",
  },
];

/**
 * What each version represents in the product, from the version-narrative.md
 * table. Display copy for the OS Update app — not a content type field, so it
 * carries no visual styling and does not touch the block contract.
 */
export const VERSION_REPRESENTS: Record<VersionId, string> = {
  v1: "Before the work began. Sparsest data set — Fiverr, the intermediate years, the prep gap.",
  v2: "The learning volume. Coursework, LeapStart, the bulk of the project inventory.",
  v3: "External verification. LangChain, GSoC, BigCode, Kelly.OS. Newest visitors boot here.",
};

/** Human span for an era, e.g. "2023 – August 2025". Never more precise than the narrative. */
export const VERSION_SPANS: Record<VersionId, string> = {
  v1: "2023 – August 2025",
  v2: "September 2025 – May 2026",
  v3: "June 2026 – present",
};

export function osVersion(id: VersionId): OSVersion {
  return OS_VERSIONS.find((v) => v.id === id) ?? OS_VERSIONS[OS_VERSIONS.length - 1];
}

export const LATEST_VERSION: OSVersion =
  OS_VERSIONS.find((v) => v.isLatest) ?? OS_VERSIONS[OS_VERSIONS.length - 1];

export const LATEST_VERSION_ID: VersionId = LATEST_VERSION.id;
