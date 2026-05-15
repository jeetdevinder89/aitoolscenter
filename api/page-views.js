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

  if (req.method === 'POST') {
    // Increment counter using Supabase RPC
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/increment_page_views`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ row_id: 'total' }),
    })
    const data = await rpcRes.json()
    return res.status(200).json({ count: data })
  }

  // GET — just return current count
  const getRes = await fetch(`${supabaseUrl}/rest/v1/page_views?id=eq.total&select=count`, {
    headers,
  })
  const rows = await getRes.json()
  const count = rows?.[0]?.count ?? 0
  return res.status(200).json({ count })
}
