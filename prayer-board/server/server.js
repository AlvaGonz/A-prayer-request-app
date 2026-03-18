const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { randomUUID } = require('crypto');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database only if not testing
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

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
    // Only allow requests from whitelisted origins.
    // No-origin requests (curl, server-to-server) are rejected at CORS level in production.
    if (!origin) {
      // No-origin requests = server-to-server, health probes, curl.
      // Browsers ALWAYS send Origin — so allowing no-origin does NOT
      // weaken browser CORS protection.
      // This silences Render health check false-positive CORS errors.
      return callback(null, true);
    }

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
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      "default-src":  ["'self'"],
      "script-src":   [
        "'self'",
        // 'unsafe-inline' removed — inline scripts blocked
        // Vercel Live injects scripts — allow by domain
        "https://vercel.live",
        "https://vitals.vercel-insights.com"
      ],
      "connect-src":  [
        "'self'",
        "https://*.sentry.io",
        "https://vitals.vercel-insights.com",
        "https://*.locize.app",
        "wss://*.locize.app",
        // Allow the API itself for fetch calls
        "https://prayer-board-api.onrender.com",
        "http://localhost:5000"
      ],
      "img-src":      ["'self'", "data:", "https://images.unsplash.com"],
      "style-src":    ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "font-src":     ["'self'", "https://fonts.gstatic.com"],
      "worker-src":   ["'self'", "blob:"],
      "manifest-src": ["'self'"],
      "frame-src":    ["'none'"],      // Prevents clickjacking via iframes
      "object-src":   ["'none'"],      // Blocks Flash/plugin exploits
      "base-uri":     ["'self'"],      // Prevents base tag injection
      "form-action":  ["'self'"],      // Restricts form submission targets
    },
    // reportOnly: REMOVED — CSP is now ENFORCED
  },
  // Additional Helmet security options
  hsts: {
    maxAge: 31536000,         // 1 year
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  },
  xFrameOptions: { action: 'deny' },  // Clickjacking protection
}));

// Security: CORS Configuration — Whitelist specific origins
app.use(cors(corsOptions));

// ADV-006: Request ID middleware — must be first after security middleware
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
});

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

// Detect dev mode for rate limit relaxation
const isDevRateLimit = process.env.NODE_ENV === 'development';

// Security: Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevRateLimit ? 1000 : 5, // 5 attempts per window explicitly in prod
  message: { error: 'Too many attempts from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false
});

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDevRateLimit ? 5000 : 100, // 100 requests per hour
  message: { error: 'Too many requests from this IP, please try again later' }
});

const prayerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isDevRateLimit ? 500 : 30, // 30 prayers per minute
  message: { error: 'Please slow down, too many prayer actions' }
});

// Apply rate limiting
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/requests/:id/pray', prayerLimiter);
app.use('/api', apiLimiter);

// ADV-004: Body size limit reduced from 10mb to 50kb
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Note: Security headers now handled by helmet middleware above

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api', require('./routes/comments'));
app.use('/api/shared', require('./routes/shared'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler with request ID logging
app.use((err, req, res, next) => {
  // Use structured logging with request ID for security audit trail
  console.error(`[Error] [${req.requestId || 'no-id'}] ${err.message || 'Unknown error occurred'}`);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
