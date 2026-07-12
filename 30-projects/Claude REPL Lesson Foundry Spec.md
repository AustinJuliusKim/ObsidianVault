---
title: Claude REPL Lesson Foundry Spec
aliases: [claude-repl-foundry]
tags: [project, claude-repl, foundry, agents, authoring-pipeline]
type: project
status: locked
created: 2026-07-11
updated: 2026-07-11
related: [[Claude REPL]], [[Claude REPL Lesson Engine Spec]], [[Claude REPL Lesson Plan]], [[Claude REPL Business Plan]], [[Model Routing Strategy]]
---
# Claude REPL — Lesson Foundry Spec (v1.3 · LOCKED)

**Purpose:** an admin-facing agentic pipeline that watches the AI-education landscape (RAG, MCP, prompt authoring, model usage, open-source/local LLMs, agentic coding), proposes lesson topics on a configurable cadence, and drafts publish-ready lesson YAML from an idea prompt — grounded, validated, delivered as PRs.

## Locked decisions
- **Autonomy:** cadenced **auto-draft → review queue**; publish stays human (PR merge). Never full-auto publish.
- **Substrate:** **GitHub Actions cron** — repo-native, zero infra, PRs as artifacts. Seeding runs call E2B.
- **v1 scope: both features, one spine.** Build order inside "both": shared spine first (author → validate/seed → PR → review queue) → **idea box = thin ad-hoc trigger** → **radar = second trigger** (scout + cron + cards).
- **Auto-draft guardrails:** hard per-run budget cap (default: top-3 radar topics per cadence); **overlap gate mandatory**. **Default cadence: monthly (~$10/mo), dial toward weekly post-launch** as review bandwidth and demand justify.
- **Registry starts small: 3–5 sources** (suggested: Claude Code release notes, Anthropic Academy catalog, MCP spec repo, microsoft/generative-ai-for-beginners commits, Hugging Face blog). Sources are permanent maintenance surface — add slowly, prune rarely.
- **Model Lab decisions:** bench runner chosen at build time (promptfoo vs thin custom). **Author default = `claude-fable-5`** — premium model on the lowest-frequency, highest-leverage role fits the routing philosophy (scouts are frequent+cheap; author runs are top-3 per cadence + ad-hoc). **Bench trigger = new model releases**: add Anthropic model announcements to the source registry so the scout's radar flags "new model → run `foundry bench`" — the Foundry watches its own model landscape.

## Architecture thesis: agentic research, not vector RAG
- Classic RAG fits many-users / runtime / big-slow corpus. The Foundry is one admin, authoring-time, freshness-critical — **agents fetch sources fresh at generation time and context-stuff them**; a per-lesson source pack fits in a modern context window.
- **Retrieval scoped to self-knowledge only:** embedding/keyword index over our own lesson corpus for novelty/overlap and "which lesson covers X." (Same scoping discipline as Choices' RAG → Fill-my-4 only.)
- **Source-notes store** (markdown scout summaries in-repo, searchable) accumulates institutional memory without re-crawling. RAG-lite over owned notes, nothing more.

## Pipeline (six stages)
1. **Source registry** (`foundry/sources.yaml`): watched sources w/ per-source cadence + method. **Feeds and git over scraping.**
2. **Scout** (cadenced, Haiku): per-source delta since last run → summarize → score novelty vs lesson index → **Topic Radar** entries `{topic, whyNow, sources[], overlapScore, suggestedTrack}`.
3. **Auto-draft gate:** top-N radar topics passing the overlap gate proceed within budget; admin can also hand-pick.
4. **Author** (Opus-tier): topic + freshly fetched primary sources + Lesson Engine schema + design principles (5-min, ≤3 branches, one assertion, counterfactual pedagogy) + **Lesson 1 YAML as few-shot exemplar** → draft lesson YAML (outline, branches, annotation copy w/ semantic anchors, quiz, assertion). The **idea box** is this stage, ad-hoc trigger.
5. **Validate + seed** (automated): Zod compile; lint (duration, branch/assertion caps); **seeding dry-run** through the existing live path (E2B + recorder) → real fixtures; assertions verified against actual streams; cost report attached. **Unified with CI re-seed** — one system, two triggers (new lesson vs Claude Code version bump).
6. **Publish gate** (human, PR): draft = PR to `packages/claude-repl-lessons` (YAML + fixtures + preview build link). Review/edit/merge → CDN deploy. Git supplies versioning, review, rollback.

## Admin UI — "Foundry" tab (admin-gated route in the SPA)
- **Idea box:** idea/prompt → streaming outline → iterate in place → "Generate full lesson" → validate/seed → PR link.
- **Topic Radar:** scout cards (topic, why-now, sources, overlap score) → "Draft this."
- **Cadence config:** per-source frequency, auto-draft top-N, per-run budget cap.
- **Review queue:** drafts w/ embedded guided-player preview, schema diff, seeding cost, approve → PR.

## Model routing (configurable) & Model Lab ([[Model Routing Strategy]])
**Routing config** (`foundry/models.yaml`): semantic **roles**, not hardcoded models — one place to swap, per-run override in the idea box UI.
```yaml
roles:
  scout:  { model: claude-haiku-4-5 }
  author: { model: claude-fable-5 }     # default; claude-opus-4-8 = bench candidate
  linter: { model: claude-sonnet-4-6 }  # bench candidate: sonnet-5 (intro $2/$10 thru 2026-08-31)
  judge:  { model: claude-sonnet-4-6 }  # fixed across benchmarks; never a contestant
# `provider` field reserved for future local/open-model experiments; v1 = Anthropic via Agent SDK
```
**Bench economics:** run sweeps through the **Batch API (50% off)** and **prompt-cache** the author role's fixed block (schema + exemplar + principles; cache hits ~90% off). Estimated ~$35–70/sweep all-in; cadence $10–45/mo — cost model in [[Claude REPL Business Plan]]. Sonnet 5's launch (2026-06-30) is the first live firing of the "new model → run bench" trigger.
Hard cap per cadence run; per-draft cost report. Runtime: **Claude Agent SDK** — dogfooding the ecosystem we teach.

**Model Lab (bench harness):**
- **Golden sets per role with frozen source packs** (comparability across models and time — otherwise you benchmark the news, not the model). Author: 3–5 topic briefs; scout: hand-labeled source-delta snapshots.
- `foundry bench` CLI: role × model matrix → scorecard. Trigger: on new model releases / on demand.
- **Metrics — author:** schema-pass % · **seed-pass %** (authored prompts must satisfy their *own* assertions when actually run — reuses the validate/seed stage as the objective, un-gameable signal) · judge rubric from locked pedagogy principles · $/draft · latency. **Scout:** topic recall/precision vs labels · $/run.
- **Judge hygiene:** fixed judge model, never a contestant (self-preference bias); pairwise comparisons over absolute scores at small n.
- **Production telemetry is the real benchmark:** every draft PR carries provenance frontmatter `{role, model, cost, tokens}`; review outcomes (merged-as-is / edited / rejected) become labels for free.
- Runner: promptfoo-style YAML eval matrix with seed-validation as a scripted assertion, or a thin custom harness — verify tooling at build.

## Content & licensing rules (hard)
- Registry courses are **radar, not raw material**: they inform *what* to teach and typical sequencing. Lesson expression is authored **original**, grounded in primary sources (official docs, specs, release notes).
- No reproduction or close paraphrase of course content regardless of license; per-lesson provenance/attribution notes kept.
- Author prompt encodes the rule; review checklist includes an originality pass.

## Risks
- **Hallucinated/thin pedagogy** → source-grounding, exemplar few-shot, seed-validation (fixtures prove the lesson runs), human publish gate.
- **Unattended cost runaway** → per-run cap, top-N default, overlap gate, Haiku scouts.
- **Source fragility** → feeds/git over scraping; per-source failure isolation.
- **Quality drift toward sameness** → exemplar rotation; admin edits feed back as new exemplars.
- **Licensing** → rules above; provenance log per lesson.

## Meta-opportunities
- **Build-in-public:** "our lessons are authored by the agentic workflow we teach." The Foundry itself becomes an advanced lesson later.
- **Marketplace runway:** the Foundry matures into the authoring tool third-party creators use (business plan revenue #5).

## Next step (critical path unchanged)
**Author Lesson 1 in YAML** — now quadruple duty: template for lessons 2–8, schema validation, fixture-player build target, **and the Foundry's few-shot exemplar**.

## Changelog
- **v1.3** (2026-07-11) — Bench economics: Batch API + prompt caching for sweeps; Sonnet 5 added as linter/judge/author bench candidate; cost figures linked to business-plan model.
- **v1.2** (2026-07-11) — Author default = Fable 5; bench runner deferred to build time; bench triggered by new model releases via the scout's own radar (model announcements added to registry).
- **v1.1** (2026-07-11) — Configurable role-based model routing (`foundry/models.yaml`, per-run override, reserved `provider` field) + **Model Lab** bench harness: frozen golden sets, seed-pass % as objective author metric, judge hygiene rules, PR provenance telemetry as production benchmark.
- **v1.0** (2026-07-11) — LOCKED. Auto-draft → review queue w/ budget cap + mandatory overlap gate; GitHub Actions substrate; v1 = both features on one spine (idea box + radar as triggers); registry capped at 3–5 launch sources.
- **v0.1** (2026-07-11) — Initial spec: agentic-research-over-RAG thesis; six-stage pipeline unified with CI re-seed; Foundry tab; routing/budget; licensing rules.
