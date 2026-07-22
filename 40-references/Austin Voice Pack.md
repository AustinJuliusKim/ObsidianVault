---
title: Austin Voice Pack
aliases: [voice-pack, blog-voice]
tags: [content, marketing]
type: reference
status: developing
created: 2026-07-22
updated: 2026-07-22
related: ["[[Choices Dev Blog Synthesis Plan]]", "[[Choices Marketing Proposal]]"]
---
# Austin Voice Pack

Makes LLM blog drafts sound like Austin instead of like a model. **Samples beat adjectives**: a drafting session imitates the verbatim §Samples below; the §Traits list only fills gaps the samples don't cover. Loaded by every stage-2 drafting run per [[Choices Dev Blog Synthesis Plan]] §2. Studio-wide (Choices now, REPL blog later).

## How a drafting session uses this note
1. Read §Samples in full. Match their sentence length, rhythm, joke frequency, and how they handle numbers and failure — not their topics.
2. Where samples and §Traits conflict, **samples win**. Where samples are silent, traits apply.
3. Run §Checks on the finished draft before output. Rewrite anything that fails; don't flag it, fix it.
4. Never quote the samples in a post.

## Samples (VERBATIM AUSTIN ONLY — nothing here may be written or "improved" by a model)

Seeded 2026-07-22 from three LinkedIn posts Austin supplied (captured via web fetch — Austin: eyeball once for fidelity; the run-ons and quirks are intentionally preserved). More samples welcome, especially a raw voice-memo transcript.

### Sample 1 — LinkedIn article, "An Obsidian-backed LLM Wiki has changed how I work" (Jul 2026)
> It's old news that working with LLMs and markdown files pair like a fine wine and cheese. But setting up this one thing has changed how I interact with AI for good.
>
> Spawning up multiple projects, spanning multiple chats that all output an artifact in the form of a markdown file was useful for continuing context after reaching token usage limits. It's extremely easy to rack up a large conversation in the same chat, akin to accepting edits in Claude Code. The LLM sometimes gets things wrong without proper context and full grep access. Plan mode helps to alleviate this issue by measuring twice (or however many times it takes to load the proper context into the token window) and cutting once. Taking your plans and then linking them to each other via mapping that allows LLMs to quickly traverse and scan your wiki in order to find the correct context. Andrej Karpathy sums it up here in his gist.
>
> There's no limit to the types of notes, files, or knowledge that you can put into your wiki. It's all about you, from your interests, your projects, your research. You can put things as mundane as Paternity Leave Home Improvement Plans (I refactored my garage hehe) and sorted my Magic The Gathering Collection. On the side, I'm also building several apps that I've always dreamt of building but just lacked the general time to do so. Now, it's as easy as having a conversation with Claude's latest models (Fable 5 / Opus 4.8) and coming up with a plan doc. This means that when I'm stuck in bed with my 4 month old baby, I can still get usage out of my subscription with the iOS app version of Claude. Then when I wake up, I just feed that artifact into my Obsidian LLM, spin up Claude Code and let it work (using the appropriate models for tasks of course, we don't need a Ferrari to drive to the grocery store).
>
> If you're interested in building an Obsidian LLM Wiki here's my plan doc, feel free to take this and feed it to Claude to start scaling your AI usage and hopefully you're able to save on your tokens just like I did!

### Sample 2 — LinkedIn article, "I ran into session limits because I was going too hard with Fable 5 so I built..." (Jul 14, 2026)
> A skill that saves the context of what I'm currently working on to a one-shot prompt, arms a cron job to wake and resume burning them tokens.
>
> Anthropic sure understands the competitor landscape, with GPT 5.6 Sol and Grok 4.5 launching, they've continued to push out the Fable 5 access from July 7th, to July 12th, and now to July 19th.
>
> I'm tired of this grandpa
>
> Along with the rest of the r/ClaudeCode, I'm getting tired of staying up late, waiting for the next usage reset, to get the most out of Anthropic's latest Frontier model. So I built a skill that takes the context of what I'm currently working on, triggered by reaching 85% of my session usage limit, and arming a one-shot prompt to resume and wake on a cron job. This way I can get 3-4 session windows within a day. Here's the skill:

### Sample 3 — LinkedIn post, AWS billing LSE (Jul 2026)
> How about that AWS Billing LSE this morning? Anyone else get a heart attack? I know I didn't get a $2.5bn alert, but even just a $1.6k alert woke me up like Vietnamese coffee injected intravenously. I had just fed my 4mos baby a bottle and just happened to open my emails... Luckily I spotted in my billing center that AWS was having a large scale event... Suffice to say, I am questioning my choice in Cloud Providers and tech stack for hobby purposes.

## Traits — measured against the samples above (2026-07-22)
- Long, loosely-chained sentences that ride momentum; the occasional fragment or run-on left standing. Do NOT tidy his rhythm into short declaratives.
- Vivid, slightly absurd similes as the main humor engine ("like Vietnamese coffee injected intravenously", "we don't need a Ferrari to drive to the grocery store", "pair like a fine wine and cheese").
- Meme/community register dropped in deadpan ("I'm tired of this grandpa", "burning them tokens", "hehe") — once or twice per post, never wall-to-wall.
- His real life appears as casual parentheticals, not framing: the 4-month-old, paternity leave, the garage refactor, the MTG collection.
- Numbers and dates stated mid-sentence like gossip, unflattering ones included ($1.6k alert, July 7th→12th→19th, 85%).
- Direct address + genuine generosity at the close ("feel free to take this", "hopefully you're able to save on your tokens just like I did!"). Exclamation marks are used, sincerely, sparingly.
- Mild theatrical exasperation as a stance ("Anyone else get a heart attack?", "Suffice to say, I am questioning my choice…") — annoyed but never bitter.

## Banned (AI-slop patterns — reject on sight, regardless of samples)
- "delve", "dive into", "unpack", "navigate", "landscape", "journey", "game-changer", "supercharge"
- "It's worth noting", "Interestingly,", "Here's the thing:", "Let that sink in"
- "isn't just X — it's Y" constructions; rule-of-three listicle sentences; rhetorical questions as transitions
- Hedged claims ("arguably", "perhaps the most") — state it or cut it (theatrical exaggeration in a simile is his style; empty intensifiers are not)
- Tidy moral-of-the-story closers; em-dash chains standing in for actual connective thought
- Any sentence that could open a LinkedIn post

## Checks (run before emitting a draft)
1. **Text test**: could each paragraph be sent as a text to a friend without sounding like content?
2. **Read-aloud test**: no sentence you'd stumble over or be embarrassed to say.
3. **Specificity test**: every abstract claim is backed by a named, concrete thing within two sentences.
4. **Skim test**: reading only first sentences of paragraphs still tells the story.

## Edit-diff log (the improvement loop)
After every stage-3 edit, diff Austin's edited version against the draft (`git log/diff` on the draft file, or side-by-side) and append 3–5 concrete patterns here — words he cut, rhythms he broke, jokes he added. Next drafts obey them. This section is the voice pack's real engine; the traits above are just its cold start.

*(no entries yet — first entry comes from the draft-v1 edit of `app-for-my-marriage`)*
