# Kelly.OS — 2026 Edition ("26'") Documentation

This folder documents the **2026 edition**: the monochrome, minimalist, smooth-scroll
portfolio that the existing 96'→26' transition lands on at route `/2026`. The retro 1996
desktop OS (documented in [../MASTER-BLUEPRINT.md](../MASTER-BLUEPRINT.md)) is complete and
out of scope; these docs cover only the new era.

> **Status:** Phase 0 (foundation) is built. Phases 1–8 are specified here and not yet built.
> Building was paused to author this documentation set first.

## How to read these docs

- Start with **[00-master-blueprint.md](00-master-blueprint.md)** — the vision, principles,
  architecture, and cross-cutting rules (mobile, resilience, motion).
- **[design-system.md](design-system.md)** — the grayscale system, type scale, spacing,
  motion tokens, and component primitives. Every phase depends on it.
- Then the **phase docs** in order. Each is self-contained and follows the same template:
  goal → reference images → blueprint (wireframe) → data contract → motion → mobile →
  fallbacks → files → integration slots → acceptance criteria.
- **[references/](references/README.md)** — the inspiration images and how each maps to a phase.
- **[blueprints/](blueprints/)** — authored SVG wireframes embedded by the phase docs.

## Phase map

| Phase | Doc | Builds | Depends on |
|-------|-----|--------|-----------|
| 0 | [phase-0-foundation.md](phase-0-foundation.md) | Design system, motion, primitives, routing | — |
| 1 | [phase-1-hero-dock.md](phase-1-hero-dock.md) | Hero (portrait, socials, resume) + macOS dock | P0 |
| 2 | [phase-2-about-timeline.md](phase-2-about-timeline.md) | About (rotated cards) + GSAP timeline | P0 |
| 3 | [phase-3-projects.md](phase-3-projects.md) | Projects (expanding slats + modal) | P0 |
| 4 | [phase-4-techstack-graphs.md](phase-4-techstack-graphs.md) | Tech globe + skill bars + GitHub/LeetCode graphs | P0, API |
| 5 | [phase-5-cms-blog.md](phase-5-cms-blog.md) | CMS blog (extend admin/ + server/) + blog pages | P0 |
| 6 | [phase-6-terminal.md](phase-6-terminal.md) | Terminal page (nav + easter eggs) | P0 |
| 7 | [phase-7-fx-contact-footer.md](phase-7-fx-contact-footer.md) | FX set + contact + footer | P0–P6 |
| 8 | [phase-8-polish-hardening.md](phase-8-polish-hardening.md) | Perf, a11y, responsive sweep, hardening | all |

## Section order (final)

Landing → About → **Projects** → Tech stack → Timeline → Contact → Footer.
Terminal and Blog are separate routes opened from the dock.

## Source of truth

The build plan this expands on lives at
`~/.claude/plans/we-are-done-with-shimmering-hare.md`. Where they differ, **these docs win**
(they are the maintained version).
