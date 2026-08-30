import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  canPublish,
  nowPublishBlockers,
  projectPublishBlockers,
  skillPublishBlockers,
  structuralProjectErrors,
  structuralSkillErrors,
  timelinePublishBlockers,
} from "../../src/content/honesty";
import { CONTENT_SCHEMA_VERSION, type AssetRecord, type NowSnapshot, type OSVersion, type Project, type Skill, type TimelineEntry } from "../../src/content/types";
import { emitFromStore } from "./emit";
import { runPublishCheck } from "./publishCheck";
import { assembleBundle, type ContentStore } from "./store";

function stamp<T extends { publish: { updatedAt: string; blockers?: string[] } }>(
  entity: T,
  blockers: string[],
): T {
  return {
    ...entity,
    publish: {
      ...entity.publish,
      updatedAt: new Date().toISOString(),
      blockers: blockers.length ? blockers : undefined,
    },
  };
}

function reject(reply: FastifyReply, status: number, errors: string[]) {
  return reply.code(status).send({ ok: false, errors });
}

async function requireAdmin(request: FastifyRequest, reply: FastifyReply): Promise<boolean> {
  // Browser CORS preflight has no Authorization header. Auth still applies to GET/PUT.
  if (request.method === "OPTIONS") return true;
  const url = request.url.split("?")[0] ?? "";
  if (url === "/health" || url === "/health/ready") return true;
  const token = process.env.KELLOS_ADMIN_TOKEN;
  if (!token) {
    await reply.code(503).send({ ok: false, errors: ["KELLOS_ADMIN_TOKEN is not set"] });
    return false;
  }
  const header = request.headers.authorization;
  if (header !== `Bearer ${token}`) {
    await reply.code(401).send({ ok: false, errors: ["unauthorized"] });
    return false;
  }
  return true;
}

export async function registerRoutes(app: FastifyInstance, store: ContentStore): Promise<void> {
  app.addHook("onRequest", async (request, reply) => {
    const allowed = await requireAdmin(request, reply);
    if (!allowed) return;
  });

  app.get("/health", async () => ({
    ok: true,
    role: "editing-api",
    schemaVersion: CONTENT_SCHEMA_VERSION,
    visitorReadPath: "static-vite-only",
  }));

  app.get("/health/ready", async (_req, reply) => {
    try {
      await store.ping();
      return { ok: true };
    } catch {
      return reply.code(503).send({ ok: false, errors: ["editing database unreachable"] });
    }
  });

  app.get("/v1/projects", async () => ({ ok: true, items: await store.listProjects() }));
  app.get("/v1/projects/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const item = await store.getProject(id);
    if (!item) return reply.code(404).send({ ok: false, errors: ["not found"] });
    return { ok: true, item };
  });
  app.put("/v1/projects/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = req.body as Project;
    if (!body || body.id !== id) return reject(reply, 400, ["body.id must match URL"]);
    const structural = structuralProjectErrors(body);
    if (structural.length) return reject(reply, 400, structural);
    const blockers = projectPublishBlockers(body);
    if (body.publish.status === "published" && !canPublish(blockers)) {
      return reject(reply, 409, ["cannot publish while blockers remain", ...blockers]);
    }
    const saved = await store.putProject(stamp(body, blockers));
    return { ok: true, item: saved, publishable: canPublish(blockers), blockers };
  });

  app.get("/v1/skills", async () => ({ ok: true, items: await store.listSkills() }));
  app.get("/v1/skills/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const item = await store.getSkill(id);
    if (!item) return reply.code(404).send({ ok: false, errors: ["not found"] });
    return { ok: true, item };
  });
  app.put("/v1/skills/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = req.body as Skill;
    if (!body || body.id !== id) return reject(reply, 400, ["body.id must match URL"]);
    const structural = structuralSkillErrors(body, body);
    if (structural.length) return reject(reply, 400, structural);
    const blockers = skillPublishBlockers(body, body);
    if (body.publish.status === "published" && !canPublish(blockers)) {
      return reject(reply, 409, ["cannot publish while blockers remain", ...blockers]);
    }
    const saved = await store.putSkill(stamp(body, blockers));
    return { ok: true, item: saved, publishable: canPublish(blockers), blockers };
  });

  app.get("/v1/timeline", async () => ({ ok: true, items: await store.listTimeline() }));
  app.get("/v1/timeline/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const item = await store.getTimeline(id);
    if (!item) return reply.code(404).send({ ok: false, errors: ["not found"] });
    return { ok: true, item };
  });
  app.put("/v1/timeline/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = req.body as TimelineEntry;
    if (!body || body.id !== id) return reject(reply, 400, ["body.id must match URL"]);
    const blockers = timelinePublishBlockers(body);
    if (body.publish.status === "published" && !canPublish(blockers)) {
      return reject(reply, 409, ["cannot publish while blockers remain", ...blockers]);
    }
    const saved = await store.putTimeline(stamp(body, blockers));
    return { ok: true, item: saved, publishable: canPublish(blockers), blockers };
  });

  app.get("/v1/now", async (_req, reply) => {
    const item = await store.getNow();
    if (!item) return reply.code(404).send({ ok: false, errors: ["not found"] });
    return { ok: true, item };
  });
  app.put("/v1/now", async (req, reply) => {
    const body = req.body as NowSnapshot;
    if (!body?.id) return reject(reply, 400, ["NowSnapshot.id is required"]);
    const blockers = nowPublishBlockers(body);
    if (body.publish.status === "published" && !canPublish(blockers)) {
      return reject(reply, 409, ["cannot publish while blockers remain", ...blockers]);
    }
    const saved = await store.putNow(stamp(body, blockers));
    return { ok: true, item: saved, publishable: canPublish(blockers), blockers };
  });

  app.get("/v1/versions", async () => ({ ok: true, items: await store.listVersions() }));
  app.get("/v1/versions/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const item = await store.getVersion(id);
    if (!item) return reply.code(404).send({ ok: false, errors: ["not found"] });
    return { ok: true, item };
  });
  app.put("/v1/versions/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = req.body as OSVersion;
    if (!body || body.id !== id) return reject(reply, 400, ["body.id must match URL"]);
    if (body.id !== "v1" && body.id !== "v2" && body.id !== "v3") {
      return reject(reply, 400, ["OSVersion.id must be v1 | v2 | v3"]);
    }
    const saved = await store.putVersion(body);
    return { ok: true, item: saved };
  });

  app.get("/v1/assets", async () => ({ ok: true, items: await store.listAssets() }));
  app.get("/v1/assets/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const item = await store.getAsset(id);
    if (!item) return reply.code(404).send({ ok: false, errors: ["not found"] });
    return { ok: true, item };
  });
  app.put("/v1/assets/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = req.body as AssetRecord;
    if (!body || body.id !== id) return reject(reply, 400, ["body.id must match URL"]);
    if (!body.url) return reject(reply, 400, ["AssetRecord.url is required"]);
    const saved = await store.putAsset(body);
    return { ok: true, item: saved };
  });

  /** Admin preview of the ContentBundle shape. Does not write files or deploy. */
  app.get("/v1/bundle", async (_req, reply) => {
    try {
      const bundle = await assembleBundle(store, new Date().toISOString());
      return { ok: true, bundle };
    } catch (err) {
      const message = err instanceof Error ? err.message : "bundle failed";
      return reply.code(409).send({ ok: false, errors: [message] });
    }
  });

  /** Refuse list for emit. Drafts may keep blockers; published rows must be clean. */
  app.get("/v1/publish-check", async () => runPublishCheck(store));

  /**
   * Writes the visitor ContentBundle JSON on this host after publish-check.
   * Not the Vercel visitor project. CLI `npm run publish` is the full sequence + deploy hook.
   */
  app.post("/v1/emit", async (req, reply) => {
    const body = (req.body ?? {}) as { deploy?: boolean };
    const root = process.env.KELLOS_EMIT_ROOT || process.cwd();
    const result = await emitFromStore(store, { root, deploy: Boolean(body.deploy) });
    if (!result.ok && "refused" in result && result.refused) {
      return reply.code(409).send({ ok: false, refused: true, failures: result.failures });
    }
    if (!result.ok) {
      if ("errors" in result) {
        return reply.code(409).send({ ok: false, errors: result.errors });
      }
      return reply.code(409).send({ ok: false, refused: true, failures: [] });
    }
    return { ok: true, written: result.written, deployed: result.deployed };
  });
}
