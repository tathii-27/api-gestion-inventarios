/**
 * TipoEquipo Service
 * Lógica de negocio para gestión de tipos de equipos
 */

const TipoEquipo = require('../models/TipoEquipo.model');
const AppError = require('../utils/AppError');

class TipoEquipoService {
  /**
   * Get all tipos de equipos
   * @returns {Promise<Array>}
   */
  async getAllTiposEquipos() {
    const tiposEquipos = await TipoEquipo.findAllOrdered();
    return tiposEquipos;
  }

  /**
   * Get tipo equipo by ID
   * @param {number} id - TipoEquipo ID
   * @returns {Promise<Object>}
   */
  async getTipoEquipoById(id) {
    const tipoEquipo = await TipoEquipo.findById(id);
    if (!tipoEquipo) {
      throw AppError.notFound('Tipo de equipo no encontrado');
    }
    return tipoEquipo;
  }

  /**
   * Create new tipo equipo
   * @param {Object} data - TipoEquipo data
   * @returns {Promise<Object>}
   */
  async createTipoEquipo(data) {
    const { nombre, descripcion } = data;

    // Check if nombre already exists
    const existingTipoEquipo = await TipoEquipo.findBy('nombre', nombre);
    if (existingTipoEquipo) {
      throw AppError.conflict(`El tipo de equipo '${nombre}' ya existe`);
    }

    const tipoEquipo = await TipoEquipo.create({
      nombre,
      descripcion: descripcion || null
    });

    return tipoEquipo;
  }

  /**
   * Update tipo equipo
   * @param {number} id - TipoEquipo ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>}
   */
  async updateTipoEquipo(id, data) {
    const tipoEquipo = await TipoEquipo.findById(id);
    if (!tipoEquipo) {
      throw AppError.notFound('Tipo de equipo no encontrado');
    }

    const { nombre, descripcion } = data;

    // Check if nombre already exists (and it's not the same tipoEquipo)
    if (nombre && nombre !== tipoEquipo.nombre) {
      const existingTipoEquipo = await TipoEquipo.findBy('nombre', nombre);
      if (existingTipoEquipo) {
        throw AppError.conflict(`El tipo de equipo '${nombre}' ya existe`);
      }
    }

    const updatedTipoEquipo = await TipoEquipo.update(id, {
      nombre: nombre || tipoEquipo.nombre,
      descripcion: descripcion !== undefined ? descripcion : tipoEquipo.descripcion
    });

    return updatedTipoEquipo;
  }

  /**
   * Delete tipo equipo
   * @param {number} id - TipoEquipo ID
   * @returns {Promise<boolean>}
   */
  async deleteTipoEquipo(id) {
    const tipoEquipo = await TipoEquipo.findById(id);
    if (!tipoEquipo) {
      throw AppError.notFound('Tipo de equipo no encontrado');
    }

    // Check if tipoEquipo is being used by any inventario
    const isInUse = await TipoEquipo.isInUse(id);
    if (isInUse) {
      throw AppError.badRequest(
        'No se puede eliminar el tipo de equipo porque está siendo utilizado por uno o más equipos en el inventario'
      );
    }

    await TipoEquipo.delete(id);
    return true;
  }
}

module.exports = new TipoEquipoService();