/**
 * Phase 13 publish-to-static sequence.
 *
 * Full emit (write + Vite rebuild) is `npm run publish` against the editing API.
 * This admin desk may POST /v1/emit after publish-check — that writes JSON on the
 * API host. It does not fetch Mongo from the visitor origin. GET /v1/bundle is
 * still preview-only.
 */
export const PHASE_13_SEQUENCE = [
  "GET /v1/publish-check — refuse emit when ok is false",
  "GET /v1/bundle — ContentBundle projection (no dist/, no deploy)",
  "Emit: write src/content/published/bundle.json, then npm run build (CLI)",
] as const;
