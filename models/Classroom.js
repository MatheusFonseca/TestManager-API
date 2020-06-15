const mongoose = require('mongoose');
const User = require('./User');

const defaultCapacity = 20;

const ClassroomSchema = new mongoose.Schema({
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
    required: true,
  },
  teacher: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  students: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  //validate: [arrayLimit, '{PATH} exceeds the limit of 10']
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure, at db level, that an user is registered at max 1 classroom of each course
ClassroomSchema.index({ course: 1, students: 1 }, { unique: true });

// Get default capacity of classroom
ClassroomSchema.statics.getDefaultCapacity = () => defaultCapacity;

module.exports = mongoose.model('Classroom', ClassroomSchema);
