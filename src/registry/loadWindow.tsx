import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { AppId } from "./types";

type AppBody = ComponentType<object>;
type CaseBody = ComponentType<{ slug: string }>;

const about = lazy(() => import("../apps/AboutWindow"));
const projects = lazy(() => import("../apps/ProjectsWindow"));
const caseStudy = lazy(() => import("../apps/CaseStudyWindow"));
const skills = lazy(() => import("../apps/SkillsWindow"));
const resume = lazy(() => import("../apps/ResumeWindow"));
const contact = lazy(() => import("../apps/ContactWindow"));
const recycle = lazy(() => import("../apps/RecycleWindow"));
const now = lazy(() => import("../apps/NowWindow"));
const timeline = lazy(() => import("../apps/TimelineWindow"));
const terminal = lazy(() => import("../apps/TerminalWindow"));
const settings = lazy(() => import("../apps/SettingsWindow"));
const osUpdate = lazy(() => import("../apps/OsUpdateWindow"));
const kellai = lazy(() => import("../apps/KellAiWindow"));

/** Lazy window bodies keyed by registry id. Search overlay has no window body. */
export const APP_WINDOW_LOADERS: Partial<Record<AppId, LazyExoticComponent<AppBody>>> = {
  about,
  projects,
  skills,
  resume,
  contact,
  recycle,
  now,
  timeline,
  terminal,
  settings,
  osUpdate,
  kellai,
};

export const CASE_STUDY_LOADER: LazyExoticComponent<CaseBody> = caseStudy;

export function appWindowLoader(appId: AppId): LazyExoticComponent<AppBody> | undefined {
  return APP_WINDOW_LOADERS[appId];
}
