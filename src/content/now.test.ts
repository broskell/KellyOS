import { describe, expect, it } from "vitest";
import { nowBlocks, nowIsStale, nowSnapshot } from "./now";

describe("Now staleness", () => {
  it("is current within the threshold", () => {
    expect(nowIsStale(new Date("2026-08-30T12:00:00Z"))).toBe(false);
  });

  it("looks stale after the threshold", () => {
    expect(nowIsStale(new Date("2026-10-01T00:00:00Z"))).toBe(true);
  });

  it("uses caution copy when stale and note when current", () => {
    const fresh = nowBlocks(new Date("2026-08-30T12:00:00Z"));
    const stale = nowBlocks(new Date("2026-10-01T00:00:00Z"));
    const freshDate = fresh.find((b) => b.id === "now_date");
    const staleDate = stale.find((b) => b.id === "now_date");
    expect(freshDate && freshDate.type === "callout" && freshDate.variant).toBe("note");
    expect(staleDate && staleDate.type === "callout" && staleDate.variant).toBe("caution");
    expect(freshDate && freshDate.type === "callout" && freshDate.text).toBe(nowSnapshot.updatedLabel);
  });
});
