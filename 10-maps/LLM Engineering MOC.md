---
title: LLM Engineering MOC
tags: [moc]
type: moc
status: developing
created: 2026-06-25
updated: 2026-07-12
---
# LLM Engineering MOC
> Purpose: entry point for everything about building with LLMs.

## Principles & workflow
- [[LLM Collaboration Rules]] — 5 rules for effective agent partnership (Karpathy 4 + 1)
- [[Model Routing Strategy]] — Opus / Sonnet / Haiku by task

## Cost & context
- [[Context Budgeting]] — optimize token usage; match model tier to task

## Tooling & projects
- [[Claude REPL]] — browser playground running Claude Code in E2B sandboxes (BYOK)
- [[Wake-on-Reset Skill]] — checkpoint near the usage limit, arm a one-shot cron, resume orchestration autonomously at window reset (portable copy of the ~/.claude skill)
- [[Vault-Sync Skill]] — keep 30-projects/ notes accurate to monorepo code changes (portable copy of the repo skill)

## Planned (not yet written)
- Prompt Structure Patterns — XML tags, few-shot, role framing
- Eval Harness Basics — measuring prompt changes
- MCP & Tooling MOC — sub-map for tooling
