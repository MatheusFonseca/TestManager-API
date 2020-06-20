const mongoose = require('mongoose');

const notEmpty = (v) => {
  return v.length > 0;
};

const questionTest = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.ObjectId,
      ref: 'Question',
      required: [true, 'Please add a question'],
    },
    chosenAnswer: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Please add an answer'],
    },
  },
  { _id: false }
);

const studentTest = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please add a student'],
  },
  questions: {
    type: [questionTest],
    validate: { validator: notEmpty, message: 'Please add questions' },
  },
});

const TestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  classroom: {
    type: mongoose.Schema.ObjectId,
    ref: 'Classroom',
    required: [true, 'Please add a classroom'],
  },
  questions: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Question',
    },
  ],
  students: [studentTest],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

TestSchema.path('questions').validate(
  (v) => v.length > 0,
  'A test must have at least one question'
);

TestSchema.path('students').validate((v) => {});

// Test with different titles for a classroom
TestSchema.index({ title: 1, classroom: 1 }, { unique: true });

module.exports = mongoose.model('Test', TestSchema);
