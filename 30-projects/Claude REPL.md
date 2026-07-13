---
title: Claude REPL
aliases: [claude-repl]
tags: [project, claude-code, e2b, websocket]
type: project
status: developing
created: 2026-07-01
updated: 2026-07-12
related: [[Projects MOC]], [[Model Routing Strategy]], [[Context Budgeting]], [[Claude REPL Business Plan]], [[Claude REPL Lesson Plan]], [[Claude REPL Lesson Engine Spec]], [[Claude REPL Accounts & Progress Spec]], [[Claude REPL Lesson Foundry Spec]], [[Claude REPL Architecture]]
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
- **LIVE (2026-07-03): https://learn.austinjuliuskim.com** — static-only Guided mode; CloudFormation stack `GuidedRepl` (us-west-2): private S3 + CloudFront (OAC, SPA fallback), ACM cert us-east-1, Route53 alias. CI deploy on push to main via OIDC role `guided-repl-github-deploy` (`.github/workflows/guided-repl.yml`); one-time provisioning via `apps/guided-repl/scripts/bootstrap-infra.sh` (admin profile). Cache: immutable except no-cache `index.html`. Own-domain migration later = cert + `CustomDomain` param + DNS.
- App env: `VITE_FIXTURE_VERSION` (fixture path pin). No backend deployed yet (Phase B / live mode will need one — the historical backend env vars were `E2B_API_KEY`, `E2B_TEMPLATE`, `IDLE_TIMEOUT_MS`, `SESSION_TOKEN_CAP`).

## Status
MVP (single commit); functional for single/multi-prompt sessions. Direction locked: [[Claude REPL Business Plan]] (v1.1 — guided free tier + metered wallet) and [[Claude REPL Lesson Plan]] (v1.0 — 8-lesson guided spine). Phase A/B technical architecture done: [[Claude REPL Architecture]] (v1.0). **Phase A MVP rebuilt greenfield (2026-07-02)** at `projects/{packages/guided-repl-protocol, services/guided-repl-seeder, apps/guided-repl}` — the prior claude-repl codebase was deleted; the notes [[Claude REPL Frontend]]/[[Claude REPL Backend]]/[[Claude REPL Protocol]] describe that deleted MVP and are historical. Greenfield MVP with real recorded fixtures (local `claude -p` runner; E2B seam stubbed). **All 8 lessons live (2026-07-03)**: spine v1.1 recorded (~20 live runs, snapshot chain l1→l8), quiz assertions + L2 step-through annotations, CLI-style UI (⏺/⎿ transcript, explorer tree) — arch doc v1.1 amendments. 163 unit tests + 17 Playwright e2e, CI + DAG↔fixtures/redaction gates. Deviation from arch doc: frames are nested `{type, payload}` (see FIXTURE_FORMAT.md). File preview shipped 2026-07-03 ([[Claude REPL File Preview]] P-A/P-B: sandboxed HTML+Markdown preview tabs; JS rendering = P-C later) + lesson-kind rail chips (quiz/check) + file-tree hover fix; 74 unit / 19 e2e. **Accounts & Progress implemented (2026-07-12)** on branch `feature/repl-accounts-progress` (PR pending): `Capture` step + `{{userName}}` render-time interpolation across protocol/engine/app, L1 name (post-intro) + email (post-grade) capture moments, tokenized fixtures (default persona "Demo User"), and new `services/guided-repl-api` — Fastify + pg behind a Supabase auth adapter, SQL migrations (users/leads/progress/events/sessions + append-only `wallet_ledger` w/ GDPR carve-out), deployed as Lambda via `@fastify/aws-lambda` behind a conditional CloudFront `/api/*` behavior (Dockerfile kept for the spec's container topology); CI `api` job added. e2e proves guided mode never blocks on the API (30/30 with no backend). Ops completed 2026-07-12 evening: Supabase project `gyxtrrwvfseyshjxeeyr` live + migrated, `GuidedReplApi` stack deployed (manual, admin), `ApiOriginDomain` wired, `learn.austinjuliuskim.com/api/health` 200. Follow-ups in flight (PRs pending): fixture v1→v2 cache-bust bump; CI `api-deploy` job (sam deploy param-reuse, protocol-symlink dereference) + deploy-role policy doc; magic-link email template (`services/guided-repl-api/email-templates/`); SES sandbox SMTP prepared for Supabase (domain DKIM verified, creds local). Next: live BYOK transport; E2B runner; advanced-track content; `--resume` continuity beat; preview P-C.

**Lesson Engine migration implemented (2026-07-09)** per [[Claude REPL Lesson Engine Spec]] (v1.0) + [[Claude REPL Lesson Plan]] v1.1 — PR #23 open on AustinJuliusKim/projects (single PR; the initial 4-way stacked split #19–#22 was collapsed because the `file:`-coupled packages only pass CI as a whole — the collapse also carries the CI fix installing each job's linked-package deps so zod/yaml resolve through the protocol symlink): new `packages/guided-repl-lessons` (YAML sources → compiled `lessons.json`; l1 hand-authored template, l2–l8 converted); Zod lesson schema + semantic anchors + `tty_chunk`/fixture-`kind` in `packages/guided-repl-protocol` (zod = its first dep); app gains headless `LessonEngine` (reducer, instructing→prompting→running→reflecting→graduated), left Rail (quizzes non-diegetic, collapses during runs), `PromptComposer` autocomplete replacing the three-button PromptBuilder (suggestions carry explicit `branchId` — fixes latent bug where duplicate-expectedPrompt branches l4 revise / l5 acceptEdits+bypass / l7 with / l8 sonnet were unreachable), TerminalDrill/shellTranscript machinery (tests only; L6/L8 drills authored later); `checkPromptJoin.js` replaced by suggestion↔branch coverage + anchor-drift + recompile-drift CI gates. Unit 89 (app) / 63 (protocol) / 18 (lessons) / 68 (seeder), e2e 26. Spec's `claude-repl-*` package names intentionally mapped to the repo's `guided-repl-*` naming.

## Links
- Part of: [[Projects MOC]] · also under [[LLM Engineering MOC]]
- Plans: [[Claude REPL Business Plan]] · [[Claude REPL Lesson Plan]] · [[Claude REPL Architecture]] · [[Claude REPL File Preview]]
- Repo: `personal/projects/{apps/claude-repl, packages/claude-repl-protocol, services/claude-repl-backend}`
