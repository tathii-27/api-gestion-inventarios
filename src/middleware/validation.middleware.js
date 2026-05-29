/**
 * Validation middleware
 * Valida datos de entrada usando express-validator
 */

const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Check validation results middleware
 * Revisa si hay errores de validación y los formatea
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    
    errors.array().forEach((error) => {
      if (error.path) {
        if (!formattedErrors[error.path]) {
          formattedErrors[error.path] = [];
        }
        formattedErrors[error.path].push(error.msg);
      }
    });

    throw AppError.validation('Error de validación de datos', formattedErrors);
  }
  
  next();
};

/**
 * Sanitize input to prevent XSS
 * @param {Object} obj - Object to sanitize
 * @returns {Object} Sanitized object
 */
const sanitizeInput = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Remove potential XSS
      sanitized[key] = value
        .replace(/[<>]/g, '')
        .trim();
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Sanitize request body middleware
 */
const sanitizeBody = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  next();
};

module.exports = {
  validate,
  sanitizeBody,
  sanitizeInput
};