/**
 * Visitor content facade. Hand-authored Phase 0 modules until an emitted
 * ContentBundle exists at src/content/published/bundle.json. Version flags run
 * here at load, not in window components.
 */
import { FEATURED_CASE_STUDY_SLUG } from "../registry/manifest";
import { langchainBlocks as handLangchainBlocks, langchainTitle as handLangchainTitle } from "./langchain";
import { nowBlocks as handNowBlocks, nowSnapshot as handNowSnapshot, type NowSnapshot as VisitorNow } from "./now";
import { featuredCaseStudy as handFeatured, galleryRows as handGallery, type FeaturedProject, type GalleryRow } from "./projects";
import { loadEmittedBundle } from "./publishedBundle";
import { skillTiers as handSkillTiers, skillsHowToRead } from "./skills";
import {
  timelineBlocks as handTimelineBlocks,
  timelineEntries as handTimelineEntries,
  type TimelineEntry as VisitorTimeline,
} from "./timeline";
import type { ContentBlock, ContentBundle, NowCategory, Project, Skill } from "./types";
import { bundleForVisitorBoot } from "./versionFlags";

export { skillsHowToRead };
export type { FeaturedProject, GalleryRow };

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const NOW_LABELS: Record<NowCategory, string> = {
  learning: "Learning",
  building: "Building",
  openSource: "Open source",
  applying: "Job applications",
  stuckOn: "Stuck on",
  studying: "Semester 3",
};

function monthLabel(iso: string): string {
  const day = iso.slice(0, 10);
  const parts = day.split("-");
  const year = parts[0];
  const month = Number(parts[1]);
  if (!year || !month || month < 1 || month > 12) return day;
  return `${MONTHS[month - 1]} ${year}`;
}

function periodLabel(startedAt: string, endedAt?: string): string {
  if (endedAt) return `${startedAt} – ${endedAt}`;
  return `${startedAt} – present`;
}

function bootBundle(): ContentBundle | null {
  const raw = loadEmittedBundle();
  return raw ? bundleForVisitorBoot(raw) : null;
}

const bundle = bootBundle();

function featuredFrom(projects: Project[]): FeaturedProject {
  const match =
    projects.find((p) => p.slug === FEATURED_CASE_STUDY_SLUG && p.tier === "caseStudy") ??
    projects.find((p) => p.tier === "caseStudy");
  if (!match) return handFeatured;
  return {
    slug: match.slug,
    title: match.title,
    tagline: match.tagline,
    line: match.links[0]?.label ?? match.tagline,
  };
}

function galleryFrom(projects: Project[]): GalleryRow[] {
  const rows = projects
    .filter((p) => p.tier === "gallery" || p.tier === "recycled")
    .sort((a, b) => a.rank - b.rank)
    .map((p) => ({
      title: p.title,
      note: p.tagline,
      screenshot: p.cover,
      live: p.links.find((l) => l.kind === "live"),
    }));
  return rows.length ? rows : handGallery;
}

function caseStudyProject(projects: Project[]): Project | undefined {
  return (
    projects.find((p) => p.slug === FEATURED_CASE_STUDY_SLUG && p.tier === "caseStudy") ??
    projects.find((p) => p.tier === "caseStudy")
  );
}

export const featuredCaseStudy: FeaturedProject = bundle?.projects.length
  ? featuredFrom(bundle.projects)
  : handFeatured;

const galleryPublished = bundle?.projects.filter((p) => p.tier === "gallery" || p.tier === "recycled") ?? [];
export const galleryRows: GalleryRow[] =
  bundle && galleryPublished.length ? galleryFrom(bundle.projects) : handGallery;

const caseStudy = bundle?.projects.length ? caseStudyProject(bundle.projects) : undefined;

export const langchainTitle: string = caseStudy?.title ?? handLangchainTitle;
export const langchainBlocks: ContentBlock[] = caseStudy?.blocks.length
  ? caseStudy.blocks
  : handLangchainBlocks;

type LiveSkillTiers = {
  1: { title: string; subtitle: string; items: { name: string; evidence: string; scopeNote?: string }[] };
  2: { title: string; subtitle: string; names: readonly string[] };
  3: { title: string; subtitle: string; names: readonly string[] };
};

export const skillTiers: LiveSkillTiers = bundle?.skills.length
  ? overlaySkillTiers(bundle.skills)
  : handSkillTiers;

function overlaySkillTiers(skills: Skill[]): LiveSkillTiers {
  const t1 = skills.filter((s) => s.tier === 1);
  const t2 = skills.filter((s) => s.tier === 2);
  const t3 = skills.filter((s) => s.tier === 3);
  return {
    1: {
      title: handSkillTiers[1].title,
      subtitle: handSkillTiers[1].subtitle,
      items: t1.length
        ? t1.map((s) => ({
            name: s.name,
            evidence: s.evidence[0]?.statement ?? "",
            scopeNote: s.scopeNote,
          }))
        : [...handSkillTiers[1].items],
    },
    2: {
      title: handSkillTiers[2].title,
      subtitle: handSkillTiers[2].subtitle,
      names: t2.length ? t2.map((s) => s.name) : [...handSkillTiers[2].names],
    },
    3: {
      title: handSkillTiers[3].title,
      subtitle: handSkillTiers[3].subtitle,
      names: t3.length ? t3.map((s) => s.name) : [...handSkillTiers[3].names],
    },
  };
}

export const nowSnapshot: VisitorNow = bundle
  ? {
      id: bundle.now.id,
      introducedIn: bundle.now.introducedIn,
      updatedAt: bundle.now.updatedAt.slice(0, 10),
      updatedLabel: monthLabel(bundle.now.updatedAt),
      stalenessThresholdDays: bundle.now.stalenessThresholdDays,
      entries: bundle.now.entries.map((e) => ({
        id: e.id,
        category: e.category,
        label: NOW_LABELS[e.category],
        text: e.text,
      })),
    }
  : handNowSnapshot;

export function nowBlocks(at: Date = new Date()): ContentBlock[] {
  return handNowBlocks(at, nowSnapshot);
}

export const timelineEntries: VisitorTimeline[] = bundle?.timeline.length
  ? bundle.timeline.map((e) => ({
      id: e.id,
      versionEra: e.versionEra,
      startedAt: e.startedAt,
      endedAt: e.endedAt,
      kind: e.kind,
      title: e.title,
      organisation: e.organisation,
      body: e.body,
      approximateDates: e.approximateDates,
      periodLabel: periodLabel(e.startedAt, e.endedAt),
    }))
  : handTimelineEntries;

export function timelineBlocks(): ContentBlock[] {
  return handTimelineBlocks(timelineEntries);
}

/** Build timeline blocks from an already version-filtered entry list (Phase 14). */
export function timelineBlocksFor(entries: VisitorTimeline[]): ContentBlock[] {
  return handTimelineBlocks(entries);
}

export const emittedAssetMap: Record<string, { url: string; width?: number; height?: number }> =
  bundle?.assets ?? {};
