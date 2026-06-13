const mongoose = require('mongoose');

const StudySessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null,
  },
  duration: {
    type: Number, // duration in seconds
    required: true,
  },
  type: {
    type: String,
    enum: ['Study', 'Coding', 'Design', 'Reading', 'Writing', 'Other'],
    default: 'Study',
  },
  xpEarned: {
    type: Number,
    default: 0,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StudySession', StudySessionSchema);
