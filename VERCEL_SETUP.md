# Vercel API Endpoint Setup Guide

## API Endpoints Deployed

All API endpoints are located in `/api/` and will be automatically deployed to Vercel:

### 1. **POST /api/unsubscribe**
- **Purpose:** Unsubscribe users from newsletter
- **Request:** `{ email: "user@example.com" }`
- **Response:** `{ success: true, message: "Successfully unsubscribed...", email }`
- **Environment Variables Needed:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### 2. **POST /api/newsletter**
- **Purpose:** Subscribe to newsletter
- **Request:** `{ email: "user@example.com" }`
- **Response:** `{ success: true, message: "Confirmation email sent" }`
- **Environment Variables Needed:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

### 3. **POST /api/send-newsletter**
- **Purpose:** Cron job for sending weekly newsletters
- **Triggered:** Every Monday at 9 AM UTC (configured in vercel.json)
- **Environment Variables Needed:** Same as newsletter + `CRON_SECRET`

### 4. **POST /api/send-email**
- **Purpose:** Send emails via SMTP
- **Request:** `{ to, subject, html, fromEmail, fromName }`
- **Environment Variables Needed:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

### 5. **POST /api/track-visitor**
- **Purpose:** Track page visits (optional)
- **Request:** `{ timestamp }`
- **No environment variables needed**

## Environment Variables Required in Vercel

Go to **Project Settings > Environment Variables** and add:

```
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# SMTP Configuration (for email delivery)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@aitoolscenter.in

# Cron Security (for scheduled tasks)
CRON_SECRET=your_secure_random_secret
```

## How to Deploy

### Option 1: Using Vercel CLI
```bash
npm install -g vercel
vercel deploy
```

### Option 2: Using Git Integration
1. Push changes to GitHub/GitLab
2. Vercel automatically detects and deploys changes to `/api/` folder

### Option 3: Direct Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the required environment variables
5. Redeploy from Deployments tab

## Testing Endpoints

After deployment, test endpoints at:
- `https://www.aitoolscenter.in/api/unsubscribe`
- `https://www.aitoolscenter.in/api/newsletter`
- `https://www.aitoolscenter.in/api/send-email`

## Troubleshooting

### 404 Error on API Endpoints
- **Issue:** Endpoint not found
- **Solution:** 
  1. Verify files exist in `/api/` folder
  2. Check function names match endpoint routes
  3. Redeploy after file changes

### 500 Error
- **Issue:** Missing environment variables
- **Solution:** 
  1. Check all required env vars are set
  2. Go to Vercel Dashboard > Settings > Environment Variables
  3. Add missing variables
  4. Redeploy

### Email Not Working
- **Issue:** SMTP configuration incorrect
- **Solution:**
  1. Verify SMTP credentials
  2. Check email provider's SMTP settings
  3. Enable "Less secure apps" if using Gmail
  4. Test with `curl -X POST https://api.aitoolscenter.in/api/send-email -H "Content-Type: application/json" -d '{"to":"test@example.com","subject":"Test","html":"<p>Test</p>"}'`

## Files Deployed

```
/api/
  ├── unsubscribe.js    (Handles newsletter unsubscription)
  ├── newsletter.py     (Handles newsletter subscription)
  ├── send-newsletter.js (Cron job for weekly sends)
  ├── send-email.js     (SMTP email service)
  ├── track-visitor.js  (Analytics tracking)
  └── page-views.js     (Traffic monitoring)
```

## Vercel Configuration (vercel.json)

✅ **Already configured:**
- Cron job: Runs every Monday at 9 AM UTC
- Security headers: CSP, HSTS, X-Frame-Options
- Redirects: www.aitoolscenter.in
- Rewrites: React SPA routing

## Next Steps

1. ✅ Verify all `/api/` files are in place
2. ✅ Update environment variables in Vercel
3. ✅ Deploy to Vercel
4. ✅ Test API endpoints
5. ✅ Monitor logs for any errors
