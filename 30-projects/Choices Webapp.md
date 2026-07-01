---
title: Choices Webapp
aliases: [choices-webapp, choices]
tags: [project, webapp, aws, serverless, game]
type: project
status: evergreen
created: 2026-07-01
updated: 2026-07-01
related: [[Projects MOC]]
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
Complete & deployed at `choices.austinjuliuskim.com` (custom domain + ACM cert). Last substantive commit Jun 7, 2026.

## Links
- Part of: [[Projects MOC]]
- Repo: `personal/projects/apps/choices-webapp`
