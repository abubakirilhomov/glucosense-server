# GlucoSense Backend - Required Environment Variables

This is a quick reference of all environment variables you need to configure.
For detailed setup instructions, see ENV_SETUP_GUIDE.md

## Copy This Template to Your .env File

```bash
# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=5000
NODE_ENV=development

# ============================================
# DATABASE
# ============================================
MONGODB_URI=mongodb://localhost:27017/glucosense

# ============================================
# JWT AUTHENTICATION
# ============================================
# Generate a secure secret: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=REPLACE_WITH_YOUR_SECURE_SECRET_KEY

# ============================================
# CORS (Optional)
# ============================================
ALLOWED_ORIGINS=http://localhost:3000,exp://192.168.1.100:8081

# ============================================
# EMAIL CONFIGURATION
# ============================================

# --- Choose Your Email Provider ---
# Options: gmail, sendgrid, smtp
EMAIL_PROVIDER=gmail

# --- Gmail Setup (if using gmail) ---
# 1. Enable 2FA: https://myaccount.google.com/security
# 2. Generate App Password: https://myaccount.google.com/apppasswords
GMAIL_USER=YOUR_GMAIL_ADDRESS@gmail.com
GMAIL_APP_PASSWORD=YOUR_16_CHAR_APP_PASSWORD

# --- SendGrid Setup (if using sendgrid) ---
# Get API key from: https://app.sendgrid.com/settings/api_keys
# SENDGRID_API_KEY=SG.YOUR_SENDGRID_API_KEY

# --- Custom SMTP Setup (if using smtp) ---
# SMTP_HOST=smtp.your-provider.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-smtp-username
# SMTP_PASSWORD=your-smtp-password

# --- Email Settings ---
EMAIL_FROM=YOUR_GMAIL_ADDRESS@gmail.com
EMAIL_FROM_NAME=GlucoSense

# --- Verification Code Settings ---
VERIFICATION_CODE_EXPIRY=600000
VERIFICATION_CODE_LENGTH=6

# ============================================
# FIREBASE CONFIGURATION
# ============================================

# --- Option 1: Service Account File (Recommended) ---
# 1. Go to Firebase Console > Project Settings > Service Accounts
# 2. Click "Generate New Private Key"
# 3. Save as ./config/firebase-service-account.json
# 4. Uncomment the line below:
# FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json

# --- Option 2: Individual Variables (For Deployment Platforms) ---
# Get these from your Firebase service account JSON file:
FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@YOUR_PROJECT_ID.iam.gserviceaccount.com
# Copy the entire private key, keep \\n for line breaks, wrap in quotes:
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY_HERE\\n-----END PRIVATE KEY-----\\n"
```

---

## What You Need to Do

### 1. Email Setup (Choose ONE)

#### Option A: Gmail (Easiest for development)
✅ **Steps:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to https://myaccount.google.com/apppasswords
4. Generate an app password for "Mail"
5. Copy the 16-character password
6. Fill in `GMAIL_USER` and `GMAIL_APP_PASSWORD` above

#### Option B: SendGrid (Best for production)
✅ **Steps:**
1. Sign up at https://sendgrid.com
2. Go to Settings > API Keys
3. Create new API key with "Mail Send" permission
4. Copy the API key
5. Uncomment and fill in `SENDGRID_API_KEY` above

### 2. Firebase Setup

✅ **Steps:**
1. Go to https://console.firebase.google.com
2. Open your project (or create one)
3. Go to Project Settings (gear icon) > Service Accounts
4. Click "Generate New Private Key"
5. Download the JSON file

**Then choose ONE option:**

**Option A (Easier):**
- Save the JSON file as `./config/firebase-service-account.json`
- Uncomment `FIREBASE_SERVICE_ACCOUNT_PATH` line above

**Option B (For deployment):**
- Open the JSON file
- Copy `project_id` to `FIREBASE_PROJECT_ID`
- Copy `client_email` to `FIREBASE_CLIENT_EMAIL`
- Copy `private_key` to `FIREBASE_PRIVATE_KEY` (keep the quotes and `\n`)

### 3. Enable Authentication Methods in Firebase

✅ **Steps:**
1. In Firebase Console, go to Build > Authentication
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Google"
5. Enable "Apple" (if needed)

### 4. MongoDB (if not already running)

✅ **For local development:**
- Install MongoDB or use MongoDB Atlas
- Update `MONGODB_URI` if needed

### 5. Generate JWT Secret

✅ **Run this command:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and paste it as `JWT_SECRET`

---

## Verify Your Setup

After configuring, test that everything works:

```bash
# Start the server
npm run dev

# Test email (replace with your email)
curl -X POST http://localhost:5000/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com"}'

# Check your email for the code!
```

---

## Checklist

- [ ] Created `.env` file from template above
- [ ] Configured email provider (Gmail or SendGrid)
- [ ] Set up Firebase credentials
- [ ] Generated and set JWT_SECRET
- [ ] Configured MongoDB URI
- [ ] Tested email sending
- [ ] Enabled Google/Apple auth in Firebase Console

---

## Need Help?

- **Detailed setup guide**: See [ENV_SETUP_GUIDE.md](file:///Users/rpg/Desktop/glucosense2/GlucoSense-Backend/ENV_SETUP_GUIDE.md)
- **Troubleshooting**: Check server logs when running `npm run dev`
- **Firebase docs**: https://firebase.google.com/docs/admin/setup
- **Nodemailer docs**: https://nodemailer.com/
