require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const auditRoutes = require('./routes/audit');
const leadRoutes = require('./routes/leads');
const shareRoutes = require('./routes/share');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:5173'
    ].filter(Boolean);
    
    // Allow standard URL and dynamic Vercel preview/git URLs
    const isVercelOrigin = origin.startsWith('https://stackspend-fsp2') && origin.endsWith('.vercel.app');
    
    if (allowed.includes(origin) || isVercelOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Rate limiting - global
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});

// Stricter limit for AI routes
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'AI summary request limit reached. Please try again in an hour.' },
});

app.use(globalLimiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'StackSpend API' });
});

// API routes
app.use('/api/audit', auditRoutes);
app.use('/api/audit/summary', aiLimiter); // extra guard on AI endpoint
app.use('/api/leads', leadRoutes);
app.use('/api/share', shareRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 StackSpend API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

module.exports = app;
