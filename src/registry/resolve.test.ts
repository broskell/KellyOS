import { describe, expect, it } from "vitest";
import { APP_REGISTRY } from "./manifest";
import {
  isCommandLaunchable,
  launchPathFor,
  launchTargetsOn,
  resolveOpenQuery,
  searchRegistry,
} from "./resolve";

describe("registry command surfaces", () => {
  it("indexes Search from the search surface and omits empty-route rows", () => {
    const hits = searchRegistry("", "search");
    const ids = hits.map((h) => h.id);
    expect(ids).toContain("about");
    expect(ids).toContain("projects");
    expect(ids).toContain("terminal");
    expect(ids).toContain("settings");
    expect(ids).toContain("caseStudy");
    expect(ids).not.toContain("kellai");
    expect(ids).not.toContain("osUpdate");
    expect(ids).not.toContain("search");
  });

  it("resolves Terminal open about from terminalOpen, not a hardcoded list", () => {
    const r = resolveOpenQuery("about", "terminalOpen");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.target.id).toBe("about");
      expect(r.target.path).toBe("/about");
    }
  });

  it("lists openable apps for ls from the same terminalOpen surface", () => {
    const listed = launchTargetsOn("terminalOpen").map((t) => t.id);
    expect(listed).toContain("about");
    expect(listed).toContain("settings");
    expect(listed).not.toContain("kellai");
    expect(listed).not.toContain("osUpdate");
    expect(listed).not.toContain("search");
  });

  it("does not invent launch paths for KELL.AI or OS Update", () => {
    for (const id of ["kellai", "osUpdate", "search"] as const) {
      const app = APP_REGISTRY.find((a) => a.id === id)!;
      expect(isCommandLaunchable(app)).toBe(false);
      expect(launchPathFor(app)).toBeNull();
    }
  });
});
