# KELL.OS V1 App Inventory

> ## ⚠ RECONCILIATION REQUIRED
>
> **The original Master Blueprint never reached the Phase 0 session.**
>
> [`MASTER-BLUEPRINT.md`](MASTER-BLUEPRINT.md) is a **reconstruction**, and its §6.1 tier
> definitions and §6.2 app assignments were derived *from this document*. **The two cannot
> reconcile each other** — they agree by construction, which is not the same as being
> correct.
>
> **The tier definitions used below are stated explicitly in §1 so the assumption is
> visible rather than buried.** If the original blueprint defines tiers differently,
> re-tier everything against it and flag what moved.
>
> Apps marked ⚠ **ASSUMED** were not confirmed in intake and may not belong to V1 at all.

---

## 1. Tier definitions used here

| Tier | Meaning | Consequence |
|---|---|---|
| **Tier 1** | A recruiter's decision cannot be made without it. Reachable within 90 seconds of boot. Must work on mobile, must appear in the static fallback layer, must be readable in Reader Mode. | Ships in V1. Non-negotiable. |
| **Tier 2** | Supports the decision but isn't required for it. A visitor who never opens it can still evaluate Saathvik. | Ships in V1 if it doesn't delay Tier 1. |
| **Tier 3** | Atmosphere, credibility with audience B, or OS-metaphor payoff. Carries no hiring-critical content. | Cut first under pressure. |

Derived from the locked audience priority: **recruiter wins all conflicts.**

---

## 2. Tier 1 — hiring-critical

| App | What it displays | Content source |
|---|---|---|
| **About Me** | Identity, the honest AI-assistance disclosure, the one-line positioning. The single most important text on the site. | [`app-content.md`](content/app-content.md) §1 · `positioning.md` |
| **Projects** | The project inventory, split into case studies / gallery. Entry point to every case study. | `Project[]` where `tier` is `caseStudy` or `gallery` |
| **Case Study Reader** | Renders a project's `ContentBlock[]`. The only app where deep evidence lives. Must be linkable directly — a recruiter arriving from a CV lands here, not on the desktop. | `Project.blocks` |
| **Skills** | Three evidence tiers with evidence attached. No percentages, no bars. | `Skill[]` |
| **Résumé** | Structured on-page résumé + PDF download. | `app-content.md` §5 · résumé PDF asset ⚠ **not current** |
| **Contact** | Email, GitHub, LinkedIn, X. | `app-content.md` §6 |

**Deep-linkability is a Tier 1 requirement, not a nicety.** Every Tier 1 app needs a URL
that opens it directly with the OS around it. If a recruiter can only reach a case study
by learning the window manager first, the OS metaphor has cost more than it earned.

---

## 3. Tier 2 — supporting

| App | What it displays | Content source |
|---|---|---|
| **Now** | Current activity, visibly dated. Includes "stuck on ML" — deliberately. | `NowSnapshot` |
| **Timeline** | 2023 → present, grouped by version era. Carries the academic record (CGPA 9.44) and the recognitions. | `TimelineEntry[]` |
| **Recycle Bin** | Three named abandoned projects, honestly framed. Doubles as an OS-metaphor payoff — the metaphor *is* the argument. | `Project[]` where `tier === 'recycled'` |
| **Reader Mode** | Strips the OS entirely; renders content as a plain document. Serves the 90-second recruiter and the crawler at once. | All published content |
| **Search (Ctrl+K)** | Jump to any app, project or case study. The escape hatch for anyone who doesn't want to learn the desktop. | App Registry + content index |

**Reader Mode is Tier 2 by placement and Tier 1 by importance.** It is the safety valve
for the entire OS-metaphor bet. If a recruiter bounces off the interface, Reader Mode is
the only thing standing between that and a lost opportunity. **Do not cut it.**

---

## 4. Tier 3 — atmosphere

| App | What it displays | Content source |
|---|---|---|
| **Terminal** | `open <app>`, `ls`, and similar. Credibility with audience B. | App Registry |
| **KELL.AI** | Deterministic intent matching, **no LLM in V1** (locked). Answers questions by routing to existing content. | App Registry + content index |
| **Settings** | Wallpaper, theme, version switching surface. | Local state + `OSVersion[]` |
| **OS Update / Version switcher** | The 1.0 → 2.0 → 3.0 ceremony. Returning visitors only; new visitors boot latest. | `OSVersion[]` |
| ⚠ **Gallery / Screenshots** — **ASSUMED** | Visual index of the ~19 non-case-study projects. May be a view inside Projects rather than its own app. **Confirm against blueprint.** | `Project[]` where `tier === 'gallery'` |

**KELL.AI has a content dependency nobody will notice until it fails.** Deterministic
intent matching needs an answerable question set. If the underlying content is thin, the
assistant is thin. It cannot invent answers — by design and by the Phase 0 honesty stance.

---

## 5. Shell surfaces — not apps, but registry consumers

Per the locked App Registry decision, one manifest feeds all of these:

Desktop icons · Start menu · Ctrl+K search · Terminal `open` · Mobile app grid ·
OS update system · Static fallback layer

**A new app is a registry entry, not six edits.** Any later phase adding an app by
touching these surfaces individually is violating the locked architecture.

---

## 6. Content-readiness by app

| App | Content state |
|---|---|
| About Me | ✅ Written |
| Skills | ✅ Written — one presentation decision open (Tier 3 volume: 34 items) |
| Contact | ✅ Written |
| Now | ✅ Written |
| Timeline | ✅ Derivable from `version-narrative.md` — needs entry-by-entry breakdown |
| Recycle Bin | ⚠️ Three entries, thin, ships anyway |
| Résumé | 🔴 PDF out of date — **blocks launch** |
| Projects | ⚠️ Inventory known; gallery not yet cut to 8–10; no screenshots exist |
| Case Study Reader | ⚠️ **1 of 4 case studies written.** RMP and PawSethu blocked on technical review; KELL.OS deferred to post-Phase 18 |
| Reader Mode | ✅ No content of its own |
| Search / Terminal / KELL.AI / Settings / Update | ✅ No content of its own |

**The honest V1 launch position:** Saathvik launches with **one** complete case study
(LangChain) unless the technical rounds happen. That is survivable — one strong,
externally verified case study beats four unverifiable ones — but Phase 1 should know it
is designing a Projects app that may hold a single deep entry and a short gallery, not
four deep entries.

---

## 7. Explicitly not in V1

| Excluded | Reason |
|---|---|
| Admin / CMS | Locked: V1 ships zero backend. Phase 11+. |
| Blog / Writing app | No content exists. Do not add an empty app. |
| Analytics dashboard | No metrics exist. |
| Guestbook / comments | Needs a backend. |
| Any app requiring an LLM | Locked: no LLM in KELL.AI for V1. |

---

## Reconciliation checklist for Phase 1

- [ ] Blueprint's Tier 1/2/3 definitions vs §1 — re-tier if different, list what moved
- [ ] Blueprint's V1 app list vs §§2–4 — flag any app present there and absent here
- [ ] Confirm Gallery is its own app or a view inside Projects
- [ ] Confirm Reader Mode's tier — it is arguably Tier 1
- [ ] Confirm the Timeline app exists in the blueprint's V1 set
