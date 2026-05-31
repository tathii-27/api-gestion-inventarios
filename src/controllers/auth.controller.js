/**
 * Auth Controller
 * Maneja las peticiones de autenticación
 */

const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const { successResponse } = require('../utils/responseFormatter');

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  successResponse(res, result, 'Usuario registrado exitosamente', 201);
});

const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  successResponse(res, result, 'Login exitoso');
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshToken(refreshToken);
  successResponse(res, result, 'Token refrescado exitosamente');
});

const getProfile = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const profile = await authService.getProfile(userId);
  successResponse(res, profile, 'Perfil obtenido exitosamente');
});

const logout = catchAsync(async (req, res) => {
  successResponse(res, null, 'Logout exitoso');
});

const verifyToken = catchAsync(async (req, res) => {
  successResponse(res, { valid: true, user: req.user }, 'Token válido');
});

module.exports = {
  register,
  login,
  refreshToken,
  getProfile,
  logout,
  verifyToken
};