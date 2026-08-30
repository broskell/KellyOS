# Phase 8 Handoff — Command Surfaces

**Phase:** 8 — Give runtimes to Search (Ctrl+K), Terminal (`open`), and Settings. All three read the registry. **Not** KELL.AI (Phase 15) or OS Update (Phase 14).
**Completed:** 30 August 2026
**Next:** Phase 9 — Content Completion & Gallery. **Gated on Saathvik’s gallery/screenshot homework.** **Do not start Phase 9 in the Phase 8 chat.** This file is the gate.

---

## Blueprint vs the pasted Phase 8 brief

`docs/MASTER-BLUEPRINT.md` **exists** (v1.0-reconstructed, 30 August 2026). It **wins**.

No **original** (15 August) Master Blueprint appeared in this tree. Searched; reconstruction remains the authority. If the original is recovered, it wins over this handoff and the reconstruction — flag diffs; do not silently merge. If it assigns Phase 8 to something else, this work is the wrong phase.

Pasted brief and reconstructed §10.2 agree: Phase 8 is Command Surfaces.

`docs/CONTEXT.md` still says the blueprint never reached Phase 0. That file was **not** rewritten.

---

## Failures and wrong assumptions (recorded as they happened)

1. **Master Blueprint is still a reconstruction.** Proceeded under reconstructed §10.2.
2. **Search is an overlay, not a WM window.** Search stays `kind: "shell"` with an empty route so `specForPath` does not open a second window. Runtime is Ctrl+K. Deep link `/search` still bounces to `/` via `knownDesktopPath`.
3. **First-run tip still said “There is no Ctrl+K”** after the chord shipped. That was a live lie on the desktop. Updated the tip line only (not Phase 0 About copy).
4. **Settings previously had `osUpdate` and no `terminalOpen`.** Added `terminalOpen` so `open settings` uses the same resolver as other apps. Kept `osUpdate` as data for Phase 14. Did not build the ceremony.
5. **Heading order must not be asserted on a desktop with several windows open.** Inactive titles are spans; other wells still contain h2s. Settings focused title is `h1.os-titlebar-label`.
6. **`vite preview` leftover ports.** Used `KELLOS_PREVIEW=http://127.0.0.1:4180`. Directory-index for nested prerender URLs unchanged.
7. **No interactive browser MCP in this session.** Desktop + mobile were verified with Playwright (`scripts/verify_phase8.py`) and screenshots under `docs/handoffs/phase8-verify/`. Could not click through a live headed browser.

---

## 1. DECIDED — locked, do not renegotiate

### What Phase 8 shipped
- **Search:** Ctrl+K toggles `[data-os-search]`. Indexes `appsOn("search")` through `searchRegistry` / `launchPathFor`. Omits KELL.AI, OS Update, and Search itself (no launch path). Enter / click launches via `specForPath` + `open(spec)` / Reader URL. Escape closes Search the same way it closes Start. Does not steal Ctrl+F.
- **Terminal:** `/terminal` window. Commands: `help`, `ls`, `open <id|slug|title>`, `clear`. `open` uses `resolveOpenQuery(..., "terminalOpen")`. No network, no visitor-machine shell, no fake biography filesystem.
- **Settings:** `/settings` window. Wordmark identity. Honest reduced-motion readout from `prefers-reduced-motion`. No theme lab, no wallpaper, no version switcher. Reader Mode remains the safety valve (link + tray).
- **Honest Start/desktop/mobile** still list only visitor-launchable apps **on those surfaces**. Terminal and Settings open but stay off Start/desktop/mobile (registry flags). KELL.AI and OS Update remain empty-route rows.

### Registry
Adding an app later is still a registry row. Search and Terminal do not keep a fourth list.

### Keyboard
Alt+R · Alt+Shift+C · Alt+Shift+F · Alt+Shift+arrows · Escape closes Start **and** Search. **Ctrl+K ships.** Still does not steal Ctrl+F4 / Alt+F4 / Alt+Arrow.

### Chrome / WM / content
Frozen recipes. Workspace `absolute inset-0` only inside the flex-1 region. Taskbar `shrink-0` at the bottom. `core.ts` still has no React, DOM, or GSAP. Drag/resize still write to the DOM. Lazy `loadWindow` kept; Terminal and Settings are extra chunks, not smashed into one mega-window. Caption buttons 16×14.

### Bundle (this build)
| Chunk | gzip |
|---|---|
| `index-*.js` | ~75.5KB |
| `DesktopShell-*.js` (includes Search overlay) | ~38.2KB |
| **Shell + WM before apps** | **~113.7KB** (under 200KB) |
| `TerminalWindow-*.js` | ~1.2KB gzip |
| `SettingsWindow-*.js` | ~1.0KB gzip |

---

## 2. OPEN QUESTIONS — still Saathvik’s

| # | Question | Phase 8 note |
|---|---|---|
| 1 | **Confirm reconstructed §10.2** (phases 6–18) | Most urgent. This phase followed it. |
| 2 | Confirm §8 budgets, §5.2 names, §6.1 tiers, §7.2, ORIGIN collision | Untouched |
| 3 | Cut vs expand Tier 3 (34) | Untouched |
| 4 | “Not yet for sole ownership of production systems” | Kept |
| 5 | Graduation / location | Not invented |
| 6 | RMP / PawSethu technical rounds | Gallery rows only |
| 7 | LangChain unaided explanation (A1.4) | Still publication-conditional |
| 8 | Contact closing line | Still omitted |
| 9 | Gallery cut to 8–10 | Still named rows only — **Phase 9 gate** |
| 10 | Now monthly review | August 2026 label unchanged |

---

## 3. ASSUMED (blueprint-dependent)

- Phase 8 = Command Surfaces (**blueprint §10.2**).
- Search as overlay (empty route) rather than a shell window is acceptable; Ctrl+K is the product chord.
- Terminal/Settings on Search + `open`, not on Start, matches “honest Start lists only apps that open” without putting Tier 3 in the 90-second path.
- Settings `osUpdate` surface flag stays data for Phase 14.
- Gallery is not a registry app (Phase 1).

---

## 4. WHAT PHASE 9 NEEDS

- This handoff + frozen chrome + duration tokens + lazy `src/registry/loadWindow.tsx`.
- Phase 3 WM (`useWmStore`, `specForPath`, `open(spec)`, `nudge` / `cycleTask`).
- Phase 5–8 recruiter path + honest shell + Ctrl+K / Terminal / Settings.
- `python scripts/verify_phase8.py` against `vite preview` (set `KELLOS_PREVIEW` if 4173 is taken).
- **Saathvik’s homework:** gallery cut to 8–10 with real screenshots; URL verification (`ExternalLink.verified`). See `docs/asset-inventory.md`. Do not invent assets or metrics.

---

## 5. WHAT PHASE 9 MUST NOT TOUCH

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
- Inventing graduation date, location, metrics, or unverified URLs
- Inventing gallery assets or metrics to fill layouts
- Hardcoding Start/Search/Terminal app lists that drift from the registry
- Adding GSAP decoration that a recruiter cannot skip
- Enlarging caption buttons or restyling tokens to game Lighthouse

---

## 6. FILES PRODUCED (Phase 8)

```
src/registry/resolve.ts
src/registry/resolve.test.ts
src/registry/useRegistryLaunch.ts
src/shell/SearchPalette.tsx
src/apps/TerminalWindow.tsx
src/apps/SettingsWindow.tsx
scripts/verify_phase8.py
docs/handoffs/PHASE-8-HANDOFF.md
docs/handoffs/phase8-verify/*
```

Touched: `manifest.ts` (routes + Settings `terminalOpen`), `types.ts` comments, `loadWindow.tsx`, `launchable.test.ts`, `App.tsx`, `specs.ts` (`knownDesktopPath`), `DesktopShell.tsx`, `useOsKeyboard.ts`, `chrome.css` (menu `aria-selected`), `BootAndBrand.tsx` (Ctrl+K tip line).

Untouched on purpose: `src/wm/core.ts` logic, Phase 0 words, LangChain body, kellos.md, KELL.AI / OS Update runtimes, token palette.

---

## 7. VERIFICATION (evidence)

- `npx tsc -b` — exit 0
- `npm test` — **27/27** passed (`core.test.ts` 13 + `now.test.ts` 3 + `launchable.test.ts` 4 + `duration.test.ts` 2 + `outline.test.ts` 1 + `resolve.test.ts` 4)
- `npx vite build` — exit 0; prerendered routes still under `dist/` including `/now`, `/timeline`, `/read/about`, `/project/langchain-openrouter-provider`. Terminal/Settings are lazy chunks, not in the static fallback list.
- `python scripts/verify_phase8.py` — **phase8 verify ok** (`KELLOS_PREVIEW=http://127.0.0.1:4180`)
  - no-JS `/` disclosure; Now / Timeline words unchanged
  - Skip visible at opacity 1; honest Start (no Terminal / KELL.AI / Search / Settings / OS Update)
  - Ctrl+K opens `[data-os-search]`; Enter on “about” / “settings” / “terminal”
  - Terminal `open about` focuses About via the WM; disclosure still present
  - 90s path (Projects inside About → LangChain body “And the part I won't dress up”)
  - Alt+R: “Back to desktop”, `footer.os-taskbar` detached
  - mobile: stacked Projects (`position` not `absolute`); Ctrl+K Search; Settings body

WM core has **no** React/DOM/GSAP imports (duration unit test still reads the file).

---

## 8. ONE-PARAGRAPH SUMMARY FOR THE PHASE 9 CHAT

Phase 8 gave runtimes to the three assigned empty rows: Search is a Ctrl+K overlay over the registry, Terminal is a window whose `open`/`ls` resolve `terminalOpen`, and Settings is a window that tells the truth about reduced motion and refuses a theme lab. KELL.AI and OS Update stay data. Start/desktop/mobile still omit dead-ends and omit Terminal/Settings. The Phase 3 core is still pure; lazy windows remain split; Phase 0 words and the 90-second path are intact. Phase 9 is gallery/screenshots and URL verification — gated on Saathvik — not KELL.AI, not OS Update, not a restyle.
