/**
 * Marca Service
 * Lógica de negocio para gestión de marcas de equipos
 */

const Marca = require('../models/Marca.model');
const AppError = require('../utils/AppError');

class MarcaService {
  /**
   * Get all marcas
   * @returns {Promise<Array>}
   */
  async getAllMarcas() {
    const marcas = await Marca.findAllOrdered();
    return marcas;
  }

  /**
   * Get marca by ID
   * @param {number} id - Marca ID
   * @returns {Promise<Object>}
   */
  async getMarcaById(id) {
    const marca = await Marca.findById(id);
    if (!marca) {
      throw AppError.notFound('Marca no encontrada');
    }
    return marca;
  }

  /**
   * Create new marca
   * @param {Object} data - Marca data
   * @returns {Promise<Object>}
   */
  async createMarca(data) {
    const { nombre, descripcion } = data;

    // Check if nombre already exists
    const existingMarca = await Marca.findBy('nombre', nombre);
    if (existingMarca) {
      throw AppError.conflict(`La marca '${nombre}' ya existe`);
    }

    const marca = await Marca.create({
      nombre,
      descripcion: descripcion || null
    });

    return marca;
  }

  /**
   * Update marca
   * @param {number} id - Marca ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>}
   */
  async updateMarca(id, data) {
    const marca = await Marca.findById(id);
    if (!marca) {
      throw AppError.notFound('Marca no encontrada');
    }

    const { nombre, descripcion } = data;

    // Check if nombre already exists (and it's not the same marca)
    if (nombre && nombre !== marca.nombre) {
      const existingMarca = await Marca.findBy('nombre', nombre);
      if (existingMarca) {
        throw AppError.conflict(`La marca '${nombre}' ya existe`);
      }
    }

    const updatedMarca = await Marca.update(id, {
      nombre: nombre || marca.nombre,
      descripcion: descripcion !== undefined ? descripcion : marca.descripcion
    });

    return updatedMarca;
  }

  /**
   * Delete marca
   * @param {number} id - Marca ID
   * @returns {Promise<boolean>}
   */
  async deleteMarca(id) {
    const marca = await Marca.findById(id);
    if (!marca) {
      throw AppError.notFound('Marca no encontrada');
    }

    // Check if marca is being used by any inventario
    const isInUse = await Marca.isInUse(id);
    if (isInUse) {
      throw AppError.badRequest(
        'No se puede eliminar la marca porque está siendo utilizada por uno o más equipos en el inventario'
      );
    }

    await Marca.delete(id);
    return true;
  }
}

module.exports = new MarcaService();