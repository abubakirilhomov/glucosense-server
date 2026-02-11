const admin = require('firebase-admin');

let firebaseApp = null;

/**
 * Initialize Firebase Admin SDK
 */
function initializeFirebase() {
    if (firebaseApp) {
        return firebaseApp;
    }

    try {
        // Option 1: Using service account file
        if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
            const path = require('path');
            // Resolve path relative to project root (one level up from config folder)
            const serviceAccountPath = path.resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
            const serviceAccount = require(serviceAccountPath);
            firebaseApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('✅ Firebase Admin initialized with service account file');
            return firebaseApp;
        }

        // Option 2: Using individual environment variables
        if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
            // Replace escaped newlines in private key
            const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

            firebaseApp = admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    privateKey: privateKey,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
                })
            });
            console.log('Firebase Admin initialized with environment variables');
            return firebaseApp;
        }

        console.warn('Firebase credentials not configured. Firebase authentication will not work.');
        return null;
    } catch (error) {
        console.error('Error initializing Firebase Admin:', error.message);
        return null;
    }
}

/**
 * Verify Firebase ID token
 * @param {string} idToken - Firebase ID token from client
 * @returns {Promise<object>} - Decoded token with user info
 */
async function verifyIdToken(idToken) {
    if (!firebaseApp) {
        initializeFirebase();
    }

    if (!firebaseApp) {
        throw new Error('Firebase is not configured');
    }

    try {
        // Try Firebase ID token verification first
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        console.log('Firebase token verification failed, trying Google OAuth verification...');

        // Fallback: verify as Google OAuth ID token
        try {
            const { OAuth2Client } = require('google-auth-library');
            const client = new OAuth2Client();

            // Verify the token (accepts both Web and iOS Client IDs)
            const ticket = await client.verifyIdToken({
                idToken: idToken,
                // Accept tokens from both Web and iOS Client IDs
                audience: [
                    '753340872781-u3hmdvci0op6us0bdv155j1n4p2ljdiu.apps.googleusercontent.com', // Web Client ID
                    '753340872781-2crdo0ui1162desgr5b4cuh0tvgq4bkh.apps.googleusercontent.com'  // iOS Client ID
                ]
            });

            const payload = ticket.getPayload();

            // Transform to Firebase token format for compatibility
            return {
                uid: payload.sub,
                email: payload.email,
                email_verified: payload.email_verified,
                name: payload.name,
                picture: payload.picture,
                firebase: {
                    sign_in_provider: 'google.com',
                    identities: {
                        'google.com': [payload.sub],
                        email: [payload.email]
                    }
                }
            };
        } catch (googleError) {
            console.error('Google OAuth token verification also failed:', googleError.message);
            throw new Error('Invalid Firebase token');
        }
    }
}

/**
 * Get user by Firebase UID
 * @param {string} uid - Firebase UID
 * @returns {Promise<object>} - Firebase user record
 */
async function getUserByUid(uid) {
    if (!firebaseApp) {
        initializeFirebase();
    }

    if (!firebaseApp) {
        throw new Error('Firebase is not configured');
    }

    try {
        const userRecord = await admin.auth().getUser(uid);
        return userRecord;
    } catch (error) {
        console.error('Error fetching user from Firebase:', error.message);
        throw new Error('Firebase user not found');
    }
}

module.exports = {
    initializeFirebase,
    verifyIdToken,
    getUserByUid,
    admin
};
