const express = require('express');
const Achievement = require('../models/Achievement');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// @desc    Get all available achievements in the system
// @route   GET /api/achievements
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ targetValue: 1 });
    res.json({
      success: true,
      count: achievements.length,
      data: achievements,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
