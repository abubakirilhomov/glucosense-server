require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Initialize Firebase Admin (if configured)
const { initializeFirebase } = require('./config/firebaseConfig');
initializeFirebase();

// Import routes
const authRoutes = require('./routes/authRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const readingRoutes = require('./routes/readingRoutes');
const insulinRoutes = require('./routes/insulinRoutes');
const carbRoutes = require('./routes/carbRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/insulin', insulinRoutes);
app.use('/api/carbs', carbRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

// Error handler (must be last)
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    });

module.exports = app;
