/**
 * Common Validators
 * Validaciones reutilizables para toda la aplicación
 */

const { param, query } = require('express-validator');

/**
 * Validator for ID parameter
 * @param {string} paramName - Name of the ID parameter (default: 'id')
 * @returns {Array} Express-validator chain
 */
const idParamValidator = (paramName = 'id') => {
  return [
    param(paramName)
      .isInt({ min: 1 })
      .withMessage(`El parámetro '${paramName}' debe ser un número entero positivo`)
      .toInt()
  ];
};

/**
 * Validator for pagination query parameters
 */
const paginationValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El parámetro "page" debe ser un número entero positivo')
    .toInt()
    .default(1),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El parámetro "limit" debe ser un número entre 1 y 100')
    .toInt()
    .default(10)
];

/**
 * Validator for sorting parameters
 */
const sortValidator = [
  query('sortBy')
    .optional()
    .isString()
    .withMessage('El parámetro "sortBy" debe ser un texto')
    .trim(),
  
  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC', 'asc', 'desc'])
    .withMessage('El parámetro "sortOrder" debe ser ASC o DESC')
    .toUpperCase()
    .default('ASC')
];

/**
 * Validator for search parameter
 * @param {Array} fields - Fields to search in (for documentation only)
 * @returns {Array} Express-validator chain
 */
const searchValidator = (fields = []) => {
  return [
    query('search')
      .optional()
      .isString()
      .withMessage('El parámetro "search" debe ser un texto')
      .trim()
      .isLength({ min: 2 })
      .withMessage('El término de búsqueda debe tener al menos 2 caracteres')
      .escape()
  ];
};

/**
 * Validator for date range parameters
 */
const dateRangeValidator = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('El parámetro "startDate" debe ser una fecha válida (YYYY-MM-DD)')
    .toDate(),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('El parámetro "endDate" debe ser una fecha válida (YYYY-MM-DD)')
    .toDate()
    .custom((endDate, { req }) => {
      if (req.query.startDate && endDate && new Date(endDate) < new Date(req.query.startDate)) {
        throw new Error('La fecha final debe ser mayor o igual a la fecha inicial');
      }
      return true;
    })
];

/**
 * Validator for boolean query parameters
 * @param {string} paramName - Name of the boolean parameter
 * @returns {Array} Express-validator chain
 */
const booleanQueryValidator = (paramName) => {
  return [
    query(paramName)
      .optional()
      .isBoolean()
      .withMessage(`El parámetro '${paramName}' debe ser true o false`)
      .toBoolean()
  ];
};

/**
 * Validator for email parameter
 */
const emailValidator = [
  query('email')
    .optional()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail()
    .trim()
];

/**
 * Validator for enum query parameter
 * @param {string} paramName - Name of the parameter
 * @param {Array} allowedValues - Array of allowed values
 * @returns {Array} Express-validator chain
 */
const enumQueryValidator = (paramName, allowedValues) => {
  return [
    query(paramName)
      .optional()
      .isIn(allowedValues)
      .withMessage(`El parámetro '${paramName}' debe ser uno de: ${allowedValues.join(', ')}`)
  ];
};

/**
 * Validator for multiple IDs parameter (comma-separated)
 * @param {string} paramName - Name of the parameter (default: 'ids')
 * @returns {Array} Express-validator chain
 */
const idsParamValidator = (paramName = 'ids') => {
  return [
    param(paramName)
      .optional()
      .isString()
      .withMessage(`El parámetro '${paramName}' debe ser una cadena de texto`)
      .custom((value) => {
        const ids = value.split(',');
        for (const id of ids) {
          if (!/^\d+$/.test(id)) {
            throw new Error(`Todos los IDs deben ser números enteros positivos`);
          }
        }
        return true;
      })
  ];
};

/**
 * Validator for required fields array
 * @param {Array} requiredFields - Array of required field names
 * @returns {Function} Custom validator function
 */
const requiredFieldsValidator = (requiredFields) => {
  return (body) => {
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0 && body[field] !== false) {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      throw new Error(`Los siguientes campos son requeridos: ${missingFields.join(', ')}`);
    }
    
    return true;
  };
};

/**
 * Validator for string length range
 * @param {string} fieldName - Name of the field
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {Function} Express-validator chain
 */
const stringLengthValidator = (fieldName, min, max) => {
  return {
    [fieldName]: {
      isLength: {
        options: { min, max },
        errorMessage: `El campo '${fieldName}' debe tener entre ${min} y ${max} caracteres`
      }
    }
  };
};

/**
 * Validator for numeric range
 * @param {string} fieldName - Name of the field
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {Function} Express-validator chain
 */
const numericRangeValidator = (fieldName, min, max) => {
  return {
    [fieldName]: {
      isFloat: {
        options: { min, max },
        errorMessage: `El campo '${fieldName}' debe ser un número entre ${min} y ${max}`
      }
    }
  };
};

/**
 * Combine multiple validators
 * @param {Array} validatorArrays - Array of validator arrays
 * @returns {Array} Combined validators
 */
const combineValidators = (...validatorArrays) => {
  return validatorArrays.flat();
};

/**
 * Common field validators for reuse
 */
const commonFieldValidators = {
  // ID validators
  id: () => idParamValidator('id'),
  
  // Pagination
  pagination: () => paginationValidator,
  
  // Search
  search: (fields = []) => searchValidator(fields),
  
  // Date range
  dateRange: () => dateRangeValidator,
  
  // Sort
  sort: (allowedFields = []) => {
    if (allowedFields.length > 0) {
      return [
        ...sortValidator,
        query('sortBy')
          .custom((value) => {
            if (!allowedFields.includes(value)) {
              throw new Error(`El campo 'sortBy' debe ser uno de: ${allowedFields.join(', ')}`);
            }
            return true;
          })
      ];
    }
    return sortValidator;
  },
  
  // Boolean
  boolean: (paramName) => booleanQueryValidator(paramName),
  
  // Email
  email: () => emailValidator,
  
  // Enum
  enum: (paramName, allowedValues) => enumQueryValidator(paramName, allowedValues),
  
  // Multiple IDs
  multipleIds: () => idsParamValidator(),
  
  // Required fields
  required: (fields) => requiredFieldsValidator(fields)
};

module.exports = {
  // Main validators
  idParamValidator,
  paginationValidator,
  sortValidator,
  searchValidator,
  dateRangeValidator,
  booleanQueryValidator,
  emailValidator,
  enumQueryValidator,
  idsParamValidator,
  requiredFieldsValidator,
  stringLengthValidator,
  numericRangeValidator,
  combineValidators,
  
  // Common field validators object
  commonFieldValidators
};