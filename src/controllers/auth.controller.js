/**
 * Auth Controller
 * Maneja las peticiones de autenticación
 */

const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const { successResponse } = require('../utils/responseFormatter');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  successResponse(res, result, 'Usuario registrado exitosamente', 201);
});

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  successResponse(res, result, 'Login exitoso');
});

/**
 * @route POST /api/auth/refresh
 * @desc Refresh JWT token
 * @access Public
 */
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshToken(refreshToken);
  successResponse(res, result, 'Token refrescado exitosamente');
});

/**
 * @route GET /api/auth/profile
 * @desc Get current user profile
 * @access Private
 */
const getProfile = catchAsync(async (req, res) => {
  const profile = await authService.getProfile(req.user.id);
  successResponse(res, profile, 'Perfil obtenido exitosamente');
});

module.exports = {
  register,
  login,
  refreshToken,
  getProfile
};