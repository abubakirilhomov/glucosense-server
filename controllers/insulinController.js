const InsulinLog = require('../models/InsulinLog');

// Create insulin log
exports.createInsulinLog = async (req, res, next) => {
    try {
        const { amount, type, timestamp, notes } = req.body;

        if (!amount || !type || !timestamp) {
            return res.status(400).json({
                success: false,
                error: 'ValidationError',
                message: 'amount, type, and timestamp are required'
            });
        }

        const log = await InsulinLog.create({
            userId: req.userId,
            amount,
            type,
            timestamp: new Date(timestamp),
            notes
        });

        res.status(201).json({
            success: true,
            data: { log },
            message: 'Insulin log added successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get insulin logs
exports.getInsulinLogs = async (req, res, next) => {
    try {
        const { startDate, endDate, limit = 100 } = req.query;

        const query = { userId: req.userId };

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        const logs = await InsulinLog.find(query)
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

// Delete insulin log
exports.deleteInsulinLog = async (req, res, next) => {
    try {
        const log = await InsulinLog.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!log) {
            return res.status(404).json({
                success: false,
                error: 'NotFoundError',
                message: 'Insulin log not found'
            });
        }

        res.json({
            success: true,
            message: 'Insulin log deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
