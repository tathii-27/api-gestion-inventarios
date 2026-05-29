/**
 * User Service
 * Lógica de negocio para gestión de usuarios
 */

const User = require('../models/User.model');
const AppError = require('../utils/AppError');

class UserService {
  /**
   * Get all users with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {Object} filters - Filters
   * @returns {Promise<Object>}
   */
  async getAllUsers(page = 1, limit = 10, filters = {}) {
    return User.getPaginated(page, limit, filters);
  }

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>}
   */
  async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw AppError.notFound('Usuario no encontrado');
    }
    return user;
  }

  /**
   * Create user
   * @param {Object} userData - User data
   * @returns {Promise<Object>}
   */
  async createUser(userData) {
    // Check if email exists
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      throw AppError.conflict('El email ya está registrado');
    }

    return User.create(userData);
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} userData - User data
   * @returns {Promise<Object>}
   */
  async updateUser(id, userData) {
    const user = await User.findById(id);
    if (!user) {
      throw AppError.notFound('Usuario no encontrado');
    }

    // Check email uniqueness if changing
    if (userData.email && userData.email !== user.email) {
      const existingUser = await User.findByEmail(userData.email);
      if (existingUser) {
        throw AppError.conflict('El email ya está registrado por otro usuario');
      }
    }

    return User.update(id, userData);
  }

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise<boolean>}
   */
  async deleteUser(id) {
    const user = await User.findById(id);
    if (!user) {
      throw AppError.notFound('Usuario no encontrado');
    }

    // Prevent deleting last admin
    if (user.rol === 'administrador') {
      const adminCount = await User.count({ rol: 'administrador' });
      if (adminCount <= 1) {
        throw AppError.badRequest('No se puede eliminar el último administrador del sistema');
      }
    }

    return User.delete(id);
  }
}

module.exports = new UserService();