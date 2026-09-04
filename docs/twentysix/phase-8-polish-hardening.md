# Phase 8 — Polish & Hardening

**Status:** ◻ Specified · **Depends on:** all · **Scope:** whole edition

## Goal

Turn a working build into a shippable one: consistent motion, performance budget, full
accessibility + responsive sweep, and the optional 96'↔26' wiring.

## Checklist

### Motion & feel
- [ ] Unify easing/durations across sections (all from `--t26-*` tokens).
- [ ] Tune Lenis feel; verify no scroll-jank with ScrollTrigger on long pages.
- [ ] Every animation confirmed to have a correct reduced-motion static end state.

### Performance
- [ ] Lazy-load below-the-fold sections + heavy libs (globe, aether) via dynamic import.
- [ ] Cap particle counts; pause off-screen canvases; `content-visibility` where safe.
- [ ] Images: responsive sizes, lazy, dimensions set (no CLS); grayscale via CSS not baked.
- [ ] Bundle check: 26' chunk separate from retro; measure and trim.
- [ ] Lighthouse: Perf ≥ 90 desktop, a11y ≥ 95.

### Accessibility
- [ ] Landmarks + heading order correct; dock is a labelled nav with keyboard support.
- [ ] Focus-visible everywhere; modal/sheet focus traps; `Esc` closes.
- [ ] Color contrast AA across the grayscale ramp.
- [ ] Prefers-reduced-motion fully honored; prefers-contrast respected.

### Responsive sweep
- [ ] 320 / 375 / 414 / 768 / 1024 / 1440 — no horizontal overflow; targets ≥ 44px.
- [ ] Dock safe-area on notched devices; landscape sanity.

### Resilience sweep (demonstrate each)
- [ ] Block `/api/github` and `/api/leetcode` → fallbacks.
- [ ] Remove portrait / resume → placeholders/disabled.
- [ ] Empty blog, bad slug → empty state / 404.
- [ ] Throttled network → skeletons, no layout break.

### Integration
- [ ] Prerender/SEO: add `/2026` (+ blog) to `src/prerender/pages.ts` + `src/seo/site.ts`;
      per-route `<title>`/meta; OG image.
- [ ] Optional: wire 96' **shutdown** (`PowerScreen`/`onPower`) into `transitionStore.start()`
      so shutdown also lands in 26' (currently only *Install update* does). **Confirm intent.**
- [ ] Optional: a way back to 96' from 26' (dock item or footer link).

### 96' polish (parked)
- [ ] Collect the deferred 96' polish items and address in a separate pass (kept out of the
      26' critical path).

## Acceptance criteria

Meets the edition-level criteria in [00-master-blueprint.md §8](00-master-blueprint.md#8-acceptance-criteria-for-the-edition):
complete scrollable portfolio, fast, accessible, responsive, resilient, reduced-motion-safe,
with terminal + blog reachable and the blog CMS-editable.
