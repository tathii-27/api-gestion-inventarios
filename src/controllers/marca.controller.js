/**
 * Marca Controller
 * Maneja las peticiones de gestión de marcas de equipos
 */

const marcaService = require('../services/marca.service');
const catchAsync = require('../utils/catchAsync');
const { successResponse } = require('../utils/responseFormatter');

/**
 * @route GET /api/marcas
 * @desc Get all marcas
 * @access Private (Admin & Docente)
 */
const getAllMarcas = catchAsync(async (req, res) => {
  const marcas = await marcaService.getAllMarcas();
  successResponse(res, marcas, 'Marcas obtenidas exitosamente');
});

/**
 * @route GET /api/marcas/:id
 * @desc Get marca by ID
 * @access Private (Admin & Docente)
 */
const getMarcaById = catchAsync(async (req, res) => {
  const marca = await marcaService.getMarcaById(req.params.id);
  successResponse(res, marca, 'Marca obtenida exitosamente');
});

/**
 * @route POST /api/marcas
 * @desc Create new marca
 * @access Private (Admin only)
 */
const createMarca = catchAsync(async (req, res) => {
  const marca = await marcaService.createMarca(req.body);
  successResponse(res, marca, 'Marca creada exitosamente', 201);
});

/**
 * @route PUT /api/marcas/:id
 * @desc Update marca
 * @access Private (Admin only)
 */
const updateMarca = catchAsync(async (req, res) => {
  const marca = await marcaService.updateMarca(req.params.id, req.body);
  successResponse(res, marca, 'Marca actualizada exitosamente');
});

/**
 * @route DELETE /api/marcas/:id
 * @desc Delete marca
 * @access Private (Admin only)
 */
const deleteMarca = catchAsync(async (req, res) => {
  await marcaService.deleteMarca(req.params.id);
  successResponse(res, null, 'Marca eliminada exitosamente');
});

module.exports = {
  getAllMarcas,
  getMarcaById,
  createMarca,
  updateMarca,
  deleteMarca
};