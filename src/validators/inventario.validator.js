/**
 * Inventario validators
 * Validaciones para gestión de inventarios
 */

const { body, param } = require('express-validator');

const createInventarioValidator = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre del equipo es requerido')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('serial')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('El serial no puede exceder 100 caracteres'),
  
  body('codigo_patrimonial')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('El código patrimonial no puede exceder 50 caracteres'),
  
  body('estado_id')
    .optional()
    .isInt({ min: 1 }).withMessage('estado_id debe ser un número entero positivo'),
  
  body('marca_id')
    .optional()
    .isInt({ min: 1 }).withMessage('marca_id debe ser un número entero positivo'),
  
  body('tipo_equipo_id')
    .optional()
    .isInt({ min: 1 }).withMessage('tipo_equipo_id debe ser un número entero positivo'),
  
  body('usuario_id')
    .optional()
    .isInt({ min: 1 }).withMessage('usuario_id debe ser un número entero positivo'),
  
  body('fecha_adquisicion')
    .optional()
    .isISO8601().withMessage('fecha_adquisicion debe ser una fecha válida'),
  
  body('valor_compra')
    .optional()
    .isFloat({ min: 0 }).withMessage('valor_compra debe ser un número positivo')
];

const updateInventarioValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de inventario inválido'),
  
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('serial')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('El serial no puede exceder 100 caracteres'),
  
  body('codigo_patrimonial')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('El código patrimonial no puede exceder 50 caracteres'),
  
  body('estado_id')
    .optional()
    .isInt({ min: 1 }).withMessage('estado_id debe ser un número entero positivo'),
  
  body('marca_id')
    .optional()
    .isInt({ min: 1 }).withMessage('marca_id debe ser un número entero positivo'),
  
  body('tipo_equipo_id')
    .optional()
    .isInt({ min: 1 }).withMessage('tipo_equipo_id debe ser un número entero positivo'),
  
  body('usuario_id')
    .optional()
    .isInt({ min: 1 }).withMessage('usuario_id debe ser un número entero positivo'),
  
  body('fecha_adquisicion')
    .optional()
    .isISO8601().withMessage('fecha_adquisicion debe ser una fecha válida'),
  
  body('valor_compra')
    .optional()
    .isFloat({ min: 0 }).withMessage('valor_compra debe ser un número positivo')
];

const inventarioIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de inventario inválido')
];

module.exports = {
  createInventarioValidator,
  updateInventarioValidator,
  inventarioIdValidator
};