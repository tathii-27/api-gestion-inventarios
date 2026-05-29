/**
 * Auth Service
 * Lógica de negocio para autenticación y autorización
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class AuthService {
  /**
   * Generate JWT token
   * @param {Object} user - User object
   * @returns {string} JWT token
   */
  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      rol: user.rol
    };
    
    return jwt.sign(payload, env.jwt.secret, {
      expiresIn: env.jwt.expiresIn
    });
  }

  /**
   * Generate refresh token
   * @param {Object} user - User object
   * @returns {string} Refresh token
   */
  generateRefreshToken(user) {
    const payload = {
      id: user.id,
      type: 'refresh'
    };
    
    return jwt.sign(payload, env.jwt.secret, {
      expiresIn: env.jwt.refreshExpiresIn
    });
  }

  /**
   * Verify token
   * @param {string} token - JWT token
   * @returns {Object} Decoded payload
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, env.jwt.secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw AppError.unauthorized('Token expirado');
      }
      throw AppError.unauthorized('Token inválido');
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>}
   */
  async register(userData) {
    const { nombre, email, password, rol } = userData;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw AppError.conflict('El email ya está registrado');
    }

    // Create user
    const newUser = await User.create({
      nombre,
      email,
      password,
      rol: rol || 'docente',
      is_active: true
    });

    // Generate token
    const token = this.generateToken(newUser);
    const refreshToken = this.generateRefreshToken(newUser);

    logger.info(`Nuevo usuario registrado: ${email} (${newUser.rol})`);

    return {
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email,
        rol: newUser.rol
      },
      token,
      refreshToken
    };
  }

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>}
   */
  async login(credentials) {
    const { email, password } = credentials;

    // Find user by email
    const user = await User.findByEmailWithPassword(email);
    if (!user) {
      throw AppError.unauthorized('Credenciales inválidas');
    }

    // Check if user is active
    if (!user.is_active) {
      throw AppError.unauthorized('Usuario inactivo. Contacte al administrador');
    }

    // Verify password
    const isValidPassword = await User.comparePassword(password, user.password);
    if (!isValidPassword) {
      throw AppError.unauthorized('Credenciales inválidas');
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate tokens
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    logger.info(`Usuario autenticado: ${email} (${user.rol})`);

    return {
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      },
      token,
      refreshToken
    };
  }

  /**
   * Refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>}
   */
  async refreshToken(refreshToken) {
    const decoded = this.verifyToken(refreshToken);
    
    if (decoded.type !== 'refresh') {
      throw AppError.unauthorized('Token de refresh inválido');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw AppError.unauthorized('Usuario no encontrado');
    }

    const newToken = this.generateToken(user);
    const newRefreshToken = this.generateRefreshToken(user);

    return {
      token: newToken,
      refreshToken: newRefreshToken
    };
  }

  /**
   * Get user profile
   * @param {number} userId - User ID
   * @returns {Promise<Object>}
   */
  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw AppError.notFound('Usuario no encontrado');
    }
    return user;
  }
}

module.exports = new AuthService();