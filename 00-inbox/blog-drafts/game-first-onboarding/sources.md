# Source pack — "Game-first onboarding" post

All product claims below are code-verified (repo: `personal/projects/apps/choices-webapp`, main @ 2026-07-08) or vault-cited. Draft must not assert anything absent from this pack.

## The pattern (attributed inspiration)
A Duolingo onboarding case study making the rounds (paraphrase, don't reproduce): you're inside a lesson within ~10 seconds; no homepage, no pricing page; signup appears only AFTER the first exercise. Principles: (1) lead with the product — every screen before the core feature is a drop-off; (2) make signup feel earned — it should feel like "save your progress"; (3) design the first 60 seconds — activation is one screen; map the user flow before writing code; ask what's the smallest action that delivers value, the LATEST point to ask for signup, what defers to session two.

## Choices receipts (code-verified)

**Invitee path (the one that matters — invites are the acquisition channel):**
- Share link is `/j/{CODE}` → Lambda-rendered OG card → instant redirect into the app with the code prefilled (`handler.mjs ogPreviewPage`, `main.jsx` join route).
- `JoinView.jsx:10`: with a prefilled code, the flow *starts at the seat picker* (`useState(prefillCode ? "seat" : "code")`). One tap — "I was invited (Guest)" — and you're in the game.
- **Tap math: link tap + 1 seat tap = playing. Zero typing. Zero signup. Zero install. Zero pricing.**
- Only pre-play decision: the seat picker ("Which player are you?") — an honest extra screen, exists so a couple can't accidentally hold the same seat.

**Creator path:**
- Landing → "Start a new game" → 4 choice inputs (typeahead-assisted) → Create → Share → Continue as Host. ~4 taps + typing 4 foods; ✨ Fill-my-4 collapses the typing to one tap (that AI assist is the one thing requiring sign-in — an assist, never play).
- Identity is a localStorage token scoped to the pairing. No account object needed to play, ever.

**Signup placement (the "earned" test):**
- Required sign-ups on any play path: **0**. Accounts are optional forever.
- The account pitch is literally "save your progress": sign-in exists for game history + streaks. Placements: a *ghost* (tertiary CSS class, `Landing.jsx:25`) button on the landing page; a one-line link on the **winner screen** (post-value, `WinnerAccountLine`); a corner pill.
- Streak design reinforces it: streaks count shared *play days* (the game has no per-player winner), so the saved progress is the couple's, not a scoreboard.

**Monetization placement:**
- Tip jar + premium tease render on the *created* screen and *winner* screen — after value. Premium ($2.99/mo) gates history depth/streak visibility, never play. [[Choices Growth Plan]] §2a "post-value placements"; core rule: never paywall the join.

**The design law behind all of it** — [[Studio Design Constitution]] kill test: *"Does the invitee hit any wall (pay/signup/install) before playing? → kill."* This wasn't growth-hacking after the fact; it's a constitution rule that predates the features.

**Honest frictions (must appear in the post):**
- The seat picker is a real extra decision on the hot path.
- Web-first means PWA install friction on iOS (push needs Add-to-Home-Screen); the App Store build exists to remove it — [[Choices Marketing Proposal]] flags this friction as measurable launch material.
- A landing page *does* exist (two buttons); the case-study purist would deep-link everything.

## Wordle facts (web-verified 2026-07-08)
- Josh Wardle built Wordle **for his partner, Palak Shah**, during the pandemic (Jan 2021, from a 2013 prototype); they played it privately for months before it went public Oct 2021. Sources: [Wikipedia](https://en.wikipedia.org/wiki/Josh_Wardle), [Time interview](https://time.com/6143715/wordle-sale-josh-wardle-interview/), [They Got Acquired](https://theygotacquired.com/gaming/wordle-acquired-by-the-new-york-times/).
- Deliberately shipped with **no app, no registration, no ads, no push, no purchases**; once a day.
- Shah curated ~12,000 five-letter words down to ~2,500 common ones (the partner shaped the product).
- The emoji share grid was adopted from user behavior on Twitter — the share artifact became the growth engine (parallel: the Choices reveal card, deliberately designed as UGC per [[Choices Growth Plan]] §8).

## Brief
- Audience: founders/PMs (builder voice: candid, first person, numbers-transparent; NOT the product's teasing voice).
- Thesis: the product is the funnel — every screen before play is a drop-off you chose.
- Required numbers: invitee = 2 taps to playing; required signups on play paths = 0.
- Structure: hook (the case study) → the pattern → Choices receipts → honest frictions → Wordle closer (built-for-a-partner parallel) → CTA placeholder (builders → email list, pending blog infra).
- Length ~1,200–1,800 words; 3 title options; 5-tweet thread.
- Pipeline vehicle for this shakedown: in-session draft (no `ant`/API key on this machine) — log in [[Choices Dev Blog Synthesis Plan]].
