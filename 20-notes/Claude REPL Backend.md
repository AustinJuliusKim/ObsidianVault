---
title: Claude REPL Backend
aliases: [claude-repl-backend, claude-repl backend]
tags: [project, claude-code, backend, e2b, websocket]
type: note
status: developing
created: 2026-07-01
updated: 2026-07-01
related: [[Claude REPL Protocol]], [[Claude REPL Frontend]]
---
# Claude REPL Backend
Stateful Fastify + `@fastify/websocket` server that runs Claude Code headless inside a per-session E2B sandbox and streams events back to the browser. No database — all state is in-memory for the life of the WebSocket/sandbox.

## Details
- **`sessionManager.mjs`** — one `Session` per WS: attach/teardown, idle timeout (`IDLE_TIMEOUT_MS`, default 5 min), token-cap enforcement, message routing. Sandbox boots in parallel with API-key entry.
- **`claudeRunner.mjs`** — builds the `claude -p "…" --output-format stream-json --permission-mode <mode>` command (adds `--permission-prompt-tool mcp__approvals__approve` for plan/acceptEdits; `--resume <sessionId>` for multi-turn); buffers/splits NDJSON stdout.
- **`streamMapper.mjs`** — pure function: Claude Code NDJSON event → protocol `ServerMsg`. Defensive with optional chaining since stream-json shapes vary by Claude Code version.
- **`permissionBridge.mjs`** — parks permission prompts until the browser approves/denies, then resumes Claude.
- **`sandbox.mjs`** — E2B wrapper (create/run/list/read/kill); `ANTHROPIC_API_KEY` passed at runtime only, never written to disk.
- **`usage.mjs`** — token/cost accounting + hard per-session cap (`SESSION_TOKEN_CAP`) to stop runaway loops.
- **BYOK safety:** key held in memory only, dropped on disconnect; Pino redaction (`src/log.mjs`) keeps secrets out of logs.
- **Ops:** `/healthz`, `/readyz`; graceful drain on SIGTERM/SIGINT. Needs a persistent container (not Lambda). Env: `E2B_API_KEY`, `E2B_TEMPLATE`, `PORT` (8787), `IDLE_TIMEOUT_MS`, `SESSION_TOKEN_CAP`, `LOG_LEVEL`.

## Links
- Part of: [[Claude REPL]]
- Repo: `personal/projects/services/claude-repl-backend`
