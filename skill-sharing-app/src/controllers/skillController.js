const Skill = require('../models/Skill');
const User = require('../models/User');
const emailService = require('../services/emailService');

// Add a skill (catalog entry)
exports.addSkill = async (req, res) => {
    try {
        const { skillName, description } = req.body;
        if (!skillName || typeof skillName !== 'string') {
            return res.status(400).json({ message: 'skillName is required' });
        }
        const skill = new Skill({ skillName: skillName.trim(), description });
        await skill.save();
        res.status(201).json({ message: 'Skill added successfully', skill });
    } catch (error) {
        res.status(500).json({ message: 'Error adding skill', error: error.message });
    }
};

// Get all skills (catalog)
exports.getAllSkills = async (req, res) => {
    try {
        const skills = await Skill.find({}).sort({ createdAt: -1 });
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching skills', error: error.message });
    }
};

// Get skills by user (teaching or learning association)
exports.getSkillsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const skills = await Skill.find({
            $or: [
                { usersTeaching: userId },
                { usersLearning: userId }
            ]
        });
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user skills', error: error.message });
    }
};

// Add a skill to teach
exports.addSkillToTeach = async (req, res) => {
    try {
        const { skillName } = req.body;
        const userId = req.user && req.user.id;
        if (!skillName) {
            return res.status(400).json({ message: 'skillName is required' });
        }

        // Find or create skill catalog entry
        let skill = await Skill.findOne({ skillName });
        if (!skill) {
            skill = await Skill.create({ skillName });
        }

        // Associate user as teaching
        const set = new Set((skill.usersTeaching || []).map(String));
        if (userId) set.add(String(userId));
        skill.usersTeaching = Array.from(set);
        await skill.save();

        res.status(201).json({ message: 'Skill added to teaching list', skill });
    } catch (error) {
        res.status(500).json({ message: 'Error adding skill to teach', error: error.message });
    }
};

// Express interest in learning a skill
exports.expressInterest = async (req, res) => {
    try {
        const { skillId } = req.params;
        const userId = req.user.id;
        const skill = await Skill.findById(skillId);
        if (!skill) return res.status(404).json({ message: 'Skill not found' });
        const set = new Set((skill.usersLearning || []).map(String));
        set.add(String(userId));
        skill.usersLearning = Array.from(set);
        await skill.save();
        res.status(200).json({ message: 'Interest expressed', skill });
    } catch (error) {
        res.status(500).json({ message: 'Error expressing interest', error: error.message });
    }
};

// Remove interest
exports.removeInterest = async (req, res) => {
    try {
        const { skillId } = req.params;
        const userId = req.user.id;
        const skill = await Skill.findById(skillId);
        if (!skill) return res.status(404).json({ message: 'Skill not found' });
        skill.usersLearning = (skill.usersLearning || []).filter((id) => String(id) !== String(userId));
        await skill.save();
        res.status(200).json({ message: 'Interest removed', skill });
    } catch (error) {
        res.status(500).json({ message: 'Error removing interest', error: error.message });
    }
};

// Browse skills to learn
exports.browseSkillsToLearn = async (req, res) => {
    try {
        const skills = await Skill.find({ usersTeaching: { $exists: true, $ne: [] } });
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching skills', error: error.message });
    }
};

// Get skills shared by a user
exports.getSharedSkills = async (req, res) => {
    try {
        const userId = req.user.id;
        const skills = await Skill.find({ usersTeaching: userId });
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching shared skills', error: error.message });
    }
};

// Update a skill
exports.updateSkill = async (req, res) => {
    try {
        const skillId = req.params.skillId || req.body.skillId;
        const { skillName, description } = req.body;
        const update = {};
        if (typeof skillName === 'string') update.skillName = skillName;
        if (typeof description === 'string') update.description = description;

        const skill = await Skill.findByIdAndUpdate(skillId, update, { new: true });
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.status(200).json({ message: 'Skill updated successfully', skill });
    } catch (error) {
        res.status(500).json({ message: 'Error updating skill', error: error.message });
    }
};

// Delete a skill
exports.deleteSkill = async (req, res) => {
    try {
        const skillId = req.params.skillId || req.body.skillId;
        const skill = await Skill.findByIdAndDelete(skillId);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.status(200).json({ message: 'Skill deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting skill', error: error.message });
    }
};