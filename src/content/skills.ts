export interface SkillRow {
  name: string;
  evidence: string;
  scopeNote?: string;
}

export const skillsHowToRead = [
  "Every skill is placed by the kind of evidence behind it, not by how confident I feel. There are no percentages, no five-star ratings, and no progress bars, because those are opinions dressed up as data.",
  'Nothing here claims "I can debug this." I develop AI-assisted, and I can\'t yet point to a specific bug I found and fixed on my own. Until I can, the claim isn\'t made. When I can, it gets promoted — with the specific instance attached.',
] as const;

export const skillTiers = {
  1: {
    title: "Tier 1 — Externally verified",
    subtitle: "Someone outside me paid for it, merged it, or reviewed it.",
    items: [
      {
        name: "Git / GitHub",
        evidence:
          "Merged PR #39301 in `langchain-ai/langchain`",
      },
      {
        name: "Python",
        scopeNote: "narrow — the LangChain contribution only",
        evidence:
          "Same PR, merged into a production open-source codebase. This is not a claim of general Python engineering depth.",
      },
      {
        name: "Excel / spreadsheet data cleaning",
        evidence: "Paid Fiverr client work, 2024 — 3 clients, ~5–6 orders, ~₹30,000 total `⚠ VERIFY`",
      },
    ] satisfies SkillRow[],
  },
  2: {
    title: "Tier 2 — Shipped publicly",
    subtitle: "Used in a live, deployed project I built end to end.",
    names: [
      "React",
      "JavaScript",
      "HTML / CSS",
      "Tailwind CSS",
      "Next.js",
      "Firebase",
      "SQL / PostgreSQL",
      "REST APIs",
      "Python for data work (NumPy, Pandas, Matplotlib, scikit-learn — IIT Jodhpur coursework)",
    ],
  },
  3: {
    title: "Tier 3 — Worked with",
    subtitle: "Used in a project or in coursework. I'd need to look things up.",
    names: [
      "Node.js / Express",
      "Fastify",
      "MongoDB",
      "Three.js",
      "GSAP",
      "Lenis",
      "React Native",
      "Flutter",
      "Docker",
      "Linux / Ubuntu / networking",
      "PHP",
      "Supabase",
      "Prisma",
      "Payload CMS",
      "Zustand",
      "React Three Fiber",
      "Azure",
      "Redis",
      "Socket.IO",
      "AWS",
      "Tableau",
      "Power BI",
      "KNIME",
      "Weka",
      "OpenCV",
      "MediaPipe",
      "React Router",
      "Axios",
      "React Hook Form",
      "Zod",
      "Postman",
      "Hugging Face",
      "Google Colab",
      "Kaggle",
    ],
  },
} as const;
