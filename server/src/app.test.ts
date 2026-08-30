import { afterEach, describe, expect, it } from "vitest";
import type { Project, Skill } from "../../src/content/types";
import { buildEditingApp } from "./app";
import { MemoryContentStore } from "./memoryStore";

const token = "test-admin-token";

function project(over: Partial<Project> = {}): Project {
  return {
    id: "prj_test",
    slug: "test",
    title: "Test",
    tagline: "A test",
    tier: "gallery",
    status: "unlaunched",
    authorship: "aiAssisted",
    rank: 1,
    startedAt: "2026-06",
    stack: [],
    links: [],
    blocks: [],
    role: { solo: true },
    introducedIn: "v3",
    publish: { status: "draft", updatedAt: "2026-08-30T00:00:00Z" },
    ...over,
  };
}

async function appWithToken() {
  process.env.KELLOS_ADMIN_TOKEN = token;
  const store = new MemoryContentStore();
  const app = await buildEditingApp(store);
  return { app, store };
}

afterEach(() => {
  delete process.env.KELLOS_ADMIN_TOKEN;
  delete process.env.KELLOS_ADMIN_ORIGIN;
});

describe("editing API", () => {
  it("serves /health without a token and without Mongo", async () => {
    delete process.env.KELLOS_ADMIN_TOKEN;
    const app = await buildEditingApp(new MemoryContentStore());
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.role).toBe("editing-api");
    expect(body.visitorReadPath).toBe("static-vite-only");
    await app.close();
  });

  it("allows CORS preflight without a Bearer token", async () => {
    process.env.KELLOS_ADMIN_TOKEN = token;
    process.env.KELLOS_ADMIN_ORIGIN = "http://127.0.0.1:5174";
    const app = await buildEditingApp(new MemoryContentStore());
    const res = await app.inject({
      method: "OPTIONS",
      url: "/v1/projects",
      headers: {
        origin: "http://127.0.0.1:5174",
        "access-control-request-method": "PUT",
      },
    });
    expect(res.statusCode).toBe(204);
    expect(res.headers["access-control-allow-origin"]).toBe("http://127.0.0.1:5174");
    await app.close();
  });

  it("rejects unauthenticated writes", async () => {
    process.env.KELLOS_ADMIN_TOKEN = token;
    const app = await buildEditingApp(new MemoryContentStore());
    const res = await app.inject({
      method: "PUT",
      url: "/v1/projects/prj_test",
      payload: project(),
    });
    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it("refuses a project without authorship", async () => {
    const { app } = await appWithToken();
    const body = project();
    (body as { authorship?: string }).authorship = undefined;
    const res = await app.inject({
      method: "PUT",
      url: "/v1/projects/prj_test",
      headers: { authorization: `Bearer ${token}` },
      payload: body,
    });
    expect(res.statusCode).toBe(400);
    expect(JSON.stringify(res.json())).toContain("authorship");
    await app.close();
  });

  it("stores unverified links as draft and refuses published", async () => {
    const { app } = await appWithToken();
    const draft = project({
      links: [{ kind: "pr", label: "PR", url: "https://example.com/pr", verified: false }],
    });
    const saved = await app.inject({
      method: "PUT",
      url: "/v1/projects/prj_test",
      headers: { authorization: `Bearer ${token}` },
      payload: draft,
    });
    expect(saved.statusCode).toBe(200);
    expect(saved.json().publishable).toBe(false);

    const published = await app.inject({
      method: "PUT",
      url: "/v1/projects/prj_test",
      headers: { authorization: `Bearer ${token}` },
      payload: { ...draft, publish: { ...draft.publish, status: "published" } },
    });
    expect(published.statusCode).toBe(409);
    await app.close();
  });

  it("rejects MetricsBlock without source", async () => {
    const { app } = await appWithToken();
    const res = await app.inject({
      method: "PUT",
      url: "/v1/projects/prj_test",
      headers: { authorization: `Bearer ${token}` },
      payload: project({
        blocks: [
          {
            id: "m1",
            type: "metrics",
            order: 1,
            introducedIn: "v3",
            metrics: [{ label: "users", value: "100", source: "", verified: false }],
          },
        ],
      }),
    });
    expect(res.statusCode).toBe(400);
    expect(JSON.stringify(res.json())).toContain("source");
    await app.close();
  });

  it("rejects skill meters", async () => {
    const { app } = await appWithToken();
    const skill: Skill & { proficiency: number } = {
      id: "sk_ts",
      name: "TypeScript",
      tier: 2,
      category: "language",
      evidence: [{ kind: "deployedProject", statement: "used in a live project" }],
      introducedIn: "v3",
      publish: { status: "draft", updatedAt: "2026-08-30T00:00:00Z" },
      proficiency: 80,
    };
    const res = await app.inject({
      method: "PUT",
      url: "/v1/skills/sk_ts",
      headers: { authorization: `Bearer ${token}` },
      payload: skill,
    });
    expect(res.statusCode).toBe(400);
    expect(JSON.stringify(res.json())).toContain("proficiency");
    await app.close();
  });

  it("publish-check ignores draft blockers and fails published ones", async () => {
    const { app, store } = await appWithToken();
    await store.putNow({
      id: "now_test",
      introducedIn: "v3",
      updatedAt: "2026-08-01",
      stalenessThresholdDays: 45,
      entries: [],
      publish: { status: "draft", updatedAt: "2026-08-30T00:00:00Z", blockers: ["still drafting"] },
    });
    await store.putProject(
      project({
        links: [{ kind: "pr", label: "PR", url: "https://example.com/pr", verified: false }],
      }),
    );
    const draftCheck = await app.inject({
      method: "GET",
      url: "/v1/publish-check",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(draftCheck.statusCode).toBe(200);
    expect(draftCheck.json().ok).toBe(true);

    await store.putProject(
      project({
        links: [{ kind: "pr", label: "PR", url: "https://example.com/pr", verified: false }],
        publish: { status: "published", updatedAt: "2026-08-30T00:00:00Z" },
      }),
    );
    const publishedCheck = await app.inject({
      method: "GET",
      url: "/v1/publish-check",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(publishedCheck.json().ok).toBe(false);
    expect(publishedCheck.json().failures[0].kind).toBe("project");
    await app.close();
  });
});
