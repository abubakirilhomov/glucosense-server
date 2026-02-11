const User = require('../models/User');
const { verifyIdToken } = require('../config/firebaseConfig');
const jwt = require('jsonwebtoken');

/**
 * Authenticate user with Firebase token (Google/Apple login)
 * POST /api/auth/firebase
 */
exports.firebaseAuth = async (req, res, next) => {
    try {
        const { idToken, language = 'en' } = req.body;

        // Validate input
        if (!idToken) {
            return res.status(400).json({
                success: false,
                error: 'ValidationError',
                message: 'Firebase ID token is required'
            });
        }

        // Verify Firebase token
        let decodedToken;
        try {
            decodedToken = await verifyIdToken(idToken);
        } catch (error) {
            return res.status(401).json({
                success: false,
                error: 'AuthenticationError',
                message: 'Invalid Firebase token'
            });
        }

        const { uid, email, name, picture, firebase } = decodedToken;

        // Determine auth provider
        let authProvider = 'google'; // default
        if (firebase.sign_in_provider === 'apple.com') {
            authProvider = 'apple';
        } else if (firebase.sign_in_provider === 'facebook.com') {
            authProvider = 'facebook';
        }

        // Check if user already exists
        let user = await User.findOne({ firebaseUid: uid });
        let isNewUser = false;

        if (!user) {
            // Check if email is already registered with different provider
            const existingEmailUser = await User.findOne({ email: email?.toLowerCase() });

            if (existingEmailUser) {
                return res.status(400).json({
                    success: false,
                    error: 'ValidationError',
                    message: `This email is already registered with ${existingEmailUser.authProvider} authentication. Please use ${existingEmailUser.authProvider} to login.`
                });
            }

            // Create new user
            user = await User.create({
                email: email?.toLowerCase(),
                name: name || 'User',
                language,
                authProvider,
                firebaseUid: uid,
                emailVerified: decodedToken.email_verified || false,
                profilePhoto: picture
            });
            isNewUser = true;
        } else {
            // Update user info if changed
            let updated = false;

            if (email && user.email !== email.toLowerCase()) {
                user.email = email.toLowerCase();
                updated = true;
            }

            if (name && user.name !== name) {
                user.name = name;
                updated = true;
            }

            if (picture && user.profilePhoto !== picture) {
                user.profilePhoto = picture;
                updated = true;
            }

            if (decodedToken.email_verified && !user.emailVerified) {
                user.emailVerified = true;
                updated = true;
            }

            if (updated) {
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
                    emailVerified: user.emailVerified,
                    profilePhoto: user.profilePhoto
                },
                isNewUser
            },
            message: isNewUser ? 'Registration successful' : 'Login successful'
        });
    } catch (error) {
        console.error('Firebase auth error:', error);
        next(error);
    }
};

/**
 * Link Firebase account to existing email account
 * POST /api/auth/link-firebase
 */
exports.linkFirebase = async (req, res, next) => {
    try {
        const { idToken } = req.body;
        const userId = req.userId; // From JWT middleware

        if (!idToken) {
            return res.status(400).json({
                success: false,
                error: 'ValidationError',
                message: 'Firebase ID token is required'
            });
        }

        // Verify Firebase token
        const decodedToken = await verifyIdToken(idToken);
        const { uid } = decodedToken;

        // Check if Firebase UID is already linked to another account
        const existingFirebaseUser = await User.findOne({ firebaseUid: uid });
        if (existingFirebaseUser && existingFirebaseUser._id.toString() !== userId) {
            return res.status(400).json({
                success: false,
                error: 'ValidationError',
                message: 'This Firebase account is already linked to another user'
            });
        }

        // Update user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'NotFoundError',
                message: 'User not found'
            });
        }

        user.firebaseUid = uid;
        user.emailVerified = decodedToken.email_verified || user.emailVerified;
        await user.save();

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    firebaseUid: user.firebaseUid,
                    emailVerified: user.emailVerified
                }
            },
            message: 'Firebase account linked successfully'
        });
    } catch (error) {
        console.error('Link Firebase error:', error);
        next(error);
    }
};
