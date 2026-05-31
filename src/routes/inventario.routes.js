const express = require('express');
const inventarioController = require('../controllers/inventario.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

router.use((req, res, next) => {
    console.log(`🔸 Ruta de inventario: ${req.method} ${req.url}`);
    next();
});

// GET - Listar inventarios (accesible para ambos roles)
router.get('/', inventarioController.getAllInventarios);
router.get('/:id', inventarioController.getInventarioById);

// POST, PUT, DELETE - Solo administradores
router.post('/', authorize('administrador'), inventarioController.createInventario);
router.put('/:id', authorize('administrador'), inventarioController.updateInventario);
router.delete('/:id', authorize('administrador'), inventarioController.deleteInventario);

module.exports = router;



