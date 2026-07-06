---
title: Choices Marketing Proposal
aliases: [choices-gtm, choices-marketing]
tags: [project, marketing, gtm, content, choices]
type: project
status: draft
created: 2026-07-05
updated: 2026-07-05
related: [[Choices Growth Plan]], [[Relational Games Studio Roadmap]], [[Studio Design Constitution]]
---
# Choices Marketing Proposal

**Version:** v0.2 (2026-07-05) — content decisions locked

## Decisions (locked 2026-07-05)
- **Camera: talking head is fine** → Teaser 2 ("The Race") runs in its strongest form; mix face + faceless formats freely.
- **Wife on camera: pending her call.** Plan both variants of Teaser 1 (solo-POV skit vs. couple skit); shoot nothing with her until she's genuinely enthusiastic — per constitution, the couple's reality is the brand, so forced participation would read false.
- **Dev blog: X + owned blog (SEO + email).** Lean setup path: static blog on the existing CloudFront infra (zero new hosting cost) + a lightweight email service (e.g. Buttondown-class free tier); X threads excerpt each post and link home. *(Haiku: compare Substack-custom-domain vs. static+email-service for SEO/email tradeoffs; Sonnet: set up the winner.)* Every post ends with one CTA: builders → email list; everyone else → Choices.

## Positioning

- **One-liner:** *Choices — decide what to eat, together.* (matches ASO subtitle, [[Choices Growth Plan]] §9)
- **Category:** not a food app — a couples game. Competitors are spin-the-wheel utilities; we are *play*. Copy leads with "play, don't spin."
- **Wedge audience:** couples ~24–40 who send each other memes; secondary: roommates/friends (post group-mode).
- **Emotional promise:** end The Loop ("what do you want / I don't know") without a fight. No blame, no apathy.

## Two audiences, two channels — never mixed

| | TikTok/Reels | Dev blog (X + blog) |
|---|---|---|
| Audience | Couples (users) | Builders (peers, future REPL audience) |
| Job | Install + play Choices | Founder/studio brand; compounding trust |
| Voice | Teasing/quirky (constitution voice rules) | Candid, numbers-transparent |
| Cadence | 1/week floor (roadmap) | 1 per milestone only |

## GTM launch sequence (keyed to the Apple long pole)

**Phase 0 — Now (web is live):** content engine warms up on TikTok pointing to `choices.austinjuliuskim.com` (PWA install friction is real — measure it, it becomes launch-post material). Instrument link-in-bio → game-created conversion.

**Phase 1 — Content traction (pre-App Store):** post weekly; find the format that converts (the 3 teasers below are deliberately different bets). Build a small waitlist/notify list for the App Store launch. Dev blog post #1 ships at first real milestone.

**Phase 2 — App Store launch (the moment):** coordinated push — best-performing TikTok format re-cut as launch video, dev blog launch post ("I built an app for my marriage"), Product Hunt same week, ASO live. The App Store removes the PWA friction → re-run the best Phase-1 content, conversion should jump; that delta is itself a blog post.

**Phase 3 — Sustain:** reveal-card UGC becomes the primary engine (users make the content); weekly video floor continues; affiliate links live → §8 funnel data accrues toward the partnership pitch.

## TikTok teasers (scripts)

### Teaser 1 — "The Loop" (pain-first skit; broadest reach)
- **Hook (0–2s):** text overlay: *"POV: it's 6:47pm"* — couple on couch.
- **Beat 1:** "What do you want to eat?" / "I don't know… whatever you want." / "I picked last time." Quick cuts, clock spins, stomach growl SFX.
- **Beat 2 (turn):** phone slams into frame. 4 choices on screen. Cut. Cut. Cut. Winner card.
- **Payoff:** *"Dinner decided in 90 seconds. Nobody's fault. Everybody's pick."*
- **End card:** Choices — decide what to eat, together. Link in bio.
- **Format note:** remixable weekly (new foods, new endings, "The Loop pt. 2").

### Teaser 2 — "The Race" (origin story; comment magnet)
- **Hook:** *"My wife and I have a weird ritual."*
- **Body (talking head or text-over-b-roll):** "Whoever says 'choices' first wins — because the loser has to give 4 options, and the winner can't complain about the result. We've done this for years. So I built it into an app."
- **Show:** 10 seconds of real gameplay, real reactions.
- **Payoff:** *"Now 6:47pm is our favorite time of day."*
- **Why it works:** authenticity + the quirky-ritual confession format reliably drives "my partner and I do this too" comments → algorithmic lift.

### Teaser 3 — "The Reveal" (gameplay drama; UGC template)
- **Hook:** screen-recording opens mid-game: *"Four choices. We each cut one. NO ONE picks the winner."*
- **Body:** dramatic cuts with the in-game copy carrying the humor — *"You cut Sushi 😈" … "Alex cut Tacos. Pizza survives."* Zoom on the nudge push: *"Still deciding? Someone's getting hangry."*
- **Payoff:** reveal card — *"Nobody picked this. Everybody picked this."* — then 2 seconds of real petty reaction ("she cut my tacos AGAIN").
- **Strategic role:** this is the exact format users can replicate with the shareable reveal card (§8 channel #1) — the teaser trains the UGC pattern.

**Production rules:** batch-film monthly (4 videos/session); phone-native, no polish (polish reads as ad); captions always; the constitution voice rules apply to every caption.

## Dev blog architecture

**The frame decision: origin story is the door, the AI operating system is the house.**

- **Post 1 (milestone: App Store launch):** *"I built an app for my marriage"* — origin story + what shipped + one honest number. Crossover post: written for builders, shareable by anyone. This is the only post that leads with the love story.
- **Series A — "The one-person studio"** (the differentiated content; the LLM-wiki angle lives here):
  - *Model routing as an org chart* — Opus/Fable architecture, Sonnet implementation, Haiku research; what each tier is actually for
  - *My company's brain is an Obsidian vault* — versioned decision docs, the constitution as agent context, token-efficient wiki design
  - *Prove before UI* — Monte Carlo playtesting a party game before writing any interface
  - *Serverless doesn't topple, it bills* — the 1M CCU thought experiment (§10) as a post
- **Series B — build-log milestones:** real numbers each milestone (costs, revenue, invite→join conversion, what failed). Transparency is the trust engine; the 50/50 revenue posture and $5k target are publishable.
- **Cross-pollination:** Series A is *also* audience-building for Claude REPL later — same reader. One flywheel, two products.

## Metrics loop

- **Content → product:** views → link-in-bio taps → games created (UTM per video) → the §8 North Star (games/week, MAU)
- **Kill/scale rule:** any format with 2 consecutive videos converting below baseline gets retired; winners get remixed
- **Blog:** subscribers + inbound DMs from builders (leading indicator for the studio brand and REPL)
- Weekly 15-min review, logged as one-line notes in the vault (token-cheap, trend-visible)

## Open questions (v0.3)

- App Store launch target date (drives Phase 1 length + waitlist mechanics) — gated on Apple developer access (known long pole).

## Links
- Execution: [[Choices Growth Plan]] (§8, §9) · Strategy: [[Relational Games Studio Roadmap]] · Rules: [[Studio Design Constitution]]

## Model routing
- Fable: this proposal + refinements
- Sonnet: UTM instrumentation, link-in-bio page, reveal-card share feature
- Haiku: Product Hunt launch checklist research, TikTok/Reels posting-time research
