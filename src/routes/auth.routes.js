/**
 * Auth Routes
 * Define las rutas de autenticación
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.use((req, res, next) => {
    console.log(`🔸 Ruta de directores: ${req.method} ${req.url}`);
    next();
});

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);


router.get('/profile', authController.getProfile);
router.post('/logout', authController.logout);
router.get('/verify', authController.verifyToken);

module.exports = router;