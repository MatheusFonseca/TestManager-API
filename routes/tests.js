const express = require('express');
const Test = require('../models/Test');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const {
  getTests,
  getTest,
  createTest,
  updateTest,
  deleteTest,
  submitTest,
} = require('../controllers/tests.js');

router
  .route('/')
  .get(
    advancedResults(Test, [{ path: 'questions' }]),
    protect,
    authorize('admin', 'teacher'),
    getTests
  )
  .post(protect, authorize('admin', 'teacher'), createTest);

router
  .route('/:id')
  .get(protect, authorize('admin', 'teacher'), getTest)
  .put(protect, authorize('admin', 'teacher'), updateTest)
  .delete(protect, authorize('admin', 'teacher'), deleteTest);

router
  .route('/submittest/:id')
  .put(protect, authorize('admin', 'student'), submitTest);

module.exports = router;
