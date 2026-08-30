# Phase 1 Handoff — Design System

**Phase:** 1 — Design System
**Completed:** 30 August 2026
**Next:** Phase 2 — only what the design system needs in the shell (routing / static
fallback / registry *shape*), **not** the window manager and **not** apps as products.
**Do not start Phase 2 in the Phase 1 chat.** This file is the gate.

---

## Failures and wrong assumptions (recorded as they happened)

1. **Master Blueprint still missing.** Searched the KellOS tree and parent MyExclusive
   folder: no blueprint file. Proceeded under **ASSUMED**. If the blueprint arrives, it
   **wins** — do not silently merge; diff against this handoff and `docs/design-system.md`.
2. `npm create vite` **cancelled** because the directory already contained `docs/`. Scaffold
   was written by hand (Vite 7 + React 19 + Tailwind v4 + TypeScript strict).
3. **Wrong assumption, corrected:** treating Reader Mode as a decorative “print view.”
   Phase 0 already argued Tier 1 importance. Phase 1 **locks that**: Reader Mode is
   hiring-critical even if `app-inventory.md` still lists it under Tier 2 placement.
4. **Wrong assumption, rejected:** a 2×2 case-study card grid. V1 may ship one case study;
   a grid would look broken or invite promoting gallery work. Featured row + “Also shipped.”
5. **Wrong assumption, rejected:** skill tiers as medal colors or meters. Same chrome face
   for all three group boxes; copy carries the evidence type.
6. **CSS `@import` order:** Google Fonts import was initially after `:root` and warned at
   build. Moved to the top of `tokens.css`.
7. **Taskbar in the first playground layout sat at the top of the desktop.** Icons and
   the About Me window were `position: absolute`, so the only in-flow child (the taskbar)
   packed to the start of the flex column. Fixed: desktop is a column with a flex-1
   workspace and a `shrink-0` taskbar. Recorded so Phase 3 does not recreate “absolute
   everything, then wonder where the taskbar went.”
8. **Mobile first-run help overlay covered About Me.** Recruiter-wins: on viewports below
   48rem the tip window is omitted; `Read` stays on the taskbar. Desktop keeps the tip to
   the right of About Me.

---

## 1. DECIDED — locked, do not renegotiate

### ORIGIN naming collision
Keep the **OS 1.0 codename ORIGIN** (locked in the version narrative). In UI chrome:

- Version identity always reads **`KELL.OS 1.0`** with optional subtitle **“ORIGIN era”**.
- The scrollytelling project always reads as a **project** (title **ORIGIN**, never a
  version string). Start menu / window titles never show a naked `ORIGIN` next to a version
  number without the words `KELL.OS` or `project`.
- Do not rename Phase 0 content. If a list would show both, the chrome prefix disambiguates.

### Gallery
**A view inside Projects**, not its own app. Recycle Bin stays its own app (metaphor
payoff). **ASSUMED** vs missing blueprint.

### Reader Mode
**Tier 1 importance.** Always reachable from the taskbar tray (`Read`) and Start. Strips
the OS. Required on mobile and in the static fallback. `app-inventory.md` placement under
Tier 2 is **overridden for priority**; re-tier when the blueprint is reconciled.

### Skill tiers, visually
Evidence **group boxes** with Phase 0 titles (“Externally verified” / “Shipped publicly” /
“Worked with”). No percentages, stars, bars, meters, or ranked color. Tier 3 (34 items)
**expands from closed `<details>`** — presentation only; the list is not cut.

### Chrome vs reading
Retro type on chrome only. Body/case study = Source Serif 4. Disclosure callouts use navy
bars at full weight — not de-emphasized.

### Stack (unchanged)
Vite + React + TypeScript strict + Tailwind. Tokens are CSS custom properties consumed by
Tailwind `@theme inline`. No Next.js, no Three.js/R3F, no GSAP in this phase, V1 zero backend.

### Wordmark (A5.1)
Pixel wordmark `KELL` + `.OS`. Favicon/boot-mark = 32×32 window glyph. Spec in
`docs/design-system.md` §6. Files: `src/brand/marks.tsx`, `public/favicon.svg`,
`public/boot-mark.svg`.

### First-run / boot
Skippable boot; Skip visible immediately. About Me **already open**. Help is a small window,
no mascot, must not delay or bury the AI-assistance disclosure.

### Mobile
Not a scaled-down Win95 desktop: icon grid + stacked windows + 48px taskbar.

### Deep links
A case-study URL opens that document in OS chrome. Recruiter does not learn the WM first.

---

## 2. OPEN QUESTIONS — still Saathvik’s

| # | Question | Phase 1 note |
|---|---|---|
| 1 | Master Blueprint | Still blocking reconciliation of content-model + app-inventory |
| 2 | Cut vs expand Tier 3 skills (34) | Design shows **full list behind expand**. Cut to ~15 is his call |
| 3 | Keep / soften / cut “Not yet for sole ownership of production systems” | **Still recommend keep.** Not redesigned away |
| 4 | Graduation date / location for résumé header | Still `⚠ VERIFY`. Header layout reserved; no invented date or city |
| 5 | RMP / PawSethu technical rounds | Projects layout already assumes **one** case study |
| 6 | LangChain unaided explanation (A1.4) | Content unchanged; publication still conditional |

---

## 3. ASSUMED (blueprint-dependent)

Mark these if the blueprint disagrees:

- `ContentBlock` variant list in `content-model.md` §3 is the renderer set (no variants
  added, no visual fields added).
- `OSVersion.features` flag **names** not invented; UI only needs `isLatest` + number +
  codename display rules.
- Gallery is not a separate registry app.
- Timeline, Now, Settings, Terminal, KELL.AI remain as in `app-inventory.md` (Reader Mode
  importance elevated).
- Authorship stays **required**.

---

## 4. WHAT PHASE 2 NEEDS

- `docs/design-system.md` — frozen spec
- `src/styles/tokens.css`, `chrome.css`, `blocks.css` — copy, don’t restyle
- `src/blocks/BlockRenderer.tsx` — semantic map for all block types
- Playground (`npm run dev`) — Desktop, Reader, Case study, Projects (1), Empty/skills,
  Boot, Tokens, Wordmark; resize below 48rem
- Phase 0 content still canonical; playground quotes it, does not replace it
- Recruiter-wins conflicts already decided for chrome vs reading, first-run, mobile, empty
  metrics, missing images

Phase 2 should: wire URLs / static fallback / App Registry **manifest shape** if that is
Phase 2’s brief — **only if** the master phase list says so. If Phase 2 is “OS shell
without WM,” keep using these chrome classes as dumb presentational components.

---

## 5. WHAT PHASE 2 MUST NOT TOUCH

- Phase 0 copy (no quiet edits). If a line doesn’t fit, change layout or ask.
- Honesty stance / disclosure placement (early, full weight).
- Skill meters of any kind.
- Promoting gallery projects to case studies to fill a grid.
- Visual fields on the content model (`className`, `color`, `width`).
- Headless WM core, drag/resize runtime, Terminal, KELL.AI, Mongo, V2 backend.
- New inspiration palettes, Inter/purple “portfolio defaults,” Clippy, Shut Down hiring
  paths, a second 2026 site, Three.js wallpaper.
- Softening “Not yet for sole ownership…” unless Saathvik answers Q3.
- Drafting `docs/content/case-studies/kellos.md`.

---

## 6. FILES PRODUCED

```
docs/design-system.md
docs/handoffs/PHASE-1-HANDOFF.md
package.json, vite.config.ts, tsconfig*.json, index.html
src/styles/tokens.css
src/styles/chrome.css
src/styles/blocks.css
src/brand/marks.tsx
src/chrome/WindowFrame.tsx
src/blocks/BlockRenderer.tsx
src/content/types.ts
src/content/sample.ts          ← playground only; not a CMS
src/surfaces/*
src/App.tsx
public/favicon.svg
public/boot-mark.svg
public/fonts/ms_sans_serif*.woff
```

---

## 7. ONE-PARAGRAPH SUMMARY FOR THE PHASE 2 CHAT

Phase 1 froze KELL.OS as Win95–98 chrome around **excellent long-form reading**, not a
RobbyOS clone and not a retro novelty blog. Tokens are CSS custom properties; Tailwind
maps to them; chrome recipes are `.os-raised` / `.os-sunken` / `.os-window` / `.os-titlebar`.
Reader Mode is Tier 1, boot is skippable, About Me opens immediately with the AI-assistance
disclosure at full weight, Projects is designed for **one** case study plus a gallery view,
and missing images/metrics are written empty wells — never fake numbers. The Master
Blueprint never arrived; assumed decisions are listed above. Phase 2 implements against
`docs/design-system.md` and this handoff. It does not restyle the system and it does not
build the window manager.
