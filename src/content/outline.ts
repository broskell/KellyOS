import type { DocumentDoc } from "./documents";
import type { ContentBlock } from "./types";

/** Drop the first heading when it repeats the document title (that title is the h1). */
export function blocksAfterDocumentTitle(doc: DocumentDoc): ContentBlock[] {
  const first = doc.blocks[0];
  if (first?.type === "heading" && first.text === doc.heading) {
    return doc.blocks.slice(1);
  }
  return doc.blocks;
}

/** Document outline: synthetic h1 plus remaining heading blocks. */
export function headingLevels(doc: DocumentDoc): number[] {
  const levels = [1];
  for (const block of blocksAfterDocumentTitle(doc)) {
    if (block.type === "heading") levels.push(block.level);
  }
  return levels;
}

export function headingOrderSkips(levels: number[]): boolean {
  let prev = 0;
  for (const level of levels) {
    if (level < 1 || level > 4) return true;
    if (level > prev + 1) return true;
    prev = level;
  }
  return false;
}
