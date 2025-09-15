const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: false
    },
    college: {
        type: String,
        required: false
    },
    professionalDetails: {
        type: String,
        required: false
    },
    skillsTeaching: [{
        type: String,
        required: false
    }],
    skillsLearning: [{
        type: String,
        required: false
    }],
    currentSessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    }],
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recording'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);