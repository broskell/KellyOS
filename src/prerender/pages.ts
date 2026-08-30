import type { DocId } from "../content/documents";
import { FEATURED_CASE_STUDY_SLUG } from "../registry/manifest";
import { headForPath } from "../seo/site";

export interface StaticPage {
  path: string;
  title: string;
  description: string;
  docId: DocId;
}

function page(path: string, docId: DocId): StaticPage {
  const head = headForPath(path);
  return { path, title: head.title, description: head.description, docId };
}

export const STATIC_PAGES: StaticPage[] = [
  page("/", "about"),
  page("/about", "about"),
  page("/projects", "projects"),
  page(`/project/${FEATURED_CASE_STUDY_SLUG}`, "caseStudy"),
  page("/skills", "skills"),
  page("/resume", "resume"),
  page("/contact", "contact"),
  page("/recycle", "recycle"),
  page("/now", "now"),
  page("/timeline", "timeline"),
  page("/read/about", "about"),
  page("/read/projects", "projects"),
  page(`/read/project/${FEATURED_CASE_STUDY_SLUG}`, "caseStudy"),
  page("/read/skills", "skills"),
  page("/read/resume", "resume"),
  page("/read/contact", "contact"),
  page("/read/recycle", "recycle"),
  page("/read/now", "now"),
  page("/read/timeline", "timeline"),
];
