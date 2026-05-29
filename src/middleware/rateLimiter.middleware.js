/**
 * Rate limiter middleware
 * Previene ataques de fuerza bruta y abuso de la API
 */

const rateLimit = require('express-rate-limit');
const env = require('../config/env');

/**
 * General rate limiter for all endpoints
 */
const generalLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP. Por favor, intente más tarde.',
    code: 'TOO_MANY_REQUESTS'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in development
    return env.isDevelopment;
  }
});

/**
 * Strict rate limiter for auth endpoints
 * Más restrictivo para prevenir ataques de fuerza bruta
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión. Por favor, intente más tarde.',
    code: 'TOO_MANY_AUTH_ATTEMPTS'
  },
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    // Use email as key for rate limiting if available
    return req.body.email || req.ip;
  }
});

/**
 * API limiter for non-authenticated endpoints
 */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    success: false,
    message: 'Límite de peticiones alcanzado. Por favor, reduzca la frecuencia.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  apiLimiter
};