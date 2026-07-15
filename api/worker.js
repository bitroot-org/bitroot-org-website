// bitroot-forms — Cloudflare Worker behind the bitroot.org static site.
//
// The org site is a static export on GitHub Pages, so this Worker is the
// trusted layer that holds secrets and fans each form submission out to:
//   1. Neon Postgres (shared Bitroot DB — contacts registry + capture tables,
//      see bitroot-club/migrations/006_org_site_captures.sql)
//   2. MailerLite (newsletter list, campaign sending)
//   3. Brevo (transactional auto-replies + internal notifications)
//
// Secrets:  DATABASE_URL, BREVO_API_KEY, MAILERLITE_API_KEY (optional — rows
//           are stamped unsynced and backfilled later), ADMIN_TOKEN
// Vars:     SENDER_EMAIL, SENDER_NAME, NOTIFY_EMAIL, MAILERLITE_GROUP_ID (opt)
//
// Email sends never fail a submission — the DB row is the source of truth.

const ALLOWED_ORIGINS = new Set([
  "https://bitroot.org",
  "https://www.bitroot.org",
  "http://localhost:3000",
  "http://localhost:8000",
]);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    try {
      if (url.pathname === "/v1/health") {
        return json({ ok: true }, 200, cors);
      }
      if (request.method !== "POST") {
        return json({ ok: false, error: "method_not_allowed" }, 405, cors);
      }

      const body = await request.json().catch(() => null);
      if (!body) return json({ ok: false, error: "bad_json" }, 400, cors);

      // Honeypot: bots fill every field. Pretend success, write nothing.
      if (typeof body.website === "string" && body.website.trim() !== "") {
        return json({ ok: true }, 200, cors);
      }

      switch (url.pathname) {
        case "/v1/newsletter":
          return json(await handleNewsletter(body, env, ctx), 200, cors);
        case "/v1/early-access":
          return json(await handleEarlyAccess(body, env, ctx), 200, cors);
        case "/v1/contact":
          return json(await handleContact(body, env, ctx), 200, cors);
        case "/v1/admin/sync-mailerlite": {
          const auth = request.headers.get("Authorization") || "";
          if (!env.ADMIN_TOKEN || auth !== `Bearer ${env.ADMIN_TOKEN}`) {
            return json({ ok: false, error: "unauthorized" }, 401, cors);
          }
          return json(await syncMailerlite(env), 200, cors);
        }
        default:
          return json({ ok: false, error: "not_found" }, 404, cors);
      }
    } catch (e) {
      if (e instanceof HttpError) {
        return json({ ok: false, error: e.message }, e.status, cors);
      }
      console.error("unhandled:", e);
      return json({ ok: false, error: "internal" }, 500, cors);
    }
  },
};

/* ─── Handlers ─────────────────────────────────────────────────────────── */

async function handleNewsletter(body, env, ctx) {
  const email = normEmail(body.email);
  if (!email) throw new HttpError(422, "invalid_email");
  const location = str(body.location, 80);
  const site = str(body.site, 20) || "org";

  const contactId = await upsertContact(env, { email, source: "newsletter" });
  const rows = await sql(
    env,
    `INSERT INTO newsletter_subscribers (contact_id, email, status, site, signup_location)
     VALUES ($1, $2, 'subscribed', $3, $4)
     ON CONFLICT (email) DO UPDATE
       SET status = 'subscribed',
           signup_location = COALESCE(newsletter_subscribers.signup_location, EXCLUDED.signup_location)
     RETURNING id, welcome_email_sent_at, mailerlite_synced_at`,
    [contactId, email, site, location],
  );
  const sub = rows[0];

  // Fan out after the response: MailerLite sync + welcome email.
  ctx.waitUntil(
    (async () => {
      if (!sub.mailerlite_synced_at) {
        const ml = await mailerliteUpsert(env, email);
        if (ml) {
          await sql(
            env,
            `UPDATE newsletter_subscribers SET mailerlite_id = $1, mailerlite_synced_at = now() WHERE id = $2`,
            [ml.id, sub.id],
          );
        }
      }
      if (!sub.welcome_email_sent_at) {
        const sent = await sendBrevo(env, {
          to: [{ email }],
          subject: "You're on the list — one email, every Sunday",
          htmlContent: welcomeHtml(),
        });
        if (sent) {
          await sql(
            env,
            `UPDATE newsletter_subscribers SET welcome_email_sent_at = now() WHERE id = $1`,
            [sub.id],
          );
        }
      }
    })(),
  );

  return { ok: true };
}

async function handleEarlyAccess(body, env, ctx) {
  const email = normEmail(body.email);
  if (!email) throw new HttpError(422, "invalid_email");
  const name = str(body.name, 120);
  const product = str(body.product, 60);
  const productName = str(body.productName, 120) || product;
  const program = body.program === "creators" ? "creators" : "core";
  const handle = str(body.handle, 80);
  const context = str(body.context, 2000);
  if (!product) throw new HttpError(422, "missing_product");

  const contactId = await upsertContact(env, { email, name, source: "early_access" });
  const rows = await sql(
    env,
    `INSERT INTO early_access_requests (contact_id, name, email, product_slug, program, handle, context, site)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'org')
     RETURNING id`,
    [contactId, name, email, product, program, handle, context],
  );
  const requestId = rows[0].id;

  ctx.waitUntil(
    (async () => {
      const firstName = (name || "").split(/\s+/)[0] || "there";
      const programName = program === "creators" ? "Creators Program" : "Core Community";
      const jobs = [
        sendBrevo(env, {
          to: [{ email, name: name || undefined }],
          subject: `You're in the queue for ${productName}`,
          htmlContent: earlyAccessHtml({ firstName, productName, programName }),
        }).then(async (sent) => {
          if (sent) {
            await sql(
              env,
              `UPDATE early_access_requests SET confirmation_email_sent_at = now() WHERE id = $1`,
              [requestId],
            );
          }
        }),
        sendBrevo(env, {
          to: notifyRecipients(env),
          replyTo: { email, name: name || undefined },
          subject: `[Early access · bitroot.org] ${name || email} · ${productName} · ${programName}`,
          htmlContent: internalHtml("New early-access request", [
            ["Name", name],
            ["Email", email],
            ["Product", productName],
            ["Program", programName],
            ["Handle", handle],
            ["Building / making", context],
          ]),
        }),
      ];
      await Promise.allSettled(jobs);
    })(),
  );

  return { ok: true };
}

async function handleContact(body, env, ctx) {
  const email = normEmail(body.email);
  if (!email) throw new HttpError(422, "invalid_email");
  const name = str(body.name, 120);
  const topic = str(body.topic, 60);
  const message = str(body.message, 5000);
  if (!message) throw new HttpError(422, "missing_message");

  const contactId = await upsertContact(env, { email, name, source: "contact_form" });
  await sql(
    env,
    `INSERT INTO contact_messages (contact_id, name, email, topic, message, site)
     VALUES ($1, $2, $3, $4, $5, 'org')`,
    [contactId, name, email, topic, message],
  );

  ctx.waitUntil(
    Promise.allSettled([
      sendBrevo(env, {
        to: [{ email, name: name || undefined }],
        subject: "Got your message — we'll reply within one business day",
        htmlContent: contactAckHtml({ firstName: (name || "").split(/\s+/)[0] || "there" }),
      }),
      sendBrevo(env, {
        to: notifyRecipients(env),
        replyTo: { email, name: name || undefined },
        subject: `[Contact · bitroot.org] ${name || email}${topic ? ` · ${topic}` : ""}`,
        htmlContent: internalHtml("New message", [
          ["Name", name],
          ["Email", email],
          ["Topic", topic],
          ["Message", message],
        ]),
      }),
    ]),
  );

  return { ok: true };
}

// Backfill newsletter rows that never made it into MailerLite (e.g. the key
// was missing at capture time). Guarded by ADMIN_TOKEN.
async function syncMailerlite(env) {
  if (!env.MAILERLITE_API_KEY) return { ok: false, error: "mailerlite_key_missing" };
  const rows = await sql(
    env,
    `SELECT id, email FROM newsletter_subscribers
     WHERE mailerlite_synced_at IS NULL AND status = 'subscribed'
     ORDER BY id LIMIT 100`,
    [],
  );
  let synced = 0;
  for (const row of rows) {
    const ml = await mailerliteUpsert(env, row.email);
    if (ml) {
      await sql(
        env,
        `UPDATE newsletter_subscribers SET mailerlite_id = $1, mailerlite_synced_at = now() WHERE id = $2`,
        [ml.id, row.id],
      );
      synced++;
    }
  }
  return { ok: true, pending: rows.length, synced };
}

/* ─── Shared person registry ───────────────────────────────────────────── */

async function upsertContact(env, { email, name, source }) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] || null;
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : null;
  const rows = await sql(
    env,
    `INSERT INTO contacts (email, first_name, last_name, source)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE
       SET first_name = COALESCE(contacts.first_name, EXCLUDED.first_name),
           last_name  = COALESCE(contacts.last_name,  EXCLUDED.last_name)
     RETURNING id`,
    [email, firstName, lastName, source],
  );
  return rows[0].id;
}

/* ─── Neon (HTTP SQL) ──────────────────────────────────────────────────── */

async function sql(env, query, params) {
  const host = new URL(env.DATABASE_URL.replace(/^postgres(ql)?:/, "https:")).host;
  const res = await fetch(`https://${host}/sql`, {
    method: "POST",
    headers: {
      "Neon-Connection-String": env.DATABASE_URL,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, params }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data || data.message) {
    console.error("neon error:", res.status, data && data.message);
    throw new HttpError(500, "db_error");
  }
  return data.rows || [];
}

/* ─── MailerLite ───────────────────────────────────────────────────────── */

// Upsert a subscriber (MailerLite's POST /subscribers is idempotent by email).
// Returns { id } on success, null when the key is missing or the call fails —
// callers leave the row unsynced so /v1/admin/sync-mailerlite can retry.
async function mailerliteUpsert(env, email) {
  if (!env.MAILERLITE_API_KEY) return null;
  const payload = { email, status: "active" };
  if (env.MAILERLITE_GROUP_ID) payload.groups = [env.MAILERLITE_GROUP_ID];
  try {
    const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.MAILERLITE_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("mailerlite error:", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    return { id: data && data.data && data.data.id ? String(data.data.id) : null };
  } catch (e) {
    console.error("mailerlite fetch failed:", e);
    return null;
  }
}

/* ─── Brevo ────────────────────────────────────────────────────────────── */

function notifyRecipients(env) {
  const emails = [...new Set([env.NOTIFY_EMAIL].filter(Boolean))];
  return emails.map((email) => ({ email }));
}

// Returns true on success. Never throws — a mail outage must not fail a form.
async function sendBrevo(env, { to, subject, htmlContent, replyTo }) {
  if (!env.BREVO_API_KEY) {
    console.warn("BREVO_API_KEY not set — skipping send");
    return false;
  }
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": env.BREVO_API_KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: env.SENDER_EMAIL, name: env.SENDER_NAME },
        to,
        replyTo,
        subject,
        htmlContent,
      }),
    });
    if (!res.ok) {
      console.error("brevo error:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("brevo fetch failed:", e);
    return false;
  }
}

/* ─── Email templates (paper/ink, ember accent — matches bitroot.org) ──── */

const EMBER = "#c2410c";

function shell(inner, footer = "Bitroot &middot; bitroot.org") {
  return `<div style="margin:0;padding:32px 16px;background:#f7f6f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#fffdf9;border:1px solid #e8e5de;border-radius:16px;overflow:hidden;">
      <div style="height:3px;background:linear-gradient(90deg,${EMBER},rgba(194,65,12,0.25),transparent);"></div>
      <div style="padding:32px;">${inner}</div>
    </div>
    <p style="max-width:520px;margin:16px auto 0;text-align:center;font-size:12px;color:#9a958a;">${footer}</p>
  </div>`;
}

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function signoff() {
  return `<p style="margin:28px 0 2px;font-size:15px;line-height:1.6;color:#57534e;">Talk soon,</p>
    <p style="margin:0;font-family:'Segoe Script','Bradley Hand','Snell Roundhand','Brush Script MT',cursive;font-size:30px;line-height:1.1;color:${EMBER};">Yash</p>
    <p style="margin:6px 0 0;font-size:13px;color:#9a958a;">Yash Thakur &middot; Founder, Bitroot</p>`;
}

function welcomeHtml() {
  return shell(`
    <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${EMBER};">~/ the weekly dispatch</p>
    <h1 style="margin:0 0 16px;font-size:26px;line-height:1.25;color:#1c1917;">You&rsquo;re on the list. 🎉</h1>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#57534e;">
      One email, every Sunday: what we shipped, what broke, and what&rsquo;s new in the toolbox. No fluff, no lifestyle takes.
    </p>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#57534e;">
      Until then, the full archive is public at <a href="https://bitroot.org/newsletter/" style="color:${EMBER};">bitroot.org/newsletter</a> &mdash; no gates, permanent URLs.
    </p>
    <p style="margin:0;font-size:13px;line-height:1.55;color:#9a958a;">Change your mind later? Every issue has a one-click unsubscribe.</p>
    ${signoff()}
  `);
}

function earlyAccessHtml({ firstName, productName, programName }) {
  return shell(`
    <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${EMBER};">Request received</p>
    <h1 style="margin:0 0 16px;font-size:26px;line-height:1.25;color:#1c1917;">You&rsquo;re in the queue, ${esc(firstName)}.</h1>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#57534e;">
      Your <strong style="color:#1c1917;">${esc(programName)}</strong> request for <strong style="color:#1c1917;">${esc(productName)}</strong> is logged. Here&rsquo;s what happens next:
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:11px 0;font-size:14px;line-height:1.5;color:#57534e;border-bottom:1px solid #eee9e0;"><strong style="color:#1c1917;">Today</strong> &middot; Your request is in the review queue.</td></tr>
      <tr><td style="padding:11px 0;font-size:14px;line-height:1.5;color:#57534e;border-bottom:1px solid #eee9e0;"><strong style="color:#1c1917;">Within 7 days</strong> &middot; Your access link lands in this inbox.</td></tr>
      <tr><td style="padding:11px 0;font-size:14px;line-height:1.5;color:#57534e;"><strong style="color:#1c1917;">Need it sooner?</strong> &middot; Just reply to this email &mdash; it reaches a human.</td></tr>
    </table>
    ${signoff()}
  `);
}

function contactAckHtml({ firstName }) {
  return shell(`
    <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${EMBER};">Message received</p>
    <h1 style="margin:0 0 16px;font-size:26px;line-height:1.25;color:#1c1917;">Thanks, ${esc(firstName)} &mdash; we&rsquo;ve got it.</h1>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#57534e;">
      Your message is in our inbox and a real person will reply within one business day. If anything is urgent, reply to this email and it jumps the queue.
    </p>
    ${signoff()}
  `);
}

function internalHtml(title, fields) {
  const row = ([label, value]) =>
    value
      ? `<tr><td style="padding:8px 12px 8px 0;font-size:13px;color:#9a958a;white-space:nowrap;vertical-align:top;">${esc(label)}</td><td style="padding:8px 0;font-size:14px;color:#1c1917;white-space:pre-wrap;">${esc(value)}</td></tr>`
      : "";
  return shell(
    `<p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${EMBER};">${esc(title)}</p>
     <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">${fields.map(row).join("")}</table>`,
    "Source &middot; bitroot.org &mdash; sent from the bitroot.org website",
  );
}

/* ─── Small helpers ────────────────────────────────────────────────────── */

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function normEmail(v) {
  const email = String(v || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254 ? email : null;
}

function str(v, max) {
  const s = String(v || "").trim();
  return s ? s.slice(0, max) : null;
}

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : "https://bitroot.org";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}
