/**
 * auditEngine.js
 * Pure deterministic rule-based audit engine.
 * No AI involved — all logic is finance-reasoned and rule-driven.
 */

const { PRICING_DATA, ALTERNATIVE_MAP } = require('./pricingData');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Get plan object safely from pricing data.
 */
function getPlan(toolId, planKey) {
  const tool = PRICING_DATA[toolId];
  if (!tool) return null;
  return tool.plans[planKey] || null;
}

/**
 * Calculate actual monthly cost for a subscription entry.
 * @param {object} entry - { toolId, planKey, seats, monthlySpend }
 * @returns {number} effective monthly cost
 */
function getEffectiveCost(entry) {
  // If user provided an explicit spend (e.g., API usage), use it
  if (entry.monthlySpend && entry.monthlySpend > 0) return entry.monthlySpend;
  const plan = getPlan(entry.toolId, entry.planKey);
  if (!plan || plan.usageBased) return entry.monthlySpend || 0;
  return (plan.pricePerSeat || 0) * (entry.seats || 1);
}

// ─── Individual Tool Rules ────────────────────────────────────────────────────

/**
 * Rule: ChatGPT Team with very few seats → downgrade to Plus
 * Threshold: If seats < 3, Plus is cheaper (Plus = $20/seat vs Team = $25/seat).
 */
function ruleChatGPTTeamSmallTeam(entry) {
  if (entry.toolId !== 'chatgpt' || entry.planKey !== 'team') return null;
  const seats = entry.seats || 1;
  if (seats < 3) {
    const currentCost = seats * 25;
    const plusCost = seats * 20;
    const saving = currentCost - plusCost;
    return {
      type: 'downgrade',
      title: 'Downgrade ChatGPT Team → Plus',
      fromPlan: 'Team ($25/seat)',
      toPlan: 'Plus ($20/seat)',
      monthlySavings: saving,
      yearlySavings: saving * 12,
      explanation: `With only ${seats} user(s), ChatGPT Team adds $5/seat/month in cost but provides collaborative admin features unnecessary below 3 seats. ChatGPT Plus delivers the same GPT-4o access at $20/seat.`,
      confidence: 'high',
    };
  }
  return null;
}

/**
 * Rule: ChatGPT Enterprise for small teams (< 50 seats) → recommend Team plan
 */
function ruleChatGPTEnterpriseSmallTeam(entry) {
  if (entry.toolId !== 'chatgpt' || entry.planKey !== 'enterprise') return null;
  const seats = entry.seats || 1;
  if (seats < 50) {
    const currentCost = seats * 60;
    const teamCost = seats * 25;
    const saving = currentCost - teamCost;
    return {
      type: 'downgrade',
      title: 'Downgrade ChatGPT Enterprise → Team',
      fromPlan: 'Enterprise ($60/seat)',
      toPlan: 'Team ($25/seat)',
      monthlySavings: saving,
      yearlySavings: saving * 12,
      explanation: `ChatGPT Enterprise is designed for 150+ seat deployments with SOC 2 compliance and custom context windows. At ${seats} users, the Team plan covers all practical needs at $25/seat — saving $${saving}/month.`,
      confidence: 'high',
    };
  }
  return null;
}

/**
 * Rule: GitHub Copilot Enterprise for < 20 devs → downgrade to Business
 */
function ruleGitHubCopilotEnterpriseSmall(entry) {
  if (entry.toolId !== 'githubCopilot' || entry.planKey !== 'enterprise') return null;
  const seats = entry.seats || 1;
  if (seats < 20) {
    const currentCost = seats * 39;
    const bizCost = seats * 19;
    const saving = currentCost - bizCost;
    return {
      type: 'downgrade',
      title: 'Downgrade GitHub Copilot Enterprise → Business',
      fromPlan: 'Enterprise ($39/seat)',
      toPlan: 'Business ($19/seat)',
      monthlySavings: saving,
      yearlySavings: saving * 12,
      explanation: `Copilot Enterprise features (custom models, fine-tuning) require significant engineering investment to utilize. Teams under 20 devs rarely exhaust Business plan capabilities. Save $${saving}/month.`,
      confidence: 'high',
    };
  }
  return null;
}

/**
 * Rule: Claude Pro for coding-heavy workflow → recommend Cursor + Claude API combo
 */
function ruleClaudeProForCoding(entry, context) {
  if (entry.toolId !== 'claude' || entry.planKey !== 'pro') return null;
  if (context.primaryUseCase !== 'coding') return null;

  const currentCost = 20; // Claude Pro
  const cursorProCost = 20; // Cursor Pro (includes Claude 3.5)
  // Net: same cost but user gets an IDE integration, no need for separate Claude Pro
  const saving = currentCost;

  return {
    type: 'alternative',
    title: 'Replace Claude Pro with Cursor Pro for coding workflows',
    fromPlan: 'Claude Pro ($20/seat)',
    toPlan: 'Cursor Pro ($20/seat)',
    monthlySavings: saving,
    yearlySavings: saving * 12,
    explanation: `Cursor Pro bundles Claude 3.5 Sonnet access directly into the IDE at the same $20/seat price point. For coding-primary workflows, this eliminates the need for a separate Claude Pro subscription — effectively making Claude Pro redundant. You get the same model access plus agentic code editing.`,
    confidence: 'high',
  };
}

/**
 * Rule: Duplicate coding tools (e.g., Cursor + GitHub Copilot)
 */
function ruleDuplicateCodingTools(entries) {
  const codingTools = ['cursor', 'githubCopilot', 'windsurf'];
  const activeCodingTools = entries.filter(e => codingTools.includes(e.toolId) && e.planKey !== 'free');

  if (activeCodingTools.length < 2) return [];

  const recommendations = [];
  // Keep the most expensive (usually most capable), flag the rest
  const sorted = [...activeCodingTools].sort((a, b) => getEffectiveCost(b) - getEffectiveCost(a));
  const keep = sorted[0];
  const extras = sorted.slice(1);

  extras.forEach(extra => {
    const saving = getEffectiveCost(extra);
    recommendations.push({
      type: 'redundancy',
      title: `Remove duplicate coding AI: ${PRICING_DATA[extra.toolId]?.name}`,
      fromPlan: `${PRICING_DATA[extra.toolId]?.name} (active)`,
      toPlan: `Keep only ${PRICING_DATA[keep.toolId]?.name}`,
      monthlySavings: saving,
      yearlySavings: saving * 12,
      explanation: `Your team is paying for ${activeCodingTools.length} AI coding tools simultaneously. ${PRICING_DATA[extra.toolId]?.name} and ${PRICING_DATA[keep.toolId]?.name} have heavily overlapping feature sets (inline completions, chat, code generation). Consolidating to one tool eliminates $${saving}/month in redundant spend.`,
      confidence: 'high',
    });
  });

  return recommendations;
}

/**
 * Rule: Duplicate general AI assistants (ChatGPT + Claude + Gemini)
 */
function ruleDuplicateAssistants(entries) {
  const assistantTools = ['chatgpt', 'claude', 'gemini'];
  const paidAssistants = entries.filter(
    e => assistantTools.includes(e.toolId) && e.planKey !== 'free' && getEffectiveCost(e) > 0
  );

  if (paidAssistants.length < 2) return [];

  const sorted = [...paidAssistants].sort((a, b) => getEffectiveCost(b) - getEffectiveCost(a));
  const keep = sorted[0];
  const extras = sorted.slice(1);
  const recommendations = [];

  extras.forEach(extra => {
    const saving = getEffectiveCost(extra);
    recommendations.push({
      type: 'redundancy',
      title: `Consolidate AI assistants — drop ${PRICING_DATA[extra.toolId]?.name}`,
      fromPlan: `Multiple paid AI assistants`,
      toPlan: `Single assistant: ${PRICING_DATA[keep.toolId]?.name}`,
      monthlySavings: saving,
      yearlySavings: saving * 12,
      explanation: `Running ${paidAssistants.length} paid AI assistant subscriptions simultaneously creates capability overlap. ChatGPT, Claude, and Gemini all cover general writing, research, and reasoning. Consolidating to your primary tool saves $${saving}/month while retaining 95%+ of your practical workflow coverage.`,
      confidence: 'medium',
    });
  });

  return recommendations;
}

/**
 * Rule: OpenAI API spend > $100/mo → recommend evaluating Claude Haiku
 */
function ruleOpenAIApiHighSpend(entry) {
  if (entry.toolId !== 'openaiApi') return null;
  const spend = entry.monthlySpend || 0;
  if (spend < 100) return null;

  // Claude 3 Haiku is ~33x cheaper for simple tasks
  const estimatedSaving = Math.round(spend * 0.4); // conservative 40% saving estimate

  return {
    type: 'alternative',
    title: 'Evaluate Claude 3 Haiku for OpenAI API high-volume calls',
    fromPlan: `OpenAI API ($${spend}/mo current)`,
    toPlan: 'Anthropic API — Claude 3 Haiku ($0.25/1M input tokens)',
    monthlySavings: estimatedSaving,
    yearlySavings: estimatedSaving * 12,
    explanation: `At $${spend}/month of OpenAI API spend, routing routine/simple inference to Claude 3 Haiku ($0.25/1M input vs GPT-4o's $5/1M) can cut API costs by 30-60%. Reserve GPT-4o for complex reasoning. Estimated saving: ~$${estimatedSaving}/month. Run a cost benchmark on your top call patterns first.`,
    confidence: 'medium',
  };
}

/**
 * Rule: Anthropic API spend > $100/mo → recommend evaluating GPT-4o-mini
 */
function ruleAnthropicApiHighSpend(entry) {
  if (entry.toolId !== 'anthropicApi') return null;
  const spend = entry.monthlySpend || 0;
  if (spend < 100) return null;

  const estimatedSaving = Math.round(spend * 0.35);
  return {
    type: 'alternative',
    title: 'Route high-volume Anthropic API calls to GPT-4o-mini',
    fromPlan: `Anthropic API ($${spend}/mo current)`,
    toPlan: 'OpenAI API — GPT-4o-mini ($0.15/1M input tokens)',
    monthlySavings: estimatedSaving,
    yearlySavings: estimatedSaving * 12,
    explanation: `GPT-4o-mini at $0.15/1M input tokens is exceptionally cost-efficient for classification, summarization, and structured extraction tasks. Migrating high-volume, lower-complexity calls from Anthropic API could save ~$${estimatedSaving}/month. Maintain Claude for nuanced reasoning tasks.`,
    confidence: 'medium',
  };
}

/**
 * Rule: Cursor Business for solo developer → downgrade to Pro
 */
function ruleCursorBusinessSolo(entry) {
  if (entry.toolId !== 'cursor' || entry.planKey !== 'business') return null;
  const seats = entry.seats || 1;
  if (seats > 2) return null;

  const currentCost = seats * 40;
  const proCost = seats * 20;
  const saving = currentCost - proCost;

  return {
    type: 'downgrade',
    title: 'Downgrade Cursor Business → Pro',
    fromPlan: 'Business ($40/seat)',
    toPlan: 'Pro ($20/seat)',
    monthlySavings: saving,
    yearlySavings: saving * 12,
    explanation: `Cursor Business adds SSO, admin controls, and privacy mode — features that provide no ROI for solo developers or pairs. Cursor Pro delivers identical model access (GPT-4o, Claude 3.5) at half the price.`,
    confidence: 'high',
  };
}

/**
 * Rule: Windsurf Teams for small team → Windsurf Pro
 */
function ruleWindsurfTeamsSmall(entry) {
  if (entry.toolId !== 'windsurf' || entry.planKey !== 'teams') return null;
  const seats = entry.seats || 1;
  if (seats >= 5) return null; // teams plan makes sense at 5+

  const currentCost = seats * 30;
  const proCost = seats * 15;
  const saving = currentCost - proCost;

  return {
    type: 'downgrade',
    title: 'Downgrade Windsurf Teams → Pro (per seat)',
    fromPlan: 'Teams ($30/seat)',
    toPlan: 'Pro ($15/seat)',
    monthlySavings: saving,
    yearlySavings: saving * 12,
    explanation: `Windsurf Teams includes SSO and admin dashboards. For teams under 5, the coordination overhead rarely justifies the 2x price premium over individual Pro licenses. Save $${saving}/month with no capability loss.`,
    confidence: 'high',
  };
}

/**
 * Rule: Gemini Enterprise for small team → Gemini Business
 */
function ruleGeminiEnterpriseSmall(entry) {
  if (entry.toolId !== 'gemini' || entry.planKey !== 'enterprise') return null;
  const seats = entry.seats || 1;
  if (seats >= 30) return null;

  const currentCost = seats * 30;
  const bizCost = seats * 24;
  const saving = currentCost - bizCost;

  return {
    type: 'downgrade',
    title: 'Downgrade Gemini Enterprise → Business',
    fromPlan: 'Enterprise ($30/seat)',
    toPlan: 'Business ($24/seat)',
    monthlySavings: saving,
    yearlySavings: saving * 12,
    explanation: `Gemini Enterprise unlocks custom model fine-tuning and advanced SLAs — meaningful only for large-scale deployments. Gemini Business covers standard Workspace integration, admin, and audit features at $24/seat.`,
    confidence: 'medium',
  };
}

// ─── Main Audit Function ──────────────────────────────────────────────────────

/**
 * Run the full audit against a set of tool subscriptions.
 *
 * @param {object} input
 * @param {Array}  input.tools       - Array of { toolId, planKey, seats, monthlySpend }
 * @param {number} input.teamSize    - Total team size
 * @param {string} input.primaryUseCase - 'coding' | 'writing' | 'research' | 'data' | 'mixed'
 * @returns {object} Audit result with recommendations and totals
 */
function runAudit(input) {
  const { tools = [], teamSize = 1, primaryUseCase = 'mixed' } = input;
  const context = { teamSize, primaryUseCase };

  const recommendations = [];
  let totalCurrentSpend = 0;

  // Calculate current spend for each tool
  const toolsWithCost = tools.map(entry => {
    const cost = getEffectiveCost(entry);
    totalCurrentSpend += cost;
    return { ...entry, effectiveCost: cost };
  });

  // Per-tool rules
  toolsWithCost.forEach(entry => {
    const perToolRules = [
      ruleChatGPTTeamSmallTeam,
      ruleChatGPTEnterpriseSmallTeam,
      ruleGitHubCopilotEnterpriseSmall,
      ruleClaudeProForCoding,
      ruleOpenAIApiHighSpend,
      ruleAnthropicApiHighSpend,
      ruleCursorBusinessSolo,
      ruleWindsurfTeamsSmall,
      ruleGeminiEnterpriseSmall,
    ];

    perToolRules.forEach(rule => {
      const rec = rule(entry, context);
      if (rec) recommendations.push({ ...rec, toolId: entry.toolId });
    });
  });

  // Cross-tool rules
  const duplicateCodingRecs = ruleDuplicateCodingTools(toolsWithCost);
  const duplicateAssistantRecs = ruleDuplicateAssistants(toolsWithCost);
  recommendations.push(...duplicateCodingRecs, ...duplicateAssistantRecs);

  // Deduplicate by toolId (keep highest-savings rec per tool)
  const seen = new Set();
  const deduped = recommendations.reduce((acc, rec) => {
    const key = rec.toolId || rec.title;
    if (!seen.has(key)) {
      seen.add(key);
      acc.push(rec);
    } else {
      // Replace if this one saves more
      const idx = acc.findIndex(r => (r.toolId || r.title) === key);
      if (idx !== -1 && rec.monthlySavings > acc[idx].monthlySavings) {
        acc[idx] = rec;
      }
    }
    return acc;
  }, []);

  // Totals
  const totalMonthlySavings = deduped.reduce((sum, r) => sum + (r.monthlySavings || 0), 0);
  const totalYearlySavings = totalMonthlySavings * 12;
  const optimizedSpend = Math.max(0, totalCurrentSpend - totalMonthlySavings);
  const savingsPercentage = totalCurrentSpend > 0
    ? Math.round((totalMonthlySavings / totalCurrentSpend) * 100)
    : 0;

  return {
    currentMonthlySpend: totalCurrentSpend,
    optimizedMonthlySpend: optimizedSpend,
    totalMonthlySavings,
    totalYearlySavings,
    savingsPercentage,
    recommendationCount: deduped.length,
    recommendations: deduped.sort((a, b) => b.monthlySavings - a.monthlySavings),
    toolsAudited: toolsWithCost,
    context,
    auditedAt: new Date().toISOString(),
  };
}

module.exports = { runAudit, getEffectiveCost };
