// middleware/errorHandler.js

function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode
    }
  });
}

module.exports = errorHandler;