# 🚀 Vercel Deployment - Quick Steps

## Your Repository
**GitHub:** https://github.com/jeetdevinder89/aitoolscenter

## DEPLOYMENT STEPS

### ✅ STEP 1: Connect to Vercel (2 minutes)

1. Go to **https://vercel.com**
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Verify your GitHub account
5. Click **"Authorize Vercel"**

Your repository should now be visible in Vercel.

---

### ✅ STEP 2: Import Your Project (1 minute)

1. In Vercel Dashboard, click **"Add New"** > **"Project"**
2. Search for **"aitoolscenter"** repository
3. Click **"Import"**
4. Click **"Deploy"** (use default settings)

**Wait for deployment to complete** (takes ~2-3 minutes)

---

### ✅ STEP 3: Add Environment Variables (3 minutes)

After deployment succeeds:

1. Go to your Vercel project dashboard
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in left menu
4. Add each variable below:

#### **Option A: Test Setup (Gmail)**
```
SUPABASE_URL = 
SUPABASE_SERVICE_ROLE_KEY = 
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USERNAME = your_email@gmail.com
SMTP_PASSWORD = your_app_password_here
SMTP_USE_TLS = true
NEWSLETTER_FROM_EMAIL = AIToolsCenter <noreply@aitoolscenter.in>
NEWSLETTER_REPLY_TO_EMAIL = support@aitoolscenter.in
SITE_URL = https://aitoolscenter.vercel.app
CRON_SECRET = 
```

#### **Option B: Production Setup (SendGrid)**
```
SUPABASE_URL = 
SUPABASE_SERVICE_ROLE_KEY = 
SMTP_HOST = smtp.sendgrid.net
SMTP_PORT = 587
SMTP_USERNAME = apikey
SMTP_PASSWORD = your_sendgrid_api_key
SMTP_USE_TLS = true
NEWSLETTER_FROM_EMAIL = AIToolsCenter <noreply@aitoolscenter.in>
NEWSLETTER_REPLY_TO_EMAIL = support@aitoolscenter.in
SITE_URL = https://aitoolscenter.vercel.app
CRON_SECRET = 
```

---

### ✅ STEP 4: Get Credentials

#### **For Supabase:**
1. Go to https://supabase.com/dashboard
2. Click your project
3. Go to **Settings** > **API**
4. Copy:
   - `Project URL` → `SUPABASE_URL`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

#### **For Gmail (Testing):**
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not enabled)
3. Go to https://myaccount.google.com/apppasswords
4. Select **Mail** and **Windows Computer**
5. Copy the generated password → `SMTP_PASSWORD`

#### **For SendGrid (Production):**
1. Go to https://app.sendgrid.com
2. Create API key in **Settings** > **API Keys**
3. Copy it → `SMTP_PASSWORD`

#### **For CRON_SECRET (Security):**
Open terminal and run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy output → `CRON_SECRET`

---

### ✅ STEP 5: Add Supabase Tables

1. Go to https://supabase.com/dashboard
2. In SQL Editor (or Query), run:

```sql
CREATE TABLE IF NOT EXISTS newsletter_submissions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  sent_at TIMESTAMP DEFAULT NOW(),
  recipient_count INT,
  success_count INT,
  failed_count INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### ✅ STEP 6: Set Environment Variables in Vercel

1. In Vercel dashboard, go to **Settings** > **Environment Variables**
2. For each variable below, click **"Add New"**
3. **Name:** (left column) | **Value:** (right column) | **Production** (checked)

**Add these one by one:**

| Name | Value |
|------|-------|
| `SUPABASE_URL` | `https://your-project.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `your_service_role_key_here` |
| `SMTP_HOST` | `smtp.gmail.com` (or `smtp.sendgrid.net`) |
| `SMTP_PORT` | `587` |
| `SMTP_USERNAME` | `your_email@gmail.com` (or `apikey`) |
| `SMTP_PASSWORD` | `your_app_password` (or SendGrid API key) |
| `SMTP_USE_TLS` | `true` |
| `NEWSLETTER_FROM_EMAIL` | `AIToolsCenter <noreply@aitoolscenter.in>` |
| `NEWSLETTER_REPLY_TO_EMAIL` | `support@aitoolscenter.in` |
| `SITE_URL` | `https://aitoolscenter.vercel.app` |
| `CRON_SECRET` | `your_generated_secret_here` |

4. Click **"Save"** after adding each variable

---

### ✅ STEP 7: Redeploy with Variables

1. In Vercel dashboard, go to **Deployments** tab
2. Click the **latest deployment**
3. Click **"Redeploy"** button
4. Click **"Redeploy"** again to confirm

**Wait for redeployment to complete** (~2 minutes)

---

### ✅ STEP 8: Verify Deployment

After redeployment completes:

1. Go to **Deployments** tab
2. Click latest deployment
3. Go to **Functions** tab
4. You should see:
   - `newsletter`
   - `unsubscribe`
   - `send-email`
   - `send-newsletter`

5. Test API endpoint (in terminal):
```bash
curl -X POST https://aitoolscenter.vercel.app/api/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Expected response:
```json
{
  "error": "Email not found in newsletter subscriber list"
}
```

(This is correct - email doesn't exist yet, but API is working!)

---

### ✅ STEP 9: Set Custom Domain (Optional)

1. In Vercel dashboard, click **"Settings"**
2. Go to **"Domains"**
3. Enter your domain: `www.aitoolscenter.in`
4. Follow DNS setup instructions

---

## 🎯 Your Deployment URLs

After successful deployment:

- **Website:** https://www.aitoolscenter.in
- **API Base:** https://www.aitoolscenter.in/api/
- **Unsubscribe:** https://www.aitoolscenter.in/api/unsubscribe
- **Newsletter:** https://www.aitoolscenter.in/api/newsletter

---

## ⚠️ TROUBLESHOOTING

### **Issue: 404 Error on API Endpoints**
- **Solution:** Check **Deployments** > **Functions** tab
- Redeploy if functions not listed
- Check file names in `/api/` folder

### **Issue: 500 Error**
- **Solution:** Check Environment Variables are set correctly
- Go to **Deployments** > Latest > **Logs** tab
- Look for error messages

### **Issue: Email Not Sending**
- **Solution:** 
  - Verify SMTP credentials
  - For Gmail: use App Password, not account password
  - For SendGrid: verify API key

---

## 📞 NEED HELP?

Read the detailed guides:
- 📖 **DEPLOYMENT_CHECKLIST.md** - Full step-by-step
- 📖 **VERCEL_SETUP.md** - API reference

---

**Status:** ✅ Ready for deployment  
**Last Updated:** May 30, 2026  
**Repository:** github.com/jeetdevinder89/aitoolscenter
