import { describe, expect, it } from "vitest";
import { classifyVisit, visibleUpTo } from "./versionState";
import { LATEST_VERSION_ID, OS_VERSIONS } from "./versions";

describe("classifyVisit", () => {
  it("treats a first-time visitor as new and boots latest", () => {
    const v = classifyVisit(null, "v3");
    expect(v.kind).toBe("new");
    expect(v.boot).toBe("v3");
  });

  it("shows no ceremony to a returning visitor already at latest", () => {
    expect(classifyVisit("v3", "v3").kind).toBe("returning-current");
  });

  it("runs the ceremony when the site grew since the last visit", () => {
    const v = classifyVisit("v2", "v3");
    expect(v.kind).toBe("returning-updated");
    if (v.kind === "returning-updated") {
      expect(v.from).toBe("v2");
      expect(v.to).toBe("v3");
      expect(v.boot).toBe("v3");
    }
  });

  it("does not run the ceremony backwards", () => {
    expect(classifyVisit("v3", "v2").kind).toBe("returning-current");
  });
});

describe("visibleUpTo", () => {
  const rows = [
    { versionEra: "v1" as const },
    { versionEra: "v2" as const },
    { versionEra: "v3" as const },
  ];

  it("shows cumulative eras — 2.0 knows eras 1 and 2, not 3", () => {
    expect(visibleUpTo(rows, "v2")).toHaveLength(2);
    expect(visibleUpTo(rows, "v1")).toHaveLength(1);
    expect(visibleUpTo(rows, "v3")).toHaveLength(3);
  });
});

describe("version data", () => {
  it("has exactly one latest, and it is the newest sequence", () => {
    const latest = OS_VERSIONS.filter((v) => v.isLatest);
    expect(latest).toHaveLength(1);
    expect(latest[0].id).toBe(LATEST_VERSION_ID);
    expect(latest[0].sequence).toBe(Math.max(...OS_VERSIONS.map((v) => v.sequence)));
  });
});
