# Vercel Deployment Checklist

## Step 1: Prepare Your Repository ✅

- [x] All API files in `/api/` folder:
  - unsubscribe.js (Unsubscribe from newsletter)
  - newsletter.py (Subscribe to newsletter)
  - send-newsletter.js (Weekly email scheduler)
  - send-email.js (SMTP email delivery)
  - track-visitor.js (Visitor analytics)

- [x] vercel.json configured with:
  - Cron job: Monday 9 AM UTC
  - Security headers (CSP, HSTS)
  - Redirects & rewrites

- [x] .env.example created with all required variables

## Step 2: Set Up Supabase

1. Go to https://supabase.com/dashboard
2. Create a project or use existing
3. Go to **Project Settings > API**
4. Copy these values:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Server-side only!)

5. Create table for newsletter subscribers:
```sql
CREATE TABLE newsletter_submissions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE newsletter_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  sent_at TIMESTAMP DEFAULT NOW(),
  recipient_count INT,
  success_count INT,
  failed_count INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Step 3: Set Up Email Delivery (Choose One)

### Option A: Gmail (Recommended for Testing)
1. Enable 2-Factor Authentication: https://myaccount.google.com/security
2. Create App Password: https://myaccount.google.com/apppasswords
3. For Vercel:
   - `SMTP_HOST` = `smtp.gmail.com`
   - `SMTP_PORT` = `587`
   - `SMTP_USERNAME` = your gmail
   - `SMTP_PASSWORD` = app password (NOT your account password)

### Option B: SendGrid (Production)
1. Go to https://sendgrid.com/
2. Create account and verify sender
3. Get API key from Settings > API Keys
4. For Vercel:
   - `SMTP_HOST` = `smtp.sendgrid.net`
   - `SMTP_PORT` = `587`
   - `SMTP_USERNAME` = `apikey`
   - `SMTP_PASSWORD` = your SendGrid API key

### Option C: Mailgun
1. Go to https://www.mailgun.com/
2. Create account and add domain
3. Get SMTP credentials
4. Configure similar to SendGrid

## Step 4: Generate Security Token

Open terminal and run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output → `CRON_SECRET`

## Step 5: Deploy to Vercel

### Method 1: Via Git Integration (Easiest)

1. Push your code to GitHub:
```bash
git add .
git commit -m "Add unsubscribe API and email configuration"
git push origin main
```

2. Go to https://vercel.com/dashboard
3. Click **"Add New" > "Project"**
4. Select your GitHub repository
5. Click **"Import"**
6. Wait for import to complete

### Method 2: Via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow prompts to link your project

### Method 3: Manual Upload in Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **"Deployments"** tab
4. Click **"New Deployment"**
5. Upload your project folder

## Step 6: Add Environment Variables

1. Go to your Vercel project dashboard
2. Click **"Settings"**
3. Go to **"Environment Variables"**
4. Add each variable:

```
SUPABASE_URL = (your value)
SUPABASE_SERVICE_ROLE_KEY = (your value)
SMTP_HOST = smtp.gmail.com (or your provider)
SMTP_PORT = 587
SMTP_USERNAME = your_email@gmail.com
SMTP_PASSWORD = your_app_password
SMTP_USE_TLS = true
NEWSLETTER_FROM_EMAIL = AIToolsCenter <noreply@aitoolscenter.in>
NEWSLETTER_REPLY_TO_EMAIL = support@aitoolscenter.in
SITE_URL = https://www.aitoolscenter.in
CRON_SECRET = (your generated secret)
```

5. Click **"Save"**
6. **IMPORTANT:** Redeploy after adding variables
   - Go to **"Deployments"**
   - Click on the latest deployment
   - Click **"Redeploy"** button

## Step 7: Test Your API Endpoints

After deployment, test these endpoints:

### Test Unsubscribe Endpoint
```bash
curl -X POST https://www.aitoolscenter.in/api/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Expected responses:
- **Success (email exists):** `{ "success": true, "message": "Successfully unsubscribed..." }`
- **Error (email not found):** `{ "error": "Email not found in newsletter subscriber list" }`

### Test Newsletter Endpoint
```bash
curl -X POST https://www.aitoolscenter.in/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com"}'
```

### Test Email Endpoint
```bash
curl -X POST https://www.aitoolscenter.in/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<p>This is a test email</p>",
    "fromEmail": "noreply@aitoolscenter.in",
    "fromName": "AIToolsCenter"
  }'
```

## Step 8: Monitor Deployment

1. Go to **"Deployments"** tab
2. Click on latest deployment
3. Check **"Functions"** to see API endpoints
4. Check **"Logs"** to debug any errors
5. Check **"Monitoring"** for performance metrics

## Troubleshooting

### Issue: 404 Not Found on /api/unsubscribe

**Solution:**
1. Check that `unsubscribe.js` exists in `/api/` folder
2. Go to Vercel dashboard > Deployments > Latest
3. Go to Functions tab - should list `unsubscribe`
4. If not listed, redeploy: Click deployment > Redeploy

### Issue: 500 Error - Missing Environment Variables

**Solution:**
1. Check Vercel Settings > Environment Variables
2. Verify all required variables are set
3. Make sure values don't have extra spaces
4. Redeploy: Deployments > Latest > Redeploy

### Issue: Email Not Sending

**Solution:**
1. Verify SMTP credentials in Environment Variables
2. For Gmail: Make sure App Password (not account password) is used
3. Check Supabase: Verify newsletter_submissions table exists
4. Check Vercel Logs: Deployments > Latest > Runtime Logs

### Issue: Cron Job Not Running

**Solution:**
1. Open Vercel dashboard
2. Check Function Runs: Deployments > Latest > Function Runs
3. Look for `/api/send-newsletter` in the list
4. If errors shown, check:
   - CRON_SECRET is set correctly
   - Supabase credentials valid
   - SMTP settings correct

## API Endpoint Reference

After deployment, all endpoints available at:

```
POST https://www.aitoolscenter.in/api/newsletter
POST https://www.aitoolscenter.in/api/unsubscribe
POST https://www.aitoolscenter.in/api/send-email
POST https://www.aitoolscenter.in/api/send-newsletter (Cron - automatic)
POST https://www.aitoolscenter.in/api/track-visitor
```

## Next Steps After Deployment

1. ✅ Test all API endpoints (see Step 7)
2. ✅ Send test newsletter to yourself
3. ✅ Test unsubscribe from newsletter email
4. ✅ Verify cron job runs Monday at 9 AM UTC
5. ✅ Check Vercel Analytics dashboard
6. ✅ Monitor logs for errors

## Support

- **Vercel Docs:** https://vercel.com/docs/concepts/functions/serverless-functions
- **Supabase Docs:** https://supabase.com/docs
- **SendGrid Docs:** https://sendgrid.com/docs
- **Gmail App Passwords:** https://support.google.com/accounts/answer/185833

---

**Need help?** Check VERCEL_SETUP.md or contact support@aitoolscenter.in
