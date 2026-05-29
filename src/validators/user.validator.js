/**
 * User validators
 * Validaciones para gestión de usuarios
 */

const { body, param } = require('express-validator');

const createUserValidator = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('rol')
    .notEmpty().withMessage('El rol es requerido')
    .isIn(['administrador', 'docente']).withMessage('Rol inválido')
];

const updateUserValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de usuario inválido'),
  
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('rol')
    .optional()
    .isIn(['administrador', 'docente']).withMessage('Rol inválido'),
  
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active debe ser booleano')
];

const userIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de usuario inválido')
];

module.exports = {
  createUserValidator,
  updateUserValidator,
  userIdValidator
};