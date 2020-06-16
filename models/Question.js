const mongoose = require('mongoose');

const arrayLimit = (value) => {
  let texts = value.map((v) => v.text);
  texts = [...new Set(texts)];

  const corrects = value.filter((v) => v.correct === true);

  // 5 different texts and only 1 correct true
  if (texts.length !== 5 || corrects.length !== 1) {
    return false;
  }

  return value.length === 5;
};

const answer = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please add answer text'],
  },
  correct: { type: Boolean, required: [true, "Please add 'correct' field"] },
});

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Please add the question's main text"],
    trim: true,
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: [true, 'Please add a course'],
  },
  photo: {
    type: String,
    default: 'no-photo.jpg',
  },
  answers: {
    type: [answer],
    required: true,
    validate: [
      arrayLimit,
      '{PATH} must be 5 different ones and exactly 1 true',
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 2 questions might have the same main text if they are of different courses
QuestionSchema.index({ course: 1, text: 1 }, { unique: true });

module.exports = mongoose.model('Question', QuestionSchema);
