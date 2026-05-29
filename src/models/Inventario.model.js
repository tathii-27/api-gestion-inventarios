/**
 * Inventario Model
 * Manejo de equipos en inventario
 */

const BaseModel = require('./BaseModel');
const { executeQuery } = require('../config/database');

class Inventario extends BaseModel {
  constructor() {
    super('inventarios');
  }

  /**
   * Get all inventarios with related data
   * @returns {Promise<Array>}
   */
  async findAllWithRelations() {
    const query = `
      SELECT 
        i.*,
        e.nombre as estado_nombre,
        m.nombre as marca_nombre,
        t.nombre as tipo_nombre,
        u.nombre as responsable_nombre,
        u.email as responsable_email
      FROM inventarios i
      LEFT JOIN estados e ON i.estado_id = e.id
      LEFT JOIN marcas m ON i.marca_id = m.id
      LEFT JOIN tipos_equipos t ON i.tipo_equipo_id = t.id
      LEFT JOIN usuarios u ON i.usuario_id = u.id
      ORDER BY i.created_at DESC
    `;
    return executeQuery(query);
  }

  /**
   * Get inventario by ID with relations
   * @param {number} id - Inventario ID
   * @returns {Promise<Object|null>}
   */
  async findByIdWithRelations(id) {
    const query = `
      SELECT 
        i.*,
        e.nombre as estado_nombre,
        e.descripcion as estado_descripcion,
        m.nombre as marca_nombre,
        m.descripcion as marca_descripcion,
        t.nombre as tipo_nombre,
        t.descripcion as tipo_descripcion,
        u.nombre as responsable_nombre,
        u.email as responsable_email
      FROM inventarios i
      LEFT JOIN estados e ON i.estado_id = e.id
      LEFT JOIN marcas m ON i.marca_id = m.id
      LEFT JOIN tipos_equipos t ON i.tipo_equipo_id = t.id
      LEFT JOIN usuarios u ON i.usuario_id = u.id
      WHERE i.id = ?
    `;
    const rows = await executeQuery(query, [id]);
    return rows[0] || null;
  }

  /**
   * Get inventarios by estado
   * @param {number} estadoId - Estado ID
   * @returns {Promise<Array>}
   */
  async findByEstado(estadoId) {
    const query = `
      SELECT i.*, e.nombre as estado_nombre, m.nombre as marca_nombre, t.nombre as tipo_nombre
      FROM inventarios i
      LEFT JOIN estados e ON i.estado_id = e.id
      LEFT JOIN marcas m ON i.marca_id = m.id
      LEFT JOIN tipos_equipos t ON i.tipo_equipo_id = t.id
      WHERE i.estado_id = ?
      ORDER BY i.created_at DESC
    `;
    return executeQuery(query, [estadoId]);
  }

  /**
   * Get inventarios by usuario responsable
   * @param {number} usuarioId - Usuario ID
   * @returns {Promise<Array>}
   */
  async findByUsuario(usuarioId) {
    const query = `
      SELECT i.*, e.nombre as estado_nombre, m.nombre as marca_nombre, t.nombre as tipo_nombre
      FROM inventarios i
      LEFT JOIN estados e ON i.estado_id = e.id
      LEFT JOIN marcas m ON i.marca_id = m.id
      LEFT JOIN tipos_equipos t ON i.tipo_equipo_id = t.id
      WHERE i.usuario_id = ?
      ORDER BY i.created_at DESC
    `;
    return executeQuery(query, [usuarioId]);
  }

  /**
   * Get inventarios by serial or codigo patrimonial
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>}
   */
  async search(searchTerm) {
    const query = `
      SELECT i.*, e.nombre as estado_nombre, m.nombre as marca_nombre, t.nombre as tipo_nombre
      FROM inventarios i
      LEFT JOIN estados e ON i.estado_id = e.id
      LEFT JOIN marcas m ON i.marca_id = m.id
      LEFT JOIN tipos_equipos t ON i.tipo_equipo_id = t.id
      WHERE i.serial LIKE ? 
         OR i.codigo_patrimonial LIKE ?
         OR i.nombre LIKE ?
      ORDER BY i.created_at DESC
    `;
    const searchPattern = `%${searchTerm}%`;
    return executeQuery(query, [searchPattern, searchPattern, searchPattern]);
  }

  /**
   * Get estadisticas de inventario
   * @returns {Promise<Object>}
   */
  async getEstadisticas() {
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN estado_id = 1 THEN 1 ELSE 0 END) as disponibles,
        SUM(CASE WHEN estado_id = 2 THEN 1 ELSE 0 END) as en_uso,
        SUM(CASE WHEN estado_id = 3 THEN 1 ELSE 0 END) as mantenimiento,
        SUM(CASE WHEN estado_id = 4 THEN 1 ELSE 0 END) as danados,
        SUM(CASE WHEN estado_id = 5 THEN 1 ELSE 0 END) as dados_baja,
        SUM(CASE WHEN estado_id = 6 THEN 1 ELSE 0 END) as reparacion,
        COALESCE(SUM(valor_compra), 0) as valor_total,
        COALESCE(AVG(valor_compra), 0) as valor_promedio
      FROM inventarios
    `;
    const rows = await executeQuery(query);
    return rows[0];
  }

  /**
   * Check if serial exists
   * @param {string} serial - Serial number
   * @param {number} excludeId - ID to exclude (for update)
   * @returns {Promise<boolean>}
   */
  async serialExists(serial, excludeId = null) {
    let query = 'SELECT COUNT(*) as total FROM inventarios WHERE serial = ?';
    const params = [serial];
    
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    
    const rows = await executeQuery(query, params);
    return rows[0].total > 0;
  }
}

module.exports = new Inventario();