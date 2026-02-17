const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Authentication
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

    // Profile
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    profilePhoto: {
        type: String
    },
    language: {
        type: String,
        enum: ['uz', 'ru', 'en'],
        default: 'en'
    },

    // Financial & Subscription
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    subscription: {
        status: {
            type: String,
            enum: ['active', 'trial', 'past_due', 'canceled', 'none'],
            default: 'none'
        },
        planId: {
            type: String
        },
        startAt: {
            type: Date
        },
        endAt: {
            type: Date
        },
        autoRenew: {
            type: Boolean,
            default: false
        },
        lastPaymentAt: {
            type: Date
        },
        provider: {
            type: String,
            enum: ['click', 'payme', 'uzum', 'stripe']
        }
    },

    // Medical / Therapy
    therapy: {
        hasDiabetes: {
            type: Boolean,
            default: false
        },
        diabetesType: {
            type: String,
            enum: ['type1', 'type2', 'gestational', 'other', 'unknown'],
            default: 'unknown'
        },
        treatments: [{
            kind: {
                type: String,
                enum: ['insulin', 'medication', 'procedure', 'lifestyle'],
                required: true
            },
            name: {
                type: String,
                required: true
            },
            dose: {
                type: String
            },
            schedule: {
                type: String
            },
            note: {
                type: String
            },
            startAt: {
                type: Date
            },
            endAt: {
                type: Date
            },
            isActive: {
                type: Boolean,
                default: true
            }
        }]
    },

    // User States History
    userStates: [{
        type: {
            type: String,
            enum: ['weight', 'waist', 'bp', 'a1c', 'symptom', 'wellbeing'],
            required: true
        },
        value: {
            type: mongoose.Schema.Types.Mixed, // Can be string or number
            required: true
        },
        note: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Virtual field for age calculation
userSchema.virtual('age').get(function () {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Indexes for faster lookups
userSchema.index({ email: 1, authProvider: 1 });
userSchema.index({ 'userStates.createdAt': -1 });
userSchema.index({ 'subscription.status': 1, 'subscription.endAt': 1 });

module.exports = mongoose.model('User', userSchema);
