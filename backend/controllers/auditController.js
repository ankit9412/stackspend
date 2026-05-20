const crypto = require('crypto');
const { nanoid } = require('nanoid');
const Audit = require('../models/Audit');
const { runAudit } = require('../utils/auditEngine');
const { generateAISummary } = require('../services/aiSummary');

// ─── Input Validation ─────────────────────────────────────────────────────────

const VALID_TOOLS = ['chatgpt', 'claude', 'gemini', 'cursor', 'githubCopilot', 'windsurf', 'openaiApi', 'anthropicApi'];
const VALID_USE_CASES = ['coding', 'writing', 'research', 'data', 'mixed'];

function validateAuditInput(body) {
  const errors = [];

  if (!Array.isArray(body.tools) || body.tools.length === 0) {
    errors.push('At least one tool is required.');
  }

  if (body.tools?.length > 10) {
    errors.push('Maximum 10 tools per audit.');
  }

  body.tools?.forEach((tool, idx) => {
    if (!VALID_TOOLS.includes(tool.toolId)) {
      errors.push(`Tool at index ${idx}: invalid toolId "${tool.toolId}".`);
    }
    if (!tool.planKey) {
      errors.push(`Tool at index ${idx}: planKey is required.`);
    }
    if (tool.seats !== undefined && (tool.seats < 1 || tool.seats > 10000)) {
      errors.push(`Tool at index ${idx}: seats must be between 1 and 10000.`);
    }
    if (tool.monthlySpend !== undefined && tool.monthlySpend < 0) {
      errors.push(`Tool at index ${idx}: monthlySpend cannot be negative.`);
    }
  });

  if (body.teamSize && (body.teamSize < 1 || body.teamSize > 100000)) {
    errors.push('teamSize must be between 1 and 100000.');
  }

  if (body.primaryUseCase && !VALID_USE_CASES.includes(body.primaryUseCase)) {
    errors.push(`primaryUseCase must be one of: ${VALID_USE_CASES.join(', ')}.`);
  }

  return errors;
}

// ─── Controller Methods ───────────────────────────────────────────────────────

/**
 * POST /api/audit
 * Run audit and store result with a unique share ID.
 */
async function createAudit(req, res) {
  try {
    const validationErrors = validateAuditInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ success: false, errors: validationErrors });
    }

    const { tools, teamSize = 1, primaryUseCase = 'mixed' } = req.body;

    // Run deterministic audit
    const auditResult = runAudit({ tools, teamSize, primaryUseCase });

    // Generate AI summary (with fallback)
    const { summary, source } = await generateAISummary(auditResult, { teamSize, primaryUseCase });

    // Create unique share ID (12-char, URL-safe)
    const shareId = nanoid(12);

    // Hash IP for spam tracking (privacy-safe)
    const ipHash = crypto
      .createHash('sha256')
      .update(req.ip || 'unknown')
      .digest('hex')
      .slice(0, 16);

    // Persist to MongoDB
    const audit = await Audit.create({
      shareId,
      tools,
      teamSize,
      primaryUseCase,
      ...auditResult,
      aiSummary: summary,
      summarySource: source,
      ipHash,
    });

    res.status(201).json({
      success: true,
      data: {
        shareId: audit.shareId,
        ...auditResult,
        aiSummary: summary,
        summarySource: source,
      },
    });
  } catch (error) {
    console.error('createAudit error:', error);
    res.status(500).json({ success: false, error: 'Failed to process audit.' });
  }
}

/**
 * POST /api/audit/summary
 * Regenerate AI summary for an existing audit (rate-limited).
 */
async function regenerateSummary(req, res) {
  try {
    const { shareId } = req.body;
    if (!shareId) {
      return res.status(400).json({ success: false, error: 'shareId is required.' });
    }

    const audit = await Audit.findOne({ shareId });
    if (!audit) {
      return res.status(404).json({ success: false, error: 'Audit not found.' });
    }

    const { summary, source } = await generateAISummary(audit.toObject(), {
      teamSize: audit.teamSize,
      primaryUseCase: audit.primaryUseCase,
    });

    await Audit.updateOne({ shareId }, { aiSummary: summary, summarySource: source });

    res.json({ success: true, data: { summary, source } });
  } catch (error) {
    console.error('regenerateSummary error:', error);
    res.status(500).json({ success: false, error: 'Failed to regenerate summary.' });
  }
}

module.exports = { createAudit, regenerateSummary };
