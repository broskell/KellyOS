# KELL.OS — Master Technical & Product Blueprint

**Version:** 1.0-reconstructed
**Reconstructed:** 30 August 2026
**Original authored:** 15 August 2026

---

## ⚠ Document authority — read this first

**This is a reconstruction.** The original Master Technical & Product Blueprint was
written on 15 August 2026 in a prior session. It never reached any phase chat — every
handoff from Phase 1 to Phase 5 records searching for it and proceeding under ASSUMED.
This document rebuilds it from three sources:

1. **The locked decision record** carried forward from the original blueprint session.
   §3 and §4 come from there and are **authoritative**.
2. **Phase 0 outputs** — positioning, content model, app inventory, version narrative.
3. **The shipped implementation and the Phase 1–5 handoffs.** §6.2 and §10.1 are
   *observed*, not assumed — they record what was actually built.

**Sections marked `⚠ RECONSTRUCTED — CONFIRM` were not in the carried-forward record.**
They are reasoned derivations, not recovered facts. Saathvik must confirm or correct them.

**Two circularity warnings, so nothing here is mistaken for independent confirmation:**

- §5.2 (ContentBlock variants) and §6.1 (tier definitions) were derived *from* the Phase 0
  documents. They agree with those documents by construction. That is not evidence they
  are right.
- §10.2 (phases 6–18) is this document's **assignment**, not a recovered plan. It is what
  the phase chain has been blocked on since Phase 2, so it is written to unblock — but it
  is a proposal until Saathvik confirms it.

**If the original blueprint is recovered, it wins over this document on every point.**
Flag the difference; do not silently merge. Where it contradicts already-shipped code,
the contradiction is a decision for Saathvik, not a licence to rebuild.

---

## 1. Product definition

### 1.1 What KELL.OS is

KELL.OS is a developer portfolio built as an operating system. It is the primary hiring
artefact for **Saathvik Kellampalli** — a second-year BS Applied AI & Data Science student
at IIT Jodhpur.

The OS metaphor is load-bearing, not decorative:

- The **Recycle Bin** holds genuinely abandoned projects
- **Versions 1.0 → 3.0** map to real eras of Saathvik's life, not fictional releases
- The **desktop** is a real window manager, not a picture of one
- The **update ceremony** is how the site's own growth is narrated

A portfolio that merely *looks* like an OS is a novelty. One where the metaphor carries
real information is an argument.

### 1.2 The two audiences

| | Audience | Constraint | What they must believe |
|---|---|---|---|
| **A** | Recruiters, hiring managers | ~90 seconds. Will not learn an interface. | "This person can build the thing we need built." |
| **B** | Friends, peers, developers | Curious, patient, will explore. | "This is genuinely good work." |

**Audience A wins every conflict.** If OS theatre delays a recruiter reaching evidence,
the theatre loses. This single rule resolves more design arguments than any other in this
document.

### 1.3 Success criteria

| # | Criterion | Measurable as |
|---|---|---|
| S1 | A recruiter reaches a case study within 90 seconds of landing | Time-to-first-case-study on a cold visit |
| S2 | Every hiring-critical surface is reachable without using the window manager | Direct URL + Reader Mode coverage of all Tier 1 apps |
| S3 | The site is legible to crawlers and link previews | Static fallback renders full content without JS |
| S4 | No claim on the site collapses under interview questioning | Every claim traceable to evidence — enforced by the content model |
| S5 | Audience B shares it unprompted | Qualitative |

**S4 is the one that can kill the project.** A portfolio that impresses and then falls
apart in a phone screen is worse than no portfolio.

### 1.4 Anti-goals

- **Not** a general-purpose web OS. Only apps serving the two audiences exist.
- **Not** a novelty. Every interaction must survive someone in a hurry.
- **Not** a design showcase at the expense of legibility.
- **Not** a place to inflate. See §2.

---

## 2. The honesty stance — product-level, not cosmetic

Established in Phase 0 and elevated here because it constrains architecture, not just copy.

**Saathvik develops AI-assisted. The site says so, in his own words, early in each
document — not buried, not softened.**

Three rules every phase inherits:

1. **No skill claims debugging ability** until a specific instance can be named.
2. **No project claims depth** its case study cannot defend under questioning.
3. **No number appears** without evidence behind it.

### 2.1 Architectural consequences

Enforced by the type system and publish pipeline, not by discipline:

| Mechanism | Enforces |
|---|---|
| `Project.authorship` — required, no default | Every project declares how it was produced |
| `Project.role.ownedAreas` — required when not solo | "I did everything" is unrepresentable |
| `MetricsBlock.metrics[].source` — required | No unsourced number can be authored |
| `ExternalLink.verified` — gates publication | Unverified URLs cannot ship |
| `PublishState.blockers[]` — non-empty blocks publish | Verification debt is machinery, not memory |
| `Skill` has **no** boolean ability field | Proficiency meters are unrepresentable |

Full shapes: [`content-model.md`](content-model.md).

---

## 3. Locked technical decisions

**Authoritative. Carried forward from the original blueprint. No phase may renegotiate any
line in this section.** A phase that believes a decision here is wrong must stop and
escalate to Saathvik — it may not work around it.

### 3.1 Stack

**Vite + React + TypeScript (strict) + Tailwind. Not Next.js.**

*Why:* the OS shell is a persistent client application. Window state, focus order,
z-ordering and the app registry live in memory across the whole session. SSR fights this
at every turn — hydration boundaries cut through the window manager, and per-route server
rendering is meaningless when there are no routes in the conventional sense.

*What replaces the SSR benefit:* a **build-time prerendered Static Fallback Layer** plus
**Reader Mode**. See §7.

### 3.2 Styling

**Design tokens as CSS custom properties, consumed by Tailwind.**

*Why:* tokens must change at runtime — wallpapers, themes, and crucially the
version-driven look changes when a visitor switches between KELL.OS 1.0, 2.0 and 3.0.
Build-time-only theming cannot express that. Tailwind consumes the custom properties so
authoring ergonomics stay conventional.

### 3.3 Window manager

**The window manager core is pure and headless. No React. No DOM. No GSAP.**

- The core is a state machine over window geometry, stacking, focus and lifecycle
- **Zustand is a binding layer only** — it adapts the core to React, it does not own state
- **Drag and resize write directly to the DOM.** Never per-frame React state.

*Why:* a window manager that re-renders React on every pointer move will not hold 60fps
with several windows open, and the failure is not fixable later — it is structural. A
headless core is also testable without a browser.

### 3.4 App Registry

**Apps are declared as data in an App Registry.** One manifest feeds:

Desktop icons · Start menu · Ctrl+K search · Terminal `open` · Mobile app grid ·
OS update system · Static fallback layer

*Why:* six surfaces listing the same apps is six places to forget one. **Adding an app is
a registry entry, not six edits.** A phase that adds an app by touching these surfaces
individually is violating this decision.

### 3.5 Content

**Case studies are ordered typed content blocks, not fixed fields.**

*Why:* case studies vary structurally. A fixed schema either bloats with optional fields
or forces prose into the wrong shape. Blocks also give the Static Fallback Layer and
Reader Mode a clean rendering target.

### 3.6 Content delivery

**Publish-to-static.** MongoDB is the *editing* system of record. The admin's Publish
action emits a JSON bundle plus a deploy hook. **Zero database calls on the visitor read
path.**

*Why:* visitor-facing reads must not depend on a database being up, warm, or inside a free
tier. A portfolio that is down when a recruiter opens it has failed at its only job.

### 3.7 Versions

**OS versions are feature flags over one data set. Never separate builds.**

- One codebase, one content set, filtered by version
- **New visitors always boot the newest version**
- The update ceremony exists for **returning visitors only**

*Why:* forking builds per version multiplies maintenance by three and guarantees drift.
And a first-time visitor forced through a retro version before reaching current work is a
first-time visitor who leaves.

### 3.8 Explicit technology bans

| Banned | Scope | Reason |
|---|---|---|
| Framer Motion | All versions | **GSAP only.** One animation system. |
| Three.js / React Three Fiber | V1 and V2 | Weight and complexity against benefit |
| Smooth-scroll libraries (Lenis etc.) | All versions | Fights native scrolling and accessibility |
| Any backend | Before V1 ships | V1.0 is zero-backend |
| LLM inside KELL.AI | V1 | Deterministic intent matching instead |

**Phase 0 continuity note:** the Three.js ban means Saathvik's strongest visual craft
evidence (the scrollytelling work) lives in a technology this product deliberately does
not use. That is accepted. Those projects appear as screenshots and links, not as
reimplementations.

### 3.9 Release scoping

**V1.0 "ORIGIN" ships with zero backend.** Fastify, MongoDB, the admin CMS and the update
system are **V2**.

---

## 4. System architecture

```
┌─────────────────────────────────────────────────────────────┐
│  STATIC FALLBACK LAYER  (build-time prerender, no JS)       │
│  Crawlers · link previews · JS-disabled · Reader Mode seed  │
└─────────────────────────────────────────────────────────────┘
                              ▲  built from the same bundle
┌─────────────────────────────┴───────────────────────────────┐
│  SHELL           desktop · taskbar · start · boot           │
│  ─────────────────────────────────────────────────────────  │
│  APP LAYER       apps mounted from the App Registry         │
│  ─────────────────────────────────────────────────────────  │
│  BINDING         Zustand  ← adapts core to React            │
│  ─────────────────────────────────────────────────────────  │
│  WM CORE         headless state machine · no React/DOM/GSAP │
└─────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────┴───────────────────────────────┐
│  CONTENT         ContentBundle (JSON) · version-filtered    │
└─────────────────────────────────────────────────────────────┘
                              ▲  V2+: emitted by Publish
┌─────────────────────────────┴───────────────────────────────┐
│  EDITING (V2)    Fastify + MongoDB + Admin → Publish        │
│                  NOT on the visitor read path               │
└─────────────────────────────────────────────────────────────┘
```

### 4.1 Layer rules

| Layer | May depend on | May never depend on |
|---|---|---|
| WM Core | Nothing | React, DOM, GSAP, content |
| Binding | WM Core | Apps, content |
| App Layer | Binding, Content, Registry | WM Core internals |
| Shell | Registry, Binding | App internals |
| Content | Nothing | Any UI layer |
| Editing (V2) | Content shapes | Anything visitor-facing |

**The WM Core rule is the one most likely to be violated under time pressure.** The moment
the core imports React it stops being testable and starts being a component.

### 4.2 Version filtering

Version filtering happens **at content load**, not in components. A component never asks
"which version are we in?" to decide what to render — it receives already-filtered data.

*Why:* version checks scattered through components is how versions-as-feature-flags decays
into versions-as-conditionals, which is how it becomes unmaintainable.

---

## 5. Content architecture

The full type contract lives in [`content-model.md`](content-model.md) and **must survive
unchanged into Phase 11's database.** This section states only what the blueprint fixes.

### 5.1 Entities

`Project` · `ContentBlock` · `Skill` · `TimelineEntry` · `NowEntry` / `NowSnapshot` ·
`OSVersion` · `AssetRef` · `ExternalLink` · `PublishState`

### 5.2 Canonical ContentBlock variants

⚠ **RECONSTRUCTED — CONFIRM.** This list was derived in Phase 0 from the blocks the actual
written case studies require. If the original blueprint names variants differently, its
names win.

| Variant | Purpose |
|---|---|
| `heading` | Section headings, levels 2–4. Level 1 is the entity title. |
| `prose` | Markdown paragraph. Inline formatting only. |
| `list` | Bulleted or numbered |
| `code` | Fenced code with language, optional filename and highlight lines |
| `quote` | Pull quote with optional attribution and source URL |
| `callout` | `note` \| `caution` \| `limitation` \| `disclosure` |
| `image` | Single asset with size intent |
| `gallery` | 2+ assets |
| `diagram` | Mermaid, SVG or image. `altDescription` **required**. |
| `keyValue` | Two-column fact table (goals, constraints) |
| `comparison` | N-column table (alternatives considered) |
| `metrics` | Numeric outcomes. `source` **required**, `verified` explicit. |
| `linkGroup` | Grouped external links |
| `embed` | Video or sandbox embed |
| `divider` | Semantic separation |

### 5.3 Block rules — non-negotiable

1. **No block carries visual styling.** No colours, fonts, widths, or `className`. Blocks
   carry semantics; the design system owns appearance. A visual field appearing on a block
   type in any later phase is a contract violation.
2. **Block IDs are stable across edits.** Deep links and future annotations depend on it.
3. **Array position is canonical order.** The `order` field exists only so a relational
   store can reconstruct it.

### 5.4 The content bundle

One JSON document contains versions, projects, skills, timeline, now, and an asset map,
stamped with a `schemaVersion`. **V1 authors it by hand. V2 generates the identical shape
from MongoDB.** The visitor read path is byte-identical in both cases — that is the entire
point of the contract.

---

## 6. App architecture

### 6.1 Tier definitions

⚠ **RECONSTRUCTED — CONFIRM.** Derived from the locked audience priority.

| Tier | Definition | Consequence |
|---|---|---|
| **Tier 1** | A recruiter's decision cannot be made without it. Reachable within 90 seconds. Must work on mobile, must appear in the static fallback layer, must be readable in Reader Mode, must be directly linkable. | Ships in V1. Non-negotiable. |
| **Tier 2** | Supports the decision but is not required for it. A visitor who never opens it can still evaluate Saathvik. | Ships in V1 if it does not delay Tier 1. |
| **Tier 3** | Atmosphere, credibility with audience B, or metaphor payoff. Carries no hiring-critical content. | Cut first under pressure. |

### 6.2 V1 app assignments — as shipped

**Recorded from `src/registry/manifest.ts`, not assumed.** Phases 2–5 built this; the
registry is the source of truth and this table follows it.

| Tier | Apps | Route state |
|---|---|---|
| **1** (7) | About Me · Projects · Case Study Reader · Skills · Résumé · Contact · **Reader Mode** | All routed and launchable |
| **2** (4) | Now · Timeline · Recycle Bin · **Search** | Search has an empty route — data only |
| **3** (4) | Terminal · KELL.AI · Settings · OS Update | All empty routes — data only |

**Reader Mode shipped as Tier 1**, resolving Phase 0 open question #8 ("arguably yes").
That is correct and this blueprint ratifies it — see §6.3.

**Five registry rows have no runtime** (Search, Terminal, KELL.AI, Settings, OS Update).
Phase 5 established the rule that governs them: they remain **data**, and honest shell
surfaces list only apps that actually open. **An empty registry row is not a licence to
build the app** — see §10, Phase 8.

Per-app content sources: [`app-inventory.md`](app-inventory.md).

### 6.3 Two rules that look like polish and are not

**Deep-linkability is a Tier 1 requirement.** Every Tier 1 app needs a URL that opens it
directly with the OS around it. A recruiter arriving from a CV link lands on a case study,
not on a desktop they must learn.

**Reader Mode is Tier 1.** It is the safety valve for the entire OS-metaphor bet — the only
thing between a recruiter bouncing off the interface and a lost opportunity. It reaches the
visitor three ways (tray, Start, Alt+R). **It may not be cut, and it may not be replaced by
"the WM is the site."**

### 6.4 Not in V1

Admin/CMS (V2) · blog (no content exists) · analytics dashboard (no metrics exist) ·
guestbook/comments (needs a backend) · anything requiring an LLM.

---

## 7. SEO, static fallback, and Reader Mode

The single largest risk created by choosing Vite over Next.js. Three mechanisms answer it.

### 7.1 Static Fallback Layer

At build time, every published content entity is prerendered to a plain HTML document at
a stable URL, containing full content, correct metadata and no JavaScript requirement.

Serves: crawlers · link previews (LinkedIn, Slack, X) · JS-disabled visitors · the
no-JS floor for the site's own content.

**Generated from the same ContentBundle the app consumes.** Two content pipelines would
drift; there is one.

### 7.2 Reader Mode

A runtime mode that strips the OS and renders content as a plain document. Serves the
90-second recruiter directly.

⚠ **RECONSTRUCTED — CONFIRM:** Reader Mode should be *discoverable within the first
screen*, not buried in Settings. A safety valve nobody can find is not a safety valve.

### 7.3 Metadata

Per-entity title, description, canonical URL and OG image. `AssetRef` indirection means
moving a CDN never requires a content migration.

---

## 8. Performance and accessibility budgets

⚠ **RECONSTRUCTED — CONFIRM.** These numbers were not in the carried-forward record.
They are proposed, not recovered.

| Budget | Target |
|---|---|
| Time to first meaningful content (cold, mid-tier mobile) | < 2.5s |
| Window drag / resize | 60fps, no dropped frames with 3 windows open |
| Initial JS bundle (shell + WM, before apps) | < 200KB gzipped |
| App code | Lazy-loaded per app from the registry |
| Static fallback page weight | < 100KB, zero JS required |
| Lighthouse accessibility | ≥ 95 on every Tier 1 surface |

**Accessibility floor:** full keyboard operation of the shell and every Tier 1 app; visible
focus; correct heading order in Reader Mode and the static layer; `AssetRef.alt` and
`DiagramBlock.altDescription` required at the type level.

**Motion:** `prefers-reduced-motion` disables all non-essential GSAP animation. The boot
sequence and update ceremony must both be skippable.

---

## 9. Release plan

| Release | Scope | Backend |
|---|---|---|
| **V1.0 "ORIGIN"** | Full shell, WM, all Tier 1–3 apps, hand-authored content bundle, static fallback, Reader Mode, mobile | **None** |
| **V2.0** | Fastify + MongoDB, admin CMS, publish pipeline, version system + update ceremony, KELL.AI | Yes |
| **V3.0** | Third-era look and content set, driven entirely by feature flags | Yes |

**Version narrative** (real eras, confirmed in Phase 0):
1.0 = 2023–Aug 2025 · 2.0 = Sep 2025–May 2026 · 3.0 = Jun 2026–present.
See [`version-narrative.md`](version-narrative.md).

⚠ **Open:** KELL.OS 1.0 carries the codename **ORIGIN**, which collides with a personal
project of the same name. Resolve before Phase 1.

---

## 10. The 19-phase plan

**Method (locked):** one AI chat per phase, Phase 0 → Phase 18. Each chat receives a
scoped context pack — [`CONTEXT.md`](CONTEXT.md), relevant prior decisions, its own
objective and constraints, and explicit do-not-touch boundaries — **never the full prior
transcript.** Each chat ends by emitting `docs/handoffs/PHASE-N-HANDOFF.md`. Saathvik
reviews each output before the next chat starts.

*Why:* per-feature chats fragment context; one mega-chat lets a late-phase model
renegotiate settled architecture.

**Reference images** are supplied heavily in Phase 1 and essentially never afterwards.
Later phases receive the approved design system and a specific mockup — never fresh
inspiration. This is the primary defence against design drift.

**One phase, one objective.** Phase 3 is "build and prove the window manager," not "build
the OS."

### 10.1 Phases 0–5 — COMPLETE, recorded from the handoffs

**These are not proposals. They happened, and the handoff documents are the authoritative
record of what each phase actually did.** An earlier draft of this section guessed at
these titles and guessed wrong from Phase 2 onward; the table below follows the handoffs,
not the guess.

| # | Phase, as executed | Shipped |
|---|---|---|
| **0** | Product Definition & Content | Positioning, all app copy, content model, app inventory, version narrative, asset list, one complete case study |
| **1** | Design System — **frozen** | Tokens in `src/styles/tokens.css`, chrome and block recipes, Tailwind v4 `@theme inline`, wordmark. Chrome reference RobbyOS / Win95–98 — **reference, not clone.** Vite 7 + React 19 + TS strict scaffold, written by hand |
| **2** | OS shell without the window manager | Routes, build-time prerender / static fallback, App Registry **shape**, presentational chrome |
| **3** | Headless window manager | Pure `src/wm/core.ts` (no React/DOM/GSAP), Zustand bind, direct-to-DOM drag/resize, Vitest coverage |
| **4** | Apps as products | Tier 1 and Tier 2 apps bound to the WM and backed by Phase 0 content |
| **5** | Recruiter path + honest shell | The 90-second path proven end to end; Start/desktop/mobile list only apps that open; keyboard chords; **Ctrl+K deliberately not shipped** |

**State at the time of writing:** `npx tsc -b` clean · `npm test` 18/18 · `vite build`
clean with routes prerendered under `dist/` · Phase 5 verification passing with
screenshots. GSAP is **not yet in the project**.

### 10.2 Phases 6–18 — assigned

⚠ **RECONSTRUCTED — CONFIRM.** Phase 11 (database) and Phase 18 (last) are anchored by
Saathvik's own statements. The rest is this blueprint's assignment, made **after** reading
the Phase 1–5 handoffs and the shipped registry.

**This section exists because the chain is blocked on it.** Every handoff from Phase 2
onward says the next phase list is ASSUMED without the blueprint, and Phase 5 explicitly
defers Ctrl+K, Terminal, KELL.AI, Settings and the update ceremony to "whichever phase the
blueprint assigns." §10.2 is that assignment.

#### V1.0 "ORIGIN" — zero backend

| # | Phase | Objective | Must not touch |
|---|---|---|---|
| **6** | Motion & Polish | First introduction of **GSAP**. Boot, window open/close/focus, Start, tip. `prefers-reduced-motion` disables all non-essential motion; boot stays skippable. | Tokens, chrome, the WM core, Phase 0 copy |
| **7** | Performance, Accessibility & Hardening | Meet §8 budgets. Full keyboard operation, focus order, heading order in Reader Mode and prerender. Lighthouse ≥95 on Tier 1. | Adding features to hit a number |
| **8** | Command Surfaces | Give runtimes to the empty Tier 2/3 rows: **Search (Ctrl+K)** · **Terminal** (`open`) · **Settings**. All three read the registry — no hardcoded app lists. | KELL.AI (Phase 15), OS Update (Phase 14) |
| **9** | Content Completion & Gallery | Gallery cut to 8–10 with real screenshots; asset pipeline; URL verification enforced by `ExternalLink.verified`. **Gated on Saathvik's homework** — see [`asset-inventory.md`](asset-inventory.md). | Inventing assets or metrics to fill layouts |
| **10** | **V1.0 "ORIGIN" LAUNCH** | Deploy, metadata, OG images, final verification pass, rollback plan | Scope additions |

#### V2.0 — backend era

| # | Phase | Objective | Must not touch |
|---|---|---|---|
| **11** | Backend & Database | Fastify + MongoDB implementing the **unchanged** Phase 0 content contract | The contract itself |
| **12** | Admin CMS | Authoring UI for every entity; blockers and link verification enforced at the point of authoring | The visitor read path |
| **13** | Publish-to-Static Pipeline | Publish → JSON bundle + deploy hook. **Refuses** entities with blockers or unverified links. | Adding DB calls to the read path |
| **14** | Version System & Update Ceremony | Feature flags over data; returning-visitor ceremony; new visitors boot latest | **The window manager.** Filtering happens at content load, never in components. |
| **15** | KELL.AI | Deterministic intent matching over registry + content index. **No LLM.** | Inventing answers it cannot source |
| **16** | V2.0 Launch & Hardening | Migration, monitoring, rollback | New features |

#### V3.0

| # | Phase | Objective |
|---|---|---|
| **17** | V3.0 Look & Feature Set | Third-era tokens and flags. Data-driven only — **no fork, no second site.** |
| **18** | Launch, Handover & the KELL.OS Case Study | Final launch; **write `content/case-studies/kellos.md` from the accumulated handoff record** |

### 10.3 Why Phase 6 is motion and not content

Phase 9 (gallery and screenshots) is the more valuable phase for the product, but it is
**blocked on work only Saathvik can do** — screenshots, the gallery cut, URL verification.
Phases 6, 7 and 8 are unblocked and can proceed while that homework happens. If the
homework completes early, **9 may be brought forward ahead of 8.**

### 10.4 The Phase 18 dependency

**Phase 18 depends on every prior phase having recorded its failures and wrong assumptions
as they happened.** Phases 1–5 have done this well — the handoffs record a workspace
measuring 0×0, a discriminated union collapsed by `Omit`, an SPA fallback eating nested
prerender URLs, and a Reader Mode initially mistaken for a print view. **That record is the
raw material for the KELL.OS case study and cannot be reconstructed afterwards.** Keep
writing it.

---

## 11. Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| A late phase renegotiates locked architecture | **High** | §3 is authoritative; scoped context packs; escalate, never work around |
| Design drift across 19 chats | **High** | Reference images in Phase 1 only; later phases get the approved system |
| WM core acquires a React dependency | **High** | Layer rules in §4.1; core tested headlessly in Phase 3 |
| SEO loss from choosing Vite | **High** | Static Fallback Layer + Reader Mode (§7) |
| Recruiter bounces off the OS metaphor | **High** | Deep-linkability + Reader Mode, both Tier 1 in effect |
| Only one case study exists at launch | **High** | Accepted. One externally verified study beats four unverifiable ones. Projects app must be designed for it. |
| A claim collapses in interview | **Critical** | §2 enforcement mechanisms; Phase 0 verification debt |
| Zero verified metrics anywhere | Medium | Ship PawSethu; `MetricsBlock` may render empty indefinitely |
| Version system decays into scattered conditionals | Medium | Filtering at load only (§4.2) |
| Free-tier backend down when a recruiter visits | Medium | Publish-to-static: no DB on the read path |

---

## 12. Glossary

**App Registry** — the single data manifest declaring every app, feeding all six shell
surfaces.
**ContentBundle** — the published JSON document the visitor app reads. Hand-authored in
V1, generated in V2.
**Publish-to-static** — MongoDB edits → Publish → JSON bundle + deploy hook. No DB on the
read path.
**Reader Mode** — runtime mode stripping the OS to a plain document.
**Static Fallback Layer** — build-time prerendered no-JS HTML for crawlers and previews.
**Update ceremony** — the version-transition sequence, shown to returning visitors only.
**WM Core** — the pure, headless window-manager state machine.

---

## 13. Confirmation checklist for Saathvik

Everything below is `⚠ RECONSTRUCTED` and needs a yes/no:

- [ ] **§10.2 — the assignment of phases 6–18.** *Most urgent.* The chain has been blocked
      on this since Phase 2, and Phase 6 cannot start until it is confirmed.
- [ ] §5.2 — the 15 ContentBlock variants and their names
- [ ] §6.1 — the Tier 1/2/3 definitions
- [ ] §8 — the performance and accessibility budgets (Phase 7 implements against them)
- [ ] §7.2 — Reader Mode discoverable within the first screen
- [ ] §9 — resolution of the **ORIGIN** naming collision

**Not needing confirmation:**

- §1–§4 and §3.1–§3.9 are carried forward from the original blueprint. If any line looks
  wrong, say so — that means the reconstruction introduced an error and it must be
  corrected at the source.
- §6.2 and §10.1 are **observed from the shipped code and the Phase 1–5 handoffs.** They
  are a record, not a proposal. If they are wrong, the code or the handoffs are wrong.
