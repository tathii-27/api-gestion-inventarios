const express = require('express');
const estadoController = require('../controllers/estado.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

router.use((req, res, next) => {
    console.log(`🔸 Ruta de estado: ${req.method} ${req.url}`);
    next();
});

router.use(protect);

// GET - Todos los roles pueden listar
router.get('/', estadoController.getAllEstados);
router.get('/:id', estadoController.getEstadoById);

// POST, PUT, DELETE - Solo administradores
router.post('/', authorize('administrador'), estadoController.createEstado);
router.put('/:id', authorize('administrador'), estadoController.updateEstado);
router.delete('/:id', authorize('administrador'), estadoController.deleteEstado);

module.exports = router;