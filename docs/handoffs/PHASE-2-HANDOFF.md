# Phase 2 Handoff — OS shell without the window manager

**Phase:** 2 — Routes, static fallback, App Registry **shape**, presentational chrome
**Completed:** 30 August 2026
**Next:** Phase 3 — **window manager only** (headless core + bind). Not the rest of the OS.
**Do not start Phase 3 in the Phase 2 chat.** This file is the gate.

---

## Failures and wrong assumptions (recorded as they happened)

1. **Master Blueprint still missing.** Searched again: no blueprint file. Proceeded under **ASSUMED**. If it arrives, it **wins** — diff against this handoff, `docs/content-model.md`, `docs/app-inventory.md`, and `src/registry/manifest.ts`. Do not silently merge.
2. **`Omit<ContentBlock, …>` collapsed the discriminated union** to shared keys only, so `makeBlocks` rejected real variants. Fixed by constructing blocks then stamping `order` / `introducedIn`.
3. **Vite preview SPA fallback ate nested prerender URLs** without a trailing slash (`/project/…` served `/` instead of `dist/project/…/index.html`). Directory-index middleware now rewrites extensionless paths to `…/` so the prerendered file is found. **Static hosts must do the same** (or equivalent). Recorded so Phase 3 does not “fix” this by inventing a second site.
4. **Playwright no-JS assertion used a string split across `<code>`** on the first pass; the real bug was (3). After the rewrite, `ChatOpenRouter` is in the HTML.
5. **Hard constraint rows share the key “Hard constraint”.** React keys must not use `row.key` alone — `BlockRenderer` now keys by index. Do not “fix” the copy by renaming Phase 0 table labels.

---

## 1. DECIDED — locked, do not renegotiate

### What Phase 2 proved
A recruiter can land on a URL and get OS chrome around the document. Reader Mode and the build-time static fallback are first-class: no-JS and crawlers get the **same words** (Reader-styled HTML in `#root`, then JS replaces with the shell).

### Routes (Tier 1 + Recycle as registry consumer)
| Path | Surface |
|---|---|
| `/` and `/about` | About Me already open |
| `/projects` | Featured case study + “Also shipped” gallery view |
| `/project/langchain-openrouter-provider` | Case study **with OS around it** |
| `/skills` | Evidence group boxes; Tier 3 behind `<details>` |
| `/resume` | On-page structure; PDF withheld |
| `/contact` | Channels from Phase 0 |
| `/recycle` | Recycle Bin copy (not a new product) |
| `/read/:app` | Reader Mode |
| `/read/project/:slug` | Reader Mode for the case study |

`/` shows skippable boot (Skip on the first frame). Deep links **do not** boot. First-run “Getting around” is **desktop only**, to the **right**, never covering the disclosure; omitted below 48rem.

### App Registry
`src/registry/manifest.ts` is the single list. Surfaces: `desktopIcon`, `startMenu`, `search`, `terminalOpen`, `mobileGrid`, `staticFallback`, `osUpdate`. **Shape only** — Ctrl+K, Terminal `open`, and KELL.AI have rows and no runtime.

Gallery is **not** a registry app (Phase 1). Reader Mode is **Tier 1** (Phase 1 override of `app-inventory.md` placement).

### Content
Phase 0 copy via typed blocks / skill rows. LangChain **public** body only — INTERNAL “Before this publishes” is not rendered. Fabricated issue-body use case is not repeated. Graduation date and location are **not invented**. Résumé PDF is withheld. Contact closing line omitted (`⚠ VERIFY` — keep only if true).

Links on the case study remain `verified: false` (Phase 0 debt). They render for the recruiter; **publish must still refuse** unverified links when that pipeline exists.

### Shell
Phase 1 recipes reused (`.os-raised` / `.os-sunken` / `.os-window` / `.os-titlebar`). Playground nav **does not ship**. Caption buttons remain inert. Taskbar is `shrink-0` at the **bottom**; desktop is column + `flex-1` workspace.

### SEO minimum
`kellosPrerender` writes `dist/**/index.html` with Reader Mode markup inside `#root`. `npm run build` is the proof. `kellosDirectoryIndex` is for `vite preview` only.

---

## 2. OPEN QUESTIONS — still Saathvik’s

| # | Question | Phase 2 note |
|---|---|---|
| 1 | Master Blueprint | Still blocking reconciliation of content-model + app-inventory + registry surface names |
| 2 | Cut vs expand Tier 3 (34) | Still **full list behind expand** |
| 3 | “Not yet for sole ownership of production systems” | **Kept** as a limitation callout on About |
| 4 | Graduation / location | Header reserved; not invented |
| 5 | RMP / PawSethu technical rounds | Gallery rows only |
| 6 | LangChain unaided explanation (A1.4) | Still publication-conditional |
| 7 | Contact closing line | Omitted until verified true |
| 8 | Gallery cut to 8–10 | Only named entries: Roast My Project, PawSethu, Ducati |

---

## 3. ASSUMED (blueprint-dependent)

- Registry `id` / `surfaces` keys and which Tier 2/3 apps get empty `route: ""`
- `OSVersion.features` flag names still not invented
- Recycle Bin as a desktop icon + `/recycle` (inventory already listed it; not a Phase 2 product)
- Search / Terminal / KELL.AI / Settings / OS Update exist as **data rows** only
- Authorship remains required on `Project` (not optional)

---

## 4. WHAT PHASE 3 NEEDS

- Frozen chrome: `docs/design-system.md`, `src/styles/tokens.css`, `chrome.css`, `blocks.css`
- This handoff + Phase 1 handoff (taskbar packing bug: do not `position: absolute` everything)
- Z-index token names already in `:root` (`--kellos-z-window-base`, start, taskbar, boot, skip)
- Routes and registry already feed “which app is open.” Phase 3 **replaces presentational one-window** with a headless WM + Zustand bind. Drag/resize write to the DOM, never per-frame React state (locked architecture).
- Boot, Reader Mode, static fallback, and URLs must keep working. Recruiter-wins: a deep link still opens the document with OS around it — WM must not require learning the desktop first.

**Phase 3 is the window manager only.** Not Terminal, not KELL.AI, not Mongo, not full apps as products, not GSAP showpieces, not restyling.

---

## 5. WHAT PHASE 3 MUST NOT TOUCH

- Phase 0 copy (no quiet edits)
- Honesty stance / disclosure placement and weight
- Skill meters of any kind
- Promoting gallery → case study
- Visual fields on content blocks
- Tokens / a new palette / Clippy / Shut Down hiring path / a 1996→2026 second site / Three.js wallpaper
- Drafting `docs/content/case-studies/kellos.md`
- Terminal, KELL.AI, Mongo, V2 backend, Ctrl+K runtime (unless the blueprint later assigns them — they are **not** Phase 3)
- Replacing Reader Mode or deleting prerender “because the WM is the site”

---

## 6. FILES PRODUCED (Phase 2)

```
src/registry/types.ts
src/registry/manifest.ts
src/content/about.ts, skills.ts, resume.ts, contact.ts, recycle.ts
src/content/projects.ts, langchain.ts, documents.ts, makeBlocks.ts
src/apps/Windows.tsx
src/shell/DesktopShell.tsx, Taskbar.tsx, DesktopIcons.tsx, BootOverlay.tsx, useCompact.ts
src/reader/ReaderPage.tsx
src/prerender/pages.ts, StaticFallback.tsx, render.ts
src/App.tsx                          ← real routes; playground nav gone
vite.prerender.ts
scripts/verify_phase2.py
docs/handoffs/PHASE-2-HANDOFF.md
```

Phase 1 playground surfaces remain on disk unused by the shipping `App`. Do not restyle them; Phase 3 may delete the playground later.

---

## 7. VERIFICATION (evidence)

- `npx tsc -b` — exit 0
- `npx vite build` — exit 0; prerendered HTML under `dist/` including `/read/about` and `/project/langchain-openrouter-provider`
- `python scripts/verify_phase2.py` against `vite preview` — **phase2 verify ok**
  - no-JS `/` contains “I develop AI-assisted”
  - desktop: Skip → About Me, tip to the right, taskbar `y > 500`
  - mobile 390×844: no “Getting around”, taskbar at bottom
  - `/read/about` has no `.os-taskbar`
  - `/project/langchain-openrouter-provider` keeps OS chrome and the disclosure in “My role”

Screenshots: `docs/handoffs/phase2-verify/*.png`

**Not done:** OG 1200×630 raster of the boot mark on teal dither (design system said Phase 2 *may* rasterize). Not required to prove routes + fallback.

---

## 8. ONE-PARAGRAPH SUMMARY FOR THE PHASE 3 CHAT

Phase 2 wired KELL.OS as a Vite SPA with real URLs, a data-only App Registry, Reader Mode at `/read/…`, and build-time prerender so a crawler and a no-JS recruiter get the words. About Me is already open on `/`; boot is skippable; the first-run tip is desktop-only and does not cover the AI-assistance disclosure. The shell is still **presentational** — one window for the current route, caption buttons inert, no drag, no z-stack runtime. Phase 1 chrome is frozen. Phase 3 builds **only** the headless window manager (and its React/Zustand bind) against this handoff. It must not restyle the system, rewrite Phase 0 copy, or expand into Terminal / KELL.AI / apps as products.
