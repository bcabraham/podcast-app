const { logger } = require("../logger");

function notFound(req, res, next) {
  logger.error(`404 Not Found - ${req.originalUrl} Originated: ${req.ip}`);

  res.status(404);
  const error = new Error(`404 Not Found - ${req.originalUrl}`);
  next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */
  logger.error(`Server error - ${req.originalUrl} Originated: ${req.ip} message: ${err.message} stack:${err.stack}`);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}

module.exports = {
  notFound,
  errorHandler,
};
