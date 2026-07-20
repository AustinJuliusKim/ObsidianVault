---
title: AWS Billing Phantom Spike 2026-07-17
aliases: [aws-billing-phantom-spike, cost-explorer-bug-2026-07]
tags: [aws, billing, incident, minor-event]
type: note
status: resolved
created: 2026-07-17
updated: 2026-07-17
related: ["[[Choices CloudFront PAYG Migration Plan]]"]
---
# AWS Billing Phantom Spike 2026-07-17

**Minor event — no real cost, no action taken.** Cost Explorer showed **$4,367.86 MTD** on the personal account (549883968767): ~$3,310 "Amazon CloudFront" + ~$1,008 "Amazon S3". Investigated same day; the charges were phantom data from **AWS's Cost Explorer defect of 2026-07-16 → 07-17** (unit-pricing bug in their estimated-billing computation subsystem; some customers saw trillion-dollar estimates). AWS confirmed actual invoices/payment processing unaffected.

## Evidence it was bogus (not abuse or compromise)
- Claimed usage was internally impossible: ~160 TB CloudFront POST-to-origin transfer (`US-DataTransfer-Out-OBytes`) with **no matching request-tier charges**, and ~54 TB S3 `USE1-USW2-AWS-Out-Bytes` attributed to `ListBucketTags` (~1 KB responses; would need ~50B calls — CloudTrail showed essentially none).
- All 4 real CloudFront distributions served ~13K requests / ~65 MB total in July; no hidden distributions, VPC origins, tenants, or Amplify apps.
- CloudWatch `AWS/Billing EstimatedCharges` (separate pipeline) showed **$17.07 MTD** — the normal baseline (domain renewal + Route 53).
- Security sweep clean: all root activity from own IP; `guided-repl-ses-smtp` IAM user (2026-07-12) is own SES SMTP user; distribution deletions 07-13→07-17 (`E18ZRJX5YFWXKB`, `E3K1M67VZAUG6E`) were own cleanup.
- The Cost Anomaly Detection alert ($1,582 impact, 07-17) was fed by the same corrupted data.

## Follow-ups
- Verify the actual **Bills** page (not Cost Explorer) is normal at July close; if inflated, open a free billing support case.
- Hygiene (optional): deactivate the `AustinKim` access key, unused since 2019.
- Side finding: EdgeWAF status unchanged — WebACL deployed, attach still pending the pricing-plan drop (~Aug 1); see [[Choices CloudFront PAYG Migration Plan]].
