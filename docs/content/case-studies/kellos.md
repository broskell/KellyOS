# KELL.OS

**Slug:** `kellos`
**Type:** Full case study — **flagship**
**Status:** 🟡 **DEFERRED BY DESIGN.** Written after Phase 18, not now.
**Decided:** Intake Round 5 — *"The case study should show the real decisions,
constraints, failures, iterations, and final architecture rather than being written as a
concept before implementation."*

---

## Why this is deliberately empty

This is the case study most likely to be genuinely strong, and the one most likely to be
ruined by writing it early.

If written now it would describe intentions. Written after Phase 18 it describes what
actually happened — including the parts that went wrong, which is where the value is. This
is the first project Saathvik has built with the architectural decisions recorded as they
were made, which means it is the first project that can produce a case study grounded in a
real paper trail rather than recollection.

**Do not draft prose for this document before Phase 18.**

---

## What to capture *as it happens*, phase by phase

Each phase handoff (`docs/handoffs/PHASE-N-HANDOFF.md`) should record, in the moment:

- **Decisions made** — and the alternative that was rejected, with the reason
- **Things that broke** — and what the actual cause turned out to be
- **Assumptions that proved wrong** — the most valuable material of all
- **Work thrown away** — what was built and then deleted, and why

The last two are what separate this from a feature tour. Every portfolio contains a list
of features. Almost none contain an honest account of a wrong assumption.

---

## Decisions already made and worth explaining *(locked — from the master blueprint)*

These are settled architecture. The case study explains **why**, using evidence gathered
during implementation. It does not relitigate them.

| Decision | The interesting question the case study must answer |
|---|---|
| **Vite + React + TS, not Next.js** | Why does SSR fight a persistent window manager? What concretely broke or would have broken? |
| **SEO via build-time prerender + Reader Mode** | How do you make an OS-metaphor site legible to a crawler and to a recruiter in a hurry? |
| **Headless, pure window manager core** — no React, no DOM, no GSAP | Why is a framework-free core the right call, and what did it cost? |
| **Drag/resize write directly to the DOM** | Why does per-frame React state fail here? Measure it. |
| **Apps as data in an App Registry** | One manifest feeding desktop, Start menu, Ctrl+K, terminal `open`, mobile grid and the update system — what did that unify, and where did it strain? |
| **Case studies as ordered typed content blocks** | Why blocks rather than fixed fields? |
| **Publish-to-static** — Mongo edits, JSON bundle out, zero DB on the read path | Why does a portfolio need a publish step? |
| **Versions as feature flags over data** | Why never separate builds? What breaks if you fork? |
| **Deterministic intent matching in KELL.AI for V1, no LLM** | Why is the boring answer correct here? |

---

## Skeleton *(fill after Phase 18)*

**Problem** · A portfolio has ~90 seconds to convince a recruiter, and a conventional one
gives no reason to stay. Also the honest personal problem: how do you present AI-assisted
work without either hiding it or being dismissed for it?
**Context** · Built across 19 phases, one AI chat per phase, as a second-year student.
**My role** · Sole architect. State the assistance level explicitly, consistent with every
other case study here.
**Goals & constraints** · Two audiences, recruiter wins. V1 ships with zero backend.
**Architecture** · The headless core, the registry, the version-flag system, the static
publish pipeline.
**Stack** · As built.
**Implementation** · The phase-by-phase reality.
**The hard part** · Unknown today. **Do not guess it now** — it will emerge, most likely
in the window manager or the version system, and the real one is always better than the
predicted one.
**Solution** · What shipped.
**Result** · The site itself is the artefact. Add real metrics only if they exist.
**Lessons** · Written last, from the handoff record.

---

## Standing warnings

- ⚠ **Do not write this early.** A predicted hard part is worthless.
- ⚠ **Record failures during the phases.** They cannot be reconstructed afterwards.
- ⚠ **This is a case study, not a changelog.** Feature lists are not engineering stories.
- ⚠ **The AI-assistance disclosure applies here too.** KELL.OS is being built with heavy
  AI assistance across 19 chats. Saying so is consistent with the rest of the portfolio;
  omitting it here while disclosing it elsewhere would read as selective honesty.
