---
title: Vault-Sync Skill
aliases: [vault-sync]
tags: [claude-code, skills, workflow, obsidian]
type: note
status: evergreen
created: 2026-07-12
updated: 2026-07-12
related: [[Wake-on-Reset Skill]], [[Obsidian LLM Wiki]], [[Projects MOC]]
---
# Vault-Sync Skill

A repo-scoped Claude Code skill that maps a coding session's changes (`apps/`, `packages/`, `services/`) to the vault notes referencing them and updates only the claims those changes made stale — keeping `30-projects/` accurate to the code. It defers all vault-editing rules to the vault's own wiki protocol, adding only the code→note mapping.

**Install:** lives at `<repo>/.claude/skills/vault-sync/SKILL.md` (checked into the projects monorepo, so it travels with the repo). To reuse in another repo: copy the fenced block below and adjust the vault path and the area-prefix mapping in steps 2–3.

```markdown
---
name: vault-sync
description: Sync ObsidianVault project notes after code changes in apps/, packages/, or services/. Run before shipping or opening a PR when this session changed those areas, so the vault's 30-projects/ notes stay accurate to the code.
---

# vault-sync — update the ObsidianVault wiki after code changes

The vault at `/Users/aukim/personal/ObsidianVault/` documents this monorepo's projects in `30-projects/`, including concrete claims about code (paths, function names, status lines). This skill maps the session's code changes to the notes that reference them and updates those notes. It adds ONLY the code→note mapping below; all vault-editing rules come from the vault itself.

## 1. Read the vault's protocol first

Read `/Users/aukim/personal/ObsidianVault/.claude/skills/wiki/SKILL.md` and `/Users/aukim/personal/ObsidianVault/.claude/CLAUDE.md`. Their write protocol, frontmatter schema, and guardrails govern every vault edit this skill makes. Do not restate or override them.

## 2. Determine what this session changed

Collect changed files as the union of:

```sh
git diff --name-only $(git merge-base HEAD origin/main 2>/dev/null || git merge-base HEAD main)
git diff --name-only HEAD
git ls-files --others --exclude-standard
```

Reduce to distinct area prefixes matching `^(apps|packages|services)/[^/]+`. If the set is empty, report "no syncable changes" and stop.

## 3. Map changed areas to vault notes

- Open `10-maps/Projects MOC.md` for the project index.
- For each area, `grep -l` across `30-projects/` only (bounded scan — this is the sanctioned exception to the vault's no-full-scan rule) for BOTH:
  - the full area path (e.g. `apps/guided-repl`), and
  - its leaf name (e.g. `guided-repl`) — catches brace-group references like `projects/{apps/guided-repl, ...}`.

## 4. Update the matched notes

- Compare each note's claims (paths, function/table names, Status sections, "Next:" lists) against what this session actually changed.
- Correct only claims made stale **by this session's changes**. Append to Status/log sections rather than rewriting history; bump `updated:`.
- A new decision worth recording goes through the wiki skill's write path (atomic note in `20-notes/` + owning-MOC link + `related:`), never an ad-hoc file.
- Never rename or delete notes. Never leave dangling wikilinks — not-yet-written targets go in a labeled "Planned" section.

## 5. Commit the vault

```sh
git -C /Users/aukim/personal/ObsidianVault add <only the files this skill touched>
git -C /Users/aukim/personal/ObsidianVault commit -m "vault-sync: <area summary> (projects@$(git rev-parse --short HEAD))"
```

Do not push unless asked. If the vault worktree has unrelated dirty files, leave them alone.

## 6. Report

Tell the user which notes were updated and why — or that there was nothing to sync.
```
