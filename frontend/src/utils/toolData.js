/**
 * Canonical tool metadata for the frontend.
 * Mirrors pricingData.js on the backend — UI layer only.
 */

export const TOOLS = {
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    vendor: 'OpenAI',
    emoji: '💬',
    color: '#10a37f',
    plans: [
      { key: 'free',       label: 'Free',       pricePerSeat: 0 },
      { key: 'plus',       label: 'Plus',        pricePerSeat: 20 },
      { key: 'team',       label: 'Team',        pricePerSeat: 25 },
      { key: 'enterprise', label: 'Enterprise',  pricePerSeat: 60 },
    ],
    supportsSeats: true,
    usageBased: false,
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    vendor: 'Anthropic',
    emoji: '🤖',
    color: '#d97706',
    plans: [
      { key: 'free',       label: 'Free',       pricePerSeat: 0 },
      { key: 'pro',        label: 'Pro',         pricePerSeat: 20 },
      { key: 'team',       label: 'Team',        pricePerSeat: 25 },
      { key: 'enterprise', label: 'Enterprise',  pricePerSeat: 50 },
    ],
    supportsSeats: true,
    usageBased: false,
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    vendor: 'Google',
    emoji: '✨',
    color: '#4285f4',
    plans: [
      { key: 'free',       label: 'Free',       pricePerSeat: 0 },
      { key: 'advanced',   label: 'Advanced',    pricePerSeat: 19.99 },
      { key: 'business',   label: 'Business',    pricePerSeat: 24 },
      { key: 'enterprise', label: 'Enterprise',  pricePerSeat: 30 },
    ],
    supportsSeats: true,
    usageBased: false,
  },
  cursor: {
    id: 'cursor',
    name: 'Cursor',
    vendor: 'Anysphere',
    emoji: '🖱️',
    color: '#7c3aed',
    plans: [
      { key: 'free',     label: 'Free',     pricePerSeat: 0 },
      { key: 'pro',      label: 'Pro',       pricePerSeat: 20 },
      { key: 'business', label: 'Business',  pricePerSeat: 40 },
    ],
    supportsSeats: true,
    usageBased: false,
  },
  githubCopilot: {
    id: 'githubCopilot',
    name: 'GitHub Copilot',
    vendor: 'GitHub',
    emoji: '🐙',
    color: '#333333',
    plans: [
      { key: 'free',       label: 'Free',       pricePerSeat: 0 },
      { key: 'individual', label: 'Individual',  pricePerSeat: 10 },
      { key: 'business',   label: 'Business',    pricePerSeat: 19 },
      { key: 'enterprise', label: 'Enterprise',  pricePerSeat: 39 },
    ],
    supportsSeats: true,
    usageBased: false,
  },
  windsurf: {
    id: 'windsurf',
    name: 'Windsurf',
    vendor: 'Codeium',
    emoji: '🏄',
    color: '#0ea5e9',
    plans: [
      { key: 'free',  label: 'Free',   pricePerSeat: 0 },
      { key: 'pro',   label: 'Pro',    pricePerSeat: 15 },
      { key: 'teams', label: 'Teams',  pricePerSeat: 30 },
    ],
    supportsSeats: true,
    usageBased: false,
  },
  openaiApi: {
    id: 'openaiApi',
    name: 'OpenAI API',
    vendor: 'OpenAI',
    emoji: '⚡',
    color: '#10a37f',
    plans: [
      { key: 'payg', label: 'Pay-As-You-Go', pricePerSeat: null },
    ],
    supportsSeats: false,
    usageBased: true,
  },
  anthropicApi: {
    id: 'anthropicApi',
    name: 'Anthropic API',
    vendor: 'Anthropic',
    emoji: '🧠',
    color: '#d97706',
    plans: [
      { key: 'payg', label: 'Pay-As-You-Go', pricePerSeat: null },
    ],
    supportsSeats: false,
    usageBased: true,
  },
};

export const TOOLS_LIST = Object.values(TOOLS);

export const USE_CASES = [
  { value: 'coding',   label: 'Coding & Development', icon: '💻' },
  { value: 'writing',  label: 'Writing & Content',     icon: '✍️' },
  { value: 'research', label: 'Research & Analysis',   icon: '🔬' },
  { value: 'data',     label: 'Data & Analytics',      icon: '📊' },
  { value: 'mixed',    label: 'Mixed / General',        icon: '🔀' },
];

export const REC_TYPE_LABELS = {
  downgrade:   { label: 'Downgrade',      color: 'text-brand-400',  bg: 'bg-brand-500/10',   border: 'border-brand-500/30' },
  alternative: { label: 'Alternative',    color: 'text-accent-400', bg: 'bg-accent-500/10',  border: 'border-accent-500/30' },
  redundancy:  { label: 'Redundancy',     color: 'text-amber-400',  bg: 'bg-amber-500/10',   border: 'border-amber-500/30' },
};
