import { describe, expect, it } from "vitest";
import type { ContentBundle, Project } from "./types";
import { bundleForVisitorBoot, filterBundleForVersion, latestVersionId, visibleInVersion } from "./versionFlags";

function project(over: Partial<Project>): Project {
  return {
    id: "p",
    slug: "p",
    title: "P",
    tagline: "t",
    tier: "gallery",
    status: "live",
    authorship: "manual",
    rank: 1,
    startedAt: "2023-01",
    stack: [],
    links: [],
    blocks: [],
    role: { solo: true },
    introducedIn: "v1",
    publish: { status: "published", updatedAt: "2026-08-30T00:00:00Z" },
    ...over,
  };
}

function bundle(): ContentBundle {
  return {
    schemaVersion: "1.0.0",
    generatedAt: "2026-08-30T00:00:00Z",
    versions: [
      {
        id: "v1",
        number: "1.0",
        eraStart: "2023-01",
        eraSummary: "one",
        sequence: 1,
        isLatest: false,
        features: [],
        releasedAt: "2023-01-01T00:00:00Z",
      },
      {
        id: "v3",
        number: "3.0",
        eraStart: "2026-06",
        eraSummary: "three",
        sequence: 3,
        isLatest: true,
        features: ["example-flag"],
        releasedAt: "2026-06-01T00:00:00Z",
      },
    ],
    projects: [
      project({ id: "old", slug: "old", introducedIn: "v1", retiredIn: "v3" }),
      project({ id: "new", slug: "new", introducedIn: "v3" }),
    ],
    skills: [],
    timeline: [],
    now: {
      id: "now",
      introducedIn: "v3",
      updatedAt: "2026-08-01",
      stalenessThresholdDays: 45,
      entries: [],
      publish: { status: "published", updatedAt: "2026-08-30T00:00:00Z" },
    },
    assets: {},
  };
}

describe("version flags at content load", () => {
  it("hides retired rows from later versions and hides not-yet-introduced rows", () => {
    expect(visibleInVersion("v1", { introducedIn: "v1", retiredIn: "v3" })).toBe(true);
    expect(visibleInVersion("v3", { introducedIn: "v1", retiredIn: "v3" })).toBe(false);
    expect(visibleInVersion("v1", { introducedIn: "v3" })).toBe(false);
  });

  it("filters the bundle for a version without touching component code", () => {
    const v1 = filterBundleForVersion(bundle(), "v1");
    expect(v1.projects.map((p) => p.id)).toEqual(["old"]);
    const v3 = bundleForVisitorBoot(bundle());
    expect(latestVersionId(bundle())).toBe("v3");
    expect(v3.projects.map((p) => p.id)).toEqual(["new"]);
  });
});
