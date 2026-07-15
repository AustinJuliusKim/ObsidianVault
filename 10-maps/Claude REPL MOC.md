---
title: Claude REPL MOC
tags: [moc]
type: moc
status: developing
created: 2026-07-15
updated: 2026-07-15
---
# Claude REPL MOC
> Purpose: entry point for Claude REPL — a browser playground running Claude Code in per-session E2B sandboxes (BYOK).

## Core
- [[Claude REPL]] — browser playground running Claude Code in per-session E2B sandboxes (BYOK)

## Specs & plans
- [[Claude REPL Business Plan]] — guided free tier + metered wallet model (v1.3, locked)
- [[Claude REPL Lesson Plan]] — 8-lesson guided spine + advanced paid track (v1.1, locked)
- [[Claude REPL Lesson Engine Spec]] — YAML lesson configs, Stage/Rail UX split, PromptComposer (v1.1, locked)
- [[Claude REPL Accounts & Progress Spec]] — Supabase auth + Postgres wallet ledger, staged capture (v1.1, locked)
- [[Claude REPL Lesson Foundry Spec]] — agentic authoring pipeline (scout → author → seed → PR) + Model Lab bench (v1.3, locked)
- [[Claude REPL Architecture]] — Phase A/B technical architecture: recorder, fixture format/player, lesson DAG, LLM proxy + wallet metering (v1.0)
- [[Claude REPL File Preview]] — workspace pane renders previewable files (HTML/Markdown/JS), strengthening the L1 graduation beat (v0.1)

## Components
- [[Claude REPL Frontend]] — React/Vite split-pane UI
- [[Claude REPL Protocol]] — shared WS message contract
- [[Claude REPL Backend]] — Fastify WS server + E2B sandboxes

## Vault meta
- Up: [[Projects MOC]]
