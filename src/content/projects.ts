import { FEATURED_CASE_STUDY_SLUG } from "../registry/manifest";
import type { AssetRef, ExternalLink } from "./types";

export interface FeaturedProject {
  slug: string;
  title: string;
  tagline: string;
  line: string;
}

export interface GalleryRow {
  title: string;
  note: string;
  /** Only when A3.5 captured with alt at capture time. */
  screenshot?: AssetRef;
  /** Only when A1.1 verified. Unverified live URLs must not be set to verified. */
  live?: ExternalLink;
}

export const featuredCaseStudy: FeaturedProject = {
  slug: FEATURED_CASE_STUDY_SLUG,
  title: "Landing a feature in LangChain in 24 hours",
  tagline: "The only externally verified engineering work in this portfolio",
  line: "OpenRouter provider · PR #39301",
};

/**
 * Named gallery only. A3.8 (cut to 8–10) was not in the tree for Phase 9.
 * This is not a completed cut. Do not promote these rows to case studies.
 */
export const galleryRows: GalleryRow[] = [
  {
    title: "Roast My Project",
    note: "A multi-model AI feedback platform — project reviews, résumé analysis, startup validation. Gallery (case study blocked on technical review).",
  },
  {
    title: "PawSethu",
    note: "A digital identity and care platform for pets. Gallery until technical review. Not a case study.",
  },
  {
    title: "Ducati Scrollytelling",
    note: "Gallery. Four of five scrollytelling projects were cut; Ducati is the one kept.",
  },
];
