const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Route to send email notifications for new sessions
router.post('/send', notificationController.sendNotification);

// Route to get notifications for a user
router.get('/:userId', notificationController.getUserNotifications);

module.exports = router;