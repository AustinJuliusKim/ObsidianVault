---
title: Choices Growth Plan
aliases: [choices-growth, choices-roadmap]
tags: [project, webapp, planning, growth, monetization]
type: project
status: draft
created: 2026-07-01
updated: 2026-07-09
related: [[Choices Webapp]], [[Relational Games Studio Roadmap]], [[Studio Design Constitution]], [[Choices Marketing Proposal]], [[Choices Suggestion Engine Plan]], [[Choices CloudFront PAYG Migration Plan]], [[Projects MOC]]
---
# Choices Growth Plan

Strategic roadmap for scaling [[Choices Webapp]] from a personal two-player game into a shareable product with revenue potential. Core insight driving everything: the game solves decision apathy for "what should we eat" — the natural end of every game is a food order, which makes delivery integration the monetization engine rather than a bolt-on.

**Version:** v1.5 (2026-07-04) — tip jar shipped (Venmo + Stripe PWYW link, post-value placements) with premium-interest tracking; pricing research note added to §2a (market band is $4–8/mo, $2.50 flagged for revisit)
*v1.4 (2026-07-04) — iOS §3 restructured into a two-phase ladder: Phase A free-tier Capacitor build now, Phase B paid launch (enrollment deferred to the launch gate)*
*v1.3 (2026-07-04) — cost-first re-sequencing:* Tier-1 hardening promoted to step 1 and now in implementation (feature/tier1-hardening, verified on the preview stack); Tier-1 design decisions locked (§10b); iOS readiness checklist added (§3); Capacitor pulled up in sequencing behind cost work
*v1.2 (2026-07-01) — premium = subscription only (lifetime unlock rejected); meal-kit CPA added to winner-screen spec with cook-at-home detection (§2a, §6)*

## Decisions (locked 2026-07-01)
- **Ambition:** Real side business — **target $5k+/mo**.
- **Scope:** Food-focused. Own "what should we eat" as a category; no generalization to movies/names/trips for now.
- **Accounts:** Full accounts acceptable if needed → premium tier, cross-device history, and first-party attribution data are all on the table.
- **First detailed workstream:** Affiliate deep links (§6).
- **Group mode:** Not assumed to work — explore the game loop first via simulation + playtest (§7) before committing.
- **Market:** US-first, global eventually — build i18n-ready, keep affiliate/delivery layer pluggable per region (Deliveroo, Just Eat, iFood, Zomato exist where DoorDash/Uber Eats don't).

## 1. Scaling users

### Technical scaling
The serverless stack (Lambda + DynamoDB on-demand + CloudFront) scales horizontally with no changes. Real bottlenecks:

- **Polling cost.** 3s polling = ~1,200 Lambda invocations per player-hour of idle waiting. Fine at 10 users, dominant cost at 10k.
  - *Near-term:* adaptive polling (3s during active turn, back off to 15–30s when idle; pause on `visibilitychange`).
  - *Later:* API Gateway WebSocket API or AppSync Events for real push, keeping polling as fallback.
- **No throttling on Function URLs.** Add CloudFront in front of the Lambda Function URL + AWS WAF rate rules. This is also the moderation/abuse backstop.
- **Code collisions.** `WORD-NN` space is small; monitor collision rate on `CODE#` writes and expand format (`WORD-WORD-NN`) when create-retries climb.
- **Hot partition risk** is negligible (per-pairing keys), no action needed.

### Growth scaling (the more important half)
The share-a-code loop is already a viral mechanic. Amplify it:

- **Rich link previews.** OG/Twitter meta tags on the join link ("Alex challenged you: Dinner Tonight — 4 choices, 1 winner"). Requires an SSR edge function (CloudFront Function / Lambda@Edge) or a lightweight preview endpoint, since the SPA hash routes don't get crawled. Highest-leverage single feature for organic growth.
- **Group mode (3+ players).** Roommates, friend groups, offices deciding lunch. Elimination order round-robins. This multiplies invites per game.
- **Preset lists.** "Date Night," "Fast Food Face-off," "Movie Night" — reduces creation friction from 4 typed choices to one tap. Later: auto-populate from nearby restaurants (see §5).
- **Rematch → streaks/history.** "You two have played 12 games; Thai wins 40% of the time" gives couples a reason to keep the pairing alive past the 30-day TTL (extend TTL on activity).

## 2. Monetization

Priority order, lowest friction first:

1. **Affiliate deep links (Phase 1 of §5, spec in §6).** Winner screen: "Order [winner] on DoorDash / Uber Eats." Zero partnership required and it *improves* UX. **Reality check (verified Jul 2026):** both programs are *new-customer acquisition* CPA, not per-order revenue share — Uber pays a flat CPA (~$5) only when a referred user completes their **first-ever** order, and existing account holders generate nothing; DoorDash's Impact-managed program is the same model. So affiliate revenue alone will be thin (most of your audience already has these apps). Ship it anyway: near-zero effort, some revenue, and — most importantly — it produces the click-through and conversion data that powers the Phase 4 partnership pitch. The affiliate layer is the *data engine*; premium and partnerships are the revenue engine.
2. **Premium tier (~$2–3/mo or small one-time).** Saved/custom preset lists, game history & stats, themes, group games above N players, longer choice lists (8/16 bracket mode). Core 2-player game stays free forever — virality is the acquisition channel and paywalls kill it.
3. **Sponsored choices (later, carefully).** A restaurant pays to appear as a *suggested* choice when lists auto-populate. Must be clearly labeled and never guaranteed to win — trust is the product. Only viable with real volume.
4. **Not recommended:** display ads (kills the lightweight social feel), selling data (no accounts, nothing to sell, keep it that way as a feature: "no login, no tracking" is a marketing line).

### 2a. Pricing decision + expanded monetization (added v1.1)

**DECISION ANALYSIS — $0.99 pay-to-play: rejected.** Two-player game → the invite is the acquisition channel; an upfront paywall makes every invitee pay before joining → invite conversion collapses (violates the distribution-is-binding-constraint principle). Math: at ~$0.84 net (Apple Small Business Program = 15% under $1M), $5k/mo requires ~6,000 *new* downloads every month with zero recurring revenue — and paid apps get minimal organic discovery. **Free-to-play; monetize the engaged.**

**Missed strategies (now in the mix):**
| Strategy | Why it works here | Notes |
|---|---|---|
| **Meal-kit CPA** ⭐ | "Cook at home" winners → HelloFresh/Factor-style referrals; meal-kit CPAs are rich (~$10–20+/signup vs ~$5 delivery) | Highest-value affiliate line; add to §6 winner-screen mix |
| **Restaurant gift cards** | Commission per sale via gift-card networks; **no new-customer restriction** (unlike delivery CPAs) | "Gift a dinner" also fits couples gifting |
| ~~Lifetime premium unlock~~ | **REJECTED (2026-07-01): subscription only** — recurring revenue compounds toward the $5k target; one price point simplifies the paywall | **REPRICED + BUILT (2026-07-05): $2.99/mo + $24/yr** (research band was $4–8; $2.99 chosen as impulse-level near the floor). Premium gates: streak display, full history depth, choice win-rates (topWinners). Free accounts: cross-device history (last 10 games) + games-played count. Stripe Checkout/portal/webhook shipped on feature/accounts-history |
| **Cosmetic IAP** | Themes, card decks, cut animations; monetizes without gating utility; couples gifting angle | Post-traction |
| **Tip jar** | "Buy us a dinner" — zero friction, indie-couple story makes it land | ✅ **Shipped 2026-07-04**: Venmo link + Stripe pay-what-you-want Payment Link, env-var-gated (`VITE_TIP_*`). Placements (research-backed post-value moments only): "Game created" screen card, winner-screen compact line under the affiliate card, landing footer. Plus a "Premium coming soon" tease on the created screen logging `premium-interest` via the linkClick pipeline — free interest data ahead of the premium build. Tip UI is **web-only** (hidden in the Capacitor shell): Apple 3.1.1 requires IAP for in-app developer tips, external payment links risk rejection. Expectation set honestly: comparable apps see ~0.01–0.1% tip conversion (Spliit: $42 from 30k users) — goodwill + hosting money |
| **Brand preset packs** | Sponsored curated lists (adjacent to sponsored slots) | Later, needs volume |

**Infra cost offset (reframe: make costs tiny, don't "cover" them):**
- Marginal cost per game ≈ fractions of a cent; adaptive polling (§10 Tier 1) is the single biggest cost lever (~10× on the dominant line item).
- **AWS Activate credits**: apply — $1k+ for founders/startups, commonly missed, we qualify.
- Billing alarm + Cost Anomaly Detection (§10) = backstop.
- Affiliate line covers AWS from modest volume; below that, the bill is beer money. No cost-driven architecture changes warranted beyond Tier 1.

Accounts (decided: full accounts OK): stage it. Keep no-login for playing forever — the join flow must never gain friction. Add optional sign-in (Cognito with Apple/Google, AWS-native and free-tier friendly) only as the unlock for premium, cross-device history, and saved lists. Accounts also give you first-party engagement data ("N% of signed-in users play weekly"), which strengthens the partnership pitch beyond anonymous click data.

## 3. Native apps

Don't rewrite. Ladder of effort:

| Step | Effort | What it buys |
|---|---|---|
| PWA polish (current) | done | Works everywhere |
| **Android via TWA** (Bubblewrap) | ~days | Play Store listing, install prompt, ~free since already PWA |
| **iOS via Capacitor** | ~1–2 wks | App Store listing, **native APNs push** (removes the iOS 16.4 home-screen requirement — the single biggest UX friction), share-sheet integration |
| React Native rewrite | months | Only if deep native features needed; currently none are |

Capacitor wraps the existing React 18 + Vite build; backend unchanged except adding an APNs sender path next to Web Push (or route both through a service like OneSignal to keep Lambda simple). App Store review note: Apple dislikes bare web wrappers — native push, haptics on elimination, and share-sheet integration are enough native surface to pass.

### iOS two-phase ladder (revised 2026-07-04: build free now, pay to launch)

**Phase A — working iOS app, $0 (in progress, branch `feature/ios-capacitor`):**
- Capacitor 8 wrap (SPM, no CocoaPods; Xcode 26; appId `com.austinjuliuskim.choices`), WebView origin `capacitor://localhost`. **CORRECTION (2026-07-05):** that origin *cannot* be allowlisted on the Function URL — Lambda rejects non-http(s) CORS origins entirely (failed the prod deploy, stack rolled back; preview's `*` wildcard had masked it). Solved via **CapacitorHttp** in `capacitor.config.json`: the native layer makes the API requests, so WKWebView CORS never applies. Lesson: preview with wildcard CORS can't validate CORS changes.
- Native polish that doubles as the review surface later: **haptics on cut + winner**, **native share sheet** for invites (share URL is always the web origin, never `capacitor://`), affiliate links via SFSafariViewController.
- Turn updates = existing adaptive polling. Web-push/service worker are inert in WKWebView, and **free provisioning has no push entitlement anyway** — APNs is structurally a Phase B item.
- Testing: iOS Simulator (no Apple account needed) + free "personal team" on-device installs (7-day profile expiry, 3-app limit, Developer Mode required on the phone).
- Validation goal: full games played on a real iPhone against prod; wife-approval of the native feel.

**Phase B — pay to launch (gate: Phase A validated + go decision):**
- [ ] Enroll in Apple Developer Program ($99/yr — approval takes days; enroll at the go decision, not before).
- [ ] APNs key + backend sender: extend `backend/push.mjs` + `subscribe` action with a platform discriminator; device tokens via `@capacitor/push-notifications`.
- [ ] Universal links: `/.well-known/apple-app-site-association` on the existing S3+CloudFront site (SPA-rewrite function already passes dotted paths through) + Associated Domains entitlement — invite links then open the app.
- [ ] App Store assets per locked ASO (§9): name **"Choices"**, subtitle *"Decide what to eat, together"*; screenshots; privacy questionnaire = no accounts, no tracking (affiliate links disclosed).
- [ ] TestFlight beta → review (guideline 4.2 minimum-functionality: Phase A's haptics/share/browser polish is the answer).
- Note: Tier-1 hardening (§10b) is Capacitor-compatible by construction — the wrapped app calls the same hardened `/api` CloudFront origin as the web app.

## 4. Moderation

Threat model today is small: user text (choice names + list titles) is visible only to the two players in a pairing, and everything TTLs out in 30 days. That changes when link previews (§1) put user text into public iMessage/social previews, and when group mode widens the audience.

- **Now (cheap):**
  - Server-side wordlist/profanity filter on choice text at `createPairing`/`rematch` (a maintained npm wordlist is fine; skip ML-grade filtering at this scale).
  - Per-IP rate limiting via WAF on create/join actions (also blocks code-space enumeration).
  - Length caps + strip zero-width/control characters.
- **With link previews:** filter applies especially to any text rendered into OG previews — that's the public surface.
- **With group mode / user-shared presets:** add a report action (`REPORT#` item + SNS email to you), and a kill switch to revoke a pairing ID.
- **Compliance:** if minors can use it (they can), keep zero PII collection — current no-account design is already the right posture. Revisit only if accounts arrive.

## 5. Delivery integration (the big idea)

Winner → order flow, phased so each phase ships value without waiting on partners:

- **Phase 1 — Deep links + affiliate (no partnership needed).** Winner screen builds a search deep link into Uber Eats / DoorDash / Grubhub for the winning choice + user's city, tagged with affiliate IDs. Ship in a weekend.
- **Phase 2 — Smart pre-seeding.** Google Places API (or Yelp Fusion) populates choice lists with nearby restaurants, ratings, price level, and open-now status. The game becomes "pick from 4 real restaurants near you" — and the winner link goes to a *specific* restaurant, not a search. Places API has a monthly free credit that covers early volume.
- **Phase 3 — Deals surfacing.** Show active promos/deals per platform on the winner screen ("$0 delivery on DoorDash right now"). Initially via affiliate feed data; properly via partner APIs.
- **Phase 4 — Formal partnership.** With conversion data from Phases 1–3 ("X% of completed games convert to an order"), pitch DoorDash/Uber Eats BD for API access, co-marketing, or placement fees. The pitch writes itself: Choices captures users at the exact moment of purchase intent, *after* the decision problem is solved.

Guardrail: never let monetization bias the game itself. The eliminate mechanic must stay neutral — deals and ordering appear only *after* a winner exists.

## 6. Detailed spec: affiliate deep links (Phase 1)

### Program landscape (verified Jul 2026)
| Program | Model | Payout | Notes |
|---|---|---|---|
| Uber Eats (via Impact) | CPA, first order by new user only | ~$5 flat (negotiable with volume) | ~30-day cookie; $250 minimum payout; manual approval based on brand safety and active-user counts |
| DoorDash (via Impact) | CPA, new customer | up to ~$50 per action depending on campaign; ~14-day cookie | Separate consumer / driver / merchant tracks — use consumer |
| Grubhub | CPA, new customer | ~$5 per new customer | Third option increases odds the user is "new" somewhere |
| OpenTable | Per seated diner | per-reservation payout | Covers the dine-out case — the game isn't only delivery |
| Skimlinks / Sovrn (aggregators) | Auto-affiliates outbound links | lower rates | Instant approval — fallback while Impact applications pend |

### Application strategy
Impact approvals are manual and weigh active users, so a brand-new app may be rejected. Sequence: (1) sign up for an aggregator now for instant coverage, (2) apply to Impact programs once there's a public site with real traffic, (3) reapply/negotiate after volume data exists. Apply **early** in the roadmap — approval lag is the long pole, not the code.

### UX design
Winner screen, after celebration animation:
- **"Get [winner]"** card with 2–4 buttons: Uber Eats, DoorDash, Grubhub, and *Reserve a table* (OpenTable) when the choice looks like a restaurant name.
- **Cook-at-home winners** ("tacos at home", "pasta night"): swap the delivery buttons for **meal-kit CPA links** (HelloFresh/Factor-style — richest CPAs in the mix, ~$10–20+/signup) + a recipe search link. Detection heuristic: no Places match / generic dish name → cook-at-home treatment.
- Multiple platforms is deliberate: it respects user choice (trust), and each platform only pays for its own new users, so coverage maximizes the chance of a payable conversion.
- Deep link format: platform search URL for the winning choice text (+ locality once Places pre-seeding exists, at which point links go to a *specific* restaurant page — much higher conversion).
- Never show ordering UI before a winner exists (per §5 guardrail).

### Implementation notes
- Pure frontend feature — no backend changes. A small `affiliates.js` config maps platform → link template → tracking ID.
- Track every outbound click (add a `linkClick` action to the Lambda, or a lightweight beacon) — this is the dataset the partnership pitch is built on: *games completed → winner screens shown → order clicks → (Impact-reported) conversions*.
- Detect "is this a restaurant?" cheaply: until Places integration, just always show the buttons; irrelevant winners ("stay home and cook") simply won't get clicks — that's signal too.
- FTC/network compliance: a one-line "we may earn a commission" disclosure near the buttons.

### Realistic revenue math
Per 1,000 completed games: assume ~25% tap an order button (250 clicks) → most clickers already have accounts, so maybe 2–4% are payable new users → 5–10 conversions → **~$25–150/mo at 1k games/mo**. Conclusion stands: this pays for AWS, not rent. Its real value is conversion data + the habit of ending every game with an order CTA, which is exactly the behavior a formal partner would pay real placement fees for.

## 7. Group mode: finding the fun

Premise check before building anything: the 2-player loop has a hidden balance that naive extension breaks.

### Why 2-player works
With 4 choices and B→A→B elimination, **B makes the final cut from 2 remaining — B picks the winner.** The counterweight is that **A curated the list.** Curation power vs. elimination power. Psychologically, the winner is *chosen by no one and everyone*: no blame, no apathy, both invested.

### Fun rubric (any variant must satisfy all four)
1. Every player destroys at least once (agency via loss aversion)
2. No single player unilaterally selects the winner
3. Fast — ~2 minutes of total moves, tolerant of async gaps
4. Outcome feels earned, not random

### Variants considered
| Variant | Mechanic | Rubric verdict |
|---|---|---|
| **V1 Round-robin turns** | N players alternate, C = N·R + 1 choices | ❌ Last eliminator picks winner with no curation counterweight; kingmaking; async turn-waiting compounds |
| **V2 Snake order** | 1-2-3-3-2-1 elimination order | ⚠️ Mitigates last-mover but needs 2N+1 choices (list-creation friction) and doubles game length |
| **V3 Simultaneous secret elimination** ⭐ | Each round all players secretly strike one; reveal together; repeat until one remains | ✅ No turn order (async-friendly — round resolves when everyone's in); reveal = drama beat; kingmaking muted (no reacting to others); same rules scale 2→8 |
| **V4 Bracket** | 8 choices, head-to-head majority votes | ⚠️ Fun + highly shareable, but longer — candidate for premium mode, not core loop |
| **V5 Veto + wheel** | One veto each, random pick from survivors | ⚠️ Fails rubric #4 for the core loop; fine as a party quick-mode |

### V3 edge rules to design
- **Total wipeout** (strikes eliminate everything remaining): "spared by chaos" — one struck choice randomly survives, or sudden-death revote. Lean toward making it a celebrated moment, not an error state.
- **Duplicate strikes**: multiple players strike the same choice — it dies once; rounds can eliminate 1..N choices, so game length is variable (feature: tension).
- **Choice count**: recommend C = 2N for N players (8 choices for 4 players) so games last 2–4 rounds.
- **2-player degenerate case**: V3 at N=2 is a *different* game than current (simultaneous vs. alternating) — keep classic mode as-is; V3 is "party mode."

### Validation plan (Rule-4 low-risk experimentation)
1. `game.mjs` is pure/I/O-free — write each variant as a reducer beside the existing logic.
2. Monte Carlo with simple agent strategies (greedy = protect favorite, spiteful = strike others' favorite): measure seat fairness (win-rate by position), agency (P(favorite survives | strategy)), and average rounds. Kill variants that fail on paper.
3. Feature-flag branch, real playtest: Austin + wife + one friend group. Judge by "did people laugh at the reveal" more than metrics.
4. Only then invest in UI/notification work for multi-player rounds.

### Model routing for this workstream
- Fable/Opus: variant rule design, tie-break edge cases (done in this doc, refine as needed)
- Sonnet: reducer implementations + Monte Carlo harness in `backend/`
- Haiku: none needed

## 8. Path to $5k/mo (honest math)

Affiliate CPA alone requires 50k–200k games/mo at §6 rates — not the engine. The realistic stack:

| Revenue line | At what scale | Contribution |
|---|---|---|
| Premium (~$2.50/mo) | 2,000 subs ≈ 40k–100k MAU at 2–5% conversion | The backbone: ~$5k at target MAU |
| Sponsored choice slots (local restaurants, via Places pre-seeding) | Sellable from ~10k MAU in dense metros | Highest $/user; same model DoorDash sells merchants; needs self-serve or light sales |
| Affiliate CPA | Any scale | Covers AWS + funds the data story |
| Partnership placement fees | Post-traction, pitched with §6 click data | Step-change, not plannable |

**North Star: MAU and games/week — the binding constraint is distribution, not features.** Growth channels, in priority order:
1. **Short-video content**: the V3 reveal moment and the couples' "how we decide dinner" ritual are inherently TikTok/Reels-shaped. Build a share-the-reveal feature (auto-generated result card/clip) so users make the content.
2. **OG link previews** (§1) — every invite is an ad.
3. **App-store presence** (§3 Capacitor/TWA) + ASO around "what to eat" queries.
4. **SEO**: "what should we eat tonight" landing pages that start a game instantly.

Implication for sequencing: Places pre-seeding is promoted from Phase-2 nicety to **core product** — "4 real restaurants near you, cut to dinner" is the ownable category position for a food-focused brand.

## 9. Naming

### DECISION (2026-07-01): keep the name "Choices" — fix via UX/copy, not a rename
Name has emotional equity with the core users (Austin + wife). The two original complaints are copy problems, not name problems, and both are solved without renaming:

1. **"Elimination" confusion → solved by the verb.** Name = *Choices* (the nouns); action = *cut* (§ verb rename). Coherent: you're given choices, you cut them to one. "Eliminate/elimination" never appears in user-facing copy. Core line: **"4 choices. Cut them down. 1 winner."**
2. **Marketability → solved by lockup + brand voice, not the word.**
   - **App Store ASO lockup:** display "Choices" + keyword subtitle — *"Choices: Decide What to Eat"* / *"Choices — Dinner Decider."* Users say "Choices"; search sees the food angle.
   - **The ritual becomes the brand voice** (the real differentiator): the couple's "race to be the one who gives choices" → teasing copy everywhere. Invite: *"Alex gave you Choices 😏 — your move."* Push: *"You've got Choices."* Reveal card: *"Nobody picked this. Everybody picked this."* A generic word can't differentiate; this voice can.

**Trademark caveat (real side business, $5k/mo target):** bare "Choices" is descriptive → hard to register in the food/game class, clean domains likely taken. Acceptable early (compete on product + distribution as an unregistrable common-law mark). If it scales, register a distinctive **logo/stylized wordmark** rather than the word. Low stakes now.

**Copy/voice workstream (Sonnet):** rewrite invite message, push copy, reveal card, onboarding, and App Store subtitle in the teasing "give them Choices" voice. **Vetting (Haiku):** sweep `getchoices.app` / `playchoices.app` / `choices.game` domains + App Store "Choices" collision check for the subtitle lockup.

### Copy pack v1 — teasing voice (draft; Sonnet to refine + implement)

**App Store**
- Name: **Choices**
- Subtitle (⚠️ iOS 30-char limit): *"Decide what to eat, together"* (28) — carries the "decide what to eat" keyword for ASO.

**Invite / share link**
- Primary: *"{name} gave you Choices 😏 Your move →"*
- Alt: *"You've got Choices. Cut wisely. →"*

**Push notifications**
- Invited: *"{name} gave you Choices."*
- Your turn: *"Your move. Cut one. 😏"*
- Nudge: *"Still deciding? Someone's getting hangry."*
- Winner: *"Dinner's decided. 🏆"*

**Reveal card (shareable — §8 growth channel)**
- Headline: *"Nobody picked this. Everybody picked this."*
- Result: *"{winner} survived. Dinner's served."*

**Onboarding one-liner**
- *"4 choices. Cut them down. 1 winner. No blame, no apathy."*

**In-game microcopy**
- Action button: **Cut**
- After a cut: *"You cut {loser}. {survivor} survives. 😈"*
- Waiting: *"Waiting on {name} to cut…"*

> Voice rule: teasing but never mean; the target is the *situation* (indecision), not the partner. Emoji sparingly (😏 😈 🏆), never more than one per line.

---
*Naming exploration below is retained for record — superseded by the decision above.*

Problem: "Choices" is generic (un-searchable, weak trademark) and collides with the elimination mechanic in copy.

**Verb fix (independent of name):** rename the core action to **"cut"** — food-native, one syllable, self-writing copy: *"Alex cut Tacos. Pizza survives."*

**Name candidates** (tests: reads well in an iMessage invite, food-native, trademarkable, sticky):

*Round 1:*
| Name | Case for | Watch-outs |
|---|---|---|
| **Winner Dinner** | Rides "winner winner chicken dinner" (pre-installed in culture); literally describes product; rhyming = sticky | Two words; check TM crowding around the phrase |
| **Last Bite** | Last-one-standing + food; premium brandable | Common phrase — TM/app-store collisions likely |
| **Chowdown** | Showdown pun; one word (good ASO) | Slightly generic food-app energy |
| **Sudden Dinner** | Sudden-death pun; most meme-able | Joke names can age |

*Round 2 — organized by brand energy:*
| Energy | Name | Case for | Watch-outs |
|---|---|---|---|
| Clean/brandable | **Settle** ⭐ | Double meaning (settle the argument / settle on dinner); verb-native ("let's settle it"); premium, ages well | Not food-explicit; fintech TM crowding — search carefully |
| Clean/brandable | **Plateoff** | Bake-off pattern; food + competition in one word; likely open namespace | Slightly invented-word feel |
| Playful/viral | **Snackdown** ⭐ | Smackdown pun; "You've been challenged to a Snackdown" is a perfect push notification | WWE association (playful, probably fine) |
| Playful/viral | **Food Feud** | Alliterative; names the exact problem (the nightly standoff) | Family Feud adjacency; check game-name collisions |
| Mechanic-native | **Three Strikes** | Classic mode is literally 4 choices, 3 cuts; teaches rules instantly | Group mode breaks the count |
| Warm/social | **Tastebuds** | Taste + buds; fits the couples story | Reads as foodie social network; crowded TM space |
| — | *Down to One* | Whole game in three words | Better as tagline than name |

Current gut ranking: **Settle** (serious business build) > **Snackdown** (max viral energy) > **Winner Dinner** (culturally pre-installed).

### Round 2 rejected (2026-07-01): Settle, Plateoff
Both felt too *hard/corporate* on partner review. Brief corrected: the winning direction is **soft, cute, rolls-off-the-tongue like "Choices"** — a word you'd playfully call out, not a startup name. Wife is attached to "Choices" itself; ideal name evolves from it rather than replacing it.

**Ritual insight (the real brand core):** the couple *races to be the one who gives the choices*, specifically so they don't have to pick the winner. The name should evoke that quirky, teasing call-it-first energy.

### Round 3 finalists — soft/cute/couples-teasing
| Angle | Name | Case for | Watch-outs |
|---|---|---|---|
| Keep Choices DNA | **Choosy** ⭐ | Born from choose/choices (preserves wife's attachment); brandable + trademarkable where "Choices" isn't; "choosy eater" is food-native + teasing | Confirm namespace |
| Keep Choices DNA | **Choicey** | Even closer to original, cuter | Awkward spelling; weak TM distance from generic "choices" |
| Soft food mouthfeel | **Nibbles** | Plural + soft like Choices; playful; unmistakably food | Common word — TM crowding |
| Teasing/quirky | **Picky** | "Picky eater" = pure teasing energy; two syllables, rolls off tongue; couple-needling fit | Generic-ish; check crowding |
| The call-it ritual | **Dibs** | Literal race-to-call-it word; matches the couple's trigger ritual exactly | Means "claim," not "cut" — energy over literal meaning |
| The mechanic, softly | **Whittle** | Soft/cute; literally "reduce down" (the game mechanic); rolls off tongue | Not food-explicit |

**Lead recommendation: Choosy** — solves the marketability/trademark problem *without* abandoning the word the wife loves; she may read it as a natural evolution of "Choices," not a replacement. Food-adjacent and teasing, which fits the couples-first vibe.

**Decision rule:** if wife approves "Choosy" as an evolution of Choices AND it clears namespace → take it. Fallbacks by vibe: **Picky** (teasing) or **Dibs** (ritual energy).

**Next steps (Haiku in Claude Code):** USPTO TESS knockout search for Choosy / Picky / Dibs / Nibbles; App Store + Play Store name search; domain sweep (`choosy.app`, `getchoosy.app`, `.com` variants); out-loud invite test — "Join my Choosy game" vs. "Join my Picky game" — with the actual target users (Austin + wife first).

**Vetting checklist (Haiku-tier tasks):** USPTO TESS knockout search → App Store / Play Store name search → domain check (`.app` acceptable) → say-it-out-loud invite test ("Join my ___ game"). Decide before Capacitor work (§3) — app-store identity is expensive to change later.

## 10. Scale hardening: the 1M CCU thought experiment + observability

Framing: serverless doesn't topple, it **bills**. Failure modes at viral scale are (a) silent AWS quota throttling → mass 429s, (b) runaway invoice. Plan = kill polling, pre-raise quotas, add kill switches, alarm on cost first.

### The math that matters
- **Polling is 99% of the problem:** 1M CCU ÷ 3s = ~333k req/s ≈ 29B Lambda invocations/day ≈ five-figure daily cost. Everything else is noise until this dies.
- Real-time push instead: users act every ~20–30s → event volume is small; WebSocket infra at 1M CCU ≈ low hundreds of $/day.
- DynamoDB: per-pairing partition keys distribute evenly — no hot partition risk even at 1M games. On-demand scales, but **account/table throughput quotas are soft limits that must be raised in advance**.

### Tiered plan

**Tier 1 — do now (cheap, needed anyway):**
- CloudFront + **WAF in front of the Function URL** (it has no native throttling — this is topple-prevention at any scale); per-IP rate rules.
- **Adaptive polling**: 3s on active turn → 15–30s idle → pause on `visibilitychange`. ~10× load cut, one afternoon.
- Client resilience: exponential backoff + jitter on 429/5xx; **idempotency key on every mutation** (retry storms must not double-cut).
- 1s CloudFront cache on `getState` keyed by pairingId (state is identical for both players — edge absorbs reads).
- AWS **Budgets alert + Cost Anomaly Detection** (see observability — alarm #1).

**Tier 2 — viral-ready (DECIDED 2026-07-01: build proactively, starting now — "we've got time"):**
- Replace polling with **API Gateway WebSockets or AppSync Events** (evaluate: AppSync Events is less plumbing; IoT Core is the budget fan-out trick). Keep polling as fallback path.
- Quota raises filed with AWS: Lambda account concurrency, DDB on-demand throughput, WebSocket connection rates. (Support tickets take days — file before launch spikes, not during.)
- Push fan-out behind **SQS + worker Lambda** (batching, 429 handling from push services); with Capacitor apps, FCM/APNs via SNS handles native fan-out.
- **Kill switches / feature flags** (SSM Parameter Store): shed Places calls, reveal-card generation, non-essential features under load; core game survives.
- Load test the full game loop with k6/Artillery against a staging stack; find the real quota walls before users do.
- Longer game codes when `CODE#` collision retries climb (monitor now, act later).

**Tier 3 — only if real (prove-first: don't build ahead of need):**
- DynamoDB Global Tables + regional Lambda for global-eventually latency/DR.
- Static "waiting room" page at CloudFront edge as last-resort surge valve.
- Provisioned concurrency only if cold-start p99 measurably hurts.

### Observability (solo-dev priority order)
| # | Signal | Implementation | Alert threshold |
|---|---|---|---|
| 1 | **Cost** | AWS Budgets + Cost Anomaly Detection → SNS → phone | Daily spend > 3× baseline |
| 2 | **Does it work** | CloudWatch Synthetics canary playing a full game loop (create→join→3 cuts→winner) every 5 min | Any canary failure |
| 3 | 5xx rate | CloudWatch metric per action | >1% over 5 min |
| 4 | Latency | p50/p95/p99 per action (EMF custom metrics from handler) | p99 > 2s |
| 5 | Throttles | Lambda throttles, DDB ThrottledRequests | >0 |
| 6 | Saturation | Lambda concurrent executions vs. quota | >80% of quota |
| 7 | Push health | Web Push send failure rate (excl. 404/410 expirations) | >5% |
| 8 | **Business heartbeat** | Games completed/hour (custom metric) | Anomaly-detection alarm: drop = broken UX even if HTTP is green |

- **Custom metrics via EMF** (Embedded Metric Format) from the existing Lambda — structured logs become metrics for ~free; also emit §8 North Star metrics (games created/completed, join conversion, invite→join, order-button clicks).
- **Dashboards:** one ops dashboard (golden signals), one business dashboard (North Star + funnel). CloudWatch native; revisit Grafana only if it hurts.
- **Frontend:** Sentry (or CloudWatch RUM) for JS errors + real-user latency — the canary can't see client-side breakage.
- **Tracing:** structured JSON logs + Logs Insights first; X-Ray only when multi-hop (SQS workers) exists.
- **Alarm routing:** SNS → phone/Slack; composite alarms to avoid pager storms (e.g. throttles AND 5xx before paging).

### 10a. Real-time push migration spec (locked 2026-07-01)

**Decision: AppSync Events** (over API Gateway WebSockets, over IoT Core).
Rationale: API GW WebSockets requires self-managed connection lifecycle (connections table, $connect/$disconnect handlers, stale cleanup, per-connection fan-out loops). AppSync Events removes that class of code entirely — clients subscribe to channels, server publishes via one HTTP call, AWS owns connections. IoT Core is the cheapest mega-fan-out but adds device/policy impedance for no benefit at 2-player granularity. *(Haiku task: verify current AppSync Events vs API GW WS pricing before build — rough order: both land low-hundreds $/day at 1M CCU, i.e. rounding error vs. polling.)*

**Architecture**
- Channel per game: `game/{pairingId}`. Client subscribes on load; Lambda publishes after every state mutation (claimSeat, cut, rematch).
- **Auth:** Lambda authorizer on subscribe validating the existing `{pairingId, role, token}` triple — channel-scoped, players can only join their own game. No new identity concepts.
- **Event payload = full state snapshot + monotonic `version`** (state is <4KB). Client applies iff `version > local`. No event→refetch round trip; out-of-order delivery harmless. `getState` remains source of truth for (re)connect hydration.
- **Polling demotes, never dies:** fallback when WS unavailable (local dev, exotic browsers) + slow 30–60s keepalive as divergence safety net.
- **WS + Web Push are complementary:** sockets die when iOS backgrounds the app. WS = foreground realtime; Web Push/APNs = "your turn" while backgrounded. Both stay.

**Client connection manager (frontend)**
- States: `connecting → open → degraded(polling)`; exponential backoff + jitter reconnect; resubscribe + `getState` hydrate on `visibilitychange`/resume; drop to polling after N consecutive failures; surface nothing to the user (seamless).

**Backend changes**
- New `backend/realtime.mjs`: `publishState(pairingId, state)` — called at the end of each mutation path. Game logic (`game.mjs`) untouched (stays pure).
- SAM: AppSync Events API resource, Lambda authorizer fn, env var for the events endpoint.

**Migration phases (each shippable, feature-flagged via SSM param)**
1. **P0 — Adaptive polling** (Tier 1, ships anyway; becomes the fallback layer)
2. **P1 — Publish side:** AppSync resource + authorizer + `publishState` calls; nothing consumes yet (dark launch, verify in console)
3. **P2 — Subscribe side:** client connection manager behind flag; polling continues in parallel; compare state convergence in logs
4. **P3 — Demote polling** to 30–60s keepalive; extend Synthetics canary to assert a WS event arrives after each cut

**Testing:** local dev uses polling path (AppSync needs cloud); staging load test (k6 WS scenario) before flipping the flag; canary is the production regression net.

**Effort:** ~2–4 days of Sonnet work total (P1 ~1d, P2 ~1–2d, P3 ~0.5d).

### 10b. Tier-1 design decisions (locked 2026-07-04, revised same day after pricing-plan discovery; on `main`)

**Discovery (2026-07-04):** the prod distribution is subscribed to a **CloudFront Free flat-rate pricing plan** (WAF/DNS/TLS bundled, 1M req + 100GB/mo allowance, no overages). Decision: **stay on the plan** ($0/mo beats ~$11/mo self-managed WAF). Plan constraints that reshaped Tier-1: the protection-pack web ACL (`CreatedByCloudFront-*`) can't be removed/replaced; custom cache policies are Business-tier+; WAF is capped at 5 rules, plain per-IP rate rules only (no scope-down/URI/body match). Re-evaluate (cancel plan → PAYG, restore custom policies + git WAF) if the app outgrows the 1M req/mo allowance — the adapted design is portable both ways.

- **Topology:** one CloudFront distribution — add the Function URL as a second origin on the existing `SiteDistribution` with an `/api*` behavior. Same-origin API (`choices.austinjuliuskim.com/api`) kills CORS preflights; one WAF covers site + API.
- **getState → GET** (`/api?action=getState&pairingId=…`) — kept for portability, but the `/api*` behavior uses managed `CachingDisabled`: custom cache policies are excluded by the plan, and the caching-enabled managed policies put `host` in the cache key, which Lambda Function URL origins reject. No edge caching on the API; adaptive polling + rate limit are the load/cost controls.
- **Cache-safety invariant (kept):** `publicState` carries no `code` — `claimSeat` re-mints seat tokens from the code alone, so it must never appear in a response that could ever be cached. Client persists `code` in localStorage identity instead.
- **SPA fallback:** distribution-wide `CustomErrorResponses` (403/404→200 index.html) would corrupt API error bodies — replaced by a viewer-request CloudFront Function on the default behavior only (CloudFront Functions are included on all plan tiers).
- **WAF:** lives in the plan's protection pack (`CreatedByCloudFront-8bb2952d`), managed via WAF console/API — **not in git** (plan blocks ACL replacement; the standalone edge stack was built, then deleted). Contents: 3 AWS managed groups (IP reputation, Common, Known Bad Inputs) + `ChoicesRateLimitPerIp` 600 req/5min/IP (all traffic — plan forbids scope-down, so no createPairing-specific rule; generic cap + billing alarms are the backstop). All **Count mode** until soak completes.
- **Origin lock:** Function URL stays `AuthType: NONE`; CloudFront adds a secret `x-origin-verify` origin header the handler enforces behind an `ENFORCE_ORIGIN_HEADER` flag (enabled only after frontend cutover). OAC/IAM signing rejected (breaks simple POST clients).
- **Idempotency:** `version` attribute + conditional writes on pairing puts (also fixes a pre-existing lost-update race); client `actionId` UUID on eliminate/rematch with `lastActionId` replay in the handler. `game.mjs` stays pure. Client mutation wrapper: ≤3 retries, 400ms·2ⁿ + jitter, network/429/5xx only.
- **Adaptive polling state machine:** hidden tab **paused** (immediate refetch on visible); opponent's turn 3s; my turn 30s; waiting-for-join 15s; complete 30s; error backoff ×2 to 60s; ±20% jitter everywhere.
- **Billing alarms:** account-scoped + us-east-1-only + outside the least-privilege deploy role → separate `ops/billing-alarms.yaml`, deployed once manually with admin creds: SNS→email, $10/mo budget (80/100% actual, 100% forecast), anomaly monitor with IMMEDIATE $5 subscription.
- **Rollout:** everything verified on the `ChoicesWebApp-preview` stack first; phased flips (frontend cutover → origin-header enforce → WAF Block) land as separate merges to main.

### Model routing
- Fable/Opus: this architecture review (done; revisit at Tier-2 trigger)
- Sonnet: WAF/CloudFront config, adaptive polling, EMF metrics, canary script, SQS push worker
- Haiku: quota limit research, AppSync Events vs. API GW WebSocket pricing comparison

## Suggested sequencing (re-ordered v1.3: cost-first, iOS pulled up)

1. **Tier-1 hardening (§10, §10b)** — ✅ deployed to prod 2026-07-04 (origin-lock + WAF Block flips pending soak); canary/EMF observability follows; everything else in §10 waits for a growth trigger
2. **Brand voice + copy pass (§9)** — name locked as "Choices"; rewrite invite/push/reveal/onboarding + App Store ASO subtitle in the teasing "give them Choices" voice; "cut" verb throughout — ✅ built 2026-07-07 (branch feature/reveal-copy, rode the reveal-card PR; landing/invite/join/banners/pushes/title/manifest)
3. **Capacitor iOS app (§3 Phase A)** ← *in implementation 2026-07-04* — free-tier build + local validation; **Apple Developer enrollment deferred to the Phase B launch gate** (no fee until the app has proven itself on-device)
4. Affiliate deep links — ✅ shipped 2026-07-04 (merged); apply to Impact programs (approval lag is the long pole)
   - Tip jar + premium-interest tease — ✅ shipped 2026-07-04 (rode the same post-value surfaces; see §2a table). Ops to activate: create the Stripe PWYW Payment Link, set `VITE_TIP_VENMO_URL` / `VITE_TIP_STRIPE_URL` GitHub repo variables — ✅ activated 2026-07-05 (live Payment Link set, replacing the test-mode link; tip links restyled as pill buttons: "☕ Coffee me" / "🥐 Thanks a latte")
5. OG link previews + profanity filter (growth + its prereq) — ✅ built 2026-07-07 (branch feature/og-previews: /j/{code} origin-prerendered cards, render-time-only obscenity filter, join flow untouched)
6. **Shareable reveal card** (§8 channel #1 — users generate the marketing) — ✅ built 2026-07-07 (branch feature/reveal-copy: canvas card + native/web share + share-reveal beacon)
7. Places-powered pre-seeding — now core product (§8); spec'd in detail (typeahead layers + Fill-my-4) in [[Choices Suggestion Engine Plan]] — ✅ Phases 0/1/3 built 2026-07-07 (three stacked branches; dormant behind AnonSalt / PlacesApiKey / BedrockModelId ops tasks). **Fill-my-4 enabled live on prod + preview 2026-07-09** (Bedrock Haiku 4.5 access granted, `BedrockModelId` set — PR #24; see [[Choices Webapp]]).
8. Group mode validation — V3 reducer + Monte Carlo + playtest (§7)
9. Premium tier → sponsored slots → partnership pitch
   - **Accounts + history + streaks + billing — ✅ built 2026-07-05** (branch feature/accounts-history, pulled forward from this slot): optional Cognito sign-in (**Google-only v1** — Sign in with Apple needs the $99 enrollment deferred to iOS Phase B), guest mode untouched, GAME# archives + USER# stats (daily play streak — the game has no per-player winner, so streaks are Duolingo-style play days), Stripe billing ($2.99/mo, $24/yr). **Ops to launch:** Google OAuth client (Cloud Console), Cognito domain prefix + callback params, Stripe live Prices + webhook endpoint, samconfig parameter_overrides for both stacks. Account/purchase UI is web-only; iOS shell honors entitlements (Apple 3.1.3) **Ops completed — live on prod + preview 2026-07-05**: Cognito hosted-UI domains `choices-auth` / `choices-auth-preview` (Google IdP), Stripe live Prices + webhook on prod, test-mode mirror on preview, samconfig overrides for both stacks. Launch surfaced two fixes: the template's UserPoolClient property name was invalid (`AllowedOAuthFlowsUserPoolClientEnabled` → `AllowedOAuthFlowsUserPoolClient`; never validated while condition-gated off) and the deploy IAM policy needed Cognito actions (`docs/iam-policy.json` re-synced to the live policy, folding in drifted CloudFront/WAF actions).

## Open questions (v0.5)

- Name: which direction? (Pending Austin — see §9 shortlist.)
- Sponsored slots eventually need light sales or self-serve tooling — appetite for that side of the business?
- Streak *visibility* is premium-gated today, but 2026-07-05 market research (Duolingo, chess.com, Wordle) is unanimous: never paywall seeing the streak — it's the retention engine; monetize protection (freezes/repair) and derived insights instead. Revisit the premium gate split?

## Links
- Part of: [[Choices Webapp]], [[Projects MOC]]
- Strategy above: [[Relational Games Studio Roadmap]] · Rules: [[Studio Design Constitution]] · GTM: [[Choices Marketing Proposal]] · Suggestions/AI: [[Choices Suggestion Engine Plan]]

## Model routing (for execution)
- Opus: partnership pitch strategy, group-mode game logic design
- Sonnet: Capacitor wrap, affiliate link integration, OG preview edge function, WAF/polling changes
- Haiku: affiliate program signups research, wordlist selection, Places API pricing checks
