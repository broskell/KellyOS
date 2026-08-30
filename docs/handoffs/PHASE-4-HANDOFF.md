# Phase 4 Handoff — Apps as products (content-backed)

**Phase:** 4 — Remaining apps that already have Phase 0 copy, bound to the Phase 3 WM
**Completed:** 30 August 2026
**Next:** Phase 5 — **not** a new WM, not Terminal / KELL.AI / Ctrl+K / Mongo unless the
blueprint assigns them. Do not start Phase 5 in the Phase 4 chat.
**Do not start Phase 5 in the Phase 4 chat.** This file is the gate.

---

## Failures and wrong assumptions (recorded as they happened)

1. **Master Blueprint still missing.** Searched the KellOS tree: no blueprint file.
   Proceeded under **ASSUMED** (apps as products with existing copy). If it arrives, it
   **wins** — diff against this handoff, `src/registry/manifest.ts`, and
   `src/content/now.ts` / `timeline.ts`. Do not silently merge. If it assigns Phase 4 to
   something else, this work is the wrong phase and should be flagged, not merged quietly.
2. **`vite preview` 4173 and 4174 were already bound.** Verification used
   `KELLOS_PREVIEW=http://127.0.0.1:4175`. Directory-index for nested prerender URLs is
   unchanged (Phase 2). Do not invent a second site to “fix” hosts.
3. **Timeline has no entry-by-entry Phase 0 file** — only `version-narrative.md` plus the
   résumé contract. Entries were derived from those documents, not invented. Dates that
   are year-only stay year-only (`periodLabel`); ISO months are sort keys. **Future
   Interns is not listed as an internship** (OWASP / secure-file-sharing remain as
   project evidence). Graduation date and location were not invented.
4. **Now’s `updatedAt` is `2026-08-01` as a staleness epoch**, not a claimed calendar day.
   Visitor-facing copy remains **August 2026**. On 30 August 2026 the snapshot is within
   45 days (note, not caution). After the threshold the date callout switches to
   `caution` / “Updated (stale)” without rewriting the month label.

---

## 1. DECIDED — locked, do not renegotiate

### What Phase 4 proved
Content-backed apps the WM already knew how to open are now real windows and URLs:
**Now**, **Timeline**, and the existing **Recycle Bin** (honest abandoned-project copy,
not a new product). Gallery remains a **view inside Projects**. Empty-route Start
dead-ends for Now/Timeline are gone. Terminal, KELL.AI, Search, Settings, and OS Update
stay registry **rows only**.

### New public routes
| Path | Surface |
|---|---|
| `/now` · `/read/now` | Phase 0 Now list + visible updated date |
| `/timeline` · `/read/timeline` | Eras 1.0 ORIGIN / 2.0 / 3.0; CGPA 9.44; recognitions |

Deep link `/project/langchain-openrouter-provider` still opens the case study **with OS
around it**. Reader still strips the OS. Boot still skippable on `/` only. First-run tip
still desktop-only, to the right.

### Registry
Now and Timeline: `desktopIcon`, `startMenu`, `mobileGrid`, `staticFallback`, plus the
existing search/terminalOpen flags. Recycle Bin unchanged. **No Gallery app.** Caption
buttons still call `useWmStore`. Open path is still `open(spec)` / `specForPath`.

### Now staleness (design system §9)
`nowIsStale` + `stalenessThresholdDays: 45`. Stale → caution callout on the date. Not a
green “live” badge. Not a skill meter.

### Chrome / WM
Frozen. `core.ts` still has no React/DOM/GSAP. Workspace `absolute inset-0` only inside
the flex-1 region. Taskbar `shrink-0` at the bottom. Timeline pixel icon uses existing
tokens only.

---

## 2. OPEN QUESTIONS — still Saathvik’s

| # | Question | Phase 4 note |
|---|---|---|
| 1 | Master Blueprint | Still blocking content-model / app-inventory / registry surface names |
| 2 | Cut vs expand Tier 3 (34) | Untouched |
| 3 | “Not yet for sole ownership of production systems” | Kept |
| 4 | Graduation / location | Not invented |
| 5 | RMP / PawSethu technical rounds | Gallery rows only; PawSethu also appears on Timeline as a 2.0 project, not a case study |
| 6 | LangChain unaided explanation (A1.4) | Still publication-conditional |
| 7 | Contact closing line | Still omitted |
| 8 | Gallery cut to 8–10 | Still named rows only |
| 9 | Now monthly review | Content is August 2026; the app will look stale after 45 days until the month label is updated **by Saathvik** |

---

## 3. ASSUMED (blueprint-dependent)

- Phase 4 = remaining **content-backed** apps, not a new WM (user instruction + Phase 3
  “whatever Phase 4 is, call this manager”).
- Timeline is in the V1 set (`app-inventory.md` Tier 2).
- Gallery is not a registry app (Phase 1).
- Empty routes remaining (Search, Terminal, KELL.AI, Settings, OS Update) are **not**
  this phase.
- Window ids `app:now` / `app:timeline` follow Phase 3 naming.

---

## 4. WHAT PHASE 5 NEEDS

- This handoff + Phase 3 WM (`useWmStore`, `specForPath`, `open(spec)`).
- Frozen chrome + tokens. Phase 2 routes + new `/now` `/timeline` Reader/prerender.
- Recruiter-wins already decided: deep links, Skip, tip desktop-only, Read on the tray.
- `npm test` (core + Now staleness). `python scripts/verify_phase4.py` against
  `vite preview` (set `KELLOS_PREVIEW` if 4173 is taken).

The next phase list is still **ASSUMED** without the blueprint. Likely leftover
atmosphere/runtime (Ctrl+K, Terminal, KELL.AI, Settings, update ceremony) is **later**
and must not be started “because Start still has unused registry rows.”

---

## 5. WHAT PHASE 5 MUST NOT TOUCH

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
- Softening Recycle Bin into a failure-theatre product

---

## 6. FILES PRODUCED (Phase 4)

```
src/content/now.ts
src/content/now.test.ts
src/content/timeline.ts
src/apps/Windows.tsx              ← NowWindow, TimelineWindow; Recycle status only
src/wm/windowContent.tsx
src/wm/specs.ts                   ← knownDesktopPath
src/registry/manifest.ts
src/registry/types.ts
src/content/documents.ts
src/reader/ReaderPage.tsx
src/prerender/pages.ts
src/App.tsx
src/brand/marks.tsx               ← timeline glyph, token colors
scripts/verify_phase4.py
docs/handoffs/PHASE-4-HANDOFF.md
docs/handoffs/phase4-verify/*.png
```

Untouched on purpose: `src/wm/core.ts`, tokens, BlockRenderer variants, LangChain body,
kellos.md, Terminal / KELL.AI runtimes.

---

## 7. VERIFICATION (evidence)

- `npx tsc -b` — exit 0
- `npm test` — **14/14** passed (`src/wm/core.test.ts` 11 + `src/content/now.test.ts` 3)
- `npx vite build` — exit 0; prerendered `dist/now`, `dist/timeline`, `dist/read/now`,
  `dist/read/timeline` (and prior routes)
- `python scripts/verify_phase4.py` — **phase4 verify ok** (`KELLOS_PREVIEW=http://127.0.0.1:4175`)
  - no-JS `/` disclosure; `/now` stuck-on-ML + August 2026; `/timeline` CGPA 9.44; no
    “Future Interns”; Recycle standing rule
  - desktop: Start lists Now and Timeline, not Terminal / KELL.AI; two windows; Recycle
    framing quote; Projects “Also shipped” (no Gallery heading); case-study deep link
    keeps OS chrome; `/read/now` and `/read/timeline` have no taskbar
  - mobile 390×844: Now + Timeline on the icon grid; Now sheet not `position: absolute`;
    taskbar at bottom

Screenshots: `docs/handoffs/phase4-verify/*.png`

GSAP was **not** added. WM core was **not** edited.

---

## 8. ONE-PARAGRAPH SUMMARY FOR THE PHASE 5 CHAT

Phase 4 turned **Now** and **Timeline** into real WM windows, Start/desktop/mobile
targets, Reader routes, and prerendered static pages, using Phase 0 Now copy and a
Timeline derived from the version narrative (no invented graduation, location, or Future
Interns internship). Recycle Bin stayed the honest abandoned-project app. Gallery stayed
a view inside Projects. The Phase 3 headless WM was called, not replaced. Terminal,
KELL.AI, Ctrl+K, Mongo, Settings, and the OS-update ceremony were not built. Chrome
tokens and Phase 2 deep links remain frozen. The Master Blueprint never arrived; assumed
decisions are listed above. Phase 5 must not restyle, rewrite Phase 0 copy, or rebuild
the WM.
