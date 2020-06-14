const Course = require('../models/Course');
const User = require('../models/User');
const Classroom = require('../models/Classroom');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all classrooms
// @route   GET /api/v1/classrooms
// @access  Private/Admin
exports.getClassrooms = asyncHandler(async (req, res, next) => {
  const classrooms = await Classroom.find();
  res.status(200).json(res.advancedResults);
});

// @desc    Get single classroom
// @route   GET /api/v1/classrooms/:id
// @access  Private/Admin
exports.getClassroom = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.findOne({ _id: req.params.id })
    .populate({ path: 'students', select: 'name' })
    .populate('teacher')
    .populate('course');
  // correctly formatted id but doesnt found
  if (!classroom) {
    return next(
      new ErrorResponse(404, `Classroom not found with id of: ${req.params.id}`)
    );
  }
  res.status(200).json({ success: true, data: classroom });
});

// @desc    Add classroom
// @route   POST /api/v1/classrooms
// @access  Private/Admin
exports.addClassroom = asyncHandler(async (req, res, next) => {
  //
  // Checking if teacher exist and have 'teacher' role
  const teacher = await User.findById(req.body.teacher);
  if (!teacher) {
    return next(
      new ErrorResponse(
        400,
        `Teacher not found with id of: ${req.body.teacher}`
      )
    );
  } else if (teacher.role !== 'teacher') {
    return next(
      new ErrorResponse(
        400,
        "Classroom require a teacher with role of 'teacher'"
      )
    );
  }

  // Checking if classroom capacity is ok
  const capacity = req.body.capacity || Classroom.getDefaultCapacity();
  if (req.body.students.length > capacity) {
    return next(
      new ErrorResponse(400, `Limit of ${capacity} students. (capacity)`)
    );
  }

  // Removing duplicates
  req.body.students = [...new Set(req.body.students)];

  // Checking if students exist and have 'student' role
  for (value of req.body.students) {
    const student = await User.findById(value);
    if (student.role !== 'student') {
      return next(
        new ErrorResponse(
          400,
          `Students need to have 'student' role, id ${value} does not.`
        )
      );
    }
  }

  // Checking if course exists
  const course = await Course.findById(req.body.course);
  if (!course) {
    return next(
      new ErrorResponse(400, `Course not found with id of: ${req.body.teacher}`)
    );
  }

  const classroom = await Classroom.create(req.body);

  res.status(201).json({ success: true, data: classroom });
});

// @desc    Update classroom
// @route   PUT /api/v1/classrooms/:id
// @access  Private/Admin
exports.updateClassroom = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.findById(req.params.id);

  // Checking if teacher exist and have 'teacher' role
  if (req.body.teacher) {
    const teacher = await User.findById(req.body.teacher);
    if (!teacher) {
      return next(
        new ErrorResponse(
          400,
          `Teacher not found with id of: ${req.body.teacher}`
        )
      );
    } else if (teacher.role !== 'teacher') {
      return next(
        new ErrorResponse(
          400,
          "Classroom require a teacher with role of 'teacher'"
        )
      );
    }
  }

  if (req.body.students) {
    // Checking if classroom capacity is ok
    const capacity = req.body.capacity || classroom.capacity;
    if (req.body.students.length > capacity) {
      return next(
        new ErrorResponse(400, `Limit of ${capacity} students. (capacity)`)
      );
    }

    // Removing duplicates
    req.body.students = [...new Set(req.body.students)];

    // Checking if students exist and have 'student' role
    for (value of req.body.students) {
      const student = await User.findById(value);
      if (student.role !== 'student') {
        return next(
          new ErrorResponse(
            400,
            `Students need to have 'student' role, id ${value} does not.`
          )
        );
      }
    }
  }

  if (req.body.course) {
    // Checking if course exists
    const course = await Course.findById(req.body.course);
    if (!course) {
      return next(
        new ErrorResponse(
          400,
          `Course not found with id of: ${req.body.teacher}`
        )
      );
    }
  }

  console.log(req.body);
  await classroom.updateOne(req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({ success: true, data: classroom });
});

// @desc    Delete Classroom
// @route   DELETE /api/v1/classroom/:id
// @access  Private/Admin
exports.deleteClassroom = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.findByIdAndDelete(req.params.id);

  // correctly formatted id but doesnt found
  if (!classroom) {
    return next(
      new ErrorResponse(404, `Classroom not found with id of: ${req.params.id}`)
    );
  }

  res.status(200).json({ success: true, data: {} });
});
