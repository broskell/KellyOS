# Phase 7 Handoff — Performance, Accessibility & Hardening

**Phase:** 7 — Meet reconstructed blueprint §8 budgets. Full keyboard of shell + Tier 1. Heading order in Reader Mode and prerender. Lighthouse a11y ≥95 on Tier 1. Must not add features to hit a number.
**Completed:** 30 August 2026
**Next:** Phase 8 — Command Surfaces (Search / Ctrl+K, Terminal `open`, Settings). **Not** KELL.AI (Phase 15) or OS Update (Phase 14). **Do not start Phase 8 in the Phase 7 chat.** This file is the gate.

---

## Blueprint vs the pasted Phase 7 brief

`docs/MASTER-BLUEPRINT.md` **exists** (v1.0-reconstructed, 30 August 2026). It **wins**.

No **original** (15 August) Master Blueprint appeared in this tree. Searched; reconstruction remains the authority. If the original is recovered, it wins over this handoff and the reconstruction — flag diffs; do not silently merge. If it assigns Phase 7 to something else, this work is the wrong phase.

Pasted brief and reconstructed §10.2 agree: Phase 7 is Performance, Accessibility & Hardening.

`docs/CONTEXT.md` still says the blueprint never reached Phase 0. That file was **not** rewritten.

⚠ §8 numbers remain **RECONSTRUCTED — CONFIRM**. Implemented against them; misses below are honest.

---

## Failures and wrong assumptions (recorded as they happened)

1. **Master Blueprint is still a reconstruction.** Proceeded under reconstructed §8 / §10.2.
2. **About Reader/prerender started at h2.** Document title is “Saathvik Kellampalli”; first block was also that heading at level 2. Reader used to skip the extra h1 when texts matched, so the page had **no h1**. Static fallback emitted h1 **and** the duplicate h2. Fixed by always emitting one h1 and dropping the duplicate heading block (`blocksAfterDocumentTitle`). Words unchanged.
3. **Recycle jumped h1 → h3.** Project names were authored as heading level 3 with no h2. Levels changed to **2**. Words unchanged. Not a Phase 0 rewrite.
4. **Lazy app bodies race Playwright.** After splitting windows, the case-study chunk is not in the shell. Verification must wait for “And the part I won't dress up”, not only `[data-wm-id]`.
5. **Lighthouse CLI on Windows** can exit non-zero (`EPERM` deleting `%TEMP%\lighthouse.*`) after writing JSON. Scores are in the JSON. Do not treat the kill error as an a11y miss.
6. **Touch-target audit** fails on OS surfaces because caption buttons are frozen at 16×14 (`--kellos-ctrl-w/h`). Score still **95**. Did **not** enlarge chrome to chase 100.
7. **TTFMC < 2.5s** was measured on a **warm local** `vite preview`, not cold mid-tier mobile. Local skip → disclosure ~1.9s. That is not the blueprint’s network/device condition — do not claim the field budget is proven.
8. **`vite preview` leftover ports.** Used `KELLOS_PREVIEW=http://127.0.0.1:4178`. Directory-index for nested prerender URLs unchanged.

---

## 1. DECIDED — locked, do not renegotiate

### What Phase 7 proved
§8 budgets as measured here: initial JS under 200KB gzip; app bodies lazy from the registry; static HTML (and HTML+CSS) under 100KB; heading order on Reader/prerender; Lighthouse a11y ≥95 on measured Tier 1 URLs; drag with 3 windows still direct-to-DOM (headless ~70fps on this machine). 90-second path, honest shell, Phase 5 chords, Phase 6 motion, Phase 0 words intact.

### Bundle (this build)
| Chunk | gzip |
|---|---|
| `index-*.js` (React/router entry) | ~75.5KB |
| `DesktopShell-*.js` (shell + WM bind + GSAP) | ~37.1KB |
| **Shell + WM before apps** | **~112.6KB** (under 200KB) |
| App windows + content | separate chunks (e.g. langchain ~5.8KB gzip) |

Do not claim the Phase 6 “main ~127KB” figure. Apps are **not** smashed into the WM.

### Static fallback
Prerendered HTML still includes the SPA `<script>` (hydration/boot of the OS). **Zero JS required** for the words: no-JS Playwright still sees the disclosure, Now, Timeline, Recycle. HTML files 6–23KB; HTML+CSS ~35–52KB (under 100KB). Google Fonts are a separate third-party request, not inlined.

### Accessibility
- Focused window title is `<h1 class="os-titlebar-label">` (inherits chrome type; not a palette restyle). Inactive titles stay `<span>`.
- Reader + prerender: one document h1; `main` around the article (real landmark, not a dummy).
- Start: `aria-expanded` / `aria-haspopup="menu"`; arrow keys on the menu. Resize handles `tabIndex={-1}` (pointer still works; keyboard move is Alt+Shift+arrows).
- Boot: `aria-modal`, Skip focused on mount, overlay still opacity 1 on the first frame. Desktop is `inert` while boot is up.
- Caption 16×14 touch targets **unchanged** (design-system metrics).

### Keyboard (unchanged chords)
Alt+R · Alt+Shift+C · Alt+Shift+F · Alt+Shift+arrows · Escape closes Start. **Ctrl+K is still not handled.**

### Chrome / WM / content
Frozen recipes. Workspace `absolute inset-0` only inside the flex-1 region. Taskbar `shrink-0` at the bottom. `core.ts` still has no React, DOM, or GSAP. Drag/resize still write to the DOM. Empty-route rows stay data.

---

## 2. OPEN QUESTIONS — still Saathvik’s

| # | Question | Phase 7 note |
|---|---|---|
| 1 | **Confirm reconstructed §10.2** (phases 6–18) | Most urgent. This phase followed it. |
| 2 | Confirm §8 budgets, §5.2 names, §6.1 tiers, §7.2, ORIGIN collision | Implemented §8 as written; TTFMC not proven on mid-tier mobile |
| 3 | Cut vs expand Tier 3 (34) | Untouched |
| 4 | “Not yet for sole ownership of production systems” | Kept |
| 5 | Graduation / location | Not invented |
| 6 | RMP / PawSethu technical rounds | Gallery rows only |
| 7 | LangChain unaided explanation (A1.4) | Still publication-conditional |
| 8 | Contact closing line | Still omitted |
| 9 | Gallery cut to 8–10 | Still named rows only |
| 10 | Now monthly review | August 2026 label unchanged |

---

## 3. ASSUMED (blueprint-dependent)

- Phase 7 = §8 hardening (**blueprint §10.2**).
- Caption-button touch targets staying at 16×14 is acceptable if Lighthouse a11y stays ≥95.
- Empty-route rows stay rows until Phase 8 (Search / Terminal / Settings) and Phase 14 / 15 (OS Update / KELL.AI).
- Gallery is not a registry app (Phase 1).
- Authorship remains required on `Project`.

---

## 4. WHAT PHASE 8 NEEDS

- This handoff + frozen chrome + duration tokens + lazy `src/registry/loadWindow.tsx`.
- Phase 3 WM (`useWmStore`, `specForPath`, `open(spec)`, `nudge` / `cycleTask`).
- Phase 5 recruiter path + honest shell. `python scripts/verify_phase7.py` against `vite preview` (set `KELLOS_PREVIEW` if 4173 is taken). Lighthouse JSON may be written even when chrome-launcher prints EPERM.
- Registry **shape** and empty rows: Search, Terminal, Settings get **runtimes** in Phase 8. All three must **read the registry** — no hardcoded app lists.
- Keyboard: Ctrl+K is assigned here. Do not steal Ctrl+F4 / Alt+F4 / Alt+Arrow.

---

## 5. WHAT PHASE 8 MUST NOT TOUCH

- Phase 0 copy (no quiet edits)
- Honesty stance / disclosure placement and weight
- Skill meters of any kind
- Promoting gallery → case study
- Visual fields on content blocks
- Tokens **palette** / a new colour system / Clippy / Shut Down hiring path / a 1996→2026 second site / Three.js wallpaper
- Drafting `docs/content/case-studies/kellos.md`
- Replacing Reader Mode or deleting prerender “because the WM is the site”
- Rebuilding or replacing the WM; React/DOM/GSAP inside `src/wm/core.ts`
- Per-frame React state for drag/resize
- `position: absolute` on the **taskbar** (workspace inset-0 inside flex-1 only)
- KELL.AI (no LLM in V1) — Phase 15; OS Update ceremony — Phase 14
- Mongo, admin
- Inventing graduation date, location, metrics, or unverified URLs
- Adding apps beyond giving runtimes to the three assigned empty rows
- Adding GSAP decoration that a recruiter cannot skip
- Enlarging caption buttons or restyling tokens to game Lighthouse

---

## 6. FILES PRODUCED (Phase 7)

```
src/registry/loadWindow.tsx
src/apps/AboutWindow.tsx
src/apps/ProjectsWindow.tsx
src/apps/CaseStudyWindow.tsx
src/apps/SkillsWindow.tsx
src/apps/ResumeWindow.tsx
src/apps/ContactWindow.tsx
src/apps/RecycleWindow.tsx
src/apps/NowWindow.tsx
src/apps/TimelineWindow.tsx
src/apps/ReaderMenu.tsx
src/content/outline.ts
src/content/outline.test.ts
src/reader/FallbackDocument.tsx
scripts/verify_phase7.py
docs/handoffs/PHASE-7-HANDOFF.md
docs/handoffs/phase7-verify/*
```

Deleted: `src/apps/Windows.tsx` (split so Vite can code-split).

Touched: `windowContent.tsx`, `App.tsx`, `ReaderPage.tsx`, `StaticFallback.tsx`, `recycle.ts` (heading **levels** only), `BlockRenderer.tsx` (linkGroup title is not an `<h4>`; table `scope`), `WindowFrame.tsx`, `Taskbar.tsx`, `DesktopShell.tsx`, `DesktopIcons.tsx`, `Workspace.tsx`, `BootOverlay.tsx`, `marks.tsx`, `chrome.css` (h1 inherits titlebar type), `launchable.test.ts`.

Untouched on purpose: `src/wm/core.ts` logic, Phase 0 words, LangChain body, kellos.md, Terminal / KELL.AI / Ctrl+K runtimes, token palette.

---

## 7. VERIFICATION (evidence)

- `npx tsc -b` — exit 0
- `npm test` — **22/22** passed (`core.test.ts` 13 + `now.test.ts` 3 + `launchable.test.ts` 3 + `duration.test.ts` 2 + `outline.test.ts` 1)
- `npx vite build` — exit 0; prerendered routes still under `dist/` including `/now`, `/timeline`, `/read/about`, `/project/langchain-openrouter-provider`
- `python scripts/verify_phase7.py` — **phase7 verify ok** (`KELLOS_PREVIEW=http://127.0.0.1:4178`)
  - no-JS `/` disclosure; Now / Timeline / Recycle words unchanged
  - Skip visible at opacity 1; desktop 90s path; honest Start; menubar Projects → LangChain; Ctrl+K opens no palette; Alt+R strips the OS
  - `reduced_motion="reduce"`: Skip unmounts boot overlay within 200ms
  - short desktop + mobile 90s path (stacked Projects, not `absolute`)
  - heading order on `/read/*` and OS home
  - drag ~70fps with 3 windows (headless rAF; still DOM rects)
- Lighthouse accessibility (JSON in `docs/handoffs/phase7-verify/`):

| Surface | Score |
|---|---|
| `/` (OS home) | **100** |
| `/read/about` | **100** |
| `/read/project/langchain-openrouter-provider` | **100** |
| `/projects` | **95** (touch targets) |
| `/skills` | **95** (touch targets) |
| `/resume` | **95** (touch targets) |
| `/contact` | **95** (touch targets) |
| `/project/langchain-openrouter-provider` | **95** (touch targets) |

WM core has **no** React/DOM/GSAP imports (duration unit test still reads the file).

---

## 8. ONE-PARAGRAPH SUMMARY FOR THE PHASE 8 CHAT

Phase 7 hardened the shipped OS against reconstructed §8: app windows lazy-load from the registry, the shell+WM gzip is ~113KB, Reader/prerender heading order starts at h1 without skips, and Lighthouse a11y is ≥95 on Tier 1 (OS chrome caption size keeps some surfaces at 95). The Phase 3 core is still pure; drag still writes to the DOM; Phase 5 recruiter path and Phase 6 skippable GSAP remain. Ctrl+K, Terminal, and Settings are still empty registry rows. Phase 8 gives those three runtimes from the registry — not KELL.AI, not OS Update, not a restyle.
