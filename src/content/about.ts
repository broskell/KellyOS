import { makeBlocks } from "./makeBlocks";

/** Phase 0 app-content.md §1–§2. Words unchanged. */
export const aboutBlocks = makeBlocks([
  {
    id: "about_h",
    type: "heading",
    level: 2,
    text: "Saathvik Kellampalli",
    anchor: "saathvik-kellampalli",
  },
  {
    id: "about_sub",
    type: "prose",
    emphasis: "lead",
    text: "Second year, BS in Applied AI & Data Science — IIT Jodhpur",
  },
  {
    id: "about_p1",
    type: "prose",
    text: "I build things and put them on the internet.",
  },
  {
    id: "about_p2",
    type: "prose",
    text: "I'm two years into a BS in Applied AI & Data Science at IIT Jodhpur, and I've spent most of that time building — around two dozen projects across web apps, AI tools, mobile, and scroll-driven 3D. Some are live. Most were built to learn something. A few are in the Recycle Bin, where they belong.",
  },
  {
    id: "about_p3",
    type: "prose",
    text: "Before college I did paid data work on Fiverr — cleaning and reformatting messy PDFs and spreadsheets for three clients through 2024. It wasn't engineering, but it was the first time someone paid me for output, and it taught me what a deadline actually is.",
  },
  {
    id: "about_p4",
    type: "prose",
    text: "The thing I'm most pleased with is small: a feature PR merged into `langchain-ai/langchain`. Someone offered me freelance work on the condition that I could land a contribution in a repository that size. I'd never touched it. I found a real gap in the OpenRouter integration, wrote it up, fixed it, and it was merged within 24 hours. That's the first time my code was judged by people who had no reason to be kind about it.",
  },
  {
    id: "about_disclosure",
    type: "callout",
    variant: "disclosure",
    title: "One thing you should know before you read anything else here",
    text: "I develop AI-assisted. Most of what I've shipped was built that way. I'm not hiding it, because I think the interesting question isn't whether you use the tools — it's whether you can tell when they're wrong. I'm still building that. The skills section on this site is graded on evidence, not on confidence, and you'll notice nothing on it claims I can debug anything yet. That's deliberate, and it'll change as I earn it.\n\nI'd rather you find this out here than in an interview.",
  },
  {
    id: "about_do_h",
    type: "heading",
    level: 2,
    text: "What I Do",
    anchor: "what-i-do",
  },
  {
    id: "about_do_lead",
    type: "prose",
    emphasis: "lead",
    text: "I take an idea to a live URL, on my own, quickly.",
  },
  {
    id: "about_do_p",
    type: "prose",
    text: "That's the core of it. Give me a spec and I'll come back with a deployed, working product — frontend, backend, database, auth, deployment. I've done it across:",
  },
  {
    id: "about_do_list",
    type: "list",
    style: "bullet",
    items: [
      "**AI product plumbing** — multi-provider LLM routing with fallback, document generation, chat interfaces, transcription and summarisation pipelines",
      "**Full-stack web apps** — React and Next.js front ends, Node/Express and Fastify services, MongoDB and PostgreSQL, Firebase auth",
      "**Interaction and motion work** — scroll-driven experiences built with Three.js, GSAP and Lenis",
      "**Mobile** — React Native and Flutter, including a custom keyboard with a syncing content backend",
    ],
  },
  {
    id: "about_do_feel",
    type: "prose",
    text: "Secondary to that, I care about how interfaces feel. This site is the argument for that.",
  },
  {
    id: "about_do_good",
    type: "prose",
    text: "**What I'm good for right now:** shipping features fast, getting productive in a codebase I've never seen, working alone without much supervision, and being honest about the state of what I've built.",
  },
  {
    id: "about_do_not",
    type: "prose",
    text: "**What I'm not claiming yet:** deep independent debugging, sole ownership of a production system with real users on it, or ML engineering. I've done ML coursework at IIT Jodhpur — Pattern Recognition, CNNs and RNNs, optimisation — but I haven't shipped an ML system, so I don't put it forward as a skill.",
  },
  {
    id: "about_not_yet",
    type: "callout",
    variant: "limitation",
    title: "Not yet",
    text: "Not yet for sole ownership of production systems.",
  },
]);
