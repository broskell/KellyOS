/**
 * Phase 13 publish-to-static. CLI talks to GET /v1/publish-check then GET /v1/bundle.
 * Does not import Mongo from visitor `src/`. Does not treat GET /v1/bundle as having written dist/.
 */
import { execSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { CONTENT_SCHEMA_VERSION, type ContentBundle } from "../../src/content/types";
import { VISITOR_BUNDLE_RELATIVE } from "../../src/content/publishedPath";
import { runPublishCheck } from "./publishCheck";
import { assembleBundle, type ContentStore } from "./store";

export const EMIT_REFUSED = "publish-check refused emit";

export type EmitResult =
  | { ok: true; written: string; deployed: boolean }
  | { ok: false; refused: true; failures: { id: string; kind: string; blockers: string[] }[] }
  | { ok: false; errors: string[] };

export function publishedOnlyBundle(bundle: ContentBundle): ContentBundle {
  return {
    schemaVersion: CONTENT_SCHEMA_VERSION,
    generatedAt: bundle.generatedAt,
    versions: bundle.versions,
    projects: bundle.projects.filter((p) => p.publish.status === "published"),
    skills: bundle.skills.filter((s) => s.publish.status === "published"),
    timeline: bundle.timeline.filter((t) => t.publish.status === "published"),
    now: bundle.now,
    assets: bundle.assets,
  };
}

export function visitorBundlePath(root: string): string {
  return path.join(root, ...VISITOR_BUNDLE_RELATIVE.split("/"));
}

export async function emitFromStore(
  store: ContentStore,
  opts: { root: string; deploy?: boolean; generatedAt?: string },
): Promise<EmitResult> {
  const check = await runPublishCheck(store);
  if (!check.ok) {
    return { ok: false, refused: true, failures: check.failures };
  }
  let assembled: ContentBundle;
  try {
    assembled = await assembleBundle(store, opts.generatedAt ?? new Date().toISOString());
  } catch (err) {
    const message = err instanceof Error ? err.message : "bundle failed";
    return { ok: false, errors: [message] };
  }
  if (assembled.now.publish.status !== "published") {
    return {
      ok: false,
      refused: true,
      failures: [
        {
          id: assembled.now.id,
          kind: "now",
          blockers: ["NowSnapshot must be published before emit (visitor now page would otherwise mix draft SoR)"],
        },
      ],
    };
  }
  const bundle = publishedOnlyBundle(assembled);
  const written = visitorBundlePath(opts.root);
  await mkdir(path.dirname(written), { recursive: true });
  await writeFile(written, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");

  let deployed = false;
  if (opts.deploy !== false) {
    runDeployHook(opts.root);
    deployed = true;
  }
  return { ok: true, written, deployed };
}

/** Default hook: rebuild the static Vite app so prerender reads the emitted JSON. Never `npm run server`. */
export function runDeployHook(root: string): void {
  const extra = process.env.KELLOS_DEPLOY_CMD?.trim();
  execSync("npm run build", { cwd: root, stdio: "inherit", env: process.env });
  if (extra) {
    execSync(extra, { cwd: root, stdio: "inherit", env: process.env });
  }
}

type CheckBody = { ok: boolean; failures: { id: string; kind: string; blockers: string[] }[] };
type BundleBody = { ok: boolean; bundle: ContentBundle; errors?: string[] };

export async function emitViaHttp(opts: {
  apiUrl: string;
  token: string;
  root: string;
  deploy?: boolean;
}): Promise<EmitResult> {
  const base = opts.apiUrl.replace(/\/$/, "");
  const headers = { Authorization: `Bearer ${opts.token}` };

  const checkRes = await fetch(`${base}/v1/publish-check`, { headers });
  const check = (await checkRes.json()) as CheckBody;
  if (!checkRes.ok) {
    return { ok: false, errors: [`publish-check HTTP ${checkRes.status}`] };
  }
  if (!check.ok) {
    return { ok: false, refused: true, failures: check.failures };
  }

  const bundleRes = await fetch(`${base}/v1/bundle`, { headers });
  const bundleJson = (await bundleRes.json()) as BundleBody;
  if (bundleRes.status === 409 || !bundleRes.ok) {
    return { ok: false, errors: bundleJson.errors ?? [`bundle HTTP ${bundleRes.status}`] };
  }
  if (bundleJson.bundle.now.publish.status !== "published") {
    return {
      ok: false,
      refused: true,
      failures: [
        {
          id: bundleJson.bundle.now.id,
          kind: "now",
          blockers: ["NowSnapshot must be published before emit"],
        },
      ],
    };
  }

  const bundle = publishedOnlyBundle(bundleJson.bundle);
  const written = visitorBundlePath(opts.root);
  await mkdir(path.dirname(written), { recursive: true });
  await writeFile(written, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");

  let deployed = false;
  if (opts.deploy !== false) {
    runDeployHook(opts.root);
    deployed = true;
  }
  return { ok: true, written, deployed };
}

async function main(): Promise<void> {
  const token = process.env.KELLOS_ADMIN_TOKEN;
  if (!token) {
    console.error("KELLOS_ADMIN_TOKEN is required. Do not commit it.");
    process.exit(1);
  }
  const apiUrl = process.env.KELLOS_EDIT_URL || `http://${process.env.KELLOS_EDIT_HOST || "127.0.0.1"}:${process.env.KELLOS_EDIT_PORT || "8787"}`;
  const root = process.env.KELLOS_EMIT_ROOT || process.cwd();
  const deploy = process.env.KELLOS_SKIP_DEPLOY === "1" ? false : true;
  const result = await emitViaHttp({ apiUrl, token, root, deploy });
  if (!result.ok && "refused" in result && result.refused) {
    console.error(EMIT_REFUSED);
    for (const f of result.failures) {
      console.error(`  ${f.kind} ${f.id}: ${f.blockers.join("; ")}`);
    }
    process.exit(2);
  }
  if (!result.ok) {
    if ("errors" in result) {
      console.error(result.errors.join("\n"));
    }
    process.exit(1);
  }
  console.log(`Wrote ${result.written}`);
  console.log(result.deployed ? "Deploy hook ran (npm run build)." : "Deploy hook skipped.");
}

const runningEmit = (process.argv[1] ?? "").replaceAll("\\", "/").includes("/emit.ts");
if (runningEmit) {
  main().catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : "emit failed");
    process.exit(1);
  });
}
