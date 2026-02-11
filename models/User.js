const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: function () {
            // Password is only required for email/password auth, not for Firebase
            return this.authProvider === 'email';
        }
    },
    name: {
        type: String,
        required: true
    },
    language: {
        type: String,
        enum: ['uz', 'ru', 'en'],
        default: 'en'
    },
    authProvider: {
        type: String,
        enum: ['email', 'google', 'apple', 'facebook'],
        default: 'email'
    },
    firebaseUid: {
        type: String,
        sparse: true,
        unique: true,
        index: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    profilePhoto: {
        type: String
    }
}, {
    timestamps: true
});

// Index for faster lookups
userSchema.index({ email: 1, authProvider: 1 });

module.exports = mongoose.model('User', userSchema);
