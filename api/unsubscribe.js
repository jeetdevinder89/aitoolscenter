import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  // Accept both GET and POST
  const email = req.query.email || req.body?.email;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return res.status(500).json({ error: 'Server configuration error', details: 'Missing Supabase credentials' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if email exists AND is active
    const { data: existingRecords, error: fetchError } = await supabase
      .from('newsletter_submissions')
      .select('id, active')
      .eq('email', email);

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return res.status(500).json({ error: 'Database error', details: fetchError.message });
    }

    if (!existingRecords || existingRecords.length === 0) {
      console.error('Email not found:', email);
      return res.status(404).json({ error: 'Email not found in newsletter subscriber list' });
    }

    // Get the first record (should only be one due to UNIQUE constraint, but be safe)
    const existingRecord = existingRecords[0];

    if (!existingRecord.active) {
      return res.status(400).json({ error: 'This email is already unsubscribed' });
    }

    // Mark subscriber as inactive
    const { error: updateError } = await supabase
      .from('newsletter_submissions')
      .update({
        active: false,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('email', email);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return res.status(500).json({ error: 'Failed to unsubscribe', details: updateError.message });
    }

    // Send unsubscribe confirmation email
    let unsubscribeEmailSent = false;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || 587;
    const smtpUsername = process.env.SMTP_USERNAME;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const newsletterFromEmail = process.env.NEWSLETTER_FROM_EMAIL;
    const siteUrl = process.env.SITE_URL || 'https://aitoolscenter.in';

    if (smtpHost && newsletterFromEmail) {
      try {
        const nodemailer = (await import('nodemailer')).default;
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: false,
          auth: {
            user: smtpUsername,
            pass: smtpPassword,
          },
        });

        const unsubscribeHtml = `
          <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.6;color:#111827;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;">
            <h1 style="font-size:24px;margin:0 0 16px;color:#0f172a;">✓ You're unsubscribed</h1>
            <p style="margin:0 0 12px;color:#111827;">We've removed <strong>${email}</strong> from our newsletter.</p>
            <p style="margin:0 0 12px;color:#111827;">You won't receive any more weekly AI tool updates from us.</p>
            <p style="margin:0 0 20px;color:#111827;">If this was a mistake, you can <a href="${siteUrl}#updates" style="color:#2563eb;text-decoration:none;">subscribe again anytime</a>.</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
            <p style="margin:0;color:#6b7280;font-size:12px;">— AIToolsCenter Team</p>
          </div>
        `;

        await transporter.sendMail({
          from: newsletterFromEmail,
          to: email,
          subject: 'You have been unsubscribed from AIToolsCenter',
          html: unsubscribeHtml,
        });

        unsubscribeEmailSent = true;
        console.log(`Unsubscribe email sent to ${email}`);
      } catch (emailError) {
        console.error('Failed to send unsubscribe email:', emailError);
        // Don't fail the request if email fails, just log it
      }
    }

    // Return JSON for API requests (POST with JSON body or explicit JSON request)
    const isJSONRequest = req.headers['content-type']?.includes('application/json') || req.method === 'POST';
    
    if (isJSONRequest) {
      return res.status(200).json({
        success: true,
        message: 'Successfully unsubscribed from newsletter',
        email: email,
        emailSent: unsubscribeEmailSent,
      });
    }

    // Return HTML for email links (GET requests)
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; background: #f3f4f6; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; text-align: center; }
            h1 { color: #00c2a8; margin: 0 0 20px; }
            p { color: #6b7280; margin: 10px 0; }
            .success { color: #16a34a; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✓ Unsubscribed</h1>
            <p class="success">You have been successfully unsubscribed from our newsletter.</p>
            <p>You will no longer receive weekly AI tool updates.</p>
            <p style="margin-top: 30px; font-size: 0.9rem;">
              <a href="https://www.aitoolscenter.in" style="color: #2563eb;">Return to AIToolsCenter</a>
            </p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return res.status(500).json({
      error: 'Failed to process unsubscribe',
      details: error.message,
    });
  }
}
