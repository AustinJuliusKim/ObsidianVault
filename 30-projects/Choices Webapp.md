---
title: Choices Webapp
aliases: [choices-webapp, choices]
tags: [project, webapp, aws, serverless, game]
type: project
status: evergreen
created: 2026-07-01
updated: 2026-07-09
related: [[Projects MOC]], [[Choices Growth Plan]], [[Choices Suggestion Engine Plan]]
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

**Suggestion engine (Phases 0/1/3) + growth features built 2026-07-07** — five branches pushed, PRs pending (merge order: suggest-phase0 → suggest-typeahead → fill-my-4; og-previews and reveal-copy independent). Per [[Choices Suggestion Engine Plan]]:
- `feature/suggest-phase0`: `HIST#{pairingId}` pair-memory item (capped 200 LRU, TTL tied to pairing lifecycle) folded into the completion transaction via new pure `backend/history.mjs`; anonymized per-game JSON to new private `SuggestDataBucket` (`entries/dt=…/`, HMAC pairHash, no pairing ids — `AnonSalt` SAM param gates it). `userPut` renamed `versionedPut`.
- `feature/suggest-typeahead`: `ChoiceInput.jsx` typeahead on create + rematch inputs — L1 pair memory (new `getPairHistory` action, fetched once, never on the poll path; ranking in pure `frontend/src/suggest.js`) + L3 Google Places Autocomplete (New) proxied server-side (`backend/places.mjs`, session-tokened, Essentials-tier details terminates billing session). Dormant without `PlacesApiKey` (stack output → `VITE_PLACES_ENABLED`).
- `feature/fill-my-4`: ✨ Fill my 4 via Bedrock Converse (`backend/suggestai.mjs`, Claude Haiku 4.5 profile via `BedrockModelId` param). 3 free/month — counter on the pairing (rematch) or USER# `aiUses` (create screen, sign-in required — documented deviation); premium unlimited; actionId replay never re-invokes Bedrock.
- `feature/og-previews`: share links now `/j/{CODE}` — new CloudFront behavior → Lambda prerenders OG meta (choices as description, `og-card.png` 1200×630 checked in) + instant redirect into the join flow; `obscenity`-based `backend/moderation.mjs` downgrades profane labels to a generic description at render time only (submission never blocked); server-side 60-char cap + control-char strip in `createGame`.
- `feature/reveal-copy`: `frontend/src/revealCard.js` canvas share card + 📸 button on the winner face (native share via new `@capacitor/filesystem`, web share, download fallback; `share-reveal` support-platform beacon) + Growth §9 copy pass (landing/invite/join/banners/pushes/title/manifest → "Decide what to eat, together").
New actions: `getPairHistory | placesSuggest | placeDetails | fillMyFour` and `GET /j/{code}`. All features config-dormant (AnonSalt / PlacesApiKey / BedrockModelId blank = off); ops steps live in each PR description.

**✨ Fill my 4 live on prod + preview 2026-07-09** (PR #24, branch `ops/enable-fill-my-4`): AWS Bedrock Claude Haiku 4.5 model access approved, so the config-dormant feature was switched on by setting `BedrockModelId=us.anthropic.claude-haiku-4-5-20251001-v1:0` (US cross-region inference profile, us-west-2) in both `samconfig.toml` deploy blocks. **No source changed** — the feature shipped complete in PR #11 (`feature/fill-my-4`). That one param cascades: Lambda `BEDROCK_MODEL_ID` env → `aiEnabled()` true → `fillMyFour` action; `AiEnabled` stack output (`= HasBedrock`) → `deploy-frontend.sh` → `VITE_AI_ENABLED=true`, which un-hides the button. IAM for `bedrock:InvokeModel` was already in the template. Verified live end-to-end (`createPairing → claimSeat → fillMyFour` → 200 with 4 Haiku choices, `usesLeft:2`) on both stacks. Rollback = blank `BedrockModelId` + redeploy backend/frontend (feature goes dormant instantly, fully reversible).

**Owner-only activity dashboard + EMF observability built 2026-07-09** (PR #26, branch `feature/admin-activity-dashboard`) — partially lands [[Choices Growth Plan]] §10. `backend/metrics.mjs` emits CloudWatch EMF (namespace `ChoicesApp`, hand-rolled, no dep): `GameCreated`/`GameCompleted`/`SeatClaimed`/`FillMyFour` counters, per-action `Latency` (p50/p95/p99), `ApiError`. New owner-only `getAdminOverview` action (gated by `assertAdmin` / `ADMIN_SUBS` Cognito-sub allowlist) does a projected `Scan` of `PAIR#` items → pure `aggregateActive` reducer (`backend/admin.mjs`) returning **anonymous aggregates only** — games in progress, whose-turn split, distinct active users, top choices behind a k-anon floor; **never a record** (constitution rules 6 & 9). Frontend `AdminView.jsx` at `#/admin` (owner-gated, above the identity gate), polls every 30s. The CloudWatch dashboard lives in a **separate admin-deploy stack** `ops/ops-dashboard.yaml` — the CI deploy role lacks `cloudwatch:PutDashboard` (same reason as `ops/billing-alarms.yaml`; putting it in the app template rolled the whole update back). Deployed to preview + prod. **Prod enabled 2026-07-09** — owner sub set on the prod stack via a CLI `--parameter-overrides AdminSubs=…` (deliberately NOT committed; persists across future deploys via CloudFormation UsePreviousValue, same as the Stripe/VAPID secrets), so `#/admin` is live for the owner on choices.austinjuliuskim.com. **Preview still dormant** (blank `AdminSubs` → 403). To enable preview: same CLI override with the preview-pool sub (`us-west-2_w74MuQYwu`; prod pool is `us-west-2_JiSiE8xK7`). The CloudWatch dashboard stack (`ops/ops-dashboard.yaml`) still needs a one-time admin-creds deploy (CI role lacks `cloudwatch:PutDashboard`). Still deferred from §10: the Synthetics canary, business/funnel dashboard, frontend Sentry/RUM.

**Persistent account nav built 2026-07-05** (branch `feature/account-corner-nav`, PR open): floating top-right corner pill on all views → `#/account` — subdued "Sign in" chip for guests, 📜 glyph + cached 🔥streak for signed-in (premium, streak ≥ 1). Streak comes from a per-sub localStorage cache written through `getMe` (`frontend/src/streakCache.js`) — zero new API calls, consistent with Tier-1 cost hardening. Backed by market research (Wordle/NYT, Duolingo, Monkeytype, lichess): persistent identity affordance + existing post-game conversion line = "pattern C". Hidden in the iOS shell via `authEnabled`.

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
