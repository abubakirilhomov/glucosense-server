const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register new user
exports.register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, dateOfBirth, language } = req.body;
        console.log(req.body)
        // Validate input
        if (!email || !password || !firstName || !lastName || !dateOfBirth) {
            return res.status(400).json({
                success: false,
                error: 'ValidationError',
                message: 'Email, password, firstName, lastName, and dateOfBirth are required'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'ValidationError',
                message: 'Email already registered'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            firstName,
            lastName,
            dateOfBirth: new Date(dateOfBirth),
            language: language || 'en'
        });

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            data: {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dateOfBirth: user.dateOfBirth,
                    age: user.age
                }
            },
            message: 'User registered successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Login user
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'ValidationError',
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'AuthenticationError',
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'AuthenticationError',
                message: 'Invalid email or password'
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dateOfBirth: user.dateOfBirth,
                    age: user.age
                }
            },
            message: 'Login successful'
        });
    } catch (error) {
        next(error);
    }
};

// Get current user
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'NotFoundError',
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dateOfBirth: user.dateOfBirth,
                    age: user.age,
                    language: user.language
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { dateOfBirth, firstName, lastName, language } = req.body;
        const userId = req.userId; // From auth middleware

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'NotFoundError',
                message: 'User not found'
            });
        }

        // Update fields if provided
        if (dateOfBirth) {
            user.dateOfBirth = new Date(dateOfBirth);
        }
        if (firstName) {
            user.firstName = firstName;
        }
        if (lastName) {
            user.lastName = lastName;
        }
        if (language) {
            user.language = language;
        }

        await user.save();

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dateOfBirth: user.dateOfBirth,
                    age: user.age,
                    language: user.language,
                    profilePhoto: user.profilePhoto
                }
            },
            message: 'Profile updated successfully'
        });
    } catch (error) {
        next(error);
    }
};
