# Source pack — Post #1 "I built an app for my marriage" (slug: app-for-my-marriage)

Stage-1 deterministic bundle per [[Choices Dev Blog Synthesis Plan]] §Pipeline. Assembled 2026-07-22 by the harness row-8 session. No LLM used in this file; every line traces to a named source.

## Frame (from [[Choices Marketing Proposal]] §Dev blog architecture)
- Post 1, milestone-gated to **App Store launch**. "Origin story is the door, the AI operating system is the house."
- Crossover post: written for builders, shareable by anyone. The ONLY post that leads with the love story.
- Origin story + what shipped + one honest number. One CTA, builder-facing.

## Voice (from [[Choices Dev Blog Synthesis Plan]] §2)
Builder voice: candid, numbers-transparent, first person, no AI-slop hedging. The constitution's "tease the situation" product-voice rule does NOT apply to blog posts. Required: ≥1 honest number; a "delete test"-style takeaway the reader can apply (template addition from Run 1); ~1,200–1,800 words; title options ×3; 5-tweet X thread; exactly one CTA.

## Canonical beats (verbatim from [[Choices Origin Story Source Pack]] — the only permitted story material)
| Beat | Canonical text |
|---|---|
| The ritual | The couple races to say "choices" first. The loser has to give 4 options; the winner can't complain about the result. "We've done this for years. So I built it into an app." |
| The pain | The Loop: "What do you want to eat?" / "I don't know… whatever you want." / "I picked last time." POV: it's 6:47pm. |
| The insight | Nobody picks the winner — you take turns cutting until one survives. No blame (nobody owns the outcome), no apathy (everyone acted). Elimination, not selection. |
| The name story | A full rename exploration (Choosy ⭐, Choicey, Picky, Dibs, Snackdown…) died on partner review — "too hard/corporate." Locked: keep "Choices." The name has emotional equity with its first two users; the wife holds the veto. The fix was voice, not name. |
| Design as love letter | Streaks count play days, not wins — the game deliberately has no per-player winner, so there's nothing to hold over each other. Never paywall the join. Nothing screenshottable into a fight. The reveal: "Nobody picked this. Everybody picked this." |
| Timeline | Built solo; v1 live at choices.austinjuliuskim.com June 2026; wife = first user; "wife-approval of the native feel" is the literal iOS validation gate. |
| The category claim | Not a food app — a couples game. Competitors are spin-the-wheel utilities; this is play. |

## Honest numbers (deterministic pulls, 2026-07-22)
- 82 commits touching `apps/choices-webapp` since the monorepo import (81 of them in July 2026's growth push). Source: `git log --oneline -- apps/choices-webapp | wc -l`.
- 169 backend tests, all green. Source: `node --test` on branch worktree-choices-hardening.
- 8 real games logged in the first 11 days of the event lake (2026-07-08 → 07-19). Source: [[Choices Harness Audit 2026-07-21]] item 10.
- $0/mo infrastructure: prod rides a CloudFront Free flat-rate plan (1M req/mo allowance). Source: [[Choices Growth Plan]] §10b.
- 2-player elimination invariant: the player who curates the list never makes the final cut. Source: [[Choices Growth Plan]] §7; `backend/game.mjs`.

## GAPS — PENDING, DO NOT INVENT (from [[Choices Origin Story Source Pack]] §Gap interview)
1. Ritual origin — one specific remembered instance (where, who lost, what was dinner).
2. The worst Loop moment — the concrete hangry-evening story.
3. First real decision the app made — what won, what she said.
4. Her v1 reaction beyond the naming veto.
5. **Her comfort level — gates everything.** Nothing publishes with her in it until she's genuinely enthusiastic.
6. Artifacts — early screenshots, first join code, build-week texts, the v1 commit.

The draft marks these inline as [PENDING #n]. Stage 3 (Austin) fills or cuts them.
