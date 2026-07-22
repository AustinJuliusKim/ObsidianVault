---
title: Pipeline Smoke Test Execution Harness
aliases: [pipeline-smoke-test-execution-harness]
tags: [pipeline, workflow, claude-code, project]
type: project
status: active
created: 2026-07-22
updated: 2026-07-22
related: [[Pipeline Smoke Test]]
---
# Pipeline Smoke Test Execution Harness

Minimal harness for the harness-intake pipeline's own smoke test. Run in Claude Code at the vault repo root. Each prompt below is self-contained — a fresh session needs only its Load context line.

## How to run
- Model per prompt via /model; Haiku rows can run as Task-tool subagents from a Sonnet session.
- Always loaded: CLAUDE.md + [[Pipeline Smoke Test]].
- Commit per prompt; tick the schedule; audit-DONE items are skipped.

## Schedule (dependency order)
| # | Prompt | Model | Est | Gate |
|---|---|---|---|---|
| 0 | Repo/plan audit | Sonnet | 0.1d | none — run first |
| 1 | Write component page | Sonnet | 0.1d | Prompt 0 |
| H | Human tasks (no prompt) | User | — | Review the page; close the smoke-test PR without merging |

Only two prompts: this is a smoke test of the intake pipeline, not a real project, so the schedule is deliberately the smallest valid shape (audit + one deliverable + human sign-off row).

## Prompt 0 — Repo/plan audit `Sonnet`
```
Load context: [[Pipeline Smoke Test]], .github/ISSUE_TEMPLATE/harness.md, .github/workflows/harness-intake.yml, .claude/skills/harness/SKILL.md.
Task: (1) Confirm each of the four pipeline components named in [[Pipeline Smoke Test]] exists in the repo and record its file:line evidence: the harness issue template, the intake GitHub Actions workflow, the scheduled routine that fires the workflow (check for it via the account's routine list — it lives outside the repo, so note its name/schedule instead of a file path), and the harness skill. (2) Produce a dated status matrix (component | exists? | evidence) so Prompt 1 knows there is nothing left to audit.
Constraints: read-only — no vault or repo edits. Documentation only.
Acceptance: a status matrix exists (inline in your response or as a scratch doc) covering all four components with file:line (or routine-name) evidence for each.
```

## Prompt 1 — Write component page `Sonnet`
```
Load context: [[Pipeline Smoke Test]], Prompt 0's status matrix.
Task: (1) Create 20-notes/Harness Intake Pipeline Components.md as an atomic note (frontmatter per CLAUDE.md schema: type: note, status: seed, registry-valid tags) listing the four pipeline components from Prompt 0's matrix, one sentence each. (2) Link the new note from [[Projects MOC]] (or a more specific owning MOC if one fits better) so it has no orphans. (3) Bump `updated:` on the note and the MOC you touched.
Constraints: documentation only, no code. Follow the wiki skill's write path exactly (owning-MOC link, no dangling wikilinks, Tag Registry–only tags).
Acceptance: 20-notes/Harness Intake Pipeline Components.md exists, names all four components (one sentence each), and is linked from at least one MOC.
```

## Standing rules for every session
1. This is a smoke test — keep changes minimal and documentation-only; no code.
2. Follow the vault's wiki skill write path for every edit (owning-MOC link, Tag Registry tags, no orphans).
3. Commit per prompt; update this schedule (tick rows, bump `updated:`).

## Links
- [[Pipeline Smoke Test]]
