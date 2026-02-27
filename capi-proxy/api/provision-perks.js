// Razorpay webhook handler — auto-provisions perks access on payment.captured
// Razorpay POSTs here → we verify signature → extract email → create user on Secret API

import { createHmac } from 'crypto';

const SECRET_API_BASE = 'https://www.joinsecret.com/api';

// Disable Vercel's body parser so we can access the raw body for signature verification
export const config = {
  api: { bodyParser: false },
};

// Read raw body from request stream
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

// Verify Razorpay webhook signature (HMAC SHA256)
function verifyWebhookSignature(rawBody, signature, secret) {
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  return expected === signature;
}

// Authenticate with Secret API to get JWT
async function getSecretJwt(privateApiKey) {
  const res = await fetch(`${SECRET_API_BASE}/v1/authentications`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${privateApiKey}` },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Secret API auth failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.token;
}

// Create user on perks portal via Secret API
async function createPerksUser(jwt, email) {
  const res = await fetch(`${SECRET_API_BASE}/v1/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Secret API user creation failed (${res.status}): ${err}`);
  }

  return await res.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const perksApiKey = process.env.PERKS_PRIVATE_API_KEY;

  if (!webhookSecret || !perksApiKey) {
    console.error('provision-perks: missing env vars');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    // Step 1: Read raw body and verify Razorpay signature
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-razorpay-signature'];

    if (!signature || !verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      console.error('provision-perks: invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(rawBody);

    // Step 2: Only handle payment.captured events
    if (event.event !== 'payment.captured') {
      // Acknowledge other events without processing
      return res.status(200).json({ status: 'ignored', event: event.event });
    }

    const payment = event.payload?.payment?.entity;
    if (!payment) {
      return res.status(400).json({ error: 'Missing payment entity' });
    }

    const email = payment.email;
    if (!email) {
      console.error('provision-perks: no email in payment', payment.id);
      return res.status(400).json({ error: 'No email in payment' });
    }

    console.log(`provision-perks: processing ${payment.id} for ${email}`);

    // Step 3: Authenticate with Secret API
    const jwt = await getSecretJwt(perksApiKey);

    // Step 4: Create user on perks portal
    const user = await createPerksUser(jwt, email);

    console.log(`provision-perks: ${user.already_exists ? 'found existing' : 'created'} user for ${email} (payment: ${payment.id})`);

    return res.status(200).json({
      status: 'provisioned',
      email: user.email,
      already_exists: user.already_exists,
    });
  } catch (err) {
    console.error('provision-perks error:', err.message);
    return res.status(500).json({ error: 'Provisioning failed' });
  }
}
