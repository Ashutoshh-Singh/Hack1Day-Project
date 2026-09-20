/**
 * Centralized Express Error Handling Middleware
 */

export function errorHandler(err, req, res, next) {
  console.error('[API Error]:', err.stack || err.message);

  const statusCode = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'An unexpected internal server error occurred.'
    : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`
  });
}
