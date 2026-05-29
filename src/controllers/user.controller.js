/**
 * User Controller
 * Maneja las peticiones de gestión de usuarios
 */

const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const { successResponse, paginatedResponse } = require('../utils/responseFormatter');

/**
 * @route GET /api/usuarios
 * @desc Get all users with pagination
 * @access Private (Admin only)
 */
const getAllUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { rol, is_active, search } = req.query;

  const result = await userService.getAllUsers(page, limit, { rol, is_active, search });
  successResponse(res, result, 'Usuarios obtenidos exitosamente');
});

/**
 * @route GET /api/usuarios/:id
 * @desc Get user by ID
 * @access Private (Admin only)
 */
const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  successResponse(res, user, 'Usuario obtenido exitosamente');
});

/**
 * @route POST /api/usuarios
 * @desc Create new user
 * @access Private (Admin only)
 */
const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  successResponse(res, user, 'Usuario creado exitosamente', 201);
});

/**
 * @route PUT /api/usuarios/:id
 * @desc Update user
 * @access Private (Admin only)
 */
const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  successResponse(res, user, 'Usuario actualizado exitosamente');
});

/**
 * @route DELETE /api/usuarios/:id
 * @desc Delete user
 * @access Private (Admin only)
 */
const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);
  successResponse(res, null, 'Usuario eliminado exitosamente');
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};