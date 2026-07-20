---
title: Choices iOS GTM Plan
tags: [project, choices, gtm, legal, apple]
type: plan
status: developing
created: 2026-07-16
updated: 2026-07-16
---
# Choices iOS GTM Plan
> Purpose: business + legal go-to-market review and order of operations for the first iOS launch, through the first $400 earned via the App Store. Excludes code/dev work. Facts verified against Apple docs July 2026; sources at bottom.

Related: [[Choices Growth Plan]] (locked decisions), [[Relational Games Studio Roadmap]] (LLC/revenue posture), [[Choices Marketing Proposal]] (launch content), [[Choices CloudFront PAYG Migration Plan]] (cost baseline), [[Studio Design Constitution]] (privacy posture).

## Executive summary

- **Enroll as an Individual Apple Developer now** ($99/yr, no LLC or D-U-N-S needed). 2026 enrollment waits run days to weeks — this is the longest-lead item, so start it before anything else.
- **Launch US-only (plus optionally CA/AU/NZ), deselect all EU countries.** This sidesteps DSA trader disclosure (public address + phone on the listing) and keeps GDPR off the table for the app. Matches the locked "US-first" decision.
- **Two hard legal blockers exist today: no privacy policy and no terms of service.** Both are App Review requirements even for the free Phase A launch.
- **Path to $400 through the App Store = Phase B StoreKit IAP under the Small Business Program (15% commission).** ≈ $470 gross / ~17 annual subs or a mix (~20–25 paying subscribers). Expect the first bank deposit ~2–3 months after the first sale ($40 payout floor, ~45-day settlement, new-account holds).
- **Infra is hobby-budget at every tier asked about:** ~$10–15/mo at 100k req/mo, ~$15–25 at 1M, ~$50–120 at 10M. Per-call costs that could blow up (Bedrock, Google Places) are premium-gated, so they scale with revenue, not traffic.
- **Biggest unexamined gap: the App Store name "Choices" is almost certainly unavailable** (app names are unique per storefront; "Choices: Stories You Play" is a major existing title). A display-name variant will be needed; the locked subtitle survives.

## Order of operations

### Step 0 — This week (parallel with everything)
1. **Enroll in Apple Developer Program as Individual.** Needs only an Apple ID with 2FA + government ID. Longest external dependency (2 days–several weeks in 2026). $99/yr — the Roadmap's reinvestment budget already earmarks this.
2. **Accept the trade-off:** your **personal legal name appears as "Seller"** on the listing. Fix later by forming an LLC and converting Individual → Organization (supported; needs D-U-N-S, ~2 weeks). Consistent with Roadmap's "LLC when revenue is real."
3. **Draft + publish Privacy Policy and Terms of Service pages** on choices.austinjuliuskim.com. Needed for App Store metadata *and* in-app. (Termly/GetTerms-style generators are fine at this stage; upgrade when the LLC forms.)

### Step 1 — Account approved: App Store Connect setup (1–2 hrs + waiting)
1. Sign the **Paid Applications Agreement** (Agreements, Tax, and Banking).
2. Submit **W-9** tax info (US individual) and **bank details**. Income lands on Schedule C — start a simple expense log now ($99 fee, AWS, marketing are deductible).
3. **Apply to the Small Business Program** (not automatic). New developers qualify (<$1M prior-year proceeds); 15% commission applies from the first dollar once enrolled. Do this *before* the first paid transaction.
4. Reserve the app record: name (see naming gap below), bundle ID `com.austinjuliuskim.choices`, **availability = US only (deselect all 27 EU countries)**.

### Step 2 — Phase A free launch (per locked Growth Plan ladder)
Business/legal checklist for submission (dev work excluded here):
- **Privacy nutrition labels** — see data-collection answer below.
- **Age rating questionnaire** (expect 4+ or 9+; no gambling/UGC concerns).
- **Support URL + contact info** in metadata (can be a page on the domain, not your home address).
- **Export compliance**: standard HTTPS = exempt; answer the questionnaire, no filing needed.
- **Guideline 4.2 risk (minimum functionality):** a bare web wrap gets rejected. Phase A's planned native layer (push, haptics, share sheet, offline) is exactly the mitigation — treat it as a *review requirement*, not polish.
- **Review notes**: include a demo pairing code / test instructions so the reviewer can play a full game without a second device.
- If the iOS build ships **without sign-in** (premium hidden, like the tip jar already is), then **Sign in with Apple (4.8)** and **account deletion (5.1.1(v))** are *not yet* required — both trigger only when the app offers accounts. This is the lowest-legal-surface v1. If Google sign-in ships in the iOS build, both become mandatory immediately.
- Expect **24–48 hr review**; budget for one rejection cycle (most common: 2.1 crashes/incomplete metadata, 4.2, missing privacy items).

### Step 3 — Phase B paid launch (the $400 engine)
- **Sell Premium on iOS via StoreKit IAP** at the locked $2.99/mo + $24/yr. Requirements that come with it: functional **Terms of Use (EULA) + privacy policy links** in-app and in metadata, price/renewal/cancel disclosure before purchase, **restore purchases**, **Sign in with Apple**, **in-app account deletion**.
- **Why IAP over the alternatives** (decision rationale):
	- *External Stripe link (anti-steering)*: currently 0% commission (Ninth Circuit Dec 2025 left the rate unset), but **SCOTUS took the case for the 2026 term** — the 0% is unstable ground to build on. Checkout friction also kills impulse subs.
	- *Reader model* (buy on web, unlock in app): always legal, 0% commission, but invisible to App Store browsers and adds a sign-in hop. Keep it as the **web-user channel** — it already exists via live Stripe billing — not the iOS channel.
	- *IAP at 15%*: native purchase sheet, Apple is merchant of record (they handle sales tax + refunds), and it's the only channel that literally satisfies "first $400 **through** the App Store."
- Provide App Review a **sandbox test account with premium** so they can verify the sub flow.

### Step 4 — First $400
Math at 15% commission (SBP): $2.99/mo nets $2.54; $24/yr nets $20.40.
- $400 **gross** ≈ 17 annual subs, or ~134 monthly sub-months, or a realistic mix: **10 annual + ~55 monthly sub-months ≈ 20–25 paying couples over 3–6 months**.
- At the Marketing Proposal's channels (TikTok teasers + dev blog) and a typical 1–3% free→paid conversion, that implies **~1,000–2,500 engaged installs** — consistent with the Growth Plan's "monetize the engaged" posture.
- **Cash-flow reality:** $40 minimum payout, settlement ~45 days after the fiscal month closes, plus a possible 30–45 day new-account hold → **first deposit ~2–3+ months after the first sale**. Don't read a quiet bank account as failure.
- Tip jar (web-only) and affiliate links stay secondary per the Growth Plan ("pays for AWS, not rent").

## The five questions, answered

### 1. US-only first? GDPR/EU/rest of world?
**Yes — US-only (or US + Canada/Australia/NZ) at launch.** In App Store Connect you pick territories per app; **deselect all EU countries** and the DSA trader requirement (publicly displayed address, phone, email — enforced since Feb 2025, non-compliant apps get pulled) never applies. No EU users via the app also means no GDPR obligations from the iOS product. Two footnotes:
- **UK is not EU** but has UK-GDPR; skip UK too at launch for simplicity, add later with the same privacy policy.
- **The web app remains globally reachable** — an EU visitor to choices.austinjuliuskim.com is technically in GDPR scope regardless of App Store territories. The minimal-data/no-tracking posture ([[Studio Design Constitution]]) makes real exposure negligible, and the privacy policy you're writing anyway is the mitigation. No cookie banner needed while there's no tracking.
- Expand to EU later by: getting a virtual business address + VoIP number (or LLC address), completing the trader form, ticking the countries.

### 2. Should we have a EULA?
**Yes — and for the subscription it's mandatory, not optional.** Auto-renewing subscriptions must present functional Terms of Use and Privacy Policy links in the app and metadata. Cheapest compliant path: **use Apple's standard EULA** (default if you don't supply one) **plus your own short Terms of Service** covering the web side: disclaimers of liability, acceptable use, affiliate-link disclosure, subscription/billing terms for the *Stripe* channel (Apple's EULA only covers App Store transactions), governing law, and an arbitration/small-claims clause. One ToS page can serve both web and app. Upgrade to lawyer-reviewed terms when the LLC forms.

### 3. Data collection (mostly PII-stripped)
Apple's privacy labels ask what you **collect**, not what you keep in identifiable form — "stripped after collection" still counts as *collected*, though data that's fully anonymized/aggregated at collection time doesn't. Practical mapping for Choices:
- Guest play (no account): game/choice data tied to random pairing codes → likely declarable as **not linked to identity**.
- Premium (Cognito + Google sign-in, Stripe): **email/user ID = "Contact Info / Identifiers, linked to user"**; purchase history = "Purchases, linked."
- Location for near-me suggestions: **"Location — Precise/Coarse, linked"** (premium).
- No ads, no tracking across apps → **"Data not used for tracking"** — the label ends up unusually clean, which *is* the marketing asset the Constitution intends ("no tracking is a feature").
Be accurate rather than optimistic: label mismatches are a rejection/removal trigger. The privacy policy must describe the same categories, retention (TTL-based deletion is a genuine plus), processors (AWS, Stripe, Google), and a contact email.

### 4. Infra cost at 100k / 1M / 10M requests per month
Modeled on the actual stack (S3+CloudFront → Lambda Function URL 256MB → DynamoDB on-demand; no always-on compute; assumes ~150ms avg Lambda, ~2 reads + 1 write per API call):

| Monthly requests | Lambda | DynamoDB | CloudFront/S3 | WAF + fixed | **Total** |
|---|---|---|---|---|---|
| 100k | $0 (free tier) | <$1 | $0 (PAYG free tier: 1 TB + 10M req) | ~$10 | **~$10–15** |
| 1M | ~$0–1 | ~$1–2 | ~$0 | ~$11 | **~$15–25** |
| 10M | ~$3–8 | ~$10–20 | ~$5–20 (nearing free-tier edges) | ~$16 | **~$50–120** |

- **Verdict: hobby-budget at all three tiers.** The fixed ~$10/mo WAF baseline (from [[Choices CloudFront PAYG Migration Plan]]) dominates until ~1M req/mo.
- The scary per-call costs are **premium-gated by design**: Bedrock Haiku fill-my-4 ≈ $0.002/call; Google Places ≈ $17/1k sessions (~$0.30–0.60/mo of a heavy premium user's $2.99). They scale with *revenue*, not traffic. A premium sub stays ~70–80% margin even for heavy users.
- Watch items at 10M: Cognito MAU past the 10k free tier ($0.015+/MAU — fine while accounts are premium-only), CloudFront exceeding the 10M-request/1TB always-free allowance, DynamoDB streams/event-lake growth. Existing `billing-alarms.yaml` + WAF block rules are the right circuit-breakers; keep them ahead of each launch bump.
- Context: 10M req/mo with even 0.5% of traffic converting would mean revenue in the thousands — costs stay an order of magnitude below the locked $5k/mo target.

### 5. Gaps you're not thinking of
1. **App name collision (biggest one):** App Store display names are unique per storefront; **"Choices" is taken** (Pixelberry's "Choices: Stories You Play" et al.). Plan a variant now — e.g. "Choices: Decide Together" or "Choices — What to Eat" — the locked subtitle can fold into the name. This does *not* touch the product brand or the in-app name, so it doesn't reopen the locked naming decision, but flag it against [[Choices Growth Plan]] ASO section.
2. **Seller-name privacy:** listing shows your personal legal name until you convert to an Organization account (needs LLC + D-U-N-S). If that bothers you, the LLC timeline moves earlier.
3. **Reviewer access:** App Review must be able to *play* — a 2-player game needs demo instructions/a test pairing, and Phase B needs a premium sandbox account. Missing demo access is a top-5 rejection cause.
4. **Sales tax is solved for IAP, not for Stripe:** Apple is merchant of record for IAP (collects/remits worldwide). For web Stripe subs *you* are the merchant — US SaaS thresholds make real exposure ~zero at this scale, but enable **Stripe Tax** monitoring when web subs grow.
5. **Income tax:** App Store + Stripe income is self-employment income (Schedule C, ~15.3% SE tax above $400 net — coincidentally your milestone). Keep the expense log; you'll likely net a paper loss year one.
6. **Refunds are Apple's call** for IAP — users refund via Apple, you can't grant or deny; build no support promises around it.
7. **Trademark**: already correctly deferred in [[Relational Games Studio Roadmap]] (studio brand > "Choices"). No action, just don't buy a rush filing.
8. **SCOTUS overhang:** the external-purchase-link 0% commission is under Supreme Court review (2026 term). Anything built on "link out to Stripe, pay Apple nothing" may need rework; another reason IAP is the stable iOS channel.
9. **Ratings inertia:** the free Phase A launch starts accumulating public ratings immediately. Ship Phase A only when the native layer feels good — a 3.8-star free launch taxes the paid launch forever.
10. **Apple account hygiene:** enrollment ties to one Apple ID with 2FA — use a dedicated, recoverable Apple ID (not shared family), and calendar the annual $99 renewal (lapse = app delisted).
11. **Subscription ops details for Phase B:** decide Family Sharing on/off, grace-period/billing-retry settings, and price-increase consent behavior before launch — retrofitting annoys subscribers.
12. **EU later ≠ free:** when EU expansion happens, DSA trader info + GDPR + (post-2027) possible DMA/CSA changes come with it. Budget a virtual address/number (~$10–20/mo) into that decision.

## Sources (verified July 2026)
- Apple: [enrollment](https://developer.apple.com/programs/enroll/) · [membership comparison](https://developer.apple.com/support/compare-memberships/) · [Small Business Program](https://developer.apple.com/app-store/small-business-program/) · [payments](https://developer.apple.com/help/app-store-connect/getting-paid/overview-of-receiving-payments/) · [$40 payout floor](https://developer.apple.com/help/app-store-connect/reference/reporting/minimum-payment-threshold/) · [Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) · [account deletion](https://developer.apple.com/support/offering-account-deletion-in-your-app/) · [DSA trader requirements](https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements/)
- [RevenueCat on SBP](https://www.revenuecat.com/blog/engineering/small-business-program) · [RevenueCat on anti-steering](https://www.revenuecat.com/blog/growth/apple-anti-steering-ruling-monetization-strategy/) · [MacRumors: Ninth Circuit Dec 2025](https://www.macrumors.com/2025/12/11/apple-app-store-fees-external-payment-links/) · [TechCrunch: DSA enforcement](https://techcrunch.com/2025/02/18/apple-purges-apps-without-contact-info-from-eu-app-store-as-dsa-deadline-hits/)

## Vault meta
- Up: [[Choices MOC]]
