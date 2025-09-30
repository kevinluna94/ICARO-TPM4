const { validationResult } = require('express-validator');

// Generic validation middleware to centralize express-validator error handling
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
}

module.exports = { validate };
