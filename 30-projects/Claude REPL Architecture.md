---
title: Claude REPL Architecture
aliases: [claude-repl-architecture]
tags: [project, claude-repl, architecture, fixtures, guided-mode]
type: project
status: developing
created: 2026-07-02
updated: 2026-07-02
related: [[Claude REPL]], [[Claude REPL Business Plan]], [[Claude REPL Lesson Plan]], [[Claude REPL Protocol]], [[Claude REPL Backend]], [[Claude REPL Frontend]]
---
# Claude REPL — Technical Architecture (Phase A/B) (v1.0)

Phase A/B technical architecture for [[Claude REPL]]: recorder, fixture format, fixture-player transport, lesson DAG, prompt-builder UI, CI re-seed pipeline (Phase A / Guided mode) plus LLM proxy, metering, prepaid wallet (Phase B / minimal live-paid mode). Architecture only — no code this pass. Grounds every section in the existing MVP codebase; no new component is introduced without a stated seam into current code.

## 1. Overview & scope
**Phase A** = free guided replay. No backend call for free users — fixtures ship static via CDN, replayed through the real UI. **Phase B** = minimal live-paid mode — proxy, metering, wallet gate live execution.

**Locked invariants (constraints callout):**
- UI is transport-agnostic: fixture replay uses the *unmodified* reducer and virtualFs path — zero UI adaptation for Guided mode.
- Fixture drift is caught by CI, never auto-promoted.
- Master Anthropic key never enters the sandbox (Phase B).
- Billing truth lives at the proxy, not the sandbox.

**Message flow, annotated per phase** (base flow from [[Claude REPL]]):
1. Browser connects → **Guided:** no connection, fixture loaded from CDN. **Live (byok/wallet):** `sessionManager` creates a Session, starts idle timer.
2. User enters API key → **Guided:** n/a. **byok:** sandbox boots in parallel. **wallet:** short-lived HMAC token issued instead of a key.
3. User prompts → **Guided:** fixture player matches prompt against fixture instead of transmitting. **Live:** `claudeRunner` builds `claude -p …` in the sandbox.
4. Claude emits NDJSON → **Guided:** pre-recorded `ServerMsg` frames replay at (compressed) original pacing. **Live:** `streamMapper` normalizes → protocol `ServerMsg`.
5. Plan/acceptEdits: **Guided:** `awaitClient` markers gate replay until the learner approves/denies. **Live:** `permissionBridge` parks until browser responds.
6. Run completes → **Guided:** grading fires against post-replay virtualFs/terminal. **Live:** workspace reconciled against real sandbox FS.
7. Disconnect/idle → **Guided:** n/a (static). **Live:** sandbox killed, key/token dropped.

### Decisions
| Decision | Choice | Rationale | Status |
|---|---|---|---|
| Free-tier backend | None — static fixtures only | Zero marginal cost at scale, matches Business Plan pricing | decided |
| UI adaptation for replay | Zero — same reducer, same components | Preserves "real UI" pedagogy promise | decided |

## 2. Transport abstraction (keystone Phase A refactor)
Interface: `{connect(handlers), send(msg), close()}`. `useSession` (`apps/claude-repl/src/state/useSession.js`, currently an inline `new WebSocket`) is refactored to hold a transport object behind this interface — its **return shape is frozen**, so downstream components/reducer don't change.

`createTransport(mode)` factory: `mode === 'guided'` → fixture transport; `mode === 'byok' | 'wallet'` → live WS transport (today's inline `new WebSocket`, extracted verbatim).

Fixture transport's `send()` doesn't transmit — it matches the outgoing client message against the loaded fixture's expected input (see §3 `expectedPrompt`) and, on match, resumes frame playback. Frames dispatch into `src/state/reducer.js` unmodified — it already dispatches flat `{type,...payload}` frames, so recorded streams replay without a reducer branch. Seeded FS snapshots inject as initial `file_tree`/`file_content` through the existing `src/lib/virtualFs.js` optimistic-apply + merge path — no new FS code.

### Decisions
| Decision | Choice | Rationale | Status |
|---|---|---|---|
| Seam | New transport layer under `useSession`, not a UI branch | Keeps reducer/components identical across modes | decided |
| `useSession` return shape | Frozen | Avoids touching every consumer component | decided |
| Fixture injection point | Existing `virtualFs` merge path | No new FS-application code | decided |

## 3. Fixture file format
Envelope:
```json
{
  "fixtureVersion": 1,
  "claudeCodeVersion": "1.x.x",
  "lessonId": "l1",
  "branchId": "vague",
  "recordedAt": "2026-07-02T00:00:00Z",
  "seedSnapshotId": "l1-input",
  "events": [ /* see below */ ],
  "assertion": { "type": "file-contains", "path": "index.html", "match": "<h1>" }
}
```
Event entry (verbatim `ServerMsg` frame + compressed pacing; `origDelayMs` retained for drift diffing):
```json
{ "frame": { "type": "text", "delta": "…" }, "delayMs": 120, "origDelayMs": 900 }
```
`awaitClient` marker variant (gates replay on approve/deny/prompt):
```json
{
  "awaitClient": "permission",
  "promptChoices": ["approve", "deny"],
  "expectedPrompt": null
}
```
`promptChoices[]` + `expectedPrompt` bind the fixture to the **prompt builder** (§8 worked example) so the learner's constrained input, not free text, drives branch selection. Normalization list applied at record time for determinism: strip timestamps, strip/replace UUIDs, rewrite absolute paths to workspace-relative.

### Decisions
| Decision | Choice | Rationale | Status |
|---|---|---|---|
| Frame fidelity | Verbatim `ServerMsg`, no transformation | Reducer needs zero replay-specific logic | decided |
| Pacing | Compressed `delayMs` + retained `origDelayMs` | Fast lessons; still diffable against live pacing for drift | decided |
| Determinism | Normalize timestamps/UUIDs/paths at record time | CI diffing requires stable frames | decided |

## 4. Fixture player state machine
Async playback loop keyed by `speedMultiplier` (`0` = instant, used in tests/CI). States: `idle → playing → awaitingClient → playing → done`. On `awaitClient`, playback pauses; a mismatched prompt shows a gentle hint (not a hard failure) rather than aborting the lesson.

Prompt matching is **exact** against `expectedPrompt` for v1, routed through a `matchPrompt(input, branch)` seam — isolates the exact-match implementation so fuzzy matching can land later without touching the state machine. Per-branch fixture files are eager-loaded per lesson (small files, CDN-cached). Interrupt (learner backs out) resets to the last seeded snapshot. Grading fires on `done`.

### Decisions
| Decision | Choice | Rationale | Status |
|---|---|---|---|
| Matching v1 | Exact match via `matchPrompt` seam | Ships fast; seam avoids a rewrite for fuzzy match later | decided |
| Mismatch handling | Hint, not hard fail | Matches "magic first" pedagogy — don't punish exploration | decided |
| Loading strategy | Eager per-lesson, per-branch | Fixtures are small; avoids mid-lesson fetch stalls | decided |

## 5. Permission-lesson handling
Fixtures script `permission_request` frames directly — the live `permissionBridge.request` path is **unwired in the current backend** (known gap; doesn't block Guided mode since fixtures don't need a live bridge). Lesson 5 (permission modes) carries **both** an approve-tail and a deny-tail fixture per branch. Denying the risky edit **counts as valid completion** — grading is "the learner made a choice," not "the learner approved," matching the Lesson Plan's assertion for L5 (assert: deny the risky edit).

### Decisions
| Decision | Choice | Rationale | Status |
|---|---|---|---|
| `permissionBridge` live wiring | Deferred, not required for Phase A | Guided mode never calls the live bridge | decided |
| Deny-as-completion | Yes | Teaches the leash concept; matches Lesson Plan L5 assertion | decided |

## 6. Seeded FS snapshots & seeding CLI
Snapshot manifest:
```json
{
  "snapshotId": "l1-output",
  "files": [
    { "path": "index.html", "content": "<html>…</html>" },
    { "path": "style.css", "contentRef": "blobs/abc123" }
  ]
}
```
Captured from the backend's `reconcileWorkspace` (`services/claude-repl-backend/src/sessionManager.mjs:~147`) at the end of each authoring run — reuses the existing real-FS reconcile rather than a new capture mechanism.

8-snapshot chain, one per lesson: lesson N's output snapshot is lesson N+1's input, matching the Lesson Plan's single evolving HTML page across the 8-lesson spine. `seed-lessons <lessonId|all>` CLI lives in `services/claude-repl-backend/scripts/` — drives the recorder (§7) against real prompts, writes fixtures + snapshots.

### Decisions
| Decision | Choice | Rationale | Status |
|---|---|---|---|
| Capture point | `reconcileWorkspace` (existing) | No new FS-diff code | decided |
| Snapshot chaining | Linear, N→N+1 | Matches "one artifact, eight lessons" narrative | decided |
| Content storage | Inline `content` or `contentRef` blob | Keeps small files inline, large ones out of the JSON | decided |

## 7. Recorder
Implemented as a **passthrough decorator** on `handlePrompt`'s `onMessage` tap in `services/claude-repl-backend/src/sessionManager.mjs:~108`, gated by `RECORD=1` — no separate recording code path, so recorded runs exercise exactly the production flow. Applies record-time normalization + pacing compression (§3) inline as frames pass through. The author's own prompt/approve/deny actions during a recording session are captured as the fixture's `expectedPrompt` / `awaitClient` entries. Redacts API keys, UUIDs, and absolute paths before write — **fixtures are public** (shipped via CDN). Writes `fixtures/<lessonId>/<branchId>.json` + `snapshots/<id>.json`.

### Decisions
| Decision | Choice | Rationale | Status |
|---|---|---|---|
| Recorder placement | Decorator on existing `onMessage` tap | Recorded stream == production stream, no drift from a parallel path | decided |
| Activation | `RECORD=1` env gate | Zero overhead/risk in normal operation | decided |
| Redaction | Mandatory pre-write, keys/UUIDs/paths | Fixtures are public CDN assets | decided |

## 8. Lesson DAG, assertions & grading
Single CDN-shipped `lessons.json`: 8-lesson linear spine, ≤3 branches per lesson, exactly one declarative assertion per lesson — `file-contains | file-exists | terminal-matches | file-equals` — evaluated against the post-replay virtualFs/terminal state. CI runs a DAG↔fixtures consistency check (every DAG branch has a fixture, every fixture is referenced).

Lesson DAG entry:
```json
{
  "lessonId": "l1",
  "title": "Ship a page in 90 seconds",
  "branches": ["vague", "constrained", "plan-mode"],
  "seedSnapshotId": "l1-input",
  "assertion": { "type": "file-contains", "path": "index.html", "match": "<h1>" }
}
```

**Worked Lesson-1 example — promptChoices → expectedPrompt binding.** Lesson 1 ("Ship a page in 90 seconds") offers the prompt builder these options (invented, consistent with the Lesson Plan's "magic first" framing and single-file HTML artifact):
```json
{
  "promptChoices": {
    "task": ["make a page", "make a personal landing page"],
    "subject": ["about me", "for my photography"],
    "constraint": ["", "single HTML file, inline CSS"]
  }
}
```
The `constrained` branch's fixture pins `expectedPrompt: "make a personal landing page about me, single HTML file, inline CSS"` — the exact concatenation the prompt builder produces when the learner picks the constrained options. `matchPrompt` (§4) compares the builder's assembled string against this, not free text, so matching stays exact while still feeling like "the learner's own prompt."

### Decisions
| Decision | Choice | Rationale | Status |
|---|---|---|---|
| Assertion cardinality | Exactly one per lesson | Keeps grading simple, deterministic | decided |
| Assertion types | 4 fixed types | Covers file/terminal outcomes without a general expression language | decided |
| Prompt input | Builder (structured), not freeform | Enables exact `expectedPrompt` matching (§4) | decided |

## 9. Static hosting, CDN layout & versioning
Layout: `/<claudeCodeVersion>/{lessons.json, fixtures/…, snapshots/…}`. App pins `VITE_FIXTURE_VERSION` explicitly — **never "latest"** — so a CDN publish can't silently change a running lesson under a learner. Immutable, long-TTL caching per version path. A hashed `manifest.json` provides integrity checking against tampered/corrupted fixture fetches. CDN host choice is flagged as an ops decision, not architectural.

### Decisions
| Decision | Choice | Rationale | Status |
|---|---|---|---|
| Version pinning | Explicit `VITE_FIXTURE_VERSION`, never "latest" | Prevents mid-session breakage from a new publish | decided |
| Caching | Immutable, long-TTL per version path | Version paths never mutate once published | decided |
| CDN host | Unspecified | Ops decision, doesn't affect architecture | open |

## 10. CI re-seed & drift pipeline
Triggered per Claude Code release. Re-runs ~20–30 seeded branches (8 lessons × branches) through the same recorder path (§7), diffs **normalized structural** frames against the committed fixtures — ignoring pacing/text variance, comparing frame shape/type/args. Flags for **human review only** — drift is never auto-promoted into shipped fixtures, preserving the "real UI, curated content" trust guarantee. Runs as a paid CI job, key pulled from secrets.

Names the core tension explicitly: fixtures require **replay determinism**, but the thing being recorded (Claude Code output) is **LLM-nondeterministic** — the diff must tolerate wording/pacing drift while catching structural drift (tool calls, file outcomes, assertion-relevant content).

### Decisions
| Decision | Choice | Rationale | Status |
|---|---|---|---|
| Trigger | Per Claude Code release | Fixture freshness is load-bearing (Business Plan) | decided |
| Diff scope | Normalized structural frames only | Tolerates LLM nondeterminism, catches real drift | decided |
| Promotion | Human review, never automatic | Guards the "curated" trust promise | decided |

## 11. Phase B — proxy, metering, wallet, Stripe, auth
**Protocol:** additive session-auth `{mode: 'byok' | 'wallet' | 'guided'}`, validated in `parseClientMessage` (`packages/claude-repl-protocol/index.js`) — the existing trust-boundary function. Protocol version bump; frozen enums are *extended*, never mutated, to keep old fixtures/clients valid.

**Proxy:** separate service, `services/claude-repl-proxy` — isolated from the backend so a compromise has a small blast radius around the master Anthropic key. Sandbox receives a short-lived HMAC-signed per-session token (not the key); `ANTHROPIC_BASE_URL` in the sandbox points at the proxy, which injects the real key server-side. Streaming is unbuffered passthrough while the proxy counts usage inline. Per-session token cap enforced at the proxy as a runaway brake (independent of any sandbox-side cap).

**Metering:**
```json
{ "sessionId": "s_123", "walletId": "w_456", "model": "claude-sonnet-5", "tokens": 4231, "costUsd": 0.0187, "ts": "2026-07-02T00:00:00Z" }
```
Recorded per request at the proxy from a server-side price table — this is **billing truth**. Sandbox-visible stream-json usage numbers are display-only, never authoritative. Request ids carried through for idempotency (retry-safe).

**Wallet:** append-only ledger, e.g.
```json
{ "walletId": "w_456", "delta": -187, "reason": "usage", "ref": "req_789", "ts": "2026-07-02T00:00:00Z" }
```
(`reason`: `topup | usage | unlock`.) Hard-stop gate co-located with metering at the proxy. Concurrency handled via reserve-on-request / settle-on-response; an in-flight request finishes rather than being cut mid-stream, bounded by the per-session cap so worst-case overspend is capped, not unbounded.

**Stripe:** top-up and fixed-price track unlocks only. Webhook → idempotent ledger entry keyed on Stripe event id. Entitlements (unlocked tracks) tracked separately from wallet balance. Explicitly **no** subscriptions, trials, or auto-reload.

**Abuse:** prepaid-only (no credit exposure), Stripe Radar, rate limits, sandbox egress allowlist. E2B capability for enforcing that allowlist is an **unverified TODO** — fallback is a proxy-only network template if E2B can't enforce it.

### Decisions
| Decision | Choice | Rationale | Status |
|---|---|---|---|
| Proxy topology | Separate service from backend | Isolates master key blast radius | decided |
| Billing source of truth | Proxy-side metering, not sandbox usage | Sandbox numbers are learner-visible only, not trusted | decided |
| Overspend handling | Reserve/settle + finish-in-flight, capped | Bounded worst case without cutting a response mid-stream | decided |
| Billing model | Prepaid wallet + fixed unlocks only | No subscriptions/trials/auto-reload risk surface | decided |
| Egress control | E2B allowlist, TODO verify | Feasibility unconfirmed; needs a fallback plan either way | open |

## 12. Invariants & risks (consolidated)
- Replay = real UI, **zero adaptation** — any Guided-mode special-casing in components/reducer is a design smell.
- Drift is caught by CI, **never auto-promoted**.
- Canonical-run determinism policy: normalize at record time, diff structurally, tolerate wording/pacing.
- Master Anthropic key **never** enters the sandbox — proxy-only.
- Billing truth = proxy metering, not sandbox-reported usage.
- Hard-stop gate fires **before** overspend, not after.
- The protocol (`parseClientMessage`) is the trust boundary for all client input, live and guided.
- **No secrets in fixtures** — fixtures are public CDN assets; redaction is mandatory at record time.

### Decisions
| Decision | Choice | Rationale | Status |
|---|---|---|---|
| Adaptation policy | Zero UI special-casing for replay | Any exception undermines the core pedagogy claim | decided |
| Fixture trust | Public, redacted, human-reviewed drift only | Fixtures ship to anonymous learners | decided |

## Open Questions
- **Session token scheme:** signed (stateless HMAC) vs store-backed (revocable) session tokens for the proxy. No recommendation yet — tradeoff is revocability vs proxy statelessness.
- **Mid-stream overspend handling:** hard-cut vs finish-current request when the wallet cap is hit. **Recommendation: finish-current** (bounded, less jarring than truncating a response).
- **Deny-as-valid-completion** for permission lessons. **Recommendation: yes** — matches "made a choice" grading philosophy.
- **Fuzzy-match seam sufficiency:** whether `matchPrompt`'s exact-match v1 plus seam is enough runway, or fuzzy matching needs to land sooner. No recommendation yet — depends on early learner-input data.
- **E2B egress allowlist verification:** confirm E2B can actually enforce a network allowlist for Phase B sandbox isolation. No recommendation yet — unverified TODO; proxy-only fallback template if not.
- **CDN host choice** for fixture/lesson static hosting. No recommendation yet — flagged as an ops decision, not architectural.

## Repo doc stubs (future homes)
Vault carries **why/design/open questions**; exact schemas, CLI usage, and runbooks belong in-repo, authored at implementation time (not this pass):
- `packages/claude-repl-protocol/FIXTURE_FORMAT.md` — exact fixture/event/manifest JSON schema, versioning rules.
- `services/claude-repl-backend/docs/RECORDER.md` — `RECORD=1` usage, `seed-lessons` CLI flags, redaction checklist.
- `services/claude-repl-proxy/README.md` — proxy deployment, token issuance, metering/price-table config.

## Links
- Part of: [[Claude REPL]]
- Plans: [[Claude REPL Business Plan]] · [[Claude REPL Lesson Plan]]

## v1.1 additive amendments (2026-07-03)
Shipped with Lessons 2–8 + the CLI-style UI. All additive — frozen enums/shapes extended, never mutated; L1 fixtures remained valid throughout.
- **§8**: fifth assertion type `quiz {question, choices[], correctIndex}` — a post-replay question card; still exactly one auto-grade assertion per lesson (the quiz *is* the assertion). Used by L2/L3/L4/L5/L7/L8.
- **§3**: `FrameEvent.annotation?: {title, body}`; lesson-level `playback: "step"|"auto"` drives player `stepMode` (pauses at annotated events; annotations are the pause points — no per-beat fixture markers, the frame stream stays verbatim); new client message `{type:"next"}`; `UsagePayload.model?` (stamped at record time from the real `system/init`); `branchConfig` gains per-branch `seedSnapshotId?` (L7 with/without CLAUDE.md inputs) and `model?`.
- **§6/§7**: seeder is recipe-driven (`src/recipes/l2..l8`, kinds `simple|plan|multiplan|model`); `applyMultiPlanGate` generalizes the plan splice (L4 revise = plan_v1 → gate → plan_v2 → gate → exec); snapshot chain l1→l8 with lesson N recorded from N−1's output.
- **§12 note**: step-mode pauses are player-level; the reducer gained only local UI actions (`annotation_shown`/`annotation_cleared`) — zero-replay-branching invariant preserved.
- Known accepted artifact: plan-mode fixtures surface `~/.claude/plans/plan.md` in the replayed tree.

## Changelog
- **v1.1** (2026-07-03) — additive amendments above; 8-lesson spine live.
- **v1.0** (2026-07-02) — initial architecture, drafted from approved plan.
