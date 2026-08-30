import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = join(process.cwd(), "src");
const BANNED = [
  /from\s+["']mongodb["']/,
  /from\s+["']fastify["']/,
  /MONGODB_URI/,
  /from\s+["'][^"']*\/server\//,
  /from\s+["'][^"']*\/admin\//,
];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else if (/\.(ts|tsx)$/.test(name) && !name.endsWith(".test.ts")) out.push(path);
  }
  return out;
}

describe("visitor read path has zero database calls", () => {
  it("does not import Mongo, Fastify, or the editing API from src/", () => {
    const files = walk(SRC);
    expect(files.length).toBeGreaterThan(10);
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      for (const re of BANNED) {
        if (re.test(text)) hits.push(`${file} matches ${re}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it("does not add a catch-all SPA rewrite", () => {
    const vercel = readFileSync(join(process.cwd(), "vercel.json"), "utf8");
    expect(vercel).not.toMatch(/"source":\s*"\/\*"/);
    expect(vercel).toContain("/terminal");
    expect(vercel).toContain("/settings");
  });

  it("does not mount the admin app from the visitor Vite entry", () => {
    const main = readFileSync(join(process.cwd(), "src/main.tsx"), "utf8");
    const vite = readFileSync(join(process.cwd(), "vite.config.ts"), "utf8");
    expect(main).not.toMatch(/admin/i);
    expect(vite).not.toMatch("admin/");
    expect(vite).not.toMatch("5174");
  });

  it("does not call the editing API from visitor modules", () => {
    const files = walk(SRC);
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      if (text.includes("/v1/publish-check") || text.includes("/v1/bundle") || text.includes("/v1/emit")) {
        hits.push(file);
      }
    }
    expect(hits).toEqual([]);
  });
});
