# Phase 13 Handoff — Publish-to-static

**Phase:** 13 — Publish → JSON bundle + deploy hook. `GET /v1/publish-check` is the refuse list. `GET /v1/bundle` is the ContentBundle projection. Then emit. **Zero** database calls on the visitor read path. **Not** Admin CMS (Phase 12, already shipped). **Not** OS Update (Phase 14). **Not** KELL.AI (Phase 15). **Not** a restyle. **Not** `kellos.md`.
**Completed:** 30 August 2026
**Next:** Phase 14 — Version system & update ceremony (feature flags at content load). **Do not start Phase 14 in the Phase 13 chat.**

---

## Blueprint vs the pasted Phase 13 brief

`docs/MASTER-BLUEPRINT.md` **exists** (v1.0-reconstructed, 30 August 2026). It **wins**.

No **original** (15 August) Master Blueprint appeared. Searched; reconstruction remains the authority. If the original is recovered, it wins over this handoff and the reconstruction — flag diffs; do not silently merge. If it assigns Phase 13 to something else, this work is the wrong phase.

Pasted brief and reconstructed §10.2 agree: Phase 13 is **Publish-to-static**. §3.6 (Mongo is editing SoR; publish emits JSON + deploy hook; zero DB on the visitor read path) and §3.9 (V1 already launched-or-blocked; Fastify/Mongo/admin/publish are V2) were followed.

`docs/CONTEXT.md` still says the blueprint never reached Phase 0. That file was **not** rewritten.

---

## Gate from Phase 12 (still true)

- Editing API: Fastify on `127.0.0.1:8787` by default. Auth: `Authorization: Bearer $KELLOS_ADMIN_TOKEN`. Whole-document PUT `/v1/projects/:id`, `/v1/skills/:id`, `/v1/timeline/:id`, `/v1/now`, `/v1/versions/:id`, `/v1/assets/:id`. EntityId is the Mongo `_id` (string).
- Live Mongo was **not** exercised in Phase 11 or 12 (`MONGODB_URI` unset). Still unset here. If a URI was pasted in a prior chat, treat it as leaked — Saathvik must rotate it; do **not** hardcode it.
- Visitor site stays the static Vite app. Nested prerender must keep winning over SPA fallback.
- Canonicals still say `https://kellos.vercel.app` until a real origin is set and rebuilt.
- Vercel runs `npm run build`, never `npm run server`, never `npm run admin`, never `npm run publish`.
- Do not run the editing API or the admin app on the Vercel static visitor project.
- Homework still missing: A3.8, A1.1, A3.1–A3.6. Did **not** invent a gallery cut or `verified: true`.
- Seed left Roast My Project / Ducati / Recycle unsaved (no `startedAt`). LangChain authorship `aiAssisted` is ASSUMED — may be corrected in admin, not hidden.
- Tier 2/3 skills carry subtitle-only evidence plus blockers; do not publish them as named instances.
- Parent git remote is RolePlay-Chatbot — **do not push KellOS there.**

---

## Failures and wrong assumptions (recorded as they happened)

1. **Master Blueprint is still a reconstruction.** Proceeded under reconstructed §10.2.
2. **Phase 11 `GET /v1/publish-check` failed every entity with blockers, including drafts.** That would make emit unusable while homework-blocked drafts exist (the CMS is supposed to store those). Phase 13 changed the check to **published rows only**, plus missing NowSnapshot. Drafts may keep blockers. Emit still refuses `published` rows with blockers or unverified links.
3. **Live Mongo still not exercised.** Emit tests use the in-memory store. `npm run publish` against a running API was **not** run (`MONGODB_URI` unset, so `npm run server` cannot start). Seed as-is would still refuse emit (LangChain links unverified; skill/project blockers).
4. **`GET /v1/bundle` is still preview-only.** Writing `src/content/published/bundle.json` is a separate step. The admin GET buttons do not write `dist/`.
5. **Vercel must not emit.** The deploy hook is `npm run build` on the machine that has the repo (plus optional `KELLOS_DEPLOY_CMD`). The visitor project’s build command stays `npm run build` and consumes a **committed or previously written** JSON file. `bundle.json` is gitignored until Saathvik chooses to commit a successful emit.
6. **Homework still missing.** First real emit is blocked on A1.1 (and on publishing a NowSnapshot without leftover blockers). Did not skip publish-check to ship anyway.

---

## 1. DECIDED — locked, do not renegotiate

### Call sequence (authoritative)

```text
1. GET /v1/publish-check
   Authorization: Bearer $KELLOS_ADMIN_TOKEN
   If body.ok === false → REFUSE. Do not write files. Do not deploy.
   body.failures[] is { id, kind, blockers }. Published rows only.

2. GET /v1/bundle
   Same auth. Returns { ok, bundle: ContentBundle }. Preview only. 409 if NowSnapshot is missing.

3. Emit
   Write published-only ContentBundle JSON to src/content/published/bundle.json
   (schemaVersion 1.0.0). Then the deploy hook: npm run build
   (optional KELLOS_DEPLOY_CMD after that). Nested prerender must keep winning.
```

CLI (expected shape): `npm run publish` → `tsx server/src/emit.ts` → HTTP steps 1–2, then write, then `npm run build` unless `KELLOS_SKIP_DEPLOY=1`.

Editing-API-side: `POST /v1/emit` with `{ "deploy": false }` (default) writes JSON on the **API host** after the same check. `{ "deploy": true }` also runs the hook. Admin may trigger write-only after publish-check. It does **not** fetch Mongo from the visitor origin.

### Drop path / visitor consumption

- Path: `src/content/published/bundle.json` (documented in `src/content/published/README.md`).
- Visitor Vite loads it at **build time** via `import.meta.glob` in `src/content/publishedBundle.ts`. No fetch, no Fastify, no Mongo on `/`, Reader, or prerender.
- Until the file exists, `src/content/live.ts` uses the Phase 0 hand-authored modules. Empty published slices also fall back (a skills-only emit cannot blank Tier 2/3 names).
- About, résumé, contact, recycle stay TypeScript — they are not in `ContentBundle`.
- `resolveAsset` merges emitted `bundle.assets` over the still-empty `publishedAssets` map.

### Version flags (for Phase 14 — recorded, ceremony not built)

Filtering happens in `src/content/versionFlags.ts` at **content load**, not in window components.

- `filterBundleForVersion(bundle, versionId)` uses `introducedIn` / `retiredIn`.
- `bundleForVisitorBoot(bundle)` uses the `isLatest` OSVersion (new visitors boot newest).
- `OSVersion.features[]` is the flag table. Phase 14 should: persist a returning visitor’s version id, pass it into `bundleForVisitorBoot` (or `filterBundleForVersion`) **once** when constructing the live content object, then feed already-filtered data to apps. Components must not ask “which version are we in?”. Do not put the update ceremony in the WM core.

### Frozen (untouched on purpose)

Win95–98 chrome; tokens palette; `src/wm/core.ts` still pure (no React/DOM/GSAP). Phase 0 About / LangChain **body** modules unchanged. `publishedAssets` still `{}` in source. LangChain visitor links still `verified: false` until emit overlays a published project. `kellos.md` not drafted. OS Update ceremony not built. KELL.AI not built. `CONTEXT.md` not rewritten. `vercel.json` rewrites still only `/terminal` and `/settings`.

---

## 2. OPEN QUESTIONS — still Saathvik’s

| # | Question | Phase 13 note |
|---|---|---|
| 1 | Confirm reconstructed §10.2 | Followed it |
| 9 | A3.8 gallery cut 8–10 | Still open; not invented |
| 11 | A1.1 URL verification | Blocks a real emit of LangChain |
| 12 | A3.1–A3.6 captures + alt | Assets map still empty until homework + emit |
| 13 | Production host login | Still blocking the live visitor URL |
| 15 | Rotate any Mongo URI that appeared in chat | Do not paste it into git |
| 16 | Confirm LangChain `authorship` | Still ASSUMED `aiAssisted` |
| 17 | Where the editing API is hosted | Not Vercel static. Emit writes on that host’s working tree or use CLI on the repo machine |
| 18 | Where the admin UI is hosted | Local `:5174`. Must not be the visitor Vercel project |
| 19 | Commit `bundle.json` after emit? | Gitignored by default. Vercel static build will keep using TypeScript modules until a committed emit exists |

---

## 3. ASSUMED (blueprint-dependent)

- Phase 13 = publish-to-static (**blueprint §10.2**).
- Publish-check should not treat draft homework blockers as a site-wide refuse (aligned with PUT 409 only on `status: "published"`).
- In-memory emit tests + visitor isolation tests are sufficient without a cluster in this chat.
- Per-slice TS fallback is safer than blanking V1 copy on a partial emit.

---

## 4. WHAT PHASE 14 NEEDS — versions as flags at load

Phase 14 is **Version system & update ceremony**. Do **not** implement it here.

Consume `OSVersion.features` and `VersionGated` **only** in `src/content/versionFlags.ts` (and the one call site in `src/content/live.ts` / `bundleForVisitorBoot`). Returning visitors get a remembered `VersionId`; new visitors keep `isLatest`. Then run the ceremony in the shell, not in `src/wm/core.ts`.

This handoff; `filterBundleForVersion`; seed still `features: []`; visitor still boots latest when a bundle exists.

---

## 5. WHAT PHASE 14 MUST NOT TOUCH

- Phase 0 copy (no quiet edits)
- Honesty stance / disclosure placement and weight
- Skill meters of any kind
- Promoting gallery → case study
- Visual fields on content blocks
- Tokens palette / restyle / Clippy
- Drafting `docs/content/case-studies/kellos.md` (Phase 18)
- Replacing Reader Mode or deleting prerender
- React/DOM/GSAP inside `src/wm/core.ts`
- Adding DB reads or Fastify calls to the **visitor read path**
- Catch-all SPA fallback that eats `/project/...` and `/read/...`
- Inventing graduation date, location, metrics, screenshots, a gallery cut, or `verified: true`
- Running the editing API or admin on the Vercel static visitor project
- Skipping publish-check
- Treating `GET /v1/bundle` as having written `dist/`
- KELL.AI (Phase 15)
- Hardcoding secrets; pushing KellOS to RolePlay-Chatbot
- Scattering `if (version === …)` through window components

---

## 6. FILES PRODUCED (Phase 13)

```
server/src/publishCheck.ts
server/src/emit.ts
server/src/emit.test.ts
src/content/publishedPath.ts
src/content/publishedBundle.ts
src/content/published/README.md
src/content/versionFlags.ts
src/content/versionFlags.test.ts
src/content/live.ts
docs/handoffs/PHASE-13-HANDOFF.md
```

Touched: `server/src/routes.ts` (`GET /v1/publish-check` published-only, `POST /v1/emit`), `server/src/app.ts` (CORS POST), `server/src/app.test.ts`, `src/content/assets.ts`, `src/content/documents.ts`, `src/content/now.ts` (optional snapshot arg), `src/content/timeline.ts` (optional entries arg), visitor windows that read live content, `admin/src/PublishDesk.tsx`, `admin/src/phase13.ts`, `admin/src/AdminApp.tsx`, `src/content/visitor-path.test.ts`, `package.json` (`npm run publish`), `.gitignore` (`bundle.json`), `.env.example`.

Untouched on purpose: `src/wm/core.ts` logic, Phase 0 About words, LangChain **body**, kellos.md, KELL.AI / OS Update runtimes, token palette, CONTEXT.md, `publishedAssets` source map, `verified: true` in visitor TypeScript, `vercel.json` rewrites.

---

## 7. VERIFICATION (evidence)

- `npx tsc -b` — exit 0 (after fixing GalleryRow re-export, emit union narrowing, unused filter binding)
- `npx tsc -p server/tsconfig.json` — exit 0
- `npx tsc -p admin/tsconfig.json` — exit 0
- `npm test` — **66/66** passed (prior 59 + publish-check published-only 1 + emit refuse/write/now 3 + versionFlags 2 + visitor `/v1/*` isolation 1)
- `npx vite build` — exit 0; nested `dist/project/langchain-openrouter-provider/index.html` present; visitor JS does **not** contain `mongodb` / `MONGODB_URI` / `/v1/emit`; shell chunks `index-CngKqRo_.js` ~76.6KB gzip, `DesktopShell-DOvcTj-j.js` ~38.1KB gzip
- `npm run admin:build` — exit 0; output `admin/dist/` (admin `outDir` is relative to `admin/`)
- WM core has **no** React/DOM/GSAP/Mongo imports
- Live Mongo / live `npm run publish`: **not** verified
- Live visitor URL: still not verified (Phase 10 deploy still blocked)

---

## 8. ONE-PARAGRAPH SUMMARY FOR THE PHASE 14 CHAT

Phase 13 wired publish-to-static: `GET /v1/publish-check` (published rows only) then `GET /v1/bundle` then write `src/content/published/bundle.json` then `npm run build`. CLI is `npm run publish`. Admin may `POST /v1/emit` for write-only on the API host; it does not emit from the visitor origin. Visitor Vite consumes the JSON at build time via `live.ts`; without a file it keeps Phase 0 TypeScript. Version filtering exists at load (`versionFlags.ts`) for Phase 14 — new visitors boot latest; do not scatter version checks in components; do not build the update ceremony in this chat. No Fastify/Mongo on `/`, Reader, or prerender. Nested prerender still wins. Do not restyle, do not invent `verified: true`, do not run this API on the Vercel static project.
