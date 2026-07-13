---
title: AI Engineering Job Search
aliases: []
tags: [career, job-search, ai-engineering]
type: project
status: developing
created: 2026-07-13
updated: 2026-07-13
related: ["[[Choices Webapp]]", "[[Claude REPL]]", "[[Projects MOC]]"]
---

# AI Engineering Job Search

Positioning + application strategy for targeting AI engineering roles, anchored
on three Anthropic postings. Companion deliverables (portfolio site, résumé,
LinkedIn copy) live in the repo at `apps/portfolio/` and `apps/portfolio/deliverables/`.

## Thesis

> **Senior product/front-end engineer — ~9 years shipping React + AWS at scale
> (Loot Crate → Ring/Amazon → Riot), now building AI-native developer & learning
> tools on top of Claude.**

Lead with **craft + AI-native building**. The flagship proof point is **Guided
REPL** (a learning platform that teaches Claude Code), backed by **Choices** (a
0→1 serverless product with real Claude/Bedrock features). Stay in the
LLM-app / agent / full-stack lane — do **not** claim ML training/MLOps or deep
Python; all backends are Node.

## Career narrative

- **Loot Crate (2016–2018)** — front-end; migrated a legacy Rails/CoffeeScript app to React 15.
- **Ring / Amazon (2018–2021)** — micro-frontends embedded in Ring iOS/Android apps; AWS CDK infra.
- **Riot Games (2021–present)** — internal tooling for live-service and R&D game teams.
- **Late 2025 → now** — agentic dev with Claude Code (also Windsurf, Devin, ChatGPT); shipping own AI-native products end-to-end.

## Target roles & requirement → evidence mapping

### 1. Design Engineer, Education Labs ($300–405k) — **strongest fit**
| They want | Austin's evidence |
|---|---|
| 6+ yrs shipping web products, full-stack | 9 yrs, Loot Crate → Ring → Riot |
| TypeScript / React / CSS, interaction design | Core skill; portfolio site is a craft sample |
| Learning platform / dev-tools background | **Guided REPL is a learning platform for Claude Code** |
| LLM production / AI-native product | Guided REPL + Choices (Bedrock/Claude) |
| Prototype → production independently | Both projects shipped solo, end-to-end |
| Python, API design, analytics infra | ⚠️ **Gap** — backends are Node, not Python. Don't overclaim; emphasize API design in Node/Lambda. |

### 2. Design Engineer, Web / Creative Studio ($305–385k)
| They want | Austin's evidence |
|---|---|
| Next.js/React at scale, architecture ownership | 9 yrs React; owned front-end infra at Ring (CDK) |
| Design systems, interactive experiences | Portfolio design system; [confirm design-system work at Riot] |
| AI-powered creative/dev tooling (MCP, Claude skills) | Guided REPL (Claude Code tooling); Claude-powered Choices |
| Core Web Vitals / perf | Static site, perf-conscious build `[reinforce with Lighthouse score]` |
| Headless CMS, localization | ⚠️ Gap — no direct CMS/localization; lean on the other strengths |

### 3. Senior Software Engineer, Full-stack ($320k)
| They want | Austin's evidence |
|---|---|
| 6+ yrs full-stack, consumer/B2B products | 9 yrs; consumer (Loot Crate, Ring, Choices) |
| React + TypeScript + modern backend | Core stack |
| LLMs, agents, Claude API, MCP, observability | Claude Code agentic dev; Bedrock in Choices |
| Built 0→1, startup-like autonomy | Choices + Guided REPL both 0→1 solo |
| Component architectures, cross-team alignment | Ring micro-frontends; Riot tooling `[confirm cross-team]` |

## Proof-point inventory

- **Guided REPL** (`learn.austinjuliuskim.com`) — learning platform; frame/fixture protocol; seeder CLI recording real `claude -p` runs; accounts/progress; Lesson Foundry; React SPA + Node/Lambda on S3+CloudFront. See [[Claude REPL]].
- **Choices** (`choices.austinjuliuskim.com`) — 0→1 serverless; React + Lambda + DynamoDB; Google/Cognito auth; Stripe billing; Web Push; WAF; Claude via Bedrock for the suggestion engine. See [[Choices Webapp]].

## Application tracker

| Role | Link | Status | Tailoring note |
|---|---|---|---|
| Design Engineer, Education Labs | greenhouse.io/anthropic/jobs/5097186008 | Not applied | Lead with Guided REPL; address Python gap honestly |
| Design Engineer, Web / Creative Studio | greenhouse.io/anthropic/jobs/5223916008 | Not applied | Lead with front-end craft + AI tooling; show Web Vitals |
| Senior SWE, Full-stack | greenhouse.io/anthropic/jobs/5174743008 | Not applied | Lead with 0→1 + full-stack + Claude/agents |

## Open items (blockers to finalizing copy)

- Real metrics/dates for Riot, Ring, Loot Crate (titles, users, scale, team sizes).
- Education/credentials (or decide to omit).
- Confirm `austinjuliuskim.com` apex cert + DNS for the portfolio deploy.
- Exact GitHub repo URLs for the two projects.
- Optional: publish a dev-blog post on building Guided REPL to pin in Featured.
