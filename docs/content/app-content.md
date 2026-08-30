# KELL.OS — Final App Content

**Status:** Phase 0 deliverable. Written in Saathvik's voice from Intake Rounds 1–5.
**Rule:** Every factual claim below traces to an intake answer. Nothing is invented.
Anything requiring verification is marked `⚠ VERIFY`.

**Boundary:** This document contains **words only**. No layout, no visual treatment, no
typography, no colour. Phase 1 decides how any of this looks.

---

## 1. About Me

> **Saathvik Kellampalli**
> Second year, BS in Applied AI & Data Science — IIT Jodhpur

I build things and put them on the internet.

I'm two years into a BS in Applied AI & Data Science at IIT Jodhpur, and I've spent most
of that time building — around two dozen projects across web apps, AI tools, mobile, and
scroll-driven 3D. Some are live. Most were built to learn something. A few are in the
Recycle Bin, where they belong.

Before college I did paid data work on Fiverr — cleaning and reformatting messy PDFs and
spreadsheets for three clients through 2024. It wasn't engineering, but it was the first
time someone paid me for output, and it taught me what a deadline actually is.

The thing I'm most pleased with is small: a feature PR merged into
`langchain-ai/langchain`. Someone offered me freelance work on the condition that I could
land a contribution in a repository that size. I'd never touched it. I found a real gap in
the OpenRouter integration, wrote it up, fixed it, and it was merged within 24 hours.
That's the first time my code was judged by people who had no reason to be kind about it.

**One thing you should know before you read anything else here:** I develop AI-assisted.
Most of what I've shipped was built that way. I'm not hiding it, because I think the
interesting question isn't whether you use the tools — it's whether you can tell when
they're wrong. I'm still building that. The skills section on this site is graded on
evidence, not on confidence, and you'll notice nothing on it claims I can debug anything
yet. That's deliberate, and it'll change as I earn it.

I'd rather you find this out here than in an interview.

---

## 2. What I Do

**I take an idea to a live URL, on my own, quickly.**

That's the core of it. Give me a spec and I'll come back with a deployed, working product
— frontend, backend, database, auth, deployment. I've done it across:

- **AI product plumbing** — multi-provider LLM routing with fallback, document
  generation, chat interfaces, transcription and summarisation pipelines
- **Full-stack web apps** — React and Next.js front ends, Node/Express and Fastify
  services, MongoDB and PostgreSQL, Firebase auth
- **Interaction and motion work** — scroll-driven experiences built with Three.js, GSAP
  and Lenis
- **Mobile** — React Native and Flutter, including a custom keyboard with a syncing
  content backend

Secondary to that, I care about how interfaces feel. This site is the argument for that.

**What I'm good for right now:** shipping features fast, getting productive in a codebase
I've never seen, working alone without much supervision, and being honest about the state
of what I've built.

**What I'm not claiming yet:** deep independent debugging, sole ownership of a production
system with real users on it, or ML engineering. I've done ML coursework at IIT Jodhpur —
Pattern Recognition, CNNs and RNNs, optimisation — but I haven't shipped an ML system, so
I don't put it forward as a skill.

---

## 3. Now

**Updated: August 2026**

- **Learning** — DSA, networking, backend, and ML. ML is the one I'm actually stuck on;
  the coursework made sense and applying it independently hasn't yet.
- **Building** — KELL.OS, this site. It's being built in phases with the architecture
  decisions written down as I go, which is the first time I've worked that way.
- **Open source** — looking for the next contribution after the LangChain merge. Nothing
  in flight right now.
- **Job applications** — paused. I stopped for the moment to fix gaps rather than
  interview into them.
- **Semester 3** — ongoing at IIT Jodhpur.

`⚠ MAINTENANCE:` This app is the fastest thing on the site to go stale. It carries a
visible "updated" date so a stale Now is obvious rather than misleading. Review monthly.

---

## 4. Skills

**How to read this**

Every skill is placed by **the kind of evidence behind it**, not by how confident I feel.
There are no percentages, no five-star ratings, and no progress bars, because those are
opinions dressed up as data.

Nothing here claims "I can debug this." I develop AI-assisted, and I can't yet point to a
specific bug I found and fixed on my own. Until I can, the claim isn't made. When I can,
it gets promoted — with the specific instance attached.

---

### Tier 1 — Externally verified
*Someone outside me paid for it, merged it, or reviewed it.*

| Skill | Evidence |
|---|---|
| **Git / GitHub** | Merged PR [#39301](https://github.com/langchain-ai/langchain/pull/39301) in `langchain-ai/langchain` |
| **Python** *(narrow — the LangChain contribution only)* | Same PR, merged into a production open-source codebase. This is not a claim of general Python engineering depth. |
| **Excel / spreadsheet data cleaning** | Paid Fiverr client work, 2024 — 3 clients, ~5–6 orders, ~₹30,000 total `⚠ VERIFY` |

---

### Tier 2 — Shipped publicly
*Used in a live, deployed project I built end to end.*

React · JavaScript · HTML / CSS · Tailwind CSS · Next.js · Firebase · SQL / PostgreSQL ·
REST APIs · Python for data work (NumPy, Pandas, Matplotlib, scikit-learn — IIT Jodhpur
coursework)

---

### Tier 3 — Worked with
*Used in a project or in coursework. I'd need to look things up.*

Node.js / Express · Fastify · MongoDB · Three.js · GSAP · Lenis · React Native · Flutter ·
Docker · Linux / Ubuntu / networking · PHP · Supabase · Prisma · Payload CMS · Zustand ·
React Three Fiber · Azure · Redis · Socket.IO · AWS · Tableau · Power BI · KNIME · Weka ·
OpenCV · MediaPipe · React Router · Axios · React Hook Form · Zod · Postman · Hugging
Face · Google Colab · Kaggle

---

`⚠ FLAG FOR PHASE 1:` Tier 3 currently holds **34 items**. That volume works against the
positioning — a long list of things someone would need to look up reads as unfocused.
Recommendation: display the full list behind an expand, or cut to the ~15 most relevant to
full-stack product work. **Saathvik's decision.** Content is complete either way; this is
a presentation call, not a content call.

---

## 5. Résumé — structure

This app renders a downloadable PDF plus a structured on-page version. Below is the
**section contract**, not the résumé copy.

`⚠ BLOCKER:` The existing résumé PDF is **not current** (last updated November 2025 per
file date, and confirmed out of date by Saathvik). It must be rewritten to match this
structure before launch. See [`asset-inventory.md`](../asset-inventory.md).

**Order and contents:**

1. **Header** — Name · BS Applied AI & Data Science, IIT Jodhpur (expected graduation
   `⚠ VERIFY`) · email · GitHub · LinkedIn · location `⚠ VERIFY`
2. **Summary** — three lines, derived from [`positioning.md`](../positioning.md)
3. **Education**
   - IIT Jodhpur — BS Applied AI & Data Science, 2025–present. CGPA 9.44 (SGPA 9.75, 9.25)
   - LeapStart School of Technology — parallel programme, 2025–2026
   - Intermediate (MPC), 2023–2024
4. **Open source & recognition** — placed above projects because it is the only
   externally verified engineering
   - Merged feature PR, `langchain-ai/langchain` (#39301), 2026
   - GirlScript Summer of Code — contributor, 2026
   - Google BigCode Challenge — top 1,500 of 15,000+ participants, 2026
   - Google Developer Groups — member, 2025–present
5. **Selected projects** — 3–4 only, matching the case-study slate. Not the full inventory.
6. **Experience**
   - Freelance data processing, Fiverr — 2024. 3 clients, ~5–6 orders, ~₹30,000 `⚠ VERIFY`
   - *(No internships listed. See exclusions below.)*
7. **Technical skills** — the three tiers above, compressed
8. **Coursework** *(optional, one line)* — Pattern Recognition, AI foundations,
   optimisation, data visualisation

**Deliberate exclusions — decided in Phase 0, do not reinstate:**

| Excluded | Reason |
|---|---|
| **Godstockss** | One week, unregistered company, nothing produced, resigned |
| **Future Interns** *(as a credential)* | Charged money for a letter of recommendation. The OWASP Juice Shop and Python secure-file-sharing work survives as project/skills evidence; the organisation does not appear as an internship. |
| **FlyRank AI** *(as a credential)* | No interview, accepts all applicants. Any ML work produced may stand as a project on its own merit; the title does not. |
| **Fiverr rating** | Reported inconsistently during intake (4.5, then 5). Dropped pending profile verification. |

---

## 6. Contact

**Open to:** jobs, freelance, collaboration, open-source work, and questions about
anything on this site. No filter — if you have a reason to write, write.

| Channel | Value |
|---|---|
| **Email** | saathvik.kp@gmail.com |
| **GitHub** | [github.com/broskell](https://github.com/broskell) |
| **LinkedIn** | [linkedin.com/in/kellampalli-saathvik](https://www.linkedin.com/in/kellampalli-saathvik/) |
| **X** | [@kellyyboi](https://x.com/kellyyboi) |

**Not published:** phone number, Discord handle. *(Confirmed in Intake Round 5.)*

**Suggested closing line:** *"Fastest way to reach me is email. I read everything."*
`⚠ VERIFY` — only keep this if it's true.

---

## 7. Recycle Bin

**Concept — decided in Intake Round 5:** abandoned projects. Not dramatic failure
stories. Things started, parked, and not maintained.

**Framing text:**

> Not everything I built was meant to survive. These are projects I started, learned
> something from, and stopped. I'm keeping them here rather than deleting them, because a
> portfolio where everything succeeded isn't a portfolio, it's an advert.

**Contents — the three Saathvik named:**

| Project | Note |
|---|---|
| **SnippetVault** | Personal code-snippet manager, built in Flutter. A productivity tool for an audience of one. I stopped maintaining it. |
| **Rolex Scrollytelling** | Built to learn Three.js, GSAP and Lenis. It did that job. It was never going to be a product. |
| **F1 Scrollytelling** | Same again — another scroll-driven 3D experiment. Two of these taught me the technique; a third wasn't going to teach me more. |

**Standing rule for this app — do not violate:**

> If a project doesn't have a real abandonment reason I can remember, it doesn't get an
> invented one. Thin and true beats rich and false.
> — Saathvik, Intake Round 5

`⚠ THIN — HOMEWORK:` Three entries, and all three reduce to "it was a learning
experiment." This is honest but repetitive. The project audit (see
[`asset-inventory.md`](../asset-inventory.md)) should surface 2–4 more with distinct
reasons before launch. **Not a Phase 1 blocker** — the app ships with three if it must.

---

## Content-completeness ledger

| Section | State |
|---|---|
| About Me | ✅ Complete |
| What I Do | ✅ Complete |
| Now | ✅ Complete — needs monthly review |
| Skills | ✅ Complete — one presentation decision open (Tier 3 volume) |
| Résumé structure | ✅ Complete — ⚠ PDF itself must be rewritten |
| Contact | ✅ Complete — one line to verify |
| Recycle Bin | ⚠️ Ships as-is, thin. Deepen before launch. |
