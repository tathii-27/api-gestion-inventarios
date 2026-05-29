/**
 * Response formatter utility
 * Estandariza las respuestas de la API
 */

/**
 * Format success response
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */
const successResponse = (res, data = null, message = 'Operación exitosa', statusCode = 200) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  if (data && data.pagination) {
    response.pagination = data.pagination;
    delete response.data.pagination;
  }

  return res.status(statusCode).json(response);
};

/**
 * Format error response
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 */
const errorResponse = (res, error) => {
  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    message: error.message || 'Error interno del servidor',
    code: error.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString()
  };

  if (error.details && process.env.NODE_ENV !== 'production') {
    response.details = error.details;
  }

  if (process.env.NODE_ENV === 'development' && error.stack) {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};

/**
 * Format paginated response
 * @param {Array} data - Paginated data
 * @param {Object} pagination - Pagination metadata
 * @returns {Object} Formatted response
 */
const paginatedResponse = (data, pagination) => {
  return {
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      pages: Math.ceil(pagination.total / pagination.limit)
    }
  };
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};