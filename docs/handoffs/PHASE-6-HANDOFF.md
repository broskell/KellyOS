# Phase 6 Handoff — Motion & Polish (GSAP)

**Phase:** 6 — First GSAP introduction: boot exit, window open/close/focus, Start, tip.
`prefers-reduced-motion` disables non-essential motion. Boot stays skippable.
**Completed:** 30 August 2026
**Next:** Phase 7 — Performance, Accessibility & Hardening (blueprint §10.2). **Not** Ctrl+K /
Terminal / KELL.AI / Settings / OS Update / Mongo unless Saathvik rejects §10.2.
**Do not start Phase 7 in the Phase 6 chat.** This file is the gate.

---

## Blueprint vs the pasted Phase 6 brief

`docs/MASTER-BLUEPRINT.md` **exists** (v1.0-reconstructed, 30 August 2026). It **wins**.

| | Pasted chat (ASSUMED) | Blueprint §10.2 |
|---|---|---|
| Phase 6 | Visitor-quality freeze: reduced motion, focus rings, boot fade from tokens. **No new OS.** Explicitly not GSAP theatre. | **Motion & Polish.** First introduction of **GSAP**. Boot, window open/close/focus, Start, tip. Reduced motion disables non-essential motion; boot stays skippable. |
| Phase 7 | (unspecified) | Performance, Accessibility & Hardening — §8 budgets, Lighthouse ≥95 |

**Followed the blueprint.** Did not silently merge the pasted ASSUMED scope. Focus rings were
kept as **polish** on existing dotted/selection language (not a Phase 7 Lighthouse campaign).

⚠ The reconstruction still asks Saathvik to confirm §10.2. If the original blueprint assigns
Phase 6 differently, this work is the wrong phase and must be flagged, not merged quietly.

`docs/CONTEXT.md` still says the blueprint never reached Phase 0. That file was **not**
rewritten. The reconstruction lives at `docs/MASTER-BLUEPRINT.md`.

---

## Failures and wrong assumptions (recorded as they happened)

1. **Master Blueprint is a reconstruction, not the 15 August original.** Searched and found
   `docs/MASTER-BLUEPRINT.md`. Proceeded under **blueprint assignment**, not the pasted
   ASSUMED freeze. If the original is recovered, it wins over both this handoff and the
   reconstruction — flag diffs; do not silently merge.
2. **Duration tokens did not exist** even though design-system §10 already specified boot
   fade ≤ 400ms and “GSAP must read duration from tokens.” Added **only** duration custom
   properties. Palette hex values were not restyled.
3. **Boot fade-in would hide Skip.** Design system: Skip visible on the first frame.
   Implemented **exit-only** overlay fade (≤ `--kellos-duration-boot`). Overlay starts at
   opacity 1.
4. **Playwright `get_by_role("link", name="Read")` is not unique** (Start “Reader Mode” +
   tray “Read”). Verification uses `exact=True` for the tray control. Same class of bug as
   Phase 5 “Projects”.
5. **`vite preview` 4173 leftover risk** (Phases 2–5). Verification used
   `KELLOS_PREVIEW=http://127.0.0.1:4177`. Directory-index for nested prerender URLs is
   unchanged. Do not invent a second site to “fix” hosts.

---

## 1. DECIDED — locked, do not renegotiate

### What Phase 6 proved
GSAP is in the project and **only** in the bind/shell layer (`src/motion/play.ts`).
`src/wm/core.ts` still has no React, DOM, or GSAP. Durations come from CSS tokens.
`prefers-reduced-motion: reduce` skips tweens (boot unmounts immediately on Skip).
The Phase 5 90-second path still works: Skip → About already open → AI disclosure at
full-weight navy → About menubar Projects → LangChain with OS around it. Alt+R still
waits for “Back to desktop” and `footer.os-taskbar` detached.

### Motion map (opacity only — no new layout language)

| Surface | Motion | Reduced motion |
|---|---|---|
| Boot | Exit fade on Skip, token `--kellos-duration-boot` (400ms) | Instant unmount |
| Window open / restore from minimize | Fade in, `--kellos-duration-window` (180ms) | Instant opacity 1 |
| Window close / minimize | Fade out, then WM close/minimize | Instant |
| Window focus | Brief opacity 0.92→1, `--kellos-duration-focus` (120ms) | Instant |
| Start menu | Fade in, `--kellos-duration-menu` (150ms); Escape still unmounts immediately | Instant |
| Tip | Same as window open (it is a WM window) | Instant |

Drag/resize still write to the DOM. No per-frame React rects. No Framer Motion.

### Keyboard / honest shell (unchanged)
Alt+R · Alt+Shift+C · Alt+Shift+F · Alt+Shift+arrows · Escape closes Start.
Ctrl+K is still not handled. Empty-route rows stay data. Caption close uses the same
exit tween as the keyboard close helper.

### Focus polish (existing language)
Dotted `:focus-visible` on Start, task chips, Read, desktop/mobile icons, caption
buttons. Start rows keep selection navy + a dotted inset. Not a new palette.

### Chrome / WM / content
Frozen recipes. Workspace `absolute inset-0` only inside the flex-1 region. Taskbar
`shrink-0` at the bottom. Phase 0 words, Now staleness, Timeline eras, Recycle copy,
registry shape, `appsLaunchableOn` unchanged.

---

## 2. OPEN QUESTIONS — still Saathvik’s

| # | Question | Phase 6 note |
|---|---|---|
| 1 | **Confirm reconstructed §10.2** (phases 6–18) | Most urgent. This phase followed it. |
| 2 | Confirm §5.2 ContentBlock names, §6.1 tiers, §8 budgets, §7.2 Reader discoverability, ORIGIN collision | Untouched; Phase 7 implements §8 if confirmed |
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

- Phase 6 = Motion & Polish with GSAP (**blueprint §10.2**, not the pasted ASSUMED freeze).
- Duration token **names** (`--kellos-duration-boot` etc.) are Phase 6 names for the
  design-system §10 numbers. If the original blueprint names them differently, rename —
  do not restyle the palette to “fix” it.
- Empty-route rows stay rows until Phase 8 (Search / Terminal / Settings) and Phase 14 / 15
  (OS Update / KELL.AI).
- Gallery is not a registry app (Phase 1).
- Authorship remains required on `Project`.

---

## 4. WHAT PHASE 7 NEEDS

- This handoff + frozen chrome + tokens (including the new **duration** tokens).
- Phase 3 WM (`useWmStore`, `specForPath`, `open(spec)`, `nudge` / `cycleTask`).
- Phase 5 recruiter path + honest shell. `python scripts/verify_phase6.py` against
  `vite preview` (set `KELLOS_PREVIEW` if 4173 is taken).
- Blueprint §8 budgets **if Saathvik confirms them**: TTFMC < 2.5s, drag 60fps with 3
  windows, initial JS < 200KB gzipped (this build’s main chunk gzip is ~127KB — headroom,
  not a Phase 6 claim that §8 is met), Lighthouse a11y ≥95 on Tier 1.
- Full keyboard operation / heading order in Reader and prerender is **Phase 7**, not a
  licence to restyle or replace Reader Mode.

---

## 5. WHAT PHASE 7 MUST NOT TOUCH

- Phase 0 copy (no quiet edits)
- Honesty stance / disclosure placement and weight
- Skill meters of any kind
- Promoting gallery → case study
- Visual fields on content blocks
- Tokens **palette** / a new colour system / Clippy / Shut Down hiring path / a 1996→2026
  second site / Three.js wallpaper
- Drafting `docs/content/case-studies/kellos.md`
- Replacing Reader Mode or deleting prerender “because the WM is the site”
- Rebuilding or replacing the WM; React/DOM/GSAP inside `src/wm/core.ts`
- Per-frame React state for drag/resize
- `position: absolute` on the **taskbar** (workspace inset-0 inside flex-1 only)
- Terminal, KELL.AI (no LLM in V1), Ctrl+K runtime, Mongo, admin, version-update ceremony
  (blueprint: Phase 8 / 14 / 15)
- Inventing graduation date, location, metrics, or unverified URLs
- Adding apps because empty registry rows still exist
- Adding GSAP decoration that a recruiter cannot skip; ignoring `prefers-reduced-motion`
- Adding features **in order to hit a Lighthouse number** (blueprint Phase 7 “must not”)

---

## 6. FILES PRODUCED (Phase 6)

```
src/motion/duration.ts
src/motion/duration.test.ts
src/motion/play.ts
scripts/verify_phase6.py
docs/handoffs/PHASE-6-HANDOFF.md
docs/handoffs/phase6-verify/*.png
```

Touched: `package.json` / lockfile (`gsap`), `src/styles/tokens.css` (duration tokens only),
`src/styles/chrome.css` (focus-visible), `BootOverlay.tsx`, `Taskbar.tsx`, `useOsKeyboard.ts`,
`ManagedWindow.tsx`.

Untouched on purpose: `src/wm/core.ts` logic (still pure), Phase 0 copy, BlockRenderer
variants, LangChain body, kellos.md, Terminal / KELL.AI / Ctrl+K runtimes.

---

## 7. VERIFICATION (evidence)

- `npx tsc -b` — exit 0
- `npm test` — **20/20** passed (`core.test.ts` 13 + `now.test.ts` 3 + `launchable.test.ts` 2
  + `duration.test.ts` 2)
- `npx vite build` — exit 0; prerendered routes still under `dist/` including `/now`,
  `/timeline`, `/read/about`, `/project/langchain-openrouter-provider`
- `python scripts/verify_phase6.py` — **phase6 verify ok**
  (`KELLOS_PREVIEW=http://127.0.0.1:4177`)
  - no-JS `/` disclosure; Now / Timeline / Recycle words unchanged
  - Skip visible at opacity 1 on first frame; `--kellos-duration-boot` present
  - desktop 90s path; honest Start; menubar Projects → LangChain; Alt+Shift nudge;
    Ctrl+K opens no palette; Alt+R strips the OS
  - visible focus on Start, Read, desktop icon, caption Close
  - `reduced_motion="reduce"`: Skip unmounts boot overlay within 200ms
  - short desktop 1280×560: icon column overflow, Recycle reachable
  - mobile 390×844: 4-column grid, no tip, stacked Projects (not `absolute`), case study
    still has the taskbar

Screenshots: `docs/handoffs/phase6-verify/*.png`

WM core has **no** React/DOM/GSAP imports (unit test reads the file).

---

## 8. ONE-PARAGRAPH SUMMARY FOR THE PHASE 7 CHAT

Phase 6 introduced GSAP under the reconstructed Master Blueprint’s assignment (Motion &
Polish), not the pasted “visitor-quality freeze without GSAP.” Boot Skip stays visible on
the first frame; the overlay only fades **out**, from `--kellos-duration-boot`. Windows,
Start, and the tip use short opacity tweens from duration tokens. `prefers-reduced-motion`
skips those tweens. The Phase 3 core is still pure. The Phase 5 recruiter path, honest
shell, keyboard chords, Reader Mode, prerender, and Phase 0 words are intact. Focus rings
use the existing dotted/selection language. Phase 7 is hardening against §8 budgets if
Saathvik confirms them — not Ctrl+K, Terminal, KELL.AI, or a restyle.
