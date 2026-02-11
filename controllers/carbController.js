const CarbLog = require('../models/CarbLog');

// Create carb log
exports.createCarbLog = async (req, res, next) => {
    try {
        const { amount, mealType, timestamp, notes } = req.body;

        if (!amount || !timestamp) {
            return res.status(400).json({
                success: false,
                error: 'ValidationError',
                message: 'amount and timestamp are required'
            });
        }

        const log = await CarbLog.create({
            userId: req.userId,
            amount,
            mealType,
            timestamp: new Date(timestamp),
            notes
        });

        res.status(201).json({
            success: true,
            data: { log },
            message: 'Carb log added successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get carb logs
exports.getCarbLogs = async (req, res, next) => {
    try {
        const { startDate, endDate, limit = 100 } = req.query;

        const query = { userId: req.userId };

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const logs = await CarbLog.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: { logs }
        });
    } catch (error) {
        next(error);
    }
};

// Delete carb log
exports.deleteCarbLog = async (req, res, next) => {
    try {
        const log = await CarbLog.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!log) {
            return res.status(404).json({
                success: false,
                error: 'NotFoundError',
                message: 'Carb log not found'
            });
        }

        res.json({
            success: true,
            message: 'Carb log deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
