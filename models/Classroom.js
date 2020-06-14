const mongoose = require('mongoose');
const User = require('./User');

const defaultCapacity = 40;

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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ClassroomSchema.statics.getDefaultCapacity = () => defaultCapacity;

module.exports = mongoose.model('Classroom', ClassroomSchema);
