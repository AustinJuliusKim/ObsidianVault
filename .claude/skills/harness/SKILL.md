---
name: harness
description: Turn planning chats (Claude Web exports/pastes) and ObsidianVault plan docs into a per-project Execution Harness — a dependency-ordered schedule of self-contained Claude Code prompts with model routing — then keep it current and drive it. Invoke when the user says "create/build an execution harness", "harness this plan/chat", "tick the harness", "review the harness", "run the next harness prompt", or pastes a Claude Web planning chat they want operationalized.
---

# harness — generate, update, review, and execute per-project Execution Harnesses

An Execution Harness is a vault doc (`30-projects/<Project> Execution Harness.md`) that converts finished planning (chat transcripts, plan docs) into a dependency-ordered schedule of prompts, each runnable in a fresh Claude Code session with zero chat memory. Prompts are self-contained by construction: everything a session needs is named in its Load context line.

## Mode dispatch

`/harness <project> [review|run|next]`, or infer the project from conversation context.

1. Locate the harness doc: `30-projects/<Project> Execution Harness.md` in the vault (absolute path `/Users/aukim/personal/ObsidianVault/`, falling back to the `./ObsidianVault/` submodule when the absolute path is unavailable — submodule may be stale).
2. Dispatch:
   - No harness doc exists → **Generate**.
   - Doc exists, no mode arg → **Update**.
   - `review` → **Review** (read-only).
   - `run` / `next` → **Execute**.

All vault reads/writes follow the vault's own wiki skill (`ObsidianVault/.claude/skills/wiki/SKILL.md`): MOC-first retrieval, heading-outline-first for monster docs, Tag Registry–compliant tags, owning-MOC link for new docs, no dangling wikilinks. Do not restate or override that protocol — defer to it.

## Generate

Inputs: the project's plan docs in the vault (walk `10-maps/Projects MOC.md` → the project's MOC/notes; load only relevant sections of large docs), plus any pasted or exported Claude Web planning chat in the conversation. If sources conflict, the newest locked decision wins; list unresolved conflicts as questions, don't pick silently.

Produce `30-projects/<Project> Execution Harness.md` from the skeleton below. Rules:

- **Schedule always starts with Prompt 0** — a read-only repo/plan audit that verifies which planned items already exist (status matrix with file:line evidence) so later prompts skip audit-DONE work. **Schedule always ends with row H** — human-only tasks (approvals, dashboard pastes, purchases) with no prompt.
- Every `## Prompt N` section follows the prompt skeleton: Load context names exact docs/§sections and artifacts from earlier prompts; Task is numbered, each step naming its artifact; Constraints carry the invariants; Acceptance is mechanically checkable (a test passes, a query returns rows, an alarm exists).
- Route models per the convention below; tag one-way-door prompts `[plan-first] [think-hard]` and restate the frozen schema/envelope inline in that prompt so the session cannot drift.
- Add the ordering rationale + flagged swap-points under the schedule table.
- Frontmatter: `type: project`, tags from the Tag Registry only (add a missing tag to the registry first, per the wiki skill), `related:` wikilinks to every source plan.
- Link the new doc from the project's owning MOC; bump `updated:` on both.

### Document skeleton

```markdown
---
title: <Project> Execution Harness
aliases: [<project>-execution-harness]
tags: [<registry-valid project tag>, claude-code, workflow]
type: project
status: active
created: <date>
updated: <date>
related: [[<each source plan>]]
---
# <Project> Execution Harness

<One line: what this is, where to run it, note that prompts are self-contained.>

## How to run
- Model per prompt via /model; Haiku rows can run as Task-tool subagents from a Sonnet session.
- [plan-first] = approve plan before edits. [think-hard] = extended thinking.
- Always loaded: CLAUDE.md + <constitution/rules doc>.
- Commit per prompt; tick the schedule; audit-DONE items are skipped.

## Schedule (dependency order)
| # | Prompt | Model | Est | Gate |
|---|---|---|---|---|
| 0 | Repo/plan audit | Sonnet | 0.5d | none — run first |
| ... |
| H | Human tasks (no prompt) | User | — | <list> |

<Ordering rationale + flagged swap-points.>

## Prompt N — <Title> `<model>` `[tags]`
<code block:>
Load context: [[Doc]] (§sections), <artifacts from earlier prompts>.
Task: <numbered, concrete steps>.
Constraints: <invariants>.
Acceptance: <checkable criteria>.

## Standing rules for every session
1. <constitution/kill tests>
2. Surgical edits; design smells raised separately, never silently fixed.
3. Analytics events for new surfaces, additive-only.
4. Commit per prompt; update this schedule.

## Links
<wikilinks to all source plans>
```

### Prompt skeleton — annotated

```
Load context: [[Plan A]] (§the exact sections), docs/output-from-prompt-N.md
Task: (1) ... (2) ... (3) ...          ← numbered; each step names its artifact
Constraints: <pure modules stay pure; never log X; naming rule Y>
Acceptance: <a test passes / a query returns rows / an alarm exists>
```

### Worked patterns

- **Audit prompt**: read-only; status matrix with file:line evidence; outputs dated doc; "ambiguities listed as questions for the user".
- **Research prompt (Haiku)**: "No code. Output: docs/<topic>.md" with an explicit list of facts to verify (pricing tiers, SKUs, eligibility, approval lag).
- **One-way-door prompt**: tag [plan-first] [think-hard]; restate the frozen schema/envelope inline so the session cannot drift from it.
- **Feature prompt**: implementation steps + its own analytics events + graceful-degradation behavior + a latency/UX constraint from the product rules.
- **Simulation prompt**: "Simulation only — no UI"; pure reducer + Monte Carlo + a report doc with an explicit ship/kill recommendation against a named rubric.

### Model routing convention

- Opus/top tier: architecture & strategy passes (usually already done in chat — rare in harnesses)
- Sonnet: all implementation
- Haiku: research, verification, pricing checks, application legwork

## Update

Against the existing harness, apply only what changed:

- Tick completed schedule rows; mark rows the Prompt 0 audit proved already done as `audit-DONE` (skipped, never deleted).
- Add/re-order prompts when plans changed; keep dependency order and re-flag swap-points. Append and annotate — never rewrite schedule history.
- Bump `updated:`. If a source plan changed in a way that invalidates a written prompt, rewrite that prompt section and say so.

## Review

Read-only audit of the harness against its source plans. Check every item; report findings as gaps/questions, make no edits:

- **Self-containment**: each prompt runnable in a fresh session — Load context names every needed doc/§section/artifact; nothing relies on chat memory.
- **Acceptance**: every criterion mechanically checkable; no "make it work".
- **Ordering**: dependencies sound; artifacts consumed by prompt N are produced by an earlier prompt; swap-points flagged.
- **Routing**: models match the convention; one-way-door prompts tagged `[plan-first] [think-hard]` with frozen schemas restated inline.
- **Separation**: human-only work lives in row H, not buried inside prompts.
- **Drift**: prompts still match the current source plans (locked decisions, constitutions).

## Execute

1. Pick the first schedule row that is unticked, not `audit-DONE`, and whose Gate is satisfied. If the next row's gate needs a human, stop and report exactly what's needed.
2. Load exactly what the prompt's Load context names (plus CLAUDE.md / always-loaded docs) — nothing more.
3. Run it honoring its tags: Haiku rows as Agent-tool subagents with a Haiku model override; `[plan-first]` rows get a plan approved before edits; `[think-hard]` rows use extended thinking. Sonnet rows run inline.
4. Verify the Acceptance criteria yourself — actually run the test/query/check; a claim is not a pass.
5. Commit per prompt (the repo's own commit/PR conventions govern shipping), then tick the row, bump `updated:`, and commit the vault change.
6. One row per invocation unless the user asks for more.

## Claude Web use

This file doubles as a paste-in prompt for Claude Web (no tools): paste it plus the source plans/chat, and ask for the harness doc as output to save into the vault manually. Vault-protocol and Execute steps that need tools don't apply there — Generate's skeleton and rules do.
