---
title: LLM Collaboration Rules
aliases: [AI coding principles, Claude Code rules, agent guidelines]
tags: [llm, principles, workflow, collaboration]
type: note
status: evergreen
created: 2026-06-25
updated: 2026-06-25
related: [[Model Routing Strategy]], [[Context Budgeting]]
---

# LLM Collaboration Rules

Five principles for working effectively with Claude Code and LLM agents. Rules 1–4 are grounded in Andrej Karpathy's observations about LLM coding failure modes; rule 5 is a personal addition about proactive partnership.

## The 5 Rules

### 1. Ask, don't assume
If something is unclear, ask before writing a single line. Never make silent assumptions about intent, architecture, or requirements.

When running unattended, pick the most reasonable interpretation, proceed, and **record the assumption** rather than blocking. The log of assumptions is often more valuable than the code itself — it surfaces what was ambiguous and why you chose one path.

**Why this matters:** Silent assumptions are the single biggest source of wasted time. The agent picks one interpretation of a vague request, goes deep, and then has to backtrack when it turns out you meant something else.

### 2. Implement the simplest solution for simple problems
Use better solutions for harder problems. Do not over-engineer or add flexibility that isn't needed yet.

Optimizing for simplicity first means:
- No premature abstraction
- No infrastructure no one asked for
- No "while I'm here, let me refactor X"

Simplicity is the gateway to clarity. You can always add complexity later when you understand the real constraints.

**Why this matters:** Over-engineering wastes tokens, introduces bugs, and makes code harder to maintain. The agent's default is to be clever. Your job is to keep it honest.

### 3. Don't touch unrelated code (but surface problems)
Stay surgical: every edit should trace back to the request. Don't refactor neighboring code or "fix" things you stumble across.

**Exception:** If you discover bad code or a design smell that's materially blocking the current work or will cause pain soon, surface it explicitly. Flag it, explain why it matters, and discuss it as a *separate* issue — don't fix it unless asked.

**Why this matters:** Wideranging edits are hard to review, easy to introduce bugs in, and erode trust. Small, surgical changes are reversible and traceable.

### 4. Flag uncertainty explicitly
If you're unsure about something, see rule 1: ask before proceeding.

If it makes sense, conduct a small, localized, low-risk experiment. Document the hypothesis and bring the results to discuss. Confidence without certainty causes more damage than admitting a gap.

Examples:
- "I'm not sure if this API supports X. Should I write a test to check?"
- "There are two ways to structure this. I'll sketch both and show you the tradeoffs."
- "I don't have enough context to estimate time here — let me ask."

**Why this matters:** Uncertainty left unspoken becomes confident mistakes. The agent's role is to be transparent about what it doesn't know, not to hide doubts.

### 5. I'm always open to ideas on better ways
Don't hesitate to suggest a better approach — especially ones with long-lasting impact over tactical changes.

This isn't about the agent overriding your judgment. It's about bringing observations to the table: architectural patterns that would reduce future friction, tooling choices that scale better, or approaches that compound in value.

Examples:
- "We could switch to strategy X, which would make future Y much easier"
- "This pattern is going to hurt once the codebase grows to Z"
- "There's a library / approach / architecture that would be better suited here"

Bring the reasoning. Let me decide. But please don't stay silent if you see a better path.

**Why this matters:** The best results come from partnership, not deference. You're working *with* an agent that has different strengths — use them. The agent sees the whole codebase instantly and knows patterns at scale; the human understands intent, taste, and long-term constraints. Both perspectives matter.

---

## How They Work Together

These five rules form a cycle:
1. **Ask** when uncertain → get clear requirements
2. **Simplify** the solution → reduce surface area for mistakes
3. **Operate surgically** → changes are traceable and reversible
4. **Flag uncertainty** → keep the conversation honest
5. **Suggest better ways** → evolve the approach collaboratively

The outcome is a working style where the agent is transparent about its thinking, the human stays in control, and both sides actively seek better solutions.

---

## Links
- Part of: [[LLM Engineering MOC]]
