export const COLLECTIONS = {
  projects: "projects",
  skills: "skills",
  timeline: "timeline",
  now: "now",
  versions: "versions",
  assets: "assets",
} as const;

/**
 * Floor validators. Discriminated ContentBlock unions are enforced in
 * `src/content/honesty.ts`. Mongo only rejects missing identity / publish keys.
 */
export const PROJECT_VALIDATOR = {
  $jsonSchema: {
    bsonType: "object",
    required: ["_id", "id", "slug", "title", "authorship", "tier", "status", "blocks", "role", "publish"],
    properties: {
      authorship: { enum: ["manual", "aiAssisted", "aiGenerated"] },
      tier: { enum: ["caseStudy", "gallery", "recycled"] },
      "publish.status": { enum: ["draft", "review", "published"] },
    },
  },
};

export const SKILL_VALIDATOR = {
  $jsonSchema: {
    bsonType: "object",
    required: ["_id", "id", "name", "tier", "evidence", "publish"],
    properties: {
      tier: { enum: [1, 2, 3] },
      evidence: { bsonType: "array", minItems: 1 },
    },
    not: {
      anyOf: [
        { required: ["proficiency"] },
        { required: ["percent"] },
        { required: ["percentage"] },
        { required: ["meter"] },
        { required: ["rating"] },
        { required: ["stars"] },
        { required: ["ability"] },
        { required: ["score"] },
        { required: ["levelPercent"] },
        { required: ["canDebug"] },
      ],
    },
  },
};
