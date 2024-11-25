const winston = require('winston');

// Create a Winston logger
const logFile = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ), // Set the default format
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }), // Set the custom format for console
    new winston.transports.File({ filename: 'logs.log' })
  ],
});

module.exports = function(error, req, res, next) {
  // Log the error in console and file
  // First parameter: A string message that describes the error or the event being logged.
  // Second parameter (optional): It contains additional information about the error like stack, code, custom status, etc.
  logFile.error(error.message, error);

  // Send error to the client
  res.status(500).send('Something failed'); // 500 Internal server error
}