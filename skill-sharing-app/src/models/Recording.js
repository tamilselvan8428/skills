const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    recordedUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

recordingSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Recording = mongoose.model('Recording', recordingSchema);

module.exports = Recording;