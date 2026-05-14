function parseRequestBody(req) {
  if (typeof req.body === 'string') {
    return JSON.parse(req.body || '{}')
  }

  return req.body || {}
}

function isValidUrl(value) {
  try {
    const parsed = new URL(value)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return res.status(500).json({ error: 'Server is not configured for tool submissions.' })
  }

  try {
    const payload = parseRequestBody(req)
    const name = typeof payload.name === 'string' ? payload.name.trim() : ''
    const url = typeof payload.url === 'string' ? payload.url.trim() : ''
    const category = typeof payload.category === 'string' ? payload.category.trim() : ''
    const pricing = typeof payload.pricing === 'string' ? payload.pricing.trim() : ''
    const contactEmail = typeof payload.contactEmail === 'string' ? payload.contactEmail.trim() : ''
    const description = typeof payload.description === 'string' ? payload.description.trim() : ''

    if (!name || !url || !contactEmail || description.length < 30 || !isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid tool submission.' })
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/tool_submissions`, {
      method: 'POST',
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify([
        {
          name,
          url,
          category,
          pricing,
          contact_email: contactEmail,
          description,
          source: 'aitoolscenter-submit-tool',
        },
      ]),
    })

    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to save tool submission.' })
    }

    return res.status(200).json({ ok: true })
  } catch {
    return res.status(400).json({ error: 'Invalid request payload.' })
  }
}
