const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  },
  company: { type: String, trim: true },
  role: { type: String, trim: true },
  teamSize: Number,
  auditShareId: { type: String, index: true },
  source: { type: String, default: 'audit_result' },
  ipHash: String,
  subscribed: { type: Boolean, default: true },
}, {
  timestamps: true,
  versionKey: false,
});

// Prevent duplicate leads by email
leadSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Lead', leadSchema);
