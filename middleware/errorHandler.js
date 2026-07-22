/**
 * Global Error Handler
 *
 * Responsibilities:
 * - Return consistent JSON error responses
 * - Preserve HTTP status codes
 * - Avoid exposing internal server errors
 */

function errorHandler(err, req, res, next) {
  const statusCode = err.status || 500;

  // Log the full error on the server
  console.error(err);

  // Don't expose internal implementation details
  const message =
    statusCode === 500
      ? "Internal Server Error"
      : err.message;

  res.status(statusCode).json({
    error: message,
  });
}

module.exports = errorHandler;