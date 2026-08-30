# Asset Inventory — Saathvik's homework list

**Every item here is work only Saathvik can do.** No later phase can generate these, and
no phase should proceed as though they exist.

Ordered by what blocks what.

---

## Priority 0 — Blocks everything

### A0.1 — The Master Technical & Product Blueprint
**Status:** 🔴 Missing. Attempted twice; did not reach the Phase 0 session.
**Needed for:** reconciling [`content-model.md`](content-model.md) and
[`app-inventory.md`](app-inventory.md).
**Deliver as:** a `.md` file inside the `KellOS/` directory, or pasted as message text.

---

## Priority 1 — Blocks publication of existing content

### A1.1 — URL verification sweep
**Status:** 🔴 Nothing verified. Zero of ~23 project URLs have been opened.
**Must produce:** for every project — live URL, does it load (Y/N), date checked.
Minimum: `roast-my-project.vercel.app`, `alimony-ai.vercel.app`,
`ducati-scrollytelling.vercel.app`.
**Why blocking:** `ExternalLink.verified` gates publication by contract. Unverified links
do not ship. A dead link on a portfolio is worse than no link.

### A1.2 — Résumé PDF, rewritten
**Status:** 🔴 Exists (`MyResume.pdf`, dated November 2025), confirmed out of date.
**Must produce:** a current PDF following the section order in
[`app-content.md`](content/app-content.md) §5 — including the exclusions
(no Godstockss, no Future Interns, no FlyRank as credentials; no Fiverr rating).
**Also needed:** expected graduation date, and the location line for the header.

### A1.3 — Fiverr profile verification
**Status:** 🔴 Unverified.
**Must produce:** profile live (Y/N); if yes the URL; the real rating; confirmation that
~₹30,000 is the total across 2024 rather than a per-order figure.
**If dead:** the earnings claim stays but is marked approximate and carries no link. The
rating claim stays dropped.

### A1.4 — The LangChain PR, learned
**Status:** 🔴 Not done.
**Must produce:** the ability to answer, unaided — what `response_metadata` is; why
`_create_chat_result` and the two streaming paths are separate; why the truthy guard
preserves backwards compatibility; why `provider` and `model_provider` differ; what
`allow_fallbacks` does.
**Also verify:** exact lines changed (the recollection "50–300" is too wide to publish);
exact test commands run; whether a test was added; whether the merge is in a tagged
release; and whether `ChatOpenAI` + `base_url` was genuinely the prior setup.
**Why blocking:** this is the strongest asset in the portfolio and the first thing an
interviewer will open. **If it can't be explained, it must not ship as a case study.**

---

## Priority 2 — Blocks two of four case studies

### A2.1 — Read the Roast My Project codebase
**Answer the 14 questions in** [`case-studies/roast-my-project.md`](content/case-studies/roast-my-project.md).
Priority: the routing/fallback questions (1–6). Everything else is secondary.

### A2.2 — Read the PawSethu codebase
**Answer the 14 questions in** [`case-studies/pawsethu.md`](content/case-studies/pawsethu.md).
Priority: the contribution split (1–3), then the QR flow (4–9).
**Also resolve:** CRUD and QR generation appear in both "what worked" and "what was
demo-only." One list is wrong.

### A2.3 — Three bugs, fixed without AI
**Status:** 🔴 Not started. **Highest-value item on this entire list.**
Pick three real bugs in existing deployed projects. Fix them without AI assistance. Write
down: what you thought was wrong, what was actually wrong, how you found it.
**Unblocks:** the only route to any skill claiming debugging ability; genuine
case-study material; and the honest answer to the question currently unanswerable —
*"tell me about a bug you found and fixed."*

---

## Priority 3 — Screenshots and images

**Spec:** consistent dimensions across all screenshots (set once, apply everywhere);
real content, never lorem; no browser chrome unless deliberate; light or dark chosen once
and held. Every image needs alt text at capture time — `AssetRef.alt` is required.

| ID | Asset | Must show |
|---|---|---|
| A3.1 | LangChain PR page | The merged state, PR number, repo name — this is *proof*, so capture it as evidence rather than decoration |
| A3.2 | Roast My Project | The feedback output, not the landing page. A real project being reviewed. |
| A3.3 | PawSethu | The scanned-tag view: what a stranger sees on finding a lost pet |
| A3.4 | Ducati Scrollytelling | One frame that survives as a still — the interaction case, minus the interaction |
| A3.5 | Gallery set | One screenshot per surviving gallery project, after the cut to 8–10 |
| A3.6 | Recycle Bin set | SnippetVault, Rolex, F1 — one each |
| A3.7 | Profile photo | Optional. Only if it reads professionally. |

### A3.8 — Gallery cut
**Status:** 🔴 Not done. Currently ~19 gallery entries; target **8–10**.
Volume without depth reads as churn and invites *"which of these did you actually build?"*
Cut before screenshotting — no point photographing projects that won't ship.

---

## Priority 4 — Diagrams

**Rule: only draw a diagram for a system you can explain.** A diagram of a system you
don't understand is a claim you can't defend, and it invites exactly the question you
can't answer.

| ID | Diagram | Shows | Gated on |
|---|---|---|---|
| A4.1 | LangChain — where the field was lost | Request → OpenRouter → backend → response → the three construction paths → the drop point | A1.4 |
| A4.2 | RMP — provider routing | Request → Gemini → failure condition → Groq → response. **Only if routing is actually understood.** | A2.1 |
| A4.3 | PawSethu — QR identity flow | Generate → print → stranger scans → resolve → authorise → render | A2.2 |
| A4.4 | KELL.OS architecture | Headless core, registry, version flags, publish pipeline | Post Phase 18 |

`DiagramBlock.altDescription` is required by contract. Write it when drawing, not later.

---

## Priority 5 — Branding

### A5.1 — KELL.OS logo / wordmark
**Status:** 🔴 None exists. **This is a Phase 1 deliverable, not homework** — do not
attempt it here.

### A5.2 — Favicon, OG image, boot mark
Derived from A5.1. Phase 1 onward.

---

## Priority 6 — Content depth

### A6.1 — Project audit
Go through all ~23. For each: truly abandoned or just quiet; any usage data at all; a
specific abandonment reason if one exists. **Feeds:** the gallery cut and a deeper
Recycle Bin.

### A6.2 — Recycle Bin, deepened
Currently three entries all reducing to "it was a learning experiment." Find 2–4 more with
*distinct* reasons. **Standing rule holds: no invented reasons.** Thin and true beats rich
and false.

### A6.3 — Any verified number, anywhere
**Status:** 🔴 Zero verified metrics exist across the entire inventory.
The most reachable one: **ship PawSethu.** It is blocked only on a server and a domain.
Real pet owners using it would give this portfolio its first genuine usage figure.

---

## Summary

| Priority | Items | Blocks |
|---|---|---|
| P0 | 1 | Two deliverables' reconciliation |
| P1 | 4 | All publication |
| P2 | 3 | Two of four case studies |
| P3 | 8 | Projects and gallery apps |
| P4 | 4 | Case-study depth |
| P5 | 2 | Phase 1's job, not homework |
| P6 | 3 | Content quality |

**If only three things get done: A1.4 (learn the PR), A2.3 (three bugs), A1.1 (verify the
URLs).** Those three raise the portfolio's floor more than everything else combined.
