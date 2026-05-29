/**
 * Estado Model
 * Catálogo de estados de equipos
 */

const BaseModel = require('./BaseModel');
const { executeQuery } = require('../config/database');

class Estado extends BaseModel {
  constructor() {
    super('estados');
  }

  /**
   * Get all estados ordered by nombre
   * @returns {Promise<Array>}
   */
  async findAllOrdered() {
    const query = `SELECT * FROM ${this.tableName} ORDER BY nombre ASC`;
    return executeQuery(query);
  }

  /**
   * Check if estado is being used by any inventario
   * @param {number} id - Estado ID
   * @returns {Promise<boolean>}
   */
  async isInUse(id) {
    const query = 'SELECT COUNT(*) as total FROM inventarios WHERE estado_id = ?';
    const rows = await executeQuery(query, [id]);
    return rows[0].total > 0;
  }
}

module.exports = new Estado();