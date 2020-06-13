const express = require('express');
const router = express.Router();

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses');

const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(advancedResults(Course), getCourses)
  .post(protect, authorize('admin'), createCourse);
router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('admin'), updateCourse)
  .delete(protect, authorize('admin'), deleteCourse);

module.exports = router;
