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
          subject: "Welcome to Bitroot — a letter from Yash",
          htmlContent: welcomeHtml(),
        });
        if (sent) {
          await sql(
            env,
            `UPDATE newsletter_subscribers SET welcome_email_sent_at = now() WHERE id = $1`,
            [sub.id],
          );
        }
        // welcome_email_sent_at doubles as the "already notified" marker so
        // repeat submits of the same address don't re-notify.
        await sendBrevo(env, {
          to: notifyRecipients(env),
          replyTo: { email },
          subject: `New sign up: newsletter on ${siteDomain(site)}`,
          textContent: internalText("newsletter", siteDomain(site), [
            ["Email", email],
            ["Location", location],
          ]),
        });
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
          subject: `New sign up: early access on ${siteDomain("org")}`,
          textContent: internalText("early access", siteDomain("org"), [
            ["Name", name],
            ["Email", email],
            ["Product", productName],
            ["Program", programName],
            ["Handle", handle],
            ["Context", context],
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
        htmlContent: contactAckHtml({
          firstName: (name || "").split(/\s+/)[0] || "there",
          topic,
          message,
        }),
      }),
      sendBrevo(env, {
        to: notifyRecipients(env),
        replyTo: { email, name: name || undefined },
        subject: `New sign up: contact form on ${siteDomain("org")}`,
        textContent: internalText("contact form", siteDomain("org"), [
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

// Map a `site` capture value to the domain shown in internal notifications.
function siteDomain(site) {
  const domains = {
    org: "bitroot.org",
    club: "bitroot.club",
    blog: "bitroot.org/blog",
    platter: "bitroot.org/platter",
  };
  return domains[site] || site || "bitroot.org";
}

function notifyRecipients(env) {
  const emails = [...new Set([env.NOTIFY_EMAIL].filter(Boolean))];
  return emails.map((email) => ({ email }));
}

// Returns true on success. Never throws — a mail outage must not fail a form.
// Pass htmlContent for designed subscriber emails, textContent for plain
// internal notifications.
async function sendBrevo(env, { to, subject, htmlContent, textContent, replyTo }) {
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
        ...(htmlContent ? { htmlContent } : {}),
        ...(textContent ? { textContent } : {}),
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

// Brand primary (matches the logo mark).
const BRAND = "#1c77f5";
const INK = "#1c1917";
const INK_SOFT = "#57534e";
const INK_FAINT = "#9a958a";
const LINE = "#e8e5de";
// Brand faces with graceful fallbacks. The @import in shell() loads them in
// clients that allow remote fonts (Apple Mail/iOS); Gmail et al. fall back
// to the system stacks below.
const DISPLAY =
  "'Funnel Display',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const SANS =
  "'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO =
  "'Geist Mono','SF Mono',SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";
const SERIF = "'Instrument Serif',Georgia,'Times New Roman',serif";
const FONTS_CSS = `<style type="text/css">@import url('https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Geist:wght@400..800&family=Geist+Mono:wght@400..600&family=Instrument+Serif:ital@0;1&display=swap');</style>`;
// Served from the static site (email clients don't render SVG).
const LOGO_URL = "https://bitroot.org/images/email/bitroot-logo.png";

// Shared frame: paper background, one card, logo lockup over a dashed rule,
// terminal-style eyebrow. Tables + inline styles only (Outlook/Gmail safe).
function shell({ eyebrow, inner, footnote }) {
  return `${FONTS_CSS}<div style="margin:0;padding:36px 16px;background:#f4f2ed;font-family:${SANS};">
    <table role="presentation" align="center" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;margin:0 auto;">
      <tr><td>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fffdf9;border:1px solid ${LINE};border-radius:18px;">
          <tr><td style="padding:28px 36px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="36" style="vertical-align:middle;"><img src="${LOGO_URL}" width="32" height="32" alt="Bitroot" style="display:block;border:0;border-radius:8px;" /></td>
                <td style="vertical-align:middle;padding-left:10px;font-family:${DISPLAY};font-size:16px;font-weight:700;letter-spacing:-0.01em;color:${INK};">bitroot<span style="color:${BRAND};">.org</span></td>
                <td align="right" style="vertical-align:middle;font-family:${MONO};font-size:10.5px;color:${INK_FAINT};">the founder&rsquo;s toolbox</td>
              </tr>
            </table>
            <div style="margin-top:20px;border-top:1px dashed #d9d4c9;font-size:0;line-height:0;">&nbsp;</div>
          </td></tr>
          <tr><td style="padding:18px 36px 36px;">
            <p style="margin:0 0 10px;font-family:${MONO};font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${BRAND};">~/ ${eyebrow}</p>
            ${inner}
          </td></tr>
        </table>
        <p style="margin:18px 8px 0;text-align:center;font-family:${MONO};font-size:11px;line-height:1.7;color:${INK_FAINT};">
          <a href="https://bitroot.org" style="color:${BRAND};text-decoration:none;">bitroot.org</a> &mdash; free, no gates, maintained weekly${footnote ? `<br/>${footnote}` : ""}
        </p>
      </td></tr>
    </table>
  </div>`;
}

const H1 = `margin:0 0 16px;font-family:${DISPLAY};font-size:28px;line-height:1.15;font-weight:700;letter-spacing:-0.01em;color:${INK};`;
const P = `margin:0 0 18px;font-family:${SANS};font-size:15px;line-height:1.65;color:${INK_SOFT};`;

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function signoff() {
  return `<p style="margin:28px 0 2px;font-family:${SANS};font-size:15px;line-height:1.6;color:${INK_SOFT};">Talk soon,</p>
    <p style="margin:0;font-family:${SERIF};font-style:italic;font-size:28px;line-height:1.15;color:${INK};">Yash</p>
    <p style="margin:6px 0 0;font-family:${MONO};font-size:11.5px;color:${INK_FAINT};">Yash Thakur &middot; founder, Bitroot</p>`;
}

// The welcome email is a founder's letter, not a receipt — a personal note
// from Yash, what to expect, one CTA, and a "start here" map of the toolbox.
function welcomeHtml() {
  const startHere = [
    {
      label: "kits",
      title: "Clone a working starter",
      body: "Waitlists, invoices, captchas — shipped code, not boilerplate.",
      href: "https://bitroot.org/kits/",
    },
    {
      label: "guides",
      title: "Reproduce, step by step",
      body: "Every guide runs from a blank directory to a working thing.",
      href: "https://bitroot.org/guides/",
    },
    {
      label: "products",
      title: "Try the tiny apps",
      body: "Early access starts with a small cohort — grab a seat.",
      href: "https://bitroot.org/products/",
    },
  ];
  const startRows = startHere
    .map(
      (s, i) => `<tr>
        <td style="padding:12px 0;${i > 0 ? "border-top:1px solid #eee9e0;" : ""}font-family:${MONO};font-size:10.5px;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND};white-space:nowrap;padding-right:18px;vertical-align:top;">${s.label}</td>
        <td style="padding:12px 0;${i > 0 ? "border-top:1px solid #eee9e0;" : ""}">
          <a href="${s.href}" style="font-family:${SANS};font-size:14px;font-weight:600;color:${INK};text-decoration:none;">${s.title} &rarr;</a>
          <div style="font-family:${SANS};font-size:13px;line-height:1.55;color:${INK_SOFT};margin-top:2px;">${s.body}</div>
        </td>
      </tr>`,
    )
    .join("");

  return shell({
    eyebrow: "founder&rsquo;s letter",
    inner: `
    <h1 style="${H1}">Welcome to Bitroot.</h1>
    <p style="${P}">Hello &mdash; I&rsquo;m Yash. Thanks for trusting me with a slot in your inbox; I know exactly how much those cost.</p>
    <p style="${P}">
      I started bitroot.org because every useful founder resource I found had a gate in front of it &mdash; an email wall, a trial, a course at the end of the tunnel. So we built the opposite: a toolbox that&rsquo;s free, tactical, and honest about what we&rsquo;d actually use. Every kit is something we&rsquo;ve shipped. Every guide reproduces from a blank directory. That&rsquo;s the whole trick.
    </p>
    <p style="margin:0 0 10px;font-family:${MONO};font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:${INK_FAINT};">what to expect</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 24px;">
      <tr>
        <td style="padding:10px 0;border-top:1px solid #eee9e0;font-family:${MONO};font-size:11px;color:${INK_FAINT};white-space:nowrap;padding-right:16px;">sun 07:00</td>
        <td style="padding:10px 0;border-top:1px solid #eee9e0;font-family:${SANS};font-size:14px;line-height:1.5;color:${INK_SOFT};">One dispatch: what we shipped, what broke, what&rsquo;s new. No fluff, no lifestyle takes.</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-top:1px solid #eee9e0;font-family:${MONO};font-size:11px;color:${INK_FAINT};white-space:nowrap;padding-right:16px;">anytime</td>
        <td style="padding:10px 0;border-top:1px solid #eee9e0;font-family:${SANS};font-size:14px;line-height:1.5;color:${INK_SOFT};">The archive stays public at <a href="https://bitroot.org/newsletter/" style="color:${BRAND};">bitroot.org/newsletter</a> &mdash; permanent URLs, no gates.</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-top:1px solid #eee9e0;border-bottom:1px solid #eee9e0;font-family:${MONO};font-size:11px;color:${INK_FAINT};white-space:nowrap;padding-right:16px;">any issue</td>
        <td style="padding:10px 0;border-top:1px solid #eee9e0;border-bottom:1px solid #eee9e0;font-family:${SANS};font-size:14px;line-height:1.5;color:${INK_SOFT};">One-click unsubscribe, no hard feelings.</td>
      </tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
      <tr>
        <td style="border-radius:999px;background:${BRAND};">
          <a href="https://bitroot.org/" style="display:inline-block;padding:11px 26px;font-family:${SANS};font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">Open the toolbox &rarr;</a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 10px;font-family:${MONO};font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:${INK_FAINT};">start here</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 6px;">${startRows}</table>
    <p style="${P}margin-top:22px;">
      One more thing: this address takes replies, and I read them. Tell me what you&rsquo;re building &mdash; it genuinely shapes what we write next.
    </p>
    ${signoff()}`,
    footnote:
      "You&rsquo;re getting this because you subscribed at bitroot.org.",
  });
}

function earlyAccessHtml({ firstName, productName, programName }) {
  return shell({
    eyebrow: "request received",
    inner: `
    <h1 style="${H1}">You&rsquo;re in the queue, ${esc(firstName)}.</h1>
    <p style="${P}">
      Your <strong style="color:${INK};">${esc(programName)}</strong> request for <strong style="color:${INK};">${esc(productName)}</strong> is logged. Here&rsquo;s what happens next:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 4px;">
      <tr>
        <td style="padding:10px 0;border-top:1px solid #eee9e0;font-family:${MONO};font-size:11px;color:${INK_FAINT};white-space:nowrap;padding-right:16px;vertical-align:top;">today</td>
        <td style="padding:10px 0;border-top:1px solid #eee9e0;font-family:${SANS};font-size:14px;line-height:1.5;color:${INK_SOFT};">Your request is in the review queue.</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-top:1px solid #eee9e0;font-family:${MONO};font-size:11px;color:${INK_FAINT};white-space:nowrap;padding-right:16px;vertical-align:top;">&le; 7 days</td>
        <td style="padding:10px 0;border-top:1px solid #eee9e0;font-family:${SANS};font-size:14px;line-height:1.5;color:${INK_SOFT};">Your access link lands in this inbox.</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-top:1px solid #eee9e0;border-bottom:1px solid #eee9e0;font-family:${MONO};font-size:11px;color:${INK_FAINT};white-space:nowrap;padding-right:16px;vertical-align:top;">sooner?</td>
        <td style="padding:10px 0;border-top:1px solid #eee9e0;border-bottom:1px solid #eee9e0;font-family:${SANS};font-size:14px;line-height:1.5;color:${INK_SOFT};">Reply to this email &mdash; it reaches a human.</td>
      </tr>
    </table>
    ${signoff()}`,
    footnote:
      "One-off confirmation &mdash; you&rsquo;re not on a list unless you asked to be.",
  });
}

function contactAckHtml({ firstName, topic, message }) {
  const quoted = message
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
        <tr>
          <td width="3" style="background:${LINE};border-radius:3px;font-size:0;line-height:0;">&nbsp;</td>
          <td style="padding:2px 0 2px 16px;">
            <p style="margin:0 0 6px;font-family:${MONO};font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:${INK_FAINT};">your message${topic ? ` &middot; ${esc(topic)}` : ""}</p>
            <p style="margin:0;font-family:${SANS};font-size:14px;line-height:1.6;color:${INK_SOFT};white-space:pre-wrap;">${esc(message.length > 600 ? `${message.slice(0, 600)}…` : message)}</p>
          </td>
        </tr>
      </table>`
    : "";
  return shell({
    eyebrow: "message received",
    inner: `
    <h1 style="${H1}">Thanks, ${esc(firstName)} &mdash; we&rsquo;ve got it.</h1>
    <p style="${P}">
      Your message is in our inbox and a real person will reply within one business day. If anything is urgent, reply to this email and it jumps the queue.
    </p>
    ${quoted}
    ${signoff()}`,
    footnote:
      "One-off confirmation &mdash; sent because you wrote to us at bitroot.org/contact.",
  });
}

// Internal notifications: a plain typed email, nothing designed. Long or
// multi-line values drop onto their own block so the message stays readable.
function internalText(context, source, fields) {
  const lines = [];
  for (const [label, value] of fields) {
    if (!value) continue;
    const key = label.toLowerCase();
    if (String(value).length > 80 || /\n/.test(String(value))) {
      lines.push(`${key}:\n${value}`);
    } else {
      lines.push(`${`${key}:`.padEnd(10)}${value}`);
    }
  }
  return `New sign up: ${context} on ${source}\n\n${lines.join("\n")}\n\n—\nbitroot-forms · reply to this email to answer them directly`;
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
