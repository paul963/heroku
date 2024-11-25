// Import required modules
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.connect('mongodb+srv://paulionascut:NwEl52h7DdbtzOVt@cluster0.fpifo.mongodb.net/CoursesDB?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log(('Connected to MongoDB')))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(express.json());
const router = express.Router();
app.use('/api/auth', router);

// Define the schema for the 'User' collection
const User = mongoose.model('User', new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: /.+@.+\..+/
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1024
  }
}));

// Authentificate the user
router.post('/', async (req, res) => {
  const error = validateAuth(req.body);
  if (!error.valid) return res.status(400).send(error.message);

  let user = await User.findOne({ email: req.body.email });
  if(!user) return res.status(400).send('Invalid email or password!');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.status(400).send('Invalid email or password!');

  res.send(true);
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

// Define the port to listen on
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));