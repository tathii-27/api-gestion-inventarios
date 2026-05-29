/**
 * Authentication middleware
 * Verifica JWT token y carga usuario autenticado
 */

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Extracted token
 */
const extractToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.jwt.secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw AppError.unauthorized('Token expirado. Por favor, inicie sesión nuevamente');
    }
    if (error.name === 'JsonWebTokenError') {
      throw AppError.unauthorized('Token inválido');
    }
    throw error;
  }
};

/**
 * Authentication middleware
 * Verifica que el usuario esté autenticado
 */
const authenticate = catchAsync(async (req, res, next) => {
  // Extract token from header
  const token = extractToken(req.headers.authorization);
  
  if (!token) {
    throw AppError.unauthorized('Acceso denegado. Token no proporcionado');
  }

  // Verify token
  const decoded = verifyToken(token);

  // Get user from database
  const user = await User.findById(decoded.id);
  
  if (!user) {
    throw AppError.unauthorized('Usuario no encontrado');
  }

  if (!user.is_active) {
    throw AppError.unauthorized('Usuario inactivo. Contacte al administrador');
  }

  // Attach user to request
  req.user = user;
  
  next();
});

/**
 * Optional authentication middleware
 * No falla si no hay token, solo carga usuario si existe
 */
const optionalAuth = catchAsync(async (req, res, next) => {
  const token = extractToken(req.headers.authorization);
  
  if (token) {
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      if (user && user.is_active) {
        req.user = user;
      }
    } catch (error) {
      // Silently fail for optional auth
      logger.debug('Optional auth failed:', error.message);
    }
  }
  
  next();
});

module.exports = {
  authenticate,
  optionalAuth,
  extractToken
};