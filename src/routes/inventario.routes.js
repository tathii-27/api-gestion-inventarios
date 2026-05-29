const express = require('express');
const inventarioController = require('../controllers/inventario.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET - Listar inventarios (accesible para ambos roles)
router.get('/', inventarioController.getAll);
router.get('/:id', inventarioController.getById);

// POST, PUT, DELETE - Solo administradores
router.post('/', authorize('administrador'), inventarioController.create);
router.put('/:id', authorize('administrador'), inventarioController.update);
router.delete('/:id', authorize('administrador'), inventarioController.delete);

module.exports = router;