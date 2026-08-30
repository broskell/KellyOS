import { describe, expect, it } from "vitest";
import {
  canPublish,
  contentBlockPublishBlockers,
  projectPublishBlockers,
  skillMeterKeysPresent,
  skillPublishBlockers,
} from "./honesty";
import type { ContentBlock, Project, Skill } from "./types";

const published = { status: "published" as const, updatedAt: "2026-08-30T00:00:00Z" };

function project(over: Partial<Project> = {}): Project {
  return {
    id: "prj_test",
    slug: "test",
    title: "Test",
    tagline: "A test",
    tier: "gallery",
    status: "unlaunched",
    authorship: "aiAssisted",
    rank: 1,
    startedAt: "2026-06",
    stack: ["TypeScript"],
    links: [],
    blocks: [],
    role: { solo: true },
    introducedIn: "v3",
    publish: published,
    ...over,
  };
}

describe("honesty at rest", () => {
  it("requires Project.authorship", () => {
    const bare = project();
    (bare as { authorship?: string }).authorship = undefined;
    expect(projectPublishBlockers(bare).some((b) => b.includes("authorship"))).toBe(true);
  });

  it("requires ownedAreas when not solo", () => {
    const blockers = projectPublishBlockers(project({ role: { solo: false, teamSize: 3 } }));
    expect(blockers.some((b) => b.includes("ownedAreas"))).toBe(true);
  });

  it("blocks unverified ExternalLink even when verifiedAt is missing", () => {
    const blockers = projectPublishBlockers(
      project({
        links: [{ kind: "pr", label: "PR", url: "https://example.com/pr", verified: false }],
      }),
    );
    expect(canPublish(blockers)).toBe(false);
  });

  it("requires MetricsBlock.source", () => {
    const block = {
      id: "m1",
      type: "metrics",
      order: 1,
      introducedIn: "v3",
      metrics: [{ label: "users", value: "100", source: "", verified: false }],
    } as ContentBlock;
    const blockers = contentBlockPublishBlockers(block);
    expect(blockers.some((b) => b.includes("source"))).toBe(true);
  });

  it("rejects skill meters and empty evidence", () => {
    const skill: Skill = {
      id: "sk_x",
      name: "TypeScript",
      tier: 2,
      category: "language",
      evidence: [],
      introducedIn: "v3",
      publish: published,
    };
    expect(skillMeterKeysPresent({ ...skill, proficiency: 80 })).toEqual(["proficiency"]);
    expect(skillPublishBlockers(skill, { ...skill, proficiency: 80 }).length).toBeGreaterThan(0);
    expect(canPublish(skillPublishBlockers(skill))).toBe(false);
  });

  it("allows a skill with evidence and no meter fields", () => {
    const skill: Skill = {
      id: "sk_git",
      name: "Git / GitHub",
      tier: 1,
      category: "tooling",
      evidence: [{ kind: "mergedPR", statement: "Merged PR #39301 in langchain-ai/langchain" }],
      introducedIn: "v3",
      publish: { status: "draft", updatedAt: published.updatedAt },
    };
    expect(skillMeterKeysPresent(skill)).toEqual([]);
    expect(skillPublishBlockers(skill).filter((b) => b.includes("evidence"))).toEqual([]);
  });
});
