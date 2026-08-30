# PawSethu

**Slug:** `pawsethu`
**Type:** Full case study — **CONDITIONAL**
**Status:** 🔴 **BLOCKED.** Not writable in Phase 0.
**Links:** Not deployed. Awaiting server and domain.

---

## Why this document is a skeleton

Committed to in Intake Round 5, technical round not yet held.

The blocking facts from intake (Round 2):

| Question asked | Answer given |
|---|---|
| Why Fastify? | *"dont know"* |
| What is the QR flow? | *"dont know"* |
| Your exact contribution on a 3-person team? | *"full"* |
| Why React Native? | *"easy"* |

**"I did everything" on a team of three is the single most dangerous claim in this
portfolio.** It is either inaccurate or it describes someone who worked around their
teammates. Either reading damages Saathvik in an interview. This must be resolved into a
specific, defensible division of labour before anything about PawSethu is published.

---

## Verified facts (from intake)

- **What it is:** a digital identity and care platform for pets — QR-based identity,
  mobile-first workflows, backend services
- **Origin:** built during the **ProdX Buildathon**, Semester 2 (Jan–May 2026)
- **Team:** 3 people
- **Duration:** 10 days allotted; the app was completed in 3
- **Stack:** React Native, Fastify, MongoDB
- **What worked:** CRUD, tunnelling, QR generation, database, backend
- **What was demo-only:** CRUD, QR generation
- **Scan behaviour:** scanning a pet's code shows a profile — name, details, breed,
  emergency contact
- **Privacy model as described:** the owner controls what is visible
- **Current status:** in progress, awaiting a server and domain to launch
- **Competition result:** **none claimed.** Saathvik explicitly declined to claim a
  ranking. Do not add one.

⚠ **Internal contradiction to resolve:** CRUD and QR generation appear in *both* "what
worked" and "what was demo-only." One of those lists is wrong.

---

## The technical round — questions to answer before promotion

### Contribution *(resolve first — nothing else matters until this is settled)*
1. Name your two teammates' areas. What did each own?
2. Which files did you write? Which did they?
3. If "full" meant you wrote all the code, what were the other two doing?

### The QR flow *(the product's core mechanism)*
4. What is actually encoded in the QR code — a pet ID, a signed token, a URL?
5. What happens when a stranger scans a lost pet's tag? Do they need an app? An account?
6. If it's a public URL with an ID in it, can someone enumerate IDs and read every pet
   profile? Was that considered?
7. How is "the owner controls visibility" enforced — client-side filtering, or server-side
   authorisation? These are very different answers.
8. Can a QR code be revoked if a collar is lost?
9. What is the emergency contact exposed to — is a phone number publicly readable by
   anyone who scans?

### Architecture
10. Why Fastify over Express? If the honest answer is "it's what the template used," say
    that — it's a fine answer, but it can't be dressed as a decision.
11. What does the Mongo document for a pet look like? Which fields are public?
12. What was "tunnelling" solving — local dev against a phone, or something in production?

### Reality
13. What genuinely worked at the end of day 3 versus what was demo-only?
14. What is blocking launch beyond a server and domain?

---

## Case-study skeleton *(fill only from answers above)*

**Problem** · What happens today when a pet is lost? What's wrong with a name tag?
**Context** · ProdX Buildathon, 10 days allotted, app built in 3. Team of 3.
**My role** · Must be specific to the point of naming subsystems. Never "full."
**Goals & constraints** · A 3-day build window is a genuine engineering constraint. What
was deliberately cut?
**Architecture** · The QR identity flow end to end: generate → print → scan → resolve →
authorise → render.
**Stack** · React Native, Fastify, MongoDB — with honest reasons, including "familiar and
fast," which is a legitimate reason under time pressure.
**Implementation** · What a finder actually experiences, step by step.
**The hard part** · Candidate: a lost-pet tag must be readable by a stranger with no
account, while the owner's data stays private. That is a real access-control problem with
a genuine tension in it. **Only claim it if the code actually solves it.**
**Solution** · What was built in 3 days.
**Result** · Not launched. No users. Say exactly that.
**Lessons** · What the 3-day constraint forced you to give up, and whether that was right.

---

## Standing warnings

- ⚠ **Never publish "I did everything."** Resolve into named subsystems or drop the
  project to gallery.
- ⚠ **No competition result exists.** Do not imply placement.
- ⚠ **No users exist.** "Awaiting launch" is the honest state.
- ⚠ If the answer to Q7 is *client-side filtering*, that is a real privacy hole and the
  case study must either say so honestly as a known limitation, or the project drops to
  gallery. **It must not be described as a privacy feature.**

---

## Opportunity note

PawSethu is the **only** item in the entire inventory with a credible path to a verified
user number. It is finished enough to launch and blocked only on a server and a domain.

Shipping it to real pet owners would give this portfolio its first real usage metric.
That is worth more than any additional project.
