# Phase 9 Handoff — Content Completion & Gallery

**Phase:** 9 — Gallery cut 8–10 with **real** screenshots; asset pipeline; `ExternalLink.verified` gates publication. **Gated on Saathvik’s homework.** **Not** V1 launch (Phase 10). **Not** KELL.AI (Phase 15). **Not** OS Update (Phase 14).
**Completed:** 30 August 2026
**Next:** Phase 10 — V1.0 ORIGIN launch (deploy, metadata, OG, rollback). **Do not start Phase 10 in the Phase 9 chat.** Homework for a *complete* gallery is still missing; Phase 10 must not invent it.

---

## Blueprint vs the pasted Phase 9 brief

`docs/MASTER-BLUEPRINT.md` **exists** (v1.0-reconstructed, 30 August 2026). It **wins**.

No **original** (15 August) Master Blueprint appeared in this tree. Searched; reconstruction remains the authority. If the original is recovered, it wins over this handoff and the reconstruction — flag diffs; do not silently merge. If it assigns Phase 9 to something else, this work is the wrong phase.

Pasted brief and reconstructed §10.2 agree: Phase 9 is Content Completion & Gallery.

`docs/CONTEXT.md` still says the blueprint never reached Phase 0. That file was **not** rewritten.

---

## Homework search (gate) — recorded as found

Searched on arrival for: an 8–10 cut list, a date-checked URL table, real product screenshots with `AssetRef.alt`.

| Item | Status in this tree |
|---|---|
| A3.8 gallery cut (8–10) | 🔴 **Missing.** `docs/asset-inventory.md` still 🔴. No cut list / markdown table. |
| A1.1 URL sweep (live Y/N + date checked) | 🔴 **Missing.** Zero `verified: true` + `verifiedAt` on project `ExternalLink`s. |
| A3.1–A3.6 / A3.5 screenshots | 🔴 **Missing.** No product images under `public/` or `src/`. `publishedAssets` is `{}`. Phase 6–8 verify PNGs are OS screenshots, not gallery captures. |
| Capture-time `AssetRef.alt` | 🔴 **Missing** — nothing was captured. |

**Did not:** invent a cut, photograph projects that will not ship, mark `verified: true`, fill layouts with lorem or AI “product shots,” or pretend the gallery is complete.

**Did ship:** named rows already in `galleryRows` (RMP, PawSethu, Ducati — still gallery, not case studies); empty-asset well machinery; unverified outbound `ExternalLink`s withheld on visitor / Reader / prerender.

---

## Failures and wrong assumptions (recorded as they happened)

1. **Master Blueprint is still a reconstruction.** Proceeded under reconstructed §10.2.
2. **Homework gate tripped.** Phase 9 cannot complete the product-facing gallery. Machinery + honest empty state only.
3. **Playwright first pass** asserted `[data-os-gallery]` immediately after `[data-wm-id="app:projects"]`. Lazy `ProjectsWindow` was still “Opening…”. Wait for the gallery node (same class of gotcha as waiting for case-study body copy).
4. **Skills evidence had a markdown href** to the unverified PR. Removed the URL; kept “Merged PR #39301 in `langchain-ai/langchain`”. Not a Phase 0 About rewrite.
5. **Contact / Résumé still use inline markdown profile URLs** (GitHub, LinkedIn, X). Those are not A1.1 *project* live URLs and were not gated as `ExternalLink`. Residual risk for Phase 10 if those profiles are also unverified.
6. **No interactive browser MCP in this session.** Desktop + mobile verified with Playwright (`scripts/verify_phase9.py`) and screenshots under `docs/handoffs/phase9-verify/`. Could not click through a live headed browser.
7. **`vite preview` leftover ports.** Used `KELLOS_PREVIEW=http://127.0.0.1:4181`. Directory-index for nested prerender URLs unchanged.

---

## 1. DECIDED — locked, do not renegotiate

### What Phase 9 shipped
- **Asset pipeline:** `src/content/assets.ts` is the hand-authored V1 `ContentBundle.assets` map. Files go in `public/content-assets/`; content holds `AssetRef.id` + alt. Visitor path is a static lookup — no CMS, no runtime fetch. Missing id → empty well (`Image not captured yet` + required alt).
- **`ExternalLink.verified`:** `publishedExternalLinks` requires `verified === true` **and** `verifiedAt`. Visitor `BlockRenderer` (OS, Reader, prerender) withholds the rest. Playground surfaces keep `gateExternalLinks={false}` (design-system: playground may render unverified).
- **Gallery** remains a **view inside Projects** (`[data-os-gallery]`), **not** a registry app. Optional `screenshot` / `live` on `GalleryRow` for when homework lands. Rows have neither today.
- **LangChain linkGroup** still `verified: false`. Recruiter sees the withheld copy, not the GitHub hrefs.

### Frozen (untouched on purpose)
Win95–98 chrome; taskbar `shrink-0` at the bottom; workspace `absolute inset-0` only inside flex-1. Phase 3 WM core still pure. Phase 5–8 keyboard. Phase 6 GSAP in `src/motion/play.ts`. Lazy `loadWindow`. Command surfaces. Honest Start (no Terminal / Settings / KELL.AI / Search / OS Update). RMP / PawSethu stay gallery. Phase 0 About words unchanged. `kellos.md` not drafted.

### Bundle (this build)
| Chunk | gzip |
|---|---|
| `index-*.js` | ~75.5KB |
| `DesktopShell-*.js` | ~38.2KB |
| **Shell + WM before apps** | **~113.7KB** (under 200KB) |
| `ProjectsWindow-*.js` | ~0.95KB gzip |
| `BlockRenderer-*.js` | ~1.89KB gzip |

---

## 2. OPEN QUESTIONS — still Saathvik’s

| # | Question | Phase 9 note |
|---|---|---|
| 1 | **Confirm reconstructed §10.2** (phases 6–18) | Followed it |
| 2 | Confirm §8 budgets, §5.2 names, §6.1 tiers, §7.2, ORIGIN collision | Untouched |
| 3 | Cut vs expand Tier 3 (34) | Untouched |
| 4 | “Not yet for sole ownership of production systems” | Kept |
| 5 | Graduation / location | Not invented |
| 6 | RMP / PawSethu technical rounds | Gallery rows only |
| 7 | LangChain unaided explanation (A1.4) | Still publication-conditional |
| 8 | Contact closing line | Still omitted |
| 9 | **A3.8 gallery cut to 8–10** | Still open. Three named rows are **not** the cut |
| 10 | Now monthly review | August 2026 label unchanged |
| 11 | **A1.1 URL verification** | Still open. Do not mark `verified: true` without a dated sweep |
| 12 | A3.1–A3.6 captures + alt | Still open |

---

## 3. ASSUMED (blueprint-dependent)

- Phase 9 = Content Completion & Gallery (**blueprint §10.2**).
- Shipping the **pipeline and gate** without fake screenshots matches “must not invent assets.”
- Withholding unverified `ExternalLink`s on the visitor path is V1 “do not publish,” not waiting for Phase 13.
- Gallery as a view inside Projects (Phase 1 / inventory ASSUMED, confirmed by later phases).

---

## 4. WHAT PHASE 10 NEEDS

- This handoff + frozen chrome + duration tokens + lazy `src/registry/loadWindow.tsx`.
- Phase 3 WM (`useWmStore`, `specForPath`, `open(spec)`, `nudge` / `cycleTask`).
- Phase 5–9 recruiter path + honest shell + Ctrl+K / Terminal / Settings + link/asset gates.
- `python scripts/verify_phase9.py` against `vite preview` (set `KELLOS_PREVIEW` if 4173 is taken).
- **Still Saathvik:** A3.8 cut, A1.1 dated URL table, real screenshots with alt. Without those, V1 launch must keep the honest empty gallery and withheld links — **not** fill OG/marketing with fake shots.
- Deploy, metadata, OG, rollback plan — **Phase 10’s job**, not this chat.

---

## 5. WHAT PHASE 10 MUST NOT TOUCH

- Phase 0 copy (no quiet edits)
- Honesty stance / disclosure placement and weight
- Skill meters of any kind
- Promoting gallery → case study
- Visual fields on content blocks
- Tokens **palette** / a new colour system / Clippy / Shut Down hiring path / a 1996→2026 second site / Three.js wallpaper
- Drafting `docs/content/case-studies/kellos.md`
- Replacing Reader Mode or deleting prerender
- Rebuilding or replacing the WM; React/DOM/GSAP inside `src/wm/core.ts`
- Per-frame React state for drag/resize
- `position: absolute` on the **taskbar** (workspace inset-0 inside flex-1 only)
- KELL.AI (no LLM in V1) — Phase 15; OS Update ceremony — Phase 14
- Mongo, admin
- Inventing graduation date, location, metrics, screenshots, a gallery cut, or `verified: true` without a dated sweep
- Hardcoding Start/Search/Terminal app lists that drift from the registry
- Adding GSAP decoration that a recruiter cannot skip
- Enlarging caption buttons or restyling tokens to game Lighthouse
- Scope additions beyond ORIGIN launch

---

## 6. FILES PRODUCED (Phase 9)

```
src/content/assets.ts
src/content/assets.test.ts
src/content/publish.ts
src/content/publish.test.ts
src/content/projects.test.ts
public/content-assets/README.md
scripts/verify_phase9.py
docs/handoffs/PHASE-9-HANDOFF.md
docs/handoffs/phase9-verify/*
```

Touched: `types.ts` (`verifiedAt`, AssetRef width/height), `BlockRenderer.tsx` (resolve + gate), `projects.ts` (optional screenshot/live; comment that the cut is open), `ProjectsWindow.tsx` (`data-os-gallery`), `documents.ts` (honest gallery aside), `skills.ts` (PR href removed), `blocks.css` (image size classes), playground `gateExternalLinks={false}`.

Untouched on purpose: `src/wm/core.ts` logic, Phase 0 About words, LangChain **body**, kellos.md, KELL.AI / OS Update runtimes, token palette, CONTEXT.md.

---

## 7. VERIFICATION (evidence)

- `npx tsc -b` — exit 0
- `npm test` — **33/33** passed (prior 27 + `assets.test.ts` 2 + `publish.test.ts` 3 + `projects.test.ts` 1)
- `npx vite build` — exit 0; prerendered routes still under `dist/` including `/now`, `/timeline`, `/read/about`, `/project/langchain-openrouter-provider`. Prerendered case study contains withheld-links copy and **does not** contain `github.com/langchain-ai/langchain/pull/39301`.
- `python scripts/verify_phase9.py` — **phase9 verify ok** (`KELLOS_PREVIEW=http://127.0.0.1:4181`)
  - no-JS `/` disclosure; Now / Timeline words unchanged; no-JS case study withholds unverified URLs
  - Skip visible at opacity 1; honest Start
  - 90s path (Projects inside About → LangChain body “And the part I won't dress up”)
  - `[data-os-gallery]`: RMP + PawSethu as named rows, not case studies; no LangChain hrefs on those rows
  - Alt+R: “Back to desktop”, `footer.os-taskbar` detached; Reader also withholds the PR href
  - mobile: stacked Projects (`position` not `absolute`); gallery view present

WM core has **no** React/DOM/GSAP imports.

---

## 8. ONE-PARAGRAPH SUMMARY FOR THE PHASE 10 CHAT

Phase 9 built the static asset map and enforced `ExternalLink.verified` on the visitor path. Saathvik’s homework (gallery cut 8–10, dated URL sweep, real screenshots with alt) was **not** in the tree, so the gallery is still three named rows inside Projects, not a completed 8–10 set, and LangChain outbound links do not ship. Do not invent assets or mark links verified. Phase 10 is V1.0 ORIGIN launch (deploy, metadata, OG, rollback) — not a restyle, not KELL.AI, not OS Update, not Mongo.
