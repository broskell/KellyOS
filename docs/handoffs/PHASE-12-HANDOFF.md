# Phase 12 Handoff — Admin CMS

**Phase:** 12 — Authoring UI for every Phase 0 entity, talking to the Phase 11 Fastify API. Blockers and link verification at the point of authoring. **Not** Publish-to-static (Phase 13). **Not** OS Update (Phase 14). **Not** KELL.AI (Phase 15). **Not** a restyle. **Not** `kellos.md`.
**Completed:** 30 August 2026
**Next:** Phase 13 — Publish-to-static (JSON bundle + deploy hook). **Do not start Phase 13 in the Phase 12 chat.**

---

## Blueprint vs the pasted Phase 12 brief

`docs/MASTER-BLUEPRINT.md` **exists** (v1.0-reconstructed, 30 August 2026). It **wins**.

No **original** (15 August) Master Blueprint appeared. Searched; reconstruction remains the authority. If the original is recovered, it wins over this handoff and the reconstruction — flag diffs; do not silently merge. If it assigns Phase 12 to something else, this work is the wrong phase.

Pasted brief and reconstructed §10.2 agree: Phase 12 is **Admin CMS**. §3.6 (publish-to-static, zero DB on the visitor read path) and §3.9 (V1 zero-backend; Fastify/Mongo/admin are V2) were followed. Visitor site stays the static Vite app.

`docs/CONTEXT.md` still says the blueprint never reached Phase 0. That file was **not** rewritten.

---

## Gate from Phase 11 (still true)

- Editing API: Fastify on `127.0.0.1:8787` by default. Auth: `Authorization: Bearer $KELLOS_ADMIN_TOKEN`. Whole-document PUT. `GET /v1/bundle` is preview only. `GET /v1/publish-check` is the refuse list for Phase 13. EntityId is Mongo `_id` (string).
- Live Mongo was **not** exercised in Phase 11 (`MONGODB_URI` unset). Still unset in this chat. If a URI was pasted in a prior chat, treat it as leaked — Saathvik must rotate it; it was **not** hardcoded here.
- Canonicals still say `https://kellos.vercel.app` until a real origin is set and rebuilt.
- Vercel runs `npm run build`, never `npm run server`, never `npm run admin`.
- Homework still missing: A3.8, A1.1, A3.1–A3.6. Did **not** invent a gallery cut or `verified: true`.
- Seed still left Roast My Project / Ducati / Recycle unsaved (no `startedAt`). LangChain authorship `aiAssisted` remains ASSUMED — admin can correct it, does not hide it.
- Parent git remote is RolePlay-Chatbot — **do not push KellOS there.**

---

## Failures and wrong assumptions (recorded as they happened)

1. **Master Blueprint is still a reconstruction.** Proceeded under reconstructed §10.2.
2. **CORS preflight was unusable.** Phase 11 documented `KELLOS_ADMIN_ORIGIN` but `requireAdmin` ran on `OPTIONS`, so a browser on `:5174` could not preflight PUT. Phase 12 skips auth for `OPTIONS` only; GET/PUT still require Bearer. Recorded in `server/src/routes.ts` + a test.
3. **Live Mongo still not exercised.** Admin UI was typechecked and production-built; API tests still use the in-memory store. End-to-end save against a cluster did **not** run in this chat.
4. **Admin is a second Vite app, not a window in the OS.** Mounting it in `DesktopShell` / Reader / prerender would put editing onto the visitor bundle. That was refused.
5. **Admin `vite build` writes `admin/dist/`, not visitor `dist/`.** Confirmed after a sequential visitor-then-admin build: nested prerender HTML remained under `dist/project` and `dist/read`.
6. **Homework still missing.** The CMS will store unverified links as draft and refuse `published`. It does not tick `verified` for you.

---

## 1. DECIDED — locked, do not renegotiate

### Where the admin lives
- **Process:** `npm run admin` → Vite on `127.0.0.1:5174` (`admin/vite.config.ts`).
- **Code:** `admin/` only. Visitor `src/` does not import it. Visitor `vite.config.ts` does not include it. `vercel.json` `outputDirectory` remains visitor `dist`.
- **API:** Bearer token in `sessionStorage` (not `VITE_*` — that would bake into a bundle). Default API URL `http://127.0.0.1:8787`.
- **Types / honesty:** admin imports `src/content/types.ts` and `src/content/honesty.ts` (same contract as Phase 11). That is the content layer, not the visitor UI.

### Authoring surface
Every Phase 0 entity has a form: `Project` (including `ContentBlock[]`), `Skill`, `TimelineEntry`, `NowSnapshot`, `OSVersion`, `AssetRecord`, `ExternalLink`, `PublishState`.

Enforced in the form **before** PUT, then again by the API:

| Rule | Admin behaviour |
|---|---|
| `Project.authorship` | Empty `<select>` — **no default**. Save disabled until chosen. |
| `MetricsBlock.metrics[].source` | Required field on the metrics block. Empty source is a client error. |
| Unverified `ExternalLink` | Shown as a publish blocker at the point of authoring. Draft PUT allowed. |
| `PublishState.blockers` | Editable list; live blockers from `honesty.ts` shown beside it. |
| Skill meters | Unrepresentable. No proficiency / percent / stars / ability controls. |
| Gallery → case study | Tier can be edited (the contract allows it) but the UI copy says not to promote homework-blocked gallery rows. |

### Visitor path
Still the hand-authored Vite bundle. **Zero** Fastify calls from `/`, Reader, or prerender. Nested prerender still wins. No catch-all SPA rewrite.

### Frozen (untouched on purpose)
Win95–98 chrome; tokens palette; `src/wm/core.ts` still pure. Phase 0 About / LangChain **body** modules unchanged. `publishedAssets` still `{}`. LangChain links still `verified: false` in visitor content. `kellos.md` not drafted. Deploy hook not built. OS Update / KELL.AI not built.

---

## 2. OPEN QUESTIONS — still Saathvik’s

Carry-forward from Phase 11, plus:

| # | Question | Phase 12 note |
|---|---|---|
| 1 | Confirm reconstructed §10.2 | Followed it |
| 9 | A3.8 gallery cut 8–10 | Still open; not invented |
| 11 | A1.1 URL verification | Admin can record `verified` + `verifiedAt`; did not invent either |
| 12 | A3.1–A3.6 captures + alt | Assets form exists; collection still empty until homework |
| 13 | Production host login | Still blocking the live visitor URL |
| 15 | Rotate any Mongo URI that appeared in chat | Do not paste it into git |
| 16 | Confirm LangChain `authorship` | Admin can correct ASSUMED `aiAssisted` |
| 17 | Where the editing API is hosted | Not Vercel static. Long-running host. Admin is also not that host. |
| 18 | Where the admin UI is hosted | Local `:5174` in this phase. Must not be the visitor Vercel project. |

---

## 3. ASSUMED (blueprint-dependent)

- Phase 12 = Admin CMS (**blueprint §10.2**).
- Sharing `src/content/*` types with admin is allowed because visitor entry (`src/main.tsx`) never imports `admin/`.
- In-memory API tests + admin form tests are sufficient without a cluster in this chat.

---

## 4. WHAT PHASE 13 NEEDS — how to emit (do not implement in Phase 12)

Phase 13 is **Publish-to-static**. It must **not** add Mongo or Fastify to the visitor read path.

### Call sequence (authoritative)

```text
1. GET /v1/publish-check
   Authorization: Bearer $KELLOS_ADMIN_TOKEN
   If body.ok === false → REFUSE. Do not write files. Do not deploy.
   body.failures[] is { id, kind, blockers }.

2. GET /v1/bundle
   Same auth. Returns { ok, bundle: ContentBundle }.
   Preview only until Phase 13 writes it. 409 if NowSnapshot is missing.

3. Emit
   Write the bundle JSON to the visitor content path Phase 13 chooses
   (the visitor already reads a hand-authored equivalent).
   Then the deploy hook. Rebuild the static Vite app (`npm run build`).
   Nested prerender must keep winning over SPA fallback.
```

The admin **Phase 13 preview** desk already performs steps 1–2 (GET only). It does not emit.

Also needed: this handoff; frozen visitor `dist/` layout; `KELLOS_ADMIN_ORIGIN` matching the admin origin if the API is called from a browser; seed still incomplete on purpose.

---

## 5. WHAT PHASE 13 MUST NOT TOUCH

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
- Running the editing API **or** this admin app on the Vercel static visitor project
- OS Update ceremony (Phase 14); KELL.AI (Phase 15)
- Hardcoding secrets; pushing KellOS to RolePlay-Chatbot
- Shipping `published` entities that still have blockers (the API 409s; emit must also refuse)

---

## 6. FILES PRODUCED (Phase 12)

```
admin/index.html
admin/vite.config.ts
admin/tsconfig.json
admin/src/main.tsx
admin/src/AdminApp.tsx
admin/src/Editors.tsx
admin/src/BlocksField.tsx
admin/src/LinksField.tsx
admin/src/PublishField.tsx
admin/src/PublishDesk.tsx
admin/src/api.ts
admin/src/session.ts
admin/src/forms.ts
admin/src/forms.test.ts
admin/src/ids.ts
admin/src/phase13.ts
admin/src/styles.css
admin/src/vite-env.d.ts
docs/handoffs/PHASE-12-HANDOFF.md
```

Touched: `server/src/routes.ts` (OPTIONS skip), `server/src/app.test.ts`, `src/content/visitor-path.test.ts`, `package.json`, `vitest.config.ts`, `tsconfig.node.json`, `.gitignore` (`admin/dist`), `.env.example`.

Untouched on purpose: `src/wm/core.ts` logic, Phase 0 About words, LangChain **body**, kellos.md, KELL.AI / OS Update runtimes, token palette, CONTEXT.md, `publishedAssets`, `verified: true` in visitor content, `vercel.json` rewrites.

---

## 7. VERIFICATION (evidence)

- `npx tsc -b` — exit 0
- `npx tsc -p server/tsconfig.json` — exit 0
- `npx tsc -p admin/tsconfig.json` — exit 0
- `npm test` — **59/59** passed (prior 53 + CORS OPTIONS 1 + visitor admin-isolation 1 + admin forms 4)
- `npx vite build` — exit 0; nested `dist/project`, `dist/read` present; visitor JS **does not** contain `mongodb` / `MONGODB`; shell chunks unchanged (`index-Df-e8LY-.js` ~76.7KB gzip, `DesktopShell-uNHghZRg.js` ~38.2KB gzip)
- `npm run admin:build` — exit 0; output `admin/dist/` (not visitor `dist/`)
- WM core has **no** React/DOM/GSAP/Mongo imports
- Live Mongo: **not** verified
- Live visitor URL: still not verified (Phase 10 deploy still blocked)
- Live admin against a running API: **not** verified in this chat (`MONGODB_URI` unset, so `npm run server` cannot start)

---

## 8. ONE-PARAGRAPH SUMMARY FOR THE PHASE 13 CHAT

Phase 12 added a separate Vite admin app on `127.0.0.1:5174` that PUTs whole Phase 0 documents to the Phase 11 Fastify API with a Bearer token. Authorship has no default; metrics require `source`; unverified links and `publish.blockers` are shown while authoring. The visitor site is still static Vite with zero DB on `/`, Reader, or prerender. CORS preflight was fixed so the admin origin can call the API. `GET /v1/publish-check` then `GET /v1/bundle` then emit is recorded, not built. Phase 13 is Publish-to-static — refuse when publish-check is not ok, write the bundle, then the deploy hook. Do not restyle, do not add Fastify to the visitor path, do not run this API on the Vercel static project, do not invent `verified: true`.
