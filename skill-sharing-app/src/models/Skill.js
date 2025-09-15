const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    skillName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    usersTeaching: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    usersLearning: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;