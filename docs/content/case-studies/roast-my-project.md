# Roast My Project

**Slug:** `roast-my-project`
**Type:** Full case study — **CONDITIONAL**
**Status:** 🔴 **BLOCKED.** Not writable in Phase 0.
**Links:** [Live](https://roast-my-project.vercel.app/) `⚠ UNVERIFIED` ·
[GitHub](https://github.com/broskell/Roast-My-Project)

---

## Why this document is a skeleton

Saathvik committed in Intake Round 5 to reading this codebase properly and answering a
technical round before it is promoted to a case study. That round has not happened.

The blocking facts from intake (Round 2):

| Question asked | Answer given |
|---|---|
| How does the model routing work? | *"no idea"* |
| How are rate limits handled? | *"no idea"* |
| How are malformed responses handled? | *"no idea"* |
| Why Payload CMS? | *"just kept"* |

**A case study cannot be written from those answers, and must not be invented from the
stack list.** The multi-provider fallback is the only genuinely interesting thing in this
product; if it can't be explained, there is no case study — only a gallery tile.

**Two outcomes are acceptable. Fabrication is not.**
1. Saathvik reads the code, answers the round, and this becomes a full case study.
2. He doesn't, and this becomes a gallery entry with a screenshot and two honest lines.

---

## Verified facts (from intake — safe to use in either outcome)

- **What it is:** a multi-model AI feedback platform — project reviews, résumé analysis,
  startup validation
- **Stack as reported:** Next.js 16, React 19, Payload CMS, Gemini, Groq, Firebase,
  Twilio, Cloudinary, Tailwind CSS v4, MongoDB `⚠ VERIFY against package.json`
- **Deployment:** Vercel
- **Provider strategy as reported:** *"if gemini hits api limits, then groq"*
- **Users:** students and friends. **No verified count. No traffic, uptime, or revenue
  figures. Do not state or imply any.**
- **Built by:** Saathvik, solo, AI-assisted

---

## The technical round — questions to answer before promotion

### Routing and fallback *(the core of the case study)*
1. Where in the code does the provider decision happen? File and function.
2. What triggers the switch to Groq — an HTTP status, an exception type, a timeout, a
   token budget? Show the condition.
3. Is the fallback per-request or does it latch? If Gemini fails once, does the next
   request still try Gemini?
4. Do Gemini and Groq return the same response shape? If not, what normalises them?
5. What happens if Groq *also* fails? Is there a third path, or does the user see an error?
6. Is there a retry, and if so with what backoff?

### Failure handling
7. What happens when a provider returns valid JSON with useless content? Is there any
   validation of the *content*, or only of the transport?
8. Has a provider ever actually failed in production? What did the user see?

### Architecture
9. What is Payload CMS storing, and what would break if it were removed?
10. What is Twilio doing in this product?
11. What is in MongoDB versus what is in Firebase? Why two data stores?
12. Where does an uploaded file go, and who can read it afterwards?

### Honesty
13. Which parts of this codebase could you not explain if asked right now?
14. Which decisions here were yours, and which were the model's defaults that you kept?

---

## Case-study skeleton *(fill only from answers above)*

**Problem** · What was actually wrong with getting feedback on a project?
**Context** · Why build this? When? How long did it take?
**My role** · Solo, AI-assisted — state the assistance level explicitly, as in the
LangChain case study.
**Goals & constraints** · Free-tier API limits are the obvious real constraint — confirm.
**Architecture** · The routing layer, the two data stores, the upload path.
**Stack** · Verified against `package.json`, not recalled.
**Implementation** · How a request actually flows, end to end.
**The hard part** · Candidate: making two providers with different limits, latencies and
response shapes look like one reliable service. **Only if true.**
**Solution** · What was actually built.
**Result** · No numbers exist. Say what shipped and stop. Do not manufacture impact.
**Lessons** · Must be specific. "I learned full-stack" is not a lesson.

---

## Standing warnings

- ⚠ **Do not claim user numbers.** "Students and friends" is the honest ceiling.
- ⚠ **Do not describe the fallback as production-hardened.** Nothing in intake supports it.
- ⚠ **Do not present the stack list as architecture.** A list of technologies is not a
  decision.
- ⚠ **Verify the live URL** before publishing it.
