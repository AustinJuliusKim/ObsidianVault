---
name: wiki
description: Retrieval + write protocol for this Obsidian knowledge vault. Invoke for ANY task that reads from or writes to the vault (answering from notes, saving knowledge, capturing to inbox, updating MOCs). Enforces MOC-first retrieval to save tokens and keeps the link graph intact.
---

# Wiki Skill — Vault Retrieval & Write Protocol

This vault is a token-efficient knowledge layer. The whole point is: **load a lean index, then a small subgraph — never load everything.** Follow these protocols exactly.

## Read path (loading context to answer a question)
1. Open **`10-maps/Home MOC.md`** first. It is the single entry point.
2. From Home MOC, pick the relevant domain MOC(s) and open them.
3. Follow wikilinks to a **small set (≤ 5–7)** of atomic notes in `20-notes/` that match the task.
4. Load only those notes. **Stop.**
5. If unsure which to open, read the MOC link lists + note frontmatter (`title`, `tags`, `type`, `status`) only — then decide.
6. **Never full-text scan the vault** (`grep`/read-all across folders) unless the user explicitly asks for an exhaustive search — it is expensive and defeats the design.

Default budget: ≤ 5–7 atomic notes per task unless told otherwise.

## Write path (saving knowledge)
1. Write or update an **atomic note** in `20-notes/` (one idea per note) with full frontmatter (see `.claude/CLAUDE.md` schema). Use `50-templates/Atomic Note.md` as the base.
2. Add a `[[wikilink]]` to the new note from its **owning MOC** in `10-maps/` (create the MOC from `50-templates/MOC.md` if the domain has none yet).
3. Update the note's `related:` field with lateral links, and bump `updated:` on both the note and any MOC you touched.
4. **No orphans:** every atomic note must be reachable from ≥ 1 MOC.

## Capture (quick, unprocessed)
- Drop raw material in `00-inbox/` freely — this is a safe zone. Process it into an atomic note + MOC link later.

## Filename & link rules
- Title Case, unique filenames. Wikilinks match **exact title**.
- Before creating a link, confirm the target note exists (or create it). Do not leave dangling `[[links]]` in committed MOCs/notes — mark not-yet-written items in a clearly-labeled "Planned" section instead.

## Guardrails
- Until the Obsidian MCP is connected, **do not bulk-rename or delete linked notes** — backlinks break silently. Renames/deletes of linked notes are a manual, one-at-a-time, verify-backlinks operation.
- Safe zones for free automation: `00-inbox/`, raw dumps, new drafts in `20-notes/` not yet linked.

## Model routing
- **Haiku** — capture, search, data gathering, classification.
- **Sonnet** — note writing, refactors, MOC updates.
- **Opus** — architecture, planning, ambiguous problems.

## Why this saves tokens
MOC-first retrieval replaces "load everything" with "load a lean index → small subgraph." Atomic notes let you pull one idea, not a document. Frontmatter filters narrow retrieval before any content is read. Context written once is reused across projects, never re-explained.
