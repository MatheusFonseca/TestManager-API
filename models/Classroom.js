const mongoose = require('mongoose');
const User = require('./User');

const defaultCapacity = 20;

const ClassroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a class name'],
      trim: true,
      unique: true,
    },
    capacity: {
      type: Number,
      default: defaultCapacity,
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      required: [true, 'Please add a course'],
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please add a teacher'],
    },
    students: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ensure, at db level, that an user is registered at max 1 classroom of each course
ClassroomSchema.index({ course: 1, students: 1 }, { unique: true });

// Get default capacity of classroom
ClassroomSchema.statics.getDefaultCapacity = () => defaultCapacity;

// Reverse populate with virtuals
ClassroomSchema.virtual('tests', {
  ref: 'Test',
  localField: '_id',
  foreignField: 'classroom',
  justOne: false,
});

// Cascade delete tests when classroom is deleted
ClassroomSchema.pre('remove', async function (next) {
  console.log(`Removing tests from classroom: ${this._id}`);
  await this.model('Test').deleteMany({ classroom: this._id });
  next();
});

module.exports = mongoose.model('Classroom', ClassroomSchema);
