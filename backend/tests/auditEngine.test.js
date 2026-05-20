/**
 * Audit Engine Test Suite
 * Tests: 8 scenarios covering all major rule branches.
 * Runner: Jest
 */

const { runAudit, getEffectiveCost } = require('../utils/auditEngine');

// ─── Test 1: ChatGPT Team with 2 seats → downgrade to Plus ───────────────────
describe('Rule: ChatGPT Team with fewer than 3 seats', () => {
  test('recommends downgrade from Team to Plus for 2 users', () => {
    const result = runAudit({
      tools: [{ toolId: 'chatgpt', planKey: 'team', seats: 2, monthlySpend: 0 }],
      teamSize: 2,
      primaryUseCase: 'mixed',
    });

    const rec = result.recommendations.find(r => r.type === 'downgrade' && r.toolId === 'chatgpt');
    expect(rec).toBeDefined();
    expect(rec.monthlySavings).toBe(10); // (25-20)*2 = 10
    expect(rec.yearlySavings).toBe(120);
    expect(rec.title).toContain('Plus');
  });

  test('does NOT flag ChatGPT Team for 5 users', () => {
    const result = runAudit({
      tools: [{ toolId: 'chatgpt', planKey: 'team', seats: 5 }],
      teamSize: 5,
      primaryUseCase: 'mixed',
    });

    const rec = result.recommendations.find(r => r.toolId === 'chatgpt' && r.type === 'downgrade');
    expect(rec).toBeUndefined();
  });
});

// ─── Test 2: ChatGPT Enterprise for small team ────────────────────────────────
describe('Rule: ChatGPT Enterprise for small teams', () => {
  test('flags Enterprise for 10-person team and recommends Team plan', () => {
    const result = runAudit({
      tools: [{ toolId: 'chatgpt', planKey: 'enterprise', seats: 10 }],
      teamSize: 10,
      primaryUseCase: 'writing',
    });

    const rec = result.recommendations.find(r => r.type === 'downgrade' && r.toolId === 'chatgpt');
    expect(rec).toBeDefined();
    // Savings: (60-25)*10 = 350
    expect(rec.monthlySavings).toBe(350);
    expect(rec.yearlySavings).toBe(4200);
  });

  test('does NOT flag Enterprise for 60-person team', () => {
    const result = runAudit({
      tools: [{ toolId: 'chatgpt', planKey: 'enterprise', seats: 60 }],
      teamSize: 60,
      primaryUseCase: 'mixed',
    });

    const rec = result.recommendations.find(r => r.toolId === 'chatgpt');
    expect(rec).toBeUndefined();
  });
});

// ─── Test 3: Claude Pro for coding-heavy workflow ─────────────────────────────
describe('Rule: Claude Pro redundant for coding workflows', () => {
  test('recommends switching Claude Pro to Cursor Pro for coding teams', () => {
    const result = runAudit({
      tools: [{ toolId: 'claude', planKey: 'pro', seats: 1 }],
      teamSize: 1,
      primaryUseCase: 'coding',
    });

    const rec = result.recommendations.find(r => r.toolId === 'claude' && r.type === 'alternative');
    expect(rec).toBeDefined();
    expect(rec.monthlySavings).toBe(20);
    expect(rec.toPlan).toContain('Cursor');
  });

  test('does NOT flag Claude Pro for non-coding use case', () => {
    const result = runAudit({
      tools: [{ toolId: 'claude', planKey: 'pro', seats: 1 }],
      teamSize: 1,
      primaryUseCase: 'writing',
    });

    const rec = result.recommendations.find(r => r.toolId === 'claude' && r.type === 'alternative');
    expect(rec).toBeUndefined();
  });
});

// ─── Test 4: Duplicate coding tools ──────────────────────────────────────────
describe('Rule: Duplicate coding tool detection', () => {
  test('flags redundancy when Cursor Pro AND GitHub Copilot Business are active', () => {
    const result = runAudit({
      tools: [
        { toolId: 'cursor', planKey: 'pro', seats: 3 },
        { toolId: 'githubCopilot', planKey: 'business', seats: 3 },
      ],
      teamSize: 3,
      primaryUseCase: 'coding',
    });

    const rec = result.recommendations.find(r => r.type === 'redundancy');
    expect(rec).toBeDefined();
    expect(rec.monthlySavings).toBeGreaterThan(0);
  });

  test('does NOT flag single coding tool', () => {
    const result = runAudit({
      tools: [{ toolId: 'cursor', planKey: 'pro', seats: 2 }],
      teamSize: 2,
      primaryUseCase: 'coding',
    });

    const rec = result.recommendations.find(r => r.type === 'redundancy');
    expect(rec).toBeUndefined();
  });
});

// ─── Test 5: OpenAI API high spend ────────────────────────────────────────────
describe('Rule: OpenAI API high spend → Claude Haiku suggestion', () => {
  test('flags OpenAI API spend over $100/mo', () => {
    const result = runAudit({
      tools: [{ toolId: 'openaiApi', planKey: 'payg', monthlySpend: 250 }],
      teamSize: 5,
      primaryUseCase: 'data',
    });

    const rec = result.recommendations.find(r => r.toolId === 'openaiApi');
    expect(rec).toBeDefined();
    expect(rec.monthlySavings).toBeGreaterThan(0);
    expect(rec.explanation).toContain('Haiku');
  });

  test('does NOT flag OpenAI API spend under $100', () => {
    const result = runAudit({
      tools: [{ toolId: 'openaiApi', planKey: 'payg', monthlySpend: 50 }],
      teamSize: 2,
      primaryUseCase: 'data',
    });

    const rec = result.recommendations.find(r => r.toolId === 'openaiApi');
    expect(rec).toBeUndefined();
  });
});

// ─── Test 6: GitHub Copilot Enterprise for small dev team ─────────────────────
describe('Rule: GitHub Copilot Enterprise overkill for small teams', () => {
  test('recommends downgrade to Business for 5-dev team on Enterprise', () => {
    const result = runAudit({
      tools: [{ toolId: 'githubCopilot', planKey: 'enterprise', seats: 5 }],
      teamSize: 5,
      primaryUseCase: 'coding',
    });

    const rec = result.recommendations.find(r => r.toolId === 'githubCopilot' && r.type === 'downgrade');
    expect(rec).toBeDefined();
    // Savings: (39-19)*5 = 100
    expect(rec.monthlySavings).toBe(100);
    expect(rec.yearlySavings).toBe(1200);
  });
});

// ─── Test 7: Cursor Business for solo dev → Pro ───────────────────────────────
describe('Rule: Cursor Business unnecessary for solo developers', () => {
  test('recommends Cursor Pro for 1-seat Cursor Business', () => {
    const result = runAudit({
      tools: [{ toolId: 'cursor', planKey: 'business', seats: 1 }],
      teamSize: 1,
      primaryUseCase: 'coding',
    });

    const rec = result.recommendations.find(r => r.toolId === 'cursor' && r.type === 'downgrade');
    expect(rec).toBeDefined();
    expect(rec.monthlySavings).toBe(20); // 40-20=20
    expect(rec.yearlySavings).toBe(240);
  });
});

// ─── Test 8: Total savings calculation ───────────────────────────────────────
describe('Audit totals aggregation', () => {
  test('correctly sums monthly and yearly savings across multiple recommendations', () => {
    const result = runAudit({
      tools: [
        { toolId: 'chatgpt', planKey: 'team', seats: 2 }, // saves $10/mo
        { toolId: 'cursor', planKey: 'business', seats: 1 }, // saves $20/mo
      ],
      teamSize: 3,
      primaryUseCase: 'coding',
    });

    expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(30);
    expect(result.totalYearlySavings).toBe(result.totalMonthlySavings * 12);
    expect(result.savingsPercentage).toBeGreaterThan(0);
  });

  test('returns zero savings when no rules fire', () => {
    const result = runAudit({
      tools: [{ toolId: 'chatgpt', planKey: 'plus', seats: 1 }],
      teamSize: 1,
      primaryUseCase: 'writing',
    });

    expect(result.totalMonthlySavings).toBe(0);
    expect(result.recommendations.length).toBe(0);
  });
});

// ─── Test 9: getEffectiveCost helper ─────────────────────────────────────────
describe('getEffectiveCost helper', () => {
  test('uses explicit monthlySpend when provided', () => {
    const cost = getEffectiveCost({ toolId: 'openaiApi', planKey: 'payg', monthlySpend: 175 });
    expect(cost).toBe(175);
  });

  test('calculates from plan price * seats for seat-based plans', () => {
    const cost = getEffectiveCost({ toolId: 'chatgpt', planKey: 'team', seats: 4 });
    expect(cost).toBe(100); // 25 * 4
  });
});
