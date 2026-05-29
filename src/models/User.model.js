/**
 * User Model
 * Manejo de usuarios y autenticación
 */

const BaseModel = require('./BaseModel');
const { executeQuery } = require('../config/database');
const bcrypt = require('bcryptjs');
const env = require('../config/env');

class User extends BaseModel {
  constructor() {
    super('usuarios');
  }

  /**
   * Create new user with encrypted password
   * @param {Object} userData - User data
   * @returns {Promise<Object>}
   */
  async create(userData) {
    const { password, ...rest } = userData;
    
    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, env.bcrypt.rounds);
    
    return super.create({
      ...rest,
      password: hashedPassword
    });
  }

  /**
   * Update user with optional password update
   * @param {number} id - User ID
   * @param {Object} userData - User data
   * @returns {Promise<Object>}
   */
  async update(id, userData) {
    const { password, ...rest } = userData;
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, env.bcrypt.rounds);
      return super.update(id, {
        ...rest,
        password: hashedPassword
      });
    }
    
    return super.update(id, rest);
  }

  /**
   * Find user by email with password (for authentication)
   * @param {string} email - User email
   * @returns {Promise<Object|null>}
   */
  async findByEmailWithPassword(email) {
    const query = `SELECT * FROM ${this.tableName} WHERE email = ?`;
    const rows = await executeQuery(query, [email]);
    return rows[0] || null;
  }

  /**
   * Find user by email (public data)
   * @param {string} email - User email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    const query = `
      SELECT id, nombre, email, rol, is_active, last_login, created_at, updated_at
      FROM ${this.tableName}
      WHERE email = ?
    `;
    const rows = await executeQuery(query, [email]);
    return rows[0] || null;
  }

  /**
   * Compare password
   * @param {string} plainPassword - Plain text password
   * @param {string} hashedPassword - Hashed password
   * @returns {Promise<boolean>}
   */
  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Update last login timestamp
   * @param {number} id - User ID
   * @returns {Promise<void>}
   */
  async updateLastLogin(id) {
    const query = `
      UPDATE ${this.tableName}
      SET last_login = NOW()
      WHERE id = ?
    `;
    await executeQuery(query, [id]);
  }

  /**
   * Get users with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {Object} filters - Filters
   * @returns {Promise<Object>}
   */
  async getPaginated(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (filters.rol) {
      whereClause += ' AND rol = ?';
      params.push(filters.rol);
    }

    if (filters.is_active !== undefined) {
      whereClause += ' AND is_active = ?';
      params.push(filters.is_active);
    }

    if (filters.search) {
      whereClause += ' AND (nombre LIKE ? OR email LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const countQuery = `
      SELECT COUNT(*) as total FROM ${this.tableName} ${whereClause}
    `;
    const countResult = await executeQuery(countQuery, params);
    const total = countResult[0].total;

    const dataQuery = `
      SELECT id, nombre, email, rol, is_active, last_login, created_at, updated_at
      FROM ${this.tableName}
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const data = await executeQuery(dataQuery, [...params, limit, offset]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = new User();