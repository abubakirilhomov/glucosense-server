const nodemailer = require('nodemailer');

/**
 * Create email transporter based on provider
 */
function createTransporter() {
    const provider = process.env.EMAIL_PROVIDER || 'gmail';

    switch (provider.toLowerCase()) {
        case 'gmail':
            return nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_APP_PASSWORD
                }
            });

        case 'sendgrid':
            return nodemailer.createTransport({
                host: 'smtp.sendgrid.net',
                port: 587,
                auth: {
                    user: 'apikey',
                    pass: process.env.SENDGRID_API_KEY
                }
            });

        case 'smtp':
            return nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                }
            });

        default:
            throw new Error(`Unsupported email provider: ${provider}`);
    }
}

let transporter = null;

/**
 * Get or create email transporter
 */
function getTransporter() {
    if (!transporter) {
        transporter = createTransporter();
    }
    return transporter;
}

/**
 * Send verification code email
 * @param {string} email - Recipient email address
 * @param {string} code - Verification code
 * @param {string} language - Language preference (uz, ru, en)
 */
async function sendVerificationCode(email, code, language = 'en') {
    const subjects = {
        uz: 'GlucoSense - Tasdiqlash kodi',
        ru: 'GlucoSense - Код подтверждения',
        en: 'GlucoSense - Verification Code'
    };

    const messages = {
        uz: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #3b82f6; margin: 0;">💧 GlucoSense</h1>
                </div>
                <div style="background-color: #f8fafc; border-radius: 10px; padding: 30px; text-align: center;">
                    <h2 style="color: #334155; margin-top: 0;">Tasdiqlash kodi</h2>
                    <p style="color: #64748b; font-size: 16px; margin: 20px 0;">
                        Tizimga kirish uchun quyidagi kodni kiriting:
                    </p>
                    <div style="background-color: white; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 8px;">
                            ${code}
                        </span>
                    </div>
                    <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">
                        Bu kod 10 daqiqa amal qiladi
                    </p>
                </div>
                <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
                    Agar siz bu kodni so'ramagan bo'lsangiz, bu xabarni e'tiborsiz qoldiring.
                </p>
            </div>
        `,
        ru: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #3b82f6; margin: 0;">💧 GlucoSense</h1>
                </div>
                <div style="background-color: #f8fafc; border-radius: 10px; padding: 30px; text-align: center;">
                    <h2 style="color: #334155; margin-top: 0;">Код подтверждения</h2>
                    <p style="color: #64748b; font-size: 16px; margin: 20px 0;">
                        Введите следующий код для входа в систему:
                    </p>
                    <div style="background-color: white; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 8px;">
                            ${code}
                        </span>
                    </div>
                    <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">
                        Код действителен в течение 10 минут
                    </p>
                </div>
                <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
                    Если вы не запрашивали этот код, проигнорируйте это сообщение.
                </p>
            </div>
        `,
        en: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #3b82f6; margin: 0;">💧 GlucoSense</h1>
                </div>
                <div style="background-color: #f8fafc; border-radius: 10px; padding: 30px; text-align: center;">
                    <h2 style="color: #334155; margin-top: 0;">Verification Code</h2>
                    <p style="color: #64748b; font-size: 16px; margin: 20px 0;">
                        Enter the following code to sign in:
                    </p>
                    <div style="background-color: white; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 8px;">
                            ${code}
                        </span>
                    </div>
                    <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">
                        This code will expire in 10 minutes
                    </p>
                </div>
                <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
                    If you didn't request this code, please ignore this message.
                </p>
            </div>
        `
    };

    const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME || 'GlucoSense'} <${process.env.EMAIL_FROM || process.env.GMAIL_USER}>`,
        to: email,
        subject: subjects[language] || subjects.en,
        html: messages[language] || messages.en
    };

    try {
        const info = await getTransporter().sendMail(mailOptions);
        console.log('Verification email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
    }
}

/**
 * Send welcome email to new users
 * @param {string} email - Recipient email address
 * @param {string} name - User's name
 * @param {string} language - Language preference
 */
async function sendWelcomeEmail(email, name, language = 'en') {
    const subjects = {
        uz: 'GlucoSense\'ga xush kelibsiz!',
        ru: 'Добро пожаловать в GlucoSense!',
        en: 'Welcome to GlucoSense!'
    };

    const messages = {
        uz: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #3b82f6;">💧 GlucoSense</h1>
                <h2>Salom, ${name}!</h2>
                <p>GlucoSense'ga xush kelibsiz. Glyukoza darajasini kuzatishni boshlashingiz mumkin.</p>
            </div>
        `,
        ru: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #3b82f6;">💧 GlucoSense</h1>
                <h2>Привет, ${name}!</h2>
                <p>Добро пожаловать в GlucoSense. Вы можете начать отслеживать уровень глюкозы.</p>
            </div>
        `,
        en: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #3b82f6;">💧 GlucoSense</h1>
                <h2>Hello, ${name}!</h2>
                <p>Welcome to GlucoSense. You can now start tracking your glucose levels.</p>
            </div>
        `
    };

    const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME || 'GlucoSense'} <${process.env.EMAIL_FROM || process.env.GMAIL_USER}>`,
        to: email,
        subject: subjects[language] || subjects.en,
        html: messages[language] || messages.en
    };

    try {
        const info = await getTransporter().sendMail(mailOptions);
        console.log('Welcome email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        // Don't throw error for welcome email, it's not critical
        return { success: false, error: error.message };
    }
}

module.exports = {
    sendVerificationCode,
    sendWelcomeEmail
};
