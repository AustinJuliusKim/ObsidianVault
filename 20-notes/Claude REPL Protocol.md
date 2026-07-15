---
title: Claude REPL Protocol
aliases: [claude-repl-protocol, claude-repl protocol]
tags: [project, claude-repl, protocol, websocket]
type: note
status: developing
created: 2026-07-01
updated: 2026-07-01
related: [[Claude REPL Frontend]], [[Claude REPL Backend]]
---
# Claude REPL Protocol
Plain-JS package (`@me/claude-repl-protocol`, no dependencies) defining the WebSocket message contract shared by the Claude REPL frontend and backend. A single source of truth prevents the two sides from drifting.

## Details
- **Enums:** `ClientMsg` (setKey, prompt, approve, deny, interrupt, …) and `ServerMsg` (session_ready, text, tool_use, usage, done, …).
- **`Mode` enum:** `plan | acceptEdits | bypassPermissions` — maps to Claude Code's `--permission-mode`.
- **`parseClientMessage(raw)`:** strict validation; this is the backend's **trust boundary** — throws on malformed input, rejects unknown types.
- **`serverMessage(type, payload)`:** builder for outbound messages. `isMode(value)` guard.
- Consumed via a `file:` dependency in the monorepo, so frontend + backend always agree on the contract.

## Links
- Part of: [[Claude REPL]]
- Repo: `personal/projects/packages/claude-repl-protocol`
