const Course = require('../models/Course');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all Courses
// @route   GET /api/v1/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single Course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  // correctly formatted id but not found
  if (!course) {
    return next(
      new ErrorResponse(404, `Course not found with id of: ${req.params.id}`)
    );
  }

  res.status(200).json({ success: true, data: course });
});

// @desc    Create Course
// @route   POST /api/v1/courses
// @access  Private/Admin
exports.createCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.create(req.body);
  res.status(201).json({ success: true, data: course });
});

// @desc    Update Course
// @route   PUT /api/v1/courses/:id
// @access  Private/Admin
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // correctly formatted id but not found
  if (!course) {
    return next(
      new ErrorResponse(404, `Course not found with id of: ${req.params.id}`)
    );
  }
  res.status(200).json({ success: true, data: course });
});

// @desc    Delete Course
// @route   DELETE /api/v1/courses/:id
// @access  Private/Admin
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  // correctly formatted id but not found
  if (!course) {
    return next(
      new ErrorResponse(404, `Course not found with id of: ${req.params.id}`)
    );
  }

  course.remove();

  res.status(200).json({ success: true, data: {} });
});
