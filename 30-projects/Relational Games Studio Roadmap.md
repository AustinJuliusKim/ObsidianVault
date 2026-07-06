---
title: Relational Games Studio Roadmap
aliases: [studio-roadmap, relational-games]
tags: [strategy, roadmap, studio, games, vision]
type: project
status: draft
created: 2026-07-05
updated: 2026-07-06
related: [[Choices Webapp]], [[Choices Growth Plan]], [[Studio Design Constitution]], [[Choices Marketing Proposal]], [[Projects MOC]]
---
# Relational Games Studio Roadmap

**Version:** v0.3 (2026-07-05) — build-in-public cadence set; design constitution extracted to standalone note

## Decisions (locked 2026-07-05)
- **Build-in-public channels: both, low cadence.** Floor: 1 short video/week (sourced from reveal-card content + dev moments, not produced from scratch) + 1 written post *per milestone* (never per week — milestones only, so writing never becomes a treadmill). Adjustable upward, never obligated.
- **Design constitution extracted** → [[Studio Design Constitution]] (v1.0): rubric, ethic, method, voice, kill tests. Load as agent context on all future game work; add to vault `.claude/` context set.
- **Focus: 100% Choices.** Game #2 is deferred behind a trigger, not a date: revisit at **$1k/mo OR 10k MAU**, whichever first. H2 portfolio stays on paper until then.
- **Engine extraction ≠ framework building.** With full Choices focus, extraction means clean module boundaries + wiki documentation of each primitive as it's built — never abstracting ahead of need. The 1/10th-cost gate for game #2 is met by documentation quality, not premature architecture.
- **Build in public: now.** Merged with [[Choices Growth Plan]] §8 growth channel #1 — the reveal-moment content, the couples origin story, and the solo-builder dev log are one workstream, not two. Content serves Choices distribution first; studio brand compounding is the byproduct.
- **Revenue posture: 50/50** (reinvest/life) until $5k/mo is proven, then revisit. Reinvestment budget funds: Apple dev fee, marketing experiments, tools/model access.

## The thesis

Choices is not a food app. It is a **decision-resolution mechanic for relationships** that happened to land on dinner first. Its discovered properties — distributed agency, a winner "chosen by no one and everyone," apathy structurally eliminated, teasing instead of negotiating — generalize far beyond food.

**Company thesis:** a *relational game studio* — a portfolio of tiny games, each dissolving one recurring friction between people who love each other. The category whitespace:

| What exists | What it is | What it isn't |
|---|---|---|
| Couples apps (Paired, Lasting, Agapé) | Homework: question prompts, journaling | Fun |
| Party games (Jackbox et al.) | Fun | Doing relational work |
| **This studio** | **Playable rituals: 2-minute games that are fun AND leave the relationship better** | — |

**Mission (draft):** Play is the oldest relationship technology. We build games that turn friction into fun — so people who love each other spend less time negotiating life and more time enjoying it.

## Design constitution (the moat is taste)

Every product must satisfy the generalized fun rubric plus the studio ethic:

1. Every participant exercises agency (loss-aversion or contribution)
2. No single person owns the outcome — no blame, no apathy
3. ~2-minute sessions; async-tolerant; fits inside real life
4. Attacks a *recurring* friction (frequency = habit = retention)
5. Invite loop built in — the other player IS the acquisition channel
6. **Dissolve friction, never track it.** No scorekeeping between partners, no "you cut my pick 12 times" analytics, nothing that arms an argument. This is the ethical line and the differentiator against the cringe/dark version of gamified relationships.
7. Teasing, never mean; the target is the situation, not the person (voice rule from [[Choices Growth Plan]] §9)

## Horizon 1 — The wedge (now → 12 months)

**Goal: Choices to $5k/mo, executed per [[Choices Growth Plan]] v1.2 — but built consciously as engine extraction.**

- Every Choices feature is written as a reusable primitive, not a one-off:
  - **Pairing/Circle identity** (2 → N people; survives across games)
  - **Turn engine** (alternating) + **secret-simultaneous engine** (§7 V3)
  - **Reveal/celebration system** (the drama beat; shareable card)
  - **Streak/history layer** (relationship memory, TTL-extended)
  - **Voice/notification system** (the teasing copy engine)
  - **Bundle-ready payments** (subscription infra that can span products)
- Success gate for H2: **game #2 must cost ≤ 1/10th of game #1.** If it doesn't, the platform layer isn't real yet.
- H1 milestones: app store launch (Apple dev long pole) → 10k MAU → first $1k month → engine primitives documented in the wiki as internal SDK docs.
- Business formality when revenue is real: LLC, trademark the *studio* brand (stronger than trademarking "Choices" — the studio mark protects the portfolio).

## Horizon 2 — The portfolio (1 → 3 years)

**Goal: 3–5 games on one platform, one bundle subscription, the relational graph as the durable asset.**

Portfolio candidates (each = one friction, one mechanic, rubric-validated by simulation before UI, per the [[Choices Growth Plan]] §7 method):

| Friction | Game concept | Mechanic seed |
|---|---|---|
| Deciding (food) | **Choices** (live) | Alternating elimination |
| Chores/fairness | **Draft-the-chores** — weekly snake draft of the task list; you picked it, so no resentment | Snake draft + trade offers |
| Connection/appreciation | Daily 30-second "guess what your partner answered" | Newlywed-game guess + reveal; streaks |
| Planning (dates/weekends/travel) | Bracket for date ideas — "8 ideas enter, one weekend leaves" | Bracket (Choices §9 premium mode graduates into this) |
| Family decisions | Kids + parents deciding dinner/movie with weighted, secret votes | Secret-simultaneous (V3) + weight |
| Long distance | Async daily duel/ritual across timezones | Turn engine + time-shifted reveals |
| Repair/gratitude | *Handle with care — most valuable, easiest to get wrong; H2-late, possibly with professional input* | TBD; rubric rule 6 is load-bearing here |

Platform economics:
- **Bundle subscription** ($5–8/mo, all games) — the "tiny Nintendo for relationships." Individual games free-to-try; the bundle is the business.
- **Compounding invite loop:** your partner/family is *already on the platform* — every new game launches to a pre-connected graph. CAC approaches zero within the graph.
- **The relational graph is the moat:** shared history, streaks, and circles raise switching costs in a way no single game can.
- Churn honesty: couples apps churn when couples do. Mitigations: family/friend circles diversify beyond romantic pairs; design graceful endings (a breakup should not feel punished by the product).

## Horizon 3 — The category (3 → 7 years)

**Goal: own "relational play" as a category; multiple business surfaces.**

- **Consumer:** the bundle at scale; localized globally (the frictions are universal; the food partners aren't — pluggable per region, per [[Choices Growth Plan]] market decision).
- **B2B2C:** relationship professionals (therapists, counselors, coaches) prescribing games as between-session rituals — an evidence-informed track, possibly with research partnerships (Gottman-style "rituals of connection" literature is the scientific backbone to cite and build on).
- **Platform/SDK (optional):** license the relational mechanics engine (circles, turn systems, reveal framework) to other builders.
- **The voice:** Austin as the recognized designer of the category — build-in-public content, talks, a "Relational Game Design" body of writing. The couples origin story is the brand's founding myth; it is genuinely differentiating and should be told everywhere.
- **Exit posture:** optionality, not necessity — a profitable AI-lean studio is a great life *or* a great acquisition (couples-app consolidators, game studios, even delivery/food platforms per the Choices partnership track). Decide from strength.

## The operating model (why one person can do this)

The studio's second product is invisible: **the AI-leveraged solo-studio playbook**, already in motion:

- **Model routing as org chart:** Opus/Fable = architecture & design decisions; Sonnet = implementation; Haiku = research/verification. This document = the exec function.
- **The Obsidian wiki as company brain:** versioned decision docs (this file, [[Choices Growth Plan]]) are institutional memory that agents can load as context — the compounding asset that makes each project faster than the last.
- **Prove-before-UI:** pure game logic + Monte Carlo simulation before any interface investment (§7 method) — the studio's QA and design validation, nearly free.
- **Lean infra:** serverless, cost-alarmed, quota-aware ([[Choices Growth Plan]] §10) — infrastructure that scales to viral without scaling headcount.
- Scaling the model: headcount only where taste is required (art/brand), agents everywhere else. Revisit at H2 if throughput binds.

## Honest risks (kept visible, not buried)

1. **Consumer is hit-driven.** Portfolio + shared platform amortizes the risk, but Choices must genuinely work first — H1 is the proof, not a formality.
2. **Relationship churn is structural.** Diversify circle types (family, friends, roommates) early in H2.
3. **The cringe failure mode.** "Gamified relationships" done wrong is manipulative or trivializing. The design constitution (esp. rule 6) is the guardrail; taste is the enforcement.
4. **Solo-founder bus factor.** The wiki-as-company-brain mitigates; still real. Health and pacing are strategy.
5. **Platform dependency.** Apple's rules, AWS costs, model access (e.g., Fable until Jul 7) — keep the stack portable and decisions documented so any tier of model can execute the plan.

## Pre-July-7 Fable agenda (lock while the big model is here)

1. ✅ This roadmap v0.1
2. Refine after Austin's answers (see open questions) → v0.2
3. Lock the H1 engine-extraction list (which Choices primitives, in what order) as a Sonnet-executable backlog
4. Draft the studio design constitution as a standalone wiki note (agents load it as context on every future game)
5. Everything after Jul 7 is Sonnet/Haiku-executable by design

## Open questions (for v0.4)

- Studio identity: name/brand now or after game #2? (Lesson from Choices naming: wife has veto; don't over-invest early.)
- Family/friends circles: strictly post-trigger with game #2, or does Choices group mode (§7) count as the H1 experiment?

## Links
- Execution layer: [[Choices Growth Plan]] (v1.2)
- Part of: [[Projects MOC]]
