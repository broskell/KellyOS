import type {
  AssetRecord,
  NowSnapshot,
  OSVersion,
  Project,
  Skill,
  TimelineEntry,
} from "../../src/content/types";
import type { ContentStore } from "./store";

function clone<T>(value: T): T {
  return structuredClone(value);
}

export class MemoryContentStore implements ContentStore {
  private projects = new Map<string, Project>();
  private skills = new Map<string, Skill>();
  private timeline = new Map<string, TimelineEntry>();
  private now: NowSnapshot | null = null;
  private versions = new Map<string, OSVersion>();
  private assets = new Map<string, AssetRecord>();

  async ping(): Promise<void> {}

  async listProjects(): Promise<Project[]> {
    return [...this.projects.values()].map(clone);
  }
  async getProject(id: string): Promise<Project | null> {
    const row = this.projects.get(id);
    return row ? clone(row) : null;
  }
  async putProject(project: Project): Promise<Project> {
    this.projects.set(project.id, clone(project));
    return clone(project);
  }

  async listSkills(): Promise<Skill[]> {
    return [...this.skills.values()].map(clone);
  }
  async getSkill(id: string): Promise<Skill | null> {
    const row = this.skills.get(id);
    return row ? clone(row) : null;
  }
  async putSkill(skill: Skill): Promise<Skill> {
    this.skills.set(skill.id, clone(skill));
    return clone(skill);
  }

  async listTimeline(): Promise<TimelineEntry[]> {
    return [...this.timeline.values()].map(clone);
  }
  async getTimeline(id: string): Promise<TimelineEntry | null> {
    const row = this.timeline.get(id);
    return row ? clone(row) : null;
  }
  async putTimeline(entry: TimelineEntry): Promise<TimelineEntry> {
    this.timeline.set(entry.id, clone(entry));
    return clone(entry);
  }

  async getNow(): Promise<NowSnapshot | null> {
    return this.now ? clone(this.now) : null;
  }
  async putNow(snapshot: NowSnapshot): Promise<NowSnapshot> {
    this.now = clone(snapshot);
    return clone(snapshot);
  }

  async listVersions(): Promise<OSVersion[]> {
    return [...this.versions.values()].map(clone);
  }
  async getVersion(id: string): Promise<OSVersion | null> {
    const row = this.versions.get(id);
    return row ? clone(row) : null;
  }
  async putVersion(version: OSVersion): Promise<OSVersion> {
    if (version.isLatest) {
      for (const [id, row] of this.versions) {
        if (id !== version.id && row.isLatest) {
          this.versions.set(id, { ...row, isLatest: false });
        }
      }
    }
    this.versions.set(version.id, clone(version));
    return clone(version);
  }

  async listAssets(): Promise<AssetRecord[]> {
    return [...this.assets.values()].map(clone);
  }
  async getAsset(id: string): Promise<AssetRecord | null> {
    const row = this.assets.get(id);
    return row ? clone(row) : null;
  }
  async putAsset(asset: AssetRecord): Promise<AssetRecord> {
    this.assets.set(asset.id, clone(asset));
    return clone(asset);
  }
}
