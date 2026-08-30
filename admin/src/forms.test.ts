import { describe, expect, it } from "vitest";
import { liveProjectBlockers, projectClientErrors, toProject, type ProjectForm } from "./forms";
import { PHASE_13_SEQUENCE } from "./phase13";

function form(over: Partial<ProjectForm> = {}): ProjectForm {
  return {
    id: "prj_x",
    slug: "x",
    title: "X",
    tagline: "x",
    tier: "gallery",
    status: "unlaunched",
    authorship: "",
    rank: 1,
    startedAt: "2026-06",
    stack: [],
    links: [],
    blocks: [],
    role: { solo: true },
    introducedIn: "v3",
    publish: { status: "draft", updatedAt: "2026-08-30T00:00:00Z" },
    ...over,
  };
}

describe("admin authoring forms", () => {
  it("refuses to serialize a project without authorship", () => {
    const errors = projectClientErrors(form());
    expect(errors.some((e) => e.toLowerCase().includes("authorship"))).toBe(true);
    expect(() => toProject(form())).toThrow();
  });

  it("requires MetricsBlock.source in the form", () => {
    const errors = projectClientErrors(
      form({
        authorship: "manual",
        blocks: [
          {
            id: "m1",
            type: "metrics",
            order: 1,
            introducedIn: "v3",
            metrics: [{ label: "users", value: "100", source: "  ", verified: false }],
          },
        ],
      }),
    );
    expect(errors.some((e) => e.includes("source"))).toBe(true);
  });

  it("surfaces unverified links as publish blockers once authorship is set", () => {
    const blockers = liveProjectBlockers(
      form({
        authorship: "aiAssisted",
        links: [{ kind: "repo", label: "repo", url: "https://example.com", verified: false }],
      }),
    );
    expect(blockers.some((b) => b.includes("unverified"))).toBe(true);
  });

  it("records the Phase 13 sequence without an emit step in this package", () => {
    expect(PHASE_13_SEQUENCE[0]).toContain("publish-check");
    expect(PHASE_13_SEQUENCE[1]).toContain("/v1/bundle");
    expect(PHASE_13_SEQUENCE.join(" ")).not.toMatch(/vercel deploy/i);
  });
});
