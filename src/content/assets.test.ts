import { describe, expect, it } from "vitest";
import { publishedAssets, resolveAsset } from "./assets";

describe("asset pipeline", () => {
  it("has no published screenshot rows until homework lands", () => {
    expect(Object.keys(publishedAssets)).toEqual([]);
  });

  it("resolves unknown ids as missing", () => {
    expect(resolveAsset("a3-1-langchain-pr")).toBeNull();
  });
});
