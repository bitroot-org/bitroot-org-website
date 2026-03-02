/**
 * Platter Staging Test Suite
 * Tests each layer of the payment→provision flow independently.
 *
 * Usage:
 *   RAZORPAY_WEBHOOK_SECRET_TEST=xxx \
 *   PERKS_PRIVATE_API_KEY=xxx \
 *   STAGING_URL=https://your-vercel-staging-url.vercel.app \
 *   TEST_EMAIL=test+platter@yourdomain.com \
 *   node test/test-staging.mjs
 *
 * Exit code 0 = all passed. Exit code 1 = failures.
 */

import { createHmac } from 'crypto';

// ── Config ────────────────────────────────────────────────────────────────────
const STAGING_URL        = (process.env.STAGING_URL || '').replace(/\/$/, '');
const WEBHOOK_SECRET     = process.env.RAZORPAY_WEBHOOK_SECRET_TEST;
const PERKS_API_KEY      = process.env.PERKS_PRIVATE_API_KEY;
const TEST_EMAIL         = process.env.TEST_EMAIL || 'test+platter-ci@bitroot.org';
const SECRET_API_BASE    = 'https://www.joinsecret.com/api';

// ── Console helpers ───────────────────────────────────────────────────────────
const C = { green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m', dim: '\x1b[2m', bold: '\x1b[1m', reset: '\x1b[0m' };
const log   = (...a) => console.log(...a);
const ok    = (s) => `${C.green}✓${C.reset} ${s}`;
const fail  = (s) => `${C.red}✗${C.reset} ${s}`;
const info  = (s) => `  ${C.dim}→ ${s}${C.reset}`;
const head  = (s) => `\n${C.bold}${s}${C.reset}`;

let passed = 0;
let failed = 0;
const failures = [];

// ── Test runner ───────────────────────────────────────────────────────────────
async function test(name, fn) {
  try {
    await fn();
    log(ok(name));
    passed++;
  } catch (err) {
    log(fail(name));
    log(info(err.message));
    failures.push({ name, error: err.message });
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function sign(rawBody, secret) {
  return createHmac('sha256', secret).update(rawBody).digest('hex');
}

function makePaymentEvent(email, paymentId) {
  return JSON.stringify({
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: paymentId || `pay_test_${Date.now()}`,
          email,
          amount: 18000,
          currency: 'INR',
          status: 'captured',
          description: 'Platter Annual',
        },
      },
    },
  });
}

async function post(url, body, headers = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
  let json = null;
  try { json = await res.json(); } catch (_) {}
  return { status: res.status, headers: res.headers, json };
}

// ── Suite 1: Secret API (joinsecret.com) ─────────────────────────────────────
async function suite_secretApi() {
  log(head('1. Secret API — joinsecret.com'));

  let jwt = null;

  await test('Env: PERKS_PRIVATE_API_KEY is set', async () => {
    assert(PERKS_API_KEY, 'Missing env var PERKS_PRIVATE_API_KEY');
  });

  await test('POST /v1/authentications → 200 with token', async () => {
    assert(PERKS_API_KEY, 'Cannot run — API key not set');
    const { status, json } = await post(
      `${SECRET_API_BASE}/v1/authentications`, '',
      { Authorization: `Bearer ${PERKS_API_KEY}`, 'Content-Type': '' }
    );
    assert(status === 200, `Expected 200, got ${status}: ${JSON.stringify(json)}`);
    assert(json?.token, `No token in response: ${JSON.stringify(json)}`);
    jwt = json.token;
    log(info(`JWT received (${jwt.slice(0, 20)}...)`));
  });

  await test('POST /v1/users → 200 with email (idempotent)', async () => {
    assert(jwt, 'Cannot run — auth step failed');
    const { status, json } = await post(
      `${SECRET_API_BASE}/v1/users`,
      { email: TEST_EMAIL },
      { Authorization: `Bearer ${jwt}` }
    );
    assert(status === 200 || status === 201, `Expected 2xx, got ${status}: ${JSON.stringify(json)}`);
    assert(json?.email, `No email in response: ${JSON.stringify(json)}`);
    log(info(`email=${json.email}  already_exists=${json.already_exists}`));
  });

  return jwt;
}

// ── Suite 2: Webhook Endpoint ─────────────────────────────────────────────────
async function suite_webhookEndpoint() {
  log(head(`2. Staging Webhook — ${STAGING_URL}/api/staging-provision-perks`));

  await test('Env: STAGING_URL is set', async () => {
    assert(STAGING_URL, 'Missing env var STAGING_URL');
  });

  await test('Env: RAZORPAY_WEBHOOK_SECRET_TEST is set', async () => {
    assert(WEBHOOK_SECRET, 'Missing env var RAZORPAY_WEBHOOK_SECRET_TEST');
  });

  await test('GET → 405 Method Not Allowed', async () => {
    const res = await fetch(`${STAGING_URL}/api/staging-provision-perks`);
    assert(res.status === 405, `Expected 405, got ${res.status}`);
  });

  await test('POST with no signature header → 400', async () => {
    const payload = makePaymentEvent(TEST_EMAIL);
    const { status, json } = await post(`${STAGING_URL}/api/staging-provision-perks`, payload);
    assert(status === 400, `Expected 400, got ${status}: ${JSON.stringify(json)}`);
    log(info(json?.error || ''));
  });

  await test('POST with wrong signature → 400', async () => {
    const payload = makePaymentEvent(TEST_EMAIL);
    const { status, json } = await post(
      `${STAGING_URL}/api/staging-provision-perks`, payload,
      { 'x-razorpay-signature': 'deadbeefdeadbeef' }
    );
    assert(status === 400, `Expected 400, got ${status}: ${JSON.stringify(json)}`);
  });

  await test('POST non-payment event (correct sig) → 200 ignored', async () => {
    assert(WEBHOOK_SECRET, 'Cannot run — webhook secret not set');
    const payload = JSON.stringify({ event: 'refund.created', payload: {} });
    const sig = sign(payload, WEBHOOK_SECRET);
    const { status, json } = await post(
      `${STAGING_URL}/api/staging-provision-perks`, payload,
      { 'x-razorpay-signature': sig }
    );
    assert(status === 200, `Expected 200, got ${status}: ${JSON.stringify(json)}`);
    assert(json?.status === 'ignored', `Expected status=ignored, got: ${JSON.stringify(json)}`);
    log(info(`event ignored correctly: ${json.event}`));
  });

  await test('POST payment.captured (correct sig) → 200 provisioned', async () => {
    assert(WEBHOOK_SECRET, 'Cannot run — webhook secret not set');
    const payload = makePaymentEvent(TEST_EMAIL);
    const sig = sign(payload, WEBHOOK_SECRET);
    const { status, json } = await post(
      `${STAGING_URL}/api/staging-provision-perks`, payload,
      { 'x-razorpay-signature': sig }
    );
    assert(status === 200, `Expected 200, got ${status}: ${JSON.stringify(json)}`);
    assert(json?.status === 'provisioned', `Expected status=provisioned, got: ${JSON.stringify(json)}`);
    assert(json?.email === TEST_EMAIL, `Expected email=${TEST_EMAIL}, got ${json?.email}`);
    log(info(`provisioned: ${json.email}  already_exists=${json.already_exists}`));
  });

  await test('POST payment.captured missing email → 400', async () => {
    assert(WEBHOOK_SECRET, 'Cannot run — webhook secret not set');
    const payload = JSON.stringify({
      event: 'payment.captured',
      payload: { payment: { entity: { id: 'pay_test_noemail', amount: 18000 } } },
    });
    const sig = sign(payload, WEBHOOK_SECRET);
    const { status } = await post(
      `${STAGING_URL}/api/staging-provision-perks`, payload,
      { 'x-razorpay-signature': sig }
    );
    assert(status === 400, `Expected 400, got ${status}`);
  });
}

// ── Suite 3: Meta CAPI Proxy ─────────────────────────────────────────────────
async function suite_metaCapi() {
  log(head(`3. Meta CAPI Proxy — ${STAGING_URL}/api/events`));

  await test('OPTIONS preflight → 204', async () => {
    const res = await fetch(`${STAGING_URL}/api/events`, {
      method: 'OPTIONS',
      headers: { Origin: 'https://platter.bitroot.org', 'Access-Control-Request-Method': 'POST' },
    });
    assert(res.status === 204, `Expected 204, got ${res.status}`);
  });

  await test('Disallowed origin → no ACAO header', async () => {
    const { headers } = await post(`${STAGING_URL}/api/events`,
      { data: [{ event_name: 'PageView', event_time: Math.floor(Date.now() / 1000), action_source: 'website', user_data: {} }] },
      { Origin: 'https://evil.example.com' }
    );
    const acao = headers.get('access-control-allow-origin');
    assert(!acao || acao === 'null', `Should not set ACAO for disallowed origin, got: ${acao}`);
  });

  await test('Missing data array → 400', async () => {
    const { status } = await post(`${STAGING_URL}/api/events`,
      { not_data: 'wrong' },
      { Origin: 'https://platter.bitroot.org' }
    );
    assert(status === 400, `Expected 400, got ${status}`);
  });

  await test('GET → 405', async () => {
    const res = await fetch(`${STAGING_URL}/api/events`);
    assert(res.status === 405, `Expected 405, got ${res.status}`);
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  log(`\n${C.bold}╔══════════════════════════════════╗`);
  log(`║  Platter Staging Test Suite      ║`);
  log(`╚══════════════════════════════════╝${C.reset}`);
  log(info(`staging: ${STAGING_URL || C.red + 'NOT SET' + C.reset}`));
  log(info(`email:   ${TEST_EMAIL}`));

  await suite_secretApi();
  await suite_webhookEndpoint();
  await suite_metaCapi();

  const bar = '─'.repeat(40);
  log(`\n${bar}`);
  log(`${C.green}${C.bold}${passed} passed${C.reset}  ${failed > 0 ? C.red + C.bold : ''}${failed} failed${C.reset}`);

  if (failures.length) {
    log(`\n${C.bold}Failures:${C.reset}`);
    failures.forEach(({ name, error }) => {
      log(`  ${C.red}✗${C.reset} ${name}`);
      log(info(error));
    });
  }

  process.exit(failed > 0 ? 1 : 0);
})();
