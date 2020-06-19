const mongoose = require('mongoose');

const questionsValidator = (v) => {
  return v.length > 0;
};

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
  students: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      grade: {
        type: Number,
        min: 0,
        max: 10,
        required: [true, 'Please add a grade between 0 and 10'],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

TestSchema.path('questions').validate(
  (v) => v.length > 0,
  'A test must have at least one question'
);

// Test with different titles for a classroom
TestSchema.index({ title: 1, classroom: 1 }, { unique: true });

module.exports = mongoose.model('Test', TestSchema);
