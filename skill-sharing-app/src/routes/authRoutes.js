const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// User Registration
router.post('/register', authController.register);

// User Login
router.post('/login', authController.login);

// Current user
router.get('/me', authMiddleware, authController.me);

module.exports = router;