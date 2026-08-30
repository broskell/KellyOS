import {
  canPublish,
  nowPublishBlockers,
  projectPublishBlockers,
  skillPublishBlockers,
  timelinePublishBlockers,
} from "../../src/content/honesty";
import type { ContentStore } from "./store";

export type PublishFailure = { id: string; kind: string; blockers: string[] };

export type PublishCheckResult = { ok: boolean; failures: PublishFailure[] };

/**
 * Refuse list for emit. Drafts may keep blockers; only `published` rows fail the check.
 * Missing NowSnapshot still fails because GET /v1/bundle cannot assemble without it.
 */
export async function runPublishCheck(store: ContentStore): Promise<PublishCheckResult> {
  const projects = await store.listProjects();
  const skills = await store.listSkills();
  const timeline = await store.listTimeline();
  const now = await store.getNow();
  const failures: PublishFailure[] = [];

  for (const project of projects) {
    if (project.publish.status !== "published") continue;
    const blockers = projectPublishBlockers(project);
    if (!canPublish(blockers)) failures.push({ id: project.id, kind: "project", blockers });
  }
  for (const skill of skills) {
    if (skill.publish.status !== "published") continue;
    const blockers = skillPublishBlockers(skill);
    if (!canPublish(blockers)) failures.push({ id: skill.id, kind: "skill", blockers });
  }
  for (const entry of timeline) {
    if (entry.publish.status !== "published") continue;
    const blockers = timelinePublishBlockers(entry);
    if (!canPublish(blockers)) failures.push({ id: entry.id, kind: "timeline", blockers });
  }
  if (!now) {
    failures.push({ id: "now", kind: "now", blockers: ["NowSnapshot missing"] });
  } else if (now.publish.status === "published") {
    const blockers = nowPublishBlockers(now);
    if (!canPublish(blockers)) failures.push({ id: now.id, kind: "now", blockers });
  }

  return { ok: failures.length === 0, failures };
}
