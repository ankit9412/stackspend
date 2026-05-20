# PROMPTS.md — StackSpend AI Prompt Documentation

> All LLM prompts used in this codebase, versioned and explained.
> Every prompt has a deterministic fallback — AI failure must never block the user.

---

## Prompt 001 — AI Audit Executive Summary

**File:** `backend/services/aiSummary.js` → `buildPrompt()`
**Model:** `z-ai/glm-4.5-air:free` via OpenRouter (configurable via `OPENROUTER_CONTENT_MODEL` env var)
**SDK:** OpenAI SDK (OpenRouter is OpenAI-compatible)
**Version:** 1.1
**Last updated:** 2026-05-16

---

### Purpose

Generate a concise, executive-friendly ~100-word prose summary of the audit results. Rendered as a card on the Results page and cached in MongoDB — served verbatim on shared audit views without re-calling the API.

---

### Full Prompt Template

```
You are a financial advisor writing an executive audit summary for a business leader.

Audit Data:
- Team size: {teamSize} people
- Primary use case: {primaryUseCase}
- Current monthly AI spend: ${currentMonthlySpend}
- Potential monthly savings: ${totalMonthlySavings}
- Potential yearly savings: ${totalYearlySavings}
- Savings percentage: {savingsPercentage}%
- Recommendations found: {recommendationCount}

Top recommendations:
{topRecs}

Write a concise, executive-friendly 100-word summary of this AI spend audit. Be specific about savings, confident in recommendations, and end with a clear call to action. Do not use bullet points. Write in plain prose. Do not exceed 120 words.
```

Where `{topRecs}` is a formatted string of the top 3 recommendations (by savings), each on its own line:
```
- {title}: save ${monthlySavings}/month ({explanation truncated to 80 chars})
```

---

### Parameters

| Param | Value | Reason |
|---|---|---|
| `model` | `z-ai/glm-4.5-air:free` | Free-tier reasoning model via OpenRouter; configurable via env var |
| `max_tokens` | `800` | Reasoning models generate chain-of-thought before output; 200 is not enough |
| `temperature` | `0.4` | Low variance for factual/financial content; high temp produces hedging language |

---

### Fallback (when API call fails or no key set)

`generateFallbackSummary(auditResult)` in `aiSummary.js` returns a template string:

```
Your team's AI tool audit identified {recommendationCount} optimization 
opportunities worth ${totalMonthlySavings}/month (${totalYearlySavings}/year). 
{topTitle} could save ${topSavings}/month alone. 
These are finance-reasoned recommendations based on your actual subscription 
data — not estimates. Book a free Credex consultation to implement the highest-
impact changes first.
```

This is deterministic, always accurate, and covers the essential CTA. It looks slightly less polished than a real LLM output but is never wrong.

---

### Why This Prompt Was Written This Way

**"You are a financial advisor..."**
Setting the persona prevents the model from writing like a tech product (bullet lists, emoji, hedging). "Financial advisor" anchors it in professional, confident prose.

**"Do not use bullet points. Write in plain prose."**
Early versions (v1.0) produced bullet-point lists that broke the card UI layout. Adding this constraint solved it reliably.

**"Do not exceed 120 words."**
Without a hard cap, Claude produces 200+ word summaries that overflow the card. The 120 word ceiling gives the model room to reach 100 without truncating mid-sentence.

**"End with a clear call to action."**
The CTA — nudging toward a Credex consultation — is the business objective of the summary. Without this instruction, the model often ended with "consider reviewing your subscriptions periodically," which is useless.

**`temperature: 0.4` not 0.0:**
At temperature 0, Claude sometimes produces identical output for very similar inputs (e.g., two teams both saving $150/month look the same). Light variance at 0.4 keeps outputs distinct without becoming unpredictable.

---

### What I Tried That Didn't Work

**v1.0 — Direct Anthropic API:**
Used `@anthropic-ai/sdk` directly. Worked fine but tied us to one provider. Switching to OpenRouter with the OpenAI SDK gives model flexibility — if Claude raises prices or rate-limits us, we swap the env var.

**"Write exactly 100 words."**
Tested this constraint. Claude tries to comply, often producing unnatural sentence completions at the word count boundary ("...and the team should act." feels forced). "Approximately 100 words, not exceeding 120" produces much more natural prose.

**Requesting JSON output from the summary:**
Early design had the model return `{ "summary": "...", "headline": "..." }`. Abandoned because the model would frequently return malformed JSON or wrap the JSON in markdown code fences, requiring fragile parsing. Plain text is simpler and more reliable.

**`max_tokens: 200` (v1.0):**
Sufficient for Claude 3.5 Sonnet's direct output style. Broke immediately when switching to reasoning models (`z-ai/glm-4.5-air`) which generate internal chain-of-thought tokens before the visible output. Bumped to 800.

---

## Prompt Iteration Log

| Version | Date | Change | Reason |
|---|---|---|---|
| 1.0 | 2026-05-15 | Initial prompt, Claude 3.5 Sonnet via direct Anthropic SDK | Launch baseline |
| 1.1 | 2026-05-16 | Switched to OpenRouter + `z-ai/glm-4.5-air:free`; bumped `max_tokens` to 800; added "plain prose, no bullets" constraint | Free-tier model; reasoning model token budget; UI layout fix |
