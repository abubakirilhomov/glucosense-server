const mongoose = require('mongoose');

const insulinLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['rapid', 'long'],
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        index: true
    },
    notes: {
        type: String
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

module.exports = mongoose.model('InsulinLog', insulinLogSchema);
