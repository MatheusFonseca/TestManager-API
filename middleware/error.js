const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log for dev
  console.log(err.stack.red);

  if (err.name === 'CastError') {
    // Not correctly formatted id
    error = new ErrorResponse(400, `Not corretly formatted id: ${err.value}`);
  } else if (err.code === 11000) {
    // Duplicate key
    error = new ErrorResponse(400, `Duplicate field value entered`);
  } else if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(400, message);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server error' });
};

module.exports = errorHandler;
