const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serialNumber: {
        type: String,
        required: true,
        unique: true,
        length: 19
    },
    connectionCode: {
        type: String,
        required: true,
        length: 8
    },
    activatedAt: {
        type: Date,
        default: Date.now
    },
    lastSync: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Sensor', sensorSchema);
