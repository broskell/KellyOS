# Published ContentBundle drop path

Phase 13 writes `bundle.json` here after `GET /v1/publish-check` succeeds and `GET /v1/bundle` returns.

- **Visitor Vite** imports this file at **build time** (`import.meta.glob`). No Fastify, no Mongo, no fetch on `/`, Reader, or prerender.
- **Vercel** runs `npm run build` only. Commit this JSON after a successful emit if the static host should serve CMS content. Do not run `npm run publish` on the Vercel visitor project.
- Until this file exists, the visitor keeps the Phase 0 hand-authored TypeScript modules.
- Empty published slices fall back to those modules so a partial emit cannot blank About / gallery / Tier 2–3 names.
