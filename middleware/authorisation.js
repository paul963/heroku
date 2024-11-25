const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get token from auth header
  const token = req.header('auth-token');
  if(!token) return res.status(401).send('Token required.');

  // Decode token
  try{
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  }
  catch (error) {
    res.status(400).send('Invalid token.');
  }
}