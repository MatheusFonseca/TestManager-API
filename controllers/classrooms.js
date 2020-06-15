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
  // correctly formatted id but not found
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
  // Running validators
  await validateTeacher(next, req.body.teacher);
  validateCapacity(next, req.body.capacity, req.body.students.length);
  await validateCourse(next, req.body.course);
  await validateStudents(next, req.body.students, req.body.course);

  const classroom = await Classroom.create(req.body);

  res.status(201).json({ success: true, data: classroom });
});

// @desc    Update classroom
// @route   PUT /api/v1/classrooms/:id
// @access  Private/Admin
exports.updateClassroom = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const classroom = await Classroom.findById(id);
  if (!classroom) {
    return next(
      new ErrorResponse(404, `Classroom not found with id of: ${id}`)
    );
  }
  // Running validators
  if (req.body.teacher) {
    await validateTeacher(next, req.body.teacher);
  }
  if (req.body.capacity) {
    validateCapacity(
      next,
      req.body.capacity,
      req.body.students.length,
      classroom.capacity
    );
  }
  if (req.body.course) {
    await validateCourse(next, req.body.course);
  }
  if (req.body.students) {
    await validateStudents(next, req.body.students, req.body.course);
  }

  await classroom.updateOne(req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: classroom });
});

// @desc    Delete Classroom
// @route   DELETE /api/v1/classroom/:id
// @access  Private/Admin
exports.deleteClassroom = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.findByIdAndDelete(req.params.id);

  // correctly formatted id but not found
  if (!classroom) {
    return next(
      new ErrorResponse(404, `Classroom not found with id of: ${req.params.id}`)
    );
  }

  res.status(200).json({ success: true, data: {} });
});

// Helpers
const validateTeacher = async (next, id) => {
  // Checking if teacher exist and have 'teacher' role
  const teacher = await User.findById(id);
  if (!teacher) {
    throw next(new ErrorResponse(404, `Teacher not found with id of: ${id}`));
  } else if (teacher.role !== 'teacher') {
    throw next(
      new ErrorResponse(
        400,
        "Classroom require a teacher with role of 'teacher'"
      )
    );
  }
};

const validateCapacity = async (
  next,
  newCapacity,
  studentsCount,
  oldCapacity
) => {
  // Checking if classroom capacity is ok
  const capacity = newCapacity || oldCapacity || Classroom.getDefaultCapacity();
  if (studentsCount > capacity) {
    throw next(
      new ErrorResponse(400, `Limit of ${capacity} students. (capacity)`)
    );
  }
};

const validateStudents = async (next, students, course) => {
  // Removing duplicates
  students = [...new Set(students)];

  // Checking if students exist...
  for (value of students) {
    const student = await User.findOne({
      _id: value,
    }).populate('classrooms');
    if (!student) {
      throw next(
        new ErrorResponse(404, `Student not found with id of ${value}.`)
      );
    }
    // ... and have 'student' role
    if (student.role !== 'student') {
      throw next(
        new ErrorResponse(
          400,
          `Students need to have 'student' role, id ${value} does not.`
        )
      );
    }
    // ...and are not already registered in another class of the same course
    const classrooms = student.classrooms.map((classroom) =>
      classroom.course.toString()
    );
    if (classrooms.includes(course)) {
      throw next(
        new ErrorResponse(
          400,
          `Student ${value} is already registered in another class of the same course`
        )
      );
    }
  }
};

const validateCourse = async (next, id) => {
  // Checking if course exists
  const course = await Course.findById(id);
  if (!course) {
    throw next(new ErrorResponse(404, `Course not found with id of: ${id}`));
  }
};
