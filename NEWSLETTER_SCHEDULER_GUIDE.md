# Weekly Newsletter Scheduler Implementation Guide

**Status:** Ready to deploy  
**Priority:** High  
**Blocks:** Google AdSense re-review  

---

## Overview

The newsletter subscription form is now ✅ **functional and ready**. Users can sign up for weekly AI tool updates. However, the **weekly email distribution system** needs to be implemented.

### Current State
- ✅ Frontend form accepts emails and validates them
- ✅ Backend API endpoint (`api/newsletter.py`) accepts submissions
- ✅ Supabase stores subscriber emails in `newsletter_submissions` table
- ✅ Email confirmation template includes unsubscribe link
- ❌ **Missing:** Cron scheduler to send weekly emails

---

## Implementation Options

### Option 1: Vercel Cron Functions (RECOMMENDED)

**Why:** Native Vercel integration, no additional hosting needed, free tier included

#### Step 1: Create Scheduler Function
Create `api/send-newsletter.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUsername = process.env.SMTP_USERNAME;
const smtpPassword = process.env.SMTP_PASSWORD;

export default async function handler(req, res) {
  // Verify cron secret
  if (req.query.secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Fetch all active subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from('newsletter_submissions')
      .select('email')
      .eq('active', true);

    if (fetchError) throw fetchError;

    // 2. Get trending tools from this week
    const trendingTools = getTrendingTools(); // Your logic here

    // 3. Generate HTML email
    const emailHtml = generateNewsletterEmail(trendingTools);

    // 4. Send emails (batch)
    const emailResults = await sendBatchEmails(
      subscribers.map(s => s.email),
      emailHtml
    );

    // 5. Log results
    const { error: logError } = await supabase
      .from('newsletter_logs')
      .insert({
        sent_at: new Date().toISOString(),
        recipient_count: subscribers.length,
        success_count: emailResults.filter(r => r.success).length,
      });

    return res.status(200).json({
      success: true,
      sent: emailResults.filter(r => r.success).length,
      total: subscribers.length,
    });
  } catch (error) {
    console.error('Newsletter error:', error);
    return res.status(500).json({ 
      error: 'Failed to send newsletters',
      details: error.message 
    });
  }
}
```

#### Step 2: Configure vercel.json
Add to your `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/send-newsletter",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

**Schedule Explanation:**
- `0` = minute 0
- `9` = hour 9 (UTC)
- `*` = every day
- `*` = every month
- `1` = Monday

This sends newsletters **every Monday at 9 AM UTC** (can adjust timezone in code)

#### Step 3: Add Secret to Vercel
In Vercel Project Settings > Environment Variables:
```
CRON_SECRET=your-secure-random-string
```

---

### Option 2: External Scheduler (Alternative)

If you prefer not to use Vercel Crons:

#### Using node-cron (Local Development)
```javascript
import cron from 'node-cron';
import { sendNewsletter } from './lib/newsletter.js';

// Run every Monday at 9 AM
cron.schedule('0 9 * * 1', async () => {
  console.log('Sending weekly newsletter...');
  await sendNewsletter();
});
```

#### Using Zapier/IFTTT
1. Create a Zapier task that runs weekly
2. Makes a webhook call to your API endpoint
3. Endpoint receives request and triggers newsletter send

---

## Newsletter Email Template

### What to Include
- ✅ Top 5 trending AI tools of the week
- ✅ Latest AI news (2-3 stories)
- ✅ Tool comparison of the week
- ✅ Practical tips/how-to guides
- ✅ Featured collection
- ✅ Clear call-to-action buttons
- ✅ Unsubscribe link (REQUIRED by law)

### Recommended Flow
```
Week 1: "5 Free AI Tools You Should Try"
Week 2: "AI Coding Assistants Face-Off"
Week 3: "Best AI for Content Creation"
Week 4: "Enterprise AI Solutions Review"
```

### Email Structure
```
Subject: "Your AI Tools Weekly Update — [Date]"

Header
  - AIToolsCenter logo
  - "Weekly AI Update"

Body
  - Top 5 tools (cards with links)
  - Featured article
  - News roundup
  - CTA: "Explore more tools →"

Footer
  - Unsubscribe link
  - Privacy policy link
  - Contact info
```

---

## Database Schema

### Required Supabase Tables

```sql
-- Main newsletter submissions table
CREATE TABLE newsletter_submissions (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  source VARCHAR(50) NOT NULL,
  active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logs of newsletter sends
CREATE TABLE newsletter_logs (
  id BIGSERIAL PRIMARY KEY,
  sent_at TIMESTAMP NOT NULL,
  recipient_count INTEGER,
  success_count INTEGER,
  failed_count INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email open tracking (optional)
CREATE TABLE newsletter_events (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255),
  event_type VARCHAR(50), -- 'open', 'click', 'unsubscribe'
  event_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Unsubscribe Implementation

### Add to api/unsubscribe.js
```javascript
export default async function handler(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { error } = await supabase
    .from('newsletter_submissions')
    .update({ 
      active: false, 
      unsubscribed_at: new Date().toISOString() 
    })
    .eq('email', email);

  if (error) {
    return res.status(500).json({ error: 'Failed to unsubscribe' });
  }

  return res.status(200).json({ success: true });
}
```

### Update Frontend
Add unsubscribe link handler in App.jsx:
```javascript
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const unsubscribeEmail = params.get('unsubscribe');
  
  if (unsubscribeEmail) {
    handleUnsubscribe(unsubscribeEmail);
  }
}, []);

const handleUnsubscribe = async (email) => {
  try {
    await fetch('/api/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    alert('You have been unsubscribed.');
  } catch (error) {
    console.error('Unsubscribe failed:', error);
  }
};
```

---

## Email Service Integrations

### Using SendGrid (Recommended)
```bash
npm install @sendgrid/mail
```

```javascript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendBatchEmails(recipients, htmlContent) {
  const msg = {
    to: recipients,
    from: process.env.NEWSLETTER_FROM_EMAIL,
    subject: 'Your Weekly AI Tools Update',
    html: htmlContent,
    replyTo: process.env.NEWSLETTER_REPLY_TO_EMAIL,
  };

  return await sgMail.sendMultiple(msg);
}
```

### Using Mailgun
```bash
npm install mailgun.js
```

---

## Testing Checklist

- [ ] Send test email locally with node-cron
- [ ] Verify email arrives in inbox
- [ ] Check unsubscribe link works
- [ ] Verify Supabase entries update correctly
- [ ] Test with multiple recipients
- [ ] Verify fail-over/retry logic
- [ ] Check email template renders correctly
- [ ] Monitor Vercel logs for cron execution
- [ ] Set up email bounce/complaint handling

---

## Deployment Steps

1. **Locally test:**
   ```bash
   node scripts/test-newsletter.mjs
   ```

2. **Deploy to Vercel:**
   ```bash
   git add api/send-newsletter.js vercel.json
   git commit -m "Add weekly newsletter scheduler"
   git push origin main
   ```

3. **Verify in Vercel Dashboard:**
   - Check "Deployments" tab
   - Verify cron tasks appear
   - Monitor cron logs

4. **Test in Production:**
   - Wait for Monday 9 AM UTC
   - Monitor Supabase newsletter_logs
   - Check email deliverability

---

## Monitoring & Maintenance

### Weekly Checks
- [ ] Check newsletter_logs for failures
- [ ] Monitor bounce/complaint rates
- [ ] Review subscriber growth
- [ ] Check email engagement metrics

### Monthly Review
- [ ] Update trending tools list
- [ ] A/B test subject lines
- [ ] Review unsubscribe rates
- [ ] Optimize send time if needed

---

## Cost Estimation

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel Cron | Included | Free |
| SendGrid | 100 emails/day | $9.95/month (for more) |
| Supabase | 500K rows | Included |
| **Total** | | ~$0-10/month |

---

## Next Steps

1. ✅ **Completed:** Newsletter form implementation
2. ✅ **Completed:** Unsubscribe mechanism in email
3. **TODO:** Implement send-newsletter.js API
4. **TODO:** Configure Vercel crons
5. **TODO:** Set up email service (SendGrid/Mailgun)
6. **TODO:** Create newsletter template
7. **TODO:** Test end-to-end workflow
8. **TODO:** Deploy and monitor

---

**Estimated Implementation Time:** 2-4 hours  
**Difficulty:** Medium  
**Return on Investment:** High (enables monetization, improves engagement)
