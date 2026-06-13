const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  badgeKey: {
    type: String,
    required: true,
    unique: true, // e.g. 'first_session', 'study_1_hour', 'complete_5_tasks', 'level_5'
  },
  xpValue: {
    type: Number,
    default: 100,
  },
  targetType: {
    type: String,
    enum: ['sessions_count', 'sessions_duration', 'tasks_completed', 'user_level'],
    required: true,
  },
  targetValue: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Achievement', AchievementSchema);
