# ObsidianVault

Personal Obsidian knowledge vault — MOC-indexed atomic notes, project plans, and the automation that keeps them flowing. Conventions live in [.claude/CLAUDE.md](.claude/CLAUDE.md); retrieval/write protocol in the [wiki skill](.claude/skills/wiki/SKILL.md).

## Harness pipeline — data flow

A claude.ai planning chat turns into vault docs, an Execution Harness, and gated implementation work with no local steps. Details: `20-notes/Harness Automation Pipeline.md`.

<!-- KEEP IN SYNC: update this diagram whenever a pipeline component changes
     (workflow, issue template, harness skill, routine prompt/schedule, or the
     pipeline note). Rule lives in .claude/CLAUDE.md. -->

```mermaid
flowchart TD
    subgraph Planning
        chat[claude.ai planning chat]
    end

    chat -->|"GitHub connector files issue<br>title 'Harness: Project', label 'harness'"| issue["Issue on this repo<br>(.github/ISSUE_TEMPLATE/harness.md)"]

    issue -->|labeled event, label == harness| action["GitHub Action<br>.github/workflows/harness-intake.yml"]
    action -->|POST fire endpoint<br>bearer token + anthropic-version| routine
    sweep[Daily sweep 7:30am PT] --> routine

    subgraph Cloud["Routine harness-intake (subscription-billed cloud session)"]
        routine[Session on vault repo] -->|wiki skill| plan[30-projects/ source plan doc]
        routine -->|harness skill, Generate ONLY| harness[30-projects/ Execution Harness doc]
    end

    plan --> pr[PR from claude/ branch]
    harness --> pr
    routine -. on failure .-> fail[Error comment on issue]
    pr -->|comment PR link,<br>label harness-processed| issue

    pr -->|human review + merge| main[Vault main]
    main -->|pull locally| local[Local vault]
    local -->|"/harness 'Project' run — one prompt<br>per invocation, human-gated"| impl[Implementation commits/PRs<br>in the projects repo]
```

Execution stays human-gated (generation only in the cloud) until harnesses consistently pass review — graduation path in `20-notes/Harness Automation Pipeline.md`.
