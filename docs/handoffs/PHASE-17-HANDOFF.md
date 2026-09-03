# Phase 17 Handoff — V3.0 look & version-driven era themes

**Phase:** 17 — Third-era look as **data-driven feature flags**, no fork, no second site. The
version look changes with the era at content load. **Not** a token-palette rewrite of V3
(the frozen Phase 1 palette stays the current/newest look). **Not** V2 launch (Phase 16).
**Completed:** 3 September 2026
**Next:** Phase 18 — the Kelly.OS case study (done, see PHASE-18-HANDOFF.md).

---

## What shipped

Each OS era now has a distinct **look**, retinted at content load through the same version
switcher built in Phase 14 — one data set, one build, filtered by version:

- `src/styles/tokens.css` — appended `[data-os-era="v1"]` and `[data-os-era="v2"]` blocks
  that override desktop wallpaper + titlebar-accent tokens. **v3 (current/newest) keeps the
  frozen Phase 1 palette** and needs no override — new visitors always see it.
  - v1 "ORIGIN" → austere **grey** desktop + grey titlebars ("money earned, nothing built").
  - v2 → deep **indigo/blue** desktop ("the volume era").
  - v3 → the current **teal + blue**.
- `src/shell/DesktopShell.tsx` — sets `data-os-era={viewing}` on the `.os-desktop` root from
  `useVersion().viewing`. Because tokens cascade, the whole shell (desktop, titlebars, the
  text wordmark's accent) retints from one attribute. Filtering/look selection happens at the
  single content-load site — components never branch on version.
- `src/apps/OsUpdateWindow.tsx` — copy now says switching "retints the desktop and shows only
  that era."

Reader Mode and the static prerender have no `data-os-era` attribute, so they always render
the current (v3) look — correct for crawlers and the recruiter path.

## Failures / notes

- The retint deliberately reuses the **existing** design tokens rather than introducing a new
  palette, so it can't drift from the frozen system — it only remaps a few colour tokens per
  era. This keeps "no fork" literally true.
- Verified in-browser: OS Update → view 1.0 turns the desktop grey, 2.0 indigo, 3.0 teal;
  status line and wordmark accent follow.

## Must not touch (Phase 18 / later)

`src/wm/core.ts` purity · Phase 0 content words · the honesty stance · version checks outside
`VersionContext`/`versionState`/`versionFlags` · Reader/prerender always-latest look · DB on
the read path · inventing metrics.

## Files

Touched: `src/styles/tokens.css` (era overrides), `src/shell/DesktopShell.tsx`
(`data-os-era`), `src/apps/OsUpdateWindow.tsx` (copy). tsc clean; 80/80 tests; build +
prerender clean.
