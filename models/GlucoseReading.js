const mongoose = require('mongoose');

const glucoseReadingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    sensorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sensor'
    },
    value: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['low', 'normal', 'high'],
        required: true
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

// Compound index for efficient querying
glucoseReadingSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('GlucoseReading', glucoseReadingSchema);
