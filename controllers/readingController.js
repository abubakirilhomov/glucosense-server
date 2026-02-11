const GlucoseReading = require('../models/GlucoseReading');

// Helper function to determine glucose status
const getGlucoseStatus = (value) => {
    if (value < 3.9) return 'low';
    if (value > 7.0) return 'high';
    return 'normal';
};

// Create reading
exports.createReading = async (req, res, next) => {
    try {
        const { value, timestamp, sensorId } = req.body;

        if (value === undefined || !timestamp) {
            return res.status(400).json({
                success: false,
                error: 'ValidationError',
                message: 'value and timestamp are required'
            });
        }

        const status = getGlucoseStatus(value);

        const reading = await GlucoseReading.create({
            userId: req.userId,
            sensorId: sensorId || null,
            value,
            timestamp: new Date(timestamp),
            status
        });

        res.status(201).json({
            success: true,
            data: { reading },
            message: 'Reading added successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get readings with optional date range
exports.getReadings = async (req, res, next) => {
    try {
        const { startDate, endDate, limit = 100 } = req.query;

        const query = { userId: req.userId };

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const readings = await GlucoseReading.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: { readings }
        });
    } catch (error) {
        next(error);
    }
};

// Get latest reading
exports.getLatestReading = async (req, res, next) => {
    try {
        const reading = await GlucoseReading.findOne({ userId: req.userId })
            .sort({ timestamp: -1 });

        if (!reading) {
            return res.status(404).json({
                success: false,
                error: 'NotFoundError',
                message: 'No readings found'
            });
        }

        res.json({
            success: true,
            data: { reading }
        });
    } catch (error) {
        next(error);
    }
};

// Get chart data (last 24 hours)
exports.getChartData = async (req, res, next) => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const readings = await GlucoseReading.find({
            userId: req.userId,
            timestamp: { $gte: twentyFourHoursAgo }
        }).sort({ timestamp: 1 });

        // Format for chart
        const chartData = readings.map(r => ({
            value: r.value,
            timestamp: r.timestamp
        }));

        res.json({
            success: true,
            data: { chartData }
        });
    } catch (error) {
        next(error);
    }
};
