/**
 * Express App Configuration
 * Configuración principal de la aplicación
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler.middleware');
const { generalLimiter } = require('./middleware/rateLimiter.middleware');
const { sanitizeBody } = require('./middleware/validation.middleware');
const logger = require('./utils/logger');

const app = express();

// =====================================================
// Security Middlewares
// =====================================================

// Helmet para seguridad de headers HTTP
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: env.isDevelopment ? '*' : process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// =====================================================
// Standard Middlewares
// =====================================================

// Compression para respuestas GZIP
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitize request body
app.use(sanitizeBody);

// =====================================================
// Logging
// =====================================================

// Morgan para logging de HTTP requests
if (!env.isTest) {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.http(message.trim())
    }
  }));
}

// =====================================================
// Rate Limiting
// =====================================================

// Apply rate limiting to all routes
app.use(generalLimiter);

// =====================================================
// Routes
// =====================================================

// API Routes
app.use('/', routes);

// =====================================================
// Error Handling
// =====================================================

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;