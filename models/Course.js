const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [30, 'Name can not be longer than 30 characters'],
  },
  courseCode: {
    type: String,
    required: [true, 'Please add a course code'],
    unique: true,
    trim: true,
    maxlength: [10, 'Code can not be longer than 10 characters'],
  },
  courseLoad: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', CourseSchema);
