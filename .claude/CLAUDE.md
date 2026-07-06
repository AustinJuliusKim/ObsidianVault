# CLAUDE.md — Obsidian Vault Conventions

This repo is an **Obsidian-backed knowledge vault**, not an application. It is a persistent, retrievable knowledge layer optimized for token savings and fast context. Treat notes as the product.

## Vault structure
```
00-inbox/         raw capture, unprocessed
10-maps/          MOCs / index notes  ← entry points (start here)
20-notes/         atomic evergreen notes (one idea each)
30-projects/      active project context & working docs
40-references/    source material, external docs, transcripts
50-templates/     note templates
90-archive/       inactive
```

## Filename convention
**Title Case, unique filenames** so wikilinks read naturally: `[[Model Routing Strategy]]`. Numeric folder prefixes stay as-is. No Zettelkasten timestamp IDs — meaningful titles + folders + MOCs do the organizing.

## Frontmatter schema
```yaml
---
title:
aliases: []
tags: []
type: note | moc | project | reference | inbox
status: seed | developing | evergreen
created:
updated:
related: []        # wikilinks to neighbors
source:            # reference notes only (optional)
---
```

## Linking rules
- Use `[[wikilinks]]`, linked by **exact title**.
- Every atomic note is linked from ≥ 1 MOC — **no orphans**.
- `related:` frontmatter = lateral links. **Tags** = cross-cutting facets. **Folders/MOCs** = hierarchy.

## Retrieval — READ THIS BEFORE LOADING VAULT CONTEXT
The token-savings engine is the retrieval protocol. **Do not scan the whole vault.**
- Enter at **`10-maps/Home MOC.md`** → follow links → load only the ≤ 5–7 atomic notes that match the task → stop.
- If unsure, read MOC link lists + frontmatter only, then choose what to open.
- Full details and the write protocol live in the **`wiki` skill** (`.claude/skills/wiki/SKILL.md`) — invoke it for any vault read/write task.

## Standing context
- For any **game design, feature, or copy work** (Choices or future games), always load `30-projects/Studio Design Constitution.md` — every product decision must pass its rubric, ethic, and kill tests.

## Guardrails
- Until the Obsidian MCP is active, **do not bulk-rename or delete linked notes** — wikilink backlinks break silently. Safe zones for automation: `00-inbox/`, raw dumps, new drafts.

## Model routing
Haiku → capture / search / data gathering · Sonnet → note writing / refactors · Opus → architecture / planning.
