/**
 * Inventario Controller
 * Maneja las peticiones de gestión de inventarios
 */

const inventarioService = require('../services/inventario.service');
const catchAsync = require('../utils/catchAsync');
const { successResponse } = require('../utils/responseFormatter');

/**
 * @route GET /api/inventarios
 * @desc Get all inventarios
 * @access Private (Admin & Docente)
 */
const getAllInventarios = catchAsync(async (req, res) => {
  const inventarios = await inventarioService.getAllInventarios();
  successResponse(res, inventarios, 'Inventarios obtenidos exitosamente');
});

/**
 * @route GET /api/inventarios/:id
 * @desc Get inventario by ID
 * @access Private (Admin & Docente)
 */
const getInventarioById = catchAsync(async (req, res) => {
  const inventario = await inventarioService.getInventarioById(req.params.id);
  successResponse(res, inventario, 'Inventario obtenido exitosamente');
});

/**
 * @route POST /api/inventarios
 * @desc Create new inventario
 * @access Private (Admin only)
 */
const createInventario = catchAsync(async (req, res) => {
  const inventario = await inventarioService.createInventario(req.body);
  successResponse(res, inventario, 'Equipo agregado al inventario exitosamente', 201);
});

/**
 * @route PUT /api/inventarios/:id
 * @desc Update inventario
 * @access Private (Admin only)
 */
const updateInventario = catchAsync(async (req, res) => {
  const inventario = await inventarioService.updateInventario(req.params.id, req.body);
  successResponse(res, inventario, 'Inventario actualizado exitosamente');
});

/**
 * @route DELETE /api/inventarios/:id
 * @desc Delete inventario
 * @access Private (Admin only)
 */
const deleteInventario = catchAsync(async (req, res) => {
  await inventarioService.deleteInventario(req.params.id);
  successResponse(res, null, 'Equipo eliminado del inventario exitosamente');
});

/**
 * @route GET /api/inventarios/estado/:estadoId
 * @desc Get inventarios by estado
 * @access Private (Admin only)
 */
const getByEstado = catchAsync(async (req, res) => {
  const inventarios = await inventarioService.getByEstado(req.params.estadoId);
  successResponse(res, inventarios, 'Inventarios por estado obtenidos exitosamente');
});

/**
 * @route GET /api/inventarios/usuario/:usuarioId
 * @desc Get inventarios by usuario
 * @access Private (Admin only)
 */
const getByUsuario = catchAsync(async (req, res) => {
  const inventarios = await inventarioService.getByUsuario(req.params.usuarioId);
  successResponse(res, inventarios, 'Inventarios por usuario obtenidos exitosamente');
});

/**
 * @route GET /api/inventarios/search/:term
 * @desc Search inventarios
 * @access Private (Admin & Docente)
 */
const searchInventarios = catchAsync(async (req, res) => {
  const inventarios = await inventarioService.searchInventarios(req.params.term);
  successResponse(res, inventarios, 'Resultados de búsqueda');
});

/**
 * @route GET /api/inventarios/estadisticas
 * @desc Get inventario statistics
 * @access Private (Admin only)
 */
const getEstadisticas = catchAsync(async (req, res) => {
  const estadisticas = await inventarioService.getEstadisticas();
  successResponse(res, estadisticas, 'Estadísticas obtenidas exitosamente');
});

module.exports = {
  getAllInventarios,
  getInventarioById,
  createInventario,
  updateInventario,
  deleteInventario,
  getByEstado,
  getByUsuario,
  searchInventarios,
  getEstadisticas
};