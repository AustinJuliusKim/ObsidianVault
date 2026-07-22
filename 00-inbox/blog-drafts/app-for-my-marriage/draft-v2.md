# Draft v2 — I built an app for my marriage

**Title options:**
1. My wife and I have argued about dinner for years, so I built it into an app
2. I built an app for my marriage (she has veto power)
3. Nobody picks dinner anymore

**Status:** draft-v2, pipeline Run 3 (2026-07-22) — same sources as v1, re-drafted against [[Austin Voice Pack]] §Samples (3 LinkedIn posts). Six [PENDING #n] slots still await the gap interview; **nothing publishes until gap #5 (her genuine enthusiasm) clears, plus the App Store milestone.** Awaiting Austin's edit pass — do not publish.

---

It's 6:47pm and you already know how this goes. "What do you want to eat?" "I don't know… whatever you want." "I picked last time." Repeat until somebody's eating cereal over the sink out of spite.

My wife and I have run that exact loop for years, and somewhere along the way we accidentally invented a defense for it: a race. Whoever says the word *"choices"* first wins. The loser has to come up with four options. The winner has to live with whatever survives, no complaining allowed — those are the rules of the kitchen, ratified by nobody, enforced absolutely. [PENDING #1: the specific evening this started — where we were, who lost, what we ate.]

We've done this for years. So I built it into an app.

## The mechanic that was hiding in my kitchen

It took me an embarrassingly long time to notice what our dumb little race actually was: a genuinely well-balanced game that neither of us designed on purpose.

Here's how it works. One of you lists the options. Then you take turns *cutting* them, one at a time, until a single option is left standing. That's dinner. And the thing is — nobody picked it. You each shaped it, nobody selected it, so there's no one to blame and no way to check out of the decision. Elimination instead of selection, which sounds like a shower thought until you realize it dissolves the two ways couples actually lose this fight (deciding = you own a bad dinner, deferring = you own the stalemate).

When I finally wrote it down as code, the balance turned out to be load-bearing in a way I never consciously chose: the person who curates the list never makes the final cut. Curation power on one side, elimination power on the other, like a tiny constitutional government for pad thai. The reveal screen says the quiet part out loud: **"Nobody picked this. Everybody picked this."**

## Building it (between bottle feeds)

I built Choices solo, mostly in the margins around a 4-month-old — plan docs on my phone while she's asleep on me, Claude Code burning through the implementation when I'm back at a keyboard. v1 went live at choices.austinjuliuskim.com in June 2026. My wife was the first user, and honestly she's still the QA department: "wife-approval of the native feel" is the literal, written-down acceptance gate for the iOS build. [PENDING #3: the first real dinner the app decided — what won, what she said.] [PENDING #4: her v1 reaction beyond the story below.]

Some honest numbers, because I want every post here to carry at least one: the July push is 82 commits and counting, sitting on 169 backend tests, running on infrastructure that costs me $0/month thanks to a CloudFront flat-rate plan (that story deserves its own post, it's a good one). And the event lake I stood up logged 8 real games in its first 11 days. Eight! Which is not a typo, and is exactly why my current boss fight is distribution, not features.

## The rename that died in committee (the committee is my wife)

At some point I did the responsible founder thing and ran a full rename exploration. Choosy, Choicey, Picky, Dibs, Snackdown — a whole spreadsheet of names that would supposedly compete better than a generic word like "Choices."

The exploration died in partner review. Every direction felt, in her words, too hard, too corporate. And she was right in a way no naming framework was going to surface: *choices* is the actual word we race to blurt out at 6:47pm. It has years of emotional equity with its first two users, and one of them holds a veto. So we kept the name and fixed the voice instead, and I'm telling you, a co-founder who will kill your clever ideas for the right reasons is worth more than the spreadsheet. [PENDING #2: close the loop with the worst pre-app hangry-evening story.]

## Designing so nobody loses

The deepest rule in the app is one you can't screenshot: **there is no per-player winner.** No head-to-head tally, no "you won 3 dinners this week." Streaks count *play days*, not victories — the Duolingo kind, not the scoreboard kind. Joining a game will never cost money or require an account.

All of that comes from one test I now run on every feature: *could this end up screenshotted into an argument?* If yes, it doesn't ship. A relationship game that generates receipts for fights has failed at its only job, no matter how good the retention numbers look.

Which is also why I keep insisting Choices isn't a food app. The spin-the-wheel utilities it gets compared to solve "pick a restaurant." This is a couples game that happens to output dinner. [PENDING #6: artifact — early screenshot or the first join code we ever used.]

## The part you can steal

Find the *blame* in your product and design it out of existence.

Not the friction — the blame. The dinner loop survives in every couple's kitchen because both exits assign fault. The fix wasn't a smarter recommendation engine (believe me, the graveyard of "AI dinner picker" apps is vast); it was restructuring the decision so fault has nowhere to land.

So run the test on your own thing: after your user's next bad outcome, who do they get to blame? If the answer is themselves, their partner, or their teammate, you don't need better copy — you need a mechanic that removes the defendant. Build that instead.

---

*I'm building Choices — and the one-person, LLM-run studio behind it — in public: real costs, real conversion numbers, failures included. If that's your kind of thing, subscribe here and steal whatever's useful!* ← single CTA

---

## X thread (5 tweets)

1. It's 6:47pm. "What do you want to eat?" / "whatever you want" / "I picked last time." My wife and I have raced to say the word "choices" for years to break this loop — loser lists 4 options, winner can't complain. Last month I built it into an app. 🧵
2. The mechanic our kitchen accidentally invented: nobody PICKS dinner. You take turns cutting options until one survives. No blame (nobody chose it), no apathy (everybody acted). Elimination, not selection.
3. The balance is load-bearing and I didn't even design it: whoever curates the list never makes the final cut. Curation power vs elimination power, like a tiny constitutional government for pad thai.
4. Honest numbers from the one-person studio: 82 commits this month, 169 tests, $0/mo infra on a CloudFront flat plan, and 8 real games logged in 11 days. Eight! Distribution is the boss fight, not features.
5. The stealable part: find the BLAME in your product and design it out. After a bad outcome, who does your user get to blame? If it's a person, you need a mechanic — not copy — that removes the defendant. Building in public here, come steal things!
