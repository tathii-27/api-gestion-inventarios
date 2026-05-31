/**
 * Marca Routes
 * Rutas para la gestión de marcas de equipos
 */

const express = require('express');
const marcaController = require('../controllers/marca.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validation.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// // Todas las rutas requieren autenticación
// router.use(protect);

router.use((req, res, next) => {
    console.log(`🔸 Ruta de marca: ${req.method} ${req.url}`);
    next();
});

/**
 * @route GET /api/marcas
 * @desc Obtener todas las marcas
 * @access Private (Administrador y Docente)
 */
router.get(
  '/',
  marcaController.getAllMarcas
);

/**
 * @route GET /api/marcas/:id
 * @desc Obtener una marca por ID
 * @access Private (Administrador y Docente)
 */
router.get(
  '/:id',
  marcaController.getMarcaById
);

/**
 * @route POST /api/marcas
 * @desc Crear una nueva marca
 * @access Private (Solo Administrador)
 */
router.post(
  '/',
  authorize(ROLES.ADMINISTRADOR),
  marcaController.createMarca
);

/**
 * @route PUT /api/marcas/:id
 * @desc Actualizar una marca
 * @access Private (Solo Administrador)
 */
router.put(
  '/:id',
  authorize(ROLES.ADMINISTRADOR),
  marcaController.updateMarca
);

/**
 * @route DELETE /api/marcas/:id
 * @desc Eliminar una marca
 * @access Private (Solo Administrador)
 */
router.delete(
  '/:id',
  authorize(ROLES.ADMINISTRADOR),
  marcaController.deleteMarca
);

module.exports = router;