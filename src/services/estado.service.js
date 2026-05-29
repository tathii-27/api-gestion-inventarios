/**
 * Estado Service
 * Lógica de negocio para gestión de estados de equipos
 */

const Estado = require('../models/Estado.model');
const AppError = require('../utils/AppError');

class EstadoService {
  /**
   * Get all estados
   * @returns {Promise<Array>}
   */
  async getAllEstados() {
    const estados = await Estado.findAllOrdered();
    return estados;
  }

  /**
   * Get estado by ID
   * @param {number} id - Estado ID
   * @returns {Promise<Object>}
   */
  async getEstadoById(id) {
    const estado = await Estado.findById(id);
    if (!estado) {
      throw AppError.notFound('Estado no encontrado');
    }
    return estado;
  }

  /**
   * Create new estado
   * @param {Object} data - Estado data
   * @returns {Promise<Object>}
   */
  async createEstado(data) {
    const { nombre, descripcion } = data;

    // Check if nombre already exists
    const existingEstado = await Estado.findBy('nombre', nombre);
    if (existingEstado) {
      throw AppError.conflict(`El estado '${nombre}' ya existe`);
    }

    const estado = await Estado.create({
      nombre,
      descripcion: descripcion || null
    });

    return estado;
  }

  /**
   * Update estado
   * @param {number} id - Estado ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>}
   */
  async updateEstado(id, data) {
    const estado = await Estado.findById(id);
    if (!estado) {
      throw AppError.notFound('Estado no encontrado');
    }

    const { nombre, descripcion } = data;

    // Check if nombre already exists (and it's not the same estado)
    if (nombre && nombre !== estado.nombre) {
      const existingEstado = await Estado.findBy('nombre', nombre);
      if (existingEstado) {
        throw AppError.conflict(`El estado '${nombre}' ya existe`);
      }
    }

    const updatedEstado = await Estado.update(id, {
      nombre: nombre || estado.nombre,
      descripcion: descripcion !== undefined ? descripcion : estado.descripcion
    });

    return updatedEstado;
  }

  /**
   * Delete estado
   * @param {number} id - Estado ID
   * @returns {Promise<boolean>}
   */
  async deleteEstado(id) {
    const estado = await Estado.findById(id);
    if (!estado) {
      throw AppError.notFound('Estado no encontrado');
    }

    // Check if estado is being used by any inventario
    const isInUse = await Estado.isInUse(id);
    if (isInUse) {
      throw AppError.badRequest(
        'No se puede eliminar el estado porque está siendo utilizado por uno o más equipos en el inventario'
      );
    }

    await Estado.delete(id);
    return true;
  }
}

module.exports = new EstadoService();