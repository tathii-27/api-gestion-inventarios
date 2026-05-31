/**
 * Estado Controller
 * Maneja las peticiones de estados de equipos
 */

const Estado = require('../models/Estado.model');
const catchAsync = require('../utils/catchAsync');
const { successResponse } = require('../utils/responseFormatter');
const AppError = require('../utils/AppError');

const getAllEstados = catchAsync(async (req, res) => {
  const estados = await Estado.findAll();
  successResponse(res, estados, 'Estados obtenidos exitosamente');
});

const getEstadoById = catchAsync(async (req, res) => {
  const estado = await Estado.findById(req.params.id);
  if (!estado) {
    throw AppError.notFound('Estado no encontrado');
  }
  successResponse(res, estado, 'Estado obtenido exitosamente');
});

const createEstado = catchAsync(async (req, res) => {
  const estado = await Estado.create(req.body);
  successResponse(res, estado, 'Estado creado exitosamente', 201);
});

const updateEstado = catchAsync(async (req, res) => {
  const estado = await Estado.update(req.params.id, req.body);
  successResponse(res, estado, 'Estado actualizado exitosamente');
});

const deleteEstado = catchAsync(async (req, res) => {
  await Estado.delete(req.params.id);
  successResponse(res, null, 'Estado eliminado exitosamente');
});

module.exports = {
  getAllEstados,
  getEstadoById,
  createEstado,
  updateEstado,
  deleteEstado
};