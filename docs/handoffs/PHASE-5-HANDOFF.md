# Phase 5 Handoff — Recruiter 90-second path + honest shell

**Phase:** 5 — Recruiter path and honest Start/desktop/mobile over the Phase 3 WM and Phase 4 apps
**Completed:** 30 August 2026
**Next:** Phase 6 — **not** a new OS, not a restyle, not Terminal / KELL.AI / Ctrl+K / Mongo unless
the blueprint assigns them. Do not start Phase 6 in the Phase 5 chat.
**Do not start Phase 6 in the Phase 5 chat.** This file is the gate.

---

## Failures and wrong assumptions (recorded as they happened)

1. **Master Blueprint still missing.** Searched the KellOS tree: no blueprint file.
   Proceeded under **ASSUMED** (recruiter 90-second path + honest shell). If it arrives, it
   **wins** — diff against this handoff and `src/shell/`. Do not silently merge. If it
   assigns Phase 5 to something else, this work is the wrong phase and should be flagged,
   not merged quietly.
2. **`vite preview` 4173 was already a leftover risk.** Verification used
   `KELLOS_PREVIEW=http://127.0.0.1:4176`. Directory-index for nested prerender URLs is
   unchanged (Phase 2). Do not invent a second site to “fix” hosts.
3. **Playwright “Projects” is not unique.** Desktop icon and About menubar both say
   Projects. The 90-second proof clicks the **About menubar** link so the recruiter never
   has to learn the WM. Strict-mode click on the role failed on the first pass.
4. **Alt+R URL vs paint race.** Reader Mode’s URL updated before `DesktopShell` unmounted,
   so `.os-taskbar` could still be in the DOM for one tick. Verification waits for
   “Back to desktop” and `footer.os-taskbar` detached. Not a second Reader implementation.
5. **Keyboard must not steal the browser tab.** Ctrl+F4 / Alt+F4 / Alt+Arrow (Back) were
   rejected. Shortcuts are **Alt+R**, **Alt+Shift+C**, **Alt+Shift+F**, **Alt+Shift+arrows**.
   Ctrl+K is not handled (no palette).

---

## 1. DECIDED — locked, do not renegotiate

### What Phase 5 proved
A recruiter can **Skip → About (already open) → AI disclosure at full-weight navy →
Projects (About menubar) → LangChain case study** with the OS still around the document.
**Read** stays on the tray and in Start. Start, desktop, and mobile grid list **only apps
that open**. Empty-route registry rows (Search, Terminal, KELL.AI, Settings, OS Update)
remain **data**. The Phase 3 WM was called (`nudgeWindow` / `cycleTaskFocus` in `core.ts`),
not replaced. Drag/resize still write to the DOM.

### Honest chrome
`appsLaunchableOn` filters visitor surfaces. Terminal / KELL.AI / Search / Settings / OS
Update are not Start dead-ends and were not built. Reader Mode remains a Start row that
navigates to `/read/…`.

### Icon overflow
Desktop icon **column** and mobile **4-column grid** scroll inside existing chrome after
Now + Timeline. Not a new layout language. Task chips can overflow-x on the taskbar strip.
Start menu max-height + scroll if the list grows.

### Keyboard (no Ctrl+K)
| Chord | Action |
|---|---|
| Alt+R | Reader Mode for the current path |
| Alt+Shift+C | Close focused window (tip dismisses) |
| Alt+Shift+F | Cycle task windows |
| Alt+Shift+arrows | Nudge focused window 16px (desktop, normal mode) |
| Escape | Close Start |

### Content / routes (frozen)
Now staleness, Timeline eras, Recycle copy, and Phase 0 words are unchanged. `/now`,
`/timeline`, `/project/langchain-openrouter-provider`, Reader `/read/…`, prerender, and
registry **shape** stay. Boot skippable on `/` only. First-run tip desktop-only, to the
right (copy now states the 90-second path and the keyboard; not Phase 0 body text).

### Chrome / WM
Frozen tokens. Workspace `absolute inset-0` only inside the flex-1 region. Taskbar
`shrink-0` at the bottom. `core.ts` still has no React/DOM/GSAP.

---

## 2. OPEN QUESTIONS — still Saathvik’s

| # | Question | Phase 5 note |
|---|---|---|
| 1 | Master Blueprint | Still blocking content-model / app-inventory / registry surface names |
| 2 | Cut vs expand Tier 3 (34) | Untouched |
| 3 | “Not yet for sole ownership of production systems” | Kept |
| 4 | Graduation / location | Not invented |
| 5 | RMP / PawSethu technical rounds | Gallery rows only |
| 6 | LangChain unaided explanation (A1.4) | Still publication-conditional |
| 7 | Contact closing line | Still omitted |
| 8 | Gallery cut to 8–10 | Still named rows only |
| 9 | Now monthly review | August 2026 label unchanged; staleness rule unchanged |

---

## 3. ASSUMED (blueprint-dependent)

- Phase 5 = recruiter 90-second path + honest shell (user instruction while the blueprint
  is missing).
- Keyboard chords above are Phase 5 names, not blueprint names.
- Empty-route rows stay rows until a later phase (or the blueprint) assigns runtimes.
- Gallery is not a registry app (Phase 1).
- Authorship remains required on `Project`.

---

## 4. WHAT PHASE 6 NEEDS

- This handoff + Phase 3 WM (`useWmStore`, `specForPath`, `open(spec)`, `nudge` /
  `cycleTask` on the store).
- Frozen chrome + tokens. Phase 2–4 routes including `/now` `/timeline` Reader/prerender.
- Recruiter-wins already decided: Skip, disclosure weight, About → Projects → case study,
  Read on the tray, tip desktop-only, honest Start.
- `npm test`. `python scripts/verify_phase5.py` against `vite preview` (set
  `KELLOS_PREVIEW` if 4173 is taken).

The next phase list is still **ASSUMED** without the blueprint. Leftover atmosphere
(Ctrl+K runtime, Terminal, KELL.AI, Settings, OS-update ceremony) is **later** and must
not be started “because the registry still has empty rows.”

---

## 5. WHAT PHASE 6 MUST NOT TOUCH

- Phase 0 copy (no quiet edits)
- Honesty stance / disclosure placement and weight
- Skill meters of any kind
- Promoting gallery → case study
- Visual fields on content blocks
- Tokens / a new palette / Clippy / Shut Down hiring path / a 1996→2026 second site / Three.js wallpaper
- Drafting `docs/content/case-studies/kellos.md`
- Replacing Reader Mode or deleting prerender “because the WM is the site”
- Rebuilding or replacing the WM; React/DOM/GSAP inside `src/wm/core.ts`
- Per-frame React state for drag/resize
- `position: absolute` on the **taskbar** (workspace inset-0 inside flex-1 only)
- Terminal, KELL.AI (no LLM in V1), Ctrl+K runtime, Mongo, admin, version-update ceremony
  unless the blueprint assigns that phase
- Inventing graduation date, location, metrics, or unverified URLs
- Adding apps because empty registry rows still exist
- Softening Recycle Bin into a failure-theatre product

---

## 6. FILES PRODUCED (Phase 5)

```
src/shell/useOsKeyboard.ts
src/registry/launchable.test.ts
scripts/verify_phase5.py
docs/handoffs/PHASE-5-HANDOFF.md
docs/handoffs/phase5-verify/*.png
```

Touched (not restyled as a new language): `manifest.ts` (launchable helpers), `core.ts`
(nudge + cycle, still pure), `store.ts`, `specs.ts` (tip preferred size, close path),
`ManagedWindow.tsx`, `DesktopShell.tsx`, `Taskbar.tsx`, `DesktopIcons.tsx`,
`Windows.tsx` (About menubar Projects), `BootAndBrand.tsx` (tip copy), `chrome.css`
(icon column/grid overflow, task strip, Start max-height).

Untouched on purpose: tokens palette, BlockRenderer variants, LangChain body, kellos.md,
Terminal / KELL.AI / Ctrl+K runtimes.

---

## 7. VERIFICATION (evidence)

- `npx tsc -b` — exit 0
- `npm test` — **18/18** passed (`core.test.ts` 13 + `now.test.ts` 3 + `launchable.test.ts` 2)
- `npx vite build` — exit 0; prerendered routes still under `dist/` including `/now`,
  `/timeline`, `/read/about`, `/project/langchain-openrouter-provider`
- `python scripts/verify_phase5.py` — **phase5 verify ok** (`KELLOS_PREVIEW=http://127.0.0.1:4176`)
  - no-JS `/` disclosure; Now / Timeline / Recycle words unchanged
  - desktop: Skip → About + navy disclosure bar; Start has Reader Mode + Projects, not
    Terminal / KELL.AI / Search / Settings / OS Update; menubar Projects → LangChain with
    OS chrome; Alt+Shift+Arrow nudges; Ctrl+K opens no palette; Alt+R strips the OS
  - short desktop 1280×560: icon column `overflow-y` auto, Recycle reachable, column does
    not overlap the taskbar
  - mobile 390×844: 4-column grid, Now/Timeline/Recycle, stacked Projects (not `absolute`),
    case study still has the taskbar

Screenshots: `docs/handoffs/phase5-verify/*.png`

GSAP was **not** added. WM core has **no** React/DOM/GSAP imports.

---

## 8. ONE-PARAGRAPH SUMMARY FOR THE PHASE 6 CHAT

Phase 5 made the shipped OS honest and recruiter-usable: Start, desktop, and mobile only
offer apps that actually open; the 90-second path is Skip → About (disclosure at full
weight) → Projects → LangChain without learning the window manager; Reader Mode stays on
the tray, in Start, and on Alt+R. Icon overflow after Now and Timeline is scroll inside
the existing chrome. Window close/focus/move are keyboard-reachable without a command
palette — Ctrl+K was not shipped. The Phase 3 headless WM was extended with pure nudge and
cycle helpers, not replaced. Phase 0 words, Now staleness, Timeline eras, Recycle copy,
tokens, and Phase 2–4 routes are frozen. The Master Blueprint never arrived; assumed
decisions are listed above. Phase 6 must not restyle, rewrite Phase 0 copy, rebuild the
WM, or implement Terminal / KELL.AI / Ctrl+K because empty registry rows still exist.
