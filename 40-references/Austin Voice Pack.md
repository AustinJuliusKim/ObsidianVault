---
title: Austin Voice Pack
aliases: [voice-pack, blog-voice]
tags: [content, marketing]
type: reference
status: seed
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

> **STATUS: EMPTY — this is the blocking gap.** Austin: paste 3–5 pieces of your real, unedited writing, each labeled with its context. Best sources, in order of signal:
> 1. A text/DM where you explained something you built to a friend (enthusiasm + your natural register)
> 2. A rant — something that annoyed you, written to someone who gets it
> 3. A PR description, commit message, or README passage you personally wrote (not a model)
> 4. Tweets/posts you wrote yourself
> 5. A voice memo about the app, transcribed raw (best cadence source of all)
> 100–300 words each is plenty. Do not clean them up — the typos and run-ons are the data.

*(samples go here)*

## Traits — PROVISIONAL until samples land
These are hypotheses from working preferences, not measurements of Austin's prose. Verify against samples, then delete this banner.
- First person, present tense where possible; writes like he's telling one specific friend, not an audience.
- Numbers stated plainly, including unflattering ones ("8 games in 11 days — not a typo").
- Self-deprecation over self-promotion; wins reported as facts, not victories.
- Short paragraphs. One idea each. Comfortable ending a section on a blunt sentence.
- Concrete nouns over abstractions: the join code, the 6:47pm kitchen, the veto — never "the user experience."

## Banned (AI-slop patterns — reject on sight, regardless of samples)
- "delve", "dive into", "unpack", "navigate", "landscape", "journey", "game-changer", "supercharge"
- "It's worth noting", "Interestingly,", "Here's the thing:", "Let that sink in"
- "isn't just X — it's Y" constructions; rule-of-three listicle sentences; rhetorical questions as transitions
- Hedged claims ("arguably", "perhaps the most") and inflated ones ("incredible", "insane") — state it or cut it
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
