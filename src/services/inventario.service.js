/**
 * Inventario Service
 * Lógica de negocio para gestión de inventarios
 */

const Inventario = require('../models/Inventario.model');
const AppError = require('../utils/AppError');

class InventarioService {
  /**
   * Get all inventarios
   * @returns {Promise<Array>}
   */
  async getAllInventarios() {
    return Inventario.findAllWithRelations();
  }

  /**
   * Get inventario by ID
   * @param {number} id - Inventario ID
   * @returns {Promise<Object>}
   */
  async getInventarioById(id) {
    const inventario = await Inventario.findByIdWithRelations(id);
    if (!inventario) {
      throw AppError.notFound('Equipo no encontrado en el inventario');
    }
    return inventario;
  }

  /**
   * Create inventario
   * @param {Object} data - Inventario data
   * @returns {Promise<Object>}
   */
  async createInventario(data) {
    // Check serial uniqueness
    if (data.serial) {
      const serialExists = await Inventario.serialExists(data.serial);
      if (serialExists) {
        throw AppError.conflict('El número de serie ya existe en el inventario');
      }
    }

    return Inventario.create(data);
  }

  /**
   * Update inventario
   * @param {number} id - Inventario ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>}
   */
  async updateInventario(id, data) {
    const inventario = await Inventario.findById(id);
    if (!inventario) {
      throw AppError.notFound('Equipo no encontrado en el inventario');
    }

    // Check serial uniqueness if changing
    if (data.serial && data.serial !== inventario.serial) {
      const serialExists = await Inventario.serialExists(data.serial, id);
      if (serialExists) {
        throw AppError.conflict('El número de serie ya existe en el inventario');
      }
    }

    return Inventario.update(id, data);
  }

  /**
   * Delete inventario
   * @param {number} id - Inventario ID
   * @returns {Promise<boolean>}
   */
  async deleteInventario(id) {
    const inventario = await Inventario.findById(id);
    if (!inventario) {
      throw AppError.notFound('Equipo no encontrado en el inventario');
    }

    return Inventario.delete(id);
  }

  /**
   * Get inventarios by estado
   * @param {number} estadoId - Estado ID
   * @returns {Promise<Array>}
   */
  async getByEstado(estadoId) {
    return Inventario.findByEstado(estadoId);
  }

  /**
   * Get inventarios by usuario
   * @param {number} usuarioId - Usuario ID
   * @returns {Promise<Array>}
   */
  async getByUsuario(usuarioId) {
    return Inventario.findByUsuario(usuarioId);
  }

  /**
   * Search inventarios
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>}
   */
  async searchInventarios(searchTerm) {
    if (!searchTerm || searchTerm.length < 2) {
      throw AppError.badRequest('El término de búsqueda debe tener al menos 2 caracteres');
    }
    return Inventario.search(searchTerm);
  }

  /**
   * Get estadisticas
   * @returns {Promise<Object>}
   */
  async getEstadisticas() {
    return Inventario.getEstadisticas();
  }
}

module.exports = new InventarioService();