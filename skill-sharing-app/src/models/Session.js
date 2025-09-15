const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    learners: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    scheduledTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // duration in minutes
        required: true
    },
    recordingLink: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Session', sessionSchema);