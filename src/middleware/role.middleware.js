/**
 * Role authorization middleware
 * Verifica que el usuario tenga los roles permitidos
 */

const AppError = require('../utils/AppError');
const { ROLES, ROLE_HIERARCHY } = require('../constants/roles');

/**
 * Check if user has required role
 * @param {Object} user - User object
 * @param {Array} allowedRoles - Array of allowed roles
 * @returns {boolean}
 */
const hasRole = (user, allowedRoles) => {
  if (!user || !user.rol) return false;
  return allowedRoles.includes(user.rol);
};

/**
 * Check if user has minimum role level
 * @param {Object} user - User object
 * @param {string} minRole - Minimum required role
 * @returns {boolean}
 */
const hasMinRoleLevel = (user, minRole) => {
  if (!user || !user.rol) return false;
  return ROLE_HIERARCHY[user.rol] >= ROLE_HIERARCHY[minRole];
};

/**
 * Require specific roles
 * @param {...string} allowedRoles - Allowed roles
 * @returns {Function} Express middleware
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Usuario no autenticado'));
    }

    if (!hasRole(req.user, allowedRoles)) {
      return next(AppError.forbidden(
        `Acceso denegado. Se requiere rol: ${allowedRoles.join(' o ')}`
      ));
    }

    next();
  };
};

/**
 * Require minimum role level
 * @param {string} minRole - Minimum required role
 * @returns {Function} Express middleware
 */
const authorizeMinLevel = (minRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Usuario no autenticado'));
    }

    if (!hasMinRoleLevel(req.user, minRole)) {
      return next(AppError.forbidden(
        `Acceso denegado. Se requiere nivel mínimo de: ${minRole}`
      ));
    }

    next();
  };
};

/**
 * Check permission
 * @param {string} permission - Permission to check
 * @returns {Function} Express middleware
 */
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Usuario no autenticado'));
    }

    const { ROLES, ROLE_PERMISSIONS } = require('../constants/roles');
    const userPermissions = ROLE_PERMISSIONS[req.user.rol] || [];

    if (!userPermissions.includes(permission)) {
      return next(AppError.forbidden(
        `Acceso denegado. No tienes permiso para: ${permission}`
      ));
    }

    next();
  };
};

module.exports = {
  authorize,
  authorizeMinLevel,
  checkPermission,
  hasRole,
  hasMinRoleLevel
};