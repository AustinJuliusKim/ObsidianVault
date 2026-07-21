---
title: Choices Harness Audit 2026-07-21
aliases: [choices-audit-2026-07-21]
tags: [choices, claude-code, workflow]
type: reference
status: locked
created: 2026-07-21
updated: 2026-07-21
related: ["[[Choices Webapp Execution Harness]]", "[[Choices Webapp]]"]
---
# Choices Harness Audit 2026-07-21

Prompt 0 output of [[Choices Webapp Execution Harness]]. Read-only audit of `apps/choices-webapp` (repo `~/personal/projects`, main @ 38d07d0 local / 0055e2f0 origin) + live AWS state via the `ChoicesUser` credential. Point-in-time — verify before acting on file:line claims. (Written to the vault rather than repo `docs/` — this session's write scope; later prompts should load this note.)

## Status matrix

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 1 | WAF Count→Block + origin-header | **PARTIAL — cutover stalled** | Live prod ACL `CreatedByCloudFront-8bb2952d` on dist `E10NKWIYPOLFM0`: rule `ChoicesRateLimitPerIp` (600/300s) in **Count**. A second ACL `ChoicesEdgeWaf` with the same rule in **Block** exists but is attached to nothing. Origin-header code-complete (`backend/handler.mjs:82-87`, `template.yaml:49-65,199-200,584-587`; test `handler.test.mjs:1983-1996`) but live `EnforceOriginHeader=false` and CloudFront origin has `CustomHeaders: {Quantity: 0}` |
| 2 | Synthetics canary | **NOT DONE** (repo); live UNKNOWN | Zero repo hits for synthetics/canary; `describe-canaries` AccessDenied for ChoicesUser |
| 3 | Business/funnel dashboard | **NOT DONE — not even instrumented** | `ops/ops-dashboard.yaml:35-40` is ops+heartbeat only; backend emits only GameCreated/SeatClaimed/GameCompleted/FillMyFour/ApiError (`handler.mjs:333,391,441,773,203`) — no GameJoined/ShareReveal metric exists; live dashboard list AccessDenied |
| 4 | Frontend Sentry/RUM | **NOT DONE** | Zero hits in frontend src/package.json/index.html |
| 5 | EXACTLY_FOUR constraint | **STILL PRESENT** (Prompt 4 valid) | `backend/game.mjs:24-25` throws EXACTLY_FOUR; `frontend/src/CreatePairingView.jsx:14,135` fixed 4-slot UI |
| 6 | Backend CI tests | **DONE** | `.github/workflows/choices-webapp.yml` job `backend-tests` (npm ci + `node --test`), deploys `needs:` it; suites: game, handler (73KB), admin, compaction, events, history, moderation, stats, streamConsumer, suggestai |
| 7 | README/PLAN doc drift | **DONE** | `docs/PLAN.md:1-9` historical banner; `README.md` describes pairing/join-code model; no unflagged `/g/` refs |
| 8 | Pair head-to-head tally | **NOT DONE — likely N/A by design** | `backend/stats.mjs:3-5`: "the game has no per-player winner — the winning choice is shared"; HIST# winCounts are per **choice label** (`history.mjs:25-49`), not per seat |
| 9 | feature/ios-capacitor | **STALE — superseded** | 0 commits ahead of main, 151–164 behind; tip `d25d8124` (2026-07-04) is an ancestor of main; `STORE_READINESS.md:7,13` shows the Capacitor shell/haptics shipped via main. Branch safe to delete. Second branch `fix/lambda-cors-capacitor` not inspected |
| 10 | Games logged vs ~1k trie gate | **Mechanism DONE; volume ~8** | `SuggestDataBucket` (`template.yaml:293-304`) live as `choiceswebapp-suggestdatabucket-qlsu9yc8jocq`: 8 objects / 1,257 B across dt=2026-07-08…07-19. Far below gate |

## Effects on the harness schedule

- **Row 3 (hygiene) → audit-DONE** (items 6 + 7 above).
- **Row 9 (iOS Phase A) → audit-DONE for the shell**; delete stale branch; on-device personal-team install check moves to row H; inspect `fix/lambda-cors-capacitor` before deleting anything.
- **Row 1 (data lake) caveat**: `streamConsumer.test.mjs`, `events.test.mjs`, `compaction.test.mjs` exist — Stage A may be **partially built already**. Prompt 1's session must diff plan-vs-code before writing anything.
- **Row 2 stands**, now with precise scope: finish the `ChoicesEdgeWaf` cutover (or flip the live ACL), set `EnforceOriginHeader=true` + secret + CloudFront custom header, add canary, **instrument GameJoined/ShareReveal EMF metrics** before any funnel dashboard, add Sentry/RUM.
- **Row 7 gate quantified**: ~8 games logged as of 2026-07-21 — gate nowhere near met.

## Questions for Austin

1. **WAF**: was `ChoicesEdgeWaf` (Block, unattached) meant to replace the live Count-mode ACL? Complete the swap, or flip the live rule?
2. **Canary/dashboards**: ChoicesUser lacks cloudwatch/synthetics read — if any were created manually with the admin profile, this audit can't see them. Re-run those two checks with admin creds before Prompt 2 builds duplicates.
3. **Head-to-head tally**: the game deliberately has no per-player winner — kill the carried-over "A 3 – 2 B" item, or is this a deliberate product change?
4. **Logging volume**: spot-check one S3 object to confirm one-object-per-game (comment in `history.mjs` says so); 8 games in 11 days also says distribution, not features, is the constraint right now.
