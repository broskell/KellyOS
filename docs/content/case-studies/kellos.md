# Building a portfolio as a real operating system

**Slug:** `kellos`
**Type:** Full case study — flagship
**Status:** 🟢 Drafted at Phase 18 from the phase-by-phase handoff record.
**Authorship:** AI-assisted. Kelly.OS was built across a chain of AI chats, one per phase,
with me as sole architect making every decision. I say so here for the same reason I say it
everywhere else on this site: it is the positioning, not a confession.

---

## Problem

A portfolio has about ninety seconds to convince a recruiter, and a conventional one gives
them no reason to stay past the fold. I wanted the site itself to be evidence of how I
build — but the obvious way to do that, "make it look like an operating system," is a
novelty that actively *costs* a recruiter time. The novelty and the ninety seconds are in
direct conflict.

There was a second, more personal problem underneath it. I develop AI-assisted. Most of my
projects are. If I hid that, the whole portfolio would collapse under one interview
question; if I led with an apology for it, I'd be dismissed. I needed an architecture where
honesty was load-bearing rather than decorative.

## Context — how I got here

I'm a second-year BS Applied AI & Data Science student at IIT Jodhpur, building this in
parallel with coursework. I decided to run the whole thing as a disciplined sequence of
phases — one AI chat per phase, each ending in a written handoff (`docs/handoffs/PHASE-N-HANDOFF.md`)
recording decisions, failures, and wrong assumptions *as they happened*. That paper trail
is the reason this case study can describe what actually occurred instead of what I meant
to do. It is the first project I've built that way.

## My role

Sole architect and decision-maker. The implementation was AI-assisted across every phase;
the architecture, the constraints, and every judgement call — including the ones in this
document about what *not* to build — were mine. Where I declined an AI suggestion (a Clippy
mascot, for instance) it's recorded in the handoffs with the reason.

## Goals and constraints

- **Two audiences, and one of them always wins.** Recruiters (ninety seconds, won't learn
  an interface) beat friends/peers (curious, will explore) in *every* conflict. This single
  rule settled more design arguments than anything else.
- **Every hiring-critical surface reachable without the window manager** — a direct URL and
  a Reader Mode for each.
- **Legible to crawlers and link previews with no JavaScript.**
- **No claim survives only until an interview.** Enforced in the type system, not by
  discipline.
- **V1 ships with zero backend.** The database, admin, and publish pipeline are V2.

## Architecture — the decisions that mattered

**Vite + React + TypeScript, not Next.js.** The shell is a persistent client application:
window geometry, focus order, z-ordering and the app registry all live in memory across the
whole session. Server-side rendering fights that at every turn — hydration boundaries cut
straight through the window manager, and per-route server rendering is meaningless when
there are no routes in the conventional sense. The SEO that SSR would have bought is instead
bought by a **build-time prerendered static-fallback layer** plus a runtime **Reader Mode**,
both generated from the same content the app consumes.

**The window-manager core is pure and headless — no React, no DOM, no GSAP.** It's a state
machine over window geometry, stacking, focus and lifecycle. Zustand only *binds* it to
React; it doesn't own the state. Drag and resize write **directly to the DOM**, never
through per-frame React state, because a window manager that re-renders React on every
pointer move will not hold 60fps with several windows open — and that failure is structural,
not something you optimise away later. A side benefit: the core is testable with no browser.

**Apps are declared as data in one App Registry.** A single manifest feeds the desktop
icons, the Start menu, Ctrl+K search, the terminal `open` command, the mobile grid, and the
version/update system. Adding an app is one registry entry, not six edits. This paid off
directly at the end: giving Kelly.AI and OS Update real runtimes was a matter of flipping
registry fields, and every surface picked them up at once.

**Case studies are ordered, typed content blocks** — not fixed fields — so structurally
different write-ups share one clean rendering target for the app, Reader Mode, and the
static layer.

**The honesty stance is enforced by types.** `Project.authorship` is required with no
default. `Project.role.ownedAreas` is required when the work wasn't solo, so "I did
everything" is literally unrepresentable. Every metric carries a required `source`. Skills
have **no** boolean ability field, which makes a proficiency meter impossible to author.
Verification debt is machinery — an entity with open blockers refuses to publish — not a
thing I have to remember.

**Versions are feature flags over one data set, never separate builds.** New visitors always
boot the newest era; returning visitors get an update ceremony. Filtering happens once, at
content load, and components are handed already-filtered data — they never ask "which
version are we in?", because that's how a version system rots into scattered conditionals.

## Stack

Vite 7 · React 19 · TypeScript (strict) · Tailwind v4 with design tokens as CSS custom
properties · Zustand (binding only) · GSAP (the one animation system) · a headless
hand-written WM core · Vitest. V2 adds Fastify + MongoDB + an admin CMS behind a
publish-to-static step. Zero database calls on the visitor read path.

## Implementation — the phase-by-phase reality

Zero through five built the spine: the frozen design system, the OS shell, the headless
window manager, the apps, and the ninety-second recruiter path proven end to end. Six
through ten added motion, hardening, the command surfaces, and content. Eleven through
thirteen built the V2 backend, admin, and publish pipeline **without touching the visitor
read path**. Fourteen made versions real. Fifteen added Kelly.AI. Seventeen gave each era
its own look. Each phase was scoped to one objective and forbidden from renegotiating
settled architecture — the guardrail against a late-phase model rebuilding the foundations.

## The hard part — making an operating system legible to someone in a hurry

The whole bet rests on the OS metaphor not costing a recruiter the ninety seconds it has.
Three mechanisms answer that, and the interesting part is how each one broke first.

**Deep-linkability.** Every Tier-1 app needs a URL that opens it directly with the OS around
it, so a recruiter arriving from a CV link lands on the case study, not on a desktop they
have to learn. The static prerender writes a real HTML document per entity at a stable
nested URL. The bug: a catch-all SPA fallback happily *ate* the nested `/project/...` and
`/read/...` URLs, serving the app shell instead of the prerendered page — so crawlers and
no-JS visitors got nothing. The fix was making nested prerender win over the fallback, and
it's now a standing rule every later phase is warned not to break.

**Reader Mode.** This is the safety valve for the entire metaphor — the one thing between a
recruiter bouncing off the interface and a lost opportunity. Early on it was mistaken for a
print view, which is subtly wrong: a print view is an export, but Reader Mode is a
first-class runtime that strips the OS to a plain, linkable, keyboard-navigable document,
reachable three ways (tray, Start, Alt+R). Getting that distinction right is what makes it a
valve rather than a gimmick.

**The version system's honest consequence.** Versions-as-feature-flags produced a genuinely
uncomfortable result: because new visitors always boot the *newest* era and I claim no
future version, a returning visitor is already current — so the update ceremony **cannot
fire naturally today.** The tempting fix was to fake a version bump. I didn't. The ceremony
machinery is real and tested, and it's made demonstrable by replaying the genuine 2.0→3.0
transition, but it does not lie about the site having grown when it hasn't. That is the
honesty stance showing up in control flow, not copy.

## What shipped

A working operating system: a real window manager with keyboard control and 60fps drag, an
app registry feeding six surfaces, a full content model with the honesty constraints baked
into the types, a static fallback layer and Reader Mode covering every Tier-1 surface, a
version system with an era-aware look and an update ceremony, a deterministic no-LLM
assistant, and a V2 backend + admin + publish-to-static pipeline that never touches the
visitor read path.

## Result

The artefact is the site you're reading this in. I'm not going to attach usage numbers,
because none are verified yet — and inventing them would break the one rule the whole
project is built on. The honest result is the thing itself and the paper trail behind it:
every decision has a recorded reason, every failure above is one that actually happened, and
nothing here collapses under an interview question, because the type system wouldn't let me
author a claim I couldn't defend.

## What I learned

- **Constraints beat taste.** "Audience A wins every conflict" and "honesty is enforced by
  types" resolved arguments that opinion never would have.
- **The boring answer is often correct.** No LLM in the assistant, no per-frame React in the
  window manager, no separate builds per version. Each boring choice avoided a structural
  failure.
- **Wrong assumptions are the real content.** A workspace that measured 0×0, a discriminated
  union quietly collapsed by a stray `Omit`, an SPA fallback eating prerendered URLs, a
  boot overlay that rendered transparent because I reached for a Tailwind colour class that
  didn't exist in a token-only palette — none of these would survive being reconstructed
  from memory. Writing them down as they happened is why this case study is an engineering
  story and not a feature tour.
- **Say the AI part out loud.** Disclosing AI-assistance early, everywhere, is what makes
  the rest of the portfolio believable. Selective honesty would be worse than none.

---

## INTERNAL — before this publishes

- V2 (Fastify + MongoDB + admin + publish-to-static) is **built but not exercised against a
  live cluster** — `MONGODB_URI` was unset throughout, so the first real emit and the live
  deploy are still pending. Don't claim a live database until it has actually run.
- No verified usage metrics exist. Keep the Result section metric-free until they do.
- The product was renamed KELL.OS → Kelly.OS mid-build (owner directive); if any surface
  still says KELL.OS, fix it before publishing.
- This document covers phases 0–17 plus the polish pass. Update the "what shipped" and
  status lines once V2 is live and the site is deployed to its real origin.
