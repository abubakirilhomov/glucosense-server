const Sensor = require('../models/Sensor');

// Create new sensor
exports.createSensor = async (req, res, next) => {
    try {
        const { serialNumber, connectionCode } = req.body;

        if (!serialNumber || !connectionCode) {
            return res.status(400).json({
                success: false,
                error: 'ValidationError',
                message: 'serialNumber and connectionCode are required'
            });
        }

        // Check if sensor already exists
        const existing = await Sensor.findOne({ serialNumber });
        if (existing) {
            return res.status(400).json({
                success: false,
                error: 'ValidationError',
                message: 'Sensor already registered'
            });
        }

        const sensor = await Sensor.create({
            userId: req.userId,
            serialNumber,
            connectionCode,
            activatedAt: new Date()
        });

        res.status(201).json({
            success: true,
            data: { sensor },
            message: 'Sensor registered successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get user's sensors
exports.getSensors = async (req, res, next) => {
    try {
        const sensors = await Sensor.find({ userId: req.userId, isActive: true });

        res.json({
            success: true,
            data: { sensors }
        });
    } catch (error) {
        next(error);
    }
};

// Get sensor by ID
exports.getSensorById = async (req, res, next) => {
    try {
        const sensor = await Sensor.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!sensor) {
            return res.status(404).json({
                success: false,
                error: 'NotFoundError',
                message: 'Sensor not found'
            });
        }

        res.json({
            success: true,
            data: { sensor }
        });
    } catch (error) {
        next(error);
    }
};

// Delete sensor
exports.deleteSensor = async (req, res, next) => {
    try {
        const sensor = await Sensor.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { isActive: false },
            { new: true }
        );

        if (!sensor) {
            return res.status(404).json({
                success: false,
                error: 'NotFoundError',
                message: 'Sensor not found'
            });
        }

        res.json({
            success: true,
            data: { sensor },
            message: 'Sensor deactivated successfully'
        });
    } catch (error) {
        next(error);
    }
};
