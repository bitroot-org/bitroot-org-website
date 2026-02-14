// Meta Conversions API proxy — Vercel serverless function
// Injects access token server-side so it never touches the browser.

const PIXEL_ID = '1943888539888959';
const GRAPH_URL = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`;

const ALLOWED_ORIGINS = [
  'https://bitroot.org',
  'https://www.bitroot.org',
  'https://platter.bitroot.org',
];

function corsHeaders(origin) {
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const cors = corsHeaders(origin);
  Object.entries(cors).forEach(([k, v]) => res.setHeader(k, v));

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!body || !Array.isArray(body.data)) {
      return res.status(400).json({ error: 'Invalid payload: expected { data: [...] }' });
    }

    // Inject client IP into each event's user_data
    const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    const enriched = body.data.map(function (evt) {
      const ud = evt.user_data || {};
      if (clientIp) ud.client_ip_address = clientIp;
      return Object.assign({}, evt, { user_data: ud });
    });

    const response = await fetch(GRAPH_URL + '?access_token=' + encodeURIComponent(token), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: enriched }),
    });

    const result = await response.json();
    return res.status(response.ok ? 200 : 502).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Internal error' });
  }
}
