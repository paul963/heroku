const jwt = require('jsonwebtoken');
const config = require('config');

// Verify if user is admin
module.exports = function (req, res, next) {
  if(!req.user.isAdmin) return res.status(403).send('Acces denied.'); // 403 Forbidden
  next();
}