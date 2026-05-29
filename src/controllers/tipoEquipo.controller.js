/**
 * TipoEquipo Controller
 * Maneja las peticiones de gestión de tipos de equipos
 */

const tipoEquipoService = require('../services/tipoEquipo.service');
const catchAsync = require('../utils/catchAsync');
const { successResponse } = require('../utils/responseFormatter');

/**
 * @route GET /api/tipos-equipos
 * @desc Get all tipos de equipos
 * @access Private (Admin & Docente)
 */
const getAllTiposEquipos = catchAsync(async (req, res) => {
  const tiposEquipos = await tipoEquipoService.getAllTiposEquipos();
  successResponse(res, tiposEquipos, 'Tipos de equipos obtenidos exitosamente');
});

/**
 * @route GET /api/tipos-equipos/:id
 * @desc Get tipo equipo by ID
 * @access Private (Admin & Docente)
 */
const getTipoEquipoById = catchAsync(async (req, res) => {
  const tipoEquipo = await tipoEquipoService.getTipoEquipoById(req.params.id);
  successResponse(res, tipoEquipo, 'Tipo de equipo obtenido exitosamente');
});

/**
 * @route POST /api/tipos-equipos
 * @desc Create new tipo equipo
 * @access Private (Admin only)
 */
const createTipoEquipo = catchAsync(async (req, res) => {
  const tipoEquipo = await tipoEquipoService.createTipoEquipo(req.body);
  successResponse(res, tipoEquipo, 'Tipo de equipo creado exitosamente', 201);
});

/**
 * @route PUT /api/tipos-equipos/:id
 * @desc Update tipo equipo
 * @access Private (Admin only)
 */
const updateTipoEquipo = catchAsync(async (req, res) => {
  const tipoEquipo = await tipoEquipoService.updateTipoEquipo(req.params.id, req.body);
  successResponse(res, tipoEquipo, 'Tipo de equipo actualizado exitosamente');
});

/**
 * @route DELETE /api/tipos-equipos/:id
 * @desc Delete tipo equipo
 * @access Private (Admin only)
 */
const deleteTipoEquipo = catchAsync(async (req, res) => {
  await tipoEquipoService.deleteTipoEquipo(req.params.id);
  successResponse(res, null, 'Tipo de equipo eliminado exitosamente');
});

module.exports = {
  getAllTiposEquipos,
  getTipoEquipoById,
  createTipoEquipo,
  updateTipoEquipo,
  deleteTipoEquipo
};