# Phase 10 Handoff — V1.0 "ORIGIN" LAUNCH

**Phase:** 10 — Deploy, metadata, OG images, final verification pass, rollback plan. **Not** gallery completion (Phase 9 homework still missing). **Not** KELL.AI (Phase 15). **Not** OS Update (Phase 14). **Not** Fastify / Mongo / admin (Phase 11+).
**Completed:** 30 August 2026
**Next:** Phase 11 — Fastify + MongoDB on the **unchanged** Phase 0 content contract. **Do not start Phase 11 in the Phase 10 chat.** Production deploy is **blocked on Saathvik’s host login**; Phase 11 may proceed only after a live URL exists **or** after this handoff is accepted as the launch record.

---

## Blueprint vs the pasted Phase 10 brief

`docs/MASTER-BLUEPRINT.md` **exists** (v1.0-reconstructed, 30 August 2026). It **wins**.

No **original** (15 August) Master Blueprint appeared. Searched; reconstruction remains the authority. If the original is recovered, it wins over this handoff and the reconstruction — flag diffs; do not silently merge. If it assigns Phase 10 to something else, this work is the wrong phase.

Pasted brief and reconstructed §10.2 agree: Phase 10 is **V1.0 "ORIGIN" LAUNCH**.

`docs/CONTEXT.md` still says the blueprint never reached Phase 0. That file was **not** rewritten.

---

## Homework search (still the Phase 9 gate)

| Item | Status in this tree |
|---|---|
| A3.8 gallery cut (8–10) | 🔴 **Missing.** Three named rows are not the cut. |
| A1.1 URL sweep | 🔴 **Missing.** LangChain `ExternalLink`s stay `verified: false` and **do not ship**. |
| A3.1–A3.6 screenshots + alt | 🔴 **Missing.** `publishedAssets` is `{}`. |

**Did not:** invent a cut, mark `verified: true`, generate OG/marketing shots of uncaptured projects, or pretend the gallery is complete.

**OG image shipped:** honest **KELL.OS 1.0** wordmark on Win95 chrome (`public/og.png`, source `public/og.svg`). Title bar: **KELL.OS 1.0** + subtitle **ORIGIN era**. Not a product screenshot.

---

## Failures and wrong assumptions (recorded as they happened)

1. **Master Blueprint is still a reconstruction.** Proceeded under reconstructed §10.2.
2. **Production deploy blocked.** Chosen host is **Vercel** (static, no backend). This machine had **no Vercel / Cloudflare / Netlify credentials**. `npx vercel whoami` → logged out. `vercel deploy --temporary` opened a device-login wait (killed). Claimable deploy endpoint now returns CLI-only instructions. Wrangler required `CLOUDFLARE_API_TOKEN`. Netlify zip API → 401. `gh` is not installed. **No live URL exists.** Preview verification passed; live verification did not run.
3. **Git remote is the wrong artefact.** `git remote` from the parent MyExclusive tree is `https://github.com/broskell/RolePlay-Chatbot.git`. KellOS is an untracked folder in that tree. **Do not push KellOS into RolePlay-Chatbot.** Launch needs its own Vercel project (or a dedicated git remote), linked from the `KellOS/` directory.
4. **Canonical / OG URLs currently name `https://kellos.vercel.app`**, which is the intended project hostname, **not a proven live site**. After a real deploy, set `KELLOS_SITE_URL` / `VITE_SITE_URL` to the assigned URL and rebuild so crawlers do not hit a 404 origin.
5. **No interactive browser MCP.** Desktop + mobile verified with Playwright (`scripts/verify_phase10.py`) against `vite preview` (`http://127.0.0.1:4182`). Screenshots under `docs/handoffs/phase10-verify/`.
6. **Homework still missing.** Launch is honest empty gallery + withheld unverified links, as Phase 9 required.

---

## 1. DECIDED — locked, do not renegotiate

### Host
**Vercel static.** Zero backend on the visitor path. Nested prerender (`/project/...`, `/read/...`) is real `index.html` on disk. SPA fallback is **only** `/terminal` and `/settings` (`vercel.json` rewrites + `public/_redirects`). Do **not** add a catch-all `/* → /index.html` — that is the Phase 2 failure that ate nested URLs.

### Metadata
Per-route title, description, canonical, OG/Twitter in `src/seo/site.ts`, injected at prerender (`src/seo/headTags.ts`) and kept in sync in the SPA (`DocumentHead`). `sitemap.xml` + `robots.txt` written at build.

### ORIGIN collision (chrome + metadata)
- Product identity: **KELL.OS 1.0**
- Optional subtitle: **ORIGIN era**
- Home title: `KELL.OS 1.0 — Saathvik Kellampalli`
- `og:site_name`: `KELL.OS 1.0`
- Never a naked `ORIGIN` as the OS title next to a version
- Did **not** rename the version narrative. About status **KELL.OS 3.0 · new visitors boot latest** is the locked era rule, not a launch title.

### Favicon / boot / OG
Phase 1 wordmark and `public/favicon.svg` / `public/boot-mark.svg` unchanged. OG is that chrome + wordmark, rasterized `1200×630`.

### Frozen (untouched on purpose)
Win95–98 chrome; taskbar `shrink-0` at the bottom; workspace `absolute inset-0` only inside flex-1. Phase 3 WM core still pure. Phase 5–9 keyboard. Phase 6 GSAP in `src/motion/play.ts`. Lazy `loadWindow`. Command surfaces. Honest Start (no Terminal / Settings / KELL.AI / Search / OS Update). RMP / PawSethu stay gallery. Phase 0 About words unchanged. `kellos.md` not drafted. No Mongo, no admin, no Fastify.

### Bundle (this build)
| Chunk | gzip |
|---|---|
| `index-*.js` | ~76.7KB |
| `DesktopShell-*.js` | ~38.2KB |
| **Shell + WM before apps** | **~114.9KB** (under 200KB) |

---

## 2. OPEN QUESTIONS — still Saathvik’s

| # | Question | Phase 10 note |
|---|---|---|
| 1 | **Confirm reconstructed §10.2** (phases 6–18) | Followed it |
| 2 | Confirm §8 budgets, §5.2 names, §6.1 tiers, §7.2, ORIGIN collision | Metadata follows Phase 1 collision rule; §9 checkbox still open for Saathvik |
| 3–8 | Tier 3 cut, production-ownership line, graduation/location, RMP/PawSethu rounds, A1.4, contact closing | Untouched; not invented |
| 9 | **A3.8 gallery cut to 8–10** | Still open |
| 10 | Now monthly review | August 2026 label unchanged |
| 11 | **A1.1 URL verification** | Still open |
| 12 | A3.1–A3.6 captures + alt | Still open |
| 13 | **Production host login + custom domain** | **Blocking the live URL.** Vercel project name `kellos` may already be taken; use the URL Vercel assigns, then rebuild metadata |
| 14 | Contact / Résumé inline profile URLs | Still not `ExternalLink`-gated (Phase 9 residual) |

---

## 3. ASSUMED (blueprint-dependent)

- Phase 10 = V1.0 ORIGIN launch (**blueprint §10.2**).
- Shipping with honest empty gallery matches “must not invent assets.”
- Vercel filesystem-before-rewrites is equivalent to `vite preview` directory-index for nested prerender.
- Canonical origin `https://kellos.vercel.app` until the assigned URL is known.

---

## 4. WHAT PHASE 11 NEEDS

- This handoff + frozen chrome + duration tokens + lazy `src/registry/loadWindow.tsx`.
- Phase 3 WM (`useWmStore`, `specForPath`, `open(spec)`, `nudge` / `cycleTask`).
- Phase 5–10 recruiter path + honest shell + Ctrl+K / Terminal / Settings + link/asset gates + launch metadata.
- `python scripts/verify_phase10.py` against `vite preview` (`KELLOS_PREVIEW` if 4173 is taken). After a live URL: `KELLOS_LIVE=https://…`.
- **Unchanged Phase 0 content contract** (`docs/content-model.md`, `src/content/types.ts`). Visitor read path stays static.
- **A live deploy, or an explicit accept of this blocked-launch record**, before treating ORIGIN as launched.

### How to finish the deploy (Saathvik, from `KellOS/`)

```text
npx vercel login
npx vercel --yes --prod
```

Then set `KELLOS_SITE_URL` and `VITE_SITE_URL` to the printed origin, rebuild, redeploy. Do **not** import this folder as RolePlay-Chatbot.

Copy `.env.example` → `.env.production` with the real origin. Do not commit secrets.

---

## 5. WHAT PHASE 11 MUST NOT TOUCH

- Phase 0 copy (no quiet edits)
- Honesty stance / disclosure placement and weight
- Skill meters of any kind
- Promoting gallery → case study
- Visual fields on content blocks
- Tokens **palette** / a new colour system / Clippy / Shut Down hiring path
- Drafting `docs/content/case-studies/kellos.md` (Phase 18)
- Replacing Reader Mode or deleting prerender
- Rebuilding or replacing the WM; React/DOM/GSAP inside `src/wm/core.ts`
- Per-frame React state for drag/resize
- `position: absolute` on the **taskbar**
- KELL.AI (Phase 15); OS Update ceremony (Phase 14)
- Adding DB calls to the **visitor read path**
- Inventing graduation date, location, metrics, screenshots, a gallery cut, or `verified: true` without a dated sweep
- Hardcoding Start/Search/Terminal app lists that drift from the registry
- Catch-all SPA fallback that eats `/project/...` and `/read/...`
- Hot-patching files on the host instead of rebuilding

---

## 6. ROLLBACK PLAN

**Previous production artefact:** none. There is no prior live KELL.OS URL to roll back to.

**If a Vercel production deploy exists later:**

1. Vercel dashboard → Deployments → previous **Ready** production → Promote / Instant Rollback. Or `npx vercel rollback`.
2. Do **not** hot-patch HTML/JS on the host. Rebuild from this tree (`npm run build`) and redeploy.
3. Do **not** “fix” nested 404s by adding `/* → /index.html`. That returns the About fallback instead of the case study/Reader documents.
4. Metadata origin is a build-time stamp. Rolling back the build rolls back canonicals and OG URLs with it.

**Local artefact to keep:** `dist/` from this phase (prerendered nested HTML + `og.png` + `sitemap.xml`). Preview: `npx vite preview` (directory-index plugin still required for extensionless nested URLs).

---

## 7. FILES PRODUCED (Phase 10)

```
src/seo/site.ts
src/seo/site.test.ts
src/seo/headTags.ts
src/seo/headTags.test.ts
src/seo/DocumentHead.tsx
public/og.svg
public/og.png
public/_redirects
vercel.json
.env.example
scripts/render_og.py
scripts/verify_phase10.py
docs/handoffs/PHASE-10-HANDOFF.md
docs/handoffs/phase10-verify/*
```

Touched: `src/prerender/pages.ts`, `src/prerender/render.ts`, `vite.prerender.ts` (inject head + sitemap), `src/App.tsx` (`DocumentHead`), `index.html`, `package.json` version `1.0.0`, `.gitignore` (`.vercel`, `.env`).

Untouched on purpose: `src/wm/core.ts` logic, Phase 0 About words, LangChain **body**, kellos.md, KELL.AI / OS Update runtimes, token palette, CONTEXT.md, `publishedAssets`, `verified: true`.

---

## 8. VERIFICATION (evidence)

- `npx tsc -b` — exit 0
- `npm test` — **38/38** passed (prior 33 + launch metadata tests)
- `npx vite build` — exit 0; prerendered `/` title **KELL.OS 1.0 — Saathvik Kellampalli**; `/project/langchain-openrouter-provider` has canonical + OG + case-study body; `dist/sitemap.xml` written; `dist/og.png` present
- `python scripts/verify_phase10.py` — **phase10 verify ok (preview only)** (`KELLOS_PREVIEW=http://127.0.0.1:4182`)
  - no-JS `/` disclosure + canonical/OG; Now / Timeline words unchanged
  - nested no-JS case study withholds unverified URLs
  - Skip visible at opacity 1; honest Start
  - 90s path (Projects inside About → gallery → LangChain body)
  - Alt+R: “Back to desktop”, `footer.os-taskbar` detached
  - mobile: stacked Projects (`position` not `absolute`); gallery present
- **Live URL:** not verified — deploy blocked (failure #2)

WM core has **no** React/DOM/GSAP imports.

---

## 9. ONE-PARAGRAPH SUMMARY FOR THE PHASE 11 CHAT

Phase 10 added per-route metadata, canonicals, an honest KELL.OS 1.0 wordmark OG card, Vercel/static-host config that does not rewrite nested prerender URLs, a rollback plan, and a final preview verification pass. Saathvik’s gallery/URL homework is still missing; unverified links still do not ship. **Production deploy did not happen** — no host credentials on this machine, and the parent git remote is RolePlay-Chatbot, not KellOS. Phase 11 is Fastify + MongoDB on the unchanged Phase 0 content contract, with **zero DB calls on the visitor read path**. Do not restyle, do not build KELL.AI or OS Update, do not invent assets or `verified: true`.
