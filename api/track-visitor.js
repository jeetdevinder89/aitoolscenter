export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { timestamp } = req.body;

    // Get visitor count from environment or file
    // For now, just acknowledge the tracking
    console.log(`[Visitor] ${new Date(timestamp).toISOString()}`);

    // Optional: Store in Supabase for analytics
    // This can be implemented later for detailed visitor analytics

    return res.status(200).json({
      success: true,
      tracked: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Visitor tracking error:', error);
    return res.status(500).json({ error: 'Failed to track visitor' });
  }
}
