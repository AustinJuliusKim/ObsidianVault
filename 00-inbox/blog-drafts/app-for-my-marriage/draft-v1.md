# Draft v1 — I built an app for my marriage

**Title options:**
1. I built an app for my marriage
2. The argument we automated
3. Nobody picks dinner anymore

**Status:** draft-v1, in-session pipeline run (harness row 8, 2026-07-22). Every claim traces to `sources.md`; six [PENDING #n] slots await the gap interview — **do not fill them with anything invented, and nothing publishes until gap #5 (her genuine enthusiasm) clears.** Publish gate: App Store launch. Awaiting Austin's edit pass — do not publish.

---

It's 6:47pm. You know the conversation.

"What do you want to eat?"
"I don't know… whatever you want."
"I picked last time."

We call it The Loop, and for years my wife and I had exactly one defense against it: a race. Whoever said the word *"choices"* first won. The loser had to come up with four options. The winner had to accept whatever survived — no complaining. [PENDING #1: the specific evening this started — where we were, who lost, what we ate.]

We've run that ritual for years. Last month I built it into an app.

## The mechanic hiding in a marriage

Here's what I eventually noticed about our game, and it took me embarrassingly long: **nobody ever picks the winner.**

One of us lists four options. Then we take turns *cutting* them — one at a time, alternating — until a single option is left standing. That's dinner. Nobody chose it. Both of us shaped it. There is no one to blame and no way to be apathetic, because everyone acted and no one decided.

Elimination, not selection. That's the whole product. When I finally wrote it down as code, the balance turned out to be load-bearing in a way I hadn't consciously designed: in the four-option game, the player who curates the list never makes the final cut. Curation power on one side, elimination power on the other. If you both play, the outcome belongs to both of you — which in a marriage is the entire point.

The reveal screen says it out loud: *"Nobody picked this. Everybody picked this."*

## Building it

I built Choices solo. v1 went live at choices.austinjuliuskim.com in June 2026; my wife was the first user, and she still is the standard — "wife-approval of the native feel" is the literal acceptance gate for the iOS build. [PENDING #3: the first real dinner the app decided — what won, what she said.] [PENDING #4: her v1 reaction beyond the story below.]

Some honest numbers, because I intend for every post here to carry at least one: the July growth push is 82 commits so far, sitting on 169 backend tests. The event lake logged 8 real games in its first 11 days — that is not a typo, and it's why my current problem is distribution, not features. Infrastructure runs $0/month on a CloudFront flat-rate plan. A one-person studio can be genuinely cheap if you let the constraints design the architecture — that story gets its own post.

## The rename that died in review

At one point I ran a full rename exploration — Choosy, Choicey, Picky, Dibs, Snackdown, a dozen more. Product-naming logic said "Choices" was too generic to compete for.

The exploration died in partner review. Every direction felt, in her words, too hard, too corporate. And she was right in a way the naming spreadsheet couldn't see: *Choices* is what we actually race to say at 6:47pm. The name has emotional equity with its first two users, and one of them holds a veto. We kept the name and fixed the voice instead.

That veto is real product governance, by the way. I recommend it.

## Designing so nobody loses

The deepest constraint in the app is one you can't screenshot: **the game has no per-player winner.** There's no head-to-head tally, no "you won 3 dinners this week." Streaks count *play days*, not victories — the Duolingo kind, not the scoreboard kind. Joining a game will never sit behind a paywall.

Every one of those is a deliberate refusal, and they all fall out of one design test I now apply to everything: *could this feature end up screenshotted into a fight?* If yes, it doesn't ship. A relationship game that produces receipts for arguments has failed at its only job.

That's also why I say Choices isn't a food app. The spin-the-wheel utilities it superficially resembles solve "pick a restaurant." This is a couples game that happens to output dinner. Different category, different rules, different loyalty.

## The takeaway you can steal

Find the blame in your product and design it out of existence.

Not the friction — the *blame*. The Loop persists in every couple's kitchen because both easy exits assign fault: deciding makes you responsible for a bad dinner, deferring makes you responsible for the stalemate. The mechanic that dissolved it wasn't a smarter recommender; it was restructuring the decision so that fault has nowhere to land.

Run the test on your own product: after your user's next bad outcome, who do they get to blame? If the answer is "themselves" or "their partner/teammate," there's a mechanic — not a copy tweak — that removes the defendant entirely. Build that.

[PENDING #2: close the loop with the worst hangry-evening story from before the app.] [PENDING #6: artifact — early screenshot or the first join code.]

---

*I'm building Choices (and the one-person, LLM-run studio behind it) in public. If you want the build logs — real costs, real conversion numbers, the failures included — subscribe here.* ← single CTA

---

## X thread (5 tweets)

1. It's 6:47pm. "What do you want to eat?" / "I don't know, whatever you want." / "I picked last time." My wife and I broke this loop with a game we'd play for years. Last month I built it into an app. 🧵
2. The game: loser of a race to say "choices" lists 4 options. Then you take turns CUTTING one until a single option survives. That's dinner. Nobody picked it. Everybody picked it. No blame, no apathy.
3. The balance is load-bearing: whoever curates the list never makes the final cut. Curation power vs elimination power. I didn't design that — our ritual did. I just wrote it down in code.
4. Honest numbers, one-person studio edition: 82 commits this month, 169 tests, $0/mo infra on a CloudFront flat plan, and 8 real games logged in 11 days. Distribution is the boss fight, not features.
5. The stealable part: find the *blame* in your product and design it out. After a bad outcome, who does your user get to blame? If someone, you need a mechanic — not copy — that removes the defendant. (Building in public here — follow along.)
