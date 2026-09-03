# Phase 15 Handoff — Kelly.AI + retro-desktop pass + rename

**Phase:** 15 — **Kelly.AI** (deterministic intent matching over registry + content index, **no LLM**, §3.8). Plus an owner-directed **product rename KELL.OS → Kelly.OS** and a **"feel like an old desktop" polish pass** (richer boot, screensaver, desktop tips, update tray + toast). **Not** V2 launch (Phase 16). **Not** V3 look (Phase 17). **Not** `kellos.md` (Phase 18).
**Completed:** 3 September 2026
**Next:** Phase 16 — V2.0 launch & hardening (migration, monitoring, rollback; no new features). **Do not start Phase 16 in this chat.**

---

## Owner directives taken mid-phase (this is a scope change, recorded)

Saathvik, reviewing against the **RobbyOS '96** reference, asked to (a) bring in RobbyOS's desktop theatre — "everything in the options … it should feel like an old desktop exactly" — and (b) **rename KELL.OS → Kelly.OS**. He left the Clippy-mascot decision to me.

**Mascot: declined, deliberately.** The honesty stance is the product's spine and the shipped copy states "No mascot." RobbyOS is a *marketing/creative* portfolio where maximal nostalgia is the pitch; Kelly.OS is an *engineering* portfolio whose pitch is restraint and verifiable claims. So Kelly.AI stays a clean, sourced assistant with **no character**, and the "old desktop" feel comes from boot/tips/screensaver/update theatre instead. This is a judgment call, reversible if Saathvik wants the mascot.

**Blueprint note:** §3.8 (no LLM in Kelly.AI) and §10.2 (Phase 15 = Kelly.AI) are honored. The rename and the atmosphere features are **owner-authorized deviations** from the frozen Phase 1 design system — flagged here, not silently merged. The wordmark changed from hand-pixel `KELL.OS` glyphs to two-tone text in the existing `W95FA` pixel font (`--kellos-font-wordmark`), which is trivially renamable and still period-correct.

---

## 1. Kelly.AI (Phase 15 proper)

- `src/apps/kellai/intents.ts` — **pure, testable** deterministic engine. `answerFor(query)` returns a typed `KellAnswer` (`content` | `nav` | `help` | `fallback`). It matches an "open X" verb → registry navigation (`resolveOpenQuery`), else scores a **content index** of honest Phase-0 summaries (each names its source surface and links to the real app + Reader), else tries a bare app name, else a **fallback that refuses to fabricate** ("I can't answer that … and I won't make something up"). No LLM, no invented facts.
- `src/apps/KellAiWindow.tsx` — the window: transcript + input + suggestion chips; answers render Open/Read buttons that launch via the WM.
- Registry: `kellai` row now has `route: /kell-ai`, `kind: app`, surfaces `search + terminalOpen`. Given a loader, `App.tsx` route, `knownDesktopPath`, and a `vercel.json` rewrite — the same disciplined way Phase 14 wired OS Update. Kept **off** Start/desktop/mobile (Tier 3), reachable via Ctrl+K and `open kell-ai`.
- Verified in-browser: "projects" → sourced LangChain answer + case-study link; "open resume" → nav; "who are you" → honest no-LLM reply; a nonsense query → fallback with no fabrication.

## 2. Rename KELL.OS → Kelly.OS (and KELL.AI → Kelly.AI)

- Global replace of the visible strings across `src/**`, `index.html`, `public/og.svg`, and test assertions (including an escaped `/KELL\.OS/` regex). **Internal identifiers unchanged on purpose** — package name `kellos`, CSS vars `--kellos-*`, storage keys `kellos-*`, `data-os-*` attributes, registry ids/slugs (`kellai`, `kell-ai`) — so nothing broke and no visitor state reset.
- `src/brand/marks.tsx` `Wordmark` rewritten to text ("Kelly" in title-blue + ".OS" in ink) in the pixel font. `BootMark` aria-label updated.

## 3. Retro-desktop pass (the four elements)

- **Richer boot** — `BootOverlay` now has a tagline, a segmented **progress bar** (GSAP `playBootProgress`, token `--kellos-duration-boot-progress`) and **auto-advances** when it fills; still Skippable on the first frame; reduced motion fills instantly and dismisses.
- **Screensaver** — `src/shell/Screensaver.tsx`: 60s idle → a canvas "Mystify" neon-polyline bounce (pink/blue/green) with "Move the mouse or press a key to wake…"; wakes on any pointer/key/wheel. Reduced motion paints one still frame. Pure Tier-3; never blocks a working visitor. Verified live (temporarily shortened the idle to confirm activation + wake, then restored 60s).
- **"Did you know?" tips** — `src/shell/DesktopTips.tsx`: a dismissable top-right toast rotating **true** statements/pointers (evidence-graded skills, Recycle Bin, Ctrl+K, Alt+R, versions, the AI-assisted disclosure, the LangChain PR). No invented facts. Shows on the desktop home after the first-run tip; dismiss sticks for the session.
- **Update tray + toast** — refines the Phase 14 ceremony into a **toast-first** flow: a returning-updated visitor now gets a bottom-right `UpdateToast` ("A newer version … Install update ↻") instead of an immediate full-screen overlay; "Install update" plays the ceremony, dismiss acknowledges (marks latest seen). A persistent Taskbar tray chip shows "◇ 3.0" (opens OS Update) and flips to "● Update" when an update is pending. `VersionContext` gained `pendingUpdate` / `installUpdate` / `acknowledgeUpdate`; it no longer auto-opens the ceremony.

---

## Failures & wrong assumptions (recorded as they happened)

1. **Reference collision.** RobbyOS was Phase 1's *chrome* reference ("reference, not clone"). The owner now wants its *features*. Adopted the features in the Kelly.OS design system; declined the one element (Clippy) that reverses a locked honesty decision. Recorded as an owner-authorized deviation rather than a silent design drift.
2. **Controlled input under automation.** Programmatic `form_input` set the DOM value without firing React's onChange, so submit saw an empty draft. Typing via the keyboard worked. (Test/verification detail, not a product bug.)
3. **Screensaver re-sleep during verification.** With the idle temporarily at 2.5s, waking it just re-slept within 2.5s — expected; the real timer is 60s.
4. **Rename must skip internals.** Blindly replacing "kellos" everywhere would have reset visitor storage and broken CSS tokens. Only the uppercase, dotted, visible `KELL.OS`/`KELL.AI` were changed.

---

## What Phase 16 needs (V2.0 launch & hardening)

- Migration/monitoring/rollback for the V2 backend (Fastify + Mongo + admin + publish already exist from Phases 11–13). **No new features.**
- The visitor read path is still static; the editing API/admin must never run on the Vercel static project; do not add DB/Fastify to the visitor read path.
- If a real emit is produced, `bundle.versions` overlays `src/content/versions.ts` (the zero-backend floor) automatically via `live.ts`.

## What Phase 16 must NOT touch

- `src/wm/core.ts` (still no React/DOM/GSAP).
- The honesty stance / no-mascot decision (unless Saathvik reverses it explicitly).
- Version filtering outside `VersionContext` / `versionState` / `versionFlags`.
- Reader Mode / nested prerender winning over SPA fallback.
- Inventing metrics, dates, a gallery cut, or `verified: true`.
- `kellos.md` (Phase 18). Pushing to the RolePlay-Chatbot remote.

---

## Files produced (Phase 15)

```
src/apps/kellai/intents.ts
src/apps/kellai/intents.test.ts
src/apps/KellAiWindow.tsx
src/shell/Screensaver.tsx
src/shell/DesktopTips.tsx
src/shell/UpdateToast.tsx
docs/handoffs/PHASE-15-HANDOFF.md
```

Touched: `src/brand/marks.tsx` (text wordmark), `src/shell/BootOverlay.tsx` (progress + tagline + auto-advance), `src/motion/play.ts` (`playBootProgress`), `src/styles/tokens.css` (progress-duration token), `src/shell/VersionContext.tsx` (pendingUpdate/install/acknowledge, toast-first), `src/shell/DesktopShell.tsx` (mount tips/toast/screensaver), `src/shell/Taskbar.tsx` (version/update tray chip), registry (`manifest.ts`, `loadWindow.tsx`), `src/App.tsx`, `src/wm/specs.ts`, `vercel.json`, `index.html`, `public/og.svg`, and the global KELL.OS→Kelly.OS rename across `src/**` (+ `launchable.test.ts` / `resolve.test.ts` updated for Kelly.AI now being launchable).

Untouched on purpose: `src/wm/core.ts` logic; Phase 0 content *words* (only the product name changed, per owner); the publish/emit pipeline; token palette values; `CONTEXT.md`; `kellos.md`.

---

## Verification (evidence)

- `npx tsc -b` — 0 · `npx tsc -p server/tsconfig.json` — 0 · `npx tsc -p admin/tsconfig.json` — 0
- `npm test` — **80/80** (prior 73 + 6 Kelly.AI intents + 1 registry resolve; registry counts re-pointed for Kelly.AI launchable)
- `npx vite build` — 0; 19 prerender pages (Kelly.AI + OS Update correctly not prerendered); visitor JS has no `mongodb` / `MONGODB_URI` / `/v1/emit`; `KellAiWindow` code-split (~3.5 KB gzip); `DesktopShell` chunk ~42 KB gzip
- Browser (dev): rename shows everywhere (Start button, titles, status bars); Kelly.AI routes/sources/falls-back correctly; "Did you know?" toast appears after the first-run tip; screensaver activates on idle and animates; tray shows "◇ 3.0"
- `src/wm/core.ts` — no React/DOM/GSAP imports

---

## One-paragraph summary for the Phase 16 chat

Phase 15 shipped Kelly.AI — a pure, tested deterministic engine (`answerFor`) that matches questions to a content index and the app registry, always naming its source and refusing to fabricate; no LLM. Its `kellai` row got a real runtime (`/kell-ai`) the same disciplined way OS Update did. On the owner's direction the product was renamed **KELL.OS → Kelly.OS** (visible strings + a text wordmark; internal ids/storage/tokens left intact) and given a "real old desktop" polish pass: a progress-bar boot that auto-advances, an idle Mystify screensaver, rotating honest "Did you know?" tips, and a toast-first update flow with a Taskbar update chip (refining the Phase 14 ceremony). The Clippy mascot was deliberately declined to protect the honesty stance. `src/wm/core.ts` stays pure; Reader/prerender untouched; no backend on the read path. Phase 16 is V2.0 launch & hardening — migration, monitoring, rollback, no new features.
