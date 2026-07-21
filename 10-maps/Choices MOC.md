---
title: Choices MOC
tags: [moc]
type: moc
status: developing
created: 2026-07-15
updated: 2026-07-21
---
# Choices MOC
> Purpose: entry point for the Choices webapp — a serverless 2-player elimination game — and its plan docs.

## Core
- [[Choices Webapp]] — serverless 2-player elimination game (React + AWS Lambda + DynamoDB + Web Push)
- [[Choices Webapp Execution Harness]] — dependency-ordered schedule of self-contained Claude Code prompts distilled from the plans below (run via /harness)

## Plans & specs
- [[Choices Growth Plan]] — growth + monetization strategy (target $5k/mo, food-focused, affiliate → premium → partnerships)
- [[Choices iOS GTM Plan]] — business/legal launch review: Apple enrollment, US-only territories, IAP path to first $400, cost model (v0.1)
- [[Choices Marketing Proposal]] — GTM/content plan: TikTok teasers + dev blog, launch sequence keyed to App Store (v0.2)
- [[Choices Brand Book]] — brand & market engagement: "Final Cut" identity, App Store naming architecture, competitive whitespace (v0.1, proposed)
- [[Choices Suggestion Engine Plan]] — layered typeahead (pair memory → global trie → Places) + Fill-my-4 LLM assist; phases 0–5 (v0.3)
- [[Choices Data Architecture Plan]] — S3 event-lake + Athena OLTP/OLAP split, staged A→C, additive-only frozen event catalog (v0.3)
- [[Choices Dev Blog Synthesis Plan]] — LLM pipeline (Sonnet 5 drafts, human edits) turning shipped work into Series A/B posts; slate of 6 banked
- [[Choices Origin Story Source Pack]] — canonical inception-story beats + gap interview (feeds Post #1, About page, Teaser 2)
- [[Choices CloudFront PAYG Migration Plan]] — deferred playbook: leave the CloudFront Free plan → WAF-in-git, geo headers, edge-cached getState (~$10/mo)

## Vault meta
- Up: [[Projects MOC]]
