---
title: Vault Lint Report
aliases: []
tags: [meta, lint]
type: inbox
status: seed
created: 2026-07-05
updated: 2026-07-13
related: []
---

# Vault Lint Report

## Broken links
None

## Orphans
None

## Stale repo claims (adjudicated)
None. All 18 repo-claim candidates from this run were classified as historical or aspirational — none assert that a nonexistent path exists in the code today.

## Reviewed not actionable (historical/aspirational)
- 30-projects/Choices CloudFront PAYG Migration Plan.md:35 `apps/choices-webapp/ops/edge-waf.yaml` — aspirational (Execution phase 1 of a plan explicitly marked "Status: DEFERRED"; not yet built)
- 30-projects/Claude REPL Architecture.md:40 `apps/claude-repl/src/state/useSession.js` — historical (describes the pre-rebuild MVP; Claude REPL.md's Status section confirms the old claude-repl codebase was deleted and rebuilt greenfield under guided-repl naming)
- 30-projects/Claude REPL Architecture.md:120 `services/claude-repl-backend/src/sessionManager.mjs:~147` — historical (same deleted pre-rebuild MVP)
- 30-projects/Claude REPL Architecture.md:122 `services/claude-repl-backend/scripts/` — historical (same deleted pre-rebuild MVP)
- 30-projects/Claude REPL Architecture.md:199 `packages/claude-repl-protocol/index.js` — historical (references the original protocol package's trust-boundary function, since deleted with the pre-rebuild MVP)
- 30-projects/Claude REPL Architecture.md:201 `services/claude-repl-proxy` — aspirational (Phase B proxy; changelog confirms "§11 proxy/metering/wallet endpoints remain future — only the ledger schema exists")
- 30-projects/Claude REPL Architecture.md:254 `packages/claude-repl-protocol/FIXTURE_FORMAT.md` — aspirational (explicitly listed under "Repo doc stubs (future homes)... authored at implementation time, not this pass")
- 30-projects/Claude REPL Architecture.md:255 `services/claude-repl-backend/docs/RECORDER.md` — aspirational (same "future homes" section)
- 30-projects/Claude REPL Architecture.md:256 `services/claude-repl-proxy/README.md` — aspirational (same "future homes" section)
- 30-projects/Claude REPL Architecture.md:271 `services/guided-repl-api` — aspirational (changelog says this shipped on branch feature/repl-accounts-progress, PR pending — not yet in the checked-out main tree)
- 30-projects/Claude REPL Lesson Engine Spec.md:16 `packages/claude-repl-protocol` — aspirational (locked spec's naming convention; Claude REPL.md's changelog notes the spec's claude-repl-* package names are "intentionally mapped to the repo's guided-repl-* naming")
- 30-projects/Claude REPL Lesson Engine Spec.md:25 `packages/claude-repl-lessons` — aspirational (same intentional spec-to-repo naming mapping, maps to guided-repl-lessons)
- 30-projects/Claude REPL Lesson Foundry Spec.md:34 `packages/claude-repl-lessons` — aspirational (same intentional spec-to-repo naming mapping)
- 30-projects/Claude REPL Lesson Foundry Spec.md:83 `services/guided-repl-foundry` — aspirational (changelog says this was built on branch feature/repl-lesson-foundry, PR pending — not yet in the checked-out main tree)
- 30-projects/Claude REPL.md:18 `apps/claude-repl` — historical (Status section: prior claude-repl codebase deleted, this note describes the deleted MVP)
- 30-projects/Claude REPL.md:19 `packages/claude-repl-protocol` — historical (same deleted MVP)
- 30-projects/Claude REPL.md:20 `services/claude-repl-backend` — historical (same deleted MVP)
- 30-projects/Claude REPL.md:47 `services/guided-repl-api` — aspirational (Status section: shipped on branch feature/repl-accounts-progress, PR pending — not yet in the checked-out main tree)

## Warnings
None

## Counts
- Notes: 39
- Links checked: 268
- Broken links: 0
- Orphans: 0
- Repo claim candidates: 18 (0 stale, 6 historical, 12 aspirational)
- Warnings: 0
