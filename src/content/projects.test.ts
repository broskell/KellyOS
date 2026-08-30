import { describe, expect, it } from "vitest";
import { galleryRows } from "./projects";

describe("gallery is a named view, not a cut", () => {
  it("does not claim an 8–10 cut and has no screenshots or live URLs", () => {
    expect(galleryRows.length).toBeLessThanOrEqual(10);
    expect(galleryRows.map((r) => r.title)).toEqual([
      "Roast My Project",
      "PawSethu",
      "Ducati Scrollytelling",
    ]);
    for (const row of galleryRows) {
      expect(row.screenshot).toBeUndefined();
      expect(row.live).toBeUndefined();
    }
  });
});
