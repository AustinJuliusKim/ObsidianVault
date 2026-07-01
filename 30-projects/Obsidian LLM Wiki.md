---
title: Obsidian LLM Wiki
aliases: [Obsidian-Backed LLM Wiki, Master Plan]
tags: [project, llm, meta]
type: project
status: developing
created: 2026-06-25
updated: 2026-07-01
related: [[Home MOC]]
---
# Obsidian-Backed LLM Wiki — Master Plan

**Status:** v1.1 — Phases 0–2 + 4 built (structure, wiki skill, first domain seeded). MCP install pending (manual).
**Surface:** Claude Code (CLI/IDE) · **Scope:** Mixed knowledge base · **Vault:** Greenfield (none yet)
**Goal:** A curated Obsidian vault as a persistent, retrievable knowledge layer — optimized for *token savings*, *fast context*, and *supercharging future projects*.
**Model routing:** Opus → architecture/planning · Sonnet → note writing & refactors · Haiku → capture, search, data gathering.

---

## Recommended Architecture
A 3-layer stack, added in order. You can stop after Layer 2 and already have a working system.

1. **Storage layer — git-backed Markdown folder.** The vault is a plain folder of `.md` files under version control. Obsidian is just the human-facing viewer (graph, backlinks). If Obsidian ever disappears, the notes still work anywhere.
2. **Access layer — Claude Code direct file access.** Already native. Claude reads/writes the vault folder as Markdown. No server required to start.
3. **Intelligence layer — the "wiki skill" (`.claude/`).** A `CLAUDE.md` + SKILL that encodes vault conventions and the *retrieval protocol*. **This is the actual token-savings engine.**
4. *(Optional, later)* **Link-integrity layer — Obsidian MCP.** Add `iansinnott/obsidian-claude-code-mcp` when the vault is big enough that backlink safety and graph-aware search matter.

---

## Integration Tooling (all current, all community-maintained — no official Obsidian MCP)
| Option | Mechanism | Best for | Notes / tradeoffs |
|---|---|---|---|
| **Direct file access** | Claude Code reads vault folder | Default / start here | Simplest; **won't fix wikilinks on rename/delete** — can break backlinks |
| **`iansinnott/obsidian-claude-code-mcp`** | Obsidian plugin → MCP over WebSocket (auto-discovers vault, default port 22360) | Claude-Code-native link-aware ops | Requires Obsidian running; purpose-built for Claude Code |
| **`MarkusPfundstein/mcp-obsidian`** | MCP → Local REST API plugin (`coddingtonbear/obsidian-local-rest-api`); run via `uvx` | Search + patch/append workflows | Needs REST API plugin + API key; more setup |
| **`obsidian-mcp` (npm)** | `npx -y obsidian-mcp`, vault path in env | Quick generic vault access | Generic; verify recency before adopting |

> Guardrail: until an MCP is in place, **do not let Claude bulk-rename or delete linked notes** — backlinks can break silently. Safe zones for early automation: inbox, raw dumps, new drafts.

---

## Vault Structure (mixed KB — hybrid MOC + atomic)
```
vault/
  .claude/          # CLAUDE.md + wiki skill (conventions + retrieval protocol)
  00-inbox/         # raw capture, unprocessed
  10-maps/          # MOCs / index notes  ← Claude's entry points
  20-notes/         # atomic evergreen notes (one idea each)
  30-projects/      # active project context & working docs
  40-references/    # source material, external docs, transcripts
  50-templates/     # note templates
  90-archive/       # inactive
.gitignore          # ignore .obsidian/workspace*, cache, OS junk
```

## Frontmatter Schema (enables precise retrieval)
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
---
```

## Retrieval Protocol — the token-savings core
**Read path (loading context):**
1. Read the relevant **MOC(s)** in `10-maps/` first — never scan the whole vault.
2. Follow links to a small set (≤ N) of atomic notes matching the task.
3. Load only those notes. Stop. (Lean index in → small subgraph out.)

**Write path (saving knowledge):**
1. Write/update an atomic note in `20-notes/` with full frontmatter.
2. Add a wikilink from the owning MOC.
3. Update `related:` and `updated:` fields.

---

## Phased Roadmap

### Phase 0 — Foundations & setup
- Install Obsidian; create the vault folder; `git init` + remote; add `.gitignore`.
- Confirm Claude Code can read/write the vault path.
- Decision: MCP now vs later (see Open Decisions).

### Phase 1 — Architecture & conventions (SPEC)

**Filename convention** *(pending final choice)*: Title Case unique filenames (recommended — wikilinks read naturally: `[[Token Budgeting]]`) vs kebab-case (`token-budgeting.md`, CLI-friendly). Numeric-prefixed folders stay as-is regardless.

**No Zettelkasten timestamp IDs** — meaningful titles + folders + MOCs do the organizing; numeric IDs add friction for an AI-driven vault. (Reversible later.)

**Frontmatter (final):** schema as defined above, plus optional `source:` on reference notes.

**MOC design:**
- One **Home MOC** at the root of `10-maps/` — Claude's single entry point, links to all domain MOCs.
- One MOC per domain/theme (e.g., `LLM Engineering MOC`, `Personal Ops MOC`).
- MOCs stay lean: a purpose line + grouped wikilinks with a 1-line note each, plus links to sub-MOCs. Reading one must be cheap.

**Linking rules:**
- Use `[[wikilinks]]`, linked by exact title.
- Every atomic note is linked from ≥ 1 MOC (no orphans).
- `related:` frontmatter for lateral links; **tags** for cross-cutting facets, **folders/MOCs** for hierarchy.

**Retrieval protocol (concrete):**
- Always enter at **Home MOC**.
- Default budget: load ≤ 5–7 atomic notes per task unless told otherwise.
- If unsure, read MOC link lists + frontmatter only, then choose what to open.
- Never full-text scan the vault unless explicitly asked (expensive).

**Templates:**

*Atomic note*
```markdown
---
title: <Title>
aliases: []
tags: []
type: note
status: seed
created: {{date}}
updated: {{date}}
related: []
---
# <Title>
<One-paragraph core idea.>

## Details

## Links
- Part of: [[<MOC>]]
```

*MOC*
```markdown
---
title: <Domain> MOC
tags: [moc]
type: moc
status: developing
created: {{date}}
updated: {{date}}
---
# <Domain> MOC
> Purpose: <one line>

## Core notes
- [[ ]] — 

## Sub-maps
- [[ ]]
```

*Project*
```markdown
---
title: <Project>
tags: [project]
type: project
status: developing
created: {{date}}
updated: {{date}}
related: []
---
# <Project>
## Goal
## Key context
- [[ ]]
## Decisions
## Next actions
```

### Phase 2 — The wiki skill (`.claude/`)
- Author `CLAUDE.md` + SKILL encoding: structure, schema, **read protocol**, **write protocol**, guardrails.
- This is what converts "a folder of notes" into a token-efficient knowledge layer.

### Phase 3 — Integration layer
- Confirm direct-file workflow end-to-end.
- *(Optional)* install `iansinnott/obsidian-claude-code-mcp`; verify `/mcp` connection; enable backlink-safe edits.

### Phase 4 — Seeding & capture workflows
- Inbox → process → atomic note → MOC link.
- **Chat-to-note pipeline:** turn planning docs / chat outputs into vault notes (plugs into the "always save as planning doc" workflow).
- Apply model routing: Haiku capture/search · Sonnet note-writing/refactor · Opus architecture.

### Phase 5 — Scale & maintenance
- Link hygiene, orphan detection, dedup, periodic MOC review.
- Git remote backup; multi-project reuse pattern.

---

## Token-Savings Mechanisms (why this works)
- **MOC-first retrieval** replaces "load everything" with "load a lean index, then a small subgraph."
- **Atomic notes** mean Claude pulls only the relevant idea, not a whole document.
- **Frontmatter filtering** narrows retrieval before any content is read.
- **Reuse across projects** — context written once, referenced many times, never re-explained.

---

## Worked Example — LLM Engineering domain (Title Case)

**`10-maps/LLM Engineering MOC.md`**
```markdown
---
title: LLM Engineering MOC
tags: [moc]
type: moc
status: developing
created: 2026-06-25
updated: 2026-06-25
---
# LLM Engineering MOC
> Purpose: entry point for everything about building with LLMs.

## Principles & workflow
- [[LLM Collaboration Rules]] — 5 rules for effective agent partnership (Karpathy 4 + 1)
- [[Model Routing Strategy]] — Opus / Sonnet / Haiku by task

## Prompting
- [[Prompt Structure Patterns]] — XML tags, few-shot, role framing
- [[Context Budgeting]] — keeping token use lean

## Evaluation
- [[Eval Harness Basics]] — measuring prompt changes

## Sub-maps
- [[MCP & Tooling MOC]]
```

**`20-notes/Model Routing Strategy.md`**
```markdown
---
title: Model Routing Strategy
aliases: [model selection]
tags: [llm, cost]
type: note
status: evergreen
created: 2026-06-25
updated: 2026-06-25
related: [[Context Budgeting]]
---
# Model Routing Strategy
Match model tier to task to control cost and latency.

## Details
- Opus → architecture, planning, ambiguous problems
- Sonnet → code changes, note writing, refactors
- Haiku → search, capture, data gathering, classification

## Links
- Part of: [[LLM Engineering MOC]]
```

**Token walkthrough (a live session):**
You ask *"how should I split work across models?"* → Claude opens **Home MOC** → sees **LLM Engineering MOC** → opens it → pulls just **Model Routing Strategy** → answers. Two small notes loaded instead of the whole vault — that's the saving.

---

## Built Content (Phase 4 kickoff)

**LLM Collaboration Rules** (`20-notes/LLM Collaboration Rules.md`)
- Consolidated note: Karpathy's 4 rules + 1 custom rule about proactive partnership
- Linked from `10-maps/LLM Engineering MOC.md`
- Ready to seed vault in Phase 0

---

## Open Decisions
- *(Later)* Solo vs shared vault; git remote host.

## Decision Log
- **Surface:** Claude Code (CLI/IDE) — locked.
- **Scope:** Mixed knowledge base — locked.
- **Vault state:** Greenfield — locked.
- **Stack:** git folder + direct access + wiki skill; MCP optional/later — locked.
- **Structure:** Hybrid MOC + atomic notes — locked.
- **MCP timing:** Start lean, add `iansinnott/obsidian-claude-code-mcp` later — locked.
- **Filenames:** Title Case — locked.
- **First MOC:** LLM Engineering — locked.

---

## Build Log (2026-07-01)
Executed via Claude Code. Direct-file workflow confirmed end-to-end (Phase 3 baseline).
- **Phase 0:** folder skeleton (`00-inbox 10-maps 20-notes 30-projects 40-references 50-templates 90-archive`, each with `.gitkeep`); `.gitignore`; deleted `Welcome.md`; moved this plan → `30-projects/Obsidian LLM Wiki.md`.
- **Phase 1:** templates `50-templates/{Atomic Note, MOC, Project}.md`.
- **Phase 2:** wiki skill — `.claude/CLAUDE.md` (conventions) + `.claude/skills/wiki/SKILL.md` (retrieval + write protocol).
- **Phase 4:** seeded `10-maps/Home MOC.md`, `10-maps/LLM Engineering MOC.md`, `20-notes/Model Routing Strategy.md`, `20-notes/LLM Collaboration Rules.md`. Not-yet-written topics kept in "Planned" sections (no dangling links).

## MCP Setup — Phase 3 (manual, do in Obsidian)
Direct file access already works; MCP adds backlink-safe, link-aware edits. The plugin can only be installed from Obsidian's UI.
1. Obsidian → **Settings → Community plugins → Browse** → install **"Claude Code"** (`iansinnott/obsidian-claude-code-mcp`) → **Enable**. Default port **22360**.
2. In this repo run `claude` → `/ide` → select **Obsidian**. Connects automatically over WebSocket (no `.mcp.json` needed).
3. Verify with `/mcp` (Obsidian server shows connected).
4. Once connected, the "no bulk rename/delete of linked notes" guardrail can relax — the MCP keeps backlinks intact.

## Maintenance — Phase 5 (periodic)
- **Orphan detection:** every `20-notes/*` note should be linked from ≥ 1 MOC.
- **Link hygiene:** no dangling `[[wikilinks]]`; promote "Planned" items to real notes as they're written.
- **Dedup:** merge overlapping atomic notes; keep one idea per note.
- **MOC review:** keep MOCs lean (purpose line + grouped links); split into sub-MOCs when they grow.
- **Backup:** push to the git remote (`origin`, personal creds already configured).