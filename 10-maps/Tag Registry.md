---
title: Tag Registry
aliases: [tag-vocabulary, tag-index]
tags: [meta, index]
type: index
status: developing
created: 2026-07-15
updated: 2026-07-23
related: [[Home MOC]]
---
# Tag Registry
> Purpose: the vault's controlled tag vocabulary. Tags are cross-cutting facets — use only tags listed here, in canonical form and the right facet. Add a tag here before inventing one. Never use a status value (seed / draft / developing / locked / evergreen) as a tag. The linter (tools/vault-lint.mjs) reads the two sections below: it treats every backticked token under "Canonical tags" as allowed, and each arrow line under "Deprecated tags" as a deprecated→canonical alias.

## Canonical tags (by facet)

**Structural** — what kind of note it is
`moc` `index` `inbox` `meta` `lint`

**Type echo** — kept for now, redundant with `type:`; prune later
`project`

**Domain / topic**
`llm` `architecture` `data` `analytics` `search` `infrastructure` `workflow` `principles` `collaboration` `orchestration` `capture` `cost` `marketing` `content` `story` `gtm` `growth` `monetization` `business` `strategy` `roadmap` `vision` `design` `curriculum` `finance` `personal` `home` `client`

**Project**
`choices` `claude-repl` `studio` `obsidian` `game`

**Doc-kind**
`planning` `feature-plan`

**Tech / tooling**
`aws` `serverless` `cloudfront` `waf` `websocket` `e2b` `react` `frontend` `backend` `protocol` `ui` `ux` `schema` `fixtures` `agents` `authoring-pipeline` `lesson-engine` `foundry` `guided-mode` `accounts` `payments` `simulator` `webapp` `pipeline` `skills` `claude-code`

## Deprecated tags (use the alias instead)
- `games` → `game`
- `ai` → `llm`

**Not a blanket alias:** the Claude REPL *project* notes were mistagged with the Claude-Code tooling tag and have been corrected per-note to `claude-repl`. The Claude-Code tag stays valid for genuine Claude Code tooling notes (Wake-on-Reset, Vault-Sync) — it is intentionally left out of the alias list above so those notes are not flagged.

## Notes
- Long-tail single-use tech tags are allowed for now; consolidate toward the head of each facet over time.
- evergreen is a status value, not a tag — the linter flags any note that uses it as a tag.
- Facets exist to stop one flat namespace from mixing project names, topics, doc-kinds, and tech. When adding a tag, put it under the facet it belongs to.
