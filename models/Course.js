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
  courseLoad: {
    type: Number,
    required: [true, 'Please add a course load'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Cascade delete classroom when course is deleted
CourseSchema.pre('remove', async function (next) {
  console.log(`Removing classrooms of course: ${this._id}`);
  console.log(`Removing questions of course: ${this._id}`);
  await this.model('Classroom').deleteMany({ course: this._id });
  await this.model('Question').deleteMany({ course: this._id });
  next();
});

module.exports = mongoose.model('Course', CourseSchema);
