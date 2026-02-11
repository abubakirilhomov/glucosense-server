# GlucoSense Backend - Environment Variables Setup Guide

This guide explains how to configure all required environment variables for the GlucoSense backend.

## Quick Start

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the required values as described below.

## Required Variables

### Server Configuration

```bash
PORT=5000
NODE_ENV=development  # Use 'production' in production
```

### Database

```bash
MONGODB_URI=mongodb://localhost:27017/glucosense
```

For MongoDB Atlas (cloud):
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/glucosense
```

### JWT Secret

```bash
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

Generate a secure random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### CORS (Optional)

```bash
ALLOWED_ORIGINS=http://localhost:3000,exp://192.168.1.100:8081
```

---

## Email Configuration

### Step 1: Choose Your Email Provider

Set `EMAIL_PROVIDER` to one of: `gmail`, `sendgrid`, or `smtp`

```bash
EMAIL_PROVIDER=gmail
```

### Step 2: Configure Based on Provider

#### Option A: Gmail (Recommended for Development)

1. **Enable 2-Step Verification** on your Google Account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "GlucoSense Backend"
   - Copy the 16-character password

3. **Set Environment Variables**:
   ```bash
   EMAIL_PROVIDER=gmail
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=abcd-efgh-ijkl-mnop  # 16-character app password
   EMAIL_FROM=your-email@gmail.com
   EMAIL_FROM_NAME=GlucoSense
   ```

#### Option B: SendGrid (Recommended for Production)

1. **Create SendGrid Account**:
   - Sign up at https://sendgrid.com

2. **Create API Key**:
   - Go to Settings > API Keys
   - Click "Create API Key"
   - Select "Full Access" or "Mail Send" permission
   - Copy the API key

3. **Verify Sender Email**:
   - Go to Settings > Sender Authentication
   - Verify your sender email

4. **Set Environment Variables**:
   ```bash
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   EMAIL_FROM=verified-email@yourdomain.com
   EMAIL_FROM_NAME=GlucoSense
   ```

#### Option C: Custom SMTP

```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false  # Use 'true' for port 465
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=GlucoSense
```

### Email Settings

```bash
VERIFICATION_CODE_EXPIRY=600000  # 10 minutes in milliseconds
VERIFICATION_CODE_LENGTH=6       # Length of verification code
```

---

## Firebase Configuration

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Follow the setup wizard
4. Enable Authentication:
   - Go to Build > Authentication
   - Click "Get started"
   - Enable "Google" and/or "Apple" sign-in methods

### Step 2: Get Service Account Credentials

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Click on **Service Accounts** tab
3. Click **Generate New Private Key**
4. Download the JSON file
5. Save it as `firebase-service-account.json` in the `config/` folder

### Step 3: Configure Environment Variables

#### Option A: Using Service Account File (Recommended)

```bash
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
```

**Important**: Add the JSON file to `.gitignore` to keep it secure!

#### Option B: Using Environment Variables (for deployment platforms like Heroku, Vercel)

Open the downloaded JSON file and extract:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
```

**Important Notes**:
- Keep the entire private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- In `.env` file, replace actual line breaks with `\n`
- Wrap the key in quotes
- On some platforms (like Heroku), you might need to use single quotes

### Step 4: Configure Mobile App

In your Expo app (`GlucoSense-Restart`), you'll need to add Firebase configuration:

1. In Firebase Console, go to Project Settings
2. Under "Your apps", click on iOS or Android icon
3. Follow the setup instructions to download:
   - `GoogleService-Info.plist` for iOS
   - `google-services.json` for Android

---

## Complete .env Example

Here's a complete example with all variables:

```bash
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/glucosense

# JWT
JWT_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz

# CORS
ALLOWED_ORIGINS=http://localhost:3000,exp://192.168.1.100:8081

# Email (Gmail Example)
EMAIL_PROVIDER=gmail
GMAIL_USER=glucosense@gmail.com
GMAIL_APP_PASSWORD=abcd-efgh-ijkl-mnop
EMAIL_FROM=glucosense@gmail.com
EMAIL_FROM_NAME=GlucoSense
VERIFICATION_CODE_EXPIRY=600000
VERIFICATION_CODE_LENGTH=6

# Firebase
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
```

---

## Testing Your Configuration

### Test Email Sending

```bash
curl -X POST http://localhost:5000/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@gmail.com","language":"en"}'
```

You should receive:
- Success response from API
- Email with 6-digit code in your inbox

### Test Firebase Authentication

1. Get an ID token from Firebase in your mobile app
2. Test the endpoint:

```bash
curl -X POST http://localhost:5000/api/auth/firebase \
  -H "Content-Type: application/json" \
  -d '{"idToken":"YOUR_FIREBASE_ID_TOKEN","language":"en"}'
```

---

## Security Best Practices

1. **Never commit `.env` to git**
   - Ensure `.env` is in `.gitignore`
   - Use `.env.example` for documentation only

2. **Use strong JWT secrets**
   - Generate random, at least 32 characters
   - Different secret for dev/staging/production

3. **Protect Firebase credentials**
   - Never expose service account JSON publicly
   - Use environment variables in production
   - Rotate keys if compromised

4. **Email security**
   - Use app-specific passwords for Gmail
   - Rotate SendGrid API keys regularly
   - Use verified sender domains

5. **Production checklist**
   - Set `NODE_ENV=production`
   - Use strong, unique secrets
   - Enable HTTPS only
   - Set up proper CORS origins
   - Monitor failed authentication attempts

---

## Troubleshooting

### Email not sending?

1. Check email provider credentials
2. For Gmail: Ensure 2FA is enabled and app password is correct
3. Check spam folder
4. Review server logs for detailed error messages

### Firebase authentication failing?

1. Verify service account credentials are correct
2. Check that authentication methods are enabled in Firebase Console
3. Ensure mobile app is using correct Firebase configuration
4. Check server logs for Firebase initialization errors

### MongoDB connection issues?

1. Ensure MongoDB is running locally
2. Check connection string format
3. For Atlas: Whitelist your IP address
4. Verify username/password are correct

---

## Support

For issues or questions:
1. Check server logs: `npm run dev`
2. Review Firebase Console logs
3. Test endpoints with curl or Postman
4. Ensure all dependencies are installed: `npm install`
