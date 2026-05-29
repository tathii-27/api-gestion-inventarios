/**
 * Logger utility
 * Configuración de logging centralizada
 */

const env = require('../config/env');

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const currentLogLevel = env.isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;

/**
 * Format log message
 * @param {string} level - Log level
  * @param {string} message - Log message
 * @param {Object} meta - Additional metadata
 * @returns {Object} Formatted log object
 */
const formatLog = (level, message, meta = {}) => {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  };
};

/**
 * Log with color in development
 * @param {string} color - ANSI color code
 * @param {string} message - Log message
 */
const logWithColor = (color, message) => {
  if (env.isDevelopment) {
    console.log(`\x1b[${color}m${message}\x1b[0m`);
  } else {
    console.log(message);
  }
};

const logger = {
  error: (message, meta = {}) => {
    if (currentLogLevel >= LOG_LEVELS.ERROR) {
      const log = formatLog('ERROR', message, meta);
      console.error(JSON.stringify(log));
    }
  },

  warn: (message, meta = {}) => {
    if (currentLogLevel >= LOG_LEVELS.WARN) {
      const log = formatLog('WARN', message, meta);
      console.warn(JSON.stringify(log));
    }
  },

  info: (message, meta = {}) => {
    if (currentLogLevel >= LOG_LEVELS.INFO) {
      const log = formatLog('INFO', message, meta);
      if (env.isDevelopment) {
        logWithColor('36', `ℹ️ ${message}`);
      } else {
        console.log(JSON.stringify(log));
      }
    }
  },

  debug: (message, meta = {}) => {
    if (currentLogLevel >= LOG_LEVELS.DEBUG) {
      const log = formatLog('DEBUG', message, meta);
      if (env.isDevelopment) {
        logWithColor('90', `🐛 ${message}`);
      } else {
        console.log(JSON.stringify(log));
      }
    }
  },

  http: (req, res, responseTime) => {
    const message = `${req.method} ${req.url} ${res.statusCode} - ${responseTime}ms`;
    if (env.isDevelopment) {
      const color = res.statusCode >= 400 ? '31' : '32';
      logWithColor(color, `📡 ${message}`);
    } else {
      logger.info(message, {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseTime,
        ip: req.ip
      });
    }
  }
};

module.exports = logger;