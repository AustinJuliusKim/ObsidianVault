---
title: Claude REPL Lesson Plan
aliases: [claude-repl-lessons]
tags: [project, claude-repl, curriculum, guided-mode]
type: project
status: locked
created: 2026-07-02
updated: 2026-07-02
related: [[Claude REPL]], [[Claude REPL Business Plan]], [[LLM Collaboration Rules]], [[Model Routing Strategy]], [[Context Budgeting]]
---
# Claude REPL — Lesson Plan (v1.0 · LOCKED)

**Design thesis:** the giants teach *about* agentic coding (video, text, quizzes) or assume a working install; Guided mode puts hands on the real event stream with zero setup. We teach the same convergent primitives — but *show the counterfactuals*.

## Locked decisions
- **Spine v1.1 approved** (agentic-loop lesson inserted as 2; sessions/`--resume` merged into 8). Business plan amended to match.
- **Lesson 1 artifact: tiny web page** — single-file HTML/CSS personal page. Instantly visual in the workspace pane, diff-friendly, shareable.
- **One artifact, eight lessons:** the same page evolves through the whole spine (L3 restyles it via the prompt ladder, L6 plants a bug in it, L7 gives it a CLAUDE.md, L8 re-runs a change on different models). Narrative continuity + fixture reuse + smaller seeding surface. Modularity preserved: every lesson boots from a seeded FS snapshot, so learners can jump in anywhere.
- **~5 min per lesson, tight.** Full free spine ≈ 40 minutes — highly completable (feeds the guided-completion proof gate).

## 5-minute design constraints
- **Compressed replay pacing:** fixtures play back faster than real time (skip tool-wait longueurs); pacing metadata lives in the fixture format.
- **≤3 branches and exactly one auto-grade assertion per lesson.**
- L6's planted bug must be catchable inside the budget (visible in the diff pane, not buried).

## What the giants teach (researched 2026-07-02)
- **Anthropic Academy** (free, Skilljar, launched 2026-03-02; 17 courses): Claude Code 101 built around the agentic loop (Explore → Plan → Code → Commit); Claude Code in Action (`/init`, CLAUDE.md, @mentions, plan/thinking modes, custom commands, MCP, hooks, GitHub); Agent Skills; Subagents; certificates. Video + quiz; hands-on assumes own install + API key.
- **OpenAI / Codex:** Academy Codex track + hands-on Codex 102 workshops; agent-vs-autocomplete mental model, sandboxed execution, scoped tasks with a verification step ("vague goals are unreliable — split them"), AGENTS.md, review-before-accept as non-negotiable, MCP.
- **Codecademy (AI-Assisted Dev, Codex CLI):** spec-driven development, TDD, context engineering — "beyond vibe coding"; interactive + project + cert. Proves the paid interactive format.
- **Educative (Mastering Codex):** text-interactive, project-based (Flask app built entirely through prompts); AGENTS.md, Skills/Automations, MCP.
- **Microsoft — GenAI for Beginners (21 lessons):** model fundamentals first (LLMs, tokens, limits) → prompt engineering → advanced prompting → building apps. Transferable primitive: *mental model before prompting*.
- **Karpathy:** vibe-coding framing; keep the agent on a leash — small verifiable chunks; review everything. Codified in [[LLM Collaboration Rules]] (+ Rule 5: proactive partnership).
- **LangChain / LlamaIndex:** agent architecture, RAG, evaluation. Transferable primitive: *context is everything*.

**Convergent primitives:** (A) agentic-loop mental model · (B) scoped tasks + verification criteria · (C) prompt specificity ladder · (D) context files (CLAUDE.md/AGENTS.md) · (E) permission control & sandboxing · (F) diffs / review-before-accept · (G) iteration & recovery · (H) token/cost/model awareness.

## Design principles
1. **Magic first, theory as annotation.** Output in lesson 1; concepts ride the stream as callouts. Theory-first suits API builders, not tool-directors.
2. **Counterfactual branches are the pedagogy.** Same task, different prompt/setting → curated outcomes compared side by side. No live course can do this deterministically.
3. **One auto-grade assertion per lesson,** authored against the known fixture stream.
4. **One concept per lesson; 5 minutes;** each ends one step closer to the graduation moment.
5. **The leash is a through-line** — small scoped tasks, verify, review — woven in, never a sermon.

## Guided spine v1.1 (locked)
| # | Lesson | Primitive | Branches / assertion | Lineage |
|---|---|---|---|---|
| 1 | **Ship a page in 90 seconds** — filled-in prompt; watch explore→plan→edit→verify; end with a live personal page | hook + implicit A | golden path; assert: run completed + diff pane opened | Codecademy output-first; Anthropic First Hour |
| 2 | **Why did it do that?** — L1's stream replayed step-through with annotations: which tool, why, what entered context | A | step-through beats; assert: identify the plan step | Anthropic CC 101 loop; Codex agent-vs-autocomplete |
| 3 | **The prompt ladder** — restyle the page: vague → constrained → planned; compare diffs | C + B | 3 branches; assert: rank outcomes & justify | all giants; our signature lesson |
| 4 | **Plan mode & prompt planning** — request a plan, edit it, approve, watch execution follow | B | approve vs revise; assert: revised before approving | Anthropic plan mode; Codecademy spec-driven |
| 5 | **Permission modes & the leash** — plan / acceptEdits / bypass on the same change; interactive approve/deny | E | 3 mode branches via permissionBridge fixtures; assert: deny the risky edit | CC permission modes; Karpathy leash; sandbox story |
| 6 | **Reading diffs & verifying** — review changes to the page; one branch plants a visible bug; run the check | F + B | clean vs planted-bug; assert: catch the bug | Codex review-non-negotiable; Codecademy TDD |
| 7 | **CLAUDE.md — teaching your agent** — same prompt with vs without a conventions file for the page | D | before/after; assert: attribute the behavior change | Anthropic `/init`; Codex AGENTS.md |
| 8 | **Cost, models & going live** — token meter on; same change on Haiku vs Sonnet; `--resume` continuity; graduation ramp | H + G | model branches; assert: pick routing for a given task | MS tokens; [[Model Routing Strategy]]; wallet conversion |

## Advanced track (paid — validated)
MCP servers · Skills/SKILL.md authoring · Hooks · Subagents · [[Model Routing Strategy]] deep-dive · [[Context Budgeting]] · Headless/CI (`claude -p`) · Testing loops · Monorepos. Validation: Anthropic Academy's own developer path runs CC 101 → in Action → Agent Skills → Subagents → MCP; Codex mirrors with AGENTS.md → Skills/Automations → MCP.

## Competitor map
| Competitor | Format | Tool | Price | Gap we exploit |
|---|---|---|---|---|
| Anthropic Academy (17 courses, certs) | video + quiz | Claude Code | free | passive; hands-on requires own install + API key |
| claude.ai/code (Claude Code on the web) | real tool, browser | Claude Code | subscription | tool without pedagogy; paywalled; no guided path |
| Coursera "Claude Code in Action" (Anthropic) | video course | Claude Code | free/sub | same passivity |
| Codecademy AI-Assisted Dev | interactive + project + cert | Codex CLI | subscription | Codex-centric; not the real agent event stream |
| Educative Mastering Codex | text-interactive, project | Codex | subscription | Codex-centric; text sandbox |
| OpenAI Academy / Codex 102 | resources + live workshops | Codex | free | scheduled; not self-serve interactive |
| freeCodeCamp Codex Essentials | 5-hr video | Codex | free | passive |
| claudeplayground.in | interactive API field guide | Claude API | free | API-building, not agent-directing |

**Positioning line:** *Academy teaches you about Claude Code. We put your hands on it — before you install anything, pay for anything, or create an account.*
**Platform-risk note:** claude.ai/code erodes "no install" as a moat → the moat is pedagogy (branches, assertions, graduation arc), zero-auth entry, BYOK/wallet granularity vs subscription.

## Next step
Author **Lesson 1's full script** as the template for the other seven: exact prompt text, fixture branch specs, annotation copy, assertion definition, FS snapshots. Content authoring → then Phase A seeding runs.

## Changelog
- **v1.1** (2026-07-09) — L6 and L8 absorb woven `TerminalDrill` micro-moments (first self-typed command; `git diff` + commit) per [[Claude REPL Lesson Engine Spec]]; specifics set during Lesson 1 script authoring.
- **v1.0** (2026-07-02) — LOCKED. Spine v1.1 approved; lesson 1 = tiny web page; one-artifact-through-eight thread with snapshot modularity; 5-min budget with pacing/branch constraints. Business plan spine amended to match.
- **v0.1** (2026-07-02) — Giants research; convergent primitives; spine v1.1 proposal; competitor map incl. claude.ai/code finding.
