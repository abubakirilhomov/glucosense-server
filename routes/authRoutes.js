const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const emailAuthController = require('../controllers/emailAuthController');
const firebaseAuthController = require('../controllers/firebaseAuthController');
const verifyJWT = require('../middleware/verifyJWT');

// Traditional email + password authentication (backward compatibility)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Email verification code authentication (for mobile app)
router.post('/send-code', emailAuthController.sendCode);
router.post('/verify-code', emailAuthController.verifyCode);

// Firebase authentication (Google, Apple, etc.)
router.post('/firebase', firebaseAuthController.firebaseAuth);
router.post('/link-firebase', verifyJWT, firebaseAuthController.linkFirebase);

// User info
router.get('/me', verifyJWT, authController.getMe);
router.patch('/profile', verifyJWT, authController.updateProfile);

module.exports = router;
