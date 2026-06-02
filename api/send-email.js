import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT || 587;
const smtpUsername = process.env.SMTP_USERNAME;
const smtpPassword = process.env.SMTP_PASSWORD;
const internalApiSecret = process.env.INTERNAL_API_SECRET;

const getTransporter = () => nodemailer.createTransport({
  host: smtpHost,
  port: Number(smtpPort),
  secure: false,
  auth: {
    user: smtpUsername,
    pass: smtpPassword,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!internalApiSecret || req.headers['x-internal-api-secret'] !== internalApiSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!smtpHost || !smtpUsername || !smtpPassword) {
    return res.status(500).json({ error: 'SMTP is not configured' });
  }

  try {
    const { to, subject, html, fromEmail, fromName } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return res.status(400).json({ error: 'Invalid email format for recipient' });
    }

    const trustedFromEmail = fromEmail || smtpUsername;
    const trustedFromName = fromName || 'AIToolsCenter';

    // Prevent arbitrary from-header injection and ensure sender domain is controlled.
    if (!trustedFromEmail.endsWith('@aitoolscenter.in') && trustedFromEmail !== smtpUsername) {
      return res.status(400).json({ error: 'Invalid sender identity' });
    }

    // Send email
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: `${trustedFromName} <${trustedFromEmail}>`,
      to: to,
      subject: subject,
      html: html,
      headers: {
        'List-Unsubscribe': `<https://www.aitoolscenter.in/api/unsubscribe?email=${encodeURIComponent(to)}>`,
      },
    });

    console.log(`Email sent to ${to}: ${info.messageId}`);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      to: to,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      details: error.message,
    });
  }
}
