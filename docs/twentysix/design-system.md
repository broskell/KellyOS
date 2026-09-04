# 26' Edition — Design System

The single source of visual truth for the 2026 edition. Implemented in
`src/twentysix/styles/tokens26.css`, scoped under `[data-era26]` / `.t26-root`. Every 26'
component consumes these tokens — **no ad-hoc hex** in components.

---

## 1. Color — a grayscale system

"Black & white" here means a **ramp**, not two values. Depth comes from adjacent greys,
hairlines, and type weight — never from color.

| Token | Value | Role |
|-------|-------|------|
| `--c-bg` | `#070707` | Page canvas |
| `--c-bg-2` | `#0d0d0d` | Alt / raised sections |
| `--c-surface` | `#121212` | Cards |
| `--c-surface-2` | `#171717` | Nested / hover surface |
| `--c-surface-3` | `#1e1e1e` | Deepest surface |
| `--c-line` | `#242424` | Hairline border |
| `--c-line-2` | `#333333` | Stronger border |
| `--c-muted-2` | `#6b6b6b` | Dimmest text (captions) |
| `--c-muted` | `#8a8a8a` | Secondary text |
| `--c-text-2` | `#b4b4b4` | Body-dim |
| `--c-text` | `#d6d6d6` | Body |
| `--c-ink` | `#f2f2f2` | Headings / high-contrast |
| `--c-ink-pure` | `#ffffff` | Reserved max contrast |

Plus scrims/glass for the dock and modals (`--c-scrim`, `--c-glass`, `--c-glass-line`).

**Rules**
- Text on `--c-bg` uses `--c-text`/`--c-ink`; captions use `--c-muted`. Meets WCAG AA.
- Borders are hairlines (`--c-line`), not heavy boxes.
- Photos are grayscale by default (see §4). Color in a reference image is **not** a licence
  to introduce color.

---

## 2. Typography

Three families, already loaded in `index.html`:

| Token | Family | Use |
|-------|--------|-----|
| `--f-display` | Source Serif 4 | Display, headings — editorial voice |
| `--f-ui` | Source Sans 3 | Body, UI, buttons |
| `--f-mono` | IBM Plex Mono | Eyebrows, captions, terminal, numerals |

**Fluid modular scale** (clamp-based):

| Token | Range | Use |
|-------|-------|-----|
| `--fs-display` | 3rem → 8.5rem | Hero |
| `--fs-h1` | 2.25 → 4.5rem | Section titles |
| `--fs-h2` | 1.6 → 2.75rem | Sub-sections |
| `--fs-h3` | 1.25 → 1.75rem | Card titles |
| `--fs-lead` | 1.05 → 1.375rem | Lead paragraphs |
| `--fs-body` | 0.975 → 1.06rem | Body |
| `--fs-caption` | 0.8125rem | Captions |
| `--fs-mono` | 0.75rem | Eyebrows/labels |

Leading: `--lh-tight 1.02` (display), `--lh-snug 1.15` (headings), `--lh-body 1.6`.
Tracking: `--tracking-caps 0.18em` for mono eyebrows.

Helper classes: `.t26-display`, `.t26-h1`, `.t26-h2`, `.t26-lead`, `.t26-eyebrow`,
`.t26-caption`, `.t26-muted`.

---

## 3. Space, layout & radii

- 8px scale: `--sp-1`(4px) … `--sp-40`(160px).
- Containers: `--container 1200px`, `--container-wide 1440px`; `--gutter clamp(1.25rem, 5vw, 4rem)`.
- Section rhythm: `.t26-section` = `clamp(4rem,10vw,9rem)` vertical padding + gutter.
- Radii: `--r-sm 6`, `--r-md 12`, `--r-lg 20`, `--r-pill 999`.
- **Composition:** favor intentional asymmetry — offset columns, overhang, rotation — over
  centered symmetry. Hairline dividers (`.t26-hairline`) separate, boxes don't.

Layout primitives: `.t26-section`, `.t26-container`, `.t26-container-wide`, `.t26-card`.

---

## 4. Image treatment

- `.t26-img` — `grayscale(1) contrast(1.02)` by default.
- `.t26-img--recover` — eases toward near-color on hover.
- `ImageWithFallback` primitive enforces sizing, lazy-load, and a monochrome initials
  placeholder on missing/broken src, so layout never collapses.

---

## 5. Motion

Tokens (GSAP reads via `durationSeconds`):

| Token | Value | Use |
|-------|-------|-----|
| `--t26-dur-fast` | 0.28s | Hovers, small state |
| `--t26-dur` | 0.6s | Reveals |
| `--t26-dur-slow` | 1.05s | Hero / large moves |
| `--t26-stagger` | 0.08s | Stagger step |
| `--t26-ease` | `cubic-bezier(0.22,1,0.36,1)` | Standard ease |

- **Smooth scroll:** one Lenis instance (`motion/scroll.ts`), bound to GSAP ticker +
  `ScrollTrigger.update`; off under reduced motion, native on touch. `smoothScrollTo()` for
  dock/terminal jumps.
- **Reveals:** `.t26-reveal` starts `opacity:0`; `revealOnScroll` / `revealStagger`
  (`motion/reveal.ts`) bring elements in once, direction-aware.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` forces reveals visible,
  disables shimmer, and every helper early-returns to the end state.

---

## 6. Components (primitives)

| Primitive | File | Purpose |
|-----------|------|---------|
| `Section` | `components/primitives/Section.tsx` | Landmark + container + rhythm |
| `Reveal` | `components/primitives/Reveal.tsx` | Scroll-reveal wrapper |
| `Skeleton` | `components/primitives/Skeleton.tsx` | Monochrome shimmer placeholder |
| `ImageWithFallback` | `components/primitives/ImageWithFallback.tsx` | Safe image + initials fallback |

Shared classes: `.t26-btn` (+ `--solid`), `.t26-card`, `.t26-hairline`, `.t26-skeleton`.

---

## 7. Do / Don't

| Do | Don't |
|----|-------|
| Carry hierarchy with type size/weight + space | Add color to create emphasis |
| Use hairlines and grey steps for separation | Use heavy borders or drop shadows |
| Grayscale photos, subtle hover recovery | Full-color imagery |
| One Lenis instance, token-timed motion | Ad-hoc durations or a second scroll lib |
| Design the mobile layout alongside desktop | Ship desktop-only and fix mobile later |
| Reference images for composition/motion | Copy their palettes |
