const express = require('express');

const Question = require('../models/Question');
const {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questions');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

router
  .route('/')
  .get(
    advancedResults(Question, [
      { path: 'tests', select: 'title classroom -questions' },
    ]),
    protect,
    authorize('admin', 'teacher'),
    getQuestions
  )
  .post(protect, authorize('admin', 'teacher'), createQuestion);

router
  .route('/:id')
  .get(protect, authorize('admin', 'teacher'), getQuestion)
  .put(protect, authorize('admin', 'teacher'), updateQuestion)
  .delete(protect, authorize('admin', 'teacher'), deleteQuestion);

module.exports = router;
