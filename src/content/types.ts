export type EntityId = string;
export type Slug = string;
export type RichText = string;
export type VersionId = "v1" | "v2" | "v3";

export interface VersionGated {
  introducedIn: VersionId;
  retiredIn?: VersionId;
}

export interface BlockBase extends VersionGated {
  id: EntityId;
  type: string;
  order: number;
  emphasis?: "default" | "lead" | "aside";
}

export interface AssetRef {
  id: EntityId;
  alt: string;
  caption?: RichText;
  width?: number;
  height?: number;
}

export interface ExternalLink {
  kind: "live" | "repo" | "pr" | "issue" | "article" | "video" | "profile" | "other";
  label: string;
  url: string;
  /** False when the URL has not been verified. Unverified links MUST NOT publish. */
  verified: boolean;
  /** ISO date of the A1.1 sweep. Required when verified is true. */
  verifiedAt?: string;
}

export type ContentBlock =
  | (BlockBase & { type: "heading"; level: 2 | 3 | 4; text: string; anchor: Slug })
  | (BlockBase & { type: "prose"; text: RichText })
  | (BlockBase & { type: "list"; style: "bullet" | "numbered"; items: RichText[] })
  | (BlockBase & {
      type: "code";
      language: string;
      code: string;
      filename?: string;
      highlightLines?: number[];
      caption?: RichText;
    })
  | (BlockBase & { type: "quote"; text: RichText; attribution?: string; sourceUrl?: string })
  | (BlockBase & {
      type: "callout";
      variant: "note" | "caution" | "limitation" | "disclosure";
      title?: string;
      text: RichText;
    })
  | (BlockBase & { type: "image"; asset: AssetRef; size?: "inline" | "full" | "bleed" })
  | (BlockBase & { type: "gallery"; assets: AssetRef[]; caption?: RichText })
  | (BlockBase & {
      type: "diagram";
      format: "mermaid" | "svg" | "image";
      source?: string;
      asset?: AssetRef;
      altDescription: string;
      caption?: RichText;
    })
  | (BlockBase & { type: "keyValue"; title?: string; rows: { key: string; value: RichText }[] })
  | (BlockBase & { type: "comparison"; title?: string; columns: string[]; rows: RichText[][] })
  | (BlockBase & {
      type: "metrics";
      metrics: {
        label: string;
        value: string;
        source: string;
        verified: boolean;
        approximate?: boolean;
      }[];
    })
  | (BlockBase & { type: "linkGroup"; title?: string; links: ExternalLink[] })
  | (BlockBase & {
      type: "embed";
      provider: "youtube" | "vimeo" | "codesandbox" | "other" | string;
      url: string;
      title: string;
      aspectRatio?: string;
    })
  | (BlockBase & { type: "divider" });

export type ProjectTier = "caseStudy" | "gallery" | "recycled";
export type ProjectStatus = "live" | "inProgress" | "unlaunched" | "archived" | "abandoned";
export type Authorship = "manual" | "aiAssisted" | "aiGenerated";

export interface PublishState {
  status: "draft" | "review" | "published";
  publishedAt?: string;
  updatedAt: string;
  /** Non-empty blocks Phase 13 emit. Phase 11 stores them at rest. */
  blockers?: string[];
}

export interface Project extends VersionGated {
  id: EntityId;
  slug: Slug;
  title: string;
  tagline: string;
  tier: ProjectTier;
  status: ProjectStatus;
  authorship: Authorship;
  rank: number;
  startedAt: string;
  endedAt?: string;
  stack: string[];
  links: ExternalLink[];
  cover?: AssetRef;
  blocks: ContentBlock[];
  role: {
    solo: boolean;
    teamSize?: number;
    ownedAreas?: string[];
  };
  abandonmentReason?: RichText | null;
  publish: PublishState;
}

export type SkillTier = 1 | 2 | 3;
export type SkillCategory =
  | "language"
  | "frontend"
  | "backend"
  | "data"
  | "infra"
  | "tooling"
  | "other";

export interface SkillEvidence {
  kind: "mergedPR" | "paidWork" | "deployedProject" | "coursework" | "competition";
  statement: string;
  url?: string;
  projectId?: EntityId;
  approximate?: boolean;
}

export interface Skill extends VersionGated {
  id: EntityId;
  name: string;
  tier: SkillTier;
  category: SkillCategory;
  evidence: SkillEvidence[];
  scopeNote?: string;
  publish: PublishState;
}

export type TimelineKind =
  | "education"
  | "work"
  | "project"
  | "openSource"
  | "recognition"
  | "milestone";

export interface TimelineEntry extends VersionGated {
  id: EntityId;
  versionEra: VersionId;
  startedAt: string;
  endedAt?: string;
  kind: TimelineKind;
  title: string;
  organisation?: string;
  body: RichText;
  projectId?: EntityId;
  links?: ExternalLink[];
  approximateDates?: boolean;
  publish: PublishState;
}

export type NowCategory =
  | "learning"
  | "building"
  | "openSource"
  | "applying"
  | "stuckOn"
  | "studying";

export interface NowEntry {
  id: EntityId;
  category: NowCategory;
  text: RichText;
  projectId?: EntityId;
  publish: PublishState;
}

export interface NowSnapshot extends VersionGated {
  id: EntityId;
  updatedAt: string;
  entries: NowEntry[];
  stalenessThresholdDays: number;
  publish: PublishState;
}

export interface OSVersion {
  id: VersionId;
  number: string;
  codename?: string;
  eraStart: string;
  eraEnd?: string;
  eraSummary: RichText;
  sequence: number;
  isLatest: boolean;
  features: string[];
  releaseNotes?: ContentBlock[];
  releasedAt: string;
}

export interface AssetRecord {
  id: EntityId;
  url: string;
  width?: number;
  height?: number;
}

export interface ContentBundle {
  schemaVersion: string;
  generatedAt: string;
  versions: OSVersion[];
  projects: Project[];
  skills: Skill[];
  timeline: TimelineEntry[];
  now: NowSnapshot;
  assets: Record<EntityId, { url: string; width?: number; height?: number }>;
}

export const CONTENT_SCHEMA_VERSION = "1.0.0";
