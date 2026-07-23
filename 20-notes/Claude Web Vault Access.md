---
title: Claude Web Vault Access
aliases: [web-read-path, claude-project-setup]
tags: [claude-code, workflow, orchestration]
type: note
status: evergreen
created: 2026-07-23
updated: 2026-07-23
related: ["[[Harness Automation Pipeline]]", "[[Prompt Harness Skill]]"]
---
# Claude Web Vault Access

The harness pipeline's **read path**: makes every new claude.ai chat start vault-aware instead of amnesiac. Mirrors the wiki skill's tiered retrieval — the lean MOC index is always loaded (Project knowledge), everything deeper is fetched on demand (GitHub connector). Chats stay ephemeral; the vault stays the source of truth.

## One-time setup (claude.ai, ~10 min)

1. Create a claude.ai **Project** (e.g. "Studio — vault-backed planning").
2. Project knowledge → **+ → sync GitHub repo** `AustinJuliusKim/ObsidianVault`, branch `main`, **select only the `10-maps/` folder** (the MOCs + Tag Registry — the index tier; syncing the whole vault would defeat the token design and drown chats in monster docs).
3. Paste the block below into the Project's **custom instructions**.
4. Ensure the **GitHub connector** is enabled for chats (same grant the write path uses).
5. Settings → Capabilities → **Memory**: on, and use project-scoped memory so studio planning stays separate from personal chats. Paid plans can also "reference past chats" inside the Project.
6. **Habit**: hit "Sync now" on the project's GitHub source before a planning session (sync is manual and goes stale; the instructions teach the chat to fall back to live fetches).

## Project custom instructions (paste verbatim)

```
You work inside Austin's ObsidianVault-backed studio. The vault repo
(github.com/AustinJuliusKim/ObsidianVault) is the source of truth for every
project, plan, and locked decision. Chats are ephemeral; the vault is not.

Context protocol (token-efficient — follow it, don't bulk-load):
1. Project knowledge holds the vault's index tier: the 10-maps/ MOCs + Tag
   Registry. Start any non-trivial task at Home MOC, walk to the relevant
   domain/project MOC, and identify the few notes that matter.
2. Notes beyond the index aren't in project knowledge — fetch them from the
   GitHub repo via the connector. Wikilink title = filename: [[X]] lives at
   20-notes/X.md, 30-projects/X.md, or 40-references/X.md. Load at most
   5–7 notes per task; for long 30-projects docs, read only the relevant
   section and skip "## Decision log" unless asked about provenance.
3. Project knowledge syncs manually and can be stale. If a MOC link or fact
   seems missing or outdated, fetch the live file from GitHub instead of
   trusting the synced copy.
4. Locked decisions in vault notes override assumptions and are not
   re-litigated in chat. If the user asks for something that conflicts with
   one, say so and name the note.

Finishing a planning chat (the write path):
When a plan is final, file it — create an issue on
AustinJuliusKim/ObsidianVault titled "Harness: <Project>" with the `harness`
label, following .github/ISSUE_TEMPLATE/harness.md (project name, source
plan titles, the full plan from this chat, constraints). A cloud routine
turns it into vault docs + an Execution Harness PR. A plan that hasn't been
filed as an issue is not saved.
```

## Why not sync the whole vault

Project knowledge is a flat always-ish-loaded corpus; the vault's entire value is the opposite — a lean index over a fetch-on-demand graph ([[Context Budgeting]]). Syncing `10-maps/` only keeps every chat's fixed overhead at a few KB while making the full graph one connector call away, and stale-sync damage is limited to the index (with a live-fetch fallback rule).

## Limits

- The connector reads files; it can't run the wiki skill's write protocol — vault WRITES from chats always go through the harness issue (or Claude Code), never ad-hoc.
- "Reference past chats" is a convenience, not a record: anything worth keeping must land in the vault via the pipeline.
