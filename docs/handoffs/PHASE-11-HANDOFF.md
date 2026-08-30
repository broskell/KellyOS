# Phase 11 Handoff — Backend & Database

**Phase:** 11 — Fastify + MongoDB implementing the **unchanged** Phase 0 content contract. **Not** Admin CMS (Phase 12). **Not** Publish-to-static (Phase 13). **Not** OS Update (Phase 14). **Not** KELL.AI (Phase 15).
**Completed:** 30 August 2026
**Next:** Phase 12 — Admin CMS talking to this API. **Do not start Phase 12 in the Phase 11 chat.**

---

## Blueprint vs the pasted Phase 11 brief

`docs/MASTER-BLUEPRINT.md` **exists** (v1.0-reconstructed, 30 August 2026). It **wins**.

No **original** (15 August) Master Blueprint appeared. Searched; reconstruction remains the authority. If the original is recovered, it wins over this handoff and the reconstruction — flag diffs; do not silently merge. If it assigns Phase 11 to something else, this work is the wrong phase.

Pasted brief and reconstructed §10.2 agree: Phase 11 is **Backend & Database**. §3.6 (publish-to-static, zero DB on the visitor read path) and §3.9 (V1 zero-backend; Fastify/Mongo are V2) were followed. V1 visitor site stays the static Vite app.

`docs/CONTEXT.md` still says the blueprint never reached Phase 0. That file was **not** rewritten.

---

## Gate from Phase 10 (still true)

- Production did **not** deploy (no host credentials). Host = Vercel **static**. Nested prerender still wins over SPA fallback (`vercel.json` rewrites only `/terminal` and `/settings`).
- Canonicals still name `https://kellos.vercel.app` until a real origin is set and rebuilt.
- Homework still missing: A3.8, A1.1, A3.1–A3.6. Did **not** invent a gallery cut or `verified: true`.
- Parent git remote is RolePlay-Chatbot — **do not push KellOS there.**

---

## Failures and wrong assumptions (recorded as they happened)

1. **Master Blueprint is still a reconstruction.** Proceeded under reconstructed §10.2.
2. **Live Mongo was not exercised.** `MONGODB_URI` was unset in this environment. API tests used an in-memory store. Indexes/validators exist in code; they have not been applied to a real cluster in this chat.
3. **If a Mongo URI was pasted in a prior chat, treat it as leaked.** Saathvik must rotate it. None was hardcoded here; `.env` is gitignored.
4. **V1 modules are not already `Project` documents.** Seed maps only what already has a date in typed modules. Roast My Project, Ducati, and Recycle Bin rows were **not** seeded (no `startedAt` in those modules). PawSethu and LangChain were, using timeline months already on record (`2025-09`, `2026-06`) with `approximate` inherited where the timeline says so.
5. **LangChain `authorship: aiAssisted` on seed is ASSUMED** from the site-wide honesty stance, not a field that existed on the V1 case-study module. Phase 12 may correct it. It is required at rest — no default in the API.
6. **Tier 2/3 skill evidence is the V1 tier subtitle**, with an explicit publish blocker that a per-skill instance was not named. That satisfies `Skill.evidence` non-empty without inventing a project. Do not publish those rows until evidence is named.
7. **`fastify` and `mongodb` live in the repo `package.json`.** They are not imported from `src/`. Visitor `vite build` chunk hashes for shell + apps were unchanged (`index-Df-e8LY-.js` ~76.7KB gzip, `DesktopShell-uNHghZRg.js` ~38.2KB gzip). Vercel must keep running `npm run build`, never `npm run server`.
8. **Optional ContentBlock fields completed toward `content-model.md`:** `quote.sourceUrl`, `diagram.source` / `diagram.asset`, `embed.aspectRatio`. Existing V1 blocks did not need them. No visual fields added.

---

## 1. DECIDED — locked, do not renegotiate

### Where the editing system of record lives
- **Process:** Fastify on `127.0.0.1:8787` by default (`KELLOS_EDIT_HOST` / `KELLOS_EDIT_PORT`).
- **Store:** MongoDB via `MONGODB_URI` (optional `MONGODB_DB`, default `kellos_edit` or the URI path). **EntityId is `_id`** (string, not ObjectId). Slug is never the primary key.
- **Collections:** `projects`, `skills`, `timeline`, `now` (one snapshot), `versions`, `assets`.
- **Embedding:** `ContentBlock[]` on `Project`; `NowEntry[]` on `NowSnapshot`; `ExternalLink` / `AssetRef` / `PublishState` inlined. Assets’ bytes stay on the static host; Mongo holds `AssetRecord` `{ id, url, width?, height? }` — the same map as `ContentBundle.assets`.
- **Connection:** one `MongoClient` per process. Pool sized for a **long-running admin API**, not visitors: `maxPoolSize: 10`, `minPoolSize: 0`, `maxIdleTimeMS: 60000`, `connectTimeoutMS: 10000`, `serverSelectionTimeoutMS: 5000`. Assumption disclosed in `server/src/db.ts`: one Fastify process, low concurrency.

### Honesty at rest
Enforced in `src/content/honesty.ts` (shared contract; visitor still does not call Mongo):

| Rule | At rest (PUT) | Publish (`status: "published"` or `/v1/publish-check`) |
|---|---|---|
| `Project.authorship` required | **400** | — |
| `role.ownedAreas` when not solo | **400** | — |
| `MetricsBlock.metrics[].source` | **400** if empty | — |
| Skill meter / ability keys | **400** | Mongo `$jsonSchema` `not` those keys |
| `Skill.evidence` non-empty | **400** | — |
| `verified: true` without `verifiedAt` | **400** | — |
| Unverified `ExternalLink` | stored | **409** / check failure |
| Stored `publish.blockers` | kept | **409** if non-empty |

No skill meters of any kind. Visitor `publishedExternalLinks` is unchanged.

### Visitor path
Still the hand-authored Vite bundle. **Zero** `mongodb` / `fastify` / `MONGODB_URI` / `server/` imports under `src/` (excluding tests). Nested prerender (`/project/...`, `/read/...`) untouched. No catch-all SPA rewrite.

### Frozen (untouched on purpose)
Win95–98 chrome; taskbar `shrink-0`; Phase 3 WM core still pure. Phase 0 About / LangChain **body** modules unchanged. `publishedAssets` still `{}`. LangChain links still `verified: false`. `kellos.md` not drafted. KELL.AI / OS Update not built. Admin UI not built. Deploy hook not built.

---

## 2. OPEN QUESTIONS — still Saathvik’s

Carry-forward from Phase 10, plus:

| # | Question | Phase 11 note |
|---|---|---|
| 1 | Confirm reconstructed §10.2 | Followed it |
| 9 | A3.8 gallery cut 8–10 | Still open; not invented |
| 11 | A1.1 URL verification | Still open; seed does not set `verified: true` |
| 12 | A3.1–A3.6 captures + alt | Assets collection empty |
| 13 | Production host login | Still blocking the live visitor URL |
| 15 | **Rotate any Mongo URI that appeared in chat** | Do not paste it into git |
| 16 | Confirm LangChain `authorship` | Seeded `aiAssisted` (ASSUMED) |
| 17 | Where the editing API is hosted | Not Vercel static. Phase 12/ops choose a long-running host |

---

## 3. ASSUMED (blueprint-dependent)

- Phase 11 = Fastify + Mongo on the Phase 0 contract (**blueprint §10.2**).
- Document “versions” means `OSVersion`, not a revision history collection.
- Seed `features: []` until Phase 14 names flags.
- In-memory store tests are sufficient to prove the API without a cluster in this chat.

---

## 4. WHAT PHASE 12 NEEDS — how the admin talks to this API

Admin CMS is a **separate UI**. It must not be mounted inside the visitor Vite app and must not be imported from `src/`.

### Run the API
```text
copy .env.example → .env   (fill MONGODB_URI, KELLOS_ADMIN_TOKEN; never commit)
npx tsc -p server/tsconfig.json
npm run server
# optional: npm run server:seed
```
`KELLOS_ADMIN_ORIGIN` = the admin’s origin (CORS). Omit it to send no CORS headers (same-host only).

### Auth
Every `/v1/*` route: `Authorization: Bearer $KELLOS_ADMIN_TOKEN`.  
`GET /health` is public (no DB). `GET /health/ready` pings Mongo.

### Routes (JSON in, JSON out)

| Method | Path | Body |
|---|---|---|
| PUT | `/v1/projects/:id` | full `Project` (`body.id` must match URL) |
| GET | `/v1/projects`, `/v1/projects/:id` | |
| PUT/GET | `/v1/skills/:id`, `/v1/skills` | full `Skill` |
| PUT/GET | `/v1/timeline/:id`, `/v1/timeline` | full `TimelineEntry` |
| PUT/GET | `/v1/now` | full `NowSnapshot` (singleton) |
| PUT/GET | `/v1/versions/:id`, `/v1/versions` | full `OSVersion` (`v1` \| `v2` \| `v3`) |
| PUT/GET | `/v1/assets/:id`, `/v1/assets` | `{ id, url, width?, height? }` |
| GET | `/v1/bundle` | `ContentBundle` projection for preview — **does not write `dist/` or deploy** |
| GET | `/v1/publish-check` | `{ ok, failures[] }` — Phase **13** refuses emit when `ok` is false |

Writes are **whole-document PUT** (authoring). 400 = structural honesty failure. 409 = attempted `published` while blockers remain. Successful draft PUT still returns `publishable` + `blockers`.

Types: `src/content/types.ts` (same contract as `docs/content-model.md`). Honesty helpers: `src/content/honesty.ts`. Store interface: `server/src/store.ts`.

### What Phase 12 should build
Authoring UI for every entity; surface `publish.blockers` and unverified links **at the point of authoring**; never offer a proficiency meter. Do not call this API from `/`, Reader, or prerender.

---

## 5. WHAT PHASE 12 MUST NOT TOUCH

- Phase 0 copy (no quiet edits)
- Honesty stance / disclosure placement and weight
- Skill meters of any kind
- Promoting gallery → case study
- Visual fields on content blocks
- Tokens palette / restyle / Clippy
- Drafting `docs/content/case-studies/kellos.md` (Phase 18)
- Replacing Reader Mode or deleting prerender
- React/DOM/GSAP inside `src/wm/core.ts`
- Adding DB calls to the **visitor read path**
- Catch-all SPA fallback that eats `/project/...` and `/read/...`
- Inventing graduation date, location, metrics, screenshots, a gallery cut, or `verified: true`
- **Publish-to-static / deploy hook** (Phase 13)
- OS Update ceremony (Phase 14); KELL.AI (Phase 15)
- Hardcoding secrets; pushing KellOS to RolePlay-Chatbot
- Running the editing API on the Vercel static project that serves visitors

---

## 6. FILES PRODUCED (Phase 11)

```
src/content/types.ts          (entities added; small ContentBlock optionals from content-model)
src/content/honesty.ts
src/content/honesty.test.ts
src/content/visitor-path.test.ts
server/src/app.ts
server/src/app.test.ts
server/src/db.ts
server/src/index.ts
server/src/memoryStore.ts
server/src/mongoStore.ts
server/src/routes.ts
server/src/schema.ts
server/src/seed.ts
server/src/seed.test.ts
server/src/store.ts
server/tsconfig.json
docs/handoffs/PHASE-11-HANDOFF.md
```

Touched: `package.json`, `package-lock.json`, `vitest.config.ts`, `.env.example`.

Untouched on purpose: `src/wm/core.ts` logic, Phase 0 About words, LangChain **body**, kellos.md, KELL.AI / OS Update runtimes, token palette, CONTEXT.md, `publishedAssets`, `verified: true`, `vercel.json` rewrites.

---

## 7. VERIFICATION (evidence)

- `npx tsc -b` — exit 0
- `npx tsc -p server/tsconfig.json` — exit 0
- `npm test` — **53/53** passed (prior 38 + honesty 5 + visitor-path 2 + editing API 6 + seed 1)
- `npx vite build` — exit 0; nested `dist/project`, `dist/read` still present; visitor JS chunks **do not** contain `mongodb` / `MONGODB`
- WM core has **no** React/DOM/GSAP/Mongo imports
- Live Mongo: **not** verified (`MONGODB_URI` unset)
- Live visitor URL: still not verified (Phase 10 deploy still blocked)

---

## 8. ONE-PARAGRAPH SUMMARY FOR THE PHASE 12 CHAT

Phase 11 added a Fastify editing API and Mongo schema for the Phase 0 entities (Project, ContentBlock, Skill, timeline, now, AssetRef, ExternalLink, PublishState, OSVersion). Honesty rules are enforced on write; unverified links can be stored as draft and cannot be marked published. The visitor site is still the static Vite app with zero Mongo on `/`, Reader, or prerender. Admin UI, publish-to-static, OS Update, and KELL.AI were not built. Seed is optional and incomplete on purpose (no invented dates, no `verified: true`, empty assets). Phase 12 is the authoring UI against `Authorization: Bearer` + PUT `/v1/...` — do not restyle, do not add DB to the visitor path, do not ship a deploy hook.
