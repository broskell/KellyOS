import { describe, expect, it } from "vitest";
import { documents } from "./documents";
import { headingLevels, headingOrderSkips } from "./outline";

describe("document heading order", () => {
  it("starts at h1 and never skips a level on Reader/prerender docs", () => {
    for (const doc of Object.values(documents)) {
      const levels = headingLevels(doc);
      expect(levels[0], doc.id).toBe(1);
      expect(headingOrderSkips(levels), `${doc.id}: ${levels.join("→")}`).toBe(false);
    }
  });
});
