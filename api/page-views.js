export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Not configured' })
  }

  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  }

  const normalizeCount = (payload) => {
    if (typeof payload === 'number') return payload
    if (Array.isArray(payload)) {
      const first = payload[0]
      if (typeof first === 'number') return first
      if (first && typeof first.increment_page_views === 'number') return first.increment_page_views
      if (first && typeof first.count === 'number') return first.count
    }
    if (payload && typeof payload.increment_page_views === 'number') return payload.increment_page_views
    if (payload && typeof payload.count === 'number') return payload.count
    if (payload && typeof payload.value === 'number') return payload.value
    return null
  }

  if (req.method === 'POST') {
    // Increment counter using Supabase RPC
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/increment_page_views`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ row_id: 'total' }),
    })
    const data = await rpcRes.json()
    if (!rpcRes.ok) {
      return res.status(rpcRes.status).json({ error: 'Failed to increment page views', details: data })
    }

    const count = normalizeCount(data)
    if (typeof count !== 'number') {
      return res.status(500).json({ error: 'Unexpected increment response', details: data })
    }

    return res.status(200).json({ count })
  }

  // GET — just return current count
  const getRes = await fetch(`${supabaseUrl}/rest/v1/page_views?id=eq.total&select=count`, {
    headers,
  })
  if (!getRes.ok) {
    const details = await getRes.text()
    return res.status(getRes.status).json({ error: 'Failed to fetch page views', details })
  }
  const rows = await getRes.json()
  const count = rows?.[0]?.count ?? 0
  return res.status(200).json({ count })
}
