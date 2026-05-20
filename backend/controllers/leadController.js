const Lead = require('../models/Lead');
const crypto = require('crypto');

/**
 * POST /api/leads
 * Capture a lead from the results page.
 */
async function captureLead(req, res) {
  try {
    const { email, company, role, teamSize, auditShareId } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Valid email is required.' });
    }

    if (email.length > 254) {
      return res.status(400).json({ success: false, error: 'Email too long.' });
    }

    const ipHash = crypto
      .createHash('sha256')
      .update(req.ip || 'unknown')
      .digest('hex')
      .slice(0, 16);

    // Upsert by email to prevent duplicates
    await Lead.findOneAndUpdate(
      { email },
      { company, role, teamSize, auditShareId, ipHash, source: 'audit_result' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      success: true,
      message: 'Thank you! Our team will be in touch shortly.',
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate email — treat as success to avoid enumeration
      return res.json({ success: true, message: 'You\'re already on our list!' });
    }
    console.error('captureLead error:', error);
    res.status(500).json({ success: false, error: 'Failed to save your information.' });
  }
}

module.exports = { captureLead };
