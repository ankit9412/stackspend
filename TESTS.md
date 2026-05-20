# TESTS.md — StackSpend Test Documentation

## Test Runner
**Jest** (backend only) — `cd backend && npm test`

## Test File
`backend/tests/auditEngine.test.js`

---

## How to Run

```bash
cd backend
npm install          # first time only
npm test             # run all 16 tests once
npm run test:watch   # watch mode (re-runs on file save)
npm run test:coverage  # with Istanbul coverage report
```

Expected output:
```
PASS tests/auditEngine.test.js
  Rule: ChatGPT Team with fewer than 3 seats
    ✓ recommends downgrade from Team to Plus for 2 users (X ms)
    ✓ does NOT flag ChatGPT Team for 5 users (X ms)
  ...
Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
```

---

## Full Test Coverage Table

| # | `describe` block | Test description | Rule / function tested | What it verifies |
|---|---|---|---|---|
| 1 | ChatGPT Team < 3 seats | recommends downgrade from Team to Plus for 2 users | `ruleChatGPTTeamSmallTeam` | `monthlySavings === 10`, `yearlySavings === 120`, title contains "Plus" |
| 2 | ChatGPT Team < 3 seats | does NOT flag ChatGPT Team for 5 users | `ruleChatGPTTeamSmallTeam` | No downgrade recommendation returned |
| 3 | ChatGPT Enterprise small team | flags Enterprise for 10-person team, recommends Team | `ruleChatGPTEnterpriseSmallTeam` | `monthlySavings === 350`, `yearlySavings === 4200` |
| 4 | ChatGPT Enterprise small team | does NOT flag Enterprise for 60-person team | `ruleChatGPTEnterpriseSmallTeam` | No recommendation returned |
| 5 | Claude Pro for coding | recommends switching Claude Pro → Cursor Pro for coding | `ruleClaudeProForCoding` | `monthlySavings === 20`, `toPlan` contains "Cursor" |
| 6 | Claude Pro for coding | does NOT flag Claude Pro for writing use case | `ruleClaudeProForCoding` | No alternative recommendation returned |
| 7 | Duplicate coding tools | flags redundancy: Cursor Pro + GitHub Copilot Business | `ruleDuplicateCodingTools` | Redundancy rec exists, `monthlySavings > 0` |
| 8 | Duplicate coding tools | does NOT flag single coding tool | `ruleDuplicateCodingTools` | No redundancy recommendation |
| 9 | OpenAI API high spend | flags OpenAI API at $250/mo, suggests Claude Haiku | `ruleOpenAIApiHighSpend` | Rec exists, `monthlySavings > 0`, `explanation` contains "Haiku" |
| 10 | OpenAI API high spend | does NOT flag OpenAI API at $50/mo | `ruleOpenAIApiHighSpend` | No recommendation |
| 11 | Copilot Enterprise small team | recommends downgrade to Business for 5-dev team | `ruleGitHubCopilotEnterpriseSmall` | `monthlySavings === 100`, `yearlySavings === 1200` |
| 12 | Cursor Business solo | recommends Cursor Pro for 1-seat Business plan | `ruleCursorBusinessSolo` | `monthlySavings === 20`, `yearlySavings === 240` |
| 13 | Audit totals aggregation | correctly sums savings across multiple recommendations | Totals calculation | `totalMonthlySavings >= 30`, `yearlySavings === monthly * 12`, `savingsPercentage > 0` |
| 14 | Audit totals aggregation | returns zero savings when no rules fire | All rules (negative path) | `totalMonthlySavings === 0`, `recommendations.length === 0` |
| 15 | `getEffectiveCost` helper | uses explicit `monthlySpend` when provided | `getEffectiveCost()` | Returns `175` for `monthlySpend: 175` |
| 16 | `getEffectiveCost` helper | calculates from `pricePerSeat * seats` for seat plans | `getEffectiveCost()` | Returns `100` for ChatGPT Team × 4 seats |

---

## Audit Engine Rule Coverage

| Rule | Happy path | Negative path | Boundary |
|---|---|---|---|
| `ruleChatGPTTeamSmallTeam` | ✅ (#1) | ✅ (#2) | threshold is seats < 3 |
| `ruleChatGPTEnterpriseSmallTeam` | ✅ (#3) | ✅ (#4) | threshold is seats < 50 |
| `ruleGitHubCopilotEnterpriseSmall` | ✅ (#11) | — | threshold is seats < 20 |
| `ruleClaudeProForCoding` | ✅ (#5) | ✅ (#6) | depends on `primaryUseCase` |
| `ruleOpenAIApiHighSpend` | ✅ (#9) | ✅ (#10) | threshold is monthlySpend > $100 |
| `ruleCursorBusinessSolo` | ✅ (#12) | — | threshold is seats ≤ 2 |
| `ruleDuplicateCodingTools` | ✅ (#7) | ✅ (#8) | requires 2+ non-free coding tools |
| `ruleAnthropicApiHighSpend` | — | — | mirrors OpenAI pattern |
| `ruleWindsurfTeamsSmall` | — | — | threshold is seats < 5 |
| `ruleGeminiEnterpriseSmall` | — | — | threshold is seats < 30 |
| `ruleDuplicateAssistants` | — | — | requires 2+ paid assistants |
| `getEffectiveCost()` | ✅ (#15) | ✅ (#16) | explicit vs. calculated |
| Totals aggregation | ✅ (#13) | ✅ (#14) | multi-rec + zero-rec cases |

---

## Future Test Coverage (not yet written)

- [ ] `ruleAnthropicApiHighSpend` — happy + negative path
- [ ] `ruleWindsurfTeamsSmall` — happy + negative path
- [ ] `ruleGeminiEnterpriseSmall` — happy + negative path
- [ ] `ruleDuplicateAssistants` — ChatGPT + Claude + Gemini overlap
- [ ] Controller integration tests (supertest) — POST /api/audit end-to-end
- [ ] Share endpoint: `GET /api/share/:shareId` — valid ID, invalid ID, stripped fields
- [ ] Lead endpoint: deduplication by email (upsert idempotency)
- [ ] AI summary fallback — mock OpenRouter client, verify template string returned
- [ ] Boundary: `ruleChatGPTTeamSmallTeam` exactly at threshold (seats === 3 → no flag)
