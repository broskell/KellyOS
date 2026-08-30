import { assertVerifiedShape } from "./publish";
import type {
  ContentBlock,
  ExternalLink,
  NowSnapshot,
  Project,
  Skill,
  TimelineEntry,
} from "./types";

/** Keys that would smuggle a proficiency meter or ability boolean onto Skill. */
export const FORBIDDEN_SKILL_METER_KEYS = [
  "proficiency",
  "percent",
  "percentage",
  "meter",
  "rating",
  "stars",
  "ability",
  "score",
  "levelPercent",
  "canDebug",
] as const;

export function skillMeterKeysPresent(doc: unknown): string[] {
  if (!doc || typeof doc !== "object") return [];
  return FORBIDDEN_SKILL_METER_KEYS.filter((key) => key in doc);
}

function linkBlockers(links: ExternalLink[], prefix: string): string[] {
  const out: string[] = [];
  for (const link of links) {
    const shape = assertVerifiedShape(link);
    if (shape) out.push(`${prefix}${shape}`);
    if (link.verified !== true || !link.verifiedAt) {
      out.push(`${prefix}unverified link "${link.label}" cannot publish`);
    }
  }
  return out;
}

function assetAltBlockers(alt: string | undefined, where: string): string[] {
  if (!alt || !alt.trim()) return [`${where}: AssetRef.alt is required`];
  return [];
}

export function contentBlockPublishBlockers(block: ContentBlock, prefix = ""): string[] {
  const p = prefix ? `${prefix}` : `block ${block.id}: `;
  if (block.type === "metrics") {
    const out: string[] = [];
    for (const metric of block.metrics) {
      if (!metric.source || !metric.source.trim()) {
        out.push(`${p}MetricsBlock "${metric.label}" is missing required source`);
      }
    }
    return out;
  }
  if (block.type === "linkGroup") {
    return linkBlockers(block.links, p);
  }
  if (block.type === "image") {
    return assetAltBlockers(block.asset.alt, `${p}image`);
  }
  if (block.type === "gallery") {
    const out: string[] = [];
    if (block.assets.length < 2) out.push(`${p}gallery requires 2+ assets`);
    for (const asset of block.assets) {
      out.push(...assetAltBlockers(asset.alt, `${p}gallery asset ${asset.id}`));
    }
    return out;
  }
  if (block.type === "diagram") {
    const out: string[] = [];
    if (!block.altDescription || !block.altDescription.trim()) {
      out.push(`${p}DiagramBlock.altDescription is required`);
    }
    if (block.asset) out.push(...assetAltBlockers(block.asset.alt, `${p}diagram asset`));
    return out;
  }
  return [];
}

/** Shape the editing API refuses to persist — not merely a publish blocker. */
export function structuralProjectErrors(project: Project): string[] {
  const errors: string[] = [];
  if (!project.authorship) errors.push("Project.authorship is required (no default)");
  if (!project.role.solo) {
    if (!project.role.ownedAreas || project.role.ownedAreas.length === 0) {
      errors.push("role.ownedAreas is required when solo is false");
    }
  }
  if (project.cover) errors.push(...assetAltBlockers(project.cover.alt, "cover"));
  for (const link of project.links) {
    const shape = assertVerifiedShape(link);
    if (shape) errors.push(shape);
  }
  for (const block of project.blocks) {
    if (block.type === "metrics") {
      errors.push(...contentBlockPublishBlockers(block));
    }
    if (block.type === "linkGroup") {
      for (const link of block.links) {
        const shape = assertVerifiedShape(link);
        if (shape) errors.push(shape);
      }
    }
    if (block.type === "image") errors.push(...assetAltBlockers(block.asset.alt, `block ${block.id}`));
    if (block.type === "gallery") {
      for (const asset of block.assets) {
        errors.push(...assetAltBlockers(asset.alt, `block ${block.id}`));
      }
    }
    if (block.type === "diagram" && (!block.altDescription || !block.altDescription.trim())) {
      errors.push(`block ${block.id}: DiagramBlock.altDescription is required`);
    }
  }
  return unique(errors);
}

export function structuralSkillErrors(skill: Skill, raw?: unknown): string[] {
  const errors: string[] = [];
  for (const key of skillMeterKeysPresent(raw ?? skill)) {
    errors.push(`Skill must not carry meter/ability field "${key}"`);
  }
  if (!skill.evidence || skill.evidence.length === 0) {
    errors.push("Skill.evidence is required and must be non-empty");
  }
  return errors;
}

export function projectPublishBlockers(project: Project): string[] {
  const fromRecord = [...(project.publish.blockers ?? [])];
  const computed: string[] = [];
  if (!project.authorship) {
    computed.push("Project.authorship is required (no default)");
  }
  if (!project.role.solo) {
    if (!project.role.ownedAreas || project.role.ownedAreas.length === 0) {
      computed.push("role.ownedAreas is required when solo is false");
    }
  }
  computed.push(...linkBlockers(project.links, ""));
  if (project.cover) {
    computed.push(...assetAltBlockers(project.cover.alt, "cover"));
  }
  for (const block of project.blocks) {
    computed.push(...contentBlockPublishBlockers(block));
  }
  return unique([...fromRecord, ...computed]);
}

export function skillPublishBlockers(skill: Skill, raw?: unknown): string[] {
  const meters = skillMeterKeysPresent(raw ?? skill);
  const fromRecord = [...(skill.publish.blockers ?? [])];
  const computed: string[] = [];
  for (const key of meters) {
    computed.push(`Skill must not carry meter/ability field "${key}"`);
  }
  if (!skill.evidence || skill.evidence.length === 0) {
    computed.push("Skill.evidence is required and must be non-empty");
  }
  return unique([...fromRecord, ...computed]);
}

export function timelinePublishBlockers(entry: TimelineEntry): string[] {
  const fromRecord = [...(entry.publish.blockers ?? [])];
  const computed = entry.links ? linkBlockers(entry.links, "") : [];
  return unique([...fromRecord, ...computed]);
}

export function nowPublishBlockers(snapshot: NowSnapshot): string[] {
  const fromRecord = [...(snapshot.publish.blockers ?? [])];
  const computed: string[] = [];
  for (const entry of snapshot.entries) {
    computed.push(...(entry.publish.blockers ?? []));
  }
  return unique([...fromRecord, ...computed]);
}

export function canPublish(blockers: string[]): boolean {
  return blockers.length === 0;
}

function unique(items: string[]): string[] {
  return [...new Set(items)];
}
