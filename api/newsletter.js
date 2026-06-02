import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT || 587;
const smtpUsername = process.env.SMTP_USERNAME;
const smtpPassword = process.env.SMTP_PASSWORD;
const newsletterFromEmail = process.env.NEWSLETTER_FROM_EMAIL;
const newsletterReplyToEmail = process.env.NEWSLETTER_REPLY_TO_EMAIL;
const siteUrl = process.env.SITE_URL || 'https://aitoolscenter.in';

const extractEmailAddress = (value) => {
  if (!value) return '';
  const match = String(value).match(/<([^>]+)>/);
  if (match) return match[1].trim();
  return String(value).trim();
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getTransporter = () => nodemailer.createTransport({
  host: smtpHost,
  port: Number(smtpPort),
  secure: false,
  auth: {
    user: smtpUsername,
    pass: smtpPassword,
  },
});

const sendConfirmationEmail = async (email) => {
  try {
    const fromEmail = extractEmailAddress(newsletterFromEmail || smtpUsername);
    
    if (!fromEmail) {
      console.log('Skipping confirmation email: no sender configured');
      return false;
    }

    const html = `
      <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.6;color:#111827;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;">
        <h1 style="font-size:24px;margin:0 0 16px;color:#0f172a;">✓ Thanks for subscribing!</h1>
        <p style="margin:0 0 12px;color:#111827;">You are now subscribed to <strong>weekly AI tool updates</strong> from AIToolsCenter.</p>
        <p style="margin:0 0 12px;color:#111827;">📬 Every Monday, we'll send you:</p>
        <ul style="margin:0 0 16px;padding-left:20px;color:#111827;">
          <li>Top 5 trending AI tools of the week</li>
          <li>Latest product launches & updates</li>
          <li>Practical tool comparisons</li>
          <li>Curated AI news & insights</li>
        </ul>
        <p style="margin:0 0 20px;color:#111827;"><strong>🌐 Visit the site:</strong> <a href="${siteUrl}" style="color:#2563eb;text-decoration:none;">${siteUrl}</a></p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
        <p style="margin:12px 0;color:#6b7280;font-size:13px;">📧 You're receiving this email because you subscribed to our newsletter.</p>
        <p style="margin:0;color:#6b7280;font-size:13px;">💬 Questions? Reply to this email or contact <a href="mailto:support@aitoolscenter.in" style="color:#2563eb;text-decoration:none;">support@aitoolscenter.in</a></p>
        <p style="margin:12px 0 0;color:#6b7280;font-size:12px;">— AIToolsCenter Team</p>
        <p style="margin:12px 0 0;padding-top:12px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:12px;"><a href="https://www.aitoolscenter.in/api/unsubscribe?email=${encodeURIComponent(email)}" style="color:#9ca3af;text-decoration:underline;">Unsubscribe</a> | <a href="${siteUrl}#contact" style="color:#9ca3af;text-decoration:underline;">Manage preferences</a></p>
      </div>
    `;

    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: newsletterFromEmail || fromEmail,
      to: email,
      ...(newsletterReplyToEmail && { replyTo: newsletterReplyToEmail }),
      subject: 'You are subscribed to AIToolsCenter updates',
      html: html,
      headers: {
        'List-Unsubscribe': `<https://www.aitoolscenter.in/api/unsubscribe?email=${encodeURIComponent(email)}>`,
      },
    });

    console.log(`Confirmation email sent to ${email}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return false;
  }
};

export default async function handler(req, res) {
  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(204).setHeader('Allow', 'POST, OPTIONS').end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST to subscribe.' });
  }

  try {
    // Validate environment
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: 'Server is not configured for newsletter submissions.' });
    }

    // Extract and validate email
    const email = (req.body?.email || '').trim();

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email is required.' });
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if email already exists
    const { data: existingRecords, error: fetchError } = await supabase
      .from('newsletter_submissions')
      .select('id, active')
      .eq('email', email);

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return res.status(502).json({ error: 'Failed to check email subscription status.' });
    }

    // Check if already active
    if (existingRecords && existingRecords.length > 0) {
      const existingRecord = existingRecords[0];
      if (existingRecord.active) {
        return res.status(409).json({ error: 'This email is already subscribed to our newsletter.' });
      }

      // Reactivate inactive subscription
      const { error: updateError } = await supabase
        .from('newsletter_submissions')
        .update({
          active: true,
          unsubscribed_at: null,
        })
        .eq('email', email);

      if (updateError) {
        console.error('Supabase update error:', updateError);
        return res.status(502).json({ error: 'Failed to reactivate subscription.' });
      }
    } else {
      // Insert new subscription
      const { error: insertError } = await supabase
        .from('newsletter_submissions')
        .insert({
          email: email,
          active: true,
          source: 'aitoolscenter-newsletter',
        });

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        
        // Check if it's a duplicate key error
        if (insertError.code === '23505' || insertError.message?.includes('duplicate')) {
          return res.status(409).json({ error: 'This email is already subscribed to our newsletter.' });
        }
        
        return res.status(502).json({ error: 'Failed to save newsletter subscription.' });
      }
    }

    // Send confirmation email
    let confirmationSent = false;
    if (smtpHost && smtpUsername && smtpPassword) {
      confirmationSent = await sendConfirmationEmail(email);
    }

    return res.status(200).json({
      ok: true,
      confirmationSent: confirmationSent,
      message: confirmationSent 
        ? 'Subscribed! Check your email for confirmation.' 
        : 'Subscribed! (Confirmation email could not be sent at this time.)',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({
      error: 'Internal server error. Check logs.',
      details: error.message?.slice(0, 200),
    });
  }
}
