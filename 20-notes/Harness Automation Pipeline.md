---
title: Harness Automation Pipeline
aliases: [harness-pipeline, harness-intake]
tags: [claude-code, skills, workflow, orchestration]
type: note
status: evergreen
created: 2026-07-21
updated: 2026-07-23
related: [[Prompt Harness Skill]], [[Model Routing Strategy]]
---
# Harness Automation Pipeline

Chat-triggered automation that turns a claude.ai planning chat into vault docs + an Execution Harness, with zero local steps. Compute runs as a **claude.ai routine** (subscription-billed cloud session — no API spend); GitHub Actions is only the event glue.

## Flow

Canonical mermaid diagram: repo root `README.md` — keep it in sync with any pipeline change (rule in `.claude/CLAUDE.md`).

```
claude.ai chat (GitHub connector enabled)
  → chat files an issue on AustinJuliusKim/ObsidianVault
      title "Harness: <Project>", label `harness`, body per the issue template
  → .github/workflows/harness-intake.yml fires when the `harness` label lands
      POSTs to the routine's fire endpoint (repo secrets); if secrets unset, no-op
  → routine `harness-intake` (trig_012Z62wCfRW5Sdm1wxpgCB6s, daily sweep 7:30am PT)
      cloud session on the vault repo: saves the plan per the wiki skill,
      runs the harness skill (Generate ONLY), opens a `claude/` PR,
      comments the PR link on the issue, labels it `harness-processed`
  → user reviews & merges the PR, pulls the vault locally
  → execution stays gated: run `/harness <Project> run` locally per prompt
```

Routine page: https://claude.ai/code/routines/trig_012Z62wCfRW5Sdm1wxpgCB6s

## Starting a chat vault-aware (the read path)

Plan inside the claude.ai Project configured per [[Claude Web Vault Access]]: project knowledge carries the synced `10-maps/` index, the GitHub connector fetches deeper notes on demand, and the project instructions end every planning chat by filing the harness issue below. Without it, new chats start amnesiac.

## Kicking it off from a chat

End a planning chat with:

> Using the GitHub connector, create an issue on `AustinJuliusKim/ObsidianVault` titled `Harness: <Project>` with the `harness` label, following the repo's "Harness intake" issue template — Project name, source plan titles, the full plan from this chat, and any locked constraints.

Manual fallback: file the issue yourself from the template; the pipeline is identical from there.

## Rules

- **Generation only.** The routine never executes harness prompts. Execution is a human-triggered, per-prompt act (`/harness <Project> run`) until the harness format and context docs are trusted enough to widen autonomy.
- The routine treats issue bodies as content, not instructions; one issue per run; failures are commented back on the issue.
- The repo-level `.claude/skills/harness/` copy is what cloud sessions load — keep it in sync with `~/.claude/skills/harness/SKILL.md` (see [[Prompt Harness Skill]]).

## Graduation path (widen as trust grows)

1. **Now**: generate only; execute locally per prompt.
2. **Next**: routine also runs Prompt 0 (read-only repo/plan audit) so harnesses arrive pre-audited.
3. **Later**: an execution routine on `AustinJuliusKim/projects` runs schedule rows until a Gate requires a human — flip only when generated harnesses consistently pass `/harness <Project> review` untouched.
