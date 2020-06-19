const Question = require('../models/Question');
const Course = require('../models/Course');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all questions
// @route   GET /api/v1/questions
// @access  Private
exports.getQuestions = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single question
// @route   GET /api/v1/questions/:id
// @access  Private
exports.getQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findOne({ _id: req.params.id }).populate({
    path: 'tests',
    select: 'title classroom -questions',
  });

  // correctly formatted id but not found
  if (!question) {
    return next(
      new ErrorResponse(404, `Question not found with id of: ${req.params.id}`)
    );
  }
  res.status(200).json({ success: true, data: question });
});

// @desc    Create Question
// @route   POST /api/v1/questions
// @access  Private
exports.createQuestion = asyncHandler(async (req, res, next) => {
  if (req.body.course) {
    const course = await Course.findById(req.body.course);

    if (!course) {
      return next(
        new ErrorResponse(
          404,
          `Course not found with id of: ${req.body.course}`
        )
      );
    }
  }

  const question = await Question.create(req.body);

  res.status(201).json({ success: true, data: question });
});

// @desc    Update question
// @route   PUT /api/v1/questions/:id
// @access  Private
exports.updateQuestion = asyncHandler(async (req, res, next) => {
  let question = await Question.findOne({ _id: req.params.id }).populate(
    'tests'
  );

  // correctly formatted id but not found
  if (!question) {
    return next(
      new ErrorResponse(404, `Question not found with id of: ${req.params.id}`)
    );
  }

  // Checking if course exists
  if (req.body.course) {
    const course = await Course.findById(req.body.course);

    if (!course) {
      return next(
        new ErrorResponse(
          404,
          `Course not found with id of: ${req.body.course}`
        )
      );
    }
  }

  // If this question was already used in a test, it cant be updated
  if (question.tests && question.tests.length > 0) {
    return next(
      new ErrorResponse(
        404,
        `This question was already used in a test, it cant be updated`
      )
    );
  }

  question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({ success: true, data: question });
});

// @desc    Delete question
// @route   DELETE /api/v1/question/:id
// @access  Private
exports.deleteQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findOne({ _id: req.params.id }).populate(
    'tests'
  );

  // correctly formatted id but not found
  if (!question) {
    return next(
      new ErrorResponse(404, `Question not found with id of: ${req.params.id}`)
    );
  }

  // If this question was already used in a test, it cant be deleted
  if (question.tests && question.tests.length > 0) {
    return next(
      new ErrorResponse(
        404,
        `This question was already used in a test, it cant be updated`
      )
    );
  }

  question.remove();

  res.status(200).json({ success: true, data: {} });
});
