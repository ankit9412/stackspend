# USER_INTERVIEWS.md — StackSpend Interview Log

> Three conversations conducted May 18–19, 2026 via DM → Zoom/call.
> Each ran 10–15 minutes. Names anonymized at interviewees' request.

---

## Interview #1 — 2026-05-18

**Name:** R.K. (initials)
**Role:** Co-founder & CTO
**Company:** B2B SaaS, project management tool, seed stage (~12 employees, 4 engineers)
**AI tools in use:** Cursor Pro (4 seats), ChatGPT Team (4 seats), "someone on the team also uses Claude, not sure if it's paid"
**Duration:** 13 minutes
**Method:** Zoom

### What I Asked
1. Do you know your current total monthly AI tool spend?
2. Who makes the purchasing decision on AI tools?
3. Have you ever felt like you were overpaying?
4. Would you share an AI spend report with your co-founder or board?

### Direct Quotes

> "I honestly don't know the number off the top of my head. I approved Cursor, and our PM lead signed up for ChatGPT Team, and I think someone has Claude but I'm not sure if it's on the company card or personal."

> "It's not that I don't care about the cost — it's that there's no single place that shows me the combined number. It's split across three invoices from three different companies."

> "If you showed me a clean breakdown saying 'you're paying for two things that do the same thing, here's the overlap' — yeah, I'd share that with my co-founder before our next finance sync."

### Most Surprising Thing
He didn't know if Claude was a company expense or a personal expense. Not that he was careless — he literally had no visibility. The "I'm not sure if it's on the company card" quote stopped me because it means the spend is invisible by default, not just unoptimized.

### What It Changed About the Design
I had originally positioned the landing page around "save money." After this conversation I changed the primary headline angle to **visibility first** — "See exactly what your team is paying for AI tools" — with savings as the output. Users don't know the problem is cost until they can see the cost. The CTA now reads "Run your free audit" not "Find your savings" because you can't save what you can't see.

---

## Interview #2 — 2026-05-18

**Name:** P.M. (initials)
**Role:** Head of Engineering
**Company:** Early-stage fintech, ~30 employees, 8 engineers
**AI tools in use:** GitHub Copilot Business (8 seats), Cursor Business (3 seats — "the senior devs"), Gemini Advanced (1 seat — himself), ChatGPT Plus (2 individual accounts, possibly expensed)
**Duration:** 11 minutes
**Method:** Voice call

### What I Asked
1. How did you end up with this particular stack of AI tools?
2. Has anyone ever questioned the AI tool budget?
3. What would you need to see to switch from Copilot to something else?

### Direct Quotes

> "Copilot came first because we already had GitHub enterprise licenses. Cursor came in because two of my senior devs tried it on their own and said they'd quit if we didn't pay for it — I'm joking, but not really."

> "Our CFO asked me last quarter to 'justify the AI tools line item.' I sent her a one-paragraph Slack message. She said OK. It was not a rigorous process."

> "I've wondered if we actually need both Copilot and Cursor. But I don't want to take something away from the devs and then have them blame me when they're less productive. It's easier to just keep paying."

### Most Surprising Thing
The phrase "it's easier to just keep paying." He knows there's probably redundancy. He's not acting on it because the political cost of removing a tool developers like feels higher than the financial cost of the subscription. This is a real blocker I hadn't anticipated: the audit output needs to give the manager political cover — not just a number, but a framing like "these two tools have 85% feature overlap" that makes the consolidation feel technically justified, not a cost-cutting measure.

### What It Changed About the Design
Added "confidence level" to each recommendation (high/medium) and more specific explanation text — e.g., "Cursor Pro and GitHub Copilot Business have heavily overlapping feature sets (inline completions, chat, code generation)." The recommendation card now feels like a technical finding, not a budget cut. Also added language in the results page: "Share this report with your CFO" — giving the manager something to point to.

---

## Interview #3 — 2026-05-19

**Name:** A.T. (initials)
**Role:** Founder (solo, early revenue)
**Company:** Developer tools indie product, ~$4K MRR, no employees
**AI tools in use:** ChatGPT Plus ($20), Claude Pro ($20), Cursor Pro ($20), Windsurf Pro ($15)
**Duration:** 14 minutes
**Method:** Async voice note → 10-min Zoom follow-up

### What I Asked
1. You're paying for four AI tools — is that intentional?
2. How do you decide which one to use for which task?
3. If you had to cut one today, which would it be and why?

### Direct Quotes

> "I use Cursor for code, Claude for thinking through hard problems, ChatGPT for quick lookups, and Windsurf I'm honestly barely using anymore — I think I forgot to cancel it."

> "I don't really think of them as overlapping. They feel different to me. But if you told me the dollar amount I'm spending on AI every month, I'd probably be surprised."

> "$75 a month. That's more than my hosting bill. I hadn't added it up."

> "I would absolutely cut Windsurf if something told me I wasn't really using it. I just need the push."

### Most Surprising Thing
He said "they feel different to me" but then immediately agreed Windsurf was barely used. The perception of differentiation is strong even when usage data would show otherwise. Users rationalize keeping every tool because each one "does something different" — even when two do the same thing. The audit needs to address this head-on: the redundancy explanation has to be specific about what the overlap actually is, not just that it exists.

### What It Changed About the Design
Added the **Windsurf Teams small team rule** specifically after this conversation — a solo or small team on Windsurf's Teams plan is paying 2× for admin features they'll never use. Also reinforced that the share link UX matters for solo founders: A.T. said he'd share the report "in a tweet" if it was clean enough. Made sure the shared audit view has no Credex branding that would make it feel like an ad — the share-worthiness is the distribution mechanism.

---

## Synthesized Insights

### Top Pain Points (validated across all 3)
1. **Spend is invisible by default** — nobody knows the combined monthly number without manually summing invoices from 3+ companies
2. **Redundancy is felt but not acted on** — engineers/founders suspect overlap but lack the political cover or the specific data to justify removing a tool
3. **Inertia is the enemy** — tools accumulate passively; cancellation requires active effort nobody schedules

### Validated Hypotheses
- ✅ The primary user is technical (CTO, EM, founder) — not finance
- ✅ Savings framing alone isn't enough; technical justification ("feature overlap") is needed for organizational buy-in
- ✅ Share link is a real distribution mechanism — users want to share the output

### Invalidated Hypotheses
- ❌ "Users know roughly what they're spending" — none of the three could give me a number without calculating it in the call
- ❌ "Finance/CFO is the primary buyer of this insight" — they're secondary; the technical decision-maker is who runs the audit, and they need to justify it to finance, not the other way around

### Surprising Findings
- Solo founders paying for 3–4 AI subscriptions simultaneously ($75/month+) with no habit of reviewing them
- The political cost of removing a developer tool is a real blocker — "it's easier to keep paying"
- "They feel different" as a rationalization for redundancy, even when usage would tell a different story
