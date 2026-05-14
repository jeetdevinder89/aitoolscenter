function parseRequestBody(req) {
  if (typeof req.body === 'string') {
    return JSON.parse(req.body || '{}')
  }

  return req.body || {}
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return res.status(500).json({ error: 'Server is not configured for newsletter submissions.' })
  }

  try {
    const payload = parseRequestBody(req)
    const email = typeof payload.email === 'string' ? payload.email.trim() : ''

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' })
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/newsletter_submissions`, {
      method: 'POST',
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify([
        {
          email,
          source: 'aitoolscenter-newsletter',
        },
      ]),
    })

    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to save newsletter subscription.' })
    }

    return res.status(200).json({ ok: true })
  } catch {
    return res.status(400).json({ error: 'Invalid request payload.' })
  }
}
