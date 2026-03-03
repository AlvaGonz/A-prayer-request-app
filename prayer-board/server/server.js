const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security: CORS Configuration - Whitelist specific origins
const allowedOrigins = [
  'https://prayer-board-virid.vercel.app',
  'https://prayer-board-git-develop-adrianaalvarezgonz-1151s-projects.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Origin', 'Accept', 'X-Requested-With']
};

// Security: Helmet — HTTP security headers (before CORS)
// CSP disabled initially to avoid conflicts with PWA Service Worker
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "'unsafe-inline'", "https://vercel.live", "https://vitals.vercel-insights.com"],
      "connect-src": ["'self'", "https://*.sentry.io", "https://vitals.vercel-insights.com", "https://*.locize.app", "wss://*.locize.app"],
      "img-src": ["'self'", "data:", "https://images.unsplash.com", "https://prayer-board-virid.vercel.app"],
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
      "worker-src": ["'self'", "blob:"],
      "manifest-src": ["'self'"]
    },
    // Gradual CSP rollout: Report only for now as requested in PRD
    reportOnly: true
  }
}));

// Security: CORS Configuration — Whitelist specific origins
app.use(cors(corsOptions));

// Security: Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: 'Too many attempts from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false
});

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 requests per hour
  message: { error: 'Too many requests from this IP, please try again later' }
});

const prayerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 prayers per minute
  message: { error: 'Please slow down, too many prayer actions' }
});

// Apply rate limiting
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/requests/:id/pray', prayerLimiter);
app.use('/api', apiLimiter);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Note: Security headers now handled by helmet middleware above

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api', require('./routes/comments'));
app.use('/api/shared', require('./routes/shared'));

// Health check — lightweight endpoint for keep-alive pings
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Prayer Board API is running',
    version: '1.0.0',
    status: 'healthy'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  // Use structured logging or concise message instead of stack trace for production security
  console.error(`[Error] ${err.message || 'Unknown error occurred'}`);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
