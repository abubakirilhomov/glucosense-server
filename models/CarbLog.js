const mongoose = require('mongoose');

const carbLogSchema = new mongoose.Schema({
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
    mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack']
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

module.exports = mongoose.model('CarbLog', carbLogSchema);
