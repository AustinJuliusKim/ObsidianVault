---
title: Claude REPL
aliases: [claude-repl]
tags: [project, claude-code, e2b, websocket]
type: project
status: developing
created: 2026-07-01
updated: 2026-07-01
related: [[Projects MOC]], [[Model Routing Strategy]], [[Context Budgeting]]
---
# Claude REPL
Browser-based playground that teaches Claude Code. A split pane shows a CLI-like terminal (left) and a live workspace with file tree + diffs (right). Prompts run Claude Code **headless inside an isolated E2B sandbox, one per session**. **BYOK** — the user supplies their own Anthropic API key.

## Goal
Let people learn Claude Code interactively in the browser without installing it, while keeping their API key safe and ToS-compliant (standard API-key billing, never Pro/Max OAuth on a hosted service).

## Components
- [[Claude REPL Frontend]] — React/Vite SPA (`apps/claude-repl`).
- [[Claude REPL Protocol]] — shared WS message contract (`packages/claude-repl-protocol`).
- [[Claude REPL Backend]] — Fastify WS server + E2B sandboxes (`services/claude-repl-backend`).

## Architecture (message flow)
Browser (React `useSession` WS hook) ⇄ **WSS** ⇄ Fastify backend ⇄ per-session **E2B sandbox** running Claude Code.
1. Browser connects → `sessionManager` creates a Session, starts idle timer.
2. User enters API key → sandbox boots in parallel (non-blocking).
3. User prompts → `claudeRunner` builds `claude -p … --output-format stream-json --permission-mode <mode>` in the sandbox.
4. Claude emits NDJSON → `streamMapper` normalizes each event → protocol `ServerMsg` → browser.
5. Plan/acceptEdits modes: permission prompts park in `permissionBridge` until the browser approves/denies.
6. Run completes → workspace reconciled against real sandbox FS → `file_tree` sent.
7. Disconnect or idle timeout → sandbox killed, API key dropped.

The shared [[Claude REPL Protocol]] is the trust boundary (`parseClientMessage` validates all client input).

## Key context / gotchas
- **BYOK safety:** key in browser `sessionStorage` only, over WSS, in backend memory only, never on disk, dropped on disconnect; logs redacted.
- **Permission modes** (`plan | acceptEdits | bypassPermissions`) map to Claude Code `--permission-mode`; bypass is safe only because it runs in a disposable microVM.
- **Cost control:** per-session token cap + 5-min idle timeout kill runaway loops (matters under BYOK).
- **Continuity:** `--resume <sessionId>` preserves context across prompts.
- **Optimistic virtualFS** then real-FS reconcile (catches files created by bash, not just tool events).
- **Backend is stateful** — needs a persistent container (not Lambda). E2B template pre-bakes Claude Code for faster cold starts.

## Deploy / env
- Frontend: static host; `VITE_BACKEND_WS_URL`.
- Backend: `npm start` on :8787; env `E2B_API_KEY`, `E2B_TEMPLATE`, `IDLE_TIMEOUT_MS`, `SESSION_TOKEN_CAP`, `LOG_LEVEL`.
- E2B template built once: `cd sandbox-template && e2b template build` → set `E2B_TEMPLATE`.

## Status
MVP (single commit); functional for single/multi-prompt sessions. Phase 2 (guided lessons on top of the same event stream) planned.

## Links
- Part of: [[Projects MOC]] · also under [[LLM Engineering MOC]]
- Repo: `personal/projects/{apps/claude-repl, packages/claude-repl-protocol, services/claude-repl-backend}`
