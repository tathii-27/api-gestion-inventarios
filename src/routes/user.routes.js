/**
 * User Routes
 * Rutas para la gestión de usuarios
 */

const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validation.middleware');
const { ROLES } = require('../constants/roles');
const { createUserValidator, updateUserValidator, userIdValidator } = require('../validators/user.validator');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * @route GET /api/usuarios
 * @desc Obtener todos los usuarios (con paginación)
 * @access Private (Solo Administrador)
 */
router.get(
  '/',
  authorize(ROLES.ADMINISTRADOR),
  userController.getAllUsers
);

/**
 * @route GET /api/usuarios/:id
 * @desc Obtener un usuario por ID
 * @access Private (Solo Administrador)
 */
router.get(
  '/:id',
  authorize(ROLES.ADMINISTRADOR),
  userIdValidator,
  validate,
  userController.getUserById
);

/**
 * @route POST /api/usuarios
 * @desc Crear un nuevo usuario
 * @access Private (Solo Administrador)
 */
router.post(
  '/',
  authorize(ROLES.ADMINISTRADOR),
  createUserValidator,
  validate,
  userController.createUser
);

/**
 * @route PUT /api/usuarios/:id
 * @desc Actualizar un usuario
 * @access Private (Solo Administrador)
 */
router.put(
  '/:id',
  authorize(ROLES.ADMINISTRADOR),
  updateUserValidator,
  validate,
  userController.updateUser
);

/**
 * @route DELETE /api/usuarios/:id
 * @desc Eliminar un usuario
 * @access Private (Solo Administrador)
 */
router.delete(
  '/:id',
  authorize(ROLES.ADMINISTRADOR),
  userIdValidator,
  validate,
  userController.deleteUser
);

module.exports = router;