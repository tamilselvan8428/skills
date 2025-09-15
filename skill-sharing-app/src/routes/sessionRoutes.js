const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Route to create a new session
router.post('/create', authMiddleware, sessionController.createSession);

// Route to get all sessions for a user
router.get('/my-sessions', authMiddleware, sessionController.getUserSessions);

// Route to record a session
router.post('/record/:sessionId', authMiddleware, sessionController.recordSession);

// Route to get session details
router.get('/:sessionId', authMiddleware, sessionController.getSessionDetails);

// Route to track attendance for a session
router.post('/attend/:sessionId', authMiddleware, sessionController.trackAttendance);

// Route to set or update GMeet link and notify learners
router.post('/:sessionId/gmeet', authMiddleware, sessionController.setGMeetLink);

module.exports = router;