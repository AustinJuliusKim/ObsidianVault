---
title: Web App Client No. 1 Execution Harness
aliases: [jetadore-execution-harness]
tags: [client, business, claude-code, workflow]
type: project
status: active
created: 2026-07-23
updated: 2026-07-23
related: ["[[Web App Client No. 1]]"]
---
# Web App Client No. 1 Execution Harness

Dependency-ordered schedule for the business-development side of the Je T'adore / California Dulce Doodles engagement, distilled from [[Web App Client No. 1]]. Implementation work (the actual site rescue/rebuild) is out of scope — it starts as a separate project once the contract is signed (row H → Handoff).

## How to run
- Model per prompt via /model.
- [plan-first] = approve plan before edits.
- Always loaded: CLAUDE.md + [[Web App Client No. 1]].
- Commit per prompt; tick the schedule; audit-DONE items are skipped.
- Live client interaction and business judgment calls live in row H, not in a prompt — a Claude Code session cannot run the discovery call or sign a contract.

## Schedule (dependency order)
| # | Prompt | Model | Est | Gate |
|---|---|---|---|---|
| 0 | Repo/plan audit | Sonnet | 0.5d | none — run first |
| 1 | Draft customer-facing proposal | Sonnet | 0.5d | H-1 (discovery call), H-2 (package lock), H-3 (entity decision) |
| 2 | Draft fixed-scope contract | Sonnet | 0.5d | Prompt 1 + Austin review |
| 3 | Implementation handoff scaffold | Sonnet | 0.5d | H-5 (signed contract) |
| H | Human tasks (no prompt) | User | — | see list below |

**Ordering rationale.** Stages 1–3 of the source plan (discovery call, package lock, entity decision) require live client dialogue and business judgment a Claude Code session cannot perform, so they sit in row H as gates rather than prompts. Prompt 1 (proposal) can only be drafted once those three human gates close, since pricing/package/entity are its inputs. Prompt 2 (contract) depends on the proposal Austin has approved. Prompt 3 is a thin scaffold step — it generates the shell of a new implementation project/harness — and only fires after the client has signed, at which point this harness's job is done.

**Flagged swap-point:** none — this is a short, strictly sequential chain (each prompt's input is the previous step's output or a human decision).

## Prompt 0 — Repo/plan audit `Sonnet`
```
Load context: [[Web App Client No. 1]] (full note — it's short).
Task: Read-only audit. (1) Check the vault for any existing proposal or contract draft docs for this client (search 30-projects/, 00-inbox/, 40-references/ by filename/frontmatter). (2) Check whether the discovery call has already happened and whether outcomes were logged anywhere in the vault. (3) Output a short status note appended under a new "## Audit log" section in [[Web App Client No. 1]]: what exists, what's missing, and which of H-1/H-2/H-3 (call, package, entity) are still open. (4) List ambiguities as questions for the user — do not resolve them silently.
Constraints: No code changes. Read-only vault scan; the only vault edit permitted is appending the audit log section named above.
Acceptance: [[Web App Client No. 1]] has an "## Audit log" section with dated findings; this harness's schedule reflects any row already satisfied (mark audit-DONE, never delete).
```

## Prompt 1 — Draft customer-facing proposal `Sonnet` `[plan-first]`
```
Load context: [[Web App Client No. 1]] (§Strategy, §Pricing, §Proposal & contract shape), the logged discovery-call outcomes and package/entity decisions from H-1/H-2/H-3 (paste or link wherever Austin recorded them).
Task: (1) Draft a 1–2 page customer-facing proposal in plain language with a before/after framing of both sites. (2) Present 2–3 fixed-price options anchored on the "Rescue & Rebuild" $2,000–$3,000 tier from the pricing section, adjusted per actual call outcomes. (3) Include an hourly rate card for future/out-of-scope asks. (4) Save the draft as a new file (e.g. `30-projects/Web App Client No. 1 Proposal Draft.md` or an attachment referenced from [[Web App Client No. 1]]) and link it from that note.
Constraints: No-retainer positioning — this is a fixed-scope, one-time engagement. Plain language, no jargon a small-business owner wouldn't recognize. Do not invent call outcomes not actually provided as input — flag any missing input as a question instead of guessing.
Acceptance: A proposal draft exists, is linked from [[Web App Client No. 1]], and is ready for Austin's review before it goes to the client.
```

## Prompt 2 — Draft fixed-scope contract `Sonnet` `[plan-first]`
```
Load context: [[Web App Client No. 1]] (§Proposal & contract shape, §Entity decision rule), the approved proposal draft from Prompt 1, the entity decision (sole prop vs. CA LLC) from H-3.
Task: (1) Draft a fixed-scope contract matching the approved proposal's chosen package and price. (2) Include: 2 revision rounds, a client-provides-content clause, IP transfer to client on final payment, explicit no-ongoing-maintenance-obligation language, and a 30-day warranty period. (3) Use the correct invoicing entity per the entity decision. (4) Save the draft alongside the proposal and link it from [[Web App Client No. 1]].
Constraints: Fixed price only — no hourly/retainer language in the core contract (the rate card from Prompt 1 covers future asks separately). Do not represent this as legal advice; flag that a Peter Park sanity check is optional-but-recommended before sending to the client.
Acceptance: A contract draft exists, matches the approved proposal terms, and is ready for the optional attorney check and client signature.
```

## Prompt 3 — Implementation handoff scaffold `Sonnet`
```
Load context: [[Web App Client No. 1]], the signed contract from Prompt 2/H-5 (scope, price, timeline as actually signed).
Task: (1) Create the new implementation project's entry point: a `30-projects/<Implementation Project Name> Execution Harness.md` shell (or a plan doc feeding into one, per the harness skill's own Generate mode) scoped to the actual signed deliverables (site migration/rebuild, content, launch). (2) Link it from [[Projects MOC]] under a new or existing business-engagements group. (3) Mark [[Web App Client No. 1]] status as evergreen (business-dev phase complete) once this handoff doc exists.
Constraints: Do not start implementation work itself in this prompt — scaffold only, per the source plan's explicit "implementation is out of scope for this harness" rule.
Acceptance: A new implementation-project doc/harness exists, is linked from [[Projects MOC]], and [[Web App Client No. 1]] reflects the handoff.
```

## Row H — Human tasks (no prompt)
- **H-1 — Discovery call.** Run the call guide (trigger question, current-spend inventory, credential check, scope probes, budget calibration $1.5–4.5K, soft close). Log outcomes into [[Web App Client No. 1]] or a linked note.
- **H-2 — Package lock.** Pick the final package structure + price from the call outcomes; log the decision.
- **H-3 — Entity decision.** Apply the timeline rule (sole prop if start <3 weeks out, else parallel-file a CA LLC); log which entity will invoice.
- **H-4 — Peter Park sanity check** (optional). Attorney pass on the contract draft from Prompt 2 before it goes to the client.
- **H-5 — Client signature.** Client signs the fixed-scope contract; this is the gate for Prompt 3.

## Standing rules for every session
1. This harness only covers business development through contract signature — never treat a prompt here as authorization to start the actual website work.
2. Surgical edits; design smells raised separately, never silently fixed.
3. Do not invent client statements, pricing decisions, or call outcomes not actually logged by Austin — ask instead of guessing.
4. Commit per prompt; update this schedule.

## Links
- [[Web App Client No. 1]]
- [[Projects MOC]]
