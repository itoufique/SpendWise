const ApiResponse = require('../utils/apiResponse');

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const details = error.details.map((d) => ({ field: d.path.join('.'), message: d.message }));
    return ApiResponse.error(res, 'Validation failed', 400, details);
  }
  next();
};

module.exports = { validateBody };
