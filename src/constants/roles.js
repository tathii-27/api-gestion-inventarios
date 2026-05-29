/**
 * Database configuration
 * Configuración de conexión a MySQL con pool de conexiones
 */

const mysql = require('mysql2');
const env = require('./env');
const logger = require('../utils/logger');

// Create connection pool
const pool = mysql.createPool({
  ...env.db,
  typeCast: function(field, next) {
    // Custom type casting for boolean fields
    if (field.type === 'TINY' && field.length === 1) {
      return field.string() === '1';
    }
    return next();
  }
});

// Promise wrapper
const promisePool = pool.promise();

/**
 * Test database connection
 * @returns {Promise<boolean>}
 */
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    logger.info('✅ Base de datos conectada exitosamente');
    connection.release();
    return true;
  } catch (error) {
    logger.error('❌ Error de conexión a la base de datos:', {
      message: error.message,
      code: error.code,
      errno: error.errno
    });
    return false;
  }
};

/**
 * Execute query with error handling
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>}
 */
const executeQuery = async (sql, params = []) => {
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (error) {
    logger.error('Error ejecutando query:', { sql, params, error: error.message });
    throw error;
  }
};

/**
 * Begin transaction
 * @returns {Promise<void>}
 */
const beginTransaction = async () => {
  const connection = await promisePool.getConnection();
  await connection.beginTransaction();
  return connection;
};

/**
 * Commit transaction
 * @param {Object} connection - Database connection
 * @returns {Promise<void>}
 */
const commitTransaction = async (connection) => {
  await connection.commit();
  connection.release();
};

/**
 * Rollback transaction
 * @param {Object} connection - Database connection
 * @returns {Promise<void>}
 */
const rollbackTransaction = async (connection) => {
  await connection.rollback();
  connection.release();
};

module.exports = {
  pool: promisePool,
  testConnection,
  executeQuery,
  beginTransaction,
  commitTransaction,
  rollbackTransaction
};