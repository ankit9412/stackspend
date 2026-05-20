# PRICING_DATA.md — StackSpend Pricing Reference

> **All prices in USD/month per seat unless noted.**
> Every number in the audit engine traces to a vendor's official pricing page.
> Verification is manual — go to the URL and check.

---

## ChatGPT (OpenAI)

- **Free:** $0/user/month — https://openai.com/chatgpt/pricing — verified 2026-05-14
- **Plus:** $20/user/month — https://openai.com/chatgpt/pricing — verified 2026-05-14
- **Team:** $25/user/month (min 2 seats) — https://openai.com/chatgpt/pricing — verified 2026-05-14
- **Enterprise:** $60/user/month (estimated; OpenAI quotes on request, community-verified) — https://openai.com/chatgpt/pricing — verified 2026-05-14

**Audit rules using these prices:**
- `ruleChatGPTTeamSmallTeam`: Team ($25) → Plus ($20) = $5/seat saving
- `ruleChatGPTEnterpriseSmallTeam`: Enterprise ($60) → Team ($25) = $35/seat saving

---

## Claude (Anthropic)

- **Free:** $0/user/month — https://www.anthropic.com/pricing — verified 2026-05-14
- **Pro:** $20/user/month — https://www.anthropic.com/pricing — verified 2026-05-14
- **Team:** $25/user/month — https://www.anthropic.com/pricing — verified 2026-05-14
- **Enterprise:** $50+/user/month (quoted on request; $50 used as conservative estimate) — https://www.anthropic.com/pricing — verified 2026-05-14

**Audit rules using these prices:**
- `ruleClaudeProForCoding`: Claude Pro ($20) is redundant when Cursor Pro ($20) bundles Claude 3.5 Sonnet. Net saving treated as $20 (eliminates the subscription entirely).

---

## Gemini (Google)

- **Free:** $0/user/month — https://one.google.com/about/ai-premium — verified 2026-05-15
- **Advanced (Google One AI Premium):** $19.99/user/month — https://one.google.com/about/ai-premium — verified 2026-05-15
- **Business (Google Workspace + Gemini):** $24/user/month — https://workspace.google.com/pricing — verified 2026-05-15
- **Enterprise:** $30/user/month — https://workspace.google.com/pricing — verified 2026-05-15

**Audit rules using these prices:**
- `ruleGeminiEnterpriseSmall`: Enterprise ($30) → Business ($24) = $6/seat saving for teams < 30

---

## Cursor (Anysphere)

- **Free (Hobby):** $0/user/month — https://www.cursor.com/pricing — verified 2026-05-14
- **Pro:** $20/user/month — https://www.cursor.com/pricing — verified 2026-05-14
- **Business:** $40/user/month — https://www.cursor.com/pricing — verified 2026-05-14

**Audit rules using these prices:**
- `ruleCursorBusinessSolo`: Business ($40) → Pro ($20) = $20/seat saving for ≤ 2 seats

---

## GitHub Copilot (GitHub / Microsoft)

- **Free:** $0/user/month — https://github.com/features/copilot/plans — verified 2026-05-14
- **Individual:** $10/user/month — https://github.com/features/copilot/plans — verified 2026-05-14
- **Business:** $19/user/month — https://github.com/features/copilot/plans — verified 2026-05-14
- **Enterprise:** $39/user/month — https://github.com/features/copilot/plans — verified 2026-05-14

> ⚠️ Note: An LLM suggested $49/user/month for Enterprise during development. Verified against GitHub's live pricing page — the correct price is **$39**. Always verify from source.

**Audit rules using these prices:**
- `ruleGitHubCopilotEnterpriseSmall`: Enterprise ($39) → Business ($19) = $20/seat saving for < 20 devs

---

## Windsurf (Codeium)

- **Free:** $0/user/month — https://windsurf.com/pricing — verified 2026-05-15
- **Pro:** $15/user/month — https://windsurf.com/pricing — verified 2026-05-15
- **Teams:** $30/user/month — https://windsurf.com/pricing — verified 2026-05-15

**Audit rules using these prices:**
- `ruleWindsurfTeamsSmall`: Teams ($30) → Pro ($15) = $15/seat saving for < 5 seats

---

## OpenAI API (Pay-as-you-go)

Prices per 1 million tokens, as of 2026-05-14:

- **GPT-4o:** $5.00 input / $15.00 output — https://openai.com/api/pricing — verified 2026-05-14
- **GPT-4o mini:** $0.15 input / $0.60 output — https://openai.com/api/pricing — verified 2026-05-14
- **GPT-3.5 Turbo:** $0.50 input / $1.50 output — https://openai.com/api/pricing — verified 2026-05-14

**Audit rules using these prices:**
- `ruleOpenAIApiHighSpend`: If monthly spend > $100, suggest evaluating Claude 3 Haiku. Estimated saving: 40% of current spend (conservative; actual depends on workload mix).

---

## Anthropic API (Pay-as-you-go)

Prices per 1 million tokens, as of 2026-05-14:

- **Claude 3.5 Sonnet:** $3.00 input / $15.00 output — https://www.anthropic.com/pricing — verified 2026-05-14
- **Claude 3 Haiku:** $0.25 input / $1.25 output — https://www.anthropic.com/pricing — verified 2026-05-14
- **Claude 3 Opus:** $15.00 input / $75.00 output — https://www.anthropic.com/pricing — verified 2026-05-14

**Audit rules using these prices:**
- `ruleAnthropicApiHighSpend`: If monthly spend > $100, suggest evaluating GPT-4o-mini. Estimated saving: 35% of current spend.

---

## AI Summary Cost (Internal — OpenRouter)

Used for generating the executive summary. Not audited for users — this is StackSpend's own cost.

- **Model used:** `z-ai/glm-4.5-air:free` (free tier via OpenRouter)
- **Fallback model cost (if upgraded):** Claude 3.5 Sonnet via OpenRouter
  - Input: ~$3.00/1M tokens — https://openrouter.ai/anthropic/claude-3.5-sonnet — verified 2026-05-14
  - Output: ~$15.00/1M tokens
  - Per-audit cost: ~500 input + 150 output tokens ≈ **$0.004/audit**

---

## Pricing Update Process

1. Check the vendor URL listed above for each tool
2. Update `backend/utils/pricingData.js` — the `PRICING_DATA` object is the source of truth for all rule calculations
3. Update this file with the new price and a fresh verification date
4. Run `cd backend && npm test` — if any test breaks, a rule threshold or savings calculation needs updating
5. Open a PR with label `pricing-update`

**Review cadence:** Monthly. AI tool pricing has been changing frequently in 2025–2026.
