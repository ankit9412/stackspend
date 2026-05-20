const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  type: { type: String, enum: ['downgrade', 'alternative', 'redundancy'], required: true },
  title: { type: String, required: true },
  toolId: String,
  fromPlan: String,
  toPlan: String,
  monthlySavings: { type: Number, default: 0 },
  yearlySavings: { type: Number, default: 0 },
  explanation: String,
  confidence: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
}, { _id: false });

const toolEntrySchema = new mongoose.Schema({
  toolId: { type: String, required: true },
  planKey: { type: String, required: true },
  seats: { type: Number, default: 1 },
  monthlySpend: { type: Number, default: 0 },
  effectiveCost: Number,
}, { _id: false });

const auditSchema = new mongoose.Schema({
  shareId: { type: String, unique: true, required: true, index: true },
  tools: [toolEntrySchema],
  teamSize: { type: Number, default: 1 },
  primaryUseCase: {
    type: String,
    enum: ['coding', 'writing', 'research', 'data', 'mixed'],
    default: 'mixed',
  },

  // Results
  currentMonthlySpend: { type: Number, default: 0 },
  optimizedMonthlySpend: { type: Number, default: 0 },
  totalMonthlySavings: { type: Number, default: 0 },
  totalYearlySavings: { type: Number, default: 0 },
  savingsPercentage: { type: Number, default: 0 },
  recommendations: [recommendationSchema],

  // AI summary
  aiSummary: { type: String, default: '' },
  summarySource: { type: String, enum: ['ai', 'fallback'], default: 'fallback' },

  // Lead capture (optional)
  leadEmail: { type: String, trim: true, lowercase: true },
  leadCompany: String,
  leadRole: String,
  leadCaptured: { type: Boolean, default: false },

  // Meta
  isPublic: { type: Boolean, default: true },
  viewCount: { type: Number, default: 0 },
  ipHash: String, // hashed for spam prevention
}, {
  timestamps: true,
  versionKey: false,
});

// TTL: auto-expire public audits after 90 days
auditSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

module.exports = mongoose.model('Audit', auditSchema);
