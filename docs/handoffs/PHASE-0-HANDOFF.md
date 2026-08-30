# Phase 0 Handoff — Product Definition & Content

**Phase:** 0 — Product Definition & Content
**Completed:** 15 August 2026
**Next:** Phase 1 — Design System
**Method:** five structured intake rounds, then drafting. No fact in any Phase 0 document
originates anywhere but Saathvik's intake answers.

---

## 1. DECIDED — locked, do not renegotiate

### Positioning
- **Primary lane:** full-stack product engineer who ships fast
- **Secondary:** frontend / interaction engineer
- **Explicitly not claimed:** AI/ML engineer, data scientist, security engineer.
  Coursework and security work appear as coursework and projects, never as positioning.
- **Audiences:** (A) recruiters — **wins all conflicts**; (B) friends and peers.

### The honesty stance — the spine of the whole product
AI-assisted development is **disclosed on the page, in Saathvik's own words**, placed
early in each document rather than buried. It is the positioning, not a disclaimer.

Three inherited rules:
1. No skill tier claims debugging ability until a specific instance exists.
2. No project claims depth its case study can't defend under questioning.
3. No number appears that Saathvik can't produce evidence for.

### Skills — evidence tiers, no percentages
- **Tier 1 (externally verified):** Git/GitHub · Python *(narrow — the LangChain PR)* ·
  Excel data cleaning *(paid, 2024)*
- **Tier 2 (shipped publicly):** React · JavaScript · HTML/CSS · Tailwind · Next.js ·
  Firebase · SQL/PostgreSQL · REST APIs · Python data libraries
- **Tier 3 (worked with):** 34 items — see [`app-content.md`](../content/app-content.md) §4

### Case-study slate
| | Piece | State |
|---|---|---|
| 1 | **LangChain OpenRouter provider** | ✅ Written. Conditional on A1.4. |
| 2 | **KELL.OS** | 🟡 Deferred by design to post-Phase 18 |
| 3 | **Roast My Project** | 🔴 Blocked on technical review |
| 4 | **PawSethu** | 🔴 Blocked on technical review |
| — | ~19 others | Gallery — cut to 8–10 |
| — | SnippetVault, Rolex, F1 | Recycle Bin |

### Cut — do not reinstate
- **Godstockss** — one week, unregistered, nothing produced, resigned
- **Future Interns** *(as credential)* — charged for an LOR. Work survives as evidence.
- **FlyRank AI** *(as credential)* — no interview, accepts all
- **Alimony.AI** *(as case study)* — legal figures from unsourced logic; "hardest problem:
  nothing." Gallery only, and must not imply legal accuracy.
- **Library Management System** *(as case study)* — unpaid, no longer running, no
  defensible decision
- **Four of five scrollytelling projects** — keep Ducati only
- **Fiverr rating** — reported inconsistently (4.5, then 5); dropped pending verification

### Version narrative
1.0 "ORIGIN" 2023–Aug 2025 · 2.0 Sep 2025–May 2026 · 3.0 Jun 2026–present.
Confirmed by Saathvik. Versions remain feature flags over one data set.

### Contact
Email `saathvik.kp@gmail.com` · GitHub `broskell` · LinkedIn
`kellampalli-saathvik` · X `@kellyyboi`. **Phone and Discord not published.**

---

## 2. OPEN QUESTIONS

### Blocking
| # | Question | Owner |
|---|---|---|
| 1 | **The Master Blueprint never reached the Phase 0 session.** `content-model.md` and `app-inventory.md` are drafted with assumptions flagged inline. | Saathvik |
| 2 | Will the RMP and PawSethu technical rounds happen? If not, V1 ships with **one** case study. | Saathvik |
| 3 | Can the LangChain PR be explained unaided? If not, it drops to a one-line entry. | Saathvik |

### Non-blocking
| # | Question | Owner |
|---|---|---|
| 4 | **ORIGIN naming collision** — v1 codename vs the project of the same name | Phase 1 |
| 5 | Skills Tier 3 holds 34 items. Show all, or cut to ~15? | Saathvik |
| 6 | Keep, soften, or cut *"Not yet for sole ownership of production systems"*? Recommendation: **keep** | Saathvik |
| 7 | Is Gallery its own app or a view inside Projects? | Phase 1 / blueprint |
| 8 | Is Reader Mode Tier 1 rather than Tier 2? Arguably yes | Phase 1 |
| 9 | Expected graduation date and location line for the résumé header | Saathvik |

---

## 3. WHAT PHASE 1 NEEDS FROM PHASE 0

**Available now:**
- Final written content for every V1 app — [`content/app-content.md`](../content/app-content.md)
- One complete case study, so real block sequences can be designed against real text
- The `ContentBlock` variant set the design system must render — [`content-model.md`](../content-model.md) §3
- The V1 app list with tiers — [`app-inventory.md`](../app-inventory.md)
- Audience priority, for every conflict Phase 1 will hit

**Phase 1 must design for these realities, not around them:**
1. **Text-heavy.** The strongest asset is a long technical narrative. The design system
   must make long-form reading excellent, not merely tolerable.
2. **No screenshots exist yet.** Every image-dependent layout must degrade gracefully.
3. **No verified metrics exist.** Do not design a stats/number-grid component that would
   have to be filled with fabricated figures to look right. `MetricsBlock` may render
   empty for a long time.
4. **Possibly one case study at launch.** The Projects app must not look broken holding
   one deep entry and a short gallery.
5. **No logo exists.** Wordmark is a Phase 1 deliverable.
6. **Reader Mode is a first-class surface**, not an afterthought — it is the escape valve
   for the entire OS-metaphor bet.

---

## 4. WHAT PHASE 1 MUST NOT TOUCH

**Content.** Phase 1 designs how words look. It does not rewrite them. If a line doesn't
fit a layout, the layout changes or the question comes back to Saathvik — the text is not
quietly edited to suit a component.

**The honesty stance.** No softening, relocating, or visually de-emphasising the
AI-assistance disclosure. Placement early in each document is deliberate.

**The skill tiers.** No percentages, no star ratings, no progress bars, no proficiency
meters — **including as a visual idea.** The tiers are evidence types; any design that
implies a measurable level breaks the model.

**The case-study slate.** Phase 1 does not promote a gallery project to case study because
it would balance a grid.

**Locked architecture** (from the master blueprint — none of it is Phase 1's to revisit):
Vite + React + TS, not Next.js · headless window-manager core · design tokens as CSS
custom properties · App Registry as data · typed content blocks · publish-to-static ·
versions as feature flags · GSAP only · no Three.js/R3F in V1–V2 · no smooth-scroll
library · no backend before V1 ships · no LLM in KELL.AI for V1.

**The content model.** Phase 1 may report that a needed block variant is missing. It may
not add visual fields (`className`, `color`, `width`) to block types.

---

## 5. RISKS CARRIED FORWARD

| Risk | Severity | Mitigation |
|---|---|---|
| Only one case study ships | **High** | A2.1 / A2.2. One strong externally-verified study beats four unverifiable ones — but the Projects app must be designed for it. |
| LangChain case study can't be defended in interview | **High** | A1.4. Non-negotiable. |
| The public LangChain issue contains a fabricated use case | **Medium** | The case study deliberately tells the true story. Never reintroduce the false framing anywhere. |
| No verified metrics anywhere | **Medium** | Ship PawSethu (A6.3). |
| ~19 gallery entries read as churn | **Medium** | Cut to 8–10 (A3.8). |
| Recycle Bin is thin | **Low** | Deepen via A6.1/A6.2. Ships as-is if needed. |
| Résumé PDF stale | **High but easy** | A1.2. |
| Zero URLs verified | **High but easy** | A1.1. `verified: false` blocks publish by contract. |

---

## 6. FILES PRODUCED

```
docs/
├─ MASTER-BLUEPRINT.md      ⚠ reconstruction — not the original
├─ positioning.md
├─ content-model.md          ⚠ pending blueprint reconciliation
├─ app-inventory.md          ⚠ pending blueprint reconciliation
├─ version-narrative.md
├─ asset-inventory.md
├─ CONTEXT.md
├─ content/
│  ├─ app-content.md
│  └─ case-studies/
│     ├─ langchain-openrouter-provider.md   ✅ complete
│     ├─ roast-my-project.md                🔴 skeleton
│     ├─ pawsethu.md                        🔴 skeleton
│     └─ kellos.md                          🟡 deferred
└─ handoffs/
   └─ PHASE-0-HANDOFF.md
```

---

## 7. ONE-PARAGRAPH SUMMARY FOR THE PHASE 1 CHAT

Phase 0 established that Saathvik is a second-year IIT Jodhpur student (CGPA 9.44) with
one externally verified engineering achievement — a merged feature PR in
`langchain-ai/langchain` — paid pre-college freelance data work, roughly two dozen
AI-assisted projects of varying depth, and no verified usage metrics anywhere. The
positioning is *full-stack product engineer who ships fast*, and the product's defining
choice is that **AI-assisted development is disclosed openly rather than concealed**, with
skills graded by evidence type instead of self-rated proficiency. Phase 1 inherits final
written content for every V1 app, one complete long-form case study, a typed content
model, and a tiered app list. Its job is to make long-form technical reading excellent for
a recruiter with ninety seconds — without touching a word of the content, and without
introducing any visual device that implies a measurable skill level.
