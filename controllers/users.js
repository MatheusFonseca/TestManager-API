const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all Users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id }).populate({
    path: 'classrooms',
    select: 'name course -students',
    populate: { path: 'course', select: 'name' },
  });

  // correctly formatted id but doesnt found
  if (!user) {
    return next(
      new ErrorResponse(404, `User not found with id of: ${req.params.id}`)
    );
  }

  res.status(200).json({ success: true, data: user });
});

// @desc    Create User
// @route   GET /api/v1/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({ success: true, data: user });
});

// @desc    Update User
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // correctly formatted id but doesnt found
  if (!user) {
    return next(
      new ErrorResponse(404, `User not found with id of: ${req.params.id}`)
    );
  }

  res.status(200).json({ success: true, data: user });
});

// @desc    Delete User
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});
