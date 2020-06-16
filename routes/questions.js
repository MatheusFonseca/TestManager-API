const express = require('express');

const { createQuestion } = require('../controllers/questions');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/').post(protect, authorize('admin', 'teacher'), createQuestion);

module.exports = router;
