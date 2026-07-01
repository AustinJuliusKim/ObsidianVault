---
title: Claude REPL Frontend
aliases: [claude-repl frontend, claude-repl app]
tags: [project, claude-code, react, frontend]
type: note
status: developing
created: 2026-07-01
updated: 2026-07-01
related: [[Claude REPL Protocol]], [[Claude REPL Backend]]
---
# Claude REPL Frontend
React 18 + Vite SPA that provides the Claude REPL playground UI: a split pane with a CLI-like terminal on the left and a live workspace (file tree + diffs) on the right. Talks to the backend over WebSocket using the shared protocol package.

## Details
- **State:** single `useReducer` state machine (`src/state/reducer.js`); server events fold directly into UI state (status, messages, files, usage, permission).
- **WS lifecycle:** `src/state/useSession.js` opens the WebSocket, sends `ClientMsg` (setKey, prompt, approve/deny, interrupt), dispatches incoming `ServerMsg`.
- **Optimistic FS:** `src/lib/virtualFs.js` applies Write/Edit tool events immediately for instant UI + diffs, then reconciles against the real sandbox FS when the run completes.
- **Key components:** `ApiKeyModal` (first-run BYOK gate), `Terminal` (input + mode select), `WorkspacePane` (CodeMirror read-only + `react-diff-viewer-continued`), `PermissionModal` (approve/deny gated actions).
- **BYOK:** user's Anthropic API key held in `sessionStorage` only, sent over WSS; never persisted.
- **Config:** `VITE_BACKEND_WS_URL`; dev server proxies `/ws` to backend :8787.

## Links
- Part of: [[Claude REPL]]
- Repo: `personal/projects/apps/claude-repl`
