const express = require('express');
const router = express.Router();

const User = require('../models/User');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/users');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(User, [
      {
        path: 'classrooms',
        select: 'name course -students',
        populate: { path: 'course', select: 'name' },
      },
    ]),
    protect,
    authorize('admin'),
    getUsers
  )
  .post(protect, authorize('admin'), createUser);

router
  .route('/:id')
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
