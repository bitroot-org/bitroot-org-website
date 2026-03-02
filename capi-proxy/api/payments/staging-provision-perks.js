// STAGING version of the Razorpay webhook handler
// Uses RAZORPAY_WEBHOOK_SECRET_TEST for test mode signature verification
// Everything else is identical to provision-perks.js

import { createHmac } from 'crypto';

const SECRET_API_BASE = 'https://www.joinsecret.com/api';

export const config = {
  api: { bodyParser: false },
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function verifyWebhookSignature(rawBody, signature, secret) {
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  return expected === signature;
}

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
  return data.jwt_token || data.token;
}

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

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET_TEST;
  const perksApiKey = process.env.PERKS_PRIVATE_API_KEY;

  if (!webhookSecret || !perksApiKey) {
    console.error('staging-provision-perks: missing env vars');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-razorpay-signature'];

    if (!signature || !verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      console.error('staging-provision-perks: invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(rawBody);

    if (event.event !== 'payment.captured') {
      return res.status(200).json({ status: 'ignored', event: event.event });
    }

    const payment = event.payload?.payment?.entity;
    if (!payment) {
      return res.status(400).json({ error: 'Missing payment entity' });
    }

    const email = payment.email;
    if (!email) {
      console.error('staging-provision-perks: no email in payment', payment.id);
      return res.status(400).json({ error: 'No email in payment' });
    }

    console.log(`staging-provision-perks: processing ${payment.id} for ${email}`);

    const jwt = await getSecretJwt(perksApiKey);
    const user = await createPerksUser(jwt, email);

    console.log(`staging-provision-perks: ${user.already_exists ? 'found existing' : 'created'} user for ${email} (payment: ${payment.id})`);

    return res.status(200).json({
      status: 'provisioned',
      email: user.email,
      already_exists: user.already_exists,
    });
  } catch (err) {
    console.error('staging-provision-perks error:', err.message);
    return res.status(500).json({ error: 'Provisioning failed' });
  }
}
