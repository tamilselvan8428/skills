const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Route to update user profile
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

router.get('/shared-skills', authMiddleware, userController.getSharedSkills);

// Route to add skills to teach
router.post('/skills/teach', authMiddleware, userController.addSkillsToTeach);

// Route to view skills user wants to learn
router.get('/skills/learn', authMiddleware, userController.getSkillsToLearn);

// Recordings for the user
router.get('/recordings', authMiddleware, userController.getMyRecordings);

// Bookmark management
router.post('/recordings/:recordingId/bookmark', authMiddleware, userController.bookmarkRecording);
router.delete('/recordings/:recordingId/bookmark', authMiddleware, userController.removeBookmark);

module.exports = router;