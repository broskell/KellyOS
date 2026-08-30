import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseDurationToMs } from "./duration";

describe("motion duration tokens", () => {
  it("parses ms and s, rejects junk", () => {
    expect(parseDurationToMs("400ms", 1)).toBe(400);
    expect(parseDurationToMs(" 0.18s ", 1)).toBe(180);
    expect(parseDurationToMs("", 50)).toBe(50);
    expect(parseDurationToMs("nope", 50)).toBe(50);
  });

  it("does not put GSAP in the WM core", () => {
    const dir = dirname(fileURLToPath(import.meta.url));
    const src = readFileSync(join(dir, "../wm/core.ts"), "utf8");
    expect(src).not.toMatch(/from ["']gsap["']/);
    expect(src).not.toMatch(/from ["']react["']/);
  });
});
