/**
 * About + Education content — hand-authored (education isn't in the CMS content
 * types). Organised from the resume. Consumed by <About/>.
 */

export const role = "UG @ IITJ × LST";

export const bio: string[] = [
  "I'm Saathvik Kellampalli — a second-year undergrad pursuing a BS in Applied AI & Data Science at IIT Jodhpur, alongside hands-on, project-based learning at LeapStart School of Technology, Hyderabad.",
  "My journey into technology started with curiosity for how things work — from algorithms to operating systems to web applications. During my pre-college gap I dived headfirst into online certifications and never looked back. Now I'm building real products and exploring AI tools.",
  "I believe in learning by building. Every project teaches me something new — voice AI with Groq, secure file sharing with Python's cryptography stack, or a sports-booking platform deployed on Firebase.",
];

/** In-page jump links (map the resume's external links to the 26' sections). */
export interface JumpLink {
  label: string;
  to: string;
}
export const jumpLinks: JumpLink[] = [
  { label: "My Projects", to: "projects" },
  { label: "Tech Stack", to: "techstack" },
  { label: "Timeline", to: "timeline" },
  { label: "Get In Touch", to: "contact" },
];

export interface Interest {
  label: string;
}
export const interests: Interest[] = [
  { label: "AI" },
  { label: "Web Dev" },
  { label: "Linux" },
  { label: "Security" },
  { label: "Data Sci" },
  { label: "Open Source" },
];

export interface CoreValue {
  n: string;
  title: string;
  body: string;
}
export const coreValues: CoreValue[] = [
  {
    n: "01",
    title: "Build First, Overthink Later",
    body: "I learn best when I'm creating. Shipping a rough prototype beats planning forever.",
  },
  {
    n: "02",
    title: "Curiosity as a Skill",
    body: "I actively explore new tools, frameworks, and ideas — from OWASP Juice Shop to Suno AI.",
  },
  {
    n: "03",
    title: "Quality over Quantity",
    body: "A well-crafted solution that solves a real problem is worth more than ten half-baked ones.",
  },
  {
    n: "04",
    title: "Consistency Compounds",
    body: "Daily progress — even small — is how I've gone from zero to a 9.44 CGPA and 20+ deployed apps.",
  },
];

export const quote =
  "Driven by curiosity and a passion for technology, I actively seek out new knowledge and hands-on experience with AI, open-source systems, and modern web frameworks to solve real-world challenges.";

export interface Achievement {
  highlight: string;
  detail: string;
}
export const achievements: Achievement[] = [
  { highlight: "Top 1500", detail: "out of 15,000+ in the Google BigCode Challenge" },
  { highlight: "GSSoC", detail: "GirlScript Summer of Code Contributor" },
  { highlight: "GDG", detail: "Google Developer Groups Member" },
];

/** A single education entry, rendered as a terminal-style panel. */
export interface EduEntry {
  institution: string;
  program: string;
  duration: string;
  /** Extra label→value rows (SGPA, CGPA, current semester, track…). */
  rows?: { label: string; value: string }[];
}
export const education: EduEntry[] = [
  {
    institution: "Indian Institute of Technology, Jodhpur",
    program: "BS in Applied AI & Data Science",
    duration: "2025 – 2029",
    rows: [
      { label: "SGPA", value: "9.75 (Sem 1) · 9.25 (Sem 2)" },
      { label: "CGPA", value: "9.44 / 10 (Overall)" },
      { label: "Semester", value: "3 — Ongoing" },
    ],
  },
  {
    institution: "LeapStart School of Technology, Hyderabad",
    program: "Experiential Learning (Dual Track)",
    duration: "2025 – 2029",
  },
];
