import { aboutBlocks } from "./about";
import { contactBlocks } from "./contact";
import { featuredCaseStudy, galleryRows, langchainBlocks, langchainTitle, nowBlocks, skillTiers, skillsHowToRead, timelineBlocks } from "./live";
import { makeBlocks } from "./makeBlocks";
import { recycleBlocks } from "./recycle";
import { resumeBlocks } from "./resume";
import type { ContentBlock } from "./types";

export type DocId =
  | "about"
  | "projects"
  | "skills"
  | "resume"
  | "contact"
  | "recycle"
  | "now"
  | "timeline"
  | "caseStudy";

export interface DocumentDoc {
  id: DocId;
  heading: string;
  description: string;
  blocks: ContentBlock[];
}

const projectsBlocks = makeBlocks([
  {
    id: "proj_feat_h",
    type: "heading",
    level: 2,
    text: "Case study",
    anchor: "case-study",
  },
  {
    id: "proj_feat",
    type: "prose",
    text: `[${featuredCaseStudy.title}](/project/${featuredCaseStudy.slug}) — ${featuredCaseStudy.tagline}. ${featuredCaseStudy.line}`,
  },
  {
    id: "proj_gal_h",
    type: "heading",
    level: 2,
    text: "Also shipped",
    anchor: "also-shipped",
  },
  {
    id: "proj_gal_note",
    type: "prose",
    emphasis: "aside",
    text: "Named rows only — not case studies. The 8–10 gallery cut and screenshots were not delivered for this phase, so this is not a completed gallery.",
  },
  {
    id: "proj_gal",
    type: "list",
    style: "bullet",
    items: galleryRows.map((r) => `**${r.title}** — ${r.note}`),
  },
]);

const skillsBlocks = makeBlocks([
  {
    id: "sk_h",
    type: "heading",
    level: 2,
    text: "How to read this",
    anchor: "how-to-read",
  },
  { id: "sk_p1", type: "prose", text: skillsHowToRead[0] },
  { id: "sk_p2", type: "prose", text: skillsHowToRead[1] },
  {
    id: "sk_t1",
    type: "heading",
    level: 3,
    text: skillTiers[1].title,
    anchor: "tier-1",
  },
  {
    id: "sk_t1s",
    type: "prose",
    emphasis: "aside",
    text: skillTiers[1].subtitle,
  },
  {
    id: "sk_t1kv",
    type: "keyValue",
    rows: skillTiers[1].items.map((i) => ({
      key: i.scopeNote ? `${i.name} (${i.scopeNote})` : i.name,
      value: i.evidence,
    })),
  },
  {
    id: "sk_t2",
    type: "heading",
    level: 3,
    text: skillTiers[2].title,
    anchor: "tier-2",
  },
  {
    id: "sk_t2s",
    type: "prose",
    text: `${skillTiers[2].subtitle} ${skillTiers[2].names.join(" · ")}`,
  },
  {
    id: "sk_t3",
    type: "heading",
    level: 3,
    text: skillTiers[3].title,
    anchor: "tier-3",
  },
  {
    id: "sk_t3s",
    type: "prose",
    text: `${skillTiers[3].subtitle} ${skillTiers[3].names.join(" · ")}`,
  },
]);

export const ABOUT_DESCRIPTION =
  "Second-year Applied AI & Data Science student at IIT Jodhpur who ships full-stack products end to end. I develop AI-assisted, and I say so on the page.";

export const documents: Record<DocId, DocumentDoc> = {
  about: {
    id: "about",
    heading: "Saathvik Kellampalli",
    description: ABOUT_DESCRIPTION,
    blocks: aboutBlocks,
  },
  projects: {
    id: "projects",
    heading: "Projects",
    description: `${featuredCaseStudy.title} — ${featuredCaseStudy.tagline}`,
    blocks: projectsBlocks,
  },
  skills: {
    id: "skills",
    heading: "Skills",
    description: "Skills graded by evidence type, not percentages.",
    blocks: skillsBlocks,
  },
  resume: {
    id: "resume",
    heading: "Résumé",
    description: ABOUT_DESCRIPTION,
    blocks: resumeBlocks,
  },
  contact: {
    id: "contact",
    heading: "Contact",
    description: "Email, GitHub, LinkedIn, X. Phone and Discord are not published.",
    blocks: contactBlocks,
  },
  recycle: {
    id: "recycle",
    heading: "Recycle Bin",
    description: "Abandoned projects. Thin and true.",
    blocks: recycleBlocks,
  },
  now: {
    id: "now",
    heading: "Now",
    description: "Current activity, visibly dated. Includes being stuck on ML.",
    get blocks() {
      return nowBlocks();
    },
  },
  timeline: {
    id: "timeline",
    heading: "Timeline",
    description: "2023 → present, grouped by version era. Academic record and recognitions.",
    blocks: timelineBlocks(),
  },
  caseStudy: {
    id: "caseStudy",
    heading: langchainTitle,
    description: featuredCaseStudy.tagline,
    blocks: langchainBlocks,
  },
};
