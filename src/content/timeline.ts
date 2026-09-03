import { makeBlocks } from "./makeBlocks";
import type { ContentBlock, VersionId } from "./types";

export type TimelineKind =
  | "education"
  | "work"
  | "project"
  | "openSource"
  | "recognition"
  | "milestone";

export interface TimelineEntry {
  id: string;
  versionEra: VersionId;
  startedAt: string;
  endedAt?: string;
  kind: TimelineKind;
  title: string;
  organisation?: string;
  body: string;
  approximateDates?: boolean;
  /** Visitor-facing period; never a more precise date than Phase 0 / version-narrative. */
  periodLabel: string;
}

export const TIMELINE_ERAS: { id: VersionId; heading: string; span: string }[] = [
  { id: "v1", heading: "KELL.OS 1.0 — ORIGIN era", span: "2023 – August 2025" },
  { id: "v2", heading: "KELL.OS 2.0", span: "September 2025 – May 2026" },
  { id: "v3", heading: "KELL.OS 3.0", span: "June 2026 – present" },
];

/**
 * Derived from docs/version-narrative.md and résumé structure.
 * Future Interns is not listed as an internship. Graduation date and location are not invented.
 */
export const timelineEntries: TimelineEntry[] = [
  {
    id: "tl_mpc",
    versionEra: "v1",
    startedAt: "2023-01",
    endedAt: "2024-12",
    kind: "education",
    title: "Intermediate (MPC)",
    body: "Technology as something adjacent to school rather than a practice.",
    approximateDates: true,
    periodLabel: "2023–2024",
  },
  {
    id: "tl_fiverr",
    versionEra: "v1",
    startedAt: "2024-01",
    endedAt: "2024-12",
    kind: "work",
    title: "Freelance data processing",
    organisation: "Fiverr",
    body: "Paid data-cleaning work — three clients, roughly five to six orders, approximately ₹30,000 total, cleaning and reformatting PDFs and Excel exports with duplicate rows and spacing problems. No real software engineering. Watching YouTube videos for shortcuts and replicating things to get output fast.",
    approximateDates: true,
    periodLabel: "2024 (approx.)",
  },
  {
    id: "tl_prep",
    versionEra: "v1",
    startedAt: "2025-06",
    endedAt: "2025-08",
    kind: "milestone",
    title: "Prep gap",
    body: "A self-funded Udemy Python course, Google certifications, workshops, and the first deliberate move toward AI and Data Science.",
    periodLabel: "June–August 2025",
  },
  {
    id: "tl_iit",
    versionEra: "v2",
    startedAt: "2025-09",
    kind: "education",
    title: "BS in Applied AI & Data Science",
    organisation: "IIT Jodhpur",
    body: "Entered September 2025. Foundations: Python, SQL, data analysis, NumPy/Pandas/Matplotlib/scikit-learn, then Pattern Recognition (classification, CNNs, RNNs), AI foundations (BFS, DFS, A*, Minimax, Nash equilibrium), optimisation (gradient descent, Newton's method, convex optimisation), and visualisation across Matplotlib, Plotly, Tableau and Power BI. Result: SGPA 9.75 and 9.25, CGPA 9.44.",
    periodLabel: "September 2025 – present",
  },
  {
    id: "tl_lst",
    versionEra: "v2",
    startedAt: "2025-09",
    kind: "education",
    title: "Parallel programme",
    organisation: "LeapStart School of Technology",
    body: "HTML/CSS/JavaScript and the DOM, then React, React Router, Axios, Hooks, React Hook Form and Zod; PostgreSQL, PHP, REST APIs and Postman; Linux administration and networking — SSH, tmux, disk management, port forwarding, tunnelling, public/private IPs; Azure and Ubuntu VMs.",
    approximateDates: true,
    periodLabel: "2025–2026",
  },
  {
    id: "tl_sdlc",
    versionEra: "v2",
    startedAt: "2025-12",
    kind: "project",
    title: "SDLC workshop and Rapid Blood Bank Supply Platform MVP",
    body: "December 2025 SDLC workshop (business cases, project charters, FRDs) and the Rapid Blood Bank Supply Platform MVP.",
    periodLabel: "December 2025",
  },
  {
    id: "tl_sec",
    versionEra: "v2",
    startedAt: "2025-09",
    kind: "project",
    title: "OWASP Juice Shop assessment and Python secure-file-sharing",
    body: "OWASP Juice Shop assessment with Burp Suite and Kali Linux, and a Python secure-file-sharing system.",
    approximateDates: true,
    periodLabel: "2025–2026",
  },
  {
    id: "tl_pawsethu",
    versionEra: "v2",
    startedAt: "2025-09",
    kind: "project",
    title: "PawSethu",
    body: "Built during the ProdX Buildathon. Gallery until technical review. Not a case study.",
    approximateDates: true,
    periodLabel: "2025–2026",
  },
  {
    id: "tl_gdg",
    versionEra: "v2",
    startedAt: "2025-01",
    kind: "recognition",
    title: "Google Developer Groups",
    body: "Member, 2025–present.",
    approximateDates: true,
    periodLabel: "2025–present",
  },
  {
    id: "tl_gsoc",
    versionEra: "v3",
    startedAt: "2026-06",
    kind: "openSource",
    title: "GirlScript Summer of Code",
    body: "Contributor, 2026.",
    approximateDates: true,
    periodLabel: "2026",
  },
  {
    id: "tl_bigcode",
    versionEra: "v3",
    startedAt: "2026-06",
    kind: "recognition",
    title: "Google BigCode Challenge",
    body: "Top 1,500 of 15,000+ participants, 2026.",
    approximateDates: true,
    periodLabel: "2026",
  },
  {
    id: "tl_langchain",
    versionEra: "v3",
    startedAt: "2026-06",
    kind: "openSource",
    title: "Merged feature PR in langchain-ai/langchain",
    body: "PR #39301. That's the first time my code was judged by people who had no reason to be kind about it.",
    approximateDates: true,
    periodLabel: "2026",
  },
  {
    id: "tl_indep",
    versionEra: "v3",
    startedAt: "2026-06",
    kind: "education",
    title: "Independent study and Semester 3",
    organisation: "IIT Jodhpur",
    body: "Independent study continues in Docker, cybersecurity, and modern full-stack development. Semester 3 is ongoing.",
    periodLabel: "June 2026 – present",
  },
  {
    id: "tl_kellos",
    versionEra: "v3",
    startedAt: "2026-06",
    kind: "project",
    title: "KELL.OS",
    body: "This site. Being built. Case study deferred until after Phase 18.",
    periodLabel: "June 2026 – present",
  },
];

const ERA_READINGS: Record<VersionId, { title: string; text: string }> = {
  v1: {
    title: "The honest reading",
    text: "Money was earned, but nothing was built.",
  },
  v2: {
    title: "The honest reading",
    text: "The volume era. Enormous breadth acquired, most of it taught rather than earned through failure. What ended it: completing Semester 2, and the shift from taught learning to independent work.",
  },
  v3: {
    title: "The honest reading",
    text: "The first era with external verification in it. Ongoing. No end date claimed. No 4.0 is claimed.",
  },
};

export function timelineBlocks(entries: TimelineEntry[] = timelineEntries): ContentBlock[] {
  const drafts: object[] = [
    {
      id: "tl_intro",
      type: "prose",
      text: "2023 → present, grouped by version era. Carries the academic record (CGPA 9.44) and the recognitions. New visitors always boot the newest version.",
    },
  ];
  for (const era of TIMELINE_ERAS) {
    const eraEntries = entries.filter((e) => e.versionEra === era.id);
    // Skip an era with no visible entries — when viewing an older version, later
    // eras are not yet part of the OS, so they do not appear at all.
    if (eraEntries.length === 0) continue;
    drafts.push({
      id: `tl_${era.id}_h`,
      type: "heading",
      level: 2,
      text: `${era.heading} (${era.span})`,
      anchor: era.id,
    });
    for (const entry of eraEntries) {
      drafts.push({
        id: `${entry.id}_h`,
        type: "heading",
        level: 3,
        text: entry.title,
        anchor: entry.id,
      });
      drafts.push({
        id: `${entry.id}_kv`,
        type: "keyValue",
        rows: [
          { key: "When", value: entry.periodLabel },
          ...(entry.organisation ? [{ key: "Where", value: entry.organisation }] : []),
        ],
      });
      drafts.push({
        id: `${entry.id}_p`,
        type: "prose",
        text: entry.body,
      });
    }
    const reading = ERA_READINGS[era.id];
    drafts.push({
      id: `tl_${era.id}_read`,
      type: "callout",
      variant: "limitation",
      title: reading.title,
      text: reading.text,
    });
  }
  return makeBlocks(drafts);
}
