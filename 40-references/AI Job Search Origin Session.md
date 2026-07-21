---
title: AI Job Search Origin Session
aliases: []
tags: [career, job-search, ai-engineering]
type: reference
status: evergreen
created: 2026-07-21
updated: 2026-07-21
related: ["[[AI Engineering Job Search]]"]
source: ~/.claude/projects/-Users-aukim-personal-projects--claude-worktrees-portfolio-ai-revamp/1fa35753-f784-42da-95bb-e28aafb32218.jsonl
---

# AI Job Search Origin Session

Verbatim record of the Claude Code session (2026-07-13, worktree `portfolio-ai-revamp`) that produced the portfolio site, résumé, and LinkedIn copy pack. The distilled/NDA-reviewed version lives in [[AI Engineering Job Search]] — this note preserves the raw source.

> [!warning] Private — NDA-sensitive
> The verbatim Ring/Neighbors description below includes law-enforcement framing that was deliberately **genericized in all public assets** (résumé, LinkedIn, portfolio). It stays in this vault only. Same for the Ring moderation 60% metric.

## Original prompt

> Let's revamp my Linkedin site and Portfolio so that we can target some jobs in the AI engineering space.

## Career history — verbatim confirmations

Provided by Austin during the session's fact-check round:

1. Riot Games — Senior Software Engineer 2023–Present; Software Engineer 2021–2023.
2. Ring — Software Development Engineer 2018–2021.
3. Loot Crate — Front End Software Engineer 2015–2018.
4. **Riot:** Internal Portal and Tools that facilitate Internal/Public Alpha/Beta playtesting ranging from company-wide (~5,000 employees) to player pools as large as ~500,000–2M. Built the developer/game tooling for gating and managing access to artifacts within tooling. Prior to developing these tools, launched the internal portal and grew user base from roughly 100 MAU first month to now thousands of DAU. Won an internal hackathon called Thunderdome in 2025 for prototyping/developing in Unreal a feature to manage Skin Collections.
5. **Ring:** Worked within Neighbors App organization to develop an internal B2B portal, where we used geolocation, encryption and anonymized data to collect Ring camera video metadata in order to ascertain whether Police and Public Safety Agencies could request information from Neighbors and Ring camera owners in order to collect evidence for small, petty crimes such as package theft, car theft, etc. Worked on a micro-frontend webview deployed within the main iOS/Android Ring app, for privacy controls and notification settings across the company's services. Led and managed a team of 3 frontend contractors — onboarding, coaching/mentoring, and providing feedback and areas of focus for ~6 months. Transferred to the ML moderation team and worked on another internal portal used for human moderation to train content moderation for Neighbors/Ring comments and social posts. In 2020/2021, about 60% of all posts used automated content moderation.
6. **Loot Crate:** Led development for on-time launch of 40 new product lines in 2+ years. Ported front end to React/Redux consuming REST API. Stood up new e-commerce subscription-box site MVP for sports fans (SportsCrate) using Ruby/Rails, Docker, and Kubernetes within 6 months. Facilitated A/B testing using Google Optimize, iterated on the content-management platform, implemented wireframes/comps into performant, accessible, responsive UIs. Scoped large features/projects by clarifying business requirements, estimating effort, and negotiating deliverable dates.
7. **Riot (Portal library):** Developed an internal Portal component library used across the Developer Platform portal and our own portal. Created and manage a Portal contribution model where teams across the organization and Riot could contribute to the Portal stack using AI-assisted coding through agents.md files, style.md files, and smart components that let users create views/pages with consistent UX.
8. Education: UCI, B.A. Economics, 2012.
9. Flagship code cited: `AustinJuliusKim/projects` monorepo — `apps/choices-webapp`, `apps/guided-repl`, `packages/guided-repl-lessons`, `packages/guided-repl-protocol`, `services/guided-repl-api`, `services/guided-repl-seeder`.

## Other directives given in-session

- "I do want to make sure any information posted is NDA compliant. Let's review before creating." → drove the NDA-review pass before any public asset was written.
- Set up GitHub Actions deploy for the portfolio site; add the apex redirect (www → apex 301).
- Post-merge: worked through the Ops tasks for PR #32; deliverables shipped in PR #34.
