const authorisation = require('../middleware/authorisation')
const bcrypt = require('bcrypt');
const { User, validateUser } = require('../models/user.js');
const express = require('express');
const router = express.Router();

// Register a new user
router.post('/', async (req, res) => {
  const error = validateUser(req.body);
  if (!error.valid) return res.status(400).send(error.message);

  let user = await User.findOne({ email: req.body.email });
  if(user) return res.status(400).send('Email address has already been registered!');

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  })

  // Crypt the password
  const saltKey = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, saltKey);

  await user.save();

  // Generate the token for sing in user.
  const token = user.generateAuthToken();

  // Return token in header and user name and email in body
  res
  .header(
    'auth-token', token
  )
  .send({
    name: user.name,
    email: user.email
  });
});

// Get user details based on authorisation token
router.get('/details', authorisation, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

// Export the router object to be used in other modules
module.exports = router;