const ApiResponse = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (err.name === 'ValidationError') {
    return ApiResponse.error(res, 'Validation error', 400, err.errors);
  }

  return ApiResponse.error(res, message, statusCode, err.stack ? { stack: err.stack } : null);
};

module.exports = errorHandler;
