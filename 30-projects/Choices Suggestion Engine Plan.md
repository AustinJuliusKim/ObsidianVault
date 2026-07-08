---
title: Choices Suggestion Engine Plan
aliases: [suggestion-engine, choices-ai-plan]
tags: [choices, architecture, ai, search, planning]
type: project
status: draft
created: 2026-07-06
updated: 2026-07-07
related: ["[[Choices Growth Plan]]", "[[Studio Design Constitution]]", "[[Choices Webapp]]"]
---
# Choices Suggestion Engine Plan

**Version:** v0.3 (2026-07-07) — Phases 0, 1, 3 implemented (branches `feature/suggest-phase0` → `feature/suggest-typeahead` → `feature/fill-my-4`, PRs pending merge + ops: AnonSalt param, Places key, Bedrock model access — see PR descriptions). Create-screen Fill-my-4 counts on USER# with sign-in required (no pairing exists there — documented deviation from "counter on the pairing"). Code status lives in [[Choices Webapp]]. locationBias promoted from deferred and built same day (PR #16, stacked on the Fill-my-4 PR): CloudFront viewer-geo headers via a custom /api* origin request policy — city-level, zero prompts, verified on preview.
*v0.2 (2026-07-06) — gating, data policy, and typo-tolerance decisions locked*

## Decisions (locked 2026-07-06)
- **Fill-my-4 gating: N free/month, unlimited on premium.** Default N=3 (enough to form the habit, scarce enough to sell the sub — tune against conversion data). Free uses reset monthly; counter on the pairing, not the device.
- **Phase 0 approved — logging starts now.** Anonymized global aggregation under the k-anonymity floor; per-pair history stays per-pair, deleted with the pairing. First item in the Sonnet queue.
- **Typo tolerance in Phase 2**: edit-distance-1 matching on the client trie ships with the trie itself.

## The problem, precisely
Two distinct problems that must not share a solution:
1. **Typeahead** ("the place the user was thinking of") — a *latency* problem: <100ms/keystroke. LLMs are 10–100× too slow/expensive here. Classic search: prefix match + geo bias + popularity rank.
2. **Blank canvas** (Player A must invent 4 choices) — a *generation* problem: high value, low frequency. Perfect LLM economics. This is where AI genuinely helps users.

## Technology verdicts
| Tech | Verdict | Why |
|---|---|---|
| **Cached answers** | ✅ Backbone | Pair history + global aggregates are the highest-signal, lowest-cost suggestion sources |
| **Google Places Autocomplete** | ✅ Layer 3 | Session-based billing: autocomplete keystrokes free within a terminated session (~$17/1k Pro-terminated sessions past free credit; Essentials cheaper). Solves "real restaurant" out of the box |
| **LangChain** | ❌ | Orchestration framework for many-step chains; we have 1–2 LLM call sites. Direct API calls from Lambda: lighter, debuggable |
| **OpenSearch (Serverless)** | ⏳ Scale-gated | Right for typo-tolerant fuzzy search over millions of entries; OCU cost floor (order $200+/mo) is disproportionate now. Trigger: custom-entry corpus >~500k terms OR fuzzy-match failure rate hurts acceptance metrics |
| **RAG** | ⚠️ One place only | Never per-keystroke. RAG-lite powers "Fill my 4": retrieve pair history + taste vector + nearby Places → one composed prompt. No framework needed |
| **Vector DB** | ⏳ Later, small | Pair taste vectors + canonical food embeddings start as DynamoDB items + in-Lambda similarity (thousands of vectors). Dedicated store only if ANN latency binds |

## Architecture: layered suggestions (fastest first)

```
keystroke → [L1 pair memory, client, 0ms]
          → [L2 global foods trie, client, 0ms]
          → [L3 Places Autocomplete, debounced 200ms, session-tokened]
          → merge/rank: pair > popular-generic > Places, dedupe by canonical id
```

- **L1 — Pair memory.** Every finished game's entries + winners stored per-pairing (survives TTL via a compact `HIST#` item, capped ~200 entries LRU). Client loads once per session; prefix-matches locally. Winners weighted > entries; recency decay. *This is the layer that feels psychic.*
- **L2 — Global foods trie.** Nightly batch (Lambda cron): aggregate **anonymized** entry texts across all games → canonicalize (lowercase, strip emoji, embedding-cluster near-duplicates) → top ~5–10k generic terms with popularity scores → compact trie JSON on CloudFront (~50–150KB gz). Client prefix-matches instantly. Zero per-keystroke cost, improves weekly as data compounds.
- **L3 — Places Autocomplete (New).** Fires only when L1/L2 confidence is low or user keeps typing; debounced ~200ms; location-biased; session token per input focus; terminate with Essentials-tier Place Details on selection (keeps autocomplete keystrokes free-in-session). Selection stores `place_id` → links directly into the [[Choices Growth Plan]] §6 winner-screen deep links (specific restaurant page = higher affiliate conversion).

### Ranking (v1 heuristic, v2 learned)
v1: score = 3·pair_winner_freq + 2·pair_entry_freq·recency + 1·global_popularity + geo_boost. v2 (post-data): learn-to-rank on acceptance logs.

## The AI features (where LLMs actually help users)

1. **"Fill my 4"** ⭐ (Phase 3, flagship): one button on the create screen → single LLM call composed from: pair history summary + taste vector + top nearby open restaurants (Places Nearby) + occasion hint ("date night"). Returns 4 choices, user can swap any. Attacks the funnel's top leak (creation friction). Cost: 1 call/game-creation — cents. **Gating decided: N free/month (default 3), unlimited on premium.**
2. **Batch canonicalization** (Phase 2): embeddings cluster "Chipotle"/"chipotle burrito"/"that burrito place" → canonical ids. Runs nightly, feeds trie quality + dedup in merge step.
3. **Pair taste vector** (Phase 4): nightly embedding average over pair history → reranks all three layers + seeds "Fill my 4". Stored as one DDB item per pairing; similarity in-Lambda.
4. **Explicitly NOT**: per-keystroke LLM calls; chat interfaces; anything adding latency to the core 2-minute loop (constitution rule 3).

## Privacy (constitution rules 6 & 9 — load-bearing)
- Global aggregates: text-only, stripped of pairing ids, k-anonymity floor (term must appear across ≥N distinct pairings to enter the trie).
- Pair memory stays per-pairing; deleted with the pairing; never crosses pairs.
- Taste vectors: derived data, deleted on pairing deletion.
- No entry ever becomes ad-targeting input. "No tracking" stays a feature.

## Phases
| Phase | What | Effort | Gate |
|---|---|---|---|
| **0 — Log now** ✅ built 2026-07-07 | Persist finished-game entries/winners past TTL: per-pair `HIST#` item + anonymized append to S3 (daily partition). Data compounds — every week unlogged is training data lost | ~1d Sonnet | Ship ASAP |
| **1 — Typeahead MVP** ✅ built 2026-07-07 | L1 pair memory + L3 Places sessions, merge/rank v1 | 2–4d Sonnet | After Phase 0 |
| **2 — Global trie** | Nightly aggregate + canonicalization + CloudFront trie; L2 in client | 2–3d Sonnet | ~1k games logged |
| **3 — Fill my 4** ✅ built 2026-07-07 | RAG-lite Lambda + create-screen UI; premium gating decision | 2–3d Sonnet | Phase 1 live |
| **4 — Taste vectors** | Nightly pair embeddings + rerank | 2d Sonnet | Phase 2 + 3 data |
| **5 — Fuzzy at scale** | OpenSearch (or typo-tolerant client matcher first — try edit-distance-1 on trie before buying infra) | — | Scale trigger above |

## Metrics
Suggestion acceptance rate (per layer), keystrokes-to-selection, list-creation time, % games created via Fill-my-4, L3 session cost/game. All via existing EMF pipeline ([[Choices Growth Plan]] §10).

## Model routing
- Fable/Opus: this plan; ranking-model design at v2
- Sonnet: Phases 0–4 implementation
- Haiku: Places field-mask/SKU verification at build time; trie size benchmarking; OpenSearch pricing recheck at Phase-5 trigger

## Open questions (v0.3)
- None blocking. Tune N (free Fill-my-4 uses) against premium conversion once live.

## Links
- [[Choices Growth Plan]] (§6 winner links, §8 funnel, §10 observability) · [[Studio Design Constitution]]
