# Phase 3 Handoff — Headless window manager

**Phase:** 3 — Headless WM core + Zustand bind + DOM drag/resize
**Completed:** 30 August 2026
**Next:** Phase 4 — **not** the WM. Use this manager. Do not start Phase 4 in the Phase 3 chat.
**Do not start Phase 4 in the Phase 3 chat.** This file is the gate.

---

## Failures and wrong assumptions (recorded as they happened)

1. **Master Blueprint still missing.** Searched the KellOS tree: no blueprint file. Proceeded under **ASSUMED**. If it arrives, it **wins** — diff against this handoff, Phase 2 registry, and `src/wm/`. Do not silently merge.
2. **Workspace measured 0×0 on desktop.** The flex-1 parent of the workspace is `position: relative`, not a flex container, so `flex-1` on the workspace did nothing. Windows never opened; Playwright timed out waiting for the disclosure. Fixed by filling **only the flex-1 region** with `absolute inset-0` — not the whole OS, so the taskbar stays `shrink-0` at the bottom (Phase 1 packing bug).
3. **`vite preview` port 4173 was already bound** (leftover). Verification used `KELLOS_PREVIEW=http://127.0.0.1:4174`. Directory-index for nested prerender URLs is unchanged (Phase 2 failure #3). Do not invent a second site to “fix” hosts.
4. **First Playwright pass used the hung 4173 server** and never saw “I develop AI-assisted” after Skip. Not a content bug — stale preview + empty workspace. Re-ran against the Phase 3 build after (2).
5. **On 1280×800 the tip can kiss About’s frame by a few pixels.** Placement reserves 320px + gap for the tip and puts it to the right of About. Disclosure stays in About’s paper well; do not restyle to “solve” this with a new layout language.
6. **Zustand was not in the Phase 2 lockfile.** Added as the bind only. Core still has no React/DOM/GSAP. Vitest added for the pure core (11 tests).

---

## 1. DECIDED — locked, do not renegotiate

### What Phase 3 proved
Windows are a **headless** stack: open / close / minimize / maximize / focus / z-order / clamp / drag / resize. React commits discrete WM state. Pointer gestures write `left/top/width/height` on the element. Caption buttons are real WM actions, not a Shut Down hiring path.

### Core vs bind
| Layer | Where | Forbidden |
|---|---|---|
| Core | `src/wm/core.ts` | React, DOM, GSAP, CSS imports |
| Bind | `src/wm/store.ts` (Zustand), `interact.ts`, `ManagedWindow.tsx` | Per-frame React rect state |
| Chrome | existing `.os-window` / `.os-titlebar` | New palette |

Z-index on frames is `calc(var(--kellos-z-window-base) + orderIndex)` so it stays below `--kellos-z-start` (8000), taskbar, boot, skip.

### Desktop vs mobile
- **≥ `--kellos-bp-os` (48rem):** overlapping windows, drag title bar, resize grips, tip window to the right of About, not focused over the disclosure.
- **Below:** icon grid + stacked sheets (`position` not `absolute`), no resize grips, no first-run tip. Recruiter still gets About immediately.

### Routes (unchanged)
Deep link `/project/langchain-openrouter-provider` still opens the case study **with OS around it**. Reader `/read/…` still strips the OS. Boot still skippable on `/` only. Closing the last app window navigates to `/`; icons and Start reopen via the registry.

### Caption buttons
Minimize / maximize / close bind to the WM. Tip cannot min/max. Close is not OS shutdown.

---

## 2. OPEN QUESTIONS — still Saathvik’s

| # | Question | Phase 3 note |
|---|---|---|
| 1 | Master Blueprint | Still blocking content-model / app-inventory / registry surface names |
| 2 | Cut vs expand Tier 3 (34) | Untouched; still full list behind expand |
| 3 | “Not yet for sole ownership of production systems” | Kept |
| 4 | Graduation / location | Not invented |
| 5 | RMP / PawSethu technical rounds | Gallery rows only |
| 6 | LangChain unaided explanation (A1.4) | Still publication-conditional |
| 7 | Contact closing line | Still omitted |
| 8 | Gallery cut to 8–10 | Still named rows only |

---

## 3. ASSUMED (blueprint-dependent)

- Window ids (`app:about`, `doc:caseStudy:…`, `tip:getting-around`) are Phase 3 names, not blueprint names.
- Multiple windows may stay open while the URL follows the **focused** app/document (not the tip).
- Empty-route registry rows (Now, Timeline, Terminal, KELL.AI, Settings, OS Update) still have **no** window product.
- `OSVersion.features` flag names still not invented.
- Authorship remains required on `Project`.

---

## 4. WHAT PHASE 4 NEEDS

- This WM: `useWmStore`, `specForPath`, `open(spec)`, caption/task chips already wired.
- Frozen chrome + tokens. Phase 2 routes, Reader Mode, prerender, registry **data**.
- Recruiter-wins already decided: deep links, Skip, tip desktop-only, Read on the tray.
- `npm test` for the core; `python scripts/verify_phase3.py` against `vite preview` (set `KELLOS_PREVIEW` if 4173 is taken).

The next phase list is still **ASSUMED** without the blueprint. Whatever Phase 4 is (apps as products, Start polish, etc.), it should **call** this manager, not replace it.

---

## 5. WHAT PHASE 4 MUST NOT TOUCH

- Phase 0 copy (no quiet edits)
- Honesty stance / disclosure placement and weight
- Skill meters of any kind
- Promoting gallery → case study
- Visual fields on content blocks
- Tokens / a new palette / Clippy / Shut Down hiring path / a 1996→2026 second site / Three.js wallpaper
- Drafting `docs/content/case-studies/kellos.md`
- Replacing Reader Mode or deleting prerender “because the WM is the site”
- Per-frame React state for drag/resize
- React/DOM/GSAP inside `src/wm/core.ts`
- `position: absolute` on the **taskbar** (workspace inset-0 inside flex-1 only)
- Terminal, KELL.AI, Mongo, V2 backend, Ctrl+K runtime unless the blueprint assigns that phase

---

## 6. FILES PRODUCED (Phase 3)

```
src/wm/core.ts
src/wm/core.test.ts
src/wm/store.ts
src/wm/interact.ts
src/wm/specs.ts
src/wm/chromeContext.ts
src/wm/ManagedWindow.tsx
src/wm/Workspace.tsx
src/wm/windowContent.tsx
vitest.config.ts
scripts/verify_phase3.py
docs/handoffs/PHASE-3-HANDOFF.md
docs/handoffs/phase3-verify/*.png
```

Touched (not restyled): `WindowFrame.tsx` (caption + resize grips), `DesktopShell.tsx`, `Taskbar.tsx`, `DesktopIcons.tsx`, `App.tsx` (layout route so the shell does not remount per path), `Windows.tsx` (fill the WM rect), `chrome.css` (`.os-resize` hit targets, token colors only), `useCompact.ts` (read the breakpoint on first paint).

---

## 7. VERIFICATION (evidence)

- `npx tsc -b` — exit 0
- `npm test` — **11/11** passed (`src/wm/core.test.ts`)
- `npx vite build` — exit 0; prerendered HTML still under `dist/` including `/read/about` and `/project/langchain-openrouter-provider`
- `python scripts/verify_phase3.py` — **phase3 verify ok**
  - no-JS `/` contains “I develop AI-assisted”
  - desktop: Skip → About + tip to the right, taskbar `y > 500`, drag moves About, maximize/restore, two windows (About + Projects)
  - `/project/langchain-openrouter-provider` keeps OS chrome
  - `/read/about` has no `.os-taskbar`
  - mobile 390×844: no “Getting around”, taskbar at bottom, About not `position: absolute`

Screenshots: `docs/handoffs/phase3-verify/*.png`

GSAP was **not** added. Motion remains CSS / none.

---

## 8. ONE-PARAGRAPH SUMMARY FOR THE PHASE 4 CHAT

Phase 3 replaced the presentational one-window shell with a pure headless window manager (`src/wm/core.ts`) and a Zustand bind. Drag and resize write to the DOM; z-order uses `--kellos-z-window-base`. Desktop overlapping WM and mobile stacked sheets are both live. Caption buttons minimize/maximize/close against the WM. Phase 2 URLs, Reader Mode, prerender, and the App Registry as data are intact — a CV deep link still opens the case study with OS around it. Chrome tokens are frozen. Phase 4 must not restyle, rewrite Phase 0 copy, or rebuild the WM. The Master Blueprint never arrived; assumed decisions are listed above.
