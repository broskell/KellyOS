/**
 * Optional load of the V1 hand-authored bundle into the editing database.
 * Does not change visitor TypeScript modules. Does not set verified: true.
 * Does not invent gallery cuts, metrics, or dates that are not already in src/content.
 */
import { langchainBlocks } from "../../src/content/langchain";
import { nowSnapshot } from "../../src/content/now";
import { featuredCaseStudy } from "../../src/content/projects";
import { skillTiers } from "../../src/content/skills";
import { timelineEntries } from "../../src/content/timeline";
import type {
  NowSnapshot,
  OSVersion,
  Project,
  PublishState,
  Skill,
  TimelineEntry,
} from "../../src/content/types";
import { createMongoClient, databaseNameFromUri, openEditingDatabase } from "./db";
import { MongoContentStore } from "./mongoStore";

const NOW = "2026-08-30T00:00:00Z";

function draft(blockers: string[] = []): PublishState {
  return {
    status: "draft",
    updatedAt: NOW,
    blockers: blockers.length ? blockers : undefined,
  };
}

function skillId(name: string): string {
  return `sk_${name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}`;
}

export function v1SeedDocuments(): {
  versions: OSVersion[];
  timeline: TimelineEntry[];
  now: NowSnapshot;
  skills: Skill[];
  projects: Project[];
} {
  const versions: OSVersion[] = [
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

  const timeline: TimelineEntry[] = timelineEntries.map((entry) => ({
    id: entry.id,
    versionEra: entry.versionEra,
    introducedIn: entry.versionEra,
    startedAt: entry.startedAt,
    endedAt: entry.endedAt,
    kind: entry.kind,
    title: entry.title,
    organisation: entry.organisation,
    body: entry.body,
    approximateDates: entry.approximateDates,
    publish: draft(),
  }));

  const now: NowSnapshot = {
    id: nowSnapshot.id,
    introducedIn: nowSnapshot.introducedIn,
    updatedAt: nowSnapshot.updatedAt,
    stalenessThresholdDays: nowSnapshot.stalenessThresholdDays,
    entries: nowSnapshot.entries.map((entry) => ({
      id: entry.id,
      category: entry.category,
      text: entry.text,
      publish: draft(),
    })),
    publish: draft(),
  };

  const skills: Skill[] = [];
  for (const row of skillTiers[1].items) {
    skills.push({
      id: skillId(row.name),
      name: row.name,
      tier: 1,
      category: row.name.includes("Python") ? "language" : row.name.includes("Excel") ? "data" : "tooling",
      evidence: [{ kind: "mergedPR", statement: row.evidence }],
      scopeNote: row.scopeNote,
      introducedIn: "v3",
      publish: draft(["A1.1 URL verification still open — evidence URL not stored"]),
    });
  }
  const excel = skills.find((s) => s.name.startsWith("Excel"));
  if (excel) {
    excel.evidence = [{ kind: "paidWork", statement: skillTiers[1].items[2]!.evidence, approximate: true }];
  }
  for (const name of skillTiers[2].names) {
    skills.push({
      id: skillId(name),
      name,
      tier: 2,
      category: "other",
      evidence: [{ kind: "deployedProject", statement: skillTiers[2].subtitle }],
      introducedIn: "v2",
      publish: draft(["Per-skill deployed project not named in V1 — using the Tier 2 subtitle as evidence"]),
    });
  }
  for (const name of skillTiers[3].names) {
    skills.push({
      id: skillId(name),
      name,
      tier: 3,
      category: "other",
      evidence: [{ kind: "coursework", statement: skillTiers[3].subtitle }],
      introducedIn: "v2",
      publish: draft(["Per-skill instance not named in V1 — using the Tier 3 subtitle as evidence"]),
    });
  }

  const linkGroup = langchainBlocks.find((b) => b.type === "linkGroup");
  const links = linkGroup && linkGroup.type === "linkGroup" ? linkGroup.links : [];

  const langchain: Project = {
    id: "prj_langchain",
    slug: featuredCaseStudy.slug,
    title: featuredCaseStudy.title,
    tagline: featuredCaseStudy.tagline,
    tier: "caseStudy",
    status: "live",
    authorship: "aiAssisted",
    rank: 1,
    startedAt: "2026-06",
    stack: ["Python", "LangChain", "OpenRouter"],
    links,
    blocks: langchainBlocks,
    role: { solo: true },
    introducedIn: "v3",
    publish: draft([
      "A1.1 URL verification still open",
      "A1.4 unaided explanation still open",
    ]),
  };

  const pawsethu: Project = {
    id: "prj_pawsethu",
    slug: "pawsethu",
    title: "PawSethu",
    tagline: "A digital identity and care platform for pets",
    tier: "gallery",
    status: "unlaunched",
    authorship: "aiAssisted",
    rank: 20,
    startedAt: "2025-09",
    stack: [],
    links: [],
    blocks: [],
    role: { solo: true },
    introducedIn: "v2",
    publish: draft(["Gallery until technical review. Not a case study.", "A3.8 gallery cut still open"]),
  };

  return { versions, timeline, now, skills, projects: [langchain, pawsethu] };
}

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is required to seed. Do not put it in source control.");
    process.exit(1);
  }
  const dbName = process.env.MONGODB_DB || databaseNameFromUri(uri, "kellos_edit");
  const client = createMongoClient(uri);
  const db = await openEditingDatabase(client, dbName);
  const store = new MongoContentStore(db);
  await store.ensureIndexesAndValidators();
  const seed = v1SeedDocuments();
  for (const version of seed.versions) await store.putVersion(version);
  for (const entry of seed.timeline) await store.putTimeline(entry);
  await store.putNow(seed.now);
  for (const skill of seed.skills) await store.putSkill(skill);
  for (const project of seed.projects) await store.putProject(project);
  await client.close();
  console.log(
    `Seeded ${seed.versions.length} versions, ${seed.timeline.length} timeline, ${seed.skills.length} skills, ${seed.projects.length} projects, 1 now snapshot. Assets empty (A3.1–A3.6 still missing). Roast My Project and Ducati not seeded — no startedAt in the V1 typed modules.`,
  );
}

const runningSeed = (process.argv[1] ?? "").replaceAll("\\", "/").includes("/seed.ts");
if (runningSeed) {
  main().catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : "seed failed");
    process.exit(1);
  });
}
