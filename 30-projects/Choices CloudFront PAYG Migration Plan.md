---
title: Choices CloudFront PAYG Migration Plan
aliases: [choices-payg-migration, cloudfront-payg-plan]
tags: [choices, aws, cloudfront, waf, infrastructure, planning]
type: project
status: developing
created: 2026-07-08
updated: 2026-07-14
related: ["[[Choices Growth Plan]]", "[[Choices Webapp]]", "[[Choices Suggestion Engine Plan]]"]
---
# Choices CloudFront PAYG Migration Plan

**Status: IN PROGRESS (2026-07-14) — phases 1+4 BUILT (PR #40, draft, stacked on #39), phase 2 executed.** `ops/edge-waf.yaml` **deployed 2026-07-14** (stack `ChoicesEdgeWaf`, us-east-1, admin creds; WebACL ARN `arn:aws:wafv2:us-east-1:549883968767:global/webacl/ChoicesEdgeWaf/8e0139f9-53c3-4f6d-bd47-de02bdc1b3d6` — the value for prod's `WebAclArn` at plan-drop). Phase 4 built on `feature/payg-unlocks` + Fill-my-4 city hint (whitelist gained `cloudfront-viewer-city`/`-country`): 154/154 tests, **preview smoke-verified 2026-07-14 in full** — ambient header bias (LA results, no body coords), body coords beat headers (NYC), `nearMe:false` → global, getState double-GET `Hit from cloudfront` with `public, max-age=1`, unsigned Stripe webhook → 400, fillMyFour end-to-end 200. **DO NOT MERGE #40 until the plan drops.** IAM (phase 5) already had the CachePolicy/OriginRequestPolicy actions in `docs/iam-policy.json` — no change needed. Owner switched the prod distribution to pay-as-you-go in the console; the downgrade **pends until the end of the current billing cycle**, so plan-gated resources still can't deploy to prod until it drops. Next in order: phase 1 (`ops/edge-waf.yaml` to us-east-1 — build/deploy now so the WebACL is ready), build + preview-verify phase 4 (`feature/payg-unlocks`), then on plan-drop: swap `WebAclArn` immediately (phase 3) and merge phase 4. New consumer of the unlocked headers: the Fill-my-4 city prompt hint ([[Choices Suggestion Engine Plan]] Increment A.2) — add `cloudfront-viewer-city`/`-country` to the phase-4 header whitelist alongside latitude/longitude.

*(Superseded framing below, kept for history:)* **Status: DEFERRED (2026-07-08) — growth isn't there yet.** This is the ready-to-execute playbook for migrating prod's CloudFront distribution off the flat-rate **Free** pricing plan to **pay-as-you-go**, unlocking everything the plan blocks. Revisit when a growth trigger fires (suggested: sustained MAU growth, WAF Count-mode metrics showing real abuse, or getState load where edge caching would matter).

## Why (what the Free plan blocks)
- **Custom origin request policy** → CloudFront IP-geolocation headers. Rejected outright on prod 2026-07-08 ("Distributions with the Free pricing plan can't have: Custom origin request policy") — that failure produced the browser-geolocation fallback (📍 pin as consent surface) now in place.
- **Custom cache policies** → no edge-cached `getState` (the designed-for retry-storm absorber; the cache-safety invariant — `publicState` never carries `code`/tokens — was built for it and is test-enforced).
- **WAF protection pack** lives outside git, capped at 5 rules, stuck in Count mode, and can't be modified or replaced while the plan is active.

## Cost picture after migration
- Traffic ≈ **$0** at current scale (PAYG always-free tier: 1 TB transfer + 10M requests + 2M CF-function invocations/month).
- New fixed cost: self-managed WAF ≈ $5/WebACL + $1/rule×4 + $0.60/M req ≈ **$9–10/mo**.
- Trade-off: the plan's **no-overage guarantee disappears** — WAF Block rules + the `BillingAlarms` stack become the cost circuit-breakers.

## Key mechanics (verified against AWS docs 2026-07-08)
- A plan downgrade takes effect **at the end of the current billing cycle** — plan-gated resources can't deploy to prod until then. Everything can be built and verified on the preview stack (no plan attached) immediately.
- The protection-pack WebACL (`CreatedByCloudFront-8bb2952d`) must stay attached until the plan drops; swap `WebAclArn` right after.

## Decisions locked at planning time (2026-07-08)
- **WAF: full replication in git** — exact contents of today's pack: priorities 0–2 = AWS managed groups (AmazonIpReputationList, CommonRuleSet, KnownBadInputsRuleSet) Count→Block after ~1 week soak; priority 3 = `ChoicesRateLimitPerIp` **600 req / 300 s / IP**, Block from day one (Count-soaking since 2026-07-04). Default Allow; rule actions parameterized so the soak flip is a parameter change.
- **Edge caching: include** — custom cache policy on `/api*`: TTL 0/1/5 s, key = query strings `action, pairingId, role, token`, no headers/cookies; `GETSTATE_HEADERS` → `cache-control: public, max-age=1`. Mutations are POSTs (never cached).
- **Geo: hybrid** — bias resolution `body coords (📍 pin, precise) > CloudFront viewer-geo headers (IP, zero-prompt) > world rect (neutral)`; `nearMe: false` returns as the explicit pin-off override.

## Execution phases
1. **Edge WAF stack in git** — new `apps/choices-webapp/ops/edge-waf.yaml` (pattern: `ops/billing-alarms.yaml`), deployed to **us-east-1** (CLOUDFRONT scope requirement), Output = WebACL ARN. Deployable any time; attach later.
2. **Console downgrade** (manual) — CloudFront console → distribution → switch plan to pay-as-you-go; change pends until cycle end. Don't cancel the pending change.
3. **When the plan drops**: `sam deploy` prod with `WebAclArn=<edge-waf output>` (existing param, no code change); verify the pack ACL detached, delete if orphaned. Do this immediately — it closes the brief unprotected window.
4. **`feature/payg-unlocks` PR** (build + preview-verify early; **merge only after the plan drops** or CI fails like the 2026-07-08 #11 deploy):
   - Re-add `ApiOriginRequestPolicy` (whitelist: content-type, authorization, **stripe-signature** — load-bearing for the webhook — cloudfront-viewer-latitude/longitude); `/api*` points at it.
   - `handler.mjs`: restore `viewerGeo(event)` alongside `clientGeo(body)`; precedence body > headers > world rect; `nearMe===false` → world rect.
   - Frontend pin: lit whenever enabled (precise or ambient), dimmed = off → sends `nearMe:false`; tap cycles enable→locate→off.
   - Custom `ApiCachePolicy` + getState cache-control change.
   - Tests: precedence, pin-off override, junk degradation, cache headers.
5. **IAM + bookkeeping** — both deploy principals need `cloudfront:*CachePolicy*` actions (OriginRequestPolicy actions already applied 2026-07-08); sync `docs/iam-policy.json`; check `BillingAlarms` thresholds against the new ~$10/mo baseline; update [[Choices Growth Plan]] §10b (decision superseded) at execution time.

## Verification checklist
- WAF ACL matches the 4-rule spec before attach; WAF CloudWatch metrics evaluating after.
- Preview: placesSuggest via CloudFront with no body geo → requester-local results (headers live); `nearMe:false` → global; body coords beat headers. getState double-GET → `x-cache: Hit from cloudfront`; state fresh within poll cadence. Stripe webhook unsigned → 400 BAD_SIGNATURE.
- Full backend suite green; billing alarm intact after a week.

## Links
- Part of: [[Choices Webapp]] · Strategy: [[Choices Growth Plan]] (§10b — the Free-plan decision this supersedes when executed)
- Suggestions/geo context: [[Choices Suggestion Engine Plan]]
