/**
 * TipoEquipo Model
 * Catálogo de tipos de equipos
 */

const BaseModel = require('./BaseModel');
const { executeQuery } = require('../config/database');

class TipoEquipo extends BaseModel {
  constructor() {
    super('tipos_equipos');
  }

  /**
   * Get all tipos de equipos ordered by nombre
   * @returns {Promise<Array>}
   */
  async findAllOrdered() {
    const query = `SELECT * FROM ${this.tableName} ORDER BY nombre ASC`;
    return executeQuery(query);
  }

  /**
   * Check if tipo is being used by any inventario
   * @param {number} id - TipoEquipo ID
   * @returns {Promise<boolean>}
   */
  async isInUse(id) {
    const query = 'SELECT COUNT(*) as total FROM inventarios WHERE tipo_equipo_id = ?';
    const rows = await executeQuery(query, [id]);
    return rows[0].total > 0;
  }
}

module.exports = new TipoEquipo();