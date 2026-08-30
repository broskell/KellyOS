# KELL.OS Design System — frozen Phase 1

**Status:** Frozen. Phase 2+ implements against this file and
[`handoffs/PHASE-1-HANDOFF.md`](handoffs/PHASE-1-HANDOFF.md). Do not take a fresh
inspiration dump. Chrome reference was RobbyOS / Win95–98; the product is not a clone.

**Implementation:** CSS custom properties in `src/styles/tokens.css`, recipes in
`src/styles/chrome.css` and `src/styles/blocks.css`, Tailwind `@theme inline` maps to
those tokens. Playground: `npm run dev` (Vite + React + TypeScript strict).

**Master Blueprint:** still missing. Every blueprint-dependent decision is marked
**ASSUMED** in the Phase 1 handoff.

---

## 1. Visual thesis

The OS is a **frame**. The argument is the writing.

- Chrome (desktop, window, Start, taskbar, menus, buttons, icons, boot): Win95–98
  skeuomorphism — teal field, gray 3D bevels, navy title bars, pixel marks.
- Body, case studies, Reader Mode: Source Serif 4 at a real reading size, ~65ch measure,
  1.62 line-height. Retro type does **not** set long-form copy.
- Metaphor depth **2–3**: real window chrome + desktop + Start + taskbar. Recycle Bin is
  the honest OS joke. No Clippy. No Sleep / Shut Down / vortex as the hiring path. No
  1996→2026 second website.
- Versions are feature flags over one dataset. New visitors always boot **latest**. Update
  ceremony is returning visitors only — do not design a first-run “time travel” gate.

---

## 2. Type

| Token | Family | Where |
|---|---|---|
| `--kellos-font-chrome` | W95FA (98.css MS Sans Serif recreation) → Tahoma | Window chrome, menus, icons, Start, taskbar, callout bars, empty-asset labels |
| `--kellos-font-body` | Source Serif 4 | `prose`, quotes, callout bodies, About Me, case studies |
| `--kellos-font-ui-sans` | Source Sans 3 | Headings inside documents, tables, résumé structure, skill group copy |
| `--kellos-font-mono` | IBM Plex Mono | `code` blocks only |

Chrome size is **11px**. Body is **18px** (17px under `--kellos-bp-os`). Lead emphasis is
**20px**. Headings: h2 28 / h3 22 / h4 18, Source Sans 3, never pixelated.

Do not anti-alias chrome if the bitmap face is in use; body must remain antialiased.

---

## 3. Color (canonical hex — only defined here)

| Token | Hex | Use |
|---|---|---|
| `--kellos-desktop` | `#008080` | Desktop field |
| `--kellos-desktop-dither` | `#007373` | 2×2 dither with desktop |
| `--kellos-face` | `#c0c0c0` | Window / taskbar / button face |
| `--kellos-bevel-light` | `#ffffff` | Top/left outer highlight |
| `--kellos-bevel-hi` | `#dfdfdf` | Inner highlight |
| `--kellos-bevel-shadow` | `#808080` | Inner shadow |
| `--kellos-bevel-dark` | `#000000` | Bottom/right outer |
| `--kellos-title-active-from` | `#000080` | Active title gradient start |
| `--kellos-title-active-to` | `#1084d0` | Active title gradient end |
| `--kellos-title-inactive` | `#808080` | Inactive title |
| `--kellos-window-paper` | `#ffffff` | Document well inside a window |
| `--kellos-ink` | `#000000` | Ink on paper and chrome |
| `--kellos-selection` | `#000080` | Selected menu / icon caption plate |
| `--kellos-disclosure` | `#000080` | Disclosure callout bar (same navy — not a skill rank) |
| `--kellos-disclosure-wash` | `#e8eef8` | Disclosure body |
| `--kellos-caution-face` | `#ffffcc` | Caution body (Win help yellow) |
| `--kellos-reader-bg` | `#f6f1e8` | Reader Mode page |
| `--kellos-reader-ink` | `#1a1916` | Reader Mode ink |
| `--kellos-code-bg` | `#1e1e28` | Code well |

**Forbidden:** mapping skill tiers to gold/silver/bronze, green/amber/red “proficiency,”
progress fills, star glyphs, or any meter. Semantic color is for **callout intent**
(disclosure / note / caution / limitation), never for ability.

Win95 `#00ff00` / `#ff0000` system colors are **not** used. They fail contrast and imply
success/failure on skills.

---

## 4. Elevation / bevel

Recipes (classes, not ad-hoc shadows):

- `.os-raised` — buttons, Start, task chips at rest, menus
- `.os-sunken` — document wells, group boxes, scroll viewports, tables, empty assets
- `.os-window` — outer frame (raised + 3px padding `--kellos-frame-pad`)
- Pressed: invert the raised border pair; do not translate the control more than 1px

There is no drop-shadow language beyond a 2px hard offset on floating desktop windows.
Mobile stacked sheets drop that offset.

---

## 5. Spacing, metrics, z-index

4px grid: `--kellos-space-1` … `--kellos-space-8` (2 / 4 / 8 / 12 / 16 / 24 / 32 / 48).

| Metric | Token | Value |
|---|---|---|
| Title bar | `--kellos-titlebar-h` | 22px |
| Caption buttons | `--kellos-ctrl-w/h` | 16×14 |
| Taskbar | `--kellos-taskbar-h` | 32px desktop / 48px (`--kellos-taskbar-h-touch`) below 48rem |
| Desktop icon glyph | `--kellos-icon` | 32px |
| Icon hit | `--kellos-icon-hit` | 76px |
| Touch minimum | `--kellos-touch` | 44px |
| Scrollbar | `--kellos-scrollbar` | 16px |
| OS breakpoint | `--kellos-bp-os` | 48rem |

Z (Phase 3 WM must use the same names):

`desktop/wallpaper 0` → `icons 10` → `window-base 100` → `start 8000` → `taskbar 9000` →
`boot 10000` → `skip 10010`. Playground nav is 11000 and **does not ship**.

---

## 6. Wordmark and marks (A5.1)

- **Wordmark:** pixel `KELL` in title navy + `.OS` in ink. Used on Start, boot, and Settings
  identity. Not a logotype for body headings.
- **Boot mark / favicon:** 32×32 raised window, navy title stub, paper well. Files:
  `public/favicon.svg`, `public/boot-mark.svg`. OG image is this mark on the teal dither at
  1200×630 — Phase 2 may rasterize; do not invent a second brand.
- No photographic logo. Do not commission a “K mascot.”

---

## 7. Chrome components

### Desktop
Teal + 2px dither. Icons in a **column top-left** on desktop. Below 48rem: **4-column
icon grid**, then **stacked windows** (full width, no overlapping WM). Not a tiny Win95
desktop.

### Window
Raised frame, gradient title (inactive = flat gray), optional menubar, sunken paper
well, optional status bar. Caption buttons are chrome only in Phase 1 (no WM behavior).

### Start + taskbar
Start uses the wordmark + the word “Start”. Menu lists registry apps (spec). **Reader Mode
is always on the taskbar tray** (“Read”) and in Start — first-class, not buried.

Task chip for the focused app is sunken + hatch. Clock is local format later; playground
is static.

### Menus
Hover/focus = selection navy + white text. Keyboard: visible dotted focus.

### Buttons
Raised, 23px min height, 44px on touch. Default type is chrome 11px bold.

### Scroll
16px 3D thumb. Document scroll lives **inside the well**, not on the desktop.

---

## 8. ContentBlock mapping

**No `className`, `color`, or `width` on block types.** Appearance is entirely this table.

| `type` | Surface |
|---|---|
| `heading` | Source Sans 3; `level` 2/3/4; `id={anchor}` |
| `prose` | Source Serif 4. `emphasis: lead` → 20px. Inline markdown: bold, code, links only |
| `list` | Body list, 1.2em indent |
| `code` | Raised chrome filename bar + dark well. `highlightLines` = `--kellos-highlight-line` on those 1-indexed rows. Never reformat `code` |
| `quote` | 3px navy left rule, italic body, UI-sans attribution |
| `callout` / `disclosure` | Navy bar + wash body. **Full visual weight.** Do not make this a footnote |
| `callout` / `note` | Navy bar, paper body |
| `callout` / `caution` | Chrome bar, yellow body |
| `callout` / `limitation` | Chrome bar, paper body, same type size as disclosure |
| `image` | If asset missing: sunken well, chrome label “Image not captured yet” + required `alt` |
| `gallery` | Auto-fill min 140px; each missing asset is its own well |
| `diagram` | Same empty well; show `altDescription` (required) |
| `keyValue` | Sunken table, key column 38%, key cells `--kellos-bevel-hi` |
| `comparison` | Sunken table, header row hi-gray |
| `metrics` | If `metrics.length === 0`: written empty (“No verified metrics yet…”). **Never a number grid of placeholders** |
| `linkGroup` | Raised chrome buttons; unverified links may render in playground but **must not publish** (content-model) |
| `embed` | 16:9 sunken well with title; no third-party load until an embed exists |
| `divider` | Dual-line bevel rule |

`ImageBlock.size` (`inline` / `full` / `bleed`) is layout intent: inline = constrained to
measure; full = well width; bleed = well width flush (OS) or page width (Reader). Bleed
never escapes Reader’s max measure in a way that breaks line length; in OS it may meet
the well edge.

---

## 9. Surface specs

### Reader Mode — Tier 1 importance (Phase 1 decision)
Strips desktop, windows, Start, taskbar. Cream page, max ~42rem, same `BlockRenderer`.
Persistent “Read” control. Deep link `/read/:app` and `/read/project/:slug` (Phase 2
routing). Must be in the static fallback layer. This is the escape valve for the OS bet.

### Deep links
`/project/:slug` (and equivalent) opens Case Study Reader **with OS around it**. Recruiter
from a CV does not have to learn the WM first. Playground demonstrates the window titled
with the slug.

### First-run
About Me is **already open**. On desktop, a small “Getting around” window is skippable and
sits to the **right** of About Me so it does not cover the disclosure. On mobile the extra
window is **omitted** — About Me is the sheet, Reader Mode is on the taskbar (`Read`). No
mascot. Boot is skippable with Skip visible on the first frame.

### Boot
Wordmark + boot mark + “Starting KELL.OS 3.0…” + Skip. New visitors: latest only. Do not
prompt “Update to 2026.”

### Projects with one case study
Not a 2×2 case-study card grid. **One featured case-study row** in a group box, then
**“Also shipped”** compact rows for gallery. Gallery is a **view inside Projects**, not its
own app (**ASSUMED** vs missing blueprint).

### Mobile
Icon grid + stacked sheets + 48px taskbar. Tier 1 apps must work. Do not scale the desktop
down.

### Skills
Three **group boxes** titled with the evidence-type sentences from Phase 0. Same face
gray for all tiers — differentiation is **label copy + evidence**, not color rank. Tier 3
(34 items) renders behind `<details>` closed by default. **Do not cut the list in design.**
Cut vs keep ~15 is still Saathvik’s content call.

### Now staleness
When `updatedAt` exceeds `stalenessThresholdDays`, the date must **look** stale (caution
callout treatment on the date), not a green “live” badge.

---

## 10. Motion (CSS only in V1; GSAP later)

Boot fade ≤ 400ms, skippable, `prefers-reduced-motion: reduce` → instant. No WM animation
in Phase 1. Phase 3 may use GSAP; it must read duration from tokens if added later. Do not
introduce Framer Motion.

---

## 11. Font files

`public/fonts/ms_sans_serif.woff` and `ms_sans_serif_bold.woff` from [98.css](https://github.com/jdan/98.css)
(MIT CSS; bitmap face bundled there). Body fonts load from Google Fonts.

---

## 12. What this playground is not

Not a window manager, not an App Registry runtime, not apps, not a backend. Caption
buttons do not manage windows. Start does not persist state. Phase 2 may scaffold routing
and the static fallback; it must not restyle tokens or invent new chrome colors.
