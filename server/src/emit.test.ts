import { existsSync, readFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { NowSnapshot, OSVersion, Project } from "../../src/content/types";
import { emitFromStore } from "./emit";
import { MemoryContentStore } from "./memoryStore";

const stamp = "2026-08-30T00:00:00Z";

function version(): OSVersion {
  return {
    id: "v3",
    number: "3.0",
    eraStart: "2026-06",
    eraSummary: "latest",
    sequence: 3,
    isLatest: true,
    features: [],
    releasedAt: stamp,
  };
}

function now(status: "draft" | "published"): NowSnapshot {
  return {
    id: "now_test",
    introducedIn: "v3",
    updatedAt: "2026-08-01",
    stalenessThresholdDays: 45,
    entries: [{ id: "e1", category: "building", text: "KELL.OS", publish: { status, updatedAt: stamp } }],
    publish: { status, updatedAt: stamp },
  };
}

function cleanProject(): Project {
  return {
    id: "prj_ok",
    slug: "ok",
    title: "Ok",
    tagline: "A published gallery row",
    tier: "gallery",
    status: "unlaunched",
    authorship: "manual",
    rank: 1,
    startedAt: "2026-06",
    stack: [],
    links: [],
    blocks: [],
    role: { solo: true },
    introducedIn: "v3",
    publish: { status: "published", updatedAt: stamp },
  };
}

describe("publish-to-static emit", () => {
  const dirs: string[] = [];
  afterEach(async () => {
    await Promise.all(dirs.splice(0).map((d) => rm(d, { recursive: true, force: true })));
  });

  it("refuses to write files when a published entity has blockers", async () => {
    const root = await mkdtemp(join(tmpdir(), "kellos-emit-"));
    dirs.push(root);
    const store = new MemoryContentStore();
    await store.putVersion(version());
    await store.putNow(now("published"));
    await store.putProject({
      ...cleanProject(),
      links: [{ kind: "live", label: "site", url: "https://example.com", verified: false }],
    });
    const result = await emitFromStore(store, { root, deploy: false });
    expect(result.ok).toBe(false);
    if (result.ok || !("refused" in result)) throw new Error("expected refuse");
    expect(result.refused).toBe(true);
    expect(existsSync(join(root, "src/content/published/bundle.json"))).toBe(false);
  });

  it("writes schemaVersion 1.0.0 JSON and omits drafts", async () => {
    const root = await mkdtemp(join(tmpdir(), "kellos-emit-"));
    dirs.push(root);
    const store = new MemoryContentStore();
    await store.putVersion(version());
    await store.putNow(now("published"));
    await store.putProject(cleanProject());
    await store.putProject({
      ...cleanProject(),
      id: "prj_draft",
      slug: "draft",
      title: "Draft",
      publish: { status: "draft", updatedAt: stamp, blockers: ["homework"] },
    });
    const result = await emitFromStore(store, { root, deploy: false, generatedAt: stamp });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected write");
    expect(result.written).toContain("bundle.json");
    expect(result.deployed).toBe(false);
    const raw = readFileSync(result.written, "utf8");
    const bundle = JSON.parse(raw) as { schemaVersion: string; projects: { id: string }[] };
    expect(bundle.schemaVersion).toBe("1.0.0");
    expect(bundle.projects.map((p) => p.id)).toEqual(["prj_ok"]);
  });

  it("refuses emit when NowSnapshot is not published", async () => {
    const root = await mkdtemp(join(tmpdir(), "kellos-emit-"));
    dirs.push(root);
    const store = new MemoryContentStore();
    await store.putVersion(version());
    await store.putNow(now("draft"));
    const result = await emitFromStore(store, { root, deploy: false });
    expect(result.ok).toBe(false);
    if (result.ok || !("refused" in result)) throw new Error("expected refuse");
    expect(result.failures[0]?.kind).toBe("now");
    expect(existsSync(join(root, "src/content/published/bundle.json"))).toBe(false);
  });
});
