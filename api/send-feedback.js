import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT || 587;
const smtpUsername = process.env.SMTP_USERNAME;
const smtpPassword = process.env.SMTP_PASSWORD;
const supportEmail = 'support@aitoolscenter.in';

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
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate message length
    if (message.trim().length < 10) {
      return res.status(400).json({ error: 'Feedback message must be at least 10 characters' });
    }

    // Validate name length
    if (name.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid name' });
    }

    // Create HTML email body
    const htmlBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #00c2a8; margin-bottom: 20px;">New Feedback Submission</h2>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p><strong>From:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>

            <div style="background-color: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-top: 0;">Feedback Message:</h3>
              <p style="white-space: pre-wrap; word-wrap: break-word;">${message}</p>
            </div>

            <div style="font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 15px;">
              <p>Reply to: ${email}</p>
              <p>Timestamp: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email to support
    const info = await transporter.sendMail({
      from: `${name} <${smtpUsername}>`,
      to: supportEmail,
      replyTo: email,
      subject: `[User Feedback] ${subject}`,
      html: htmlBody,
    });

    console.log(`Feedback sent from ${name} (${email}): ${info.messageId}`);

    return res.status(200).json({
      ok: true,
      message: 'Thank you for your feedback! We\'ve received it and will review it shortly.',
    });
  } catch (error) {
    console.error('Error sending feedback email:', error);
    return res.status(500).json({
      error: 'Failed to send feedback. Please try again later.',
    });
  }
}
