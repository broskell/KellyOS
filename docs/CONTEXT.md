# KELL.OS — Standing Context

*Given to every phase chat. Read fully before doing anything.*

---

## What KELL.OS is

KELL.OS is a developer portfolio built as an operating system. Saathvik Kellampalli — a
second-year BS Applied AI & Data Science student at IIT Jodhpur (CGPA 9.44) — is building
it across 19 phases, one AI chat per phase, each ending in a handoff document.

The metaphor is the argument, not decoration: the Recycle Bin holds genuinely abandoned
projects, and versions 1.0 → 3.0 map to real eras of his life.

## Who it's for

**Audience A — recruiters and hiring managers.** Ninety seconds. Need to know he can build
the thing. **A wins every conflict** — if OS theatre delays a recruiter reaching evidence,
the theatre loses.

**Audience B — friends and peers.** Should find it genuinely impressive. Always secondary.

## Positioning

Full-stack product engineer who ships fast. Secondary: frontend/interaction engineer.
**Not claimed:** AI/ML engineer, data scientist, security engineer.

## The honesty stance — the spine of the product

Saathvik develops AI-assisted. **The site says so, in his words, early in each document —
not buried, not softened.** This is the positioning, not a disclaimer, and it is what
makes every other claim believable. Three rules every phase inherits:

1. **No skill claims debugging ability** until a specific instance can be named. None can
   today.
2. **No project claims depth** its case study can't defend under interview questioning.
3. **No number appears** without evidence. **Zero verified usage metrics exist** today.

Skills are graded by **evidence type** — Tier 1 externally verified, Tier 2 shipped
publicly, Tier 3 worked with. **Never percentages, star ratings, progress bars, or
proficiency meters — including as a visual idea.**

## What's actually real

- **Merged feature PR in `langchain-ai/langchain`** (#39301) — the only externally
  verified engineering work, and the flagship case study.
- **Paid Fiverr data-cleaning**, 2024 — ~3 clients, ~₹30,000, approximate.
- **CGPA 9.44**; parallel programme at LeapStart School of Technology.
- **GSoC contributor**; **BigCode Challenge** top 1,500 of 15,000+.
- **~23 projects**, mostly AI-assisted, mostly gallery-tier.

Case-study slate: **LangChain** (written) · **KELL.OS** (after Phase 18) · **Roast My
Project** and **PawSethu** (blocked on technical review). V1 may launch with one case
study. That is acceptable.

## Locked architecture — never renegotiate

- **Vite + React + TypeScript (strict) + Tailwind. Not Next.js** — the shell is a
  persistent client app; SSR fights the window manager. SEO is solved by a build-time
  prerendered static fallback layer plus Reader Mode.
- **Design tokens as CSS custom properties**, consumed by Tailwind.
- **Window manager core is pure and headless** — no React, no DOM, no GSAP; Zustand binds
  only. Drag and resize write straight to the DOM, never per-frame React state.
- **Apps are data in an App Registry** — one manifest feeds desktop, Start menu, Ctrl+K
  search, terminal `open`, mobile grid, and the update system.
- **Case studies are ordered typed content blocks**, not fixed fields.
- **Publish-to-static** — Mongo is the editing system of record; Publish emits a JSON
  bundle plus a deploy hook. Zero DB calls on the visitor read path.
- **Versions are feature flags over one data set**, never separate builds. New visitors
  always boot the newest version; the update ceremony is for returning visitors only.
- **GSAP only** (no Framer Motion) · no Three.js/R3F in V1–V2 · no smooth-scroll library ·
  no backend before V1 ships · no LLM in KELL.AI for V1 (deterministic intent matching).
- **V1.0 ships with zero backend.** Fastify + MongoDB + admin + update system are V2.

## Non-negotiable boundaries

**Stay in your phase.** One phase, one objective. Phase 3 is "build and prove the window
manager," not "build the OS."

**Never rewrite Phase 0 content.** Design decides how words look, never what they say. If
text doesn't fit a layout, change the layout or ask Saathvik.

**Never add visual fields to content types** — no `className`, `color`, or `width` on a
block. Blocks carry semantics; the design system owns appearance.

**Never invent a fact about Saathvik** — not a metric, date, user count, client name, or
technical decision. If something is needed and absent, ask. Everything in Phase 0 came
from a five-round intake; nothing was filled in.

**Never promote a project** to case study because a grid looks unbalanced, and **never
soften the AI-assistance disclosure.**

**End every phase with a handoff** at `docs/handoffs/PHASE-N-HANDOFF.md`: decided / open
questions / what the next phase needs / what it must not touch. Record failures and wrong
assumptions **as they happen** — the KELL.OS case study is written from that record.

**Reference images** arrive heavily in Phase 1 and never afterwards; later phases get the
approved design system and a specific mockup, not fresh inspiration.

## Known gap

The Master Blueprint did not reach the Phase 0 session. `content-model.md` and
`app-inventory.md` carry explicit reconciliation notices. **Where they and the blueprint
disagree, the blueprint wins** — flag the difference, don't silently merge.
