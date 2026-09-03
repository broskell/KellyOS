# Phase 14 Handoff — Version system & update ceremony

**Phase:** 14 — Versions as feature flags **at content load**; returning-visitor **update ceremony**; new visitors boot latest. Gives the empty `osUpdate` registry row a runtime. **Not** KELL.AI (Phase 15). **Not** a backend/publish change. **Not** a restyle. **Not** `kellos.md` (Phase 18).
**Completed:** 3 September 2026
**Next:** Phase 15 — KELL.AI (deterministic intent matching over the registry + content index, **no LLM**). **Do not start Phase 15 in the Phase 14 chat.**

---

## Blueprint authority

`docs/MASTER-BLUEPRINT.md` (v1.0-reconstructed) still wins; no original 15-August blueprint appeared. §10.2 assigns Phase 14 = "Version System & Update Ceremony." §3.7 (versions are feature flags over one data set, never separate builds; new visitors boot newest; ceremony for returning visitors only) and §4.2 (filtering at content load, never in components) were followed. `docs/version-narrative.md` is the source for the three eras.

---

## What shipped

The version system runs entirely at **content load**, through one provider. Window components never ask "which version are we in?" — they read already-filtered data and labels.

1. **Visitor-side version data** — `src/content/versions.ts`. The three `OSVersion` records hand-authored from `version-narrative.md` (same text as the server seed). `features: []` on purpose — no invented flag table. When an emitted `ContentBundle` exists, `bundle.versions` still wins (live.ts overlay path unchanged).
2. **Version state (pure)** — `src/content/versionState.ts`. `classifyVisit(seen, latest)` → `new` | `returning-current` | `returning-updated`. Guarded localStorage (`kellos-seen-version`, cross-visit) + sessionStorage (`kellos-viewing-version`, session-scoped exploration). `visibleUpTo` gives cumulative era visibility (2.0 knows eras 1–2, not 3).
3. **VersionContext** — `src/shell/VersionContext.tsx`. The single filtering site. On mount it classifies the visit once: a new/already-current visitor is immediately marked `seen = latest` (no ceremony); a `returning-updated` visitor gets a ceremony that writes `seen = latest` only when dismissed. Exposes `viewing`, `viewingLabel`, `setViewing`, already-filtered `timelineEntries`, and `ceremony` / `replayCeremony` / `dismissCeremony`. Rendered **outside** the shell (prerender/Reader), `useVersion()` returns a latest/full fallback.
4. **Update ceremony** — `src/shell/UpdateCeremony.tsx`, mounted in `DesktopShell`. Returning-visitor overlay ("KELL.OS updated while you were away", `from → to`, lists only the eras added in between). Skippable on first frame, Escape closes, GSAP fade via new `playCeremonyIn/Out`, reduced-motion resolves instantly. Shown only when `ceremony && !boot`; inert-locks the shell behind it.
5. **OS Update app** — `src/apps/OsUpdateWindow.tsx`. Registry row `osUpdate` now has `route: /os-update`, `kind: app`, surfaces `search + terminalOpen + osUpdate`. Shows current version, a **version switcher** (re-filters at load), release history (all three eras), and **Replay `prev → latest`** (demonstrates the real last transition without faking a version jump).
6. **Timeline is version-filtered** — `TimelineWindow` reads `timelineEntries` from context and builds blocks via new `timelineBlocksFor(entries)`. `timeline.ts` now skips an era with **no visible entries**, so viewing 1.0 shows only the 1.0 era (a true time machine). Prerender/Reader use the full list unchanged (all eras present → identical output).

Wiring: `manifest.ts`, `loadWindow.tsx`, `App.tsx` (`/os-update` route), `wm/specs.ts` (`knownDesktopPath`), `vercel.json` (`/os-update` rewrite), `BootOverlay` + `SettingsWindow` now point at the single version source / OS Update.

---

## Failures & wrong assumptions (recorded as they happened)

1. **The ceremony cannot fire naturally today.** New visitors always boot latest and we ship at v3 = latest, so a returning visitor is already current — the honest consequence of "no 4.0 is claimed." Rather than fake a version bump, the machinery is real + unit-tested, and the **Replay** button in OS Update makes it demonstrable using the genuine 2.0→3.0 transition. Verified in-browser by seeding `seen = v2` and reloading: the real "updated while you were away" ceremony fires and writes `seen = v3` on dismiss.
2. **SPA no-op vs. real reload.** The provider reads storage only at mount. Navigating to the same URL is an SPA no-op that does not remount it, so a storage change needs a full reload to take effect. This is correct (storage is a load-time input), but worth knowing when testing.
3. **Empty era shells.** First cut filtered timeline *entries* but still rendered later-era headings + their "honest reading" callouts as empty shells. Fixed by skipping zero-entry eras in the block builder — display logic only, no Phase 0 words changed.
4. **V1 has no emitted bundle**, so version data is hand-authored on the visitor side. When Phase 13's publish path emits `bundle.versions`, that overlay already wins in `live.ts`; `versions.ts` is the zero-backend floor, mirroring the seed.

---

## What Phase 15 needs (KELL.AI)

- Deterministic intent matching over the **registry** (`resolveOpenQuery` / `searchRegistry` already exist) and a content index. **No LLM** (§3.8). It must not invent answers it cannot source.
- KELL.AI is registry id `kellai`, still `route: ""` / no loader — Phase 15 gives it a runtime the same way Phase 14 gave OS Update one (real route, `kind: app`, a loader, add to `knownDesktopPath` + `App.tsx` + `vercel.json`, keep it off Start/desktop/mobile unless the blueprint says otherwise).
- The version switcher/ceremony belong to Phase 14 and are done; KELL.AI can *link to* apps but must not re-implement version logic.

## What Phase 15 must NOT touch

- The window manager core (`src/wm/core.ts` — still no React/DOM/GSAP).
- Version filtering outside `VersionContext` / `versionState` / `versionFlags` (no `if (version === …)` scattered in components).
- Phase 0 copy, the honesty stance, skill meters, gallery→case-study promotion, visual fields on blocks, token palette.
- Reader Mode / nested prerender (must keep winning over SPA fallback).
- Inventing metrics, dates, a gallery cut, or `verified: true`.
- Adding DB/Fastify calls to the visitor read path; running the editing API/admin on the Vercel static project; pushing KellOS to the RolePlay-Chatbot remote.

---

## Files produced (Phase 14)

```
src/content/versions.ts
src/content/versionState.ts
src/content/versionState.test.ts
src/shell/VersionContext.tsx
src/shell/UpdateCeremony.tsx
src/apps/OsUpdateWindow.tsx
docs/handoffs/PHASE-14-HANDOFF.md
```

Touched: `src/content/live.ts` (`timelineBlocksFor`), `src/content/timeline.ts` (skip empty eras), `src/motion/play.ts` (`playCeremonyIn/Out`), `src/registry/manifest.ts` (osUpdate route/kind/surfaces), `src/registry/loadWindow.tsx` (osUpdate loader), `src/registry/launchable.test.ts` + `src/registry/resolve.test.ts` (OS Update now launchable via Search/Terminal, still off Start/desktop/mobile), `src/App.tsx`, `src/wm/specs.ts`, `src/shell/DesktopShell.tsx` (VersionProvider + ceremony mount), `src/shell/BootOverlay.tsx` (version from single source), `src/apps/TimelineWindow.tsx`, `src/apps/SettingsWindow.tsx`, `vercel.json`.

Untouched on purpose: `src/wm/core.ts`; Phase 0 content words; the publish/emit pipeline; token palette; `CONTEXT.md`; KELL.AI runtime; `kellos.md`.

---

## Verification (evidence)

- `npx tsc -b` — exit 0
- `npx tsc -p server/tsconfig.json` — exit 0
- `npx tsc -p admin/tsconfig.json` — exit 0
- `npm test` — **73/73** passed (prior 66 + classifyVisit/visibleUpTo/version-data 4 + registry updates re-pointed 3)
- `npx vite build` — exit 0; nested prerender intact (`dist/timeline`, `dist/read/timeline`, `dist/project/langchain-openrouter-provider` present); `/os-update` correctly **not** prerendered (Tier 3, no reader route); visitor JS contains no `mongodb` / `MONGODB_URI` / `/v1/emit`; `OsUpdateWindow` lazily code-split (~1.0 KB gzip)
- Browser (dev): OS Update opens; switching to 1.0 filters the Timeline to only the 1.0 era; **Replay 2.0→3.0** shows the ceremony; a seeded returning visitor (`seen=v2`) sees the real "updated while you were away" ceremony and `seen` becomes `v3` on "Continue to 3.0"; a cleared visitor boots latest with no ceremony
- `src/wm/core.ts` has no React/DOM/GSAP imports

---

## One-paragraph summary for the Phase 15 chat

Phase 14 built the version system as feature-flags-at-load: `versions.ts` (three eras, zero-backend floor mirroring the seed), `versionState.ts` (pure classify + guarded storage), and one `VersionContext` provider that filters content once and hands apps already-filtered data — components never branch on version. New visitors boot latest and are marked seen; returning-updated visitors get a skippable, reduced-motion-aware update ceremony that marks seen only on dismiss. The empty `osUpdate` row now has a real runtime (`/os-update`) with a version switcher (time-machines the Timeline via `versionEra`, cumulative) and a Replay of the real last transition. Reader Mode and nested prerender are untouched (always latest/full). Nothing was added to `src/wm/core.ts`. Phase 15 is KELL.AI — deterministic intent matching over the registry and content index, no LLM, giving the `kellai` row a runtime the same disciplined way; do not scatter version checks, do not touch the read-path/publish pipeline, do not invent facts.
