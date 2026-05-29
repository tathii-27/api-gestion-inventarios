/**
 * Marca Model
 * Catálogo de marcas de equipos
 */

const BaseModel = require('./BaseModel');
const { executeQuery } = require('../config/database');

class Marca extends BaseModel {
  constructor() {
    super('marcas');
  }

  /**
   * Get all marcas ordered by nombre
   * @returns {Promise<Array>}
   */
  async findAllOrdered() {
    const query = `SELECT * FROM ${this.tableName} ORDER BY nombre ASC`;
    return executeQuery(query);
  }

  /**
   * Check if marca is being used by any inventario
   * @param {number} id - Marca ID
   * @returns {Promise<boolean>}
   */
  async isInUse(id) {
    const query = 'SELECT COUNT(*) as total FROM inventarios WHERE marca_id = ?';
    const rows = await executeQuery(query, [id]);
    return rows[0].total > 0;
  }
}

module.exports = new Marca();