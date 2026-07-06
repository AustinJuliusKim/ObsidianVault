---
title: Studio Design Constitution
aliases: [design-constitution, game-rules]
tags: [studio, design, principles, evergreen]
type: reference
status: evergreen
created: 2026-07-05
updated: 2026-07-05
related: [[Relational Games Studio Roadmap]], [[Choices Growth Plan]], [[Projects MOC]]
---
# Studio Design Constitution

Load this note as context for ALL game design, feature, and copy work. Every product decision must pass every rule. v1.0 (2026-07-05).

## Mission
Play is the oldest relationship technology. We build games that turn friction into fun — so people who love each other spend less time negotiating life and more time enjoying it.

## The Rubric — every game/feature must satisfy all
1. **Agency for all**: every participant acts (cut, pick, guess, draft) — no spectators
2. **No owner of the outcome**: the result is chosen by no one and everyone → no blame, no apathy
3. **~2-minute sessions**: async-tolerant, fits inside real life, survives interruptions
4. **Recurring friction**: attacks something that happens weekly+ (frequency → habit → retention)
5. **Invite loop built in**: the other player IS the acquisition channel; never paywall the join

## The Ethic — non-negotiable
6. **Dissolve friction, never track it.** No scorekeeping between partners. No analytics that arm an argument ("you cut my pick 12×"). Nothing that converts play into evidence. If a feature could be screenshotted into a fight, kill it.
7. **Teasing, never mean.** The target is always the *situation* (indecision, chores, distance) — never the person. Emoji sparingly; one per line max.
8. **Graceful endings.** Relationships change; the product never punishes that. Design exits with dignity.
9. **Privacy as posture.** Collect the minimum; "no tracking" is a feature. PII only when a feature demands it (accounts = opt-in unlock, never a gate to play).

## The Method
10. **Prove before UI**: pure, I/O-free game logic → Monte Carlo with agent strategies (greedy/spiteful) → seat fairness + agency metrics → human playtest (wife + one friend group; judge by laughter at the reveal) → only then build interface
11. **The reveal is the product**: every game needs a drama beat worth sharing; the shareable reveal card is both celebration and marketing
12. **Primitives, documented**: build clean module boundaries, document each primitive in the wiki as built — never abstract ahead of need. Extraction by documentation, not framework
13. **Lean infra**: serverless, cost-alarmed, quota-aware; the bill is a design constraint

## Voice (canonical examples)
- Invite: "{name} gave you Choices 😏 Your move →"
- Nudge: "Still deciding? Someone's getting hangry."
- Reveal: "Nobody picked this. Everybody picked this."

## Kill Tests (fast vetoes)
- Would this feature make a couple argue *about the app*? → kill
- Does the invitee hit any wall (pay, signup, install) before playing? → kill
- Does it need >2 minutes of sustained attention? → redesign
- Is it fun ONLY because it's gamified (no real friction dissolved)? → not our game

## Links
- Strategy: [[Relational Games Studio Roadmap]]
- Execution reference: [[Choices Growth Plan]]
