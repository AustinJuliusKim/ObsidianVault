---
title: Choices Webapp
aliases: [choices-webapp, choices]
tags: [project, webapp, aws, serverless, game]
type: project
status: evergreen
created: 2026-07-01
updated: 2026-07-05
related: [[Projects MOC]], [[Choices Growth Plan]]
---
# Choices Webapp
Lightweight two-player, turn-based elimination game. Player A creates a game, pre-seeds 4 choices, and shares a human-friendly code (e.g. `PLUM-42`); Player B joins and they alternate eliminating choices (B → A → B) until one winner remains. No accounts — flows through messaging apps.

## Goal
Fully serverless, shareable social game on AWS free tier. Turn alerts via Web Push, with polling fallback so it works everywhere.

## Stack
- **Frontend:** React 18 + Vite SPA; hash routing (`#/create`, `#/join?code=`); PWA (service worker + manifest) for iOS push. Hosted on private S3 + CloudFront (HTTPS).
- **Backend:** Node 22 Lambda via **Function URLs** (no API Gateway); one handler routes 6 actions (createPairing, claimSeat, getState, eliminate, rematch, subscribe).
- **Data:** DynamoDB single table `choices-games` (on-demand, 30-day TTL auto-cleanup).
- **Notifications:** Web Push (VAPID) sent from Lambda; 3s polling fallback.
- **IaC:** AWS SAM (`template.yaml` + `samconfig.toml`).

## Key context
- **Game logic** is pure and I/O-free in `backend/game.mjs` (unit-tested via `game.test.mjs`, Node `--test`).
- **Identity/auth:** no login — role (A/B) scoped to pairing + URL, guarded by a `localStorage` token; all mutations validate `{ pairingId, role, token }`.
- **Data model:** `PAIR#{id}` (identity+state), `CODE#{code}` → pairing, games nested in pairing, `SUB#{pairingId}#{role}` (push subs). Pairing + subs survive rematches.

## Gotchas
- iOS Web Push only works when the app is added to Home Screen (PWA install, iOS 16.4+); game still fully playable via polling without it.
- HTTPS mandatory for Web Push → CloudFront required (raw S3 HTTP won't do).
- Push is fire-and-forget (404/410 = expired sub, logged and skipped).
- Deploy CORS permissive first, then tighten to the CloudFront origin.

## Deploy
- Backend: `sam build && sam deploy --guided` (Lambda + DynamoDB + S3 + CloudFront + CloudFormation).
- Frontend: `npm run build` → `aws s3 sync dist/ …` → `aws cloudfront create-invalidation`.
- VAPID keys generated locally (`npx web-push generate-vapid-keys`), passed as SAM params.
- Tests: `cd backend && npm test`.

## Status
Deployed at `choices.austinjuliuskim.com` (custom domain + ACM cert); v1 complete (last substantive commit Jun 7, 2026). Now executing a growth + monetization push — see [[Choices Growth Plan]].

Affiliate deep links + iOS-native UI + preview-stack deploys merged 2026-07-04 (PR #1). **Tier-1 cost hardening deployed to prod 2026-07-04**: API behind CloudFront at `https://choices.austinjuliuskim.com/api` (same-origin, no CORS preflights), adaptive polling (3s hot / 15s waiting / 30s idle / paused hidden), idempotent mutations (actionId replay + optimistic locking), billing alarms (BillingAlarms stack). WAF rate limiting lives in the CloudFront pricing-plan protection pack (Count mode, out of git — see [[Choices Growth Plan]] §10b for the plan constraints that shaped this). Still pending: origin-header enforcement (~day after cutover) and WAF Count→Block after soak.

**iOS Phase A in progress** (2026-07-04, branch `feature/ios-capacitor`): Capacitor 8 wrap on Apple's free tier (simulator + personal-team device installs; no paid enrollment until launch). Native haptics/share/browser polish; turn updates via the existing adaptive polling (no push entitlement on free tier). Two-phase ladder in [[Choices Growth Plan]] §3.

**Accounts + billing live 2026-07-05**: optional Cognito Google sign-in (hosted UI `choices-auth.auth.us-west-2.amazoncognito.com`, PKCE) and Stripe premium checkout ($2.99/mo, $24/yr) live on prod; preview stack mirrors with test-mode Stripe and `choices-auth-preview`. Webhook at `/api/stripe-webhook` (400 on unsigned posts — verified). Gotcha recorded: `deploy-frontend.sh` bakes `VITE_TIP_*` and Cognito env at build time — a local run without the GitHub repo variables ships a build with the tip jar hidden (CI injects them; export them for local runs).

## Growth Plan
See **[[Choices Growth Plan]]** — the strategy, monetization, and sequencing doc. The earlier free-growth-experiment framing (no monetization, no accounts, no native apps) was superseded 2026-07-01: Choices is now a real side-business attempt — target $5k+/mo, food-focused ("what should we eat" category), accounts acceptable for premium, Capacitor iOS app on the ladder.

### Carried-over engineering items (not covered in the growth plan)
- Lightweight analytics: event counters for created / joined / completed / rematch (DynamoDB counters or Plausible/PostHog free tier).
- GitHub Actions CI running the backend test suite; add integration tests for `handler.mjs` (currently only `game.mjs` is tested).
- Fix doc drift: README and `docs/PLAN.md` still describe the old `/g/{id}` single-game model; code is pairing-based.
- Variable choice count 3–8 (remove the `EXACTLY_FOUR` constraint in `game.mjs`) — prerequisite for group mode and bracket premium mode.
- Pairing history + running tally/streak ("A 3 – 2 B") — requires keeping completed-game summaries past the 30-day TTL.

## Links
- Part of: [[Projects MOC]]
- Growth strategy: [[Choices Growth Plan]]
- Repo: `personal/projects/apps/choices-webapp`
