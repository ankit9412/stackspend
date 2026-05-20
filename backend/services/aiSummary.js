/**
 * AI Summary Service — OpenRouter API via OpenAI SDK.
 * Model is read from OPENROUTER_CONTENT_MODEL env var (default: z-ai/glm-4.5-air:free).
 * Generates a concise executive-friendly ~100-word audit summary.
 * Falls back gracefully if the API call fails or no key is set.
 */

const OpenAI = require('openai');

// Instantiate once — matches the exact pattern from OpenRouter docs
const openai = new OpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://stackspend.app',    // Optional: site URL for rankings
    'X-OpenRouter-Title': 'StackSpend',           // Optional: site title for rankings
  },
});

// Model is configurable via env — defaults to the free GLM model
const MODEL = process.env.OPENROUTER_CONTENT_MODEL || 'z-ai/glm-4.5-air:free';

// ─── Fallback (no AI needed) ──────────────────────────────────────────────────

/**
 * Deterministic fallback summary — used when AI is unavailable.
 */
function generateFallbackSummary(auditResult) {
  const { totalMonthlySavings, totalYearlySavings, recommendationCount, savingsPercentage } = auditResult;

  if (recommendationCount === 0) {
    return `Your AI tool stack appears well-optimized with no significant overspending detected. Current subscriptions align with your team's use case and size. Continue monitoring usage quarterly to ensure plans scale appropriately as your team grows.`;
  }

  return `Your audit identified ${recommendationCount} optimization opportunit${recommendationCount === 1 ? 'y' : 'ies'} totaling $${totalMonthlySavings}/month ($${totalYearlySavings}/year) in potential savings — a ${savingsPercentage}% reduction in AI spend. Key actions include plan right-sizing and eliminating redundant tool subscriptions. Implementing these changes requires minimal workflow disruption and delivers immediate financial impact. Contact Credex for expert implementation support.`;
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(auditResult, context) {
  const {
    totalMonthlySavings, totalYearlySavings,
    recommendationCount, savingsPercentage,
    recommendations = [],
    currentMonthlySpend,
  } = auditResult;

  const topRecs = recommendations
    .slice(0, 3)
    .map((r, i) => `${i + 1}. ${r.title}: save $${r.monthlySavings}/month`)
    .join('\n');

  return `You are a financial advisor writing an executive audit summary for a business leader.

Audit Data:
- Team size: ${context.teamSize || 'unknown'} people
- Primary use case: ${context.primaryUseCase || 'mixed'}
- Current monthly AI spend: $${currentMonthlySpend}
- Potential monthly savings: $${totalMonthlySavings}
- Potential yearly savings: $${totalYearlySavings}
- Savings percentage: ${savingsPercentage}%
- Recommendations found: ${recommendationCount}

Top recommendations:
${topRecs || 'No recommendations — stack is well optimized.'}

Write a concise, executive-friendly 100-word summary of this AI spend audit. Be specific about the dollar savings, confident in the recommendations, and end with a clear call to action. Do not use bullet points. Write in plain prose. Do not exceed 120 words.`;
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Generate an AI-powered audit summary via OpenRouter.
 * Falls back gracefully on any error.
 *
 * @param {object} auditResult - Output from runAudit()
 * @param {object} context     - { teamSize, primaryUseCase }
 * @returns {{ summary: string, source: 'ai' | 'fallback', error?: string }}
 */
async function generateAISummary(auditResult, context = {}) {
  if (!process.env.OPENROUTER_API_KEY) {
    console.warn('[aiSummary] No OPENROUTER_API_KEY set — using fallback summary.');
    return { summary: generateFallbackSummary(auditResult), source: 'fallback' };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: buildPrompt(auditResult, context),
        },
      ],
      // Use a large token budget — reasoning models (like GLM-4.5) consume tokens
      // for their internal chain-of-thought before producing the final response.
      max_tokens: 800,
      temperature: 0.4,
    });

    const choice = completion.choices?.[0];
    // Primary: content field (standard models)
    // Fallback: reasoning field (reasoning/thinking models like GLM-4.5)
    let summary = choice?.message?.content?.trim();

    if (!summary && choice?.message?.reasoning) {
      // Extract the last coherent paragraph from reasoning as the summary
      const lines = choice.message.reasoning.trim().split('\n').filter(Boolean);
      summary = lines[lines.length - 1]?.trim();
    }

    if (!summary) {
      console.warn('[aiSummary] Empty response from OpenRouter — using fallback.');
      return { summary: generateFallbackSummary(auditResult), source: 'fallback' };
    }

    console.log(`[aiSummary] Summary generated via ${MODEL}`);
    return { summary, source: 'ai' };

  } catch (error) {
    console.error(`[aiSummary] OpenRouter call failed (${MODEL}):`, error.message);
    return {
      summary: generateFallbackSummary(auditResult),
      source: 'fallback',
      error: error.message,
    };
  }
}

module.exports = { generateAISummary, generateFallbackSummary };
