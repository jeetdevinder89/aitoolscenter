import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const smtpHost = process.env.SMTP_HOST;
const smtpUsername = process.env.SMTP_USERNAME;
const smtpPassword = process.env.SMTP_PASSWORD;
const cronSecret = process.env.CRON_SECRET;

// Top trending AI tools for weekly digest
const getTrendingTools = () => {
  return [
    { name: 'ChatGPT', url: 'https://chatgpt.com', description: 'Conversational AI for writing, research, and coding' },
    { name: 'Claude', url: 'https://claude.ai', description: 'Long-context AI assistant for analysis and documents' },
    { name: 'Midjourney', url: 'https://midjourney.com', description: 'Premium AI image generation with artistic control' },
    { name: 'Perplexity', url: 'https://perplexity.ai', description: 'AI search engine with cited sources' },
    { name: 'GitHub Copilot', url: 'https://github.com/features/copilot', description: 'AI code suggestions in your IDE' },
  ];
};

// Generate HTML email template for weekly newsletter
const generateNewsletterHTML = (tools, newsItems) => {
  const toolsList = tools
    .map(
      (tool) =>
        `<tr>
          <td style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">
            <a href="${tool.url}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${tool.name}</a>
            <div style="color: #6b7280; font-size: 0.9rem; margin-top: 0.25rem;">${tool.description}</div>
          </td>
        </tr>`
    )
    .join('');

  const newsList =
    newsItems && newsItems.length > 0
      ? newsItems
          .slice(0, 3)
          .map(
            (news) =>
              `<li style="margin-bottom: 0.75rem;">
          <a href="${news.link || '#'}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${news.title}</a>
          <div style="color: #6b7280; font-size: 0.9rem; margin-top: 0.25rem;">${news.summary}</div>
        </li>`
          )
          .join('')
      : '<li>Check back next week for the latest AI news!</li>';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #00c2a8, #00a896); color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .section { margin: 20px 0; }
          .section-title { font-size: 1.25rem; font-weight: bold; margin-bottom: 15px; color: #0f172a; }
          .tool-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 0.9rem; text-align: center; }
          a { color: #2563eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 1.75rem;">🤖 Weekly AI Tools Update</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your weekly digest of trending AI tools and news</p>
          </div>

          <div class="section">
            <div class="section-title">⭐ Top AI Tools This Week</div>
            <p>Here are the trending AI tools our community is loving right now:</p>
            <table class="tool-table">
              ${toolsList}
            </table>
            <a href="https://www.aitoolscenter.in" style="display: inline-block; background: #00c2a8; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">Explore All 100+ Tools →</a>
          </div>

          <div class="section">
            <div class="section-title">📰 Latest AI News</div>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${newsList}
            </ul>
          </div>

          <div class="section">
            <div class="section-title">✨ Featured Collection</div>
            <p>This week we're focusing on <strong>AI for Creators</strong> — tools for images, video, voice, and content production.</p>
            <a href="https://www.aitoolscenter.in#collections" style="display: inline-block; background: #f59e0b; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 10px;">Browse Collections →</a>
          </div>

          <div class="footer">
            <p>You're receiving this email because you subscribed to AIToolsCenter weekly updates.</p>
            <p>This is an automated digest sent every Monday at 9 AM UTC.</p>
            <p style="margin-bottom: 0;">
              <a href="https://www.aitoolscenter.in?unsubscribe=true" style="color: #6b7280;">Unsubscribe</a> | 
              <a href="https://www.aitoolscenter.in#contact" style="color: #6b7280;">Contact us</a>
            </p>
            <p style="margin-top: 15px; font-size: 0.85rem;">© 2026 AIToolsCenter. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export default async function handler(req, res) {
  // Verify cron secret
  if (req.headers['x-vercel-cron-secret'] !== cronSecret) {
    console.log('Invalid cron secret');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('Starting newsletter send process...');

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all active subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from('newsletter_submissions')
      .select('email')
      .eq('active', true);

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      throw fetchError;
    }

    if (!subscribers || subscribers.length === 0) {
      console.log('No active subscribers found');
      return res.status(200).json({
        success: true,
        sent: 0,
        message: 'No active subscribers',
      });
    }

    console.log(`Found ${subscribers.length} active subscribers`);

    // Get trending tools and news for this week
    const tools = getTrendingTools();
    // You can fetch real news from ai-news.json or an API here
    const newsItems = [];

    // Generate HTML email
    const emailHtml = generateNewsletterHTML(tools, newsItems);

    // Send emails to all subscribers
    const sendResults = await Promise.allSettled(
      subscribers.map(async (subscriber) => {
        try {
          const response = await fetch('https://www.aitoolscenter.in/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: subscriber.email,
              subject: '🤖 Your Weekly AI Tools Update — Top 5 Tools + News',
              html: emailHtml,
              fromEmail: 'newsletter@aitoolscenter.in',
              fromName: 'AIToolsCenter',
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to send to ${subscriber.email}`);
          }

          return { email: subscriber.email, success: true };
        } catch (error) {
          console.error(`Error sending to ${subscriber.email}:`, error);
          return { email: subscriber.email, success: false, error: error.message };
        }
      })
    );

    const successCount = sendResults.filter((r) => r.status === 'fulfilled' && r.value.success).length;
    const failureCount = sendResults.filter((r) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length;

    console.log(`Newsletter sent: ${successCount} success, ${failureCount} failures`);

    // Log results to Supabase
    const { error: logError } = await supabase.from('newsletter_logs').insert({
      sent_at: new Date().toISOString(),
      recipient_count: subscribers.length,
      success_count: successCount,
      failed_count: failureCount,
    });

    if (logError) {
      console.error('Error logging results:', logError);
    }

    return res.status(200).json({
      success: true,
      sent: successCount,
      failed: failureCount,
      total: subscribers.length,
      message: `Newsletter delivered to ${successCount}/${subscribers.length} subscribers`,
    });
  } catch (error) {
    console.error('Newsletter error:', error);
    return res.status(500).json({
      error: 'Failed to send newsletters',
      details: error.message,
    });
  }
}
