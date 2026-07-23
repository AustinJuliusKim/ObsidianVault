---
title: Choices Dev Blog Synthesis Plan
aliases: [choices-blog-pipeline, dev-blog-synthesis]
tags: [choices, marketing, content, llm, pipeline, planning]
type: project
status: draft
created: 2026-07-08
updated: 2026-07-22
related: ["[[Choices Marketing Proposal]]", "[[Choices Growth Plan]]", "[[Choices Suggestion Engine Plan]]", "[[Relational Games Studio Roadmap]]"]
---
# Choices Dev Blog Synthesis Plan

Pipeline for turning shipped Choices work into dev-blog drafts with an LLM. Extends [[Choices Marketing Proposal]] §Dev blog architecture — that note owns the frame (X + owned static blog + email, candid numbers-transparent voice, **1 post per milestone**, Series A "one-person studio" / Series B build-logs, every post ends with one CTA); this note owns the *how*.

## Principles (from the proposal + roadmap, restated as pipeline constraints)
- **Milestone-gated, never a treadmill**: drafts are *banked*; publishing follows the 1-per-milestone floor. Post #1 ("I built an app for my marriage") stays gated to App Store launch and leads the blog.
- **Human voice is the brand**: the model drafts, Austin edits and owns every published word. Never auto-publish.
- **Numbers-transparent**: every draft must carry at least one honest number (cost, conversion, test count, failure). The source pack makes numbers available; the prompt requires one.
- **Two audiences never mixed**: these posts are for builders. Product CTAs stay secondary.

## The pipeline (3 stages)

### 1. Source pack (deterministic, no LLM)
Per post, a script/skill assembles one markdown bundle:
- `git log` + merged PR descriptions for the relevant branch range (`gh pr list/view` — the PR bodies are already narrative gold: decisions, ops tasks, failure notes)
- Relevant vault note excerpts (the decision docs: §10b, suggestion plan, PAYG playbook)
- Session artifacts where they exist (verification transcripts, cost numbers, error messages verbatim — e.g. CloudFront's exact rejection string)
Store packs at `00-inbox/blog-drafts/<slug>/sources.md`.

### 2. Draft (one LLM call per post)
- **Model: Claude Sonnet 5 (`claude-sonnet-5`)** — the writing workhorse, matching the vault's org-chart routing (Sonnet = implementation/writing). Near-Opus prose quality at $3/$15 per MTok ($2/$10 intro through 2026-08-31). A post (≈40K tokens of source pack in, ≈4K out) costs **≈ $0.15–0.30/draft** — generate 2 variants and it's still under a dollar.
- **Escalation**: Fable/Opus only for the outline/critique pass on flagship posts (launch post, PAYG war story) where judgment > fluency. Haiku 4.5 for mechanical passes (link checking, front-matter, excerpt/thread generation for X).
- Prompt template (versioned in the vault or repo skill): **load [[Austin Voice Pack]] and imitate its verbatim §Samples — samples beat trait adjectives; run its §Checks before output** (codified 2026-07-22: the constitution's "tease the situation" rule does NOT apply here — builder voice, not product voice; this override lives here, not in per-harness prompts) + post brief (angle, series, target length ~1,200–1,800 words, required number, CTA) + source pack. Ask for: title options ×3, the post, a 5-tweet X thread excerpt.
- Output to `00-inbox/blog-drafts/<slug>/draft-v1.md`.
- Execution vehicle: a repo skill (`/blog-draft <slug>`) that gathers sources and makes the API call — or simply a Claude Code session on Sonnet with the same prompt. Skill preferred once cadence is real; session is fine for the first posts.

### 3. Edit + publish (human)
Austin's pass for voice/accuracy → move to the blog repo when the static blog exists (proposal's lean path: static site on the existing CloudFront infra + Buttondown-class email; still pending the Haiku comparison task from the proposal). X thread posts the excerpt linking home.

## Post slate from the current work (banked, publish per milestone map)
| Draft | Series | The number/hook |
|---|---|---|
| **"The $0 pricing plan that designed my architecture — until it said no"** | A | CloudFront Free plan verbatim rejection → browser-geo fallback → the deferred $10/mo PAYG playbook. Constraints-as-design-material. |
| **"Pair memory: the typeahead that feels psychic on DynamoDB pennies"** | A | HIST# item, k-anonymity pairHash, 3-layer merge/rank — all inside free tier. |
| **"One ✨ button, five gating decisions"** | A | Fill-my-4: Bedrock use-case approval wait + Nova fallback math, counter-on-the-pairing vs USER#, idempotent replay so retries can't double-bill. |
| **"Proxying Google Places without leaking keys or locations"** | A | Session-token billing, the world-rectangle neutrality trick, 📍 pin as consent surface, ~1km coord rounding. |
| **"Model routing as an org chart"** (already slated in the proposal) | A | This build week as the case study: Fable planned, Sonnet implemented, Haiku verified. |
| **Suggestion-engine milestone build-log** | B | The week in numbers: N PRs, ~100 backend tests, IAM policy versions v7→v10, feature cost ≈ cents. |

## Metrics
Same loop as the proposal: subscribers + builder DMs; per-post UTM to the game. Weekly one-line review notes in the vault.

## Shakedown log
- **Run 1 (2026-07-08): "Game-first onboarding"** (Duolingo/Wordle pattern, Choices receipts) — drafted **in-session** (no `ant`/API key on the machine; per the first-posts allowance). Source pack + draft-v1 + thread at `00-inbox/blog-drafts/game-first-onboarding/`. Pipeline notes: PR bodies weren't needed for this one (product post — code-verified flow walk replaced them); the "one honest number" rule produced the strongest lines (2 taps, 0 signups, the `ghost` CSS class); Wordle web-verification added the closer (built for his partner). Template addition for next run: require a "delete test" style takeaway the reader can apply to their own product. This post joins the slate (7 banked).
- **Run 2 (2026-07-22): Post #1 "I built an app for my marriage"** (slug `app-for-my-marriage`) — drafted **in-session** via harness row 8. Source pack + draft-v1 + thread at `00-inbox/blog-drafts/app-for-my-marriage/`. Pipeline notes: the Origin Story Source Pack's gap interview is still unfilled, so the draft carries six inline `[PENDING #n]` slots instead of invented detail (the pack's "do not invent" rule held; gap #5 — her enthusiasm — gates publishing on top of the App Store milestone). The canonical-beats table drafted cleanly; the "delete test" template rule produced the post's takeaway (design the *blame* out). Voice-pack note for next run: harness prompt said constitution voice, this plan overrides to builder voice for blog — codify the override in the prompt template so future runs don't have to resolve it. 8 banked.
- **Run 3 (2026-07-22): Post #1 draft-v2** — Austin flagged v1 as dry and supplied 3 LinkedIn posts; verbatim samples + measured traits now live in [[Austin Voice Pack]] (provisional traits were measurably wrong — his register is long chained sentences, absurd similes, meme deadpans, life-as-parentheticals, not tidy short declaratives). `draft-v2.md` re-drafted against the samples; v1 kept beside it so Austin's edit-diff can compare all three (v1, v2, his edit). Pipeline lesson: the voice pack should have existed before Run 1 — samples first, always.

## Next actions
- [x] First draft run — done 2026-07-08 ("Game-first onboarding", see Shakedown log); refine the voice pack from Austin's edits. CloudFront story remains next in the queue.
- [x] **Seed [[Austin Voice Pack]] §Samples** — done 2026-07-22 (3 LinkedIn posts, captured verbatim; Austin: eyeball fidelity once). More samples still welcome, esp. a raw voice-memo transcript.
- [ ] After each stage-3 edit, append the edit-diff patterns to [[Austin Voice Pack]] §Edit-diff log, then re-draft the NEXT post with it; optionally re-run `app-for-my-marriage` as draft-v2 once samples exist.
- [ ] Resolve the blog hosting task (proposal: Haiku compares Substack-custom-domain vs static+email; Sonnet builds the winner).
- [ ] Turn the pipeline into a repo skill once ≥2 posts have gone through it manually.

## Links
- Owns the frame: [[Choices Marketing Proposal]] · Cadence lock: [[Relational Games Studio Roadmap]] · Material: [[Choices Growth Plan]], [[Choices Suggestion Engine Plan]], [[Choices CloudFront PAYG Migration Plan]]
