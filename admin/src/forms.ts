import {
  contentBlockPublishBlockers,
  nowPublishBlockers,
  projectPublishBlockers,
  skillPublishBlockers,
  structuralProjectErrors,
  structuralSkillErrors,
  timelinePublishBlockers,
} from "../../src/content/honesty";
import type {
  AssetRecord,
  AssetRef,
  Authorship,
  ContentBlock,
  ExternalLink,
  NowSnapshot,
  OSVersion,
  Project,
  PublishState,
  Skill,
  TimelineEntry,
} from "../../src/content/types";
import { newId } from "./ids";

export type ProjectForm = Omit<Project, "authorship"> & { authorship: Authorship | "" };

export function emptyPublish(): PublishState {
  return { status: "draft", updatedAt: new Date().toISOString() };
}

export function emptyLink(): ExternalLink {
  return { kind: "other", label: "", url: "", verified: false };
}

export function emptyAssetRef(): AssetRef {
  return { id: "", alt: "" };
}

export function emptyProject(): ProjectForm {
  return {
    id: newId("prj"),
    slug: "",
    title: "",
    tagline: "",
    tier: "gallery",
    status: "unlaunched",
    authorship: "",
    rank: 99,
    startedAt: "",
    stack: [],
    links: [],
    blocks: [],
    role: { solo: true },
    introducedIn: "v3",
    publish: emptyPublish(),
  };
}

export function toProjectForm(project: Project): ProjectForm {
  return { ...project, authorship: project.authorship };
}

export function projectClientErrors(form: ProjectForm): string[] {
  const errors: string[] = [];
  if (!form.authorship) {
    errors.push("Authorship has no default — choose manual, aiAssisted, or aiGenerated");
  }
  if (!form.id.trim()) errors.push("id is required (Mongo _id)");
  if (!form.slug.trim()) errors.push("slug is required");
  if (!form.title.trim()) errors.push("title is required");
  if (!form.startedAt.trim()) errors.push("startedAt is required — do not invent a date");
  for (const block of form.blocks) {
    if (block.type === "metrics") {
      for (const metric of block.metrics) {
        if (!metric.source.trim()) {
          errors.push(`MetricsBlock "${metric.label || "(untitled)"}": source is required`);
        }
      }
    }
  }
  if (form.authorship) {
    errors.push(...structuralProjectErrors({ ...form, authorship: form.authorship }));
  }
  return [...new Set(errors)];
}

export function toProject(form: ProjectForm): Project {
  const errors = projectClientErrors(form);
  if (errors.length || !form.authorship) {
    throw new Error(errors.join("; ") || "project form incomplete");
  }
  return { ...form, authorship: form.authorship };
}

export function liveProjectBlockers(form: ProjectForm): string[] {
  if (!form.authorship) {
    return ["Authorship has no default — choose before save"];
  }
  return projectPublishBlockers({ ...form, authorship: form.authorship });
}

export function emptySkill(): Skill {
  return {
    id: newId("sk"),
    name: "",
    tier: 3,
    category: "other",
    evidence: [{ kind: "coursework", statement: "" }],
    introducedIn: "v3",
    publish: emptyPublish(),
  };
}

export function skillClientErrors(skill: Skill): string[] {
  return structuralSkillErrors(skill, skill);
}

export function liveSkillBlockers(skill: Skill): string[] {
  return skillPublishBlockers(skill, skill);
}

export function emptyTimeline(): TimelineEntry {
  return {
    id: newId("tl"),
    versionEra: "v3",
    startedAt: "",
    kind: "milestone",
    title: "",
    body: "",
    links: [],
    introducedIn: "v3",
    publish: emptyPublish(),
  };
}

export function liveTimelineBlockers(entry: TimelineEntry): string[] {
  return timelinePublishBlockers(entry);
}

export function emptyNow(): NowSnapshot {
  return {
    id: "now_current",
    updatedAt: new Date().toISOString().slice(0, 10),
    entries: [],
    stalenessThresholdDays: 45,
    introducedIn: "v3",
    publish: emptyPublish(),
  };
}

export function liveNowBlockers(snapshot: NowSnapshot): string[] {
  return nowPublishBlockers(snapshot);
}

export function emptyVersion(id: OSVersion["id"] = "v3"): OSVersion {
  return {
    id,
    number: id === "v1" ? "1.0" : id === "v2" ? "2.0" : "3.0",
    eraStart: "",
    eraSummary: "",
    sequence: id === "v1" ? 1 : id === "v2" ? 2 : 3,
    isLatest: id === "v3",
    features: [],
    releasedAt: "",
  };
}

export function emptyAsset(): AssetRecord {
  return { id: newId("ast"), url: "" };
}

export function emptyBlock(type: ContentBlock["type"], order: number): ContentBlock {
  const base = {
    id: newId("blk"),
    order,
    introducedIn: "v3" as const,
  };
  switch (type) {
    case "heading":
      return { ...base, type, level: 2, text: "", anchor: "" };
    case "prose":
      return { ...base, type, text: "" };
    case "list":
      return { ...base, type, style: "bullet", items: [""] };
    case "code":
      return { ...base, type, language: "ts", code: "" };
    case "quote":
      return { ...base, type, text: "" };
    case "callout":
      return { ...base, type, variant: "note", text: "" };
    case "image":
      return { ...base, type, asset: emptyAssetRef() };
    case "gallery":
      return { ...base, type, assets: [emptyAssetRef(), emptyAssetRef()] };
    case "diagram":
      return { ...base, type, format: "mermaid", altDescription: "", source: "" };
    case "keyValue":
      return { ...base, type, rows: [{ key: "", value: "" }] };
    case "comparison":
      return { ...base, type, columns: ["A", "B"], rows: [["", ""]] };
    case "metrics":
      return {
        ...base,
        type,
        metrics: [{ label: "", value: "", source: "", verified: false }],
      };
    case "linkGroup":
      return { ...base, type, links: [emptyLink()] };
    case "embed":
      return { ...base, type, provider: "other", url: "", title: "" };
    case "divider":
      return { ...base, type };
  }
}

export function reindexBlocks(blocks: ContentBlock[]): ContentBlock[] {
  return blocks.map((block, i) => ({ ...block, order: i + 1 }));
}

export function blockLiveNotes(block: ContentBlock): string[] {
  return contentBlockPublishBlockers(block);
}

export function parseCsv(value: string): string[] {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function joinCsv(items: string[] | undefined): string {
  return (items ?? []).join(", ");
}
