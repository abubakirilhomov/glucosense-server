const mongoose = require('mongoose');

const verificationCodeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    code: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    },
    used: {
        type: Boolean,
        default: false
    },
    attempts: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // Auto-delete after 10 minutes (600 seconds)
    }
});

// Index for automatic cleanup
verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to check if code is still valid
verificationCodeSchema.methods.isValid = function () {
    return !this.used && this.expiresAt > new Date() && this.attempts < 5;
};

// Method to increment attempts
verificationCodeSchema.methods.incrementAttempts = function () {
    this.attempts += 1;
    return this.save();
};

module.exports = mongoose.model('VerificationCode', verificationCodeSchema);
