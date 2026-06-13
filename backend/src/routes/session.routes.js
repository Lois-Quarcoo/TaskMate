const express = require('express');
const { createSession, getSessions, getSessionStats } = require('../controllers/session.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/')
  .post(protect, createSession)
  .get(protect, getSessions);

router.route('/stats')
  .get(protect, getSessionStats);

module.exports = router;
