const bcrypt = require('bcrypt');
const { User } = require('../models/user.js');
const express = require('express');
const router = express.Router();

// Authentificate the user
router.post('/', async (req, res) => {
  const error = validateAuth(req.body);
  if (!error.valid) return res.status(400).send(error.message);

  let user = await User.findOne({ email: req.body.email });
  if(!user) return res.status(400).send('Invalid email or password!');

  // Dehash the password
  const verifiedPassword = await bcrypt.compare(req.body.password, user.password);
  if(!verifiedPassword) return res.status(400).send('Invalid email or password!');

  // Generate the token for auth user.
  const token = user.generateAuthToken();
  res.send(token);
});

// Function to validate the user
function validateAuth(req) {
  if (!req.email) return { valid: false, message: 'Email is required!' };
  if (!req.email.includes('@')) {
    return { valid: false, message: 'Email format is not correct!' };
  }
  if (!req.password) return { valid: false, message: 'Password is required!' };
  if (req.password.length < 5) {
    return { valid: false, message: 'Password should be minimum 5 characters!' };
  }
  return { valid: true };
}

// Export the router object to be used in other modules
module.exports = router;