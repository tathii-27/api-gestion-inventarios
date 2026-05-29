/**
 * Base Model
 * Clase base para todos los modelos con funcionalidades comunes
 */

const { executeQuery } = require('../config/database');
const logger = require('../utils/logger');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * Find all records with optional filters
   * @param {Object} filters - Query filters
   * @param {Object} options - Query options (limit, offset, orderBy)
   * @returns {Promise<Array>}
   */
  async findAll(filters = {}, options = {}) {
    let query = `SELECT * FROM ${this.tableName} WHERE 1=1`;
    const params = [];

    // Build WHERE clause
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query += ` AND ${key} = ?`;
        params.push(value);
      }
    });

    // Add ORDER BY
    if (options.orderBy) {
      query += ` ORDER BY ${options.orderBy} ${options.orderDir || 'ASC'}`;
    }

    // Add LIMIT and OFFSET
    if (options.limit) {
      query += ` LIMIT ?`;
      params.push(options.limit);
      if (options.offset) {
        query += ` OFFSET ?`;
        params.push(options.offset);
      }
    }

    return executeQuery(query, params);
  }

  /**
   * Find record by ID
   * @param {number|string} id - Record ID
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const rows = await executeQuery(query, [id]);
    return rows[0] || null;
  }

  /**
   * Find record by field
   * @param {string} field - Field name
   * @param {any} value - Field value
   * @returns {Promise<Object|null>}
   */
  async findBy(field, value) {
    const query = `SELECT * FROM ${this.tableName} WHERE ${field} = ?`;
    const rows = await executeQuery(query, [value]);
    return rows[0] || null;
  }

  /**
   * Create new record
   * @param {Object} data - Record data
   * @returns {Promise<Object>}
   */
  async create(data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map(() => '?').join(', ');
    
    const query = `
      INSERT INTO ${this.tableName} (${fields.join(', ')})
      VALUES (${placeholders})
    `;
    
    const result = await executeQuery(query, values);
    return this.findById(result.insertId);
  }

  /**
   * Update record
   * @param {number|string} id - Record ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE id = ?
    `;
    
    await executeQuery(query, [...values, id]);
    return this.findById(id);
  }

  /**
   * Delete record
   * @param {number|string} id - Record ID
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    await executeQuery(query, [id]);
    return true;
  }

  /**
   * Count records
   * @param {Object} filters - Query filters
   * @returns {Promise<number>}
   */
  async count(filters = {}) {
    let query = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE 1=1`;
    const params = [];

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query += ` AND ${key} = ?`;
        params.push(value);
      }
    });

    const rows = await executeQuery(query, params);
    return rows[0].total;
  }

  /**
   * Check if record exists
   * @param {string} field - Field name
   * @param {any} value - Field value
   * @returns {Promise<boolean>}
   */
  async exists(field, value) {
    const count = await this.count({ [field]: value });
    return count > 0;
  }

  /**
   * Begin transaction
   * @returns {Promise<Object>}
   */
  async beginTransaction() {
    const { beginTransaction } = require('../config/database');
    return beginTransaction();
  }
}

module.exports = BaseModel;