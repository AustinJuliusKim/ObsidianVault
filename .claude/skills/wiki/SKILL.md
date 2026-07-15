---
name: wiki
description: Retrieval + write protocol for this Obsidian knowledge vault. Invoke for ANY task that reads from or writes to the vault (answering from notes, saving knowledge, capturing to inbox, updating MOCs). Enforces MOC-first retrieval to save tokens and keeps the link graph intact.
---

# Wiki Skill — Vault Retrieval & Write Protocol

This vault is a token-efficient knowledge layer. The whole point is: **load a lean index, then a small subgraph — never load everything.** Follow these protocols exactly.

## Read path — tiered retrieval (loading context to answer a question)
Enter shallow, escalate only if needed. Most tasks resolve at Tier 1.

- **Tier 0 — Entry.** Open **`10-maps/Home MOC.md`**. The single entry point.
- **Tier 1 — MOC walk (DEFAULT).** From Home MOC pick the relevant domain MOC(s); follow exact-title wikilinks to a **small set (≤ 5–7)** of atomic notes that match the task; load only those; **stop**. If unsure which to open, read the MOC link lists + note frontmatter (`title`, `tags`, `type`, `status`) only, then decide.
- **Tier 2 — Scoped structural search (fallback).** If the MOC walk doesn't surface the right note — a cross-cutting or tag-based query, or an unclear domain — run a **bounded** search: restrict it to the single most-likely folder and match on **filenames / frontmatter (`title`, `aliases`, `tags`, `type`, `status`) / MOC link-lists / headings — never full note bodies**. Find the candidates, then load only those. This is the sanctioned substitute for scanning.
- **Tier 3 — Full-text content scan (LAST RESORT).** `grep`/read-all across note bodies **only** when the user explicitly asks for an exhaustive search, or Tier 2 genuinely can't locate it. Never start here — it is expensive and defeats the design.

Default budget: ≤ 5–7 atomic notes per task unless told otherwise.

### Large ("monster") docs
Some `30-projects/` docs are long working/log documents (e.g. Financial Freedom Profile, Choices Growth Plan). **Do not load them whole.**
1. Read the heading outline first (a cheap scan of that one file's `#` lines).
2. Load only the relevant section — `[[Doc Title#Section]]` in Obsidian, or `Read` with offset/limit in Claude Code.
3. Skip the doc's `## Decision log` unless the question is about *why* a past decision was made — that is cold provenance, not current state.

Keep H2/H3 headings stable + unique so `#Section` anchors stay durable (a heading rename is backlink-affecting).

## Write path (saving knowledge)
1. Write or update an **atomic note** in `20-notes/` (one idea per note) with full frontmatter (see `.claude/CLAUDE.md` schema). Use `50-templates/Atomic Note.md` as the base.
2. Add a `[[wikilink]]` to the new note from its **owning MOC** in `10-maps/` (create the MOC from `50-templates/MOC.md` if the domain has none yet).
3. Update the note's `related:` field with lateral links, and bump `updated:` on both the note and any MOC you touched.
4. **No orphans:** every atomic note must be reachable from ≥ 1 MOC.

## Capture (quick, unprocessed)
- Drop raw material in `00-inbox/` freely — this is a safe zone. Process it into an atomic note + MOC link later.

## MOC split discipline
Keep MOCs cheap to read. **Split a MOC when ANY of:** > ~15 wikilinks; a second level of nested bullets appears; or one sub-group reaches ~6–7 links. To split: create `10-maps/<Sub> MOC.md`, move that group's links into it, link parent → sub, and back-link sub → parent. A split moves link-lists only (not target notes), so it is backlink-safe and allowed pre-MCP.

## Tags — controlled vocabulary
Use only tags from **`10-maps/Tag Registry.md`**, in canonical form and the right facet. Add a tag to the registry before inventing one. Never use a `status` value (e.g. `evergreen`) as a tag. The linter warns on unknown tags, deprecated aliases, and status/tag collisions.

## Decisions & versions (keep provenance off the hot path)
Retrieval cost scales with body size; provenance value decays with age — so keep cold history out of the default load, not out of the vault.
- **Atomic notes are edited in place.** One idea at current best understanding, no internal changelog — git holds the history. A note that grows a log has outgrown "atomic": make it a hub + linked notes.
- **Project docs: hot/cold split.** Current state up top (the default load); superseded/routine decisions under a `## Decision log` that reads skip unless the query is about provenance. Extract a decision to its own atomic note only when it is cross-cutting or reused across projects.
- **Versions live in git, not inline.** For a `locked` spec keep the marker + a one-line `prev: <ver> (git / 90-archive)` pointer; move superseded prose to `90-archive/`. Don't carry prior-version text inline — git stores it losslessly.
- The linter nudges when a `type: note` exceeds ~500 words (split it) or a `type: project` exceeds ~2,500 (sweep history to the log / archive).

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
