const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');
const { generateVerificationCode } = require('../services/codeGenerator');
const { sendVerificationCode } = require('../services/emailService');
const jwt = require('jsonwebtoken');

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map();

/**
 * Check rate limit for email
 * @param {string} email - Email address
 * @returns {boolean} - Whether request is allowed
 */
function checkRateLimit(email) {
    const now = Date.now();
    const key = `email:${email}`;
    const limit = rateLimitStore.get(key) || { count: 0, resetAt: now + 60000 }; // 1 minute window

    if (now > limit.resetAt) {
        limit.count = 0;
        limit.resetAt = now + 60000;
    }

    if (limit.count >= 3) { // Max 3 requests per minute
        return false;
    }

    limit.count += 1;
    rateLimitStore.set(key, limit);
    return true;
}

/**
 * Send verification code to email
 * POST /api/auth/send-code
 */
exports.sendCode = async (req, res, next) => {
    try {
        const { email, language = 'en' } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'ValidationError',
                message: 'Email is required'
            });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'ValidationError',
                message: 'Invalid email format'
            });
        }

        // Check rate limit
        if (!checkRateLimit(email.toLowerCase())) {
            return res.status(429).json({
                success: false,
                error: 'RateLimitError',
                message: 'Too many requests. Please try again later.'
            });
        }

        // Invalidate any previous unused codes for this email
        await VerificationCode.updateMany(
            { email: email.toLowerCase(), used: false },
            { used: true }
        );

        // Generate new verification code
        const code = generateVerificationCode(6);
        const expiryMinutes = parseInt(process.env.VERIFICATION_CODE_EXPIRY || '600000') / 60000;
        const expiresAt = new Date(Date.now() + parseInt(process.env.VERIFICATION_CODE_EXPIRY || '600000'));

        // Save verification code
        await VerificationCode.create({
            email: email.toLowerCase(),
            code,
            expiresAt
        });

        // Send email
        await sendVerificationCode(email, code, language);

        res.json({
            success: true,
            message: 'Verification code sent to your email',
            data: {
                email: email.toLowerCase(),
                expiresIn: expiryMinutes * 60 // seconds
            }
        });
    } catch (error) {
        console.error('Send code error:', error);
        next(error);
    }
};

/**
 * Verify code and login/register user
 * POST /api/auth/verify-code
 */
exports.verifyCode = async (req, res, next) => {
    try {
        const { email, code, name, language = 'en' } = req.body;

        // Validate input
        if (!email || !code) {
            return res.status(400).json({
                success: false,
                error: 'ValidationError',
                message: 'Email and code are required'
            });
        }

        // Find the most recent valid verification code
        const verificationRecord = await VerificationCode.findOne({
            email: email.toLowerCase(),
            code,
            used: false,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        if (!verificationRecord) {
            return res.status(401).json({
                success: false,
                error: 'AuthenticationError',
                message: 'Invalid or expired verification code'
            });
        }

        // Check if code is still valid
        if (!verificationRecord.isValid()) {
            return res.status(401).json({
                success: false,
                error: 'AuthenticationError',
                message: 'Verification code has expired or reached maximum attempts'
            });
        }

        // Mark code as used
        verificationRecord.used = true;
        await verificationRecord.save();

        // Find or create user
        let user = await User.findOne({ email: email.toLowerCase(), authProvider: 'email' });
        let isNewUser = false;

        if (!user) {
            // Create new user
            if (!name) {
                return res.status(400).json({
                    success: false,
                    error: 'ValidationError',
                    message: 'Name is required for new users'
                });
            }

            user = await User.create({
                email: email.toLowerCase(),
                name,
                language,
                authProvider: 'email',
                emailVerified: true
            });
            isNewUser = true;
        } else {
            // Update email verified status
            if (!user.emailVerified) {
                user.emailVerified = true;
                await user.save();
            }
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
                    name: user.name,
                    language: user.language,
                    authProvider: user.authProvider,
                    emailVerified: user.emailVerified
                },
                isNewUser
            },
            message: isNewUser ? 'Registration successful' : 'Login successful'
        });
    } catch (error) {
        console.error('Verify code error:', error);
        next(error);
    }
};
