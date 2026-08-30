import { describe, expect, it } from "vitest";
import { langchainBlocks } from "./langchain";
import { assertVerifiedShape, publishedExternalLinks } from "./publish";
import type { ExternalLink } from "./types";

describe("ExternalLink.verified gate", () => {
  it("does not publish unverified links", () => {
    const links: ExternalLink[] = [
      {
        kind: "pr",
        label: "PR",
        url: "https://github.com/langchain-ai/langchain/pull/39301",
        verified: false,
      },
      {
        kind: "live",
        label: "Live",
        url: "https://example.com",
        verified: true,
        verifiedAt: "2026-08-30",
      },
    ];
    const published = publishedExternalLinks(links);
    expect(published).toHaveLength(1);
    expect(published[0]?.label).toBe("Live");
  });

  it("refuses verified:true without a date-checked verifiedAt", () => {
    const published = publishedExternalLinks([
      {
        kind: "pr",
        label: "PR",
        url: "https://github.com/langchain-ai/langchain/pull/39301",
        verified: true,
      },
    ]);
    expect(published).toHaveLength(0);
  });

  it("leaves LangChain case-study linkGroup unpublished (A1.1 still open)", () => {
    const group = langchainBlocks.find((b) => b.type === "linkGroup");
    expect(group?.type).toBe("linkGroup");
    if (group?.type !== "linkGroup") return;
    for (const link of group.links) {
      expect(link.verified).toBe(false);
      expect(assertVerifiedShape(link)).toBeNull();
    }
    expect(publishedExternalLinks(group.links)).toEqual([]);
  });
});
