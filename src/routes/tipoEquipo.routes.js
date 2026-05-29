/**
 * TipoEquipo Routes
 * Rutas para la gestión de tipos de equipos
 */

const express = require('express');
const tipoEquipoController = require('../controllers/tipoEquipo.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * @route GET /api/tipos-equipos
 * @desc Obtener todos los tipos de equipos
 * @access Private (Administrador y Docente)
 */
router.get(
  '/',
  tipoEquipoController.getAllTiposEquipos
);

/**
 * @route GET /api/tipos-equipos/:id
 * @desc Obtener un tipo de equipo por ID
 * @access Private (Administrador y Docente)
 */
router.get(
  '/:id',
  tipoEquipoController.getTipoEquipoById
);

/**
 * @route POST /api/tipos-equipos
 * @desc Crear un nuevo tipo de equipo
 * @access Private (Solo Administrador)
 */
router.post(
  '/',
  authorize(ROLES.ADMINISTRADOR),
  tipoEquipoController.createTipoEquipo
);

/**
 * @route PUT /api/tipos-equipos/:id
 * @desc Actualizar un tipo de equipo
 * @access Private (Solo Administrador)
 */
router.put(
  '/:id',
  authorize(ROLES.ADMINISTRADOR),
  tipoEquipoController.updateTipoEquipo
);

/**
 * @route DELETE /api/tipos-equipos/:id
 * @desc Eliminar un tipo de equipo
 * @access Private (Solo Administrador)
 */
router.delete(
  '/:id',
  authorize(ROLES.ADMINISTRADOR),
  tipoEquipoController.deleteTipoEquipo
);

module.exports = router;