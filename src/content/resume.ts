import { makeBlocks } from "./makeBlocks";

/** Phase 0 résumé section contract. Graduation date and location are not invented. PDF withheld. */
export const resumeBlocks = makeBlocks([
  {
    id: "resume_h",
    type: "heading",
    level: 2,
    text: "Saathvik Kellampalli",
    anchor: "header",
  },
  {
    id: "resume_sub",
    type: "prose",
    text: "BS Applied AI & Data Science, IIT Jodhpur",
  },
  {
    id: "resume_header_open",
    type: "callout",
    variant: "caution",
    title: "Header fields not published",
    text: "Expected graduation date and location are not on this page. They are marked VERIFY in Phase 0 and will appear here only when they are known.",
  },
  {
    id: "resume_channels",
    type: "keyValue",
    title: "Contact",
    rows: [
      { key: "Email", value: "[saathvik.kp@gmail.com](mailto:saathvik.kp@gmail.com)" },
      { key: "GitHub", value: "[github.com/broskell](https://github.com/broskell)" },
      {
        key: "LinkedIn",
        value: "[linkedin.com/in/kellampalli-saathvik](https://www.linkedin.com/in/kellampalli-saathvik/)",
      },
    ],
  },
  {
    id: "resume_pdf",
    type: "callout",
    variant: "caution",
    title: "PDF download withheld",
    text: "The existing résumé PDF is not current (last updated November 2025 per file date, confirmed out of date). It must be rewritten to match this structure before launch. There is no download until then.",
  },
  {
    id: "resume_sum_h",
    type: "heading",
    level: 2,
    text: "Summary",
    anchor: "summary",
  },
  {
    id: "resume_sum",
    type: "prose",
    text: "I'm a second-year Applied AI & Data Science student at IIT Jodhpur who ships full-stack products end to end — with a merged contribution to `langchain-ai/langchain` to show it holds up in someone else's production codebase.",
  },
  {
    id: "resume_edu_h",
    type: "heading",
    level: 2,
    text: "Education",
    anchor: "education",
  },
  {
    id: "resume_edu",
    type: "list",
    style: "bullet",
    items: [
      "IIT Jodhpur — BS Applied AI & Data Science, 2025–present. CGPA 9.44 (SGPA 9.75, 9.25)",
      "LeapStart School of Technology — parallel programme, 2025–2026",
      "Intermediate (MPC), 2023–2024",
    ],
  },
  {
    id: "resume_os_h",
    type: "heading",
    level: 2,
    text: "Open source & recognition",
    anchor: "open-source",
  },
  {
    id: "resume_os_note",
    type: "prose",
    text: "Placed above projects because it is the only externally verified engineering.",
  },
  {
    id: "resume_os",
    type: "list",
    style: "bullet",
    items: [
      "Merged feature PR, `langchain-ai/langchain` (#39301), 2026",
      "GirlScript Summer of Code — contributor, 2026",
      "Google BigCode Challenge — top 1,500 of 15,000+ participants, 2026",
      "Google Developer Groups — member, 2025–present",
    ],
  },
  {
    id: "resume_proj_h",
    type: "heading",
    level: 2,
    text: "Selected projects",
    anchor: "projects",
  },
  {
    id: "resume_proj",
    type: "list",
    style: "bullet",
    items: [
      "LangChain OpenRouter provider — merged feature PR #39301 (the only complete case study)",
      "Roast My Project — gallery until technical review; not a case study",
      "PawSethu — gallery until technical review; not a case study",
    ],
  },
  {
    id: "resume_exp_h",
    type: "heading",
    level: 2,
    text: "Experience",
    anchor: "experience",
  },
  {
    id: "resume_exp",
    type: "list",
    style: "bullet",
    items: [
      "Freelance data processing, Fiverr — 2024. 3 clients, ~5–6 orders, ~₹30,000 `⚠ VERIFY`",
      "No internships listed. Godstockss, Future Interns (as a credential), and FlyRank AI (as a credential) are excluded.",
    ],
  },
  {
    id: "resume_skills_h",
    type: "heading",
    level: 2,
    text: "Technical skills",
    anchor: "skills",
  },
  {
    id: "resume_skills",
    type: "prose",
    text: "Three evidence tiers — see Skills. Compressed here: Git/GitHub, Python (LangChain PR only), Excel data cleaning; React, JavaScript, HTML/CSS, Tailwind, Next.js, Firebase, SQL/PostgreSQL, REST APIs, Python data libraries; plus a longer worked-with list behind expand on Skills.",
  },
  {
    id: "resume_cw_h",
    type: "heading",
    level: 2,
    text: "Coursework",
    anchor: "coursework",
  },
  {
    id: "resume_cw",
    type: "prose",
    text: "Pattern Recognition, AI foundations, optimisation, data visualisation",
  },
]);
