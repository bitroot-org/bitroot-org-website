/**
 * Meta Conversions API Proxy — Test Suite
 * Tests the /api/events proxy that forwards browser events to Meta CAPI.
 *
 * Usage:
 *   CAPI_URL=https://capi-proxy.vercel.app \
 *   node test/test-capi.mjs
 *
 * Exit code 0 = all passed. Exit code 1 = failures.
 */

// ── Config ────────────────────────────────────────────────────────────────────
const CAPI_URL = (process.env.CAPI_URL || '').replace(/\/$/, '');

// ── Console helpers ───────────────────────────────────────────────────────────
const C = { green: '\x1b[32m', red: '\x1b[31m', dim: '\x1b[2m', bold: '\x1b[1m', reset: '\x1b[0m' };
const log  = (...a) => console.log(...a);
const ok   = (s) => `${C.green}✓${C.reset} ${s}`;
const fail = (s) => `${C.red}✗${C.reset} ${s}`;
const info = (s) => `  ${C.dim}→ ${s}${C.reset}`;
const head = (s) => `\n${C.bold}${s}${C.reset}`;

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

// ── Suite: Meta CAPI Proxy ────────────────────────────────────────────────────
async function suite_metaCapi() {
  log(head(`Meta CAPI Proxy — ${CAPI_URL}/api/events`));

  await test('Env: CAPI_URL is set', async () => {
    assert(CAPI_URL, 'Missing env var CAPI_URL');
  });

  await test('GET → 405 Method Not Allowed', async () => {
    const res = await fetch(`${CAPI_URL}/api/events`);
    assert(res.status === 405, `Expected 405, got ${res.status}`);
  });

  await test('OPTIONS preflight (allowed origin) → 204', async () => {
    const res = await fetch(`${CAPI_URL}/api/events`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://platter.bitroot.org',
        'Access-Control-Request-Method': 'POST',
      },
    });
    assert(res.status === 204, `Expected 204, got ${res.status}`);
  });

  await test('Disallowed origin → no Access-Control-Allow-Origin header', async () => {
    const { headers } = await post(
      `${CAPI_URL}/api/events`,
      { data: [{ event_name: 'PageView', event_time: Math.floor(Date.now() / 1000), action_source: 'website', user_data: {} }] },
      { Origin: 'https://evil.example.com' }
    );
    const acao = headers.get('access-control-allow-origin');
    assert(!acao || acao === 'null', `Should not set ACAO for disallowed origin, got: ${acao}`);
  });

  await test('POST missing data array → 400', async () => {
    const { status } = await post(
      `${CAPI_URL}/api/events`,
      { not_data: 'wrong' },
      { Origin: 'https://platter.bitroot.org' }
    );
    assert(status === 400, `Expected 400, got ${status}`);
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  log(`\n${C.bold}╔══════════════════════════════════╗`);
  log(`║  Meta CAPI Proxy — Test Suite    ║`);
  log(`╚══════════════════════════════════╝${C.reset}`);
  log(info(`endpoint: ${CAPI_URL || C.red + 'NOT SET' + C.reset}`));

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
