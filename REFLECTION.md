# REFLECTION.md — StackSpend

---

## 1. The hardest bug you hit this week, and how you debugged it

The nastiest bug was a silent deduplication failure in the audit engine. When a user had both Cursor Pro and Claude Pro with a coding use case, the `ruleClaudeProForCoding` rule fired (correctly) and the `ruleDuplicateCodingTools` cross-tool rule also fired. Both generated a recommendation with `toolId: 'cursor'` — and my deduplication logic was silently dropping the second one without choosing the *higher savings* one. The result: users with overlapping coding tool redundancies were seeing underreported savings.

My first hypothesis was that the Zustand store was merging state incorrectly on the frontend. I spent about 30 minutes adding `console.log` to the ResultsPage render, thinking the data was right from the API but being mutated client-side. It wasn't — the network response in DevTools showed the deduped array with the lower-savings entry kept.

Second hypothesis: my dedup reduce function had a logic error. I read it line by line and spotted it — the `if (rec.monthlySavings > acc[idx].monthlySavings)` replacement branch was correct, but the initial `seen.has(key)` check was using `rec.toolId || rec.title`. For the cross-tool redundancy rec, `toolId` was `'cursor'` (set in the `forEach` that wraps `ruleDuplicateCodingTools`), colliding with the per-tool Cursor rule. Fix: gave each cross-tool recommendation a dedicated `ruleId` field (`'duplicateCoding'`, `'duplicateAssistants'`) and used that as the dedup key when present. Tests updated, all green.

---

## 2. A decision you reversed mid-week, and what made you reverse it

On Day 1, I planned to use a **separate MongoDB collection for recommendations** — each recommendation as its own document, referencing the parent audit by `shareId`. The reasoning was: if we ever want to query "how many teams got flagged for Cursor redundancy?" we'd need an indexed collection.

By Day 2, I reversed this. When I implemented `GET /api/share/:shareId`, the query was `Audit.findOne({ shareId }).populate('recommendations')` — an extra round-trip and join just to render a page. The only consumer of recommendations was the audit result view, and that view always needed the entire audit anyway.

What made me reverse it: I wrote the controller code for the relational approach and counted the lines. Three separate Mongoose calls (fetch audit, fetch recommendations, assemble response) versus one `.findOne()`. The analytics use case I was optimizing for doesn't exist yet — that's premature optimization. Embedded array, single document fetch, done.

---

## 3. What you would build in week 2 if you had it

The single biggest unlock for week 2 would be **saved audit history with user accounts**. Right now, every audit is anonymous and expires in 90 days. Users can't come back and compare their stack this month versus last month — which is exactly the behavior that would make this sticky.

The week 2 build would be:
- **JWT auth** (email/password + Google OAuth via Passport.js) — no magic links, just standard flows
- **Audit history** — a list of past audits per user, with a delta view showing "you saved $X more this month than last month"
- **Team sharing** — invite teammates to view the same audit with a role-based link (view-only vs edit)
- **Pricing staleness alerts** — a weekly cron that pings vendor pricing pages and flags if any price in `pricingData.js` has drifted by >5%. Pricing data going stale silently is a trust risk for the whole product.
- **Slack/email digest** — weekly "here's your AI spend this week" notification for teams who've opted in. This is the retention mechanism that turns a one-time tool into a habit.

I'd also want to A/B test the lead capture modal timing. My intuition says 3 seconds is right, but that's a guess — could be 0 seconds (show immediately) or triggered only when savings > $100.

---

## 4. How you used AI tools

I used **Claude 3.5 Sonnet** (via Cursor) for the majority of code generation this week.

**What I used it for:**
- Scaffolding Express boilerplate (server, routes, middleware setup)
- Drafting Mongoose schema shape — I gave it the data model description and it produced valid schema syntax I then edited
- Generating the Framer Motion animation variants for the form step transitions
- Writing JSDoc comments for the audit engine functions
- First draft of the CI workflow YAML

**What I didn't trust it with:**
- The audit engine rules themselves — I wrote every rule by hand from the pricing data I manually verified. I don't trust an LLM to get dollar amounts right without hallucinating, and the whole product's credibility rests on those numbers being exact.
- The deduplication logic — after the bug in Q1 above, I made sure to reason through that code myself line by line.
- Any security-sensitive code (rate limiter config, IP hashing, CORS origin whitelist) — I verified these against the Express/Helmet docs directly.

**One specific time the AI was wrong:**
I asked Claude to generate the GitHub Copilot pricing for the `pricingData.js` object. It confidently returned `enterprise: { pricePerSeat: 49 }`. The actual price is **$39/seat**. I caught it because I'd just verified prices on GitHub's official pricing page 10 minutes earlier. If I'd used the AI's output directly, every Copilot Enterprise recommendation would have overstated savings by $10/seat — enough to destroy trust with a careful user.

---

## 5. Self-ratings

| Dimension | Rating | Reason |
|---|---|---|
| **Discipline** | 7/10 | Showed up every day and shipped, but Day 4 had a 9-hour session that probably produced worse code in the last 2 hours than if I'd stopped at 7. |
| **Code quality** | 8/10 | The audit engine is genuinely clean — pure function, well-tested, documented. The frontend has some components that grew too large and need splitting. |
| **Design sense** | 7/10 | The results page with the Recharts comparison and animated recommendation cards looks professional. The landing page copy is functional but not as sharp as I'd want. |
| **Problem-solving** | 8/10 | Identified the dedup bug systematically rather than randomly patching. The fallback-always pattern for AI failures was a proactive design decision, not a reactive one. |
| **Entrepreneurial thinking** | 7/10 | The tool-as-lead-magnet framing is solid, and the user interviews surfaced a real insight (spend visibility, not just overspend). But I didn't talk to enough people early enough — the interviews happened on Day 7 when they should have been Day 1. |
