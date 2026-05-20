const Audit = require('../models/Audit');

/**
 * GET /api/share/:shareId
 * Retrieve a public sanitized audit by share ID.
 * Increments view count.
 */
async function getSharedAudit(req, res) {
  try {
    const { shareId } = req.params;

    if (!shareId || shareId.length > 20 || !/^[a-zA-Z0-9_-]+$/.test(shareId)) {
      return res.status(400).json({ success: false, error: 'Invalid share ID.' });
    }

    const audit = await Audit.findOneAndUpdate(
      { shareId, isPublic: true },
      { $inc: { viewCount: 1 } },
      {
        new: true,
        select: '-_id -ipHash -leadEmail -leadCaptured -__v',
      }
    ).lean();

    if (!audit) {
      return res.status(404).json({ success: false, error: 'Audit not found or is private.' });
    }

    res.json({ success: true, data: audit });
  } catch (error) {
    console.error('getSharedAudit error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve audit.' });
  }
}

module.exports = { getSharedAudit };
