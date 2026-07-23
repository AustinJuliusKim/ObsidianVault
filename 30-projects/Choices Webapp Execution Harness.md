---
title: Choices Webapp Execution Harness
aliases: [choices-execution-harness]
tags: [choices, claude-code, workflow]
type: project
status: active
created: 2026-07-21
updated: 2026-07-23
related: ["[[Choices Growth Plan]]", "[[Choices Suggestion Engine Plan]]", "[[Choices Data Architecture Plan]]", "[[Choices iOS GTM Plan]]", "[[Choices Marketing Proposal]]", "[[Choices Dev Blog Synthesis Plan]]", "[[Choices Webapp]]", "[[Studio Design Constitution]]"]
---
# Choices Webapp Execution Harness

Dependency-ordered schedule of self-contained Claude Code prompts for the remaining Choices work, distilled from the plan docs in `related:`. Run each prompt in a fresh session from `~/personal/projects`; every prompt names its own context — no chat memory assumed.

## How to run
- Model per prompt via /model; Haiku rows can run as Task-tool subagents from a Sonnet session.
- [plan-first] = approve plan before edits. [think-hard] = extended thinking.
- Always loaded: repo CLAUDE.md + [[Studio Design Constitution]] (every feature passes the rubric + kill tests).
- Commit per prompt; tick the schedule; audit-DONE items are skipped.

## Schedule (dependency order)
| # | Prompt | Model | Est | Gate |
|---|---|---|---|---|
| ✅ 0 | Repo/plan audit — done 2026-07-21 → [[Choices Harness Audit 2026-07-21]] | Sonnet | 0.5d | none — run first |
| ✅ 1 | Data lake Stage A — **verified done 2026-07-22**: live since 2026-07-12 (PR #28, plan-doc banner the harness generation missed); full plan-vs-code diff found every spec element wired (envelope/streams/consumer/zones/salt/tombstones/compaction/Glue/Athena); 164/164 backend tests; prod stack outputs expose EventLake/Glue/Athena. Live-data spot check blocked by ChoicesUser perms → H-5 | Sonnet | 2–3d | Prompt 0 |
| ◐ 2 | Scale-hardening close-out — **code-complete 2026-07-22, PR projects#54 (draft)**: GameJoined/ShareReveal funnel metrics + dashboard widgets, Synthetics canary stack (`ops/canary.yaml`, analytics-excluded via CanarySecret), CloudWatch RUM stack + dormant client (`ops/rum.yaml`). Remaining: admin deploys + verifications (PR #54 Ops tasks → H-6) and the WAF/origin flips **deferred past 2026-07-31** (H-1) + H-2 | Sonnet | 1–2d | WAF/origin steps: after 2026-07-31 + H-2; other steps: ready |
| 3 | Engineering hygiene — **audit-DONE 2026-07-21** (backend-tests CI job gates deploys; handler.test.mjs + 8 more suites; docs disclaim old /g/{id} model) | Sonnet | 1d | none |
| ✅ 4 | Variable choice count 3–8 — done 2026-07-22, PR projects#53 (draft): EXACTLY_FOUR→BAD_COUNT 3–8; turnAfter generalized (revised in PR review: non-starter always cuts first at every count; classic order preserved at 4); cut_made/game_finished schema_v 2 bounds widened; create+rematch add/remove rows; 168/168 tests. Preview-stack 3- & 8-choice game acceptance reported on the PR | Sonnet | 0.5–1d | ready — gate satisfied by audit |
| 5 | Group mode V3 — design + simulation, ship/kill report | Opus | 2–3d | Prompt 4 |
| 6 | Group mode UI (only if Prompt 5 says ship) | Sonnet | 2–3d | Prompt 5 ship verdict + H playtest |
| 7 | Suggestion engine Phase 2 — global trie | Sonnet | 2–3d | ~1k games logged — **~8 as of 2026-07-21**, gate far off |
| ✅ 8 | Dev blog Post #1 draft — done 2026-07-22 (pipeline Run 2): `00-inbox/blog-drafts/app-for-my-marriage/` sources + draft-v1 + thread; gap interview unfilled → draft carries [PENDING #n] slots, no invention (→ H-7); publish stays gated (App Store + her enthusiasm) | Sonnet | 0.5d | none — swap-point, run any time |
| 9 | iOS Phase A — **audit-DONE 2026-07-21** (Capacitor shell shipped via main, see STORE_READINESS.md; feature/ios-capacitor stale at 0 unique commits — delete after checking fix/lambda-cors-capacitor; on-device install check → row H) | Sonnet | 1–2d | Prompt 0 (branch state) |
| 10 | Premium/partnership strategy pass | Opus | 1d | traction data (post-launch) |
| ✅ 11 | Feature flags: store + API — **done 2026-07-23, PR projects#55 (draft)**: flags.mjs (FLAG_DEFS + FLAGS#global overrides, 60s cache, never-throw defaults), getFlags/adminListFlags/adminSetFlag (Cognito admin-group gate, 409 optimistic), bundle-E flag_changed wired to Glue projections; 173/173 tests. Acceptance remainder (adminSetFlag round-trip + Athena row) rides PR #55 Ops tasks (Cognito admin group) | Sonnet | 1d | Prompt 0 |
| 12 | Feature flags: `#/admin` + client hooks (§10c) | Sonnet | 1–2d | Prompt 11 |
| H | Human tasks (no prompt) | User | — | see list |

**Ordering rationale.** Cost-first per Growth Plan sequencing v1.3: the event lake (1) comes early because unlogged weeks are lost training data, and its envelope is the project's one remaining one-way door. Hardening close-out (2) and hygiene (3) are independent of each other — swap freely. Variable choice count (4) is the hard prerequisite for group mode (5→6), which is deliberately simulation-before-UI per Constitution rule 10. Phase 2 trie (7) is data-gated, not effort-gated. Blog (8) is fully decoupled — flagged swap-point, runnable whenever. iOS (9) is paced by the Apple human tasks in row H, not by other prompts. **Suggestion Phases 4/5 and Data Stages B/C are intentionally absent** — their triggers (Phase 2+3 data; ~10k games/mo) haven't fired; add rows when they do. **Feature flags (11→12) added 2026-07-23** per §10c: store+API is a hard dependency for the admin panel (needs the API to call), but both are decoupled from every other row and can run any time after Prompt 0.

## Prompt 0 — Repo/plan audit `Sonnet`
```
Load context: [[Choices Growth Plan]] (§Suggested sequencing, §10, §10b), [[Choices Webapp]] (§Status, §Carried-over engineering items), [[Choices Data Architecture Plan]] (§Stage A), [[Choices Suggestion Engine Plan]] (§Phases), apps/choices-webapp/ source.
Task: Read-only audit. (1) Build a status matrix (file:line evidence) for every unticked item in this harness's schedule: WAF Count→Block + origin-header-enforcement soak status, Synthetics canary, business/funnel dashboard, frontend Sentry/RUM, EXACTLY_FOUR constraint in game.mjs, backend CI test coverage (game.mjs vs handler.mjs), README/docs/PLAN.md pairing-model drift, pairing tally/streak vs shipped accounts HIST#, feature/ios-capacitor branch state, games-logged count vs the ~1k Phase-2 trie gate. (2) Output docs/audit-2026-07-21.md with the matrix. (3) Mark schedule rows already satisfied as audit-DONE. (4) List ambiguities as questions for the user — do not resolve them silently.
Constraints: No code changes. No vault edits beyond ticking this harness.
Acceptance: docs/audit-<date>.md exists with one evidenced row per item above; harness schedule updated.
```

## Prompt 1 — Data lake Stage A `Sonnet` `[plan-first] [think-hard]`
```
Load context: [[Choices Data Architecture Plan]] (§Stage A, §DDB schema evolution playbook, §Cost posture), [[Choices Suggestion Engine Plan]] (§Privacy — k-anonymity floor), docs/audit-<date>.md from Prompt 0.
Task: (1) Enable DynamoDB Streams + one consumer Lambda (the extension point). (2) S3 event lake, append-only JSONL partitioned type=/dt=YYYY-MM-DD/, raw + anon zones. (3) Athena + Glue catalog over the lake. (4) Deletion story: pairing-deleted tombstone event + weekly compaction job rewriting raw-zone partitions minus tombstoned refs.
Constraints: FROZEN event envelope (one-way door — do not drift): {event_id, ts, type, schema_v, pairing_ref, actor_role, payload}. Raw zone pairing_ref = real pairing id (deletable); anon zone pairing_ref = daily-rotating salted hash (k-anonymity floor per Suggestion Engine Plan §Privacy). Event catalog is additive-only. Events are forever; aggregates are derived. Near-zero cost posture — no Firehose/Parquet yet (that's Stage B).
Acceptance: A played test game produces JSONL objects in both zones' partitions; an Athena query over the lake returns those rows; a tombstone test shows the deleted pairing's raw-zone records gone after compaction; backend tests pass.
```

## Prompt 2 — Scale-hardening close-out `Sonnet`
```
Load context: [[Choices Growth Plan]] (§10, §10b), [[Choices Webapp]] (§Status, §Gotchas), docs/audit-<date>.md (soak evidence).
Task: (1) If audit confirms soak: flip WAF Count→Block and enable origin-header enforcement. (2) CloudWatch Synthetics canary on the golden path (create→join→cut→reveal) + alarm. (3) Business/funnel dashboard from EMF metrics (created/joined/completed/share-reveal), in the admin-deploy stack ops/ops-dashboard.yaml (CI role lacks cloudwatch:PutDashboard). (4) Frontend Sentry or CloudWatch RUM.
Constraints: WAF pack lives out of git per §10b pricing-plan constraints — change via the documented ops path, not templates. Analytics additive-only. Respect the deploy-frontend.sh build-time env gotcha.
Acceptance: Canary green in console with alarm wired; dashboard renders funnel metrics; a forced frontend error appears in Sentry/RUM; WAF rule shows Block mode (or a written reason it must wait).
```

## Prompt 3 — Engineering hygiene `Sonnet`
```
Load context: [[Choices Webapp]] (§Carried-over engineering items, §Gotchas), apps/choices-webapp/{backend,.github}.
Task: (1) GitHub Actions CI job running the backend test suite on PRs. (2) Integration tests for handler.mjs (currently only game.mjs is tested). (3) Fix doc drift: README + docs/PLAN.md still describe the old /g/{id} single-game model; code is pairing-based.
Constraints: Surgical — no refactors of passing code; match existing test style.
Acceptance: CI run visible and green on a PR with the new tests; grep for /g/{id} in README/docs returns nothing.
```

## Prompt 4 — Variable choice count 3–8 `Sonnet`
```
Load context: [[Choices Webapp]] (§Carried-over engineering items), [[Choices Growth Plan]] (§7 — group-mode prereq), apps/choices-webapp backend game.mjs + create flow UI.
Task: (1) Remove the EXACTLY_FOUR constraint; accept 3–8 choices end-to-end (create UI, validation, reducer, reveal). (2) Tests for boundary counts 3 and 8 plus rejection of 2 and 9.
Constraints: Default stays 4; existing 4-choice games and pair-memory suggestions unaffected. Reveal drama beat must still land at every count (Constitution rule 11).
Acceptance: New boundary tests pass; full suite green; a 3-choice and an 8-choice game complete on the preview stack.
```

## Prompt 5 — Group mode V3 design + simulation `Opus` `[plan-first] [think-hard]`
```
Load context: [[Choices Growth Plan]] (§7 in full: fun rubric, variants considered, V3 edge rules, validation plan), [[Studio Design Constitution]] (§Rubric, §Method rule 10, §Kill Tests), variable-count reducer from Prompt 4.
Task: Simulation only — no UI. (1) Design V3 edge rules (elimination order, tie-breaks, seat rotation). (2) Pure, I/O-free reducer for N=3–6 players. (3) Monte Carlo with agent strategies (greedy/spiteful/random): seat-fairness + agency metrics per §7's four-part fun rubric. (4) docs/group-mode-report.md with an explicit ship/kill recommendation against the rubric, named metric by named metric.
Constraints: All four fun-rubric criteria must pass or the verdict is kill/redesign — no "promising, ship anyway". Reducer stays pure (Constitution rule 12).
Acceptance: Reducer test suite passes; Monte Carlo runs ≥10k games/config; report exists with a ship/kill line and per-metric numbers.
```

## Prompt 6 — Group mode UI `Sonnet`
```
Load context: docs/group-mode-report.md (Prompt 5), [[Choices Growth Plan]] (§7 validation plan), [[Studio Design Constitution]], existing 2-player views in apps/choices-webapp/frontend.
Task: Only runs on a ship verdict + completed H playtest. (1) N-player lobby/join/cut/reveal UI on the V3 reducer. (2) Analytics events for the new surfaces (additive-only). (3) Graceful degradation when a seat goes idle (async-tolerant per rubric #3).
Constraints: Invitee hits no wall (pay/signup/install) before playing — kill test #2. 2-player flow untouched.
Acceptance: Full N-player game completes on preview; new events visible in EMF; 2-player regression suite green.
```

## Prompt 7 — Suggestion engine Phase 2: global trie `Sonnet`
```
Load context: [[Choices Suggestion Engine Plan]] (§Architecture, §Phases — Phase 2 row, §Privacy, §Metrics), event lake from Prompt 1.
Task: (1) Nightly aggregate job reading the anon zone (never DDB) → canonicalization → trie artifact on CloudFront. (2) L2 client layer merged into the existing L1/L3 ranking. (3) EMF metrics: acceptance rate per layer, keystrokes-to-selection.
Constraints: Gate is ~1k games logged — confirm via Athena before building. k-anonymity floor on all global aggregates. Batch consumers read the lake, never DDB (Data Architecture Plan invariant).
Acceptance: Trie artifact served from CloudFront; typeahead shows L2 results for a term absent from pair memory; per-layer metrics flowing.
```

## Prompt 8 — Dev blog Post #1 draft `Sonnet`
```
Load context: [[Choices Dev Blog Synthesis Plan]] (§Pipeline, §Post slate, §Principles), [[Choices Origin Story Source Pack]], [[Choices Marketing Proposal]] (§Dev blog architecture, §Positioning).
Task: (1) Build the deterministic source pack for Post #1 per the pipeline's stage 1. (2) One LLM drafting pass per stage 2. (3) Output draft to the blog drafts location named in the synthesis plan; log the run in that plan's §Shakedown log.
Constraints: Human edits + publishes (stage 3 = row H). Voice per Constitution §Voice — teasing, never mean.
Acceptance: Draft file exists; shakedown log entry added; no publish action taken.
```

## Prompt 9 — iOS Phase A finish `Sonnet`
```
Load context: [[Choices iOS GTM Plan]] (§Order of operations Steps 0–2), [[Choices Growth Plan]] (§3 two-phase ladder), [[Choices Webapp]] (§Status — feature/ios-capacitor), the branch itself.
Task: (1) Rebase/refresh feature/ios-capacitor on main (accounts + suggestion work landed since). (2) Complete Phase A validation: simulator + personal-team device build, haptics/share/browser polish, adaptive-polling turn updates. (3) Document the Phase B launch checklist (enrollment, push entitlement, Sign in with Apple) in the branch's docs.
Constraints: Free tier only — no paid enrollment (that's row H, Phase B gate). Account/purchase UI stays web-only; shell honors entitlements (Apple 3.1.3).
Acceptance: App builds and completes a full game in the simulator; checklist doc committed.
```

## Prompt 10 — Premium/partnership strategy pass `Opus` `[plan-first]`
```
Load context: [[Choices Growth Plan]] (§2, §2a, §8, §Open questions — streak-visibility research), [[Choices iOS GTM Plan]] (§Executive summary), live funnel data from Prompt 2's dashboard.
Task: (1) Revisit the premium gate split against the streak-visibility research (never paywall seeing the streak) with real conversion data. (2) Sponsored-slots viability memo. (3) Partnership pitch outline (§5 delivery integration). Output: a decision memo appended to [[Choices Growth Plan]] as a dated section, options + recommendation — decisions stay Austin's.
Constraints: No implementation. Constitution ethic rules 6–9 veto any option that tracks partners against each other.
Acceptance: Dated memo section exists in the Growth Plan with explicit recommendations per question.
```

## Prompt 11 — Feature flags: store + API `Sonnet` `[plan-first]`
```
Load context: [[Choices Growth Plan]] (§10c), [[Choices Data Architecture Plan]] (event catalog bundle E — `flag_changed`, added 2026-07-23), docs/audit-<date>.md (Prompt 0), apps/choices-webapp backend.
Task: (1) Add `FLAGS#global` DynamoDB item: `{flags: {name: {enabled, default, description, type: release|ops|exp, public, updatedAt, updatedBy}}, version}` on the existing table. (2) `flags.mjs`: 60s in-Lambda cache; `isEnabled(name)` falls back to the flag's declared default on any store error — never throws. (3) API endpoints on the existing router: `getFlags` (public subset only, `Cache-Control: 60s` → CloudFront), `adminListFlags`, `adminSetFlag` (optimistic version check → 409 on conflict). (4) Emit the additive `flag_changed` event on every successful `adminSetFlag`. (5) Seed `ops_kill_places`, `ops_kill_fill4`, `release_reveal_card`; migrate the §10a P2/P3 SSM-param realtime flags to `release_realtime_subscribe` / `release_polling_demoted`.
Constraints: `game.mjs` untouched. No per-request DDB read beyond the 60s cache refresh. Non-public flags never appear in `getFlags` output. Unauthorized `adminSetFlag` → 403. Unit tests for cache expiry, default fallback, version conflict.
Acceptance: unit tests pass for cache-expiry/default-fallback/409-conflict; a manual `adminSetFlag` call round-trips through `getFlags` after the cache window; a `flag_changed` row is queryable in Athena for a test flip.
```

## Prompt 12 — Feature flags: `#/admin` + client hooks `Sonnet`
```
Load context: [[Choices Growth Plan]] (§10c), Prompt 11's `flags.mjs`/API, apps/choices-webapp frontend, `AdminView.jsx` (existing owner-only `ADMIN_SUBS` gate — separate mechanism, not touched).
Task: (1) If no Cognito User Pool exists yet, provision one (SAM) with an `admin` group. (2) `#/admin` route renders only when the JWT carries the `admin` group claim, verified server-side; non-admins get a plain 404 screen. (3) Code-split the admin bundle out of the player bundle. (4) Admin panel: list/toggle/edit flags via `adminListFlags`/`adminSetFlag`, surfacing 409 conflicts to the operator. (5) Client: `FlagsProvider` fetches `getFlags` at load (CloudFront-cached); `useFlag(name, default)` hook; components render with defaults and hydrate when flags arrive — no first-paint block.
Constraints: unauthorized `adminSetFlag` → 403 (verify from the client too, not just Prompt 11's server check). Admin bundle must not ship to non-admin sessions — verify via built bundle inspection. Player first paint unaffected by the flags fetch.
Acceptance: a non-admin hitting `#/admin` sees the 404 screen; an admin toggles a flag and sees it reflected via `useFlag` within one 60s cache cycle; a bundle-size check confirms admin code isn't in the main chunk; `useFlag` default/hydrate unit tests pass.
```

## Row H — Human tasks (no prompt)
- ✅ **H-1 answered 2026-07-21**: yes — `ChoicesEdgeWaf` replaces the live Count-mode ACL. **Swap deliberately deferred to after the 2026-07-31 billing-period end** (Austin has a calendar event to do it). Prompt 2's WAF/origin flip step is gated until then; its canary/metrics/RUM steps are not.
- **H-2 (from audit): admin-creds recheck** — ChoicesUser can't read cloudwatch/synthetics; confirm no canary/dashboard already exists (admin profile) before Prompt 2 builds duplicates. *(Still open.)*
- ✅ **H-3 answered 2026-07-21**: head-to-head tally **killed** — conflicts with the no-per-player-winner design; carried-over item struck in [[Choices Webapp]].
- **H-4 (from audit): on-device iOS check** — personal-team install + full game on a real device (shell already ships via main). *(Confirmed still needed.)*
- **Apple Developer enrollment ($99) + App Store Connect setup** — gate for iOS Phase B only (GTM Plan Steps 0–1); deliberately deferred.
- **Impact affiliate program applications** — approval lag is the long pole (Growth Plan §6).
- **Group-mode playtest** — wife + one friend group; judged by laughter at the reveal (Constitution rule 10). Gates Prompt 6.
- **Record + post TikTok teasers 1–3** — scripts in [[Choices Marketing Proposal]] §TikTok teasers; sequence keyed to App Store launch.
- **Edit + publish blog Post #1** — pipeline stage 3.
- **Decide: streak-visibility premium gate** — research says never paywall it (Growth Plan §Open questions); Prompt 10 will bring data.
- **Decide: appetite for sponsored-slots sales tooling** (Growth Plan §Open questions).
- **H-5 (from row-1 verification 2026-07-22): lake spot check** — ChoicesUser lacks s3/athena/cloudwatch read on the event lake and the admin profile session was expired; with admin creds, `aws s3 ls` both zones + one Athena `GROUP BY type` in `ChoicesWebApp-events` to confirm post-07-12 data keeps flowing. Fold into the H-2 admin recheck session.
- **H-6 (from row 2, 2026-07-22): hardening ops deploys** — run PR projects#54's Ops tasks in order: H-2 duplicate check → CanarySecret on the app stack → `ChoicesCanary` stack (+SNS confirm, canary green) → `ChoicesOpsDashboard` redeploy (funnel widgets render) → `ChoicesRum` stack + `VITE_RUM_*` repo variables + frontend redeploy (forced error appears in RUM). Acceptance for row 2 completes here.
- **H-7 (from row 8, 2026-07-22): origin-story gap interview** — fill the 6 items in [[Choices Origin Story Source Pack]] §Gap interview (esp. #5, her comfort — gates any publish), then edit `00-inbox/blog-drafts/app-for-my-marriage/draft-v1.md`'s [PENDING] slots. Publishing still waits for the App Store milestone.

## Standing rules for every session
1. [[Studio Design Constitution]] governs: rubric, ethic (no scorekeeping between partners, privacy as posture), kill tests. If a prompt's task fails a kill test, stop and report — don't build it.
2. Surgical edits; design smells raised separately, never silently fixed.
3. Analytics events for new surfaces, additive-only; frozen event envelope from Prompt 1 is never mutated.
4. Commit per prompt (repo commit/PR conventions govern shipping); update this schedule + `updated:`.

## Links
- Sources: [[Choices Growth Plan]] · [[Choices Suggestion Engine Plan]] · [[Choices Data Architecture Plan]] · [[Choices iOS GTM Plan]] · [[Choices Marketing Proposal]] · [[Choices Dev Blog Synthesis Plan]] · [[Choices Origin Story Source Pack]] · [[Choices Webapp]]
- Rules: [[Studio Design Constitution]] · Up: [[Choices MOC]]
