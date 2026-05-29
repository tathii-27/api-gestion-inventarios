/**
 * Async error handler wrapper
 * Elimina la necesidad de try-catch en controladores
 */

const logger = require('./logger');

/**
 * Wraps an async function to catch errors and pass them to Express error handler
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      logger.error(`Error en ${fn.name || 'handler'}:`, {
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        userId: req.user?.id
      });
      next(error);
    });
  };
};

module.exports = catchAsync;