---
title: Projects MOC
tags: [moc]
type: moc
status: developing
created: 2026-07-01
updated: 2026-07-06
---
# Projects MOC
> Purpose: entry point for personal projects in the `personal/projects` monorepo.

## Studio (umbrella strategy)
- [[Relational Games Studio Roadmap]] — company thesis: relational game studio; H1 = Choices to $5k/mo with engine extraction (v0.3)
- [[Studio Design Constitution]] — rubric, ethic, method, voice, kill tests; **load as context for all game design/feature/copy work** (v1.0)

## Active projects
- [[Choices Webapp]] — serverless 2-player elimination game (React + AWS Lambda + DynamoDB + Web Push)
  - [[Choices Growth Plan]] — growth + monetization strategy (target $5k/mo, food-focused, affiliate → premium → partnerships)
  - [[Choices Marketing Proposal]] — GTM/content plan: TikTok teasers + dev blog, launch sequence keyed to App Store (v0.2)
  - [[Choices Suggestion Engine Plan]] — layered typeahead (pair memory → global trie → Places) + Fill-my-4 LLM assist; phases 0–5 (v0.2)
  - [[Choices Dev Blog Synthesis Plan]] — LLM pipeline (Sonnet 5 drafts, human edits) turning shipped work into Series A/B posts; slate of 6 banked
  - [[Choices Origin Story Source Pack]] — canonical inception-story beats + gap interview (inbox; feeds Post #1, About page, Teaser 2)
  - [[Choices CloudFront PAYG Migration Plan]] — deferred playbook: leave the CloudFront Free plan → WAF-in-git, geo headers, edge-cached getState (~$10/mo)
- [[Claude REPL]] — browser playground running Claude Code in per-session E2B sandboxes (BYOK)
  - [[Claude REPL Business Plan]] — guided free tier + metered wallet model (v1.1, locked)
  - [[Claude REPL Lesson Plan]] — 8-lesson guided spine + advanced paid track (v1.0, locked)

## Claude REPL components
- [[Claude REPL Frontend]] — React/Vite split-pane UI
- [[Claude REPL Protocol]] — shared WS message contract
- [[Claude REPL Backend]] — Fastify WS server + E2B sandboxes

## Vault meta
- [[Obsidian LLM Wiki]] — this vault's own master plan
