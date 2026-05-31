const express = require('express');
const router = express.Router();

// Importar rutas
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const inventarioRoutes = require('./inventario.routes');
const marcaRoutes = require('./marca.routes');
const tipoEquipoRoutes = require('./tipoEquipo.routes');
const estadoRoutes = require('./estado.routes');

// =====================================================
// RUTAS PÚBLICAS (No requieren autenticación)
// =====================================================

// Ruta de bienvenida - SOLUCIONA EL ERROR 404
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de Gestión de Inventarios',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      public: {
        health: 'GET /health',
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      protected: {
        usuarios: 'GET /api/usuarios',
        marcas: 'GET /api/marcas',
        tiposEquipo: 'GET /api/tipos-equipo',
        estados: 'GET /api/estados',
        inventario: 'GET /api/inventario'
      },
      documentation: 'Ver README.md para más detalles'
    }
  });
});

// Ruta de health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas de autenticación (públicas)
router.use('/api/auth', authRoutes);

// =====================================================
// MIDDLEWARE DE AUTENTICACIÓN
// =====================================================
const { protect } = require('../middleware/auth.middleware');
router.use(protect);

// =====================================================
// RUTAS PROTEGIDAS (Requieren autenticación)
// =====================================================
router.use('/api/usuarios', userRoutes);
router.use('/api/inventario', inventarioRoutes);
router.use('/api/marcas', marcaRoutes);
router.use('/api/tipos-equipo', tipoEquipoRoutes);
router.use('/api/estados', estadoRoutes);

module.exports = router;