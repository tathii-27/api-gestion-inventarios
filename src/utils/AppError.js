/**
 * Custom Application Error
 * Extiende Error nativo para manejo de errores de aplicación
 */

class AppError extends Error {
  /**
   * Create an application error
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {string} code - Error code for frontend
   * @param {Object} details - Additional error details
   */
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    this.timestamp = new Date().toISOString();

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create 400 Bad Request error
   * @param {string} message - Error message
   * @param {string} code - Error code
   * @returns {AppError}
   */
  static badRequest(message = 'Solicitud inválida', code = 'BAD_REQUEST') {
    return new AppError(message, 400, code);
  }

  /**
   * Create 401 Unauthorized error
   * @param {string} message - Error message
   * @returns {AppError}
   */
  static unauthorized(message = 'No autorizado') {
    return new AppError(message, 401, 'UNAUTHORIZED');
  }

  /**
   * Create 403 Forbidden error
   * @param {string} message - Error message
   * @returns {AppError}
   */
  static forbidden(message = 'Acceso denegado') {
    return new AppError(message, 403, 'FORBIDDEN');
  }

  /**
   * Create 404 Not Found error
   * @param {string} message - Error message
   * @returns {AppError}
   */
  static notFound(message = 'Recurso no encontrado') {
    return new AppError(message, 404, 'NOT_FOUND');
  }

  /**
   * Create 409 Conflict error
   * @param {string} message - Error message
   * @returns {AppError}
   */
  static conflict(message = 'Conflicto de recursos') {
    return new AppError(message, 409, 'CONFLICT');
  }

  /**
   * Create 422 Validation error
   * @param {string} message - Error message
   * @param {Object} details - Validation details
   * @returns {AppError}
   */
  static validation(message = 'Error de validación', details = null) {
    return new AppError(message, 422, 'VALIDATION_ERROR', details);
  }
}

module.exports = AppError;