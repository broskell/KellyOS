import { resolveOpenQuery } from "../../registry/resolve";

/**
 * Kelly.AI — deterministic intent matching. **No LLM (locked, §3.8).** It routes
 * questions to real content and real apps; it never generates an answer it
 * cannot source. Every content reply names its source surface and links there.
 * This module is pure and testable — the window only renders what it returns.
 */

export interface KellAnswer {
  kind: "content" | "nav" | "help" | "fallback";
  text: string;
  /** The surface this answer is sourced from (honesty: always attributed). */
  source?: string;
  /** Optional app to open (registry path). */
  open?: { label: string; path: string };
  /** Optional Reader-Mode document. */
  reader?: { label: string; path: string };
  /** Follow-up prompts the visitor can click. */
  suggestions?: string[];
}

interface Topic {
  id: string;
  keywords: string[];
  build: () => KellAnswer;
}

const CASE_STUDY_PATH = "/project/langchain-openrouter-provider";

/**
 * Content index. Each topic's text is an honest summary of Phase 0 content, not
 * an invented fact. The visitor is always pointed at the real surface.
 */
const TOPICS: Topic[] = [
  {
    id: "about",
    keywords: ["who", "about", "yourself", "you", "saathvik", "bio", "introduce", "background"],
    build: () => ({
      kind: "content",
      source: "About Me",
      text: "Saathvik Kellampalli — a second-year BS Applied AI & Data Science student at IIT Jodhpur who ships full-stack products end to end. He develops AI-assisted, and says so on the page.",
      open: { label: "Open About Me", path: "/about" },
      reader: { label: "Read", path: "/read/about" },
    }),
  },
  {
    id: "honesty",
    keywords: ["ai-assisted", "ai assisted", "honest", "honesty", "disclosure", "cheat", "really build", "generate"],
    build: () => ({
      kind: "content",
      source: "About Me · the honesty stance",
      text: "He develops AI-assisted, stated early in every document — it's the positioning, not a disclaimer. Skills claim evidence, not ability. No number appears without a source.",
      open: { label: "Open About Me", path: "/about" },
      reader: { label: "Read", path: "/read/about" },
    }),
  },
  {
    id: "skills",
    keywords: ["skill", "skills", "stack", "tech", "technologies", "languages", "framework", "good at", "know"],
    build: () => ({
      kind: "content",
      source: "Skills",
      text: "Skills are graded by evidence type — Tier 1 externally verified, Tier 2 shipped publicly, Tier 3 worked with. Never percentages, stars, or progress bars.",
      open: { label: "Open Skills", path: "/skills" },
      reader: { label: "Read", path: "/read/skills" },
    }),
  },
  {
    id: "projects",
    keywords: ["project", "projects", "case study", "langchain", "work", "portfolio", "built", "shipped", "pr"],
    build: () => ({
      kind: "content",
      source: "Projects · Case Study",
      text: "The flagship is a merged feature PR in langchain-ai/langchain (#39301) — the one externally verified engineering piece. Around two dozen projects total, most gallery-tier.",
      open: { label: "Open the LangChain case study", path: CASE_STUDY_PATH },
      reader: { label: "Read", path: "/read/project/langchain-openrouter-provider" },
    }),
  },
  {
    id: "experience",
    keywords: ["experience", "resume", "cv", "résumé", "job", "history", "career", "fiverr", "internship"],
    build: () => ({
      kind: "content",
      source: "Résumé · Timeline",
      text: "Paid Fiverr data-cleaning in 2024 (~₹30,000, approximate); IIT Jodhpur + LeapStart School of Technology; GSoC contributor; BigCode Challenge top 1,500 of 15,000+.",
      open: { label: "Open Résumé", path: "/resume" },
      reader: { label: "Read", path: "/read/resume" },
    }),
  },
  {
    id: "education",
    keywords: ["education", "college", "university", "iit", "jodhpur", "degree", "cgpa", "study", "leapstart"],
    build: () => ({
      kind: "content",
      source: "Résumé",
      text: "BS in Applied AI & Data Science at IIT Jodhpur (CGPA 9.44), with a parallel programme at LeapStart School of Technology.",
      open: { label: "Open Résumé", path: "/resume" },
      reader: { label: "Read", path: "/read/resume" },
    }),
  },
  {
    id: "contact",
    keywords: ["contact", "email", "hire", "reach", "linkedin", "github", "message", "get in touch"],
    build: () => ({
      kind: "content",
      source: "Contact",
      text: "Reach him via email, GitHub, LinkedIn, and X — all on the Contact page. Phone and Discord are deliberately not published.",
      open: { label: "Open Contact", path: "/contact" },
      reader: { label: "Read", path: "/read/contact" },
    }),
  },
  {
    id: "now",
    keywords: ["now", "currently", "current", "these days", "working on", "doing", "latest"],
    build: () => ({
      kind: "content",
      source: "Now",
      text: "Right now: building Kelly.OS, independent study in Docker, cybersecurity, and full-stack, and Semester 3 at IIT Jodhpur. The Now page is visibly dated.",
      open: { label: "Open Now", path: "/now" },
      reader: { label: "Read", path: "/read/now" },
    }),
  },
  {
    id: "timeline",
    keywords: ["timeline", "version", "versions", "era", "eras", "history", "1.0", "2.0", "3.0", "update"],
    build: () => ({
      kind: "content",
      source: "Timeline · OS Update",
      text: "2023 → present in three real eras: 1.0 ORIGIN, 2.0 the volume era, 3.0 external verification. New visitors boot the newest. Time-travel in OS Update.",
      open: { label: "Open Timeline", path: "/timeline" },
      reader: { label: "Read", path: "/read/timeline" },
    }),
  },
  {
    id: "recycle",
    keywords: ["recycle", "abandoned", "failed", "trash", "dead", "gave up", "quit"],
    build: () => ({
      kind: "content",
      source: "Recycle Bin",
      text: "The Recycle Bin holds genuinely abandoned projects — thin and true, not a joke folder.",
      open: { label: "Open Recycle Bin", path: "/recycle" },
      reader: { label: "Read", path: "/read/recycle" },
    }),
  },
  {
    id: "reader",
    keywords: ["reader", "plain", "document", "accessible", "no js", "text only", "screen reader"],
    build: () => ({
      kind: "content",
      source: "Reader Mode",
      text: "Reader Mode strips the OS to a plain, linkable document — the 90-second path. Press Alt+R anywhere.",
      reader: { label: "Open Reader Mode", path: "/read/about" },
    }),
  },
];

const OPEN_VERBS = ["open", "launch", "go to", "goto", "show me", "show", "take me to", "start"];

function helpAnswer(): KellAnswer {
  return {
    kind: "help",
    text: "I'm Kelly.AI — a deterministic assistant. I match your question to real content on this site and open the right app. I don't generate answers, and I never invent facts. Try asking about:",
    suggestions: ["projects", "skills", "experience", "contact", "what is he doing now", "open resume"],
  };
}

function fallbackAnswer(): KellAnswer {
  return {
    kind: "fallback",
    text: "I can't answer that from what's on this site — and I won't make something up. Try Search (Ctrl+K) for any app, or ask me about:",
    suggestions: ["about", "projects", "skills", "experience", "contact", "timeline"],
  };
}

function scoreTopic(q: string, topic: Topic): number {
  let score = 0;
  for (const k of topic.keywords) {
    if (q === k) score += 3;
    else if (q.includes(k)) score += k.includes(" ") ? 2 : 1;
  }
  return score;
}

/** Strip a leading open-verb, returning the remainder if one was present. */
function stripOpenVerb(q: string): string | null {
  for (const v of OPEN_VERBS) {
    if (q === v) return "";
    if (q.startsWith(v + " ")) return q.slice(v.length + 1).trim();
  }
  return null;
}

export function answerFor(raw: string): KellAnswer {
  const q = raw.trim().toLowerCase();
  if (!q) return helpAnswer();
  if (["help", "?", "what can you do", "commands"].includes(q)) return helpAnswer();
  if (["who are you", "what are you", "are you an ai", "are you chatgpt", "llm"].includes(q)) {
    return {
      kind: "help",
      text: "I'm Kelly.AI — deterministic intent matching over this site's content and app registry. No large language model, by design. I route you to real answers; I don't write them.",
      suggestions: ["projects", "skills", "contact"],
    };
  }

  // Explicit "open X" → registry navigation.
  const target = stripOpenVerb(q);
  if (target !== null) {
    if (!target) return { kind: "help", text: "Open what? Name an app, e.g. “open projects”.", suggestions: ["open projects", "open resume", "open contact"] };
    const r = resolveOpenQuery(target, "search");
    if (r.ok) {
      return {
        kind: "nav",
        text: `Opening ${r.target.title}.`,
        open: { label: `Open ${r.target.title}`, path: r.target.path },
      };
    }
    // fall through to topic matching if the app name wasn't recognised
  }

  // Best content topic.
  const ranked = TOPICS.map((t) => ({ t, s: scoreTopic(q, t) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  if (ranked.length) return ranked[0].t.build();

  // Bare app name (no verb) → navigation.
  const r = resolveOpenQuery(q, "search");
  if (r.ok) {
    return {
      kind: "nav",
      text: `That's an app — ${r.target.title}.`,
      open: { label: `Open ${r.target.title}`, path: r.target.path },
    };
  }

  return fallbackAnswer();
}
