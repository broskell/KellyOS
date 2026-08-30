import type { ContentBlock } from "./types";

export function makeBlocks(drafts: object[]): ContentBlock[] {
  return drafts.map((d, i) => ({
    ...(d as ContentBlock),
    introducedIn: "v3" as const,
    order: i + 1,
  }));
}
