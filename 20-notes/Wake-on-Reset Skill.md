---
title: Wake-on-Reset Skill
aliases: [wake-on-reset]
tags: [claude-code, skills, workflow, orchestration]
type: note
status: evergreen
created: 2026-07-12
updated: 2026-07-12
related: [[Vault-Sync Skill]], [[Model Routing Strategy]], [[Context Budgeting]]
---
# Wake-on-Reset Skill

A Claude Code skill that checkpoints all in-flight orchestration near the session usage limit and arms a one-shot session cron whose prompt is a complete, self-contained resume job for the next window reset. Proven across two usage windows on 2026-07-12 running the guided-repl Accounts/Foundry and choices Stage-A parallel builds: worker-per-worktree + 10-minute reviewer cron + completion gates survived two limit cutoffs with zero lost state.

**Install:** copy the fenced block below into `~/.claude/skills/wake-on-reset/SKILL.md` on any machine (user-global; available in every project). Local source of truth: that same path on the MacBook.

```markdown
---
name: wake-on-reset
description: Checkpoint all in-flight work near the session usage limit and arm a one-shot wake job that resumes implementation autonomously at the next window reset. Invoke when session usage is high (~85%+), when a usage-limit warning or "You've hit your session limit · resets H:MMpm" error appears, when the user says they're running low on usage, or when the user asks to prepare for the next window ("set an alarm for the reset", "add tasks for when we wake up", "let's not lose our place").
---

# wake-on-reset — checkpoint → arm → autonomous resume

Purpose: never lose orchestration state to a usage-limit cutoff. Near the limit, make everything durable, capture the user's intent + authorization ONCE, and arm a one-shot session cron whose prompt is a complete, self-contained resume job. Queued cron firings execute the moment the window resets, even if the limit hit first.

If invoked with args containing `dry-run`: perform Phase A step 1 (inventory) read-only, report what WOULD be checkpointed/armed, and stop. No questions, no writes, no cron.

## Phase A — Checkpoint (run immediately on invoke)

1. **Inventory** (parallel, read-only): `TaskList`; running background agents/monitors and their last reported state; `git worktree list` in the active repo(s); `gh pr list --state open` (plus recently merged PRs awaiting aftercare); any reviewer verdicts not yet relayed to workers.
2. **Durability sweep** — the limit can kill this session, and session-only crons die with it:
   - Every active worker's brief must exist as `BRIEF.md` at its worktree root. Scratchpad-only briefs get copied out now.
   - Write or update the handoff file `~/.claude/plans/<repo-slug>-handoff-<YYYY-MM-DD>.md` with: shipped-state summary; per-track state (commits on `main..`, PROGRESS.md/NOTES.md tails, the first incomplete task and its exact pick-up point); pending USER actions (merges, email confirmations, dashboard pastes, IAM applies); the orchestration recipe (below); completion gates + each PR's ops list; the armed cron's job id + fire time; and the line: "If this session died before the alarm fired: point a fresh session at this file and run the wake sequence manually."
3. **One AskUserQuestion** (never more), asking:
   - Task changes/additions for the wake job (offer the current unfinished set as the default).
   - Authorization level: **full-auto** (push branches + open PRs without asking) vs **ask-first**. Either way: MERGING is always reserved for the user; no direct cloud mutations while unattended (CI deploys on merge).
   Record the answer verbatim, with a timestamp, into the wake prompt's STANDING AUTHORIZATION block. Authorization is per-wake-job — never carry it forward implicitly to future windows.

## Phase B — Arm

4. **Reset time**: parse the most recent limit message ("resets H:MMpm TZ"); else last known reset + 5 hours. Schedule at reset+3 minutes, avoiding :00/:30. If genuinely unknown, ask the user rather than guessing.
5. **Compose the wake prompt** — fully self-contained (assume context may be compacted): absolute paths only; versioned (`[WAKE-ON-RESET vN: ...]`); when scope changes before firing, REPLACE the job (CronDelete + CronCreate), never stack multiple alarms. Structure:
   - **STANDING AUTHORIZATION block**: the user's recorded answer + timestamp + what remains reserved (merges, cloud mutations, credential-minting).
   - **Step 0 — status check**: health endpoints / PR states relevant to the work, plus a reminders-for-the-user list that MUST go in the first status message.
   - **Ordered tasks**: urgent user-visible aftercare first → user-requested items → long autonomous tracks last.
   - **Rig recipe** per long track: worktree off fresh `origin/main` (`git worktree add .claude/worktrees/<name> -b <branch> origin/main`); brief at `BRIEF.md` (from a Plan agent if none exists); ONE background general-purpose worker per track with hard rules: work only in its worktree, one commit per green task, append `PROGRESS.md` per task, deviations to `NOTES.md`, never push/PR/deploy, supervisor messages are authoritative, blocked >30 min → note it and move to the next independent task. Reviewer cron `4-59/10 * * * *` (session-only): each firing spawns a FRESH strong-model reviewer against BRIEF + authoritative specs with a track-specific checklist; relay corrections to the worker verbatim via SendMessage; post a one-line status to the user; skip cycles when a final acceptance review is already in flight.
   - **Completion gates** per track: full verification green → one final adversarial acceptance review (whole-branch, re-runs the verifications itself) → project-required doc sync (e.g. `/vault-sync`) → push/PR strictly per the recorded authorization → every PR body ends with an "Ops tasks" section (write "None" explicitly if empty).
   - **Keep the handoff file updated** as tracks progress.
6. `CronCreate` one-shot (`recurring: false`, minute/hour/day/month pinned). Record the job id in the handoff file.

## Phase C — Wake behavior (embed these rules in the wake prompt)

- If multiple queued firings arrive at once (session stalled at the limit), collapse them into ONE cycle — never run N redundant reviews.
- Workers killed by the limit retain their transcripts: resume them via `SendMessage` with an exact pick-up point quoted from their last message BEFORE spawning any replacement. Reconcile uncommitted worktree files against PROGRESS.md first.
- The first user-facing status message leads with the user's pending actions, then per-track state.

## Gotchas (all learned the hard way — do not relearn)

- **Session-only crons die with the CLI.** The handoff file is the recovery path; keep it current enough that a fresh session needs nothing else.
- **The auto-mode classifier blocks credential-minting and deploy-ish commands when unattended.** Don't retry or work around it: queue the exact command in the status message as a `! <command>` one-liner for the user to run live.
- **Entering plan mode halts background workers.** After exiting plan mode, resume each one via SendMessage.
- **Never trust PROGRESS.md claims** — reviewers and acceptance gates re-run the verifications themselves.
- **Appending to user-created env/config files**: the last line may lack a trailing newline; splice, don't blind-append.
- **Immutable-cached assets (pinned fixture dirs, versioned static content) must ship under a NEW version path** — in-place edits strand returning clients on year-long browser caches that no CDN invalidation can fix.
- Off-peak cron minutes (:x3, :x4) — never :00/:30.
```
