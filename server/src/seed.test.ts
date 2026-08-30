import { describe, expect, it } from "vitest";
import { v1SeedDocuments } from "./seed";

describe("V1 seed", () => {
  it("does not mark links verified or invent assets", () => {
    const seed = v1SeedDocuments();
    expect(seed.projects.some((p) => p.slug === "langchain-openrouter-provider")).toBe(true);
    for (const project of seed.projects) {
      for (const link of project.links) {
        expect(link.verified).toBe(false);
      }
      expect(project.cover).toBeUndefined();
      expect(project.tier === "gallery" ? project.blocks : project.blocks).toBeDefined();
    }
    expect(seed.projects.every((p) => p.authorship)).toBe(true);
    expect(seed.projects.find((p) => p.slug === "roast-my-project")).toBeUndefined();
  });
});
