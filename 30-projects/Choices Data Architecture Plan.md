---
title: Choices Data Architecture Plan
aliases: [choices-data-plan, data-pipeline-plan]
tags: [choices, architecture, data, analytics, planning]
type: project
status: draft
created: 2026-07-11
updated: 2026-07-12
related: [[Choices Growth Plan]], [[Choices Suggestion Engine Plan]], [[Studio Design Constitution]]
---
# Choices Data Architecture Plan

**Version:** v0.3 (2026-07-11) — **Stage A greenlit; event catalog FROZEN with all bundles (A–D) approved.** Additive-only from here.

**Stage A LIVE (2026-07-12)** — merged (PR #28) and deployed to preview + prod the same day; smoke-verified on both (game → raw+anon lake objects, Athena group-by + payload-map queries, DLQ 0); alarms stack `ChoicesEventLakeAlarms` deployed (SNS confirmation pending); CI deploy-role IAM updated (19 statements incl. preview-table drift fix). Built as: transactional-outbox `EVENT#` items in the game transactions + a validated `track` action for client-side catalog events (enums/bounded ints only — typed text structurally impossible), Streams consumer → `EventLakeBucket` raw/anon JSONL zones, anon refs via daily-**derived** salt (`HMAC(ANON_SALT, "day:"+day)` — stateless, no rotation job; fail-closed when unset), `pairing_deleted` tombstones from `PAIR#` REMOVEs (additive type #26), weekly compaction (raw-zone-only, crash-safe manifest), Glue partition-projected tables + Athena workgroup (no crawler), `docs/event-lake.md` as the envelope/one-way-door contract. Pipeline alarms (IteratorAge >5 min, DLQ depth, errors) in admin-deployed `ops/event-lake-alarms.yaml` (prod-only as written). 148/148 backend tests. Ops before live: CI IAM additions, `AnonSalt` check, preview smoke + Athena query, alarms deploy; old static-salt `entries/` feed intentionally NOT backfilled (incompatible refs).

4. **Event catalog v1 (FROZEN 2026-07-11, all bundles approved)**: core `game_created, seat_claimed, cut_made, game_finished, rematch, push_sent, link_clicked, suggestion_accepted, fill4_used` **+ A Funnel/viral**: `invite_link_opened, join_abandoned, reveal_viewed, reveal_card_shared, pwa_installed, push_permission_result` **+ B Suggestion/AI**: `suggestion_shown` (layer+count, never typed text), `fill4_shown, fill4_swapped` **+ C Monetization**: `order_click` (platform, place_id?), `paywall_viewed, sub_started, sub_cancelled, tip_given` **+ D Ops**: `client_error` (type only), `realtime_fallback`.
   **Never logged**: keystrokes/typed text; sub-k-floor content in anon zone; any partner-vs-partner surface (constitution rule 6 applies to analytics). Additive-only evolution; new fields never repurpose old ones.

## Verdict on current architecture

| Layer | Status | Notes |
|---|---|---|
| DynamoDB single-table, per-pairing keys | ✅ Keep at every scale | Uniform partition distribution; on-demand + quota raises; Global Tables-ready (keys are region-agnostic) |
| 30-day TTL | ⚠️ Data evaporates | Fine for operational hygiene; fatal for analytics without an event log (below) |
| Access patterns | ⚠️ One gap coming | Accounts (approved in [[Choices Growth Plan]]) add "all pairings for USER#" — needs GSI1, plan keys now |
| Analytics | ❌ Doesn't exist | No CDC, no analytical store, no ad-hoc query path |

**Core principle: OLTP/OLAP separation.** DDB stays the game-state store. Analytics never touches production tables. Anti-patterns explicitly banned: GSIs for reports, table scans for dashboards, "migrate to Postgres for analytics."

## Target architecture (additive, staged)

```
DynamoDB ──Streams──▶ Lambda ──▶ S3 event lake (append-only)
                                   ├── raw zone (pairing-scoped, deletable)
                                   └── anon zone (k-anonymity, aggregates)
                                        ▼
                     Athena (ad-hoc SQL) · nightly batch jobs (trie, taste
                     vectors, business metrics) · dashboards
```

### Stage A — now (~2–3d Sonnet, near-zero cost)
1. **Enable DynamoDB Streams** + one consumer Lambda → this is the extension point for everything after; cheap from day one.
2. **S3 event lake, append-only**: every domain event as one JSONL record, partitioned `type=/dt=YYYY-MM-DD/`. *Events are forever; aggregates are derived.*
3. **Event envelope (the one-way door — get right first):**
   `{event_id, ts, type, schema_v, pairing_ref, actor_role, payload}`
   - Raw zone: `pairing_ref` = real pairing id (powers pair features; deletable)
   - Anon zone: `pairing_ref` = daily-rotating salted hash (powers global aggregates; k-anonymity floor per [[Choices Suggestion Engine Plan]])
4. **Event catalog**: see bundled list at top of doc (core locked; bundles pending review).
5. **Athena + Glue catalog** over the lake: ad-hoc SQL at ~$5/TB scanned — at current volume, effectively free, and it covers analytical questions for years.
6. **Deletion story**: pairing deleted → tombstone event → weekly compaction job rewrites raw-zone partitions minus tombstoned refs. This is the global-eventually/GDPR-readiness piece; retrofitting it is miserable, building it now is a small job.

### Stage B — growth triggers (~10k games/mo or first real dashboard need)
- Firehose (or hourly batch Lambda) converts JSONL → **Parquet** with compaction; Athena costs drop ~10×.
- Business dashboard: scheduled Athena → CloudWatch custom metrics (reuses [[Choices Growth Plan]] §10 pipeline) before buying QuickSight.
- All batch consumers (suggestion trie, taste vectors, funnel reports) read the lake, never DDB.

### Stage C — scale-gated options (build none until a trigger fires)
- **DDB → Redshift zero-ETL** or **S3 Tables (Iceberg)** if Parquet-on-S3 management becomes toil.
- Real-time analytics (ClickHouse/Tinybird-class) only if a *product* feature needs sub-minute aggregates — none currently planned.
- OpenSearch per the suggestion plan's existing trigger.

## DDB schema evolution playbook (for the OLTP side)
- **Version every item now**: add `_v: 1` attribute; migrations use lazy read-upgrade (upgrade on read, background backfill scan once). Document item schemas in the vault as a registry.
- **Accounts (when built)**: `USER#{id}` items + GSI1 overloading (`GSI1PK=USER#{id}, GSI1SK=PAIR#{id}`) — no table migration needed; single-table absorbs it.
- **New entities queued**: premium subscription state, Fill-my-4 monthly counter (on pairing per decision), `HIST#` (no TTL), `place_id` links.
- **TTL policy**: pairing TTL extends on activity (retention feature); history + account items exempt.
- **Never**: repurpose key formats; breaking changes ride new item types instead.

## Cost posture
Stage A ≈ dollars/month (Streams reads + S3 puts + Athena queries at current volume). The expensive mistakes this plan prevents: GSI sprawl (per-GSI write amplification), analytics scans against production, premature warehouse adoption.

## Metrics for the pipeline itself
Stream lag (alarm >5 min), lake write failures (>0), compaction job success, Athena spend/month (budget alarm) — folded into [[Choices Growth Plan]] §10 observability.

## Model routing
- Fable/Opus: this plan; event catalog review before Stage B
- Sonnet: Streams consumer, lake writer, compaction job, Athena/Glue setup
- Haiku: Firehose vs batch-Lambda cost check at Stage B trigger; zero-ETL/S3 Tables pricing recheck at Stage C

## Open questions (v0.4)
- None blocking. Revisit at Stage B trigger (~10k games/mo or first dashboard need).

## Links
- [[Choices Growth Plan]] (§10) · [[Choices Suggestion Engine Plan]] (Phase 0 becomes a lake consumer) · [[Studio Design Constitution]] (rules 6, 9)
