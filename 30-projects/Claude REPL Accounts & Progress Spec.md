---
title: Claude REPL Accounts & Progress Spec
aliases: [claude-repl-accounts]
tags: [project, claude-repl, accounts, payments, capture]
type: project
status: locked
created: 2026-07-11
updated: 2026-07-12
related: [[Claude REPL]], [[Claude REPL Business Plan]], [[Claude REPL Lesson Engine Spec]], [[Claude REPL Lesson Plan]]
---
# Claude REPL — Accounts & Progress Spec (v1.1 · LOCKED)

**Purpose:** individual accounts with lesson-completion tracking; account management for payments (wallet) and API keys (BYOK); staged lead capture through the free spine converting to accounts at graduation; name-seeding in the Lesson 1 demo.

## Locked decisions
- **Auth provider: Supabase** — magic links native; **Postgres for the wallet ledger (ACID money math is the tiebreaker)**, progress, and leads; RLS; free tier within pre-PMF burn. AWS keeps CloudFront static + backend container. (Cognito rejected for custom-auth-flow overhead + DynamoDB ledger footguns; Clerk rejected — paid, no DB.)
- **Portability disciplines (locked with it):** treat Supabase as *plain managed Postgres*. (1) All reads/writes through Fastify via a standard Postgres client — the browser never queries Supabase directly; migration = connection-string swap. (2) Schema as SQL migrations in-repo, never dashboard-edited. (3) Auth behind an adapter interface (`issueMagicLink/verifyToken/getSession`); our own `users.id` is the PK everywhere, Supabase auth UID is just a column. (4) RLS is defense-in-depth only — authz is enforced in Fastify too. (5) No Supabase Edge Functions or Storage for core paths (logic in Fastify; fixtures on CDN).
- **BYOK storage: session-only v1.** Key in browser session + backend memory per the locked security model; never persisted. Zero custody risk; "we never store your key" trust line; re-paste friction is the wallet's honest sales pitch. KMS-encrypted opt-in = explicit later fork.
- **Capture staging: name @ L1 intro, email @ first save/share, account @ graduation.**

## Capture funnel (staged, friction-ordered)
1. **Name @ L1 intro** — optional single field: "What should your page call you?" Personalization framing; fuels the demo. Skip → default persona.
2. **Email @ first save/share moment** — "keep your progress + get your page link." Newsletter opt-in checkbox (**not pre-checked**) → radar-newsletter list ([[Claude REPL Business Plan]] GTM).
3. **Account @ graduation (post-L8)** — the conversion moment. Email already held → **one-click magic link**; anon progress merges; learner picks a lane (BYOK or wallet). Free shareable **completion badge** at graduation; certificates remain paid-tier.
- Anonymous learners always work: `anonId` (UUID, localStorage) keys progress + leads; merged on account creation.

## Name-seeding mechanics (Lesson 1 demo)
- Fixtures carry `{{userName}}` tokens in file-write events, diffs, preview HTML, and PromptComposer suggestion text ("build a personal page for {{userName}}").
- Player substitutes at render time — same deterministic fixture for everyone; cosmetic-safe under the engine spec's slot rule (display changes, branch doesn't).
- **Security (hard):** user input rendered into a live preview → HTML-escape everywhere, length-cap (~30 chars), charset allowlist, safe default on skip. No exceptions.
- Implemented via the `Capture` step type + interpolation rule — **amended into [[Claude REPL Lesson Engine Spec]] v1.1**.

## Auth
- **Passwordless (magic link / OTP)** — no password-reset burden; email captured pre-account.
- Optional social (Google/GitHub) later. Sessions: httpOnly cookies; WS session ties auth → `{mode}` in [[Claude REPL Protocol]].

## Data model (Supabase Postgres)
```
users(id, email, name, marketing_consent, stripe_customer_id, created_at)
leads(anon_id, name?, email?, consent, source, ts)            # pre-account capture
progress(owner_id: anon|user, lesson_id, status, assertions jsonb, updated_at)
wallet_ledger(id, user_id, type: topup|usage|unlock|refund, amount_cents, ref, ts)  # append-only; balance = SUM, never mutable
events(owner_id, kind, payload jsonb, ts)                     # proof-gate instrumentation
```
- **Progress events ARE the proof-gate metrics** (guided completion %, guided→live conversion, first-pack conversion): lesson_started/completed, branch_chosen, capture_submitted, account_created, pack_purchased.
- Anon merge: account creation claims `anon_id` → reassigns progress/leads/events. RLS on all owner-scoped tables.

## Account management surface
- **Profile:** name, email, marketing prefs.
- **API keys (BYOK):** session-only; paste-per-session UX with clear "never stored" copy.
- **Wallet & payments:** Stripe Checkout for packs ($5/$20/$50, prepaid-only); Stripe customer portal for receipts; balance + ledger view; track-unlock history; hard-stop at zero (proxy enforces).
- **Progress:** spine map (8 dots + advanced tracks), completion badge, resume-where-you-left.
- **Danger zone:** export my data; delete account (purge lead/progress/ledger PII; retain anonymized events).

## AWS comparables & migration path (researched 2026-07-11)
**Comparable datastores:**
- **Aurora Serverless v2 (PostgreSQL)** — primary migration target. True Postgres (ledger ACID, jsonb); scales to 0 ACUs when idle (storage-only pennies pre-scale, ~15s cold resume); grows with traffic, no re-platform.
- **RDS Postgres t4g.micro** — boring/reliable alternative: ~$12–15/mo always-on, 12-mo free tier on new accounts, no cold starts.
- **Aurora DSQL** — pay-per-request w/ permanent free tier, but Postgres-*compatible* (launch gaps: FKs, triggers, some types) + optimistic concurrency → **not for the money ledger** without verifying current constraint support.
**Auth replacement on AWS:** self-rolled magic links in Fastify (Auth.js/Lucia-style) + SES (~free at our volume); Cognito only if managed auth becomes a requirement.

**Migration triggers (any):** sustained Supabase bill > ~$150–200/mo where Aurora Sv2 would be cheaper · connection/compute ceilings hit · need for VPC-peering with the backend/proxy, read replicas, or compliance residency · post-PMF consolidation preference.

**Runbook (designed-in, ~weekend scale):**
1. Stand up Aurora Sv2; apply the same in-repo SQL migrations.
2. Data: `pg_dump`/`pg_restore` (small scale) or logical replication (near-zero downtime); append-only ledger replicates cleanly — brief write-freeze at cutover for sequence sync.
3. Swap `DATABASE_URL` in Fastify (discipline #1 makes this the whole data cutover).
4. Swap auth adapter Supabase → Fastify magic links + SES; sessions invalidate; users re-login via magic link (no password hashes exist to migrate — passwordless dividend).
5. Decommission Supabase after a parallel-read verification window.

## Privacy & compliance (lean but real)
- Marketing email only with explicit consent; transactional (magic links, receipts) always OK; one-click unsubscribe.
- Privacy policy + data deletion before launch. Name interpolation stays in the client render layer except within the user's own saved page.

## Changelog
- **Implemented** (2026-07-12) — Built on branch `feature/repl-accounts-progress` (PR #27, merged 2026-07-13). All v1 scope except BYOK panel + Stripe/wallet endpoints (Phase B; ledger schema ships). Documented deviations: backend runs as Lambda (`@fastify/aws-lambda`) behind a CloudFront `/api/*` behavior rather than a container (Dockerfile kept; portability disciplines intact); additive schema: `sessions` table (httpOnly-cookie sessions) and `progress.owner_type` anon|user discriminator; name-only capture stays client-side — the name rides along when the email lead posts.
- **v1.1** (2026-07-11) — Portability disciplines locked (Supabase as plain Postgres; backend-mediated access; auth adapter; own PKs; RLS as defense-in-depth); AWS comparables (Aurora Sv2 scale-to-zero primary target, RDS micro, DSQL rejected for ledger); migration triggers + weekend-scale runbook.
- **v1.0** (2026-07-11) — LOCKED. Supabase auth+Postgres (ledger-ACID tiebreaker); session-only BYOK; staged capture confirmed; engine-spec amendment executed.
- **v0.1** (2026-07-11) — Initial spec: staged funnel, `{{userName}}` interpolation w/ XSS rules, passwordless auth, append-only ledger, proof-gate events.
