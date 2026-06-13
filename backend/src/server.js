const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Achievement = require('./models/Achievement');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/sessions', require('./routes/session.routes'));
app.use('/api/achievements', require('./routes/achievement.routes'));

// Welcome Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the TaskMate API' });
});

// Seed achievements database helper
const seedAchievements = async () => {
  try {
    const count = await Achievement.countDocuments();
    if (count === 0) {
      console.log('Seeding achievements...');
      const defaultAchievements = [
        {
          title: 'First Step',
          description: 'Log your first study focus session.',
          badgeKey: 'first_session',
          xpValue: 100,
          targetType: 'sessions_count',
          targetValue: 1,
        },
        {
          title: 'Dedicated Learner',
          description: 'Log 5 focus sessions.',
          badgeKey: 'sessions_5',
          xpValue: 250,
          targetType: 'sessions_count',
          targetValue: 5,
        },
        {
          title: 'Focus Initiate',
          description: 'Focus for a total of 30 minutes.',
          badgeKey: 'focus_30m',
          xpValue: 150,
          targetType: 'sessions_duration',
          targetValue: 30,
        },
        {
          title: 'Deep Focus',
          description: 'Focus for a total of 120 minutes (2 hours).',
          badgeKey: 'focus_120m',
          xpValue: 300,
          targetType: 'sessions_duration',
          targetValue: 120,
        },
        {
          title: 'Task Solver',
          description: 'Complete 3 tasks in your task manager.',
          badgeKey: 'tasks_3',
          xpValue: 150,
          targetType: 'tasks_completed',
          targetValue: 3,
        },
        {
          title: 'Productivity Master',
          description: 'Complete 10 tasks in your task manager.',
          badgeKey: 'tasks_10',
          xpValue: 400,
          targetType: 'tasks_completed',
          targetValue: 10,
        },
        {
          title: 'Rising Star',
          description: 'Reach user level 3.',
          badgeKey: 'level_3',
          xpValue: 200,
          targetType: 'user_level',
          targetValue: 3,
        },
        {
          title: 'Elite Scholar',
          description: 'Reach user level 10.',
          badgeKey: 'level_10',
          xpValue: 1000,
          targetType: 'user_level',
          targetValue: 10,
        },
      ];
      await Achievement.insertMany(defaultAchievements);
      console.log('Achievements seeded successfully.');
    }
  } catch (error) {
    console.error(`Failed to seed achievements: ${error.message}`);
  }
};

// Seed achievements on startup
seedAchievements();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
