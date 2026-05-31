// /**
//  * Express App Configuration
//  * Configuración principal de la aplicación
//  */

// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const compression = require('compression');
// const env = require('./config/env');
// const routes = require('./routes');
// const errorHandler = require('./middleware/errorHandler.middleware');
// const { generalLimiter } = require('./middleware/rateLimiter.middleware');
// const { sanitizeBody } = require('./middleware/validation.middleware');
// const logger = require('./utils/logger');

// const app = express();

// // =====================================================
// // Security Middlewares
// // =====================================================

// // Helmet para seguridad de headers HTTP
// app.use(helmet());

// // CORS configuration
// app.use(cors({
//   origin: env.isDevelopment ? '*' : process.env.CORS_ORIGIN?.split(',') || '*',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // =====================================================
// // Standard Middlewares
// // =====================================================

// // Compression para respuestas GZIP
// app.use(compression());

// // Body parsing
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Sanitize request body
// app.use(sanitizeBody);

// // =====================================================
// // Logging
// // =====================================================

// // Morgan para logging de HTTP requests
// if (!env.isTest) {
//   app.use(morgan('combined', {
//     stream: {
//       write: (message) => logger.http(message.trim())
//     }
//   }));
// }

// // =====================================================
// // Rate Limiting
// // =====================================================

// // Apply rate limiting to all routes
// app.use(generalLimiter);

// // =====================================================
// // Routes
// // =====================================================

// // API Routes
// app.use('/', routes);

// // =====================================================
// // Error Handling
// // =====================================================

// // Global error handler (must be last)
// app.use(errorHandler);

// module.exports = app;

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

// Morgan para logging de HTTP requests - VERSIÓN CORREGIDA
if (!env.isTest) {
  // Crear stream personalizado que transforme el log de morgan
  const stream = {
    write: (message) => {
      // El mensaje de morgan viene como "GET /path 200 123ms"
      // Lo parseamos para enviarlo correctamente al logger
      const trimmed = message.trim();
      // Simplemente mostramos el mensaje en consola
      if (env.isDevelopment) {
        if (trimmed.includes(' 2')) {
          console.log(`📡 ${trimmed}`);
        } else if (trimmed.includes(' 3')) {
          console.log(`📡 ${trimmed}`);
        } else if (trimmed.includes(' 4')) {
          console.log(`⚠️ ${trimmed}`);
        } else if (trimmed.includes(' 5')) {
          console.log(`❌ ${trimmed}`);
        } else {
          console.log(`📡 ${trimmed}`);
        }
      } else {
        logger.info(trimmed);
      }
    }
  };
  
  app.use(morgan('combined', { stream }));
}

// =====================================================
// Rate Limiting
// =====================================================

// Apply rate limiting to all routes
app.use(generalLimiter);

// =====================================================
// Routes
// =====================================================
// =====================================================
// RUTAS DE PRUEBA (TEMPORALES)
// =====================================================

// Ruta POST de prueba simple
app.post('/test', (req, res) => {
  console.log('✅ POST /test recibido', req.body);
  res.json({ 
    success: true, 
    message: 'POST funciona correctamente',
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

// Ruta POST de prueba con parámetros
app.post('/api/test', (req, res) => {
  console.log('✅ POST /api/test recibido', req.body);
  res.json({ 
    success: true, 
    message: 'API POST funciona',
    received: req.body 
  });
});

// Ruta de registro temporal
app.post('/api/auth/register-test', (req, res) => {
  console.log('✅ Registro temporal recibido', req.body);
  res.json({ 
    success: true, 
    message: 'Registro temporal exitoso',
    data: req.body 
  });
});

// =====================================================
// Routes
// =====================================================
app.use('/', routes);
// =====================================================
// Routes
// =====================================================

// Ruta de bienvenida (pública)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Gestión de Inventarios',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      register: '/api/auth/register',
      login: '/api/auth/login'
    }
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/', routes);

// =====================================================
// Error Handling
// =====================================================

// API Routes
app.use('/', routes);

// =====================================================
// Error Handling
// =====================================================

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;