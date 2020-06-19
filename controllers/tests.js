const Test = require('../models/Test');
const Classroom = require('../models/Classroom');
const Question = require('../models/Question');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all tests
// @route   GET /api/v1/tests
// @access  Private
exports.getTests = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single test
// @route   GET /api/v1/tests/:id
// @access  Private
exports.getTest = asyncHandler(async (req, res, next) => {
  const test = await Test.findOne({ _id: req.params.id }).populate('questions');

  if (!test) {
    return next(
      new ErrorResponse(404, `Test not found with id of: ${req.params.id}`)
    );
  }

  res.status(200).json({ success: true, data: test });
});

// @desc    Create test
// @route   POST /api/v1/tests
// @access  Private
exports.createTest = asyncHandler(async (req, res, next) => {
  const classroom = await validateClassroom(next, req.body.classroom);
  await validateQuestions(next, req.body.questions, classroom.course);

  const test = await Test.create(req.body);
  res.status(201).json({ success: true, data: test });
});

// @desc    Update test
// @route   PUT /api/v1/tests/:id
// @access  Private
exports.updateTest = asyncHandler(async (req, res, next) => {
  let test = await Test.findById(req.params.id);

  if (!test) {
    return next(
      new ErrorResponse(404, `Test not found with id of: ${req.params.id}`)
    );
  }

  let classroom;

  if (req.body.classroom) {
    console.log(req.body.classroom);
    classroom = await validateClassroom(next, req.body.classroom);
  } else {
    classroom = await Classroom.findById(test.classroom);
  }
  if (req.body.questions) {
    await validateQuestions(next, req.body.questions, classroom.course);
  }

  test = await Test.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({ success: true, data: test });
});

// @desc    Delete test
// @route   DELETE /api/v1/tests/:id
// @access  Private
exports.deleteTest = asyncHandler(async (req, res, next) => {
  const test = await Test.findById(req.params.id);

  if (!test) {
    return next(
      new ErrorResponse(404, `Test not found with id of: ${req.params.id}`)
    );
  }

  test.remove();

  res.status(200).json({ success: true, data: {} });
});

// Helpers
const validateClassroom = async (next, id) => {
  if (!id) {
    return next(new ErrorResponse(400, 'Please add a classroom'));
  }

  // Checking if classroom exists
  const classroom = await Classroom.findById(id);
  if (!classroom) {
    return next(
      new ErrorResponse(404, `Classroom not found with id of: ${id}`)
    );
  }
  return classroom;
};

const validateQuestions = async (next, questions, testCourse) => {
  // Removing duplicates
  questions = [...new Set(questions)];

  // Checking if questions exist...
  for (value of questions) {
    const question = await Question.findById(value);
    if (!question) {
      return next(
        new ErrorResponse(404, `Question not found with id of ${value}`)
      );
    }

    // Checking if question has the same course of classroom
    if (question.course.toString() !== testCourse.toString()) {
      return next(
        new ErrorResponse(
          404,
          `Question must have the same course of the test to witch belongs: ${testCourse}`
        )
      );
    }
  }
};
