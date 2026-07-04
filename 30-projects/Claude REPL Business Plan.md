---
title: Claude REPL Business Plan
aliases: [claude-repl-business]
tags: [project, claude-repl, business, monetization, simulator]
type: project
status: evergreen
created: 2026-07-01
updated: 2026-07-01
related: [[Claude REPL]], [[Projects MOC]], [[Model Routing Strategy]], [[Context Budgeting]]
---
# Claude REPL — Business Plan (v1.1 · LOCKED)

**One-liner:** A metered, browser-hosted agentic-coding platform whose free on-ramp is **Guided mode** — seeded, interactive Claude Code lessons replaying curated event streams at zero marginal cost. Guided lessons are free; *live execution* is metered; *advanced curriculum* is paid for everyone.

## Locked decisions
- **Primary customer (v1):** individual key-phobic, AI-curious learners (vibe coders, PMs, designers, devs new to agentic coding). Teams = v2, frozen until proof gates read.
- **Revenue:** managed credits — prepaid **dollar wallet, transparent-ish markup** (pass-through × ~1.8, hypothesis). Credits-only v1; hybrid sub considered at v2.
- **Single wallet, dual use:** debited by (a) metered live usage (wallet mode) and (b) fixed-price advanced-track unlocks (all users). One Stripe integration, one balance.
- **BYOK policy:** basic live sessions free on your own key; **advanced live tracks gated for everyone** — BYOK users unlock tracks via the same wallet. BYOK = discount lane, not free lane.
- **Free tier:** full **Guided mode** spine — all 8 free lessons seeded at launch. No free managed credits.
- **Guided-mode branding:** subtle "Guided mode" badge. **Coupled-disclosure principle:** safe while input is a locked builder; when fuzzy-match freeform ships, disclosure gets louder in the same release.
- **Guided input UX:** locked prompt-builder first; fuzzy-match freeform later.
- **Launch scope:** Phases A + B together — full funnel (guided → graduate → pay) day one. Phase B ruthlessly minimal; BYOK fallback launch if wallet slips.
- **Scope:** Claude Code now, multi-tool later.
- **Ambition:** prove it first, decide later — see Proof gates.

## Guided mode (seeded lessons)
Structured-prompt exercises; every branch run live once during authoring, its normalized `ServerMsg` stream recorded as a fixture, replayed through the real UI with realistic pacing.
- **Recorder:** authoring uses the existing live path; persist post-`streamMapper` streams + FS snapshots per step.
- **Fixture player:** second transport behind `useSession`. The [[Claude REPL Protocol]] is the contract — UI agnostic to live vs replayed. Fixtures ship static via CDN; no backend for free users.
- **Lesson DAG:** scaffolded prompt construction; branches map to prompt levels (vague → constrained → plan-mode), each seeded. Curated-counterfactual comparison is the core pedagogy.
- **Graduation moment:** built-in conversion point — go live via BYOK or wallet.
- **Terminology:** *seeded lessons / fixtures* — not Anthropic's prompt-caching API.
- **Fixture freshness is load-bearing:** lesson specs are executable; CI re-seeds per Claude Code release, diffs streams, flags drift. ~8 lessons × branches ≈ 20–30 seeded runs to maintain.

## The funnel
| Tier | Auth/Pay | What they get | Cost to us |
|---|---|---|---|
| **0 · Guided** (anon) | none | All 8 seeded lessons in the real UI; shareable replays | ~$0 (static) |
| **1 · Live — BYOK** (free acct) | own API key | Basic freeform live sessions, capped; track unlocks via wallet | E2B cents |
| **2 · Live — Wallet** (paying) | packs $5/$20/$50 | Managed key (zero setup), metered usage, track unlocks, persistent workspaces, BYO-repo practice, plan library, certificates | API pass-through + E2B |
| **3 · Teams** (v2, frozen) | seats + pooled wallet | Tier 2 + dashboards, proficiency analytics, private org tracks, SSO | + support |
| **4 · Partners** (later) | custom | Embeddable guided/live widget; bespoke curricula; certs | services |

## Proof gates (review ~90 days post-launch — hypothesis numbers, tune before launch)
- Guided spine completion (L1→L8) ≥ 25% of starters
- Guided → live activation (BYOK or wallet) ≥ 10%
- Live → first pack purchase ≥ 20% of wallet-eligible
- Repeat pack purchase ≥ 30% of first buyers; fraud loss < 2% of revenue
**Gates pass →** decide lifestyle vs venture; unfreeze Teams. **Gates fail →** diagnose funnel stage, iterate or fold.

## Roadmap
- **Phase A — Guided mode:** recorder, fixture player, lesson DAG format, prompt-builder UI, 8 seeded lessons, static hosting.
- **Phase B — Live paid mode (minimal contract):** Stripe prepaid packs, LLM proxy, proxy-side metering, hard-stop wallet, fixed-price track unlocks. **No** auto-reload, trial credits, or subscriptions.
- **Launch gate:** A + B complete. Fallback: A + BYOK, flip wallet on after.
- **Phase C — Teams:** frozen behind proof gates.

## Managed-credits architecture (Phase B)
- Master key never enters the sandbox (user-controlled = exfiltratable). **LLM proxy:** sandbox gets scoped per-session token; Claude Code targets proxy via `ANTHROPIC_BASE_URL`; proxy injects the real Console key.
- **Meter at the proxy** — billing truth; sandbox `stream-json` usage events display-only. Wallet hard-stop at zero; per-session cap retained as runaway brake.
- Protocol: session auth `{mode:'byok'|'wallet'|'guided'}` — touches `parseClientMessage`, [[Claude REPL Backend]].
- Abuse: prepaid-only, Stripe Radar, rate limits, sandbox egress allowlist (verify E2B controls; fallback = pre-baked template + proxy-only).

## Auth strategy (researched 2026-07-01)
"Sign in with Claude" third-party OAuth exists, but Anthropic's builder guidance remains Console API keys for products serving others; third-party billing changes paused June 15, 2026 pending rework. **Decision:** managed keys + BYOK now; auth abstraction so official OAuth slots in when stable; never route raw `claude setup-token` subscription tokens absent program approval. Verify at build: support.claude.com/en/articles/13189465 · /15036540 · code.claude.com/docs/en/authentication.

## Revenue, ranked
1. **Managed credits** — dollar wallet, transparent-ish markup; sold as convenience + platform, never "cheaper tokens."
2. **Advanced-track unlocks & certificates** — fixed credit prices; hybrid sub at v2.
3. **Team seats** (v2) — killer feature: practice on a sanitized clone of *their* repo.
4. **Embeddable widget licensing** — guided embeds are static and cheap to license.
5. *(later)* **Creator marketplace** — seeded lesson tracks; rev share.

## Moat
- **Seeded-lesson engine:** authoring pipeline + fixture player + branch pedagogy — deterministic, auto-gradable, CI-freshness-tested.
- **Cost-transparency UX:** live spend meter as pedagogy → [[Context Budgeting]]; defaults pin Sonnet/Haiku, Opus opt-in → [[Model Routing Strategy]] (teaches routing, protects margin).
- **Prompt-plan library** network effects.

## Unit economics
- Guided: static CDN ≈ $0 marginal; seeding a few dollars per lesson per CC version.
- Wallet: revenue = tokens × multiplier + track unlocks; gross margin ≈ (multiplier−1)/multiplier − E2B/Stripe/fraud.
- Pull live Anthropic API pricing at implementation; keep pricing pass-through-relative.

## Risks
- **Fixture drift** → CI re-seed pipeline (load-bearing). **Perceived fakery** → builder-locked input now; coupled-disclosure when freeform ships.
- **A+B scope creep** → Phase B minimal contract; BYOK fallback preserved.
- **Key exfiltration** → proxy. **Fraud/chargebacks** → prepaid-only, Radar, no free credits.
- **Platform risk / policy flux** → speed + B2B depth; BYOK + managed keys are flux-proof; multi-tool option later.
- **E2B lock-in** → sandbox interface abstraction. **Margin optics** → honest pricing, sell platform value.

## Curriculum spine
- **Guided (free, all at launch — spine v1.1, see [[Claude REPL Lesson Plan]]):** 1 Ship a page in 90s · 2 Why did it do that? (agentic loop) · 3 Prompt ladder · 4 Plan mode · 5 Permission modes · 6 Reading diffs · 7 CLAUDE.md · 8 Cost, models & going live (incl. `--resume`)
- **Advanced (paid, all users):** MCP servers · Skills/SKILL.md authoring · Hooks · Subagents · [[Model Routing Strategy]] deep-dive · [[Context Budgeting]] · Headless/CI (`claude -p`) · Testing loops · Monorepos

## Next step
Business plan locked. Next: **Phase A/B technical architecture plan in Claude Code** (Opus for the architecture pass per [[Model Routing Strategy]]) — recorder/fixture format, player transport, lesson DAG schema, proxy design, wallet service. Feed this doc + [[Claude REPL]] as context.

## Changelog
- **v1.1** (2026-07-02) — Guided spine amended to lesson-plan v1.1 (loop lesson inserted; sessions merged into L8) per approved amendment in [[Claude REPL Lesson Plan]].
- **v1.0** (2026-07-01) — LOCKED. BYOK gated same as everyone for advanced tracks → single wallet, dual use (metered usage + fixed-price unlocks). Full 8-lesson guided spine at launch. Ambition: prove-first → proof gates defined, Teams frozen behind them. All open questions resolved.
- **v0.4** — Guided mode badge + coupled-disclosure principle; builder-first UX; A+B launch scope.
- **v0.3** — Free tier redefined as seeded simulator lessons; dollar wallet; credits-only v1.
- **v0.2** — Customer/revenue/scope locked; metered-platform reframe; proxy architecture.
- **v0.1** — Initial framing; auth research (Sign in with Claude; June 15 billing pause).
