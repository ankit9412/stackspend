/**
 * Canonical pricing data for all supported AI tools.
 * All prices are USD/month. Updated: 2024-Q4.
 * Source: Official pricing pages + verified public data.
 */

const PRICING_DATA = {
  chatgpt: {
    name: 'ChatGPT',
    vendor: 'OpenAI',
    plans: {
      free: { label: 'Free', pricePerSeat: 0, maxSeats: 1, features: ['GPT-4o limited', 'basic access'] },
      plus: { label: 'Plus', pricePerSeat: 20, maxSeats: 1, features: ['GPT-4o unlimited', 'plugins', 'DALL-E'] },
      team: { label: 'Team', pricePerSeat: 25, maxSeats: null, minSeats: 2, features: ['GPT-4o', 'admin console', '32k context'] },
      enterprise: { label: 'Enterprise', pricePerSeat: 60, maxSeats: null, minSeats: 150, features: ['custom context', 'SSO', 'audit logs'] },
    },
    bestForUseCases: ['writing', 'research', 'mixed'],
    alternatives: ['claude', 'gemini'],
  },

  claude: {
    name: 'Claude',
    vendor: 'Anthropic',
    plans: {
      free: { label: 'Free', pricePerSeat: 0, maxSeats: 1, features: ['Claude 3 Haiku', 'limited messages'] },
      pro: { label: 'Pro', pricePerSeat: 20, maxSeats: 1, features: ['Claude 3.5 Sonnet', 'priority access', '5x usage'] },
      team: { label: 'Team', pricePerSeat: 25, maxSeats: null, minSeats: 1, features: ['Claude 3.5 Sonnet', 'admin dashboard', 'collaboration'] },
      enterprise: { label: 'Enterprise', pricePerSeat: 50, maxSeats: null, minSeats: 100, features: ['SSO', 'audit logs', 'custom retention'] },
    },
    bestForUseCases: ['writing', 'research', 'coding'],
    alternatives: ['chatgpt', 'gemini'],
  },

  gemini: {
    name: 'Gemini',
    vendor: 'Google',
    plans: {
      free: { label: 'Free', pricePerSeat: 0, maxSeats: 1, features: ['Gemini 1.5 Flash', 'limited'] },
      advanced: { label: 'Advanced', pricePerSeat: 19.99, maxSeats: 1, features: ['Gemini 1.5 Pro', '1M context', 'Google Workspace'] },
      business: { label: 'Business', pricePerSeat: 24, maxSeats: null, minSeats: 1, features: ['Gemini for Workspace', 'admin', 'audit'] },
      enterprise: { label: 'Enterprise', pricePerSeat: 30, maxSeats: null, minSeats: 1, features: ['Custom model', 'SLA', 'compliance'] },
    },
    bestForUseCases: ['research', 'data', 'mixed'],
    alternatives: ['chatgpt', 'claude'],
  },

  cursor: {
    name: 'Cursor',
    vendor: 'Anysphere',
    plans: {
      free: { label: 'Free', pricePerSeat: 0, maxSeats: 1, features: ['2000 completions/mo', 'GPT-4o mini'] },
      pro: { label: 'Pro', pricePerSeat: 20, maxSeats: 1, features: ['500 GPT-4o requests', 'unlimited completions', 'Claude 3.5'] },
      business: { label: 'Business', pricePerSeat: 40, maxSeats: null, minSeats: 1, features: ['SSO', 'admin', 'privacy mode', 'all models'] },
    },
    bestForUseCases: ['coding'],
    alternatives: ['githubCopilot', 'windsurf'],
  },

  githubCopilot: {
    name: 'GitHub Copilot',
    vendor: 'GitHub/Microsoft',
    plans: {
      free: { label: 'Free', pricePerSeat: 0, maxSeats: 1, features: ['2000 completions/mo', 'GPT-4o mini'] },
      individual: { label: 'Individual', pricePerSeat: 10, maxSeats: 1, features: ['unlimited completions', 'chat', 'CLI'] },
      business: { label: 'Business', pricePerSeat: 19, maxSeats: null, minSeats: 1, features: ['admin', 'audit', 'policy controls'] },
      enterprise: { label: 'Enterprise', pricePerSeat: 39, maxSeats: null, minSeats: 1, features: ['custom models', 'fine-tuning', 'Bing search'] },
    },
    bestForUseCases: ['coding'],
    alternatives: ['cursor', 'windsurf'],
  },

  windsurf: {
    name: 'Windsurf',
    vendor: 'Codeium',
    plans: {
      free: { label: 'Free', pricePerSeat: 0, maxSeats: 1, features: ['unlimited completions', 'GPT-4o mini'] },
      pro: { label: 'Pro', pricePerSeat: 15, maxSeats: 1, features: ['Claude 3.5', 'GPT-4o', 'unlimited flows'] },
      teams: { label: 'Teams', pricePerSeat: 30, maxSeats: null, minSeats: 1, features: ['admin', 'SSO', 'priority'] },
    },
    bestForUseCases: ['coding'],
    alternatives: ['cursor', 'githubCopilot'],
  },

  openaiApi: {
    name: 'OpenAI API',
    vendor: 'OpenAI',
    plans: {
      payg: {
        label: 'Pay-As-You-Go',
        pricePerSeat: null, // usage-based
        usageBased: true,
        tiers: {
          'gpt-4o': { inputPer1M: 5, outputPer1M: 15 },
          'gpt-4o-mini': { inputPer1M: 0.15, outputPer1M: 0.6 },
          'gpt-3.5-turbo': { inputPer1M: 0.5, outputPer1M: 1.5 },
        },
        features: ['all models', 'usage dashboard', 'no seat limit'],
      },
    },
    bestForUseCases: ['coding', 'data', 'mixed'],
    alternatives: ['anthropicApi'],
    notes: 'Compare actual monthly usage. If spend >$40/mo, evaluate if Claude API or Gemini API is cheaper.',
  },

  anthropicApi: {
    name: 'Anthropic API',
    vendor: 'Anthropic',
    plans: {
      payg: {
        label: 'Pay-As-You-Go',
        pricePerSeat: null,
        usageBased: true,
        tiers: {
          'claude-3.5-sonnet': { inputPer1M: 3, outputPer1M: 15 },
          'claude-3-haiku': { inputPer1M: 0.25, outputPer1M: 1.25 },
          'claude-3-opus': { inputPer1M: 15, outputPer1M: 75 },
        },
        features: ['all Claude models', 'usage dashboard'],
      },
    },
    bestForUseCases: ['writing', 'research', 'mixed'],
    alternatives: ['openaiApi'],
    notes: 'Claude 3 Haiku is among the most cost-effective models for high-volume use cases.',
  },
};

/**
 * Tool metadata for UI display and rule matching
 */
const TOOL_META = {
  chatgpt: { emoji: '💬', color: '#10a37f', category: 'assistant' },
  claude: { emoji: '🤖', color: '#d97706', category: 'assistant' },
  gemini: { emoji: '✨', color: '#4285f4', category: 'assistant' },
  cursor: { emoji: '🖱️', color: '#7c3aed', category: 'coding' },
  githubCopilot: { emoji: '🐙', color: '#333333', category: 'coding' },
  windsurf: { emoji: '🏄', color: '#0ea5e9', category: 'coding' },
  openaiApi: { emoji: '⚡', color: '#10a37f', category: 'api' },
  anthropicApi: { emoji: '🧠', color: '#d97706', category: 'api' },
};

/**
 * Cheaper alternative recommendations map
 * key: toolId + '|' + planKey => suggested alternative
 */
const ALTERNATIVE_MAP = {
  'chatgpt|enterprise': { tool: 'claude', plan: 'team', reason: 'Claude Team offers comparable capabilities at lower enterprise cost for most teams under 200 users.' },
  'chatgpt|team': { tool: 'claude', plan: 'team', reason: 'Claude Team is priced identically but tends to outperform on writing and reasoning tasks.' },
  'claude|enterprise': { tool: 'chatgpt', plan: 'team', reason: 'ChatGPT Team covers most enterprise needs at a lower commitment level.' },
  'githubCopilot|enterprise': { tool: 'cursor', plan: 'business', reason: 'Cursor Business provides richer agentic coding features at comparable cost.' },
  'githubCopilot|business': { tool: 'windsurf', plan: 'pro', reason: 'Windsurf Pro delivers similar completions at $15/seat vs $19/seat.' },
  'openaiApi|payg': { tool: 'anthropicApi', plan: 'payg', reason: 'Claude 3 Haiku is 33x cheaper than GPT-4o for high-volume inference.' },
  'anthropicApi|payg': { tool: 'openaiApi', plan: 'payg', reason: 'GPT-4o-mini costs $0.15/1M tokens — ideal for large-volume, low-complexity tasks.' },
};

module.exports = { PRICING_DATA, TOOL_META, ALTERNATIVE_MAP };
