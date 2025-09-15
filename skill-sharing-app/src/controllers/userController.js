const User = require('../models/User');
const Recording = require('../models/Recording');

// Function to update user profile information
exports.updateProfile = async (req, res) => {
    const { name, email, college, professionalDetails, skillsToTeach, skillsToLearn } = req.body;

    try {
        const update = {
            name,
            email,
            college,
            professionalDetails
        };

        if (Array.isArray(skillsToTeach)) {
            update.skillsTeaching = skillsToTeach;
        }
        if (Array.isArray(skillsToLearn)) {
            update.skillsLearning = skillsToLearn;
        }

        const user = await User.findByIdAndUpdate(req.user.id, update, { new: true });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// Get logged-in user's profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-__v -password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving profile', error: error.message });
    }
};

// Function to view shared skills (skillsTeaching)
exports.getSharedSkills = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('skillsTeaching');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, skills: user.skillsTeaching || [] });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving shared skills',
            error: error.message
        });
    }
};

// Add skills to teach (append unique values)
exports.addSkillsToTeach = async (req, res) => {
    try {
        const { skills } = req.body; // expects array of strings
        if (!Array.isArray(skills)) {
            return res.status(400).json({ success: false, message: 'Skills must be an array' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const current = new Set(user.skillsTeaching || []);
        skills.forEach((s) => typeof s === 'string' && s.trim() && current.add(s.trim()));
        user.skillsTeaching = Array.from(current);
        await user.save();

        res.status(200).json({ success: true, skills: user.skillsTeaching });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding skills to teach', error: error.message });
    }
};

// View skills the user wants to learn (skillsLearning)
exports.getSkillsToLearn = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('skillsLearning');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, skills: user.skillsLearning || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving skills to learn', error: error.message });
    }
};

// List past recorded sessions for user (by attendance)
exports.getMyRecordings = async (req, res) => {
    try {
        const userId = req.user.id;
        const recordings = await Recording.find({}).populate({ path: 'sessionId', match: { $or: [{ teacher: userId }, { learners: userId }] } });
        const filtered = recordings.filter((r) => r.sessionId);
        res.status(200).json(filtered);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching recordings', error: error.message });
    }
};

// Bookmark a recording
exports.bookmarkRecording = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        const { recordingId } = req.params;
        const set = new Set((user.bookmarks || []).map(String));
        set.add(String(recordingId));
        user.bookmarks = Array.from(set);
        await user.save();
        res.status(200).json({ success: true, bookmarks: user.bookmarks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error bookmarking recording', error: error.message });
    }
};

// Remove bookmark
exports.removeBookmark = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        const { recordingId } = req.params;
        user.bookmarks = (user.bookmarks || []).filter((id) => String(id) !== String(recordingId));
        await user.save();
        res.status(200).json({ success: true, bookmarks: user.bookmarks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error removing bookmark', error: error.message });
    }
};

// Backward-compatible export if used elsewhere
exports.viewSharedSkills = exports.getSharedSkills;