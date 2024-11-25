const authorisation = require('../middleware/authorisation');
const admin = require('../middleware/admin');
const { Course, validateCourse } = require('../models/course.js');
const express = require('express');
const router = express.Router();

// Get all courses and return them
router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.send(courses);
});

// Get a specific course by ID
router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).send('Course with this ID does not exist!');
  res.send(course);
});

// Create a new course with the provided data
router.post('/', authorisation, async (req, res) => { // Second argument is a middleware function and is optional
  const error = validateCourse(req.body.name); 
  if (!error.valid) return res.status(400).send(error.message);
  const course = new Course({
    name: req.body.name,
    author: req.body.author,
    tags: req.body.tags,
    date: req.body.date || Date.now(),
    isPublic: req.body.isPublic
    });
    await course.save();
    res.send(course);
});

// Update an existing course by ID with the provided data
router.put('/:id', async (req, res) => {
  if (req.body.name) {
    const error = validateCourse(req.body.name); 
    if (!error.valid) return res.status(400).send(error.message);
  }
  const updates = {};
  if (req.body.name) { updates.name = req.body.name; }
  if (req.body.author) { updates.author = req.body.author; }
  if (typeof req.body.isPublic === 'boolean') { updates.isPublic = req.body.isPublic; }
  const course = await Course.findByIdAndUpdate(req.params.id, {
    $set: updates
  }, { new: true });
  if (!course) return res.status(404).send('Course with this ID does not exist!');
  res.send(course);
});

// Delete a course by ID
router.delete('/:id', [authorisation, admin], async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).send('Course with this ID does not exist!');
  res.send(course);
});

// Export the router object to be used in other modules
module.exports = router;