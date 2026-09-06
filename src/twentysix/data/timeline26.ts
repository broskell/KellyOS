/**
 * 26' Timeline data — "The Story So Far".
 *
 * The journey is presented as a horizontal pinned carousel (see components/
 * Timeline.tsx): the first entry starts centred, then each next entry slides in
 * from the right while the current one slides off to the left. Each entry is
 * underscored by the interactive `WavePath` line (src/components/ui/wave-path).
 *
 * Order here = display order (oldest → ongoing).
 */

/** A labelled cluster of bullet points inside one entry (e.g. one institution). */
export interface TimelineGroup {
  /** Optional sub-heading (e.g. "IIT Jodhpur"). Omit for a single flat list. */
  heading?: string;
  points: string[];
}

/** A headline stat shown as a pill at the foot of an entry (SGPA / CGPA …). */
export interface TimelineStat {
  label: string;
  value: string;
}

export interface TimelineEntry {
  id: string;
  /** Date range shown as the mono kicker, e.g. "Jun – Aug 2025". */
  date: string;
  title: string;
  /** One-line context under the title (period summary or institutions). */
  subtitle?: string;
  /** Extra meta line (mentor, programme, org) rendered muted. */
  meta?: string;
  groups: TimelineGroup[];
  stats?: TimelineStat[];
  /** Flags the current/ongoing entry for the live pulse marker. */
  ongoing?: boolean;
}

export const timeline: TimelineEntry[] = [
  {
    id: "pre-college",
    date: "Jun – Aug 2025",
    title: "Pre-College Preparation",
    subtitle: "Gap period — self-paced exploration of tech fundamentals",
    groups: [
      {
        points: [
          "Completed Udemy and Google certifications to build foundational tech skills",
          "Sparked deep interest in AI and Data Science",
          "Self-paced learning to prepare for college-level coursework",
        ],
      },
    ],
  },
  {
    id: "sem-1",
    date: "Sep – Dec 2025",
    title: "First Semester — Dual Track Learning",
    subtitle: "IIT Jodhpur + LeapStart School of Technology",
    groups: [
      {
        heading: "IIT Jodhpur",
        points: [
          "Core: Python, SQL, Data Analysis, Prompt Engineering",
          "Libs: NumPy, Pandas, Matplotlib, Scikit-learn",
          "Tools: Colab, Kaggle, KNIME, Hugging Face",
          "Projects: Flashcard app, Quick Commerce analysis",
        ],
      },
      {
        heading: "LeapStart School of Technology",
        points: [
          "Web: HTML5, CSS3, JavaScript, DOM",
          "Systems: Linux, Ubuntu, VirtualBox, Shell",
          "DevOps: Git, GitHub, VS Code",
          "Built: Portfolio, resume & UI replica sites",
        ],
      },
    ],
    stats: [{ label: "Semester 1 SGPA", value: "9.75" }],
  },
  {
    id: "sdlc-workshop",
    date: "Late Dec 2025",
    title: "SDLC Workshop",
    meta: "Mentor: SaiRam Bingi (PMP®, CBAP®, CSM®, ITIL®, PRINCE 2)",
    groups: [
      {
        points: [
          "Learned SDLC fundamentals, business case creation, project charter, and FRD",
          "Applied Project: Rapid Blood Bank Supply Platform (MVP)",
          "Designed FRD and developed working prototype with HTML, CSS, JS, Firebase",
        ],
      },
    ],
  },
  {
    id: "cybersecurity",
    date: "Dec – Jan 2025–26",
    title: "Cybersecurity Tasks",
    subtitle: "Future Interns — Security Assessment Experience",
    groups: [
      {
        points: [
          "Vulnerability assessment on OWASP Juice Shop using Burp Suite on Kali Linux",
          "Identified common web vulnerabilities and analyzed attack flows",
          "Secure File Sharing: Python encryption system using cryptography libraries",
        ],
      },
    ],
  },
  {
    id: "sem-2",
    date: "Jan – May 2026",
    title: "Second Semester — Building Beyond the Classroom",
    subtitle: "IIT Jodhpur + LeapStart School of Technology",
    groups: [
      {
        heading: "IIT Jodhpur",
        points: [
          "Pattern Recognition: Classification, CNN, RNN (Weka, Colab, Kaggle)",
          "Visualization: Matplotlib, Plotly, Tableau, Power BI, Pandas",
          "Foundations of AI: BFS/DFS, A*, Minimax, Nash Equilibrium (Sarvam Chatbot)",
          "Optimization: Gradient Descent, Newton Method, Convex Optimization",
        ],
      },
      {
        heading: "LeapStart School of Technology",
        points: [
          "Frontend: React • React Router • Axios • Hooks • React Hook Form • Zod",
          "Backend: PostgreSQL • PHP • REST APIs • Postman",
          "Linux: SSH • tmux • Disk Management • Ubuntu • Networking • Port Forwarding • Tunneling • Public & Private IPs",
          "Cloud: Azure • Ubuntu VM",
          "Developer Tools: Git • GitHub • VS Code • XAMPP",
          "Hands-on: Built PawSethu during ProdX Buildathon",
          "Industry: Sessions with software engineers and product leaders",
        ],
      },
    ],
    stats: [
      { label: "Semester 2 SGPA", value: "9.25" },
      { label: "Overall CGPA", value: "9.44" },
    ],
  },
  {
    id: "open-source",
    date: "Jun – Aug 2026",
    title: "Open Source & Independent Learning",
    groups: [
      {
        points: [
          "GirlScript Summer of Code Contributor",
          "Google Developer Groups Member",
          "Google BigCode Challenge — Top 1500 among 15,000+ participants",
          "Docker",
          "Cybersecurity",
          "Modern Full Stack Development",
        ],
      },
    ],
  },
  {
    id: "sem-3",
    date: "Ongoing 2026",
    title: "Semester 3 — Ongoing",
    subtitle: "BS Applied AI & Data Science — LeapStart School of Technology",
    ongoing: true,
    groups: [
      {
        points: [
          "Current learning and ongoing projects. Doing DSA problem solving, building AI agents and learning AI engineering, ML…",
        ],
      },
    ],
  },
];
