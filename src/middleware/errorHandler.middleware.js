/**
 * Global error handler middleware
 * Manejo centralizado de errores
 */

const env = require('../config/env');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

/**
 * Handle MySQL duplicate entry error
 * @param {Error} error - MySQL error
 * @returns {AppError}
 */
const handleDuplicateKeyError = (error) => {
  const field = error.message.match(/for key '(.+)'/)?.[1] || 'campo';
  return AppError.conflict(`El valor ya existe para ${field}`);
};

/**
 * Handle MySQL foreign key constraint error
 * @returns {AppError}
 */
const handleForeignKeyError = () => {
  return AppError.badRequest(
    'No se puede eliminar el registro porque está siendo utilizado por otros registros'
  );
};

/**
 * Handle JWT errors
 * @param {Error} error - JWT error
 * @returns {AppError}
 */
const handleJWTError = (error) => {
  if (error.name === 'JsonWebTokenError') {
    return AppError.unauthorized('Token inválido');
  }
  if (error.name === 'TokenExpiredError') {
    return AppError.unauthorized('Token expirado');
  }
  return AppError.unauthorized('Error de autenticación');
};

/**
 * Handle validation errors
 * @param {Error} error - Validation error
 * @returns {AppError}
 */
const handleValidationError = (error) => {
  const errors = {};
  
  if (error.errors) {
    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });
  }
  
  return AppError.validation('Error de validación de datos', errors);
};

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log error
  logger.error(`Error en ${req.method} ${req.path}:`, {
    message: error.message,
    stack: error.stack,
    ip: req.ip,
    userId: req.user?.id
  });

  // Handle specific error types
  if (error.code === 'ER_DUP_ENTRY') {
    error = handleDuplicateKeyError(error);
  }

  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    error = handleForeignKeyError();
  }

  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    error = handleJWTError(error);
  }

  if (error.name === 'ValidationError') {
    error = handleValidationError(error);
  }

  // Ensure error is AppError instance
  if (!(error instanceof AppError)) {
    error = new AppError(
      error.message || 'Error interno del servidor',
      error.statusCode || 500
    );
  }

  // Send response
  const response = {
    success: false,
    message: error.message,
    code: error.code,
    timestamp: error.timestamp || new Date().toISOString()
  };

  // Add details in development
  if (env.isDevelopment) {
    response.stack = error.stack;
    response.details = error.details;
  }

  // Add validation errors
  if (error.details) {
    response.errors = error.details;
  }

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;