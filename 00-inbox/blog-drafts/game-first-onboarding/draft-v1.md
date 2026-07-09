# Draft v1 — game-first onboarding

**Title options:**
1. Two taps to playing: what Duolingo and Wordle taught me about onboarding
2. The product is the funnel
3. My app has no signup wall. That's the whole growth strategy.

**Status:** draft-v1, in-session shakedown of the synthesis pipeline. Every claim traces to `sources.md`. Awaiting Austin's edit pass — do not publish.

---

There's a Duolingo case study making the rounds: open the app and you're inside a lesson in about ten seconds. No homepage. No pricing page. The signup screen appears only *after* you've completed your first exercise. The author's three takeaways — lead with the product, make signup feel earned, design the first sixty seconds — are being passed around as advanced growth wisdom.

I want to make a stronger claim: this isn't a growth tactic you bolt on. It's a design constraint you adopt before you write any code, and it changes what you build.

I know because I run a two-person food-decision game called Choices — my wife and I are the two persons — and "game first" is written into its founding document. Here's what the pattern looks like when you commit to it from day one, receipts included.

## Two taps

Choices is a game for deciding what to eat. One player seeds four options and sends a link. The other player taps it. They alternate cutting options until one survives. Nobody picked the winner; everybody picked the winner. Dinner's decided, nobody's fault.

Here's the entire onboarding for the invited player:

1. Tap the link your partner sent you.
2. Tap "I was invited."

That's it. You're in the game, and it's your move. No typing — the invite code is prefilled from the link. No account. No app install. No pricing interstitial. No "just a few quick questions." Two taps, and the second one is a game decision, not an administrative one.

I can be precise about this because the flow is code, not aspiration: the join screen checks whether it was opened from an invite link, and if so it skips its own first step. The number of required signups on any path that leads to playing is zero. Not "zero until we raise a round" — zero as a design law, which I'll get to.

## Signup as "save your progress"

The case study's second principle is that signup should feel earned — Duolingo asks after your first exercise, and it reads as "save your progress" rather than "give us your email."

Choices has accounts. They exist for exactly one reason: to keep your game history and your streak — and our streak isn't even a scoreboard, it counts days *you both played*, because the game deliberately has no per-player winner. The account pitch appears in three places, and the placement is the point:

- A tertiary button on the landing page. It is literally styled with a CSS class called `ghost`.
- A one-line link on the **winner screen** — after the game delivered its value.
- A small corner pill once you're a regular.

You can play forever without touching any of them. The one feature that does require sign-in is an AI assist that fills in your four options for you — an accelerator, never the game. If you removed accounts from Choices entirely, the core product would be untouched. That's the test I'd offer other builders: if deleting your signup system would break your product's first session, your first session is built on the wrong foundation.

Same story for money. The tip jar and the premium tease render in exactly two places — the "game created" screen and the winner screen — both *after* the product has done its job. Premium gates history depth, never play.

## The constraint that did the designing

None of this came from an onboarding audit. It came from one sentence in the design document I wrote before building anything, in a list titled "kill tests":

> Does the invitee hit any wall (pay/signup/install) before playing? → kill.

Kill the feature, that means. Whatever it is, however clever, if it puts a wall in front of the invited player, it doesn't ship.

That single sentence made a surprising number of decisions for me:

- Identity had to work without accounts → so a player's seat is a token in their browser, scoped to the game.
- Invites had to carry everything → so the link itself contains the code, and the join screen skips ahead when it arrives.
- Monetization had to live post-value → so every revenue surface is on the far side of a finished game.
- Even the AI features inherited it → assists can ask for sign-in; play can't.

This is what the case study means by "map the user flow before writing a single line of code," but I'd sharpen it: don't map the flow — *write the law*. A flow diagram gets renegotiated every sprint. A kill test doesn't.

## The honest frictions

Credibility requires the other column. Choices has three real frictions I haven't eliminated:

1. **The seat picker.** After tapping an invite, you choose "I created this game" or "I was invited." It's one extra decision on the hottest path in the product. It exists so a couple can't accidentally claim the same seat — a real problem — but I count it as a tax.
2. **The web-app install gap.** Choices is web-first. Playing takes zero installs (that's the point), but *push notifications* on iOS require adding to the Home Screen. The App Store build exists to remove that friction, and I'm measuring exactly how much it costs before-and-after — that delta will be its own post.
3. **A landing page exists.** Two buttons, but the purist version of this pattern would deep-link everything and have none.

Perfection isn't the standard. Knowing which frictions you're paying for, and what you get for them, is.

## The Wordle ending

The "infamous" version of this pattern isn't Duolingo — it's Wordle. No app. No registration. No ads, no push, no purchases. A URL that *is* the game, once a day. And a share artifact — that emoji grid — that Josh Wardle adopted after players invented it on Twitter, which then did all of his marketing for him.

Two details from that story stick with me. Wardle built it for his partner: he and Palak Shah played it privately for months before it ever went public. And Shah shaped the product itself — she hand-curated twelve thousand candidate words down to the twenty-five hundred a person could reasonably know.

I didn't set out to copy Wordle, but I ended up somewhere familiar. Choices started as a ritual between my wife and me — whoever says "choices" first wins, and the loser has to provide the options. I built the ritual into an app. She's the reason it kept its name. Our reveal card — "Nobody picked this. Everybody picked this." — is designed to be shared the way that emoji grid is shared.

Maybe that's the real pattern under the pattern. Products built *for one specific person you love* tend to come out game-first by accident: you would never ask your wife to create an account before dinner. The discipline is refusing to add the wall later, when the person on the other end of the link is a stranger and the dashboard is whispering that you could capture their email first.

Every screen before your product is a drop-off you chose. Choose fewer.

---

*[CTA placeholder — builders → email list, pending blog infra: "I'm building Choices solo and writing up the decisions as I go — subscribe for the next one." / everyone else → choices.austinjuliuskim.com]*

---

**X thread (5 tweets):**

1/ Open Duolingo and you're in a lesson in 10 seconds. Signup only appears AFTER your first exercise. Everyone calls this genius onboarding. I think it's something simpler: a design law you adopt before writing code. Here's what it looks like in practice 🧵

2/ My app (Choices — a 2-player game for deciding dinner) onboards an invited player in two taps: tap the link, tap "I was invited." You're playing. No account, no install, no typing — the code rides in the link. Required signups on any play path: zero.

3/ The rule that did the designing, from the doc I wrote before any code: "Does the invitee hit any wall (pay/signup/install) before playing? → kill." One sentence decided my identity model (browser token, no accounts), my invite links, and where money is allowed to appear (only after a finished game).

4/ Signup still exists — as "save your progress." It's a ghost button (literally the CSS class) until you've won a dinner, then it's one line on the winner screen. Delete-test for your own product: if removing signup breaks your first session, the first session is built on the wrong thing.

5/ The famous version of this isn't Duolingo, it's Wordle: no app, no login, built by Josh Wardle *for his partner*, marketed entirely by a share artifact players invented. I accidentally followed the same path — built a game for my wife, and the reveal card does the sharing. Products built for someone you love come out game-first by default.
