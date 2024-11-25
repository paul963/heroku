const express = require('express');
require('express-async-errors');
const error = require('../middleware/error');
const courses = require('../routes/courses');
const user = require('../routes/users');
const auth = require('../routes/auth');

module.exports = function (app) {
  app.use(express.json());

  // Middleware to handle requests for the courses and user API
  app.use('/api/courses', courses);
  app.use('/api/users', user);
  app.use('/api/auth', auth);
  app.use(error);
}