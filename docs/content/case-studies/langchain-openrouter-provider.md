# Landing a feature in LangChain in 24 hours

**Slug:** `langchain-openrouter-provider`
**Type:** Full case study — **the only externally verified engineering work in this portfolio**
**Status:** Content complete. **Publication conditional** on Saathvik being able to explain
the change unaided (see *Before this publishes*, below).
**Date:** August 2026
**Links:** [PR #39301](https://github.com/langchain-ai/langchain/pull/39301) ·
[Issue #39298](https://github.com/langchain-ai/langchain/issues/39298) ·
`langchain-ai/langchain`

---

## Problem

The `langchain-openrouter` package dropped a field that mattered.

OpenRouter is a routing layer: you ask for a model, and it picks a backend to actually
serve the request. With `allow_fallbacks` enabled, the same model and the same prompt can
land on different backends seconds apart — Novita on one call, DeepInfra on the next.
Those backends don't always share quantisation, latency, or price.

OpenRouter tells you which one served you. It returns a top-level `provider` field on
every chat completion.

`ChatOpenRouter` threw it away.

Every other top-level field survived the trip into `AIMessage.response_metadata` — `id`,
`object`, `created`, `model`, and `cost` / `cost_details` lifted out of the nested `usage`
object. Only `provider` was lost. What did survive was `model_provider: "openrouter"`,
which is correct as integration identity and useless as provenance: it tells you the
request went through OpenRouter, never which backend ran it.

The consequence: if output quality, latency, or cost shifted between runs, the one
variable that would explain it was unrecoverable. Callbacks, logs and LangSmith traces
faithfully recorded metadata that had already been stripped. Worse, the *request* side was
recorded — `openrouter_provider` appears in trace metadata — so tooling showed you what
you asked for and never what you got. With fallbacks on, those two diverge exactly when it
matters.

---

## Context — how I got here

I'll tell this straight, because the honest version is the interesting one.

A prospective client in the UK wanted freelance work done and set a test first: land a
merged contribution in LangChain. Not a toy repo — LangChain. I had never opened it.

I had no personal history with this codebase and no bug of my own to fix. What I had was a
deadline and a repository with tens of thousands of files in it. So I worked the way I
actually work: I used AI tooling to survey the surface, find a gap that was real, narrow
enough to finish, and not already claimed.

The gap I landed on was the dropped `provider` field. It was real, it was reproducible
against a live API, and nobody had filed it.

**Everything after that point had to be true, or a maintainer would find out.**

---

## My role

Solo. Discovery, reproduction, write-up, implementation, and the PR.

**And the part I won't dress up:** this was AI-assisted from end to end. I used ChatGPT
and Claude Code to survey the codebase, locate the relevant call sites, and draft both the
issue and the fix. I do not claim to have read `langchain-openrouter` cover to cover, and
I don't claim deep LangChain expertise on the strength of one merged PR.

What I claim is narrower and, I think, more useful: **given an unfamiliar production
codebase, a cold start, and a deadline, I produced a change that survived maintainer
review and shipped.**

---

## Goals and constraints

| | |
|---|---|
| **Goal** | One merged, non-trivial contribution |
| **Hard constraint** | Days, not weeks — a client was waiting |
| **Hard constraint** | Zero prior knowledge of the codebase |
| **Hard constraint** | Strictly backwards compatible. A behaviour change in a widely-used integration is a rejection. |
| **Self-imposed** | Reproducible against the live API, not theorised from source |
| **Out of scope** | Refactoring, adjacent bugs, anything enlarging the diff |

That last one mattered most. The instinct in an unfamiliar codebase is to fix everything
you notice. A large diff from an unknown contributor is a diff that doesn't get merged.

---

## Architecture — where the field was being lost

Three separate code paths build an `AIMessage`, and each one dropped the field for its own
reason.

**1. The non-streaming path — `_create_chat_result`.** This function already reaches into
the raw response for top-level fields:

```
response_model       = response.get("model")
system_fingerprint   = response.get("system_fingerprint")
```

It reads two. It never reads `provider`. The data is present in the dict and simply never
looked at.

**2 and 3. The two streaming paths.** These don't read the response's provider information
at all — they assign a constant:

```
generation_info["model_provider"] = "openrouter"
```

Which is right, and is not the same question. `"openrouter"` is *who you called*.
`provider` is *who answered*.

The important structural point: **the loss happens while the `AIMessage` is being
constructed.** Everything downstream — callbacks, logging, LangSmith — is innocent. They
record what they're handed, and they were being handed a message the field had already
been removed from. Any fix applied downstream would be too late.

So the change had to happen at all three construction sites, or it would work for
non-streaming calls and silently fail for streaming ones.

---

## Stack

Python · `langchain-openrouter` (verified against `0.2.7`) · `langchain-core`
(`AIMessage`, `response_metadata`) · OpenRouter HTTP API · `httpx` for the raw-response
comparison · pytest for the repo's existing test suite

---

## Implementation

**Reproduce it against the wire first.** Before writing anything, I sent the same prompt
twice — once as a raw HTTP POST to `/api/v1/chat/completions`, once through
`ChatOpenRouter` — and printed both. The raw response carried `"provider": "Novita"`. The
`response_metadata` from the integration carried no `provider` key at all.

**Then prove the field means what I claimed.** This was the step that made the report
credible. The two calls had landed on *different* backends — `GET /api/v1/generation`
reported Novita for one and DeepInfra for the other, which is why their costs differed
(7.6e-07 against 6.6e-07). That's `allow_fallbacks` working as designed, and it
accidentally demonstrated the exact problem: nothing in `response_metadata` distinguished
the two runs.

To rule out the field merely echoing the request, I pinned a backend with
`openrouter_provider={"only": ["DeepInfra"]}`. The raw response changed to
`"provider": "DeepInfra"` where default routing had said Novita — so the field reports the
real serving backend. `response_metadata` remained empty of it either way.

**Then the change.** Read the field where the neighbouring top-level fields are already
read, and apply it beside `system_fingerprint`:

```
serving_provider = response.get("provider")
...
if serving_provider:
    message.response_metadata["provider"] = serving_provider
```

Plus the equivalent in both streaming paths.

**The guard is the whole design.** `provider` isn't in OpenRouter's *documented* response
schema, even though it's present on every live response I made and matches what
`GET /api/v1/generation` returns. Undocumented means it can disappear. A truthy check
makes an absent field a no-op — exactly the pattern `system_fingerprint` already uses in
the same function. Nothing new appears for anyone whose responses don't carry it, and
nothing breaks if OpenRouter stops sending it.

I also flagged the naming problem in the issue rather than deciding it alone: `provider`
matches the wire format but sits next to `model_provider: "openrouter"` and could read as
contradictory. I offered `upstream_provider` and `serving_provider` as alternatives and
said I'd take either. Asking the maintainers to name a public field is cheaper than
guessing and being told to redo it.

**Alternatives I ruled out, and said so in the issue:**

| Option | Why not |
|---|---|
| `ChatOpenAI` with OpenRouter's `base_url` *(what I was using)* | Drops `provider` too, and misreports `ls_provider` as `"openai"` |
| Pin one backend, disable fallbacks | You gain provenance by giving up the routing availability that's the reason to use OpenRouter |
| Follow-up `GET /api/v1/generation?id=` per call | Works — it's how I identified the backends above — but it's an extra round trip and arrives too late to attach to the run |
| Local subclass overriding `_create_chat_result` | Three lines against a private method, rewritten by every user who needs provenance |

I ran the repo's required checks before opening the PR.
`⚠ VERIFY — exact commands and whether a new test was added.`

---

## The hard part

**It wasn't the code.** The change is a handful of lines. If the diff were the achievement
this wouldn't be a case study.

The hard part was that I had no standing. I was an unknown contributor, in a repository I
had never opened, proposing a change to a public metadata contract, with no track record
to borrow credibility from. A maintainer's cheapest correct action on a PR like that is to
close it.

Which meant the issue had to do all the work the reputation I didn't have would normally
do. Not "this field is missing" — but: here is the raw wire response next to the
integration's output; here is proof the field reports the serving backend rather than
echoing the request; here are the exact call sites where it's dropped, with line numbers;
here is why the guard makes it backwards compatible; here are four alternatives and why
each fails; here is the open question on naming, which is yours to decide, not mine.

The second hard part was the streaming paths. The obvious fix — patch
`_create_chat_result` — produces something that works when you test it and fails silently
for every streaming user. Finding the constant assignment in the two streaming paths is
what made the change actually complete rather than apparently complete.

**And the honest third thing:** the hardest part was epistemic. I was working AI-assisted
in a codebase I didn't know, which means I could not fully distinguish "this is correct"
from "this looks correct." My answer was to make every claim independently checkable —
run it against the live API, cite file and line, pin a backend to falsify the alternative
explanation. If I couldn't verify my own reasoning from the inside, I could at least make
it cheap for a maintainer to verify from the outside.

---

## Result

**Merged within 24 hours of opening. No requested changes.**

The release note reads:

> The OpenRouter integration now preserves the upstream provider field in
> `AIMessage.response_metadata` when it is returned by the API.

Anyone running OpenRouter with fallbacks enabled can now tell which backend served a given
request, and that provenance flows into callbacks, logs and LangSmith traces where it
previously went missing. It required no change from existing users and no version pin.

**Timeline:** issue opened and PR submitted the same day. Merged the following day, inside
24 hours.

`⚠ VERIFY — line count. Saathvik's recollection is "50–300, maybe," which is too wide a
range to publish. Read the diff and state the real figure, or state none.`

---

## What I learned

**The write-up carries the change.** The diff was small enough that a maintainer could
have written it faster than reading my issue. What they couldn't cheaply do was establish
that the problem was real, that the field meant what I said, and that the fix couldn't
break anyone. Doing that work is what bought the merge.

**Backwards compatibility is a design constraint, not a checklist item.** The truthy guard
isn't defensive coding — it's the entire reason the change is safe to accept, because it
makes an undocumented upstream field's disappearance a non-event.

**Scope discipline gets you merged.** I noticed adjacent things. I left them alone.

**Where "the same thing" is done more than once, it will be done inconsistently.** Three
paths built the same object; one read the response, two hardcoded a constant. The
non-obvious half of the bug was in the paths nobody thinks to check.

**And the one that actually changed how I work:** this was the first time my code was
judged by people with no reason to be generous about it, and it held up. It also showed me
the shape of my own gap. I could find the problem, reproduce it, and argue for the fix —
but I was leaning on tooling to navigate a codebase I couldn't have navigated alone. That
is a real limitation and it's the thing I'm working on now.

---

<!-- ============================================================ -->
<!-- INTERNAL — NOT FOR PUBLICATION. Strip before render.         -->
<!-- ============================================================ -->

## INTERNAL — Before this publishes

**1. Saathvik must be able to explain this unaided.** This case study is the single
strongest asset in the portfolio and therefore the first thing an interviewer will open.
Every technical claim in it must be answerable in conversation:

- [ ] What `AIMessage.response_metadata` is and who consumes it
- [ ] Why `_create_chat_result` and the two streaming paths are separate code paths
- [ ] Why the truthy guard preserves backwards compatibility
- [ ] Why `provider` and `model_provider` are different things
- [ ] What `allow_fallbacks` does and why it makes provenance necessary

**If these cannot be answered from memory, this case study must not ship.** It becomes a
one-line entry under "Open source" instead. That is a real outcome and an acceptable one —
publishing it unlearned is not.

**2. The fabricated use case in the public issue.** The issue body states *"I run
claim-verification workloads through OpenRouter with `allow_fallbacks` on"* and *"our
current setup."* This is not true and it is public under Saathvik's GitHub account.

- The case study above **deliberately does not repeat that framing.** The "Context"
  section tells the real story: a cold client challenge.
- **This framing must never be reintroduced** in the résumé, LinkedIn, interviews, or any
  later phase of KELL.OS.
- Anticipate the question *"what were you running?"* and answer with the true version. The
  true version is stronger and is already written above.
- The one carry-over: the "Alternatives Considered" table says `ChatOpenAI` with a
  `base_url` was "what I was using." **Verify this was actually true before publishing**;
  if not, rewrite that row as a general alternative rather than a personal one.

**3. Open verification items:** exact line count · exact test commands run · whether a
test was added or only existing tests run · whether the merge is in a tagged release.

**4. Structural note.** This document deliberately does not conceal the AI assistance. It
is placed in "My role" — before the technical detail, not buried after it — because a
reader who discovers it late feels misled, and a reader who is told early reads the rest
as candour. Do not relocate it in a later phase.
