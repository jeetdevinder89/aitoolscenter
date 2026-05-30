import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT || 587;
const smtpUsername = process.env.SMTP_USERNAME;
const smtpPassword = process.env.SMTP_PASSWORD;

// Create transporter
const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
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

  try {
    const { to, subject, html, fromEmail, fromName } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return res.status(400).json({ error: 'Invalid email format for recipient' });
    }

    // Send email
    const info = await transporter.sendMail({
      from: `${fromName || 'AIToolsCenter'} <${fromEmail || smtpUsername}>`,
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
