const Course = require('../models/Course');

// @desc    Get all Courses
// @route   GET /api/v1/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();
    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc    Get single Course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    // correctly formatted id but doesnt found
    if (!course) {
      return res.status(404).json({ success: false });
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc    Create Course
// @route   POST /api/v1/courses
// @access  Private/Admin
exports.createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc    Update Course
// @route   PUT /api/v1/courses/:id
// @access  Private/Admin
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // correctly formatted id but doesnt found
    if (!course) {
      return res.status(404).json({ success: false });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

// @desc    Delete Course
// @route   DELETE /api/v1/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    // correctly formatted id but doesnt found
    if (!course) {
      return res.status(404).json({ success: false });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
