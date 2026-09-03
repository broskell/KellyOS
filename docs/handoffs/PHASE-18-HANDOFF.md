# Phase 18 Handoff — the Kelly.OS case study

**Phase:** 18 — Write `docs/content/case-studies/kellos.md` from the accumulated handoff
record (the phase the placeholder explicitly deferred to). **Not** inventing the "hard part"
in advance; **not** adding metrics; **not** softening the AI-assistance disclosure.
**Completed:** 3 September 2026

---

## What shipped

`docs/content/case-studies/kellos.md` is now a full case study, drafted at Phase 18 exactly
as the placeholder instructed ("do not write this early"). It follows the same structure as
the LangChain study (Problem · Context · Role · Goals/constraints · Architecture · Stack ·
Implementation · The hard part · What shipped · Result · What I learned · INTERNAL).

Grounded in the real record, not recollection:

- **AI-assistance disclosed up front** in the authorship line and again in Lessons — consistent
  with every other document, per the standing warning against selective honesty.
- **The hard part is the real one**, drawn from the handoffs, not a guess: making an OS
  legible to a recruiter in ninety seconds — deep-linkability (the SPA fallback that ate
  nested prerendered URLs), Reader Mode (first mistaken for a print view), and the version
  system's honest consequence (the update ceremony *cannot fire naturally* today, and faking
  a version bump was refused).
- **Wrong assumptions are quoted as content**: the 0×0 workspace, the discriminated union
  collapsed by a stray `Omit`, the SPA-fallback-vs-prerender bug, and the transparent boot
  from a Tailwind colour class absent in a token-only palette.
- **No invented metrics.** The Result section states plainly that no verified usage numbers
  exist and that inventing them would break the project's core rule.

## INTERNAL section carried in the document

The case study ends with a before-publish checklist: V2 is built but not exercised against a
live cluster (Phase 16 blocked); no verified metrics yet; the KELL.OS → Kelly.OS rename should
be swept for stragglers; and the "what shipped"/status lines need updating once V2 is live and
the site is deployed to its real origin.

## Scope reached

Phases 0–15 and 17 are implemented and green; Phase 16 (V2 live launch) is blocked on
owner-only infrastructure (see PHASE-16-HANDOFF.md); Phase 18 (this) is written. That is the
full 0–18 chain as far as it can go without a Mongo URI, a deploy host, and the outstanding
content homework.

## Must not touch

The AI-assistance disclosure · the no-metrics rule · `src/wm/core.ts` purity · the honesty
stance in the type system.

## Files

`docs/content/case-studies/kellos.md` (placeholder → full case study). Docs only — no code,
no tests affected. Repo still: tsc clean, 80/80 tests, build + prerender clean, no read-path
leak.
