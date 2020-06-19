const express = require('express');

const {
  getClassrooms,
  getClassroom,
  addClassroom,
  updateClassroom,
  deleteClassroom,
} = require('../controllers/classrooms');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Classroom = require('../models/Classroom');

const router = express.Router();

router
  .route('/')
  .get(
    advancedResults(Classroom, [
      { path: 'teacher', select: 'name' },
      { path: 'students', select: 'name' },
      { path: 'course', select: 'name' },
    ]),
    protect,
    authorize('admin'),
    getClassrooms
  )
  .post(protect, authorize('admin'), addClassroom);

router
  .route('/:id')
  .get(protect, authorize('admin'), getClassroom)
  .put(protect, authorize('admin'), updateClassroom)
  .delete(protect, authorize('admin'), deleteClassroom);

module.exports = router;
