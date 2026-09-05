/**
 * Tech list for the 26' Tech Stack sphere (#techstack).
 *
 * Each entry is one node on the rotating sphere. Clicking a node selects the
 * tech and drives the skill-rate bar in the SkillModal popup. The list is derived from
 * `src/content/skills.ts` so the claims stay honest: `tier` mirrors that file's
 * evidence system (1 = externally verified, 2 = shipped publicly, 3 = worked
 * with), NOT a made-up percentage.
 *
 * Logos come from the Simple Icons CDN in each brand's own colour (so the sphere
 * / grid reads as a colourful set of real tech logos, sitting on light chips).
 * If a logo ever fails to load, `fallbackSrc` is a self-contained initials chip,
 * so the sphere never shows a broken image.
 */

export type SkillTier = 1 | 2 | 3;

export interface Tech {
  id: string;
  name: string;
  /** Simple Icons slug → logo URL. */
  slug: string;
  tier: SkillTier;
  category: string;
  /** One evidence line, mirrored from skills.ts. */
  evidence: string;
}

/** Human-readable meaning of each tier (from skills.ts). */
export const TIER_META: Record<SkillTier, { label: string; blurb: string }> = {
  1: { label: "Externally verified", blurb: "Merged, paid for, or reviewed by someone outside me." },
  2: { label: "Shipped publicly", blurb: "Used in a live, deployed project I built end to end." },
  3: { label: "Worked with", blurb: "Used in a project or coursework — I'd look things up." },
};

/** Brand-colour Simple Icons logo (sits on a light chip). */
export function logoUrl(slug: string): string {
  return `https://cdn.simpleicons.org/${slug}`;
}

/**
 * Brand colours that are near-black — invisible on the dark grid chips — so the
 * grid serves them in a light tint instead. Everything else keeps its colour.
 */
const DARK_BRANDS = new Set([
  "github",
  "nextdotjs",
  "express",
  "fastify",
  "threedotjs",
  "socketdotio",
  "prisma",
  "pandas",
  "numpy",
]);

/** Logo URL for the dark ("grid") chips: light-tinted for near-black brands. */
export function gridLogoUrl(slug: string): string {
  return DARK_BRANDS.has(slug)
    ? `https://cdn.simpleicons.org/${slug}/f2f2f2`
    : `https://cdn.simpleicons.org/${slug}`;
}

/**
 * Self-contained initials chip used if the CDN logo can't load. `dark` flips it
 * for the black grid chips (light text on dark), else light chip / dark text.
 */
export function initialsFallback(name: string, dark = false): string {
  const initials = name
    .replace(/[^a-zA-Z0-9 .]/g, "")
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const bg = dark ? "#161616" : "#eeeeee";
  const fg = dark ? "#e8e8e8" : "#222222";
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">` +
    `<rect width="120" height="120" fill="${bg}"/>` +
    `<text x="60" y="60" font-family="ui-monospace,Menlo,monospace" font-size="44" ` +
    `font-weight="700" fill="${fg}" text-anchor="middle" dominant-baseline="central">${initials}</text>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const RAW: Omit<Tech, "id">[] = [
  // ── Tier 1 · externally verified ──────────────────────────────
  { name: "Git / GitHub", slug: "github", tier: 1, category: "Tools", evidence: "Merged PR #39301 in langchain-ai/langchain." },
  { name: "Python", slug: "python", tier: 1, category: "Languages", evidence: "Same merged LangChain PR (narrow — not general Python depth)." },

  // ── Tier 2 · shipped publicly ─────────────────────────────────
  { name: "React", slug: "react", tier: 2, category: "Frontend", evidence: "Live, deployed projects built end to end." },
  { name: "JavaScript", slug: "javascript", tier: 2, category: "Languages", evidence: "Shipped across deployed front-ends." },
  { name: "HTML / CSS", slug: "html5", tier: 2, category: "Frontend", evidence: "Every deployed project's markup + styling." },
  { name: "Tailwind CSS", slug: "tailwindcss", tier: 2, category: "Frontend", evidence: "Styling system on shipped projects." },
  { name: "Next.js", slug: "nextdotjs", tier: 2, category: "Frontend", evidence: "Used in a live, deployed project." },
  { name: "Firebase", slug: "firebase", tier: 2, category: "Backend", evidence: "Auth + data in a shipped project." },
  { name: "PostgreSQL", slug: "postgresql", tier: 2, category: "Data", evidence: "SQL / PostgreSQL behind a deployed app." },
  { name: "NumPy", slug: "numpy", tier: 2, category: "Data", evidence: "IIT Jodhpur data-work coursework." },
  { name: "Pandas", slug: "pandas", tier: 2, category: "Data", evidence: "IIT Jodhpur data-work coursework." },
  { name: "scikit-learn", slug: "scikitlearn", tier: 2, category: "Data", evidence: "IIT Jodhpur ML coursework." },

  // ── Tier 3 · worked with ──────────────────────────────────────
  { name: "Node.js", slug: "nodedotjs", tier: 3, category: "Backend", evidence: "Server-side work in projects/coursework." },
  { name: "Express", slug: "express", tier: 3, category: "Backend", evidence: "REST endpoints in projects." },
  { name: "Fastify", slug: "fastify", tier: 3, category: "Backend", evidence: "This portfolio's CMS server." },
  { name: "MongoDB", slug: "mongodb", tier: 3, category: "Data", evidence: "Document store in the CMS." },
  { name: "Three.js", slug: "threedotjs", tier: 3, category: "Frontend", evidence: "3D scenes in project work." },
  { name: "GSAP", slug: "greensock", tier: 3, category: "Frontend", evidence: "Motion system across this site." },
  { name: "Flutter", slug: "flutter", tier: 3, category: "Mobile", evidence: "Cross-platform app coursework." },
  { name: "Docker", slug: "docker", tier: 3, category: "DevOps", evidence: "Containerised dev environments." },
  { name: "Linux / Ubuntu", slug: "ubuntu", tier: 3, category: "DevOps", evidence: "Daily driver + networking basics." },
  { name: "PHP", slug: "php", tier: 3, category: "Backend", evidence: "Coursework / small projects." },
  { name: "Supabase", slug: "supabase", tier: 3, category: "Backend", evidence: "Postgres backend in a project." },
  { name: "Prisma", slug: "prisma", tier: 3, category: "Data", evidence: "Typed DB access layer." },
  { name: "Redis", slug: "redis", tier: 3, category: "Data", evidence: "Caching / sessions." },
  { name: "Socket.IO", slug: "socketdotio", tier: 3, category: "Backend", evidence: "Real-time features." },
  { name: "OpenCV", slug: "opencv", tier: 3, category: "Data", evidence: "Computer-vision coursework." },
  { name: "React Router", slug: "reactrouter", tier: 3, category: "Frontend", evidence: "Routing in React apps." },
  { name: "Axios", slug: "axios", tier: 3, category: "Frontend", evidence: "HTTP client in projects." },
  { name: "Zod", slug: "zod", tier: 3, category: "Tools", evidence: "Runtime schema validation." },
  { name: "Postman", slug: "postman", tier: 3, category: "Tools", evidence: "API design / testing." },
  { name: "Hugging Face", slug: "huggingface", tier: 3, category: "Data", evidence: "Model exploration." },
  { name: "Kaggle", slug: "kaggle", tier: 3, category: "Data", evidence: "Datasets + notebooks." },
];

export const tech: Tech[] = RAW.map((t) => ({
  id: t.slug,
  ...t,
}));

/** Sphere-node image payload for <SphereImageGrid/>. */
export const techImages = tech.map((t) => ({
  id: t.id,
  src: logoUrl(t.slug),
  alt: `${t.name} logo`,
  title: t.name,
  fallbackSrc: initialsFallback(t.name),
}));

export const techById = new Map(tech.map((t) => [t.id, t] as const));
