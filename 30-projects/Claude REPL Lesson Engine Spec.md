---
title: Claude REPL Lesson Engine Spec
aliases: [claude-repl-lesson-engine]
tags: [project, claude-repl, lesson-engine, ux, schema]
type: project
status: locked
created: 2026-07-09
updated: 2026-07-09
related: [[Claude REPL]], [[Claude REPL Lesson Plan]], [[Claude REPL Business Plan]], [[Claude REPL Protocol]]
---
# Claude REPL — Lesson Engine Spec (v1.0 · LOCKED)

**Scope:** (1) lessons/quizzes as configurable data the UI renders; (2) UX separation of the REPL stage from the lesson/quiz spine; (3) task buttons → terminal autocompletions (PromptComposer). Extensible to dev-basics topics (git, CLI, npm, localhost).

## Locked decisions
- **Authoring format:** YAML sources → compiled canonical JSON; Zod schema in `packages/claude-repl-protocol` as single source of truth (renderer, authoring CLI, CI re-seed).
- **Rail placement:** **left rail** on desktop → causal pipeline across the screen: read (rail) → act (terminal) → see (workspace). Matches Codecademy/Educative/freeCodeCamp convention; right rail would crowd the workspace; top stepper fits progress, not prose. Collapsed = thin progress strip. Mobile = bottom sheet.
- **Dev-basics at launch: woven, not appended.** 2–3 `TerminalDrill` micro-moments inside the existing 8-lesson spine — L6's "run the check" is the first command learners type themselves (training-wheels-off beat); L8's going-live ritual absorbs `git diff` + commit. Exact commands set during Lesson 1 script authoring. Full dev-basics track = post-launch; launch proves the `shellTranscript` machinery.

## 1 · Config format
- Runtime JSON: native to browser, matches NDJSON fixtures, CDN-static per business plan.
- Authoring YAML: comments + block scalars for prose (annotation copy, prompt text). Compiled + validated at build; broken refs fail CI, not learners.
- **Rejected — pure JSON authoring:** no comments, hostile multiline. **Rejected — TS/JS configs:** executable content blocks the future creator marketplace (data-only configs are safe from third parties). **Rejected — MD+frontmatter:** steps interleave structure and prose too tightly.
- Every artifact carries `schemaVersion`; fixtures also carry `claudeCodeVersion` (drift tracking).
- Content lives in `packages/claude-repl-lessons`: YAML sources → `dist/` JSON + fixtures.

## 2 · Schema
```
Lesson {
  schemaVersion, id, slug, title,
  track: "guided" | "advanced" | "dev-basics",
  order, durationTargetSec, prereqs[],
  snapshot: FsSnapshotRef            # boot state — jump-in-anywhere
  steps: Step[]                      # discriminated union on `type`
  fixtures: { [fixtureKey]: FixtureRef }
  completion: { assertionIds[], next }
}
Step =
 | Instruction   { id, md }                                  # rail copy
 | PromptBuilder { id, suggestions[], slots?: ChoiceSlot[] } # feeds PromptComposer
 | Run           { id, branches: {promptKey→fixtureKey}, pacing? }
 | Annotation    { id, anchor: SemanticAnchor, md }          # diegetic, in-stream
 | PermissionPrompt { id, branches: {allow→fixtureKey, deny→fixtureKey} }
 | Quiz          { id, question, options[], answerIdx, explainMd }   # rail-only
 | Assertion     { id, rule: AssertionRule }                 # declarative
 | TerminalDrill { id, expect: CmdMatcher, transcript: FixtureRef }  # woven dev-basics
Fixture { schemaVersion, claudeCodeVersion, kind: "claudeStream" | "shellTranscript",
          events: [{ msg: ServerMsg | TtyChunk, delayMs, skippable }] }
AssertionRule = streamEvent(match) | quizCorrect(stepId) | userChoice(equals)
              | diffTouchedOnly(paths) | drillPassed(stepId)   # JSON-logic style, data-only
```
- **Semantic anchors, not raw indices:** annotations attach via selectors ("2nd `tool_use` where tool=Edit, file=index.html") so CI re-seeds don't orphan them; failed resolution = CI error.
- **Fixture generalization is the dev-basics unlock:** `kind: shellTranscript` replays scripted git/CLI sessions through the same terminal pane and player. (Seed content: the beginner cheat sheet — terminal, npm, git, localhost.)
- **Pacing:** per-event `delayMs` + `skippable` implements the 5-minute compressed-replay constraint from [[Claude REPL Lesson Plan]].

## 3 · UX separation: Stage vs Rail
**Model:** the **Stage** is the REPL (terminal + workspace/preview) and nothing else. The **Rail** (left) is the lesson spine: instructions, progress dots, quizzes.

**The rule that ends the intertwining:**
- **Annotations are diegetic** — rendered inside the stream, anchored to events, styled as Claude Code output. They belong to the stage.
- **Quizzes are non-diegetic** — rail only. Never overlay or inject into the terminal.

**Lesson state machine** (headless `LessonEngine`, XState or reducer):
`instructing` (rail expanded, stage idle) → `prompting` (stage focused, PromptComposer active) → `running` (**stage ≈ full viewport; rail collapses to progress strip** — a Claude example shows only terminal + visual example) → `reflecting` (run settled; rail expands with quiz/assertion result) → next step / `graduated`.

**Architectural enforcement:** stage components receive only the event stream + current mode — no lesson state. `LessonEngine` owns config, progress, assertions; the Rail is its only full subscriber. Separation guaranteed by props, not discipline.

**Pattern lineage:** Codecademy's persistent instruction pane; game-tutorial design (world stays full-stage, prompts anchored and dismissible, cutscenes hand back control); Duolingo's one-mode-at-a-time. Anti-pattern in current build: quiz chrome interleaved with the run surface.

## 4 · PromptComposer (task buttons → autocompletion)
Replaces example-task buttons. Lives in the terminal pane; config-driven by the `PromptBuilder` step.
- **Empty state:** ghost placeholder — dim/italic, e.g. `Try typing: build me a website…` (slow rotation of 2–3 hints; static fine v1).
- **On focus/typing:** dropdown styled after Claude Code's slash-command menu — dark panel, monospace, suggestion + one-line description, highlighted selection, subtle border.
- **Keys:** ↑↓ navigate · Tab complete · Enter run · Esc dismiss. ARIA combobox; keyboard-first.
- **Matching:** prefix + simple subsequence fuzzy scoring (no dependency).
- **Guided mode:** suggestions = the step's branch keys. The composer **is** the locked builder; only a completed match can run. The visible menu makes the constraint self-disclosing → satisfies the coupled-disclosure principle by construction.
- **Slots:** guided slots are **choice-slots only** (each choice → a branch), snippet-style Tab navigation. **Never free-text slots in guided mode** — free text + canned output recreates the fakery problem.
- **Live mode:** same component, free text allowed; suggestions become genuine examples + history. Guided→live continuity is itself pedagogy.

## 5 · Migration (current build → this spec)
1. Extract hardcoded lesson/quiz content into first YAML configs (Lesson 1 as the template).
2. Introduce `LessonEngine` + mode state machine; move quiz UI out of the run surface into the left Rail.
3. Replace task buttons with PromptComposer reading `PromptBuilder.suggestions`.
4. Ship fixture `kind` field + `TerminalDrill` now; author the 2–3 woven drills with the lesson scripts.

## Next step
Author **Lesson 1 in the YAML schema** — exact prompt text, branch specs, annotation copy + anchors, assertion, snapshots. Doubles as schema validation and the template for lessons 2–8.

## Changelog
- **v1.0** (2026-07-09) — LOCKED. YAML→JSON confirmed; left rail with pipeline rationale; dev-basics woven as 2–3 TerminalDrills (L6 first-typed command, L8 git moment), full track post-launch.
- **v0.1** (2026-07-09) — Initial spec: schema, Stage/Rail separation, PromptComposer, migration notes.
