const crypto = require('crypto');

/**
 * Generate a random verification code
 * @param {number} length - Length of the code (default: 6)
 * @returns {string} - Random numeric code
 */
function generateVerificationCode(length = 6) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return crypto.randomInt(min, max).toString();
}

/**
 * Generate a secure random token
 * @param {number} bytes - Number of bytes (default: 32)
 * @returns {string} - Random hex string
 */
function generateToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex');
}

module.exports = {
    generateVerificationCode,
    generateToken
};
