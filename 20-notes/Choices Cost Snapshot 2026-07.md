---
title: Choices Cost Snapshot 2026-07
aliases: [choices-cost-2026-07]
tags: [choices, aws, cost]
type: reference
status: evergreen
created: 2026-07-23
updated: 2026-07-23
related: ["[[Choices CloudFront PAYG Migration Plan]]", "[[AWS Billing Phantom Spike 2026-07-17]]", "[[Choices Growth Plan]]"]
---
# Choices Cost Snapshot 2026-07

Live Cost Explorer scan 2026-07-23 (account 549883968767, MTD Jul 1–23). June baseline for comparison: **~$1.01 total** (Route 53 only).

## July actuals (MTD)
| Line | MTD | Reading |
|---|---|---|
| Amazon Registrar | $15.00 | Annual domain renewal — amortize $1.25/mo, not a run-rate |
| CloudFront Flat-Rate **Pro** | $7.02 | **Single charge dated exactly 2026-07-17** — the CE-defect/phantom day AND the day preview acquired a plan out-of-band. Suspect. Follow-up already on the phantom note: verify the real Bills page at July close |
| AWS WAF | $3.23 | `ChoicesEdgeWaf` billing while **unattached** ($5/mo ACL + $4/mo rules, prorated) — planned pre-deploy awaiting the ~Aug 1 plan drop |
| Route 53 | $1.02 | Hosted zones + queries, shared with REPL/portfolio |
| Cost Explorer API | $0.11 | $0.01/query (this scan added a few) |
| S3 (all buckets) + Bedrock fill4 | $0.03 | |
| Lambda, DynamoDB, CloudFront traffic, Cognito, SNS/SQS | $0.00 | Free tiers at ~13K req/mo |

## Steady-state estimate post-PAYG migration (~Aug, current volume)
| Line | $/mo | Note |
|---|---|---|
| WAF (EdgeWaf **attached**) | 9–10 | The dominant line (~60%): $5 ACL + $1×4 rules + $0.60/M req ≈ 0. Locked protection decision |
| CloudWatch custom metrics | 2–6 | EMF metric+dimension combos (Latency×action, ApiError×action, funnel counters) exceed the 10 free as data flows; grows with instrumentation, not traffic |
| Route 53 (share) | ~1 | |
| Domain (amortized) | 1.25 | |
| Synthetics canary (daily) | 0.04 | Was ~$10/mo at 5-min cadence — changed 2026-07-23 |
| RUM, Athena, alarms, S3, Bedrock | <0.50 | At current volume |
| CloudFront traffic (PAYG) | 0 | Always-free tier: 1 TB + 10M req/mo |
| **Total** | **≈ $14–18/mo** | vs ~$1/mo pre-hardening; the delta IS the observability + WAF posture |

## Savings levers (aligned with locked plans)
1. **Verify the $7.02 Pro charge on the Bills page** (July close). If real and recurring: the console pricing-plans page attributes it — downgrade whichever distribution carries it.
2. **On plan-drop (~Aug 1), execute PAYG phase 3 same-day**: swap `WebAclArn`, delete the orphaned pack ACL — ends the WAF double-pay window.
3. **Remove preview's out-of-band plan** (pending console action, already tracked in the PAYG plan).
4. **Optional −$2–3/mo**: drop the per-action dimension on `ApiError` (keep the namespace aggregate; attribute via Logs Insights when needed). Per-action `Latency` p99 stays — §10 designed for it.
5. **Re-base the BillingAlarms budget** ($10/mo today) to ~$18 at migration or it pages monthly (PAYG plan phase 5 prescribes this).
6. Hygiene freebie: deactivate the 2019 `AustinKim` access key (phantom-note follow-up, security not cost).

Canary cadence, RUM sampling, and Bedrock premium-gating are already at their cheap settings.
