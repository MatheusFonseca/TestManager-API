const User = require('../models/User');

// @desc    Get all Users
// @route   GET /api/v1/Users
// @access  Protected
exports.getUsers = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all users' });
};

// @desc    Create User
// @route   GET /api/v1/Users
// @access  Protected
exports.createUser = async (req, res, next) => {
  try {
    const User = await User.create(req.body);
    res.status(201).json({ success: true, data: User });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
