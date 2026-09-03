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
    expect(ids).toContain("osUpdate");
    expect(ids).toContain("kellai");
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
    expect(listed).toContain("osUpdate");
    expect(listed).toContain("kellai");
    expect(listed).not.toContain("search");
  });

  it("resolves Terminal open os-update to the OS Update runtime", () => {
    const r = resolveOpenQuery("os-update", "terminalOpen");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.target.id).toBe("osUpdate");
      expect(r.target.path).toBe("/os-update");
    }
  });

  it("resolves Kelly.AI now that it has a runtime", () => {
    const r = resolveOpenQuery("kell-ai", "search");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.target.id).toBe("kellai");
      expect(r.target.path).toBe("/kell-ai");
    }
  });

  it("does not invent a launch path for the Search overlay", () => {
    const app = APP_REGISTRY.find((a) => a.id === "search")!;
    expect(isCommandLaunchable(app)).toBe(false);
    expect(launchPathFor(app)).toBeNull();
  });
});
