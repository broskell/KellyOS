import type {
  AssetRecord,
  ContentBundle,
  NowSnapshot,
  OSVersion,
  Project,
  Skill,
  TimelineEntry,
} from "../../src/content/types";

export interface ContentStore {
  ping(): Promise<void>;
  listProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | null>;
  putProject(project: Project): Promise<Project>;
  listSkills(): Promise<Skill[]>;
  getSkill(id: string): Promise<Skill | null>;
  putSkill(skill: Skill): Promise<Skill>;
  listTimeline(): Promise<TimelineEntry[]>;
  getTimeline(id: string): Promise<TimelineEntry | null>;
  putTimeline(entry: TimelineEntry): Promise<TimelineEntry>;
  getNow(): Promise<NowSnapshot | null>;
  putNow(snapshot: NowSnapshot): Promise<NowSnapshot>;
  listVersions(): Promise<OSVersion[]>;
  getVersion(id: string): Promise<OSVersion | null>;
  putVersion(version: OSVersion): Promise<OSVersion>;
  listAssets(): Promise<AssetRecord[]>;
  getAsset(id: string): Promise<AssetRecord | null>;
  putAsset(asset: AssetRecord): Promise<AssetRecord>;
}

export async function assembleBundle(store: ContentStore, generatedAt: string): Promise<ContentBundle> {
  const [versions, projects, skills, timeline, now, assetRows] = await Promise.all([
    store.listVersions(),
    store.listProjects(),
    store.listSkills(),
    store.listTimeline(),
    store.getNow(),
    store.listAssets(),
  ]);
  const assets: ContentBundle["assets"] = {};
  for (const row of assetRows) {
    assets[row.id] = { url: row.url, width: row.width, height: row.height };
  }
  if (!now) {
    throw new Error("now snapshot is missing — Phase 12 must author one before a bundle exists");
  }
  return {
    schemaVersion: "1.0.0",
    generatedAt,
    versions,
    projects,
    skills,
    timeline,
    now,
    assets,
  };
}
