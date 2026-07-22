---
title: Pipeline Smoke Test
aliases: [pipeline-smoke-test]
tags: [pipeline, workflow, claude-code, project]
type: project
status: draft
created: 2026-07-22
updated: 2026-07-22
related: []
---
# Pipeline Smoke Test

> Purpose: end-to-end smoke test of the harness-intake pipeline itself (issue → vault docs → Execution Harness → PR). No source plans — this doc *is* the plan, captured from issue [[#4]] (`Harness: Pipeline Smoke Test`).

## Goal
Verify the intake pipeline works, by having it produce one toy deliverable: a single markdown page listing the pipeline's own components (issue template, workflow, routine, harness skill) with one sentence each.

## Plan
1. Audit what exists — confirm the four pipeline components are present and locate them.
2. Write the page — one markdown doc naming all four components, one sentence each.
3. Human reviews it.

## Constraints
- Documentation only, no code.
- Keep the harness minimal — this is a smoke test, not a real project. The resulting PR is expected to be closed without merging.

## Success criteria
The page exists and names all four pipeline components:
1. The `harness` issue template (`.github/ISSUE_TEMPLATE/harness.md`)
2. The intake GitHub Actions workflow (`.github/workflows/harness-intake.yml`)
3. The scheduled routine that fires the workflow
4. The `harness` skill (`.claude/skills/harness/SKILL.md`)
