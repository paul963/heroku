const mongoConfig = require('config');
const winston = require('winston');

// Import Mongoose to interact with MongoDB
const mongoose = require('mongoose');

// MongoDB connection URI
const mongoURI = mongoConfig.get('mongoURIKey');
const dbURI = mongoURI;

// Add Console transport with colorized format
winston.add(new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  )
}));

// Set up a global listener for unhandled promise rejections
process.on('unhandledRejection', (ex) => {
  throw ex; // This will trigger the exception handler and crash the process
});

// Add a File transport to Winston to log regular messages to 'logs.log'
winston.add(new winston.transports.File({ filename: 'logs.log' }));

// Function to connect to MongoDB collection
module.exports = () => {
  mongoose.connect(dbURI)
  .then(() => winston.info('Connected to MongoDB'))
  .catch(err => winston.error('Could not connect to MongoDB', err));
}