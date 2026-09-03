# Phase 16 Handoff — V2.0 launch & hardening (BLOCKED on owner infrastructure)

**Phase:** 16 — Migration, monitoring, rollback for the V2 backend. No new features.
**Status:** ⛔ **Not executed — blocked on infrastructure only Saathvik can provide.**
**Date:** 3 September 2026

---

## Why it is blocked

Phase 16 is an *operations* phase, not a code phase. The V2 backend (Fastify + MongoDB +
admin CMS + publish-to-static) was already **built and unit-tested** in Phases 11–13. What
Phase 16 needs is a live run, and every input to that is external:

- `MONGODB_URI` — unset throughout Phases 11–15. `npm run server` cannot start without it,
  so the first real `npm run publish` (publish-check → `GET /v1/bundle` → write
  `src/content/published/bundle.json` → `npm run build`) has never run against a cluster.
- A **deploy host** for the editing API + admin (must **not** be the Vercel static visitor
  project).
- A **production origin** + login for the visitor site (Phase 10 deploy was already blocked
  on this). Canonicals still say `https://kellos.vercel.app`.

Producing a fake "V2 launched" would violate the project's own honesty stance, so it wasn't
done. The case study's INTERNAL section records V2 as "built but not exercised against a live
cluster."

## What is ready for the moment the infra exists

- `npm run publish` (`server/src/emit.ts`): publish-check (published rows only) → bundle →
  write JSON → `npm run build`, unless `KELLOS_SKIP_DEPLOY=1`.
- Publish **refuses** entities with blockers or unverified links — so the still-open homework
  (A1.1 URL verification, the gallery cut, LangChain `authorship`) gates the first emit by
  design. That's the intended safety, not a bug to work around.
- Visitor read path stays static and DB-free; nested prerender wins over SPA fallback.

## Runbook (for Saathvik, when ready)

1. Set `MONGODB_URI` (and rotate it if it ever appeared in a chat — treat any pasted URI as
   leaked). Set `KELLOS_ADMIN_TOKEN`.
2. `npm run server` (editing API on a host that is **not** the Vercel static project),
   `npm run admin` for the CMS.
3. Clear the homework blockers in the admin (verify links → `verified: true` with a real
   `verifiedAt`; resolve project/skill blockers). Do **not** hand-edit `verified` in source.
4. `npm run publish` → confirm it refuses if anything is still blocked, then succeeds.
5. Commit the emitted `src/content/published/bundle.json` (gitignored by default) once a clean
   emit exists, so the Vercel static build consumes it.
6. Set the real origin, rebuild so canonicals/OG update, deploy, verify the live URL.

## Must not touch

DB/Fastify on the visitor read path · running the editing API/admin on the Vercel static
project · skipping publish-check · inventing `verified: true` or metrics · pushing to the
RolePlay-Chatbot remote · `src/wm/core.ts` purity.
