/**
 * Projects shown in the 26' Projects section (#projects).
 *
 * This is the 26'-owned selection/order adapter — a clean, self-contained shape
 * (independent of the retro `content/projects.ts`). Order here IS the display
 * order in the accordion. Covers live under `public/content-assets/projects/`;
 * a missing / broken cover falls back to an initials tile, so entries never break.
 */

export interface Project26 {
  /** Stable id (used for keys). */
  id: string;
  title: string;
  /** One-line summary shown on the expanded slat. */
  tagline: string;
  /** Cover image path (public/…) or remote URL. Missing/404 → initials tile. */
  cover?: string;
  /** Optional year / period badge. */
  year?: string;
  /** Tech-stack chips shown in the detail modal. */
  stack: string[];
  /** Modal body — one string per paragraph. */
  description: string[];
  /** Optional highlight bullets in the modal. */
  highlights?: string[];
  /** External links. Omit a field to hide that button. */
  links?: {
    live?: string;
    repo?: string;
  };
  /** Muted status label shown when there's no live/repo link (e.g. unreleased). */
  status?: string;
}

export const projects: Project26[] = [
  {
    id: "alimony-ai",
    title: "Alimony.AI",
    tagline:
      "Enterprise-grade legal-tech SaaS for AI-powered matrimonial & family-law assistance in India.",
    cover: "/content-assets/projects/alimony-ai.jpg",
    stack: [
      "React 18",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "Zustand",
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL",
      "Google Gemini",
    ],
    description: [
      "An enterprise-grade legal-tech SaaS platform providing AI-powered matrimonial and family-law assistance in India.",
      "It empowers individuals and legal professionals with advanced alimony calculation engines, bar-verified lawyer discovery and booking, active case management, legal document drafting, and real-time legal research tools.",
    ],
    highlights: [
      "Alimony & maintenance calculator implementing Supreme Court guidelines (Rajnesh v. Neha, 2020) across 12 statutory factors, dependents, and state-specific multipliers.",
      "Bar Council–verified lawyer discovery with state / city / language / budget filters and full appointment scheduling.",
      "Lex AI — a streaming legal-research assistant specialized in Indian family law (HMA, SMA, DV Act, CrPC §125) with context-aware precedent suggestions.",
      "Case-management tracker with automated AI-generated case briefs, plus instant legal-document generation.",
      "Court-ready PDF reports and a full library of Acts, sections, and landmark precedents.",
    ],
    links: {
      live: "https://alimony-ai.vercel.app",
      repo: "https://github.com/broskell/Alimony.AI",
    },
  },
  {
    id: "ducati-desmosedici-v4",
    title: "Ducati Desmosedici V4",
    tagline:
      "Premium interactive scrollytelling — a cinematic, scroll-driven showcase of the Panigale V4.",
    cover: "/content-assets/projects/ducati.jpg",
    stack: [
      "JavaScript",
      "Vite",
      "HTML5 Canvas",
      "GSAP",
      "ScrollTrigger",
      "Framer Motion",
      "Python",
      "PWA",
    ],
    description: [
      "An immersive, highly-optimized interactive product showcase for the Ducati Panigale V4 — built with high-performance canvas scrubbing, responsive composition scaling, and a magazine-style editorial layout.",
      "Act I — The Assembly: a pinned, scroll-driven cinematic canvas where you control the mechanical disassembly and reassembly of the V4, from a bold hero entrance through a distraction-free scroll to a minimal specs board.",
      "Act II — The Anatomy: the canvas unpins into a premium editorial grid of technical articles styled like a luxury print magazine — close-up photography, composite specs, and mechanical breakdowns.",
    ],
    highlights: [
      "Pinned canvas sequence with frames responding continuously to scroll speed.",
      "Specs reveal board: displacement, power, torque, weight, top speed.",
      "Editorial magazine grid for deep technical articles.",
    ],
    links: {
      live: "https://ducati-scrollytelling.vercel.app",
      repo: "https://github.com/broskell/Ducati-Scrollytelling",
    },
  },
  {
    id: "lodestar",
    title: "LODESTAR",
    tagline:
      "Autonomous logistics exception agent — understand the mess, act on it, prove it moved.",
    cover: "/content-assets/projects/lodestar.jpg",
    stack: [
      "Python 3.13",
      "FastAPI",
      "Google Gemini",
      "Groq",
      "Server-Sent Events",
      "GSAP",
      "Twilio",
      "Resend",
      "Pillow",
    ],
    description: [
      "An autonomous logistics exception agent. Most agents take an action and claim victory — this one re-reads the world and proves it moved.",
      "It extracts entities from messy exceptions (LLM + regex net, plus vision OCR with an on-disk cache), gates on per-field confidence and raises a clarifying question when input is ambiguous, then runs a plan → tool → observe loop with verify / notify / permanent-fail guards.",
      "Execution is idempotent with retry and transient/permanent failure classification; after acting it re-reads authoritative state and computes a field-level before/after diff, streamed live over SSE into an editorial console with a plain-language trace and a “prove it” list.",
    ],
    highlights: [
      "Provider-agnostic tool calling: Gemini primary → Groq failover, and never raises.",
      "Confidence gate raises a clarifying question on ambiguous custom input.",
      "Idempotent execution with retry + transient/permanent failure classing.",
      "Verify-and-diff: re-reads authoritative state, computes field-level before/after.",
      "Live SSE streaming into an editorial console with a “prove it” list.",
    ],
    links: {
      live: "https://hackathon-citarise-production.up.railway.app/",
      repo: "https://github.com/broskell/Hackathon-Citarise",
    },
  },
  {
    id: "pawsethu",
    title: "PawSethu",
    tagline: "Pet digital-identity platform — a scannable ID for every pet, in one cross-platform app.",
    cover: "/content-assets/projects/pawsethu.jpg",
    stack: [
      "Fastify",
      "TypeScript",
      "MongoDB Atlas",
      "GridFS",
      "Firebase Auth",
      "Firebase Cloud Messaging",
      "Razorpay",
      "Expo",
      "React Native",
    ],
    description: [
      "A pet digital-identity platform: every pet gets a scannable QR that resolves to a server-rendered public profile, backed by a full mobile app.",
      "Built as a monorepo — a Fastify + TypeScript API (MongoDB via Mongoose + GridFS for files, QR generation, Razorpay payments, and a server-rendered public profile at /p/:uid) alongside an Expo React Native client using Expo Router, with shared types and enums across both.",
    ],
    highlights: [
      "Scannable QR → server-rendered public pet profile (/p/:uid).",
      "Firebase Auth (email + Google) and Cloud Messaging for notifications.",
      "File storage via MongoDB GridFS; QR render with qrcode + sharp.",
      "Razorpay (test) payments integrated.",
    ],
    status: "Android app — preparing Play Store release",
  },
];
