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

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Mark subscriber as inactive
    const { error } = await supabase
      .from('newsletter_submissions')
      .update({
        active: false,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('email', email);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // Also remove from localStorage copy if it exists
    // This is handled on the client side

    // Return HTML response for email links
    if (req.headers.accept?.includes('text/html')) {
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
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
      email: email,
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return res.status(500).json({
      error: 'Failed to process unsubscribe',
      details: error.message,
    });
  }
}
