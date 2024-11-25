const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Define the schema for the 'User' collection
const userSchema = new mongoose.Schema({
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
  },
  isAdmin: Boolean
});

// Create generateAuthToken function
userSchema.methods.generateAuthToken = function() {
  // Generate the token for the user containting details id and email
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
}

// Define the model for the 'User' collection
const User = mongoose.model('User', userSchema);

// Function to validate the user
function validateUser(user) {
  if (!user.name) return { valid: false, message: 'Name is required!' };
  if (!user.email) return { valid: false, message: 'Email is required!' };
  if (!user.email.includes('@')) {
    return { valid: false, message: 'Email format is not correct!' };
  }
  if (!user.password) return { valid: false, message: 'Password is required!' };
  if (user.password.length < 5) {
    return { valid: false, message: 'Password should be minimum 5 characters!' };
  }
  return { valid: true };
}

// Export the User model and validateUser function for use in other modules
exports.User = User;
exports.validateUser = validateUser;