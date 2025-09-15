const Notification = require('../models/Notification');
const emailService = require('../services/emailService');

// Create and send a notification
exports.sendNotification = async (req, res) => {
    try {
        const { userId, email, subject, message } = req.body;
        if (!subject || !message) {
            return res.status(400).json({ message: 'subject and message are required' });
        }
        if (email) {
            await emailService.sendEmail(email, subject, message);
        }
        if (userId) {
            await Notification.create({ user: userId, subject, message });
        }
        res.status(200).json({ message: 'Notification processed' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending notification', error: error.message });
    }
};

// Get notifications for a user
exports.getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};