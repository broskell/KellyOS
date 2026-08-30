import type { Collection, Db } from "mongodb";
import type {
  AssetRecord,
  NowSnapshot,
  OSVersion,
  Project,
  Skill,
  TimelineEntry,
} from "../../src/content/types";
import { COLLECTIONS, PROJECT_VALIDATOR, SKILL_VALIDATOR } from "./schema";
import type { ContentStore } from "./store";

type WithId<T extends { id: string }> = T & { _id: string };

function toDoc<T extends { id: string }>(row: T): WithId<T> {
  return { ...row, _id: row.id };
}

function fromDoc<T extends { id: string }>(row: WithId<T> | null): T | null {
  if (!row) return null;
  const { _id: _, ...rest } = row;
  return rest as unknown as T;
}

export class MongoContentStore implements ContentStore {
  constructor(private readonly db: Db) {}

  private col<T extends { id: string }>(name: string): Collection<WithId<T>> {
    return this.db.collection(name);
  }

  async ping(): Promise<void> {
    await this.db.command({ ping: 1 });
  }

  async ensureIndexesAndValidators(): Promise<void> {
    await this.db.createCollection(COLLECTIONS.projects).catch(() => undefined);
    await this.db.createCollection(COLLECTIONS.skills).catch(() => undefined);
    await this.db.createCollection(COLLECTIONS.timeline).catch(() => undefined);
    await this.db.createCollection(COLLECTIONS.now).catch(() => undefined);
    await this.db.createCollection(COLLECTIONS.versions).catch(() => undefined);
    await this.db.createCollection(COLLECTIONS.assets).catch(() => undefined);

    await this.db.command({
      collMod: COLLECTIONS.projects,
      validator: PROJECT_VALIDATOR,
      validationLevel: "moderate",
    }).catch(() => undefined);
    await this.db.command({
      collMod: COLLECTIONS.skills,
      validator: SKILL_VALIDATOR,
      validationLevel: "moderate",
    }).catch(() => undefined);

    await this.col<Project>(COLLECTIONS.projects).createIndexes([
      { key: { slug: 1 }, unique: true },
      { key: { "publish.status": 1 } },
      { key: { introducedIn: 1 } },
    ]);
    await this.col<Skill>(COLLECTIONS.skills).createIndex({ name: 1 }, { unique: true });
    await this.col<TimelineEntry>(COLLECTIONS.timeline).createIndex({ versionEra: 1, startedAt: 1 });
    await this.col<OSVersion>(COLLECTIONS.versions).createIndex({ sequence: 1 }, { unique: true });
  }

  async listProjects(): Promise<Project[]> {
    const rows = await this.col<Project>(COLLECTIONS.projects).find().toArray();
    return rows.map((row) => fromDoc(row)!);
  }
  async getProject(id: string): Promise<Project | null> {
    return fromDoc(await this.col<Project>(COLLECTIONS.projects).findOne({ _id: id }));
  }
  async putProject(project: Project): Promise<Project> {
    await this.col<Project>(COLLECTIONS.projects).replaceOne({ _id: project.id }, toDoc(project), {
      upsert: true,
    });
    return project;
  }

  async listSkills(): Promise<Skill[]> {
    const rows = await this.col<Skill>(COLLECTIONS.skills).find().toArray();
    return rows.map((row) => fromDoc(row)!);
  }
  async getSkill(id: string): Promise<Skill | null> {
    return fromDoc(await this.col<Skill>(COLLECTIONS.skills).findOne({ _id: id }));
  }
  async putSkill(skill: Skill): Promise<Skill> {
    await this.col<Skill>(COLLECTIONS.skills).replaceOne({ _id: skill.id }, toDoc(skill), { upsert: true });
    return skill;
  }

  async listTimeline(): Promise<TimelineEntry[]> {
    const rows = await this.col<TimelineEntry>(COLLECTIONS.timeline).find().toArray();
    return rows.map((row) => fromDoc(row)!);
  }
  async getTimeline(id: string): Promise<TimelineEntry | null> {
    return fromDoc(await this.col<TimelineEntry>(COLLECTIONS.timeline).findOne({ _id: id }));
  }
  async putTimeline(entry: TimelineEntry): Promise<TimelineEntry> {
    await this.col<TimelineEntry>(COLLECTIONS.timeline).replaceOne({ _id: entry.id }, toDoc(entry), {
      upsert: true,
    });
    return entry;
  }

  async getNow(): Promise<NowSnapshot | null> {
    const row = await this.col<NowSnapshot>(COLLECTIONS.now).findOne();
    return fromDoc(row);
  }
  async putNow(snapshot: NowSnapshot): Promise<NowSnapshot> {
    await this.col<NowSnapshot>(COLLECTIONS.now).replaceOne({ _id: snapshot.id }, toDoc(snapshot), {
      upsert: true,
    });
    const extras = await this.col<NowSnapshot>(COLLECTIONS.now)
      .find({ _id: { $ne: snapshot.id } })
      .toArray();
    if (extras.length) {
      await this.col<NowSnapshot>(COLLECTIONS.now).deleteMany({
        _id: { $in: extras.map((e) => e._id) },
      });
    }
    return snapshot;
  }

  async listVersions(): Promise<OSVersion[]> {
    const rows = await this.col<OSVersion>(COLLECTIONS.versions).find().sort({ sequence: 1 }).toArray();
    return rows.map((row) => fromDoc(row)!);
  }
  async getVersion(id: string): Promise<OSVersion | null> {
    return fromDoc(await this.col<OSVersion>(COLLECTIONS.versions).findOne({ _id: id }));
  }
  async putVersion(version: OSVersion): Promise<OSVersion> {
    if (version.isLatest) {
      await this.col<OSVersion>(COLLECTIONS.versions).updateMany(
        { _id: { $ne: version.id } },
        { $set: { isLatest: false } },
      );
    }
    await this.col<OSVersion>(COLLECTIONS.versions).replaceOne({ _id: version.id }, toDoc(version), {
      upsert: true,
    });
    return version;
  }

  async listAssets(): Promise<AssetRecord[]> {
    const rows = await this.col<AssetRecord>(COLLECTIONS.assets).find().toArray();
    return rows.map((row) => fromDoc(row)!);
  }
  async getAsset(id: string): Promise<AssetRecord | null> {
    return fromDoc(await this.col<AssetRecord>(COLLECTIONS.assets).findOne({ _id: id }));
  }
  async putAsset(asset: AssetRecord): Promise<AssetRecord> {
    await this.col<AssetRecord>(COLLECTIONS.assets).replaceOne({ _id: asset.id }, toDoc(asset), {
      upsert: true,
    });
    return asset;
  }
}
