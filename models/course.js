const mongoose = require('mongoose');

// Define the schema for the 'Course' collection
const Course = mongoose.model('Course', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  author: String,
  tags: [String],
  date: Date,
  isPublic: Boolean
}));

// Function to validate the course name
function validateCourseName(course) {
  if (!course) {
    return { valid: false, message: 'Name is required!' };
  }
  if (course.length < 3) {
    return { valid: false, message: 'Name should be minimum 3 characters!' };
  }
  return { valid: true };
}

// Export the Course model and validateCourseName function for use in other modules
exports.Course = Course;
exports.validateCourse = validateCourseName;