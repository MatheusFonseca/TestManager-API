const Question = require('../models/Question');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create Question
// @route   POST /api/v1/questions
// @access  Private
exports.createQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.create(req.body);

  res.status(201).json({ success: true, data: question });
});
