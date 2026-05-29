const express = require('express');
const estadoController = require('../controllers/estado.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

router.use(authMiddleware);

// GET - Todos los roles pueden listar
router.get('/', estadoController.getAll);
router.get('/:id', estadoController.getById);

// POST, PUT, DELETE - Solo administradores
router.post('/', authorize('administrador'), estadoController.create);
router.put('/:id', authorize('administrador'), estadoController.update);
router.delete('/:id', authorize('administrador'), estadoController.delete);

module.exports = router;