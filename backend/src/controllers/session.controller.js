const StudySession = require('../models/StudySession');
const Task = require('../models/Task');
const User = require('../models/User');
const Achievement = require('../models/Achievement');

// @desc    Log a new study focus session
// @route   POST /api/sessions
// @access  Private
const createSession = async (req, res) => {
  try {
    const { duration, type, taskId } = req.body;

    if (!duration) {
      return res.status(400).json({ success: false, message: 'Please provide session duration' });
    }

    // 1. Calculate XP earned: 5 XP per minute focused (minimum 5 XP)
    const xpEarned = Math.max(5, Math.round((duration / 60) * 5));

    // 2. Create the study session record
    const session = await StudySession.create({
      user: req.user.id,
      task: taskId || null,
      duration,
      type: type || 'Study',
      xpEarned,
    });

    // 3. Update the associated task if provided
    if (taskId) {
      await Task.findByIdAndUpdate(taskId, {
        $inc: { studyTimeSpent: duration }
      });
    }

    // 4. Update user profile XP and Level
    const user = await User.findById(req.user.id);
    user.xp += xpEarned;
    
    // Level calculation: 1000 XP per level
    const newLevel = Math.floor(user.xp / 1000) + 1;
    let leveledUp = false;
    if (newLevel > user.level) {
      user.level = newLevel;
      leveledUp = true;
    }

    // Save user state initially
    await user.save();

    // 5. Check and unlock achievements
    const allAchievements = await Achievement.find();
    
    // Fetch count of sessions and completed tasks to check achievement conditions
    const sessionCount = await StudySession.countDocuments({ user: user._id });
    
    const totalDurationResult = await StudySession.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ]);
    const totalDurationSeconds = totalDurationResult.length > 0 ? totalDurationResult[0].total : 0;

    const completedTasksCount = await Task.countDocuments({ user: user._id, status: 'completed' });

    const newlyUnlocked = [];

    for (const achievement of allAchievements) {
      // Check if user already has this achievement unlocked
      const alreadyUnlocked = user.unlockedAchievements.some(
        (ua) => ua.achievement.toString() === achievement._id.toString()
      );

      if (!alreadyUnlocked) {
        let isEligible = false;

        switch (achievement.targetType) {
          case 'sessions_count':
            if (sessionCount >= achievement.targetValue) isEligible = true;
            break;
          case 'sessions_duration':
            // targetValue is stored in minutes, aggregate duration is in seconds
            if ((totalDurationSeconds / 60) >= achievement.targetValue) isEligible = true;
            break;
          case 'tasks_completed':
            if (completedTasksCount >= achievement.targetValue) isEligible = true;
            break;
          case 'user_level':
            if (user.level >= achievement.targetValue) isEligible = true;
            break;
        }

        if (isEligible) {
          user.unlockedAchievements.push({ achievement: achievement._id });
          user.xp += achievement.xpValue; // Reward extra XP for unlocking the achievement
          newlyUnlocked.push(achievement);
        }
      }
    }

    // If we unlocked achievements, we might need to recalculate levels again
    const finalLevel = Math.floor(user.xp / 1000) + 1;
    if (finalLevel > user.level) {
      user.level = finalLevel;
      leveledUp = true;
    }

    await user.save();

    res.status(201).json({
      success: true,
      data: {
        session,
        xpEarned,
        xpTotal: user.xp,
        level: user.level,
        leveledUp,
        newlyUnlocked,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all study sessions for user
// @route   GET /api/sessions
// @access  Private
const getSessions = async (req, res) => {
  try {
    const sessions = await StudySession.find({ user: req.user.id })
      .populate('task', 'title status')
      .sort({ startTime: -1 });

    res.json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get study summary and statistics
// @route   GET /api/sessions/stats
// @access  Private
const getSessionStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Aggregate sessions to get total minutes, session counts and category splits
    const sessions = await StudySession.find({ user: userId });
    
    const totalSeconds = sessions.reduce((acc, cur) => acc + cur.duration, 0);
    const totalMinutes = Math.round(totalSeconds / 60);
    const sessionCount = sessions.length;

    // Group duration and counts by category type
    const categoryStats = {};
    sessions.forEach(s => {
      const type = s.type || 'Study';
      if (!categoryStats[type]) {
        categoryStats[type] = { minutes: 0, count: 0 };
      }
      categoryStats[type].minutes += Math.round(s.duration / 60);
      categoryStats[type].count += 1;
    });

    // Completed tasks count
    const completedTasksCount = await Task.countDocuments({ user: userId, status: 'completed' });
    const pendingTasksCount = await Task.countDocuments({ user: userId, status: 'pending' });

    res.json({
      success: true,
      data: {
        totalMinutes,
        sessionCount,
        categoryStats,
        completedTasksCount,
        pendingTasksCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSession,
  getSessions,
  getSessionStats,
};
