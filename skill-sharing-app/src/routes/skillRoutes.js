const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Route to add a skill
router.post('/add', authMiddleware, skillController.addSkill);

// Route to get all skills
router.get('/', skillController.getAllSkills);

// Route to get skills by user
router.get('/user/:userId', skillController.getSkillsByUser);

// Route to update a skill
router.put('/update/:skillId', authMiddleware, skillController.updateSkill);

// Route to delete a skill
router.delete('/delete/:skillId', authMiddleware, skillController.deleteSkill);

// Express interest in learning a skill
router.post('/:skillId/interest', authMiddleware, skillController.expressInterest);

// Remove interest in learning a skill
router.delete('/:skillId/interest', authMiddleware, skillController.removeInterest);

module.exports = router;