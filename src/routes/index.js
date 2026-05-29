/**
 * Routes index
 * Centraliza y exporta todas las rutas
 */

const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const inventarioRoutes = require('./inventario.routes');
const estadoRoutes = require('./estado.routes');
const marcaRoutes = require('./marca.routes');
const tipoEquipoRoutes = require('./tipoEquipo.routes');

const router = express.Router();

// API version prefix
const API_PREFIX = '/api';

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount routes
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/usuarios`, userRoutes);
router.use(`${API_PREFIX}/inventarios`, inventarioRoutes);
router.use(`${API_PREFIX}/estados`, estadoRoutes);
router.use(`${API_PREFIX}/marcas`, marcaRoutes);
router.use(`${API_PREFIX}/tipos-equipos`, tipoEquipoRoutes);

// 404 handler for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    code: 'ROUTE_NOT_FOUND'
  });
});

module.exports = router;