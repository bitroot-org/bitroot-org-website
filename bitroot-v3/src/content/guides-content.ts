/**
 * Rich guide content. Guides are long-form; each node is either prose or a code block.
 * Nodes render in order inside a "reading column" layout.
 */

import type { Category } from "./data";

export type GuideNode =
  | { type: "p"; body: string }
  | { type: "h2"; body: string; id: string }
  | { type: "h3"; body: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; tone: "note" | "warn" | "tip"; body: string }
  | {
      type: "code";
      lang: string;
      filename?: string;
      source: string;
    }
  | { type: "snippet"; title?: string; body: string }
  | {
      type: "linklist";
      items: { title: string; url?: string; meta?: string; note?: string }[];
    }
  | { type: "divider" };

export type GuideReference = {
  slug: string;
  category: Category;
  note?: string;
};

export type GuideContent = {
  slug: string;
  tagline: string;
  timeEstimate: string;
  youWillNeed: string[];
  youWillEndUpWith: string;
  toc: { label: string; id: string }[];
  body: GuideNode[];
  referenced?: GuideReference[];
};

export const guidesContent: Record<string, GuideContent> = {
  "api-versioning-that-doesnt-break-clients": {
    slug: "api-versioning-that-doesnt-break-clients",
    tagline:
      "Version your API in the URL (/v1/, /v2/). Support multiple versions simultaneously for 12 months. Make changes additive, not destructive. When you deprecate, give 12-month notice. This prevents the nightmare of breaking 50 integrations.",
    timeEstimate: "20–30 minutes to set up versioned routing",
    youWillNeed: [
      "An API with at least one existing consumer (internal or external)",
      "A Node.js server (Express or similar) — the routing pattern applies to any framework",
      "A plan for where deprecation notices and migration guides will live",
    ],
    youWillEndUpWith:
      "URI-versioned routes (/v1/, /v2/) that can coexist indefinitely, an additive-changes discipline that keeps old clients working, a 12-month deprecation timeline with Deprecation/Sunset headers, usage monitoring by version, and contract tests that catch accidental breakage before it ships.",
    toc: [
      { label: "Why API versioning matters", id: "why-it-matters" },
      { label: "Versioning strategies (and why URI wins)", id: "strategies" },
      { label: "Setup, step by step", id: "setup" },
      { label: "Backward compatibility patterns", id: "compatibility" },
      { label: "Deprecation timeline (12 months standard)", id: "deprecation-timeline" },
      { label: "Real scenario: 50 integrations, multiple versions", id: "real-scenario" },
      { label: "Monitoring API usage by version", id: "monitoring" },
      { label: "Documentation for each version", id: "documentation" },
      { label: "Testing across versions", id: "testing" },
      { label: "Common mistakes", id: "mistakes" },
      { label: "Production checklist", id: "checklist" },
      { label: "Your competitive edge", id: "competitive-edge" },
    ],
    body: [
      { type: "h2", body: "Why API versioning matters", id: "why-it-matters" },
      {
        type: "p",
        body: "You build an API. 50 developers integrate it. Everything works. Then you need to change a response:",
      },
      {
        type: "code",
        lang: "js",
        source: `// Old (v1)
{ "user": { "name": "John", "email": "john@example.com" } }

// New (v2) - different structure
{ "data": { "profile": { "name": "John", "email": "john@example.com" } } }`,
      },
      {
        type: "p",
        body: "All 50 integrations break. Your support inbox explodes. Developers hate you.",
      },
      {
        type: "callout",
        tone: "tip",
        body: "API versioning prevents this. Old integrations keep using v1. New integrations use v2. No breakage.",
      },

      { type: "h2", body: "Versioning strategies (and why URI wins)", id: "strategies" },
      { type: "h3", body: "Strategy 1: URI versioning (recommended)" },
      {
        type: "code",
        lang: "js",
        source: `GET /v1/users/123
GET /v2/users/123`,
      },
      {
        type: "p",
        body: "Pros: clearest to clients (version is obvious in the URL), easy to route (separate v1 and v2 handlers), backward compatible (old URL keeps working), and standards-compliant (REST best practice). Cons: URLs look a bit verbose.",
      },
      { type: "h3", body: "Strategy 2: header versioning" },
      {
        type: "code",
        lang: "js",
        source: `GET /users/123
Header: Accept: application/vnd.company.v2+json`,
      },
      {
        type: "p",
        body: "Pros: cleaner URLs. Cons: clients forget the header, it's harder to test (need to set headers), it's less discoverable, and it's harder to route in code.",
      },
      { type: "h3", body: "Strategy 3: query parameter" },
      {
        type: "code",
        lang: "js",
        source: `GET /users/123?version=2`,
      },
      {
        type: "p",
        body: "Pros: simple. Cons: easy to forget the parameter, looks hacky, and isn't RESTful.",
      },
      {
        type: "callout",
        tone: "note",
        body: "Recommendation: use URI versioning. It's the clearest for clients and easiest to implement.",
      },

      { type: "h2", body: "Setup, step by step", id: "setup" },
      { type: "h3", body: "Step 1: organize your routes by version" },
      {
        type: "code",
        lang: "js",
        source: `const express = require('express');
const app = express();

// Separate routers for each version
const v1Routes = require('./routes/v1');
const v2Routes = require('./routes/v2');

// Mount routes with version prefix
app.use('/v1', v1Routes);
app.use('/v2', v2Routes);

// Redirect root to latest version (optional)
app.get('/api/users/:id', (req, res) => {
  res.redirect(\`/v2/api/users/\${req.params.id}\`);
});`,
      },
      { type: "h3", body: "Step 2: v1 route (legacy)" },
      {
        type: "code",
        lang: "js",
        filename: "routes/v1/index.js",
        source: `const router = require('express').Router();
const db = require('../../database');

// Old response format
router.get('/users/:id', async (req, res) => {
  const user = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at
    }
  });
});

module.exports = router;`,
      },
      { type: "h3", body: "Step 3: v2 route (new, breaking changes)" },
      {
        type: "code",
        lang: "js",
        filename: "routes/v2/index.js",
        source: `const router = require('express').Router();
const db = require('../../database');

// New response format (added fields, changed structure)
router.get('/users/:id', async (req, res) => {
  const user = await db.query(
    'SELECT id, name, email, created_at, updated_at, status FROM users WHERE id = ?',
    [req.params.id]
  );

  res.json({
    data: {
      id: user.id,
      profile: {
        name: user.name,
        email: user.email
      },
      timestamps: {
        createdAt: user.created_at,
        updatedAt: user.updated_at
      },
      status: user.status // new field
    }
  });
});

module.exports = router;`,
      },
      {
        type: "callout",
        tone: "note",
        body: "Key: v1 and v2 coexist. Old clients hit /v1. New clients hit /v2. No breakage.",
      },

      { type: "h2", body: "Backward compatibility patterns", id: "compatibility" },
      {
        type: "p",
        body: "Don't do this — a breaking change that removes the \"email\" field:",
      },
      {
        type: "code",
        lang: "js",
        source: `{
  "data": { "id": 123, "name": "John" }
}`,
      },
      {
        type: "p",
        body: "Do this instead — additive only, add a new field, keep the old ones:",
      },
      {
        type: "code",
        lang: "js",
        source: `{
  "data": { "id": 123, "name": "John", "email": "john@example.com", "phone": "+1..." }
}`,
      },
      {
        type: "p",
        body: "Why: clients ignore unknown fields. They break if you remove fields they depend on.",
      },
      { type: "h3", body: "Pattern 1: add fields (safe)" },
      {
        type: "code",
        lang: "js",
        source: `// v2.1: Added phone field
{
  "data": {
    "id": 123,
    "name": "John",
    "email": "john@example.com",
    "phone": "+1-555-0123" // new
  }
}`,
      },
      {
        type: "p",
        body: "Clients using v2.0 ignore phone. No breakage.",
      },
      { type: "h3", body: "Pattern 2: deprecate, then remove (months later)" },
      {
        type: "code",
        lang: "js",
        source: `// v2 (month 1): Include deprecated fields
{
  "data": {
    "id": 123,
    "name": "John",
    "email": "john@example.com",
    "deprecated_field": "value" // marked for removal
  }
}

// v3 (month 13): Removed deprecated_field
// Clients got 12 months notice to migrate
{
  "data": {
    "id": 123,
    "name": "John",
    "email": "john@example.com"
  }
}`,
      },

      { type: "h2", body: "Deprecation timeline (12 months standard)", id: "deprecation-timeline" },
      {
        type: "p",
        body: "Month 1: release v2. Documentation says \"v1 will be sunset December 31, 2026.\" Add a header to v1 responses: `Deprecation: true`. Add a sunset header: `Sunset: Sun, 31 Dec 2026 23:59:59 GMT`.",
      },
      {
        type: "code",
        lang: "js",
        source: `router.get('/v1/users/:id', (req, res) => {
  const user = /* ... */;

  res.set('Deprecation', 'true');
  res.set('Sunset', 'Sun, 31 Dec 2026 23:59:59 GMT');
  res.set('Link', '</v2/users/123>; rel="successor-version"');

  res.json(user);
});`,
      },
      {
        type: "ul",
        items: [
          "Month 6: send email to all v1 users — \"v1 sunset in 6 months,\" link to the migration guide, offer assistance",
          "Month 11: final warning — \"v1 sunset in 30 days,\" support email for questions",
          "Month 12: v1 shut down — all v1 requests return 410 Gone (or redirect to v2)",
        ],
      },

      { type: "h2", body: "Real scenario: 50 integrations, multiple versions", id: "real-scenario" },
      {
        type: "p",
        body: "You have 50 integrations using your API.",
      },
      {
        type: "ul",
        items: [
          "Month 1: release v2 (major changes). 30 integrations stay on v1 (not ready to migrate), 20 adopt v2 immediately. Both versions live side-by-side.",
          "Month 3: 40 integrations on v2, 10 on v1.",
          "Month 6: email sent — \"v1 sunset in 6 months.\" The last 10 integrations start migration.",
          "Month 11: 49 on v2, 1 laggard still on v1 — direct outreach to that company.",
          "Month 12: sunset v1. That 1 company had to migrate (or their integration broke, but they had notice).",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        body: "Result: no surprise breakage. Everyone had time. No angry support emails.",
      },

      { type: "h2", body: "Monitoring API usage by version", id: "monitoring" },
      {
        type: "p",
        body: "Track which clients use which version:",
      },
      {
        type: "code",
        lang: "js",
        source: `app.use((req, res, next) => {
  const version = req.path.match(/^\\/v(\\d+)/)?.[1];
  const endpoint = req.path;

  console.log({
    timestamp: new Date(),
    version,
    endpoint,
    method: req.method,
    clientIp: req.ip,
    userAgent: req.get('user-agent')
  });

  next();
});`,
      },
      {
        type: "p",
        body: "Dashboard queries: how many requests hit v1 vs v2? Are any v1 clients still active? Which endpoints are most used?",
      },
      {
        type: "p",
        body: "Alerts: if v1 traffic spikes (something broke?), or if new clients start using a deprecated version.",
      },

      { type: "h2", body: "Documentation for each version", id: "documentation" },
      {
        type: "p",
        body: "Create separate docs:",
      },
      {
        type: "code",
        lang: "md",
        source: `/docs/v1/users.md
/docs/v2/users.md
/docs/v3/users.md`,
      },
      {
        type: "p",
        body: "Each shows the endpoint, request format, response format (for that version), a deprecation notice (if any), and a migration guide to the next version.",
      },

      { type: "h2", body: "Testing across versions", id: "testing" },
      {
        type: "p",
        body: "Use contract tests to prevent surprises:",
      },
      {
        type: "code",
        lang: "js",
        filename: "test/contracts.js",
        source: `describe('API Contracts', () => {
  it('v1 users endpoint returns expected fields', async () => {
    const response = await request(app).get('/v1/users/123');

    expect(response.body).toHaveProperty('user.id');
    expect(response.body).toHaveProperty('user.name');
    expect(response.body).toHaveProperty('user.email');
  });

  it('v2 users endpoint returns expected fields', async () => {
    const response = await request(app).get('/v2/users/123');

    expect(response.body).toHaveProperty('data.id');
    expect(response.body).toHaveProperty('data.profile.name');
    expect(response.body).toHaveProperty('data.timestamps.createdAt');
  });

  it('v2 response includes deprecated_field for compatibility', async () => {
    const response = await request(app).get('/v2/users/123');

    // Verify new clients get the field
    expect(response.body.data).toHaveProperty('deprecated_field');
  });
});`,
      },
      {
        type: "p",
        body: "Why: when you write v3, contract tests ensure v2 didn't accidentally break someone.",
      },

      { type: "h2", body: "Common mistakes", id: "mistakes" },
      {
        type: "ul",
        items: [
          "No versioning — one breaking change breaks all clients. Fix: version from day 1 (/v1/).",
          "Break v1 suddenly — angry integrations, lost trust. Fix: 12-month deprecation notice.",
          "Support too many versions — code becomes unmaintainable (3+ versions = complexity). Fix: sunset old versions after 12 months.",
          "No deprecation headers — clients don't know it's ending. Fix: add Deprecation + Sunset headers.",
          "Don't document each version — clients are confused about the differences. Fix: separate docs for each version.",
          "Ignore usage analytics — you don't know who's still using the old version. Fix: monitor and alert.",
        ],
      },

      { type: "h2", body: "Production checklist", id: "checklist" },
      {
        type: "ul",
        items: [
          "Version in URL (/v1/, /v2/)",
          "Both versions documented separately",
          "Backward compatibility: only additive changes",
          "Deprecation headers on old versions (Deprecation, Sunset, Link)",
          "Deprecation notice: 12 months minimum",
          "Monitoring: track usage by version",
          "Contract tests: verify no accidental breakage",
          "Migration guide: from old to new version",
          "Support: respond to migration questions",
        ],
      },

      { type: "h2", body: "Your competitive edge", id: "competitive-edge" },
      {
        type: "p",
        body: "Founders using proper API versioning keep client trust (won't suddenly break integrations), can evolve their API confidently, avoid angry support emails about breaking changes, can deprecate old versions cleanly, and have data on which clients use what — a real strategic insight.",
      },
      {
        type: "callout",
        tone: "tip",
        body: "Start this week. If you don't have versioning yet, add /v1/ to your current API. When you need changes, create /v2/. 12-month deprecation. Everyone stays happy.",
      },
    ],
  },
  "secure-auth-jwt-refresh-rbac": {
    slug: "secure-auth-jwt-refresh-rbac",
    tagline:
      "Use JWT for stateless auth. Refresh tokens for long-lived sessions. RBAC for permissions. Store tokens in HttpOnly cookies, not localStorage. This pattern scales to millions of users without auth infrastructure complexity.",
    timeEstimate: "30–45 minutes to wire up the full flow",
    youWillNeed: [
      "A Node.js server (Express or similar) with a database for users and refresh tokens",
      "The `jsonwebtoken` package",
      "HTTPS in production (cookies rely on the `secure` flag)",
    ],
    youWillEndUpWith:
      "A complete auth flow: short-lived JWT access tokens, rotating refresh tokens stored server-side so they can be revoked, role-based permission middleware, and logout that actually invalidates sessions — all delivered via HttpOnly cookies instead of localStorage.",
    toc: [
      { label: "Why most auth fails", id: "why-auth-fails" },
      { label: "The architecture (3 pieces)", id: "architecture" },
      { label: "Setup, step by step", id: "setup" },
      { label: "Real scenario: 100K users, no auth servers", id: "real-scenario" },
      { label: "Security checklist", id: "security-checklist" },
      { label: "Common mistakes", id: "mistakes" },
      { label: "Production deployment", id: "production" },
    ],
    body: [
      { type: "h2", body: "Why most auth fails", id: "why-auth-fails" },
      {
        type: "p",
        body: "You're a founder. You build an app. You use the first auth library you find. It works in dev. In production, you face these problems: tokens expire mid-request and the user gets logged out; a token stored in localStorage gets stolen by an XSS attack; \"admin\" and \"user\" roles are hardcoded so you can't add new roles; there's no way to log out because tokens live forever; and token revocation should take milliseconds but the setup makes it take seconds, or doesn't work at all.",
      },
      {
        type: "p",
        body: "This guide fixes all of these.",
      },

      { type: "h2", body: "The architecture (3 pieces)", id: "architecture" },
      { type: "h3", body: "1. Access token (JWT, short-lived: 15 minutes)" },
      {
        type: "p",
        body: "Proves the user is who they claim. Includes user ID, role, and permissions. Signed by your server secret.",
      },
      {
        type: "code",
        lang: "js",
        source: `{
  "sub": "user-123",        // subject (user ID)
  "role": "admin",          // role for RBAC
  "permissions": ["read", "write", "delete"],
  "iat": 1693046400,        // issued at
  "exp": 1693047300         // expires in 15 minutes
}`,
      },
      {
        type: "callout",
        tone: "note",
        body: "Short-lived (15 min) means if it's stolen, the attacker has a limited window.",
      },
      { type: "h3", body: "2. Refresh token (opaque string, long-lived: 7 days)" },
      {
        type: "p",
        body: "Stored securely. Used only to get a new access token. Never shared with client-side JS.",
      },
      {
        type: "code",
        lang: "js",
        source: `{
  "sub": "user-123",
  "type": "refresh",
  "iat": 1693046400,
  "exp": 1693651200         // expires in 7 days
}`,
      },
      {
        type: "callout",
        tone: "note",
        body: "Long-lived (7 days) means users stay logged in without logging in again. Opaque means it can't be decoded by the client — that's the security property.",
      },
      { type: "h3", body: "3. RBAC (role-based access control)" },
      {
        type: "p",
        body: "Admin role can delete users. User role can't. Guest is read-only.",
      },
      {
        type: "code",
        lang: "js",
        source: `const roles = {
  admin: ['read', 'write', 'delete', 'manage_users'],
  user: ['read', 'write'],
  guest: ['read']
};`,
      },

      { type: "h2", body: "Setup, step by step", id: "setup" },
      { type: "h3", body: "Step 1: install dependencies" },
      {
        type: "code",
        lang: "bash",
        source: `npm install jsonwebtoken express-http-proxy
# jsonwebtoken for JWT generation/verification
# express for server`,
      },
      { type: "h3", body: "Step 2: generate tokens on login" },
      {
        type: "code",
        lang: "js",
        source: `const jwt = require('jsonwebtoken');

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Verify credentials (hash comparison, etc.)
  const user = await User.findByEmail(email);
  const passwordMatch = await comparePasswords(password, user.passwordHash);

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate short-lived access token
  const accessToken = jwt.sign(
    {
      sub: user.id,
      role: user.role,
      permissions: roles[user.role]
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // 15 minutes
  );

  // Generate long-lived refresh token
  const refreshToken = jwt.sign(
    {
      sub: user.id,
      type: 'refresh'
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' } // 7 days
  );

  // Store refresh token in database (can revoke later)
  await RefreshToken.create({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  // Send tokens in HttpOnly cookies (not response body)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,      // JavaScript can't read it (XSS protection)
    secure: true,        // HTTPS only (set in production)
    sameSite: 'strict',  // CSRF protection
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({ success: true });
});`,
      },
      { type: "h3", body: "Step 3: middleware to verify access token" },
      {
        type: "code",
        lang: "js",
        source: `const verifyAccessToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: 'No access token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user to request
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Use middleware on protected routes
app.get('/dashboard', verifyAccessToken, (req, res) => {
  res.json({ message: \`Welcome, \${req.user.sub}\` });
});`,
      },
      { type: "h3", body: "Step 4: refresh token endpoint" },
      {
        type: "p",
        body: "When the access token expires, the client calls this to get a new one:",
      },
      {
        type: "code",
        lang: "js",
        source: `app.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token' });
  }

  try {
    // Verify refresh token signature
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Check if token exists in database (security: can revoke tokens)
    const storedToken = await RefreshToken.findOne({
      userId: decoded.sub,
      token: refreshToken
    });

    if (!storedToken) {
      return res.status(403).json({ error: 'Token revoked' });
    }

    // Generate NEW refresh token + access token (rotation)
    const user = await User.findById(decoded.sub);

    const newAccessToken = jwt.sign(
      {
        sub: user.id,
        role: user.role,
        permissions: roles[user.role]
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
      {
        sub: user.id,
        type: 'refresh'
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Delete old refresh token, store new one (rotation = security)
    await storedToken.delete();
    await RefreshToken.create({
      userId: user.id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true });
  } catch (error) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});`,
      },
      { type: "h3", body: "Step 5: RBAC middleware" },
      {
        type: "code",
        lang: "js",
        source: `const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    next();
  };
};

// Example: Only admins can delete users
app.delete('/users/:id', verifyAccessToken, requirePermission('delete'), (req, res) => {
  // Delete user
  res.json({ message: 'User deleted' });
});`,
      },
      { type: "h3", body: "Step 6: logout (revoke refresh token)" },
      {
        type: "code",
        lang: "js",
        source: `app.post('/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  // Delete refresh token from database (can't use it anymore)
  await RefreshToken.deleteOne({ token: refreshToken });

  // Clear cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.json({ success: true });
});`,
      },

      { type: "h2", body: "Real scenario: 100K users, no auth servers", id: "real-scenario" },
      {
        type: "p",
        body: "Your SaaS has 100K users. You use this auth pattern.",
      },
      {
        type: "p",
        body: "Benefits: no session storage server needed (stateless JWT), no database query on every request (the token is verified locally), no server-side session state to sync across 10 instances, and it scales horizontally — add servers, auth keeps working. Token revocation (logout) works instantly (delete from the database), and the attack surface stays small since tokens are short-lived (15 min max damage if stolen).",
      },
      {
        type: "callout",
        tone: "tip",
        body: "Cost: JWT generation + refresh token storage. Nothing else.",
      },

      { type: "h2", body: "Security checklist", id: "security-checklist" },
      {
        type: "ul",
        items: [
          "Access tokens short-lived (15 min)",
          "Refresh tokens stored in database (can revoke)",
          "Tokens in HttpOnly cookies (XSS protection)",
          "Tokens signed (can't tamper with)",
          "HTTPS only (prevent man-in-the-middle)",
          "SameSite cookie flag (CSRF protection)",
          "Refresh token rotation (old token deleted, new one issued)",
          "Logout deletes refresh token (can't reuse)",
          "RBAC prevents unauthorized actions",
        ],
      },

      { type: "h2", body: "Common mistakes", id: "mistakes" },
      {
        type: "ul",
        items: [
          "Store token in localStorage — an XSS attack becomes a total compromise. Fix: use HttpOnly cookies.",
          "Access token expires at login — a mid-request logout is bad UX. Fix: use refresh tokens (7 days).",
          "Refresh token never expires — a stolen token becomes permanent access. Fix: expire the refresh token (7 days).",
          "Don't rotate refresh tokens — a compromised token is never invalidated. Fix: rotate — issue new, delete old.",
          "Store password in JWT — an attacker can decode the password. Fix: never store sensitive data in the token.",
          "No RBAC — everyone is admin. Fix: implement roles + permissions.",
          "Store secrets in code — secrets leak in GitHub. Fix: use environment variables.",
        ],
      },

      { type: "h2", body: "Production deployment", id: "production" },
      {
        type: "code",
        lang: "dotenv",
        filename: ".env",
        source: `JWT_SECRET=your-secret-key-here-64-chars-minimum
REFRESH_TOKEN_SECRET=another-secret-key-here-64-chars-minimum
NODE_ENV=production`,
      },
      {
        type: "p",
        body: "On your server: use strong secrets (64+ random characters), rotate secrets quarterly (reissue all tokens), monitor failed login attempts (alert on suspicious activity), track token refresh frequency (a spike can mean a potential breach), and implement rate limiting on `/login` to prevent brute force.",
      },
    ],
  },
  "upload-files-directly-to-s3": {
    slug: "upload-files-directly-to-s3",
    tagline:
      "Don't proxy file uploads through your server. Generate pre-signed S3 URLs, let users upload directly to S3. Your server stays fast, bandwidth costs drop, and uploads don't block requests.",
    timeEstimate: "10 minutes to set up",
    youWillNeed: [
      "An AWS account with an S3 bucket",
      "AWS credentials with permission to sign S3 PUT requests",
      "A Node.js server (Express or similar) and a browser-side upload form",
    ],
    youWillEndUpWith:
      "File uploads that go straight from the browser to S3 — your server generates a pre-signed URL and never touches the file itself, plus patterns for validation, multipart uploads for large files, client-side image compression, and a production checklist.",
    toc: [
      { label: "The bandwidth problem", id: "the-problem" },
      { label: "How pre-signed URLs work", id: "how-it-works" },
      { label: "Setup (10 minutes)", id: "setup" },
      { label: "Real scenario: product photos at scale", id: "real-scenario" },
      { label: "Security: don't let users upload anything", id: "security" },
      { label: "Multipart uploads for large files", id: "multipart" },
      { label: "Image optimization before upload", id: "image-optimization" },
      { label: "Monitoring & verification", id: "monitoring" },
      { label: "Production checklist", id: "checklist" },
      { label: "Your competitive edge", id: "competitive-edge" },
    ],
    body: [
      { type: "h2", body: "The bandwidth problem", id: "the-problem" },
      {
        type: "p",
        body: "You build a SaaS for ecommerce founders. Users upload product images. Your code does this:",
      },
      {
        type: "code",
        lang: "js",
        source: `app.post('/upload', async (req, res) => {
  const file = req.files.image; // Receives file from client
  await s3.upload({
    Bucket: 'my-bucket',
    Key: \`products/\${file.name}\`,
    Body: file.data // Entire file flows through your server
  }).promise();
  res.json({ url: s3Url });
});`,
      },
      {
        type: "p",
        body: "Problems: a 100 MB image ties up your server for 10+ seconds. Bandwidth between client → server → S3 is wasteful (double the traffic). If the upload fails mid-transfer, your server crashes. Your server's internet connection becomes the bottleneck. File size is limited by server memory, so you can't handle 1GB videos.",
      },
      {
        type: "callout",
        tone: "warn",
        body: "Your AWS bill goes crazy. Your server becomes a pipe. Better way: send the file directly from browser to S3. Your server never touches it.",
      },

      { type: "h2", body: "How pre-signed URLs work", id: "how-it-works" },
      {
        type: "p",
        body: "Pre-signed URLs are temporary permission tokens. They say: \"Client can upload this file to this S3 bucket, for the next 15 minutes.\"",
      },
      {
        type: "p",
        body: "The flow: the client calls your API (\"I want to upload product.jpg\"), your server generates a pre-signed URL (no file involved), the client uploads directly to S3 using that URL, S3 confirms the upload and the client gets confirmation. Your server never saw the file.",
      },
      {
        type: "callout",
        tone: "tip",
        body: "Result: your server does 1 second of work (generate URL). S3 handles the heavy lifting.",
      },

      { type: "h2", body: "Setup (10 minutes)", id: "setup" },
      { type: "h3", body: "Step 1: AWS credentials" },
      {
        type: "code",
        lang: "js",
        source: `const AWS = require('aws-sdk');
// OR for newer projects
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});`,
      },
      { type: "h3", body: "Step 2: generate pre-signed URL" },
      {
        type: "code",
        lang: "js",
        source: `app.post('/api/upload-url', async (req, res) => {
  const { fileName, fileType } = req.body;

  // Validate file type (security)
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(fileType)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }

  try {
    // Generate URL (expires in 15 minutes)
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: \`uploads/\${Date.now()}-\${fileName}\`, // unique key
      ContentType: fileType,
      Metadata: {
        userId: req.user.id // track who uploaded
      }
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 900 // 15 minutes
    });

    res.json({ presignedUrl, key: command.input.Key });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`,
      },
      { type: "h3", body: "Step 3: browser upload (JavaScript)" },
      {
        type: "code",
        lang: "js",
        source: `// User selects file in form
const fileInput = document.getElementById('file-input');

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];

  // Step 1: Get pre-signed URL from your server
  const urlResponse = await fetch('/api/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type
    })
  });

  const { presignedUrl, key } = await urlResponse.json();

  // Step 2: Upload directly to S3 (no server proxy)
  const uploadResponse = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file // file goes straight to S3
  });

  if (uploadResponse.ok) {
    console.log('File uploaded to S3');
    // Store key in your database
    await fetch('/api/confirm-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileKey: key })
    });
  }
});`,
      },
      {
        type: "p",
        body: "That's it. Your server never touches the file.",
      },

      { type: "h2", body: "Real scenario: product photos at scale", id: "real-scenario" },
      {
        type: "p",
        body: "Ecommerce founder. 1,000 sellers uploading 5 product images each per week = 5,000 images/week.",
      },
      {
        type: "p",
        body: "Before (server proxy): 5,000 images × 2 MB average = 10 GB of data flowing through your server. Server bandwidth: 10 GB/week. Hosting costs are high (data transfer out of your hosting provider). Uploads are slow — users wait 5–10 seconds per image. And there's real risk: the server can crash mid-upload, causing data loss.",
      },
      {
        type: "p",
        body: "After (direct S3): direct S3 uploads mean no server bandwidth waste. Hosting costs are just compute for API calls (negligible). Uploads are fast — 1–2 seconds, direct to S3, no proxy. And it's reliable — S3 handles retries, your server stays up.",
      },
      {
        type: "callout",
        tone: "tip",
        body: "Savings: roughly $200–500/month in bandwidth costs. Happier users (faster uploads).",
      },

      { type: "h2", body: "Security: don't let users upload anything", id: "security" },
      {
        type: "p",
        body: "Bad — anyone can upload any file size, any type:",
      },
      {
        type: "code",
        lang: "js",
        source: `const presignedUrl = await getSignedUrl(s3Client, command, {
  expiresIn: 900
});`,
      },
      {
        type: "p",
        body: "Good — validate everything:",
      },
      {
        type: "code",
        lang: "js",
        source: `const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'video/mp4'];

if (req.body.fileSize > MAX_FILE_SIZE) {
  return res.status(400).json({ error: 'File too large' });
}

if (!ALLOWED_TYPES.includes(req.body.fileType)) {
  return res.status(400).json({ error: 'Invalid file type' });
}

// Add ContentLength policy to prevent overflow
const command = new PutObjectCommand({
  Bucket: process.env.AWS_S3_BUCKET,
  Key: \`uploads/\${Date.now()}-\${sanitizeFileName(fileName)}\`,
  ContentType: fileType,
  // Reject if uploaded file size doesn't match expected
  Metadata: { userId: req.user.id, expectedSize: req.body.fileSize }
});`,
      },

      { type: "h2", body: "Multipart uploads for large files", id: "multipart" },
      {
        type: "p",
        body: "For files >100 MB, use multipart uploads (resumable, chunked processing).",
      },
      {
        type: "code",
        lang: "js",
        source: `const { CreateMultipartUploadCommand, UploadPartCommand } = require('@aws-sdk/client-s3');

app.post('/api/multipart-upload', async (req, res) => {
  const { fileName, fileType, fileSize } = req.body;

  try {
    // Initiate multipart upload
    const multipartUpload = await s3Client.send(
      new CreateMultipartUploadCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: \`uploads/\${Date.now()}-\${fileName}\`,
        ContentType: fileType
      })
    );

    // Return upload ID + pre-signed URLs for each part
    const uploadId = multipartUpload.UploadId;
    const partSize = 5 * 1024 * 1024; // 5 MB chunks
    const numParts = Math.ceil(fileSize / partSize);

    const presignedUrls = [];
    for (let i = 0; i < numParts; i++) {
      const command = new UploadPartCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: multipartUpload.Key,
        UploadId: uploadId,
        PartNumber: i + 1 // S3 requires 1-based indexing
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      presignedUrls.push(url);
    }

    res.json({ uploadId, presignedUrls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`,
      },
      {
        type: "p",
        body: "Browser uploads each part in parallel. Resume if one fails.",
      },

      { type: "h2", body: "Image optimization before upload", id: "image-optimization" },
      {
        type: "p",
        body: "Resize/compress images on the client before uploading (save bandwidth even more).",
      },
      {
        type: "code",
        lang: "js",
        source: `// Using canvas API
async function compressImage(file, maxWidth = 1200) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Scale down
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Compress (quality 0.8 = good balance)
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}`,
      },
      {
        type: "callout",
        tone: "note",
        body: "Result: a 2 MB image becomes a 300 KB image before upload. Massive bandwidth savings.",
      },

      { type: "h2", body: "Monitoring & verification", id: "monitoring" },
      {
        type: "p",
        body: "After the S3 upload, verify it worked:",
      },
      {
        type: "code",
        lang: "js",
        source: `app.post('/api/confirm-upload', async (req, res) => {
  const { fileKey } = req.body;

  try {
    // Check if file exists in S3
    const headCommand = new HeadObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileKey
    });

    const response = await s3Client.send(headCommand);

    // Store in database
    await Upload.create({
      userId: req.user.id,
      s3Key: fileKey,
      fileSize: response.ContentLength,
      uploadedAt: new Date()
    });

    res.json({
      success: true,
      url: \`https://\${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/\${fileKey}\`
    });
  } catch (error) {
    res.status(400).json({ error: 'File not found in S3' });
  }
});`,
      },

      { type: "h2", body: "Production checklist", id: "checklist" },
      {
        type: "ul",
        items: [
          "Pre-signed URLs expire quickly (15 minutes max)",
          "Validate file type, size on server before generating URL",
          "Use unique file names (timestamp + random)",
          "Store file metadata in database (linking to user)",
          "Enable S3 versioning (recover from accidental deletes)",
          "Set bucket policy to private (no public access)",
          "Monitor S3 costs (can spike if abuse isn't caught)",
          "Log uploads for an audit trail",
        ],
      },

      { type: "h2", body: "Your competitive edge", id: "competitive-edge" },
      {
        type: "p",
        body: "Founders using direct S3 uploads get 10x faster uploads (no server proxy), 10x lower bandwidth costs, and can handle large files (1GB videos, no problem). The server stays responsive (no blocked requests), and it scales to millions of uploads without infrastructure changes.",
      },
      {
        type: "callout",
        tone: "tip",
        body: "Start this week. Pick pre-signed URLs. You'll save money immediately.",
      },
    ],
  },
  "background-jobs-that-actually-run": {
    slug: "background-jobs-that-actually-run",
    tagline:
      "Don't handle long tasks in your request handler. Use Bull to queue jobs, process them in the background, retry on failure, and monitor everything. This one pattern fixes 80% of \"mysterious\" failures in production.",
    timeEstimate: "5 minutes to set up, an afternoon to do it properly",
    youWillNeed: [
      "A Node.js app with an HTTP route that currently does slow work inline (email, PDF generation, webhooks, etc.)",
      "Redis (Docker locally, a managed service in production)",
      "5 minutes for the basic setup",
    ],
    youWillEndUpWith:
      "Background jobs that don't block requests, retry automatically with exponential backoff, survive crashes because they persist in Redis, and give you full visibility through Bull Board — plus the patterns for recurring, delayed, and priority jobs, and a production checklist.",
    toc: [
      { label: "The silent failure problem", id: "the-problem" },
      { label: "What Bull does, in 60 seconds", id: "what-bull-does" },
      { label: "Setup (5 minutes)", id: "setup" },
      { label: "Example: an email job that works", id: "example-email-job" },
      { label: "The real scenario: 10K emails/day", id: "10k-emails" },
      { label: "Common patterns", id: "common-patterns" },
      { label: "Monitoring (Bull Board)", id: "monitoring" },
      { label: "Mistakes to avoid", id: "mistakes" },
      { label: "Production checklist", id: "checklist" },
      { label: "Your competitive edge", id: "competitive-edge" },
    ],
    body: [
      { type: "h2", body: "The silent failure problem", id: "the-problem" },
      {
        type: "p",
        body: "Your customer signs up. Your app is supposed to send a welcome email. But the email service is slow (2 seconds). So you do this:",
      },
      {
        type: "code",
        lang: "js",
        source: `app.post('/signup', async (req, res) => {
  const user = await User.create(req.body);
  await sendEmail(user.email, 'Welcome!'); // Blocks request
  res.json({ success: true });
});`,
      },
      {
        type: "p",
        body: "Problems: the customer waits 2+ seconds for a response (bad UX). If the email service is down, the entire signup fails. If your app crashes mid-send, the request is lost. There's no retry if the email fails the first time, and no visibility into what happened.",
      },
      {
        type: "p",
        body: "This is why background jobs exist.",
      },

      { type: "h2", body: "What Bull does, in 60 seconds", id: "what-bull-does" },
      {
        type: "p",
        body: "Bull is a Redis-backed job queue. Think of it like a todo list that runs in the background (doesn't block requests), retries automatically (email fails? try again in 60 seconds), survives crashes (jobs persist in Redis), and shows you everything that happened (built-in monitoring).",
      },
      {
        type: "p",
        body: "The flow: a request comes in, you enqueue a job, and respond to the user immediately. A Bull worker picks up the job, processes it, and marks it complete or schedules a retry. If it fails, it retries with exponential backoff (10s, 60s, 600s). If it fails 10 times, it moves to a dead-letter queue that you handle manually.",
      },

      { type: "h2", body: "Setup (5 minutes)", id: "setup" },
      { type: "h3", body: "Step 1: install & start Redis" },
      {
        type: "code",
        lang: "bash",
        source: `# Local development (Docker)
docker run -d -p 6379:6379 redis:latest

# Production: Use managed Redis (AWS ElastiCache, Upstash, Redis Cloud)`,
      },
      { type: "h3", body: "Step 2: install Bull" },
      {
        type: "code",
        lang: "bash",
        source: `npm install bull redis
# OR for newer projects
npm install bullmq redis`,
      },
      {
        type: "callout",
        tone: "note",
        body: "Bull = older, stable. BullMQ = newer, cleaner API. Both work; this guide uses Bull for compatibility.",
      },
      { type: "h3", body: "Step 3: create your first queue" },
      {
        type: "code",
        lang: "js",
        source: `const Queue = require('bull');
const redis = require('redis');

// Create queue (connects to Redis automatically)
const emailQueue = new Queue('emails', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

module.exports = emailQueue;`,
      },

      { type: "h2", body: "Example: an email job that works", id: "example-email-job" },
      { type: "h3", body: "Enqueue (in your route handler)" },
      {
        type: "code",
        lang: "js",
        source: `const emailQueue = require('./queues/emailQueue');

app.post('/signup', async (req, res) => {
  const user = await User.create(req.body);

  // Add job to queue (returns immediately)
  await emailQueue.add(
    { email: user.email, name: user.name }, // job data
    {
      attempts: 3,                    // retry 3 times
      backoff: {                      // wait longer each time
        type: 'exponential',
        delay: 2000                   // start at 2 seconds
      },
      removeOnComplete: true          // clean up after success
    }
  );

  res.json({ success: true }); // respond immediately
});`,
      },
      { type: "h3", body: "Process (in a separate worker)" },
      {
        type: "code",
        lang: "js",
        source: `const emailQueue = require('./queues/emailQueue');
const { sendEmail } = require('./email');

// Define how to process jobs
emailQueue.process(async (job) => {
  const { email, name } = job.data;

  try {
    console.log(\`Sending email to \${email}...\`);
    await sendEmail(email, \`Welcome, \${name}!\`);
    return { success: true }; // marks job complete
  } catch (error) {
    console.error(\`Email failed: \${error.message}\`);
    throw error; // triggers retry (Bull handles it)
  }
});

// Optional: Listen to job events
emailQueue.on('completed', (job) => {
  console.log(\`Email sent to \${job.data.email}\`);
});

emailQueue.on('failed', (job, err) => {
  console.error(\`Email failed after retries: \${job.data.email}\`);
  // Could send to Slack, log to monitoring tool, etc.
});`,
      },
      { type: "h3", body: "Run the worker" },
      {
        type: "code",
        lang: "bash",
        source: `# In a separate terminal/process
node worker.js`,
      },
      {
        type: "p",
        body: "That's it. Your app now handles emails safely, retries on failure, and has full visibility.",
      },

      { type: "h2", body: "The real scenario: 10K emails/day", id: "10k-emails" },
      {
        type: "p",
        body: "Let's say you send 10,000 welcome + promotional emails daily.",
      },
      {
        type: "p",
        body: "Without jobs (the naive approach): requests time out (email service is slow), the email service going down takes your entire app down with it, there's no way to track failures, and you can't retry selectively.",
      },
      {
        type: "p",
        body: "With Bull:",
      },
      {
        type: "code",
        lang: "js",
        source: `// Daily email campaign
const emailQueue = new Queue('emails', { redis });

// Enqueue 10K jobs at once (returns in milliseconds)
app.post('/campaign/send', async (req, res) => {
  const users = await User.findAll();

  // Add all jobs at once
  const jobs = await emailQueue.addBulk(
    users.map(user => ({
      name: \`send-to-\${user.id}\`,
      data: { email: user.email, campaignId: req.body.campaignId },
      opts: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 }
      }
    }))
  );

  res.json({ queued: jobs.length }); // Done in <1 second
});

// Process: handle 10 emails concurrently
emailQueue.process(10, async (job) => {
  return sendEmail(job.data.email, 'Special offer...');
});

// Monitoring
emailQueue.on('failed', (job, err) => {
  // Log failures for analysis
  console.log(\`Failed: \${job.data.email} - \${err.message}\`);
  // Send alert if 10%+ are failing
});`,
      },
      {
        type: "callout",
        tone: "tip",
        body: "Result: 10K emails queued in <1 second. Processed at 10/second = 1000 seconds (17 minutes). If an email fails, retry automatically. If the email service recovers, retried emails eventually send. Zero data loss.",
      },

      { type: "h2", body: "Common patterns", id: "common-patterns" },
      { type: "h3", body: "Recurring jobs (every hour)" },
      {
        type: "code",
        lang: "js",
        source: `emailQueue.add(
  { task: 'cleanup-old-files' },
  {
    repeat: {
      every: 3600000 // milliseconds (1 hour)
    }
  }
);`,
      },
      { type: "h3", body: "Delayed jobs (send tomorrow)" },
      {
        type: "code",
        lang: "js",
        source: `emailQueue.add(
  { email: user.email },
  {
    delay: 86400000 // milliseconds (1 day)
  }
);`,
      },
      { type: "h3", body: "Priority jobs (VIP emails first)" },
      {
        type: "code",
        lang: "js",
        source: `// High priority: 1 (lower number = higher priority)
emailQueue.add(job, { priority: 1 });

// Low priority: 10
emailQueue.add(job, { priority: 10 });

// Process respects priority order
emailQueue.process(async (job) => { /* ... */ });`,
      },

      { type: "h2", body: "Monitoring (Bull Board)", id: "monitoring" },
      {
        type: "p",
        body: "See what's happening in real time:",
      },
      {
        type: "code",
        lang: "js",
        source: `const { createBullBoard } = require('@bull-board/api');
const { ExpressAdapter } = require('@bull-board/express');

const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [emailQueue, smsQueue, pdfQueue],
  serverAdapter
});

app.use('/admin/queues', serverAdapter.getRouter());`,
      },
      {
        type: "p",
        body: "Visit `http://localhost:3000/admin/queues` to see pending jobs (waiting to run), active jobs (currently processing), completed jobs, failed jobs, and the retry timeline.",
      },

      { type: "h2", body: "Mistakes to avoid", id: "mistakes" },
      {
        type: "ul",
        items: [
          "No retries — job fails once, data loss. Fix: set `attempts: 3+`.",
          "Unlimited retries — a broken job retries forever. Fix: set a max attempts plus a dead-letter queue.",
          "Process crashes, no recovery — jobs lost if the app crashes. Fix: use PM2/Docker to restart the worker.",
          "Single worker thread — can't handle volume. Fix: run `process(10, job)` for concurrency.",
          "No monitoring — silent failures in production. Fix: use Bull Board or log to a monitoring service.",
          "Processing the same job twice — double-charges, duplicate data. Fix: use idempotency keys (store processed job IDs).",
        ],
      },

      { type: "h2", body: "Production checklist", id: "checklist" },
      {
        type: "ul",
        items: [
          "Redis: use a managed service (not your app server)",
          "Worker: run in a separate process/container",
          "Monitoring: Bull Board or send alerts to Slack",
          "Logging: log every job completion + failure",
          "Retries: set sensible backoff (exponential, not instant)",
          "Dead-letter: handle jobs that fail all retries",
          "Scaling: run multiple workers on multiple servers if needed",
        ],
      },

      { type: "h2", body: "Your competitive edge", id: "competitive-edge" },
      {
        type: "p",
        body: "Founders using job queues don't lose customer data (retries work), scale to 10K events/day without breaking, know exactly what happened (monitoring), and ship faster (background processing means simpler code).",
      },
    ],
  },
  "market-your-side-project": {
    slug: "market-your-side-project",
    tagline:
      "Most indie projects fail not because they're low quality, but because zero people know they exist. This guide fixes that — find low-competition keywords (KD ≤ 10, volume ≥ 1,000) that rank in weeks, not months, then turn that traffic into email subscribers and paying customers with a no-code stack.",
    timeEstimate: "4–6 hours for the keyword research phase, 4–6 weeks to see it compound",
    youWillNeed: [
      "Ahrefs account ($29+/month for Starter, or $129+/month for Lite)",
      "Feather.blog account (free to start, publish blogs fast)",
      "Email tool: Bento ($29/month) or free alternatives like Brevo or Mailchimp",
      "Cal.com for booking calls (free tier available)",
      "Notion or a spreadsheet for tracking keywords",
      "4–6 hours of your time (keyword research phase)",
    ],
    youWillEndUpWith:
      "20–30 low-competition keywords ready for content, a clear CTA strategy (traffic flows to email, bookings, or product), a publishing pipeline (blog → email list → conversions), and a realistic 4–6 week path to top-10 rankings — long-tail keywords appear in 7–14 days, primary keywords in 2–4 weeks.",
    toc: [
      { label: "Workflow 1: keyword research with Ahrefs", id: "workflow-1-keyword-research" },
      { label: "Workflow 2: plan your CTA", id: "workflow-2-cta" },
      { label: "Workflow 3: prioritize and build", id: "workflow-3-prioritize" },
      { label: "The tech stack explained", id: "tech-stack" },
      { label: "FAQ", id: "faq" },
      { label: "Resources", id: "resources" },
      { label: "The bottom line", id: "bottom-line" },
    ],
    body: [
      {
        type: "p",
        body: "Most indie projects fail not because they're low quality, but because zero people know they exist. This guide fixes that.",
      },
      {
        type: "p",
        body: "You'll learn to find low-competition keywords (KD ≤ 10, volume ≥ 1,000) that rank in weeks, not months. Then you'll turn that traffic into email subscribers and paying customers using a no-code tech stack.",
      },

      { type: "h2", body: "Workflow 1: keyword research with Ahrefs", id: "workflow-1-keyword-research" },
      {
        type: "p",
        body: "This is where most indie hackers get stuck. Keyword research feels impossible without $500 SEO tools. It's not.",
      },
      { type: "h3", body: "Step 1: open Ahrefs and hit blank search" },
      {
        type: "p",
        body: "Go to Ahrefs Keywords Explorer. You'll see an empty search box. Don't search yet.",
      },
      { type: "h3", body: "Step 2: apply filters" },
      {
        type: "p",
        body: "Click \"Filters\" on the left sidebar. Set these parameters:",
      },
      {
        type: "ul",
        items: [
          "Filter 1 — Keyword Difficulty (KD): set to ≤ 10. Why: you have zero domain authority. Chasing KD 30+ keywords wastes months. KD ≤ 10 means you rank in weeks, not years.",
          "Filter 2 — Search Volume: set to ≥ 1,000 global searches/month. Why: below 1K is too niche. Above 10K is too competitive. 1K–10K is the sweet spot.",
          "Filter 3 — Search Intent (optional but recommended): set to Informational + Commercial. Why: informational gets you traffic (education). Commercial gets you buyers (conversions). Mix both.",
        ],
      },
      { type: "h3", body: "Step 3: search by topic" },
      {
        type: "p",
        body: "Now search your core topic. For a side project tool, try these:",
      },
      {
        type: "ul",
        items: [
          "\"side project marketing\"",
          "\"indie hacker growth\"",
          "\"free tool promotion\"",
          "\"founder marketing\"",
        ],
      },
      {
        type: "p",
        body: "Let Ahrefs run. You'll get 100+ results. Most will have KD < 10.",
      },
      { type: "h3", body: "Step 4: analyze the results" },
      {
        type: "p",
        body: "You'll see a table with columns: Keyword, Volume, KD, CPC, Search Intent.",
      },
      {
        type: "p",
        body: "Rank by two things. First, volume ÷ difficulty ratio (higher is better) — \"side project marketing\" (1.2K volume, KD 6) is a 200 ratio, while \"indie hacker growth hacks\" (890 volume, KD 4) is a 223 ratio. Pick the second one (better ratio).",
      },
      {
        type: "p",
        body: "Second, conversion potential (does it match your goal?) — \"how to market side project\" is high (person wants strategy), \"side project website builder\" is medium (specific tool question), and \"side project tax deduction\" is low (not relevant).",
      },
      { type: "h3", body: "Step 5: export and track" },
      {
        type: "p",
        body: "Export your top 20–30 keywords to a spreadsheet or Notion. Create columns for keyword, volume, KD, intent, status, and URL (when published):",
      },
      {
        type: "ul",
        items: [
          "\"how to market side project\" — 1.2K volume, KD 6, Informational, To write",
          "\"indie hacker growth\" — 890 volume, KD 4, Informational, To write",
          "\"free tool marketing tips\" — 1.1K volume, KD 8, Commercial, To write",
        ],
      },
      {
        type: "p",
        body: "You now have your content calendar. Move to Workflow #2.",
      },

      { type: "h2", body: "Workflow 2: plan your CTA (call to action)", id: "workflow-2-cta" },
      {
        type: "p",
        body: "Most indie hackers write blogs, then wonder why readers don't convert. The problem: no CTA strategy.",
      },
      { type: "h3", body: "Decision 1: what's your goal?" },
      {
        type: "p",
        body: "Choose one primary conversion target:",
      },
      {
        type: "ul",
        items: [
          "Email newsletter — goal: build an email list for future announcements. CTA: \"Join my email list\" (free, low friction). Tools: Bento ($29/month), Brevo (free tier), or Mailchimp (free tier).",
          "Booking calls — goal: talk to early adopters directly. CTA: \"Book a 20-minute call\" (qualified conversations). Tools: Cal.com (free), embedded on blog.",
          "Product sign-up — goal: direct conversion to your tool/product. CTA: \"Try it free\" (conversion). Tools: direct link to your product.",
          "Waitlist — goal: build buzz pre-launch. CTA: \"Join the waitlist\" (capture intent). Tools: Bento ($29/month), Brevo (free), or Mailchimp (free).",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        body: "Our recommendation: start with Email + Booking (hybrid approach). Blog readers → email list (low friction, scale). Email readers → booking call (high intent, quality).",
      },
      { type: "h3", body: "Decision 2: map keywords to funnel" },
      {
        type: "p",
        body: "Not every keyword converts the same way.",
      },
      {
        type: "ul",
        items: [
          "Top of funnel (awareness, education) — keywords like \"how to market side project\", \"indie hacker growth\". CTA: email signup (learn more).",
          "Middle of funnel (consideration) — keywords like \"free tool marketing strategy\", \"side project seo\". CTA: booking call (specific questions).",
          "Bottom of funnel (decision) — keywords like \"best way to market free tools\", \"side project launch strategy\". CTA: product demo or free trial.",
        ],
      },
      {
        type: "p",
        body: "Map your 20 keywords across this funnel. Different keywords need different CTAs.",
      },
      { type: "h3", body: "Decision 3: set up your tools" },
      {
        type: "p",
        body: "Email — choose based on budget: Brevo (free tier, 300 contacts), Mailchimp (free tier, 500 contacts), or Bento ($29/month, 5,000 users, more powerful automation). Setup: 10 minutes (embed form on Feather.blog). Workflow: blog reader → email form → welcome email → weekly digest.",
      },
      {
        type: "p",
        body: "Calls — Cal.com. Free tier: unlimited bookings, unlimited calendar connections. Setup: 10 minutes (connect to your email). Workflow: interested readers → book 20-min call → automated reminder.",
      },
      {
        type: "p",
        body: "Now you have traffic flowing from blogs → email → conversions. Move to Workflow #3.",
      },

      { type: "h2", body: "Workflow 3: prioritize and build", id: "workflow-3-prioritize" },
      {
        type: "p",
        body: "You have 20+ keywords. You can't write for all in week one. Prioritize.",
      },
      { type: "h3", body: "Ranking matrix: pick your first 5 keywords" },
      {
        type: "p",
        body: "Score each keyword on 3 dimensions, 1–10 scale:",
      },
      {
        type: "ul",
        items: [
          "Rankability (KD + your authority) — KD ≤ 5: score 10. KD 5–8: score 7. KD 8–10: score 5.",
          "Volume (traffic potential) — ≥ 2K searches/month: score 10. 1K–2K: score 7. < 1K: score 5.",
          "Conversion potential (your goal) — directly mentions your tool/category: score 10. Related to your niche: score 7. Tangential: score 5.",
        ],
      },
      {
        type: "p",
        body: "Example scoring: \"how to market free tools\" → rankability 10 + volume 7 + conversion 10 = 27/30 (write first). \"indie hacker growth\" → rankability 10 + volume 7 + conversion 7 = 24/30 (write second). \"side project tax\" → rankability 8 + volume 5 + conversion 2 = 15/30 (skip this).",
      },
      { type: "h3", body: "Build your content calendar" },
      {
        type: "ul",
        items: [
          "Weeks 1–2: write 3 blogs (your top 3 keywords)",
          "Weeks 3–4: write 2 blogs (keywords #4–5)",
          "Weeks 5–6: promote on email/social, measure traffic",
        ],
      },
      { type: "h3", body: "Publishing workflow" },
      {
        type: "ol",
        items: [
          "Write on Feather.blog (takes 20 minutes, auto-formats)",
          "Embed email form (Brevo/Mailchimp/Bento) + Cal.com booking link",
          "Publish to web (automatic SEO optimization)",
          "Share on LinkedIn, Twitter, r/entrepreneurship (day 1)",
          "Add to email digest (send to existing subscribers)",
          "Update your Notion tracker with URL",
        ],
      },
      { type: "h3", body: "Real timeline example" },
      {
        type: "p",
        body: "Week 1 — Monday: publish \"How to Market Your Side Project\" (KD 6, 1.2K volume). Wednesday: publish \"Free Tool Marketing Tips\" (KD 8, 1.1K volume). Friday: publish \"Indie Hacker Growth Hacks\" (KD 4, 890 volume).",
      },
      {
        type: "p",
        body: "Week 2 — first keywords ranking (long-tail, KD ≤ 5). Monitor analytics (SiteGPT or Datafast). Respond to comments. Add 3 new blogs to top funnel.",
      },
      {
        type: "p",
        body: "Weeks 3–4 — keywords climbing toward top 20 (typically by week 4 for KD ≤ 5). Email list growing (5–20 subscribers). First booking calls (0–2 calls/week).",
      },
      {
        type: "p",
        body: "Weeks 5–6 — publish 2 more blogs. Analyze what's working (which keywords drive bookings?). Double down on high-performing content themes.",
      },

      { type: "h2", body: "The tech stack explained", id: "tech-stack" },
      {
        type: "p",
        body: "You don't need 10 tools. But these 10 solve your full funnel:",
      },
      {
        type: "ul",
        items: [
          "Keyword research — Ahrefs: find keywords, analyze competitors, track rankings ($29+/month)",
          "Content creation — Feather.blog: write blogs fast, auto-formats, SEO built-in (free + paid)",
          "Email marketing — Bento: advanced automation ($29/month); Brevo: free tier up to 300 contacts (upgrade to $20+/month); Mailchimp: free tier up to 500 contacts (upgrade to $15+/month)",
          "Booking calls — Cal.com: schedule meetings, integrates with email (free tier available)",
          "User support — SiteGPT: AI chatbot for your site (free tier available)",
          "Analytics — DataFast or PostHog: track user behavior, funnels ($0–29/month)",
          "Call recordings — Sybill.ai: record calls, auto-generate notes (free tier, $20+/month paid)",
          "Feature tracking — Feature Base: public roadmap, user feedback (free)",
          "Documentation — Mintlify: beautiful docs for your tool (free)",
          "Code assistant — Claude: AI coding partner for building your tool (free tier, $20/month Pro)",
        ],
      },
      {
        type: "p",
        body: "Why this stack: all affordable or free. All no-code friendly. All integrate with each other. All designed for solo founders.",
      },

      { type: "h2", body: "FAQ", id: "faq" },
      { type: "h3", body: "How long until I see traffic?" },
      {
        type: "p",
        body: "Long-tail keywords (KD ≤ 5) typically rank in 7–14 days. Primary keywords (KD 6–10) in 2–4 weeks. Top 10 rankings take 4–8+ weeks.",
      },
      { type: "h3", body: "Should I prioritize volume or difficulty?" },
      {
        type: "p",
        body: "Difficulty first, then volume. A keyword with 1K volume and KD 3 beats 5K volume and KD 20.",
      },
      { type: "h3", body: "How many keywords should I target initially?" },
      {
        type: "p",
        body: "Start with 3–5 keywords in week 1. Expand to 20+ over 6–8 weeks.",
      },
      { type: "h3", body: "What if all my keywords have high KD?" },
      {
        type: "p",
        body: "Your niche is competitive. Pivot to longer-tail, more specific keywords (4+ words). Or find an underserved segment.",
      },
      { type: "h3", body: "Do I need a big email list to start?" },
      {
        type: "p",
        body: "No. Start with 0 subscribers. Your first 10–50 come from organic search + social sharing.",
      },
      { type: "h3", body: "Can I use this for products, not just blogs?" },
      {
        type: "p",
        body: "Yes. Instead of blogs, build landing pages targeting keywords. Use the same Feather.blog + email stack.",
      },

      { type: "h2", body: "Resources", id: "resources" },
      {
        type: "linklist",
        items: [
          { title: "Ahrefs Keywords Explorer", url: "https://ahrefs.com/keywords-explorer", meta: "keyword research" },
          { title: "Feather.blog", url: "https://feather.blog", meta: "blog platform" },
          { title: "Brevo", url: "https://brevo.com", meta: "email marketing, free tier" },
          { title: "Mailchimp", url: "https://mailchimp.com", meta: "email marketing, free tier" },
          { title: "Bento", url: "https://bentoapp.com", meta: "email marketing, paid" },
          { title: "Cal.com", url: "https://cal.com", meta: "booking calls" },
          { title: "PostHog", url: "https://posthog.com", meta: "analytics" },
          { title: "DataFast", url: "https://datafast.io", meta: "analytics" },
          { title: "SiteGPT", url: "https://sitegpt.ai", meta: "support chat" },
          { title: "Sybill.ai", url: "https://sybill.ai", meta: "call recordings" },
          { title: "Feature Base", url: "https://featurebase.com", meta: "feedback" },
          { title: "Mintlify", url: "https://mintlify.com", meta: "docs" },
          { title: "Claude", url: "https://claude.ai", meta: "coding" },
        ],
      },

      { type: "h2", body: "The bottom line", id: "bottom-line" },
      {
        type: "p",
        body: "Indie hackers build great products but can't market them. This isn't because marketing is hard — it's because most people skip keyword research and jump straight to \"viral content.\"",
      },
      {
        type: "p",
        body: "That's backwards. Start with keywords (what people search for), then create content (what they need), then capture emails (build audience), then convert (calls, sales, waitlist).",
      },
      {
        type: "callout",
        tone: "tip",
        body: "This guide gives you the playbook. Execute it in 4–6 weeks and you'll have organic traffic, engaged subscribers, and booked calls — without paying for ads.",
      },
    ],
  },
  "ai-native-qa": {
    slug: "ai-native-qa",
    tagline:
      "Google just published data that changes everything about how you test software. In June 2026, using Gemini, Google fixed 1,072 security bugs across two Chrome releases — more than the previous 23 versions combined, over 2 years of manual testing output in 30 days. Your QA team didn't get worse. The approach did. Here's how to build AI-native testing and actually ship faster.",
    timeEstimate: "~1 week to stand up the full stack",
    youWillNeed: [
      "A GitHub repo with pull requests (for the Claude code-review step)",
      "A Claude API key",
      "A fuzzing setup for your language (cargo-fuzz or equivalent), optional but recommended",
      "A technical founder or engineer to review findings — this replaces manual test-writing, not judgment",
    ],
    youWillEndUpWith:
      "An AI-native QA stack: Claude reviewing every PR before humans see it, fuzzing piped to Claude for root-cause triage, automated threat modeling on your critical endpoints, and a clear read on when this setup needs a human QA lead alongside it.",
    toc: [
      { label: "The problem: manual QA has a speed ceiling", id: "the-problem" },
      { label: "Why AI changes QA forever", id: "why-ai-changes-qa" },
      { label: "1. Claude code review in GitHub Actions", id: "step-1-code-review" },
      { label: "2. Continuous fuzzing + LLM analysis", id: "step-2-fuzzing" },
      { label: "3. Automated security threat modeling", id: "step-3-threat-modeling" },
      { label: "4. Wire it all together", id: "step-4-integration" },
      { label: "The architecture", id: "architecture" },
      { label: "Cost comparison", id: "cost-comparison" },
      { label: "When not to use AI for QA", id: "when-not-to" },
      { label: "The decision tree", id: "decision-tree" },
      { label: "Implementation timeline", id: "timeline" },
      { label: "FAQ", id: "faq" },
    ],
    body: [
      {
        type: "p",
        body: "Google just published data that changes everything about how you test software.",
      },
      {
        type: "p",
        body: "In June 2026, using Gemini, Google fixed 1,072 security bugs across two Chrome releases. That's more than the previous 23 versions combined — over 2 years of manual testing output in 30 days.",
      },
      {
        type: "p",
        body: "Your QA team didn't get worse. The approach did. Here's how to build AI-native testing and actually ship faster.",
      },

      { type: "h2", body: "The problem: manual QA has a speed ceiling", id: "the-problem" },
      {
        type: "p",
        body: "A manual QA team can test maybe 50–100 edge cases per day, per person. They get tired. They miss things. Most critically, they can't think like attackers — they follow predetermined test scripts.",
      },
      {
        type: "p",
        body: "The economics are brutal:",
      },
      {
        type: "ul",
        items: [
          "Hire one QA engineer: $80–120K/year salary + 40% overhead",
          "What you get: coverage of maybe 60–70% of your codebase",
          "What you miss: edge cases, security flaws, race conditions that show up in production",
        ],
      },
      {
        type: "p",
        body: "Google had the same problem. So they asked: what if Gemini could think like a penetration tester, write test cases, discover vulnerabilities, and generate fixes — all without needing a human to specify what to test?",
      },
      {
        type: "p",
        body: "The answer: 1,072 bugs in one month.",
      },

      { type: "h2", body: "Why AI changes QA forever", id: "why-ai-changes-qa" },
      {
        type: "p",
        body: "Manual QA is a linear problem. More testers = more coverage. But you can't hire fast enough.",
      },
      {
        type: "p",
        body: "AI-native QA is exponential. One LLM applied to your codebase can discover vulnerabilities at industrial scale, outpacing manual testers by 10x–100x depending on domain.",
      },
      {
        type: "callout",
        tone: "note",
        body: "To make this concrete: Google found a 13-year-old sandbox escape bug (CVE-2026-3545) that had survived manual testing for over a decade. A compromised renderer could trick Chrome into reading local files. Manual processes simply can't match LLM velocity.",
      },
      {
        type: "p",
        body: "The shift: old model — testers write test cases, run tests, file bugs, developers fix. New model — LLM scans code, generates test cases, discovers bugs, generates fixes, tests fixes.",
      },
      {
        type: "p",
        body: "Google's chart shows this graphically. Chrome 126 (June 2024): ~60 bugs fixed. Chrome 149–150 (June 2026): 1,072 bugs fixed. That's not a line. That's a curve. And the curve is accelerating.",
      },
      {
        type: "p",
        body: "For most early-stage startups, you don't need a dedicated QA team anymore. You need an LLM, GitHub Actions, and a strategy for handling the flood of bugs.",
      },

      { type: "h2", body: "Step 1: set up Claude code review in GitHub Actions", id: "step-1-code-review" },
      {
        type: "p",
        body: "Every pull request gets reviewed by Claude before humans see it. Why: catch bugs before merge, not after deploy.",
      },
      {
        type: "p",
        body: "Implementation (5 minutes). Create `.github/workflows/ai-review.yml`:",
      },
      {
        type: "code",
        lang: "md",
        filename: ".github/workflows/ai-review.yml",
        source: `name: Claude Code Review

on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Claude PR Review
        uses: <your-claude-action>
        with:
          api_key: \${{ secrets.CLAUDE_API_KEY }}
          prompt: |
            Review this code for:
            1. Security vulnerabilities (SQL injection, XSS, auth bypass)
            2. Performance issues (N+1 queries, memory leaks)
            3. Logic bugs (off-by-one, race conditions, null pointer exceptions)
            4. Testing gaps (untested error paths)

            For each issue found, suggest a fix.`,
      },
      {
        type: "p",
        body: "Claude will scan your PR diff, find issues humans miss (race conditions, timing bugs), suggest fixes, and post results as a comment on the PR.",
      },
      {
        type: "callout",
        tone: "note",
        body: "Cost: ~$0.50 per PR (Claude API) vs. 2 hours of QA engineer time ($40–60/hour).",
      },

      { type: "h2", body: "Step 2: continuous fuzzing + LLM analysis", id: "step-2-fuzzing" },
      {
        type: "p",
        body: "Fuzzing finds edge cases. LLMs explain why they matter.",
      },
      {
        type: "ol",
        items: [
          "Run your test suite with random inputs (fuzzing)",
          "When fuzzing finds a crash, pipe the input + stack trace to Claude",
          "Claude generates a root cause explanation, a minimal reproducible example, and a suggested fix",
        ],
      },
      {
        type: "p",
        body: "Example workflow:",
      },
      {
        type: "code",
        lang: "bash",
        source: `# Run fuzzing for 1 hour
cargo fuzz run my_fuzzer -- -max_len=1000 -timeout=10 -max_total_time=3600

# When crash found:
cat fuzzing_crash_input | \\
  curl -X POST https://api.anthropic.com/v1/messages \\
  -d @- \\
  -H "Authorization: Bearer $CLAUDE_API_KEY"`,
      },
      {
        type: "p",
        body: "Claude returns:",
      },
      {
        type: "code",
        lang: "md",
        source: `Root cause: Integer overflow in line 247 when payload size exceeds 2^31
Risk: Denial of service (remote crash)
Fix: Use u64 instead of u32 for size calculations`,
      },
      {
        type: "callout",
        tone: "note",
        body: "Cost: minimal. One Claude call per crash. You'll find 10–50 crashes in 24 hours across a real codebase.",
      },

      { type: "h2", body: "Step 3: security threat modeling (automated)", id: "step-3-threat-modeling" },
      {
        type: "p",
        body: "Instead of hiring a security expert, ask Claude to threat-model your API.",
      },
      {
        type: "p",
        body: "Prompt (copy-paste into Claude):",
      },
      {
        type: "snippet",
        title: "Threat-modeling prompt",
        body: "Here's my API endpoint schema:\n\nPOST /api/payments\n{\n  user_id: number,\n  amount: number,\n  card_token: string\n}\n\nThis endpoint:\n1. Validates user_id against JWT token\n2. Creates a Stripe charge\n3. Logs transaction to database\n\nThreat model this endpoint. For each risk:\n1. Describe the attack\n2. Impact (data loss, financial, reputation)\n3. Mitigation I should implement",
      },
      {
        type: "p",
        body: "Claude generates: missing input validation (rate limiting on user_id), timing attack risk (constant-time comparison), insufficient logging (can't audit charges after 30 days), idempotency missing (duplicate charges possible).",
      },
      {
        type: "callout",
        tone: "note",
        body: "Cost: $1–2 per endpoint. Beats hiring a $15K/month security consultant.",
      },

      { type: "h2", body: "Step 4: wire it all together", id: "step-4-integration" },
      {
        type: "p",
        body: "Your CI/CD now looks like:",
      },
      {
        type: "ol",
        items: [
          "PR submitted → Claude code review (find bugs early)",
          "Tests run → fuzzing happens in parallel (find edge cases)",
          "Tests pass → crash results piped to Claude (threat assessment)",
          "Before merge → security threat model auto-generated",
          "After deploy → monitor for crashes, feed back to Claude",
        ],
      },
      {
        type: "p",
        body: "Result: exponential bug discovery before users find them.",
      },

      { type: "h2", body: "The architecture (why this works)", id: "architecture" },
      {
        type: "p",
        body: "Why Google can fix 1,072 bugs in 1 month:",
      },
      {
        type: "ol",
        items: [
          "Humans define the problem (Chrome should be secure)",
          "LLM explores the solution space (generate test cases for all attack vectors)",
          "Automated testing validates (run generated tests at scale)",
          "Humans prioritize fixes (do the risky ones first)",
          "LLM generates fixes (code patches)",
          "Automated testing validates again (fixes don't break anything)",
        ],
      },
      {
        type: "p",
        body: "Loop back to step 1. The time from \"bug found\" to \"bug fixed\" is now measured in hours, not weeks.",
      },

      { type: "h2", body: "Cost comparison: QA engineer vs. Claude", id: "cost-comparison" },
      {
        type: "ul",
        items: [
          "Salary — QA engineer: $80–120K/year (US) or $15–30K/year (India). Claude: $0.",
          "API cost (1M API calls/month) — QA engineer: n/a. Claude: ~$50–75 (depends on input/output ratio).",
          "Coverage (% of codebase) — QA engineer: 60–70%. Claude: 85–95%.",
          "Time to fix bug (avg) — QA engineer: 3–5 days. Claude: 1–2 hours.",
          "False positives (noise) — QA engineer: low. Claude: medium (30–40%).",
          "Annual cost — QA engineer: $112K–168K (US) or $15–30K (India) + overhead. Claude: ~$600–900.",
        ],
      },
      {
        type: "p",
        body: "The catch: you still need a human to review Claude's bug reports (filter false positives), decide which fixes to deploy, monitor production for regressions, and update threat models quarterly.",
      },
      {
        type: "p",
        body: "But that's 5–10 hours/week, not full-time. You can do this with a technical founder or junior engineer part-time.",
      },

      { type: "h2", body: "When not to use AI for QA", id: "when-not-to" },
      {
        type: "p",
        body: "Don't use Claude alone if:",
      },
      {
        type: "ul",
        items: [
          "Your app handles healthcare data (compliance requires human sign-off on testing)",
          "You have paying enterprise customers with SLAs (you need documentation of test coverage)",
          "Your codebase is legacy or poorly documented (LLMs struggle with undocumented code)",
          "Your team is non-technical (you need someone to interpret Claude's findings)",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        body: "Instead: use Claude for 80% of testing, hire a QA lead for the remaining 20% (compliance, documentation, complex scenarios).",
      },

      { type: "h2", body: "The decision tree", id: "decision-tree" },
      {
        type: "ul",
        items: [
          "Solo founder, bootstrapped — use Claude. No budget for QA. This is your only option.",
          "Early VC (seed, <$2M raised) — use Claude + one technical co-founder reviewing findings. Efficiency edge = faster shipping = market advantage.",
          "Late VC (Series A+) — use Claude + dedicated QA engineer. Engineer focuses on automation and threat modeling, Claude handles volume.",
          "Enterprise SaaS — use Claude + full QA team. Human testing for regulatory compliance, LLM testing for velocity.",
        ],
      },

      { type: "h2", body: "Implementation timeline", id: "timeline" },
      {
        type: "ul",
        items: [
          "Week 1 — set up GitHub Actions + Claude API. Effort: 1 day.",
          "Week 2 — run first PR reviews, fix bugs found. Effort: 2 days.",
          "Week 3 — add fuzzing (configure cargo-fuzz or equivalent). Effort: 1 day.",
          "Week 4 — threat model 3–5 critical endpoints. Effort: 2 days.",
        ],
      },
      {
        type: "p",
        body: "Total: AI-native QA ready in ~1 week. After that, it's maintenance. Feed crashes to Claude, prioritize fixes, deploy.",
      },

      { type: "h2", body: "FAQ", id: "faq" },
      { type: "h3", body: "Won't Claude find 1000 false positives?" },
      {
        type: "p",
        body: "Based on pilot programs, expect 20–40% false positives depending on codebase maturity and prompt engineering. But false positives are better than false negatives (real bugs you missed). Takes 30 seconds to dismiss a false positive. Takes 2 weeks to fix a real bug in production.",
      },
      { type: "h3", body: "Does this replace my QA team?" },
      {
        type: "p",
        body: "If you don't have a QA team, it solves that problem entirely. If you have one, it makes them 10x more productive — they focus on complex scenarios, Claude handles volume.",
      },
      { type: "h3", body: "What about compliance (ISO, SOC2, HIPAA)?" },
      {
        type: "p",
        body: "Document that you use Claude + human review. Auditors care about documented testing process, not whether the process is manual or AI. You're fine as long as you can show the findings and fixes.",
      },
      { type: "h3", body: "How much will this cost?" },
      {
        type: "p",
        body: "$20–50/month in Claude API calls (depending on codebase size). Compare to $8K–15K/month for a QA engineer.",
      },

      { type: "h2", body: "The bottom line", id: "bottom-line" },
      {
        type: "p",
        body: "Google proved it: AI-native QA is exponentially faster than manual testing.",
      },
      {
        type: "p",
        body: "You don't need to be Google to benefit. Start with Claude code review in GitHub Actions. One day of setup. ~$50–75/month in API costs vs. $80–120K/year for a QA engineer (US) or $15–30K/year (India).",
      },
      {
        type: "callout",
        tone: "tip",
        body: "The future of QA isn't hiring more testers. It's teaching LLMs to think like attackers. Start this week.",
      },
    ],
  },
  "automate-your-first-100k-zapier-workflows": {
    slug: "automate-your-first-100k-zapier-workflows",
    tagline:
      "Most founders waste 10–20 hours a week on manual tasks. These 5 copy-paste Zapier workflows automate lead capture, CRM updates, follow-ups, and reporting. Implement one workflow and reclaim 2–4 hours. Implement all five and reclaim a half-time hire's worth of work.",
    timeEstimate: "15 minutes per workflow, spread across a month",
    youWillNeed: [
      "A Zapier account (free tier covers 100 tasks/month, enough to test 1–2 workflows)",
      "The apps you already use for leads, invoicing, and CRM — Airtable, Stripe, Slack are used as examples throughout",
      "One workflow at a time — don't build all five in a single sitting",
    ],
    youWillEndUpWith:
      "Five automated workflows covering lead capture, invoice follow-up, customer onboarding, feedback logging, and a weekly sales report — roughly 13+ hours reclaimed per month, running with no code and no deployment.",
    toc: [
      { label: "The founder's automation problem", id: "the-problem" },
      { label: "Why Zapier (not Make, not IFTTT)", id: "why-zapier" },
      { label: "1. Lead capture → CRM add", id: "workflow-1" },
      { label: "2. Invoice sent → payment reminder", id: "workflow-2" },
      { label: "3. New purchase → welcome sequence", id: "workflow-3" },
      { label: "4. Product feedback → log + notify", id: "workflow-4" },
      { label: "5. Weekly sales report", id: "workflow-5" },
      { label: "Total time saved", id: "total-time-saved" },
      { label: "Avoid these mistakes", id: "mistakes" },
      { label: "Next steps", id: "next-steps" },
      { label: "FAQ", id: "faq" },
      { label: "Your competitive edge", id: "competitive-edge" },
    ],
    body: [
      {
        type: "callout",
        tone: "tip",
        body: "TL;DR: most founders waste 10–20 hours/week on manual tasks. These 5 copy-paste Zapier workflows automate lead capture, CRM updates, follow-ups, and reporting. Implement one workflow = reclaim 2–4 hours. Implement all five = reclaim a half-time hire's worth of work.",
      },

      { type: "h2", body: "The founder's automation problem", id: "the-problem" },
      {
        type: "p",
        body: "You're grinding. Leads come in via email, form, social DM. You copy them into Airtable. You send a follow-up email. You log it in your CRM. You create a Slack reminder to check back. You manually update your weekly sales report.",
      },
      {
        type: "p",
        body: "That's 20 minutes per lead. 50 leads/month = 16+ hours of pure admin work.",
      },
      {
        type: "p",
        body: "Zapier fixes this. One automation runs 24/7. No code. No deployment. Just \"when X happens, do Y.\"",
      },

      { type: "h2", body: "Why Zapier (not Make, not IFTTT)", id: "why-zapier" },
      {
        type: "ul",
        items: [
          "Zapier — 7,000+ app integrations, Stripe/PayPal/Airtable/HubSpot all supported, most founder-friendly.",
          "Make (formerly Integromat) — cheaper, more powerful, steeper learning curve.",
          "IFTTT — too limited for business workflows.",
        ],
      },
      {
        type: "p",
        body: "For your first automation, start with Zapier. It's faster to learn and cheaper for low volume (free tier covers 100 tasks/month).",
      },

      { type: "h2", body: "Workflow 1: lead capture → automatic CRM add", id: "workflow-1" },
      {
        type: "p",
        body: "15 minutes to setup. What it does: lead fills your form → Zapier adds them to Airtable + sends you a Slack notification.",
      },
      {
        type: "p",
        body: "Why: stop manually copying names into spreadsheets. CRM stays current.",
      },
      {
        type: "ol",
        items: [
          "Trigger: new form submission (Typeform, Google Forms, or website form)",
          "Action 1: add new record to Airtable (name, email, phone, source)",
          "Action 2: send Slack message to #leads channel (notify team instantly)",
        ],
      },
      {
        type: "p",
        body: "Result: lead appears in your CRM within 10 seconds of signup. Your team sees it immediately.",
      },
      {
        type: "callout",
        tone: "note",
        body: "Time saved: 2 hours/month (if you get 50 leads, that's 50 × 2 min of manual copy-paste).",
      },

      { type: "h2", body: "Workflow 2: invoice sent → Slack alert + payment reminder", id: "workflow-2" },
      {
        type: "p",
        body: "What it does: you send an invoice via Stripe → Zapier sends a Slack alert to you + a reminder email to the customer after 7 days.",
      },
      {
        type: "p",
        body: "Why: stop forgetting to follow up on unpaid invoices. Revenue goes up.",
      },
      {
        type: "ol",
        items: [
          "Trigger: new paid invoice created (Stripe, Wave, or QuickBooks)",
          "Action 1: send Slack message to #invoices (\"Invoice for $X sent to [customer], due [date]\")",
          "Action 2: send email reminder after 7 days (if invoice still unpaid)",
          "Action 3: send SMS reminder after 14 days (optional, Twilio)",
        ],
      },
      {
        type: "p",
        body: "Result: invoices get paid 3–5 days faster (follow-up works). Less chasing customers.",
      },
      {
        type: "callout",
        tone: "note",
        body: "Time saved: 3 hours/month (if you send 20 invoices/month, that's 20 × 9 min of follow-up).",
      },

      { type: "h2", body: "Workflow 3: new customer purchase → welcome sequence", id: "workflow-3" },
      {
        type: "p",
        body: "What it does: customer buys → Zapier sends a welcome email + SMS + creates a task in your CRM (email + SMS + task).",
      },
      {
        type: "p",
        body: "Why: customer onboarding is chaotic. This automates the first impression.",
      },
      {
        type: "ol",
        items: [
          "Trigger: new customer created in Stripe",
          "Action 1: send welcome email (from email template in Gmail)",
          "Action 2: send SMS with setup instructions (Twilio)",
          "Action 3: create task in Airtable for you to follow up 48 hours later",
          "Action 4: add them to email list (Mailchimp, Substack, or Klaviyo)",
        ],
      },
      {
        type: "p",
        body: "Result: every new customer gets a warm welcome automatically. You don't forget onboarding.",
      },
      {
        type: "callout",
        tone: "note",
        body: "Time saved: 4 hours/month (if you get 30 customers/month, that's 30 × 8 min of manual onboarding).",
      },

      { type: "h2", body: "Workflow 4: product feedback → Airtable log + team Slack notification", id: "workflow-4" },
      {
        type: "p",
        body: "What it does: customer sends feedback → Zapier logs it + alerts the team.",
      },
      {
        type: "p",
        body: "Why: feedback gets lost. This centralizes it so you can see patterns.",
      },
      {
        type: "ol",
        items: [
          "Trigger: feedback form submitted (Typeform, Google Forms, or email)",
          "Action 1: create record in Airtable \"Feedback\" table (feedback text, customer name, date, priority)",
          "Action 2: send Slack message to #feedback channel (with sentiment: feature request, bug, or praise)",
          "Action 3 (optional): create task in GitHub Issues if it's a bug",
        ],
      },
      {
        type: "p",
        body: "Result: all feedback in one place. Team sees it instantly. Patterns emerge (top 3 feature requests become obvious).",
      },
      {
        type: "callout",
        tone: "note",
        body: "Time saved: 2 hours/month (if you get 40 pieces of feedback/month, that's 40 × 3 min of logging).",
      },

      { type: "h2", body: "Workflow 5: weekly sales report (automated)", id: "workflow-5" },
      {
        type: "p",
        body: "What it does: every Monday 9 AM, Zapier sends you a digest email with revenue last week, customers signed up, invoices sent, unpaid amounts, and churn.",
      },
      {
        type: "p",
        body: "Why: stop spending 30 minutes manually compiling numbers. One email tells you everything.",
      },
      {
        type: "ol",
        items: [
          "Trigger: schedule (every Monday at 9 AM)",
          "Action 1: get data from Stripe (total revenue last 7 days, new customers)",
          "Action 2: get data from Airtable (open deals, closed deals)",
          "Action 3: get data from email (opens, clicks on marketing emails)",
          "Action 4: send email digest with all stats + % change vs. last week",
        ],
      },
      {
        type: "p",
        body: "Result: you wake up Monday and know exactly how your business did. Decisions made faster.",
      },
      {
        type: "callout",
        tone: "note",
        body: "Time saved: 2 hours/month (30 min × 4 weeks of manual reporting).",
      },

      { type: "h2", body: "Total time saved: 13+ hours/month", id: "total-time-saved" },
      {
        type: "p",
        body: "These 5 workflows add up to 13+ hours reclaimed per month.",
      },
      {
        type: "p",
        body: "Over a year: 156+ hours. At a founder hourly rate of $50–100/hr, that's $7,800–$15,600 in time value recovered.",
      },
      {
        type: "p",
        body: "Cost of Zapier: $29.99–$49/month (Professional plan, depending on billing cycle and task volume). ROI: 150–300x in year one (13+ hours saved × $50–100/hr founder rate = $7,800–$15,600 recovered vs. $360–$588/year Zapier cost).",
      },

      { type: "h2", body: "Avoid these common mistakes", id: "mistakes" },
      {
        type: "ul",
        items: [
          "Building 10 workflows at once — overwhelmed, none work right. Fix: start with Workflow #1. Get it working. Add Workflow #2.",
          "Not testing before launch — workflow breaks silently. Fix: use Zapier's test feature; send yourself a test task.",
          "Forgetting to monitor — workflow dies and you don't notice. Fix: check the Zapier dashboard 2x/month; set up email alerts.",
          "Overcomplicated logic — hard to debug when it breaks. Fix: keep workflows simple (1–3 actions max). Expand later.",
          "Wrong trigger timing — double charges or missed actions. Fix: test with a small sample first; adjust timing.",
        ],
      },

      { type: "h2", body: "Next steps", id: "next-steps" },
      {
        type: "ol",
        items: [
          "Week 1: build Workflow #1 (Lead Capture). Test with 5 leads.",
          "Week 2: build Workflow #2 (Invoice Follow-up). Test on next invoice.",
          "Week 3: build Workflow #3 (Welcome Sequence). Test with next customer.",
          "Week 4: build Workflows #4 + #5. Automate feedback + reporting.",
        ],
      },
      {
        type: "p",
        body: "By end of month: you've reclaimed ~3 hours/week. You've freed up time to focus on actual business, not admin.",
      },

      { type: "h2", body: "FAQ", id: "faq" },
      { type: "h3", body: "Will Zapier break my data?" },
      {
        type: "p",
        body: "No. Use Zapier's test feature before turning on. It shows exactly what will happen.",
      },
      { type: "h3", body: "What if I need something more complex?" },
      {
        type: "p",
        body: "Use Make instead. Or hire a developer for around $500 to build custom automation with Python or Node.js.",
      },
      { type: "h3", body: "What if an app isn't on Zapier?" },
      {
        type: "p",
        body: "90% of SaaS apps are. Check the Zapier marketplace. If missing, use Zapier's \"Webhooks\" feature to connect anything.",
      },
      { type: "h3", body: "How much does it cost?" },
      {
        type: "p",
        body: "Zapier free tier: 100 tasks/month (enough for testing 1–2 workflows). Professional plan: $29.99/month (monthly billing) or $19.99/month (annual billing) for 750 tasks. Most founders with 5 workflows land at $49/month (annual) for 2,000 tasks.",
      },
      { type: "h3", body: "Can I export this later if I switch platforms?" },
      {
        type: "p",
        body: "Yes. Zapier stores all data in your apps (Airtable, Stripe, etc.). You own the data.",
      },

      { type: "h2", body: "Your competitive edge", id: "competitive-edge" },
      {
        type: "p",
        body: "Founders using Zapier are 2x faster than those doing everything manually.",
      },
      {
        type: "p",
        body: "They send better follow-ups. They onboard customers smoother. They see opportunities faster.",
      },
      {
        type: "callout",
        tone: "tip",
        body: "Start this week. Pick Workflow #1. You'll get 2–4 hours back this month alone.",
      },
    ],
  },
  "launchrock-vs-unbounce": {
    slug: "launchrock-vs-unbounce",
    tagline:
      "Short version: these two tools are not really competitors, and choosing between them on a feature scoreboard is the wrong way to decide. Launchrock exists to validate an idea before it has a product. Unbounce exists to squeeze more conversions out of paid-ad traffic once you have something to sell. This guide is built around the requirement, not a winner.",
    timeEstimate: "10 minutes to read",
    youWillNeed: [
      "A clear read on which stage you're actually at — pre-product or running paid traffic",
      "No prior familiarity with either tool required",
    ],
    youWillEndUpWith:
      "A clear answer on whether Launchrock or Unbounce (or neither, yet) fits where you are — plus the pricing shape of each and the features that actually separate them.",
    toc: [
      { label: "At a glance", id: "at-a-glance" },
      { label: "The one distinction that decides it", id: "the-distinction" },
      { label: "Match the tool to your situation", id: "match-your-situation" },
      { label: "Pricing, in general terms", id: "pricing" },
      { label: "Where each one is strong", id: "strengths" },
      { label: "Feature breakdown", id: "feature-breakdown" },
      { label: "Where you are in the founder journey", id: "founder-journey" },
      { label: "Resources", id: "resources" },
    ],
    body: [
      {
        type: "callout",
        tone: "note",
        body: "Feature references checked July 2026. Both vendors change plans and limits often, so confirm current pricing on their own pages before committing budget — links are in Resources at the end.",
      },

      { type: "h2", body: "At a glance", id: "at-a-glance" },
      {
        type: "ul",
        items: [
          "Purpose — Launchrock: prelaunch and email capture. Unbounce: conversion-rate optimization for paid traffic.",
          "Best for — Launchrock: founders validating an idea. Unbounce: marketing teams running ad campaigns.",
          "A/B testing — Launchrock: no. Unbounce: yes (on higher tiers).",
          "AI features — Launchrock: none. Unbounce: Smart Traffic, Unbounce's proprietary AI traffic routing.",
          "Pricing model — Launchrock: low, flat (verify current — see Resources). Unbounce: visitor-metered tiers, features gated by tier.",
          "Ideal stage — Launchrock: before the product exists. Unbounce: after the product exists, with ad spend.",
        ],
      },
      {
        type: "p",
        body: "CRO, above, means conversion-rate optimization: the practice of systematically improving the share of visitors who take the action you want — signing up, buying — usually through testing different versions of a page.",
      },

      { type: "h2", body: "The one distinction that decides it", id: "the-distinction" },
      {
        type: "p",
        body: "Launchrock is a launch and email-capture tool. You use it before the product exists, to stand up a \"coming soon\" or waitlist page in minutes, collect signups, and get a read on whether anyone wants the thing. It leans toward simple viral and referral mechanics — share links, basic tracking — aimed at founders and early-stage startups rather than marketing teams.",
      },
      {
        type: "p",
        body: "Unbounce is a conversion-rate-optimization platform. You use it after the product exists, to build landing pages for paid campaigns and then systematically improve how many visitors convert. Its reputation rests on A/B testing and Smart Traffic — Unbounce's proprietary AI feature that routes each visitor to the page variant most likely to convert them, trained on conversion data across its customer base.",
      },
      {
        type: "p",
        body: "If you have not built the product yet, most of Unbounce's machinery is priced for a problem you do not have. If you are spending real money on ads and conversion rate is a number you track weekly, Launchrock does not have the tools to move it. Everything below follows from that split.",
      },

      { type: "h2", body: "Match the tool to your situation", id: "match-your-situation" },
      {
        type: "p",
        body: "You are pre-launch and validating an idea. You want a page live today, an email list started, and a signal on demand. You are not running paid traffic and you have nothing to A/B test yet. This is Launchrock's job. Reaching for Unbounce here means paying a CRO platform to do a splash page.",
      },
      {
        type: "callout",
        tone: "tip",
        body: "Example: launching a new SaaS waitlist to see if anyone signs up → Launchrock.",
      },
      {
        type: "p",
        body: "You are running paid ad campaigns and optimizing conversions. You have a product, a budget, and you care about cost per acquisition. You want to test variants, replace text dynamically to match ad keywords, and ideally let AI handle traffic routing. This is Unbounce's job. Launchrock cannot A/B test, so it cannot do this work at all.",
      },
      {
        type: "callout",
        tone: "tip",
        body: "Example: running Google Ads to a product page and trying to lift conversions → Unbounce.",
      },
      {
        type: "p",
        body: "You are somewhere in between — product exists, but no real ad spend yet. For many teams at this stage, neither tool is the strongest fit: Launchrock is too thin once you are past validation, and Unbounce is priced for a level of paid volume you have not reached. The honest note is simply this: do not over-buy Unbounce before your ad spend justifies it.",
      },

      { type: "h2", body: "Pricing, in general terms", id: "pricing" },
      {
        type: "p",
        body: "Unbounce uses visitor-metered tiers, and the features most people associate with it sit higher up the ladder than the entry price suggests. The pattern that matters, regardless of the exact figures:",
      },
      {
        type: "ul",
        items: [
          "The entry tier is a page builder — no A/B testing.",
          "A middle tier adds A/B testing, the baseline of optimization.",
          "A higher tier adds Smart Traffic, the AI routing feature Unbounce is known for.",
          "Every tier meters monthly visitors, with overage charges past the cap, and annual billing is discounted.",
        ],
      },
      {
        type: "p",
        body: "The practical takeaway: the features you are probably buying Unbounce for are not on the cheapest plan, so price it at the tier that includes what you actually need, not the headline number.",
      },
      {
        type: "p",
        body: "Launchrock is generally positioned in a lower price bracket — prelaunch tools tend to cost far less than a CRO platform, consistent with the narrower job. Its current pricing is not clearly published across sources, so confirm it directly before relying on any figure.",
      },
      {
        type: "callout",
        tone: "warn",
        body: "Verify before you buy. Confirm both vendors' current prices, visitor caps, and which features sit on which tier on their own pricing pages. Plans in this category change often, and the feature gates matter as much as the price.",
      },

      { type: "h2", body: "Where each one is strong", id: "strengths" },
      {
        type: "p",
        body: "Launchrock is strong at speed and simplicity for a prelaunch moment — a page up fast, emails captured, minimal setup, no learning curve. Its ceiling is also its design: no split testing, limited depth, little to grow into once you are past validation.",
      },
      {
        type: "p",
        body: "Unbounce is strong at conversion optimization — a mature A/B testing workflow, dynamic text replacement for matching pages to ad keywords, conversion-focused templates, and Smart Traffic's automatic routing. Its cost is real, both in money and in complexity, and for a small team not running paid volume, most of that power goes unused while the visitor caps and tier gates still apply.",
      },

      { type: "h2", body: "Feature breakdown", id: "feature-breakdown" },
      {
        type: "p",
        body: "The tools barely overlap on features, so this is less a scoreboard than a map of what each actually does.",
      },
      { type: "h3", body: "Launchrock — built for the prelaunch window" },
      {
        type: "ul",
        items: [
          "Page building — a drag-and-drop, template-based editor for a single \"launching soon\" or waitlist page. No coding, fast to stand up.",
          "Email capture — signup forms optimized for waitlists, the core job.",
          "Viral and referral sharing — built-in social sharing and referral mechanics, so early signups can pull in more signups. The feature that most distinguishes it from a plain page builder.",
          "Analytics — a basic dashboard for page views, signups, and conversion from early visitors. Enough to see whether the page is working, not enough for user-level funnels.",
          "Integrations — limited. Reviewers consistently flag the thin native integration list as a gap, so connecting captured leads into a larger marketing stack can take extra work.",
        ],
      },
      {
        type: "p",
        body: "The pattern: narrow and shallow by design. It does the prelaunch job with little setup and does not pretend to do more.",
      },
      { type: "h3", body: "Unbounce — built for conversion optimization" },
      {
        type: "ul",
        items: [
          "Page building — a deep drag-and-drop builder with conversion-focused templates, plus popups and sticky bars.",
          "A/B testing — split-test page variants to see which converts better, the baseline of optimization, and something Launchrock cannot do at all. Sits above the entry tier.",
          "Smart Traffic — Unbounce's proprietary AI that routes each visitor to the variant most likely to convert them, instead of splitting traffic evenly and waiting for a result. Its signature feature, on the higher tiers.",
          "Dynamic text replacement — automatically swaps page text to match the ad keyword a visitor searched, so one page can mirror many ads without building each by hand.",
          "Analytics — conversion reporting and audience insights aimed at improving campaign performance.",
          "Integrations — a large native integration library plus custom scripts and tracking pixels.",
        ],
      },
      {
        type: "p",
        body: "The pattern: broad and deep, built to move a conversion number, and priced accordingly.",
      },
      {
        type: "callout",
        tone: "tip",
        body: "The honest summary of the whole table is one line: Launchrock helps you find out if people want the thing; Unbounce helps you convert more of the people who already showed up.",
      },

      { type: "h2", body: "Where you are in the founder journey", id: "founder-journey" },
      {
        type: "p",
        body: "Because the two tools map to different moments, the clearest way to choose is to place yourself on the timeline.",
      },
      {
        type: "p",
        body: "Idea stage — nothing built yet. You are testing whether the idea has pull. A waitlist page, an email list, and a demand signal are exactly what you need, and referral sharing helps the list grow itself. Launchrock fits here; Unbounce is machinery for a stage you have not reached.",
      },
      {
        type: "p",
        body: "Early traction — product exists, growth is organic. You have something real but you are not buying traffic yet. Launchrock starts to feel thin — you have outgrown the waitlist page — but you also have no campaigns to A/B test, so Unbounce's core value is idle. This is the awkward middle. Keep your setup simple and resist buying a CRO platform before you have traffic to optimize.",
      },
      {
        type: "p",
        body: "Paid acquisition — you are spending on ads. Now conversion rate is money. Every point of improvement on a landing page pays back against ad spend, which is precisely what A/B testing, dynamic text replacement, and Smart Traffic are for. Unbounce fits here; Launchrock has nothing to offer this stage.",
      },
      {
        type: "p",
        body: "Most founders will use something like Launchrock once, early, and reach for something like Unbounce much later — if they ever run enough paid volume to justify it. They are not rivals so much as tools for two different chapters.",
      },
      {
        type: "ul",
        items: [
          "Validating an idea, want a waitlist or coming-soon page live today, no paid traffic yet → Launchrock",
          "Have a product and an ad budget, treat conversion rate as a KPI you actively work → Unbounce",
          "Product exists but little to no ad spend → neither is a clear fit yet — keep your setup simple and avoid over-buying until paid acquisition becomes a priority",
        ],
      },
      {
        type: "p",
        body: "If you find yourself wanting Launchrock's price with Unbounce's testing, that mismatch is the signal that neither is quite right for your stage yet — worth sitting with before you commit budget either way.",
      },
      {
        type: "p",
        body: "Ultimately this is not a feature comparison — it is a question of choosing the tool that matches your stage.",
      },

      { type: "h2", body: "Resources", id: "resources" },
      {
        type: "linklist",
        items: [
          {
            title: "Unbounce Pricing",
            url: "https://unbounce.com/pricing/",
            note: "Current plans, visitor caps, and feature tiers",
          },
          {
            title: "Launchrock",
            url: "https://launchrock.com/",
            note: "Product and current pricing",
          },
        ],
      },
      {
        type: "callout",
        tone: "note",
        body: "Confirm current plans and prices on these pages before purchasing; figures in this category change frequently.",
      },
    ],
  },
  "launch-a-saas-on-almost-0-per-month": {
    slug: "launch-a-saas-on-almost-0-per-month",
    tagline:
      "You can take a SaaS product from idea to paying customers in 2026 on almost no fixed monthly spend. Free tiers cover most of what an early-stage product needs, and the few things you pay for scale with usage rather than upfront. This guide walks the stack category by category and tells you what to actually look for so you can choose for yourself.",
    timeEstimate: "20 minutes to read, use it as a checklist while you build",
    youWillNeed: [
      "An idea worth validating before you spend anything on it",
      "Willingness to pick a reasonable tool per category instead of the objectively best one",
      "A stage-by-stage mindset — add tools only when the current stage demands them",
    ],
    youWillEndUpWith:
      "A category-by-category shortlist of tools (hosting, database, auth, payments, analytics, email, landing pages, design, support) chosen for how their free tier lasts and how their paid tier scales, plus a sequencing checklist so you never buy a tool before the stage that needs it.",
    toc: [
      { label: "The principle before the tools", id: "principle" },
      { label: "At a glance", id: "at-a-glance" },
      { label: "1. Build and hosting", id: "build-hosting" },
      { label: "2. Database and backend", id: "database-backend" },
      { label: "3. Authentication", id: "authentication" },
      { label: "4. Payments", id: "payments" },
      { label: "5. Product analytics", id: "analytics" },
      { label: "6. Email", id: "email" },
      { label: "7. Landing page and launch", id: "landing-launch" },
      { label: "8. Design", id: "design" },
      { label: "9. Support and communication", id: "support" },
      { label: "Sequencing: buy nothing before you need it", id: "sequencing" },
      { label: "A realistic cost picture", id: "cost-picture" },
      { label: "Before you commit", id: "before-you-commit" },
    ],
    body: [
      {
        type: "callout",
        tone: "note",
        body: "Tool references and free-tier details checked against vendor and third-party sources in July 2026. Free tiers and pricing in this space change frequently, so confirm current limits on each vendor's own page before you commit — the named tools are examples, not endorsements.",
      },

      { type: "h2", body: "The principle before the tools", id: "principle" },
      {
        type: "p",
        body: "Two numbers decide whether a tool belongs in a low-cost launch stack, and neither is the headline price.",
      },
      {
        type: "ul",
        items: [
          "Where the free tier runs out — a generous free tier that covers you until real revenue is worth more than a slightly cheaper paid plan. You want to pay only once the tool is making you money.",
          "How the paid tier scales — some tools stay predictable as you grow; others jump sharply at a threshold, or meter something (visitors, events, contacts) that balloons with success. A tool that is cheap at zero and brutal at $10K MRR is a trap.",
        ],
      },
      {
        type: "p",
        body: "Keep total fixed cost near zero until revenue covers it. Everything below is organized around that.",
      },

      { type: "h2", body: "At a glance", id: "at-a-glance" },
      {
        type: "ul",
        items: [
          "Build & hosting — prioritize a free tier that permits commercial use, then usage-based pricing. Examples: Netlify (Vercel for non-commercial).",
          "Database & backend — prioritize database + auth in one free tier. Examples: Supabase, Firebase.",
          "Authentication — prioritize a free tier by monthly active users, with social login + MFA. Examples: Clerk, Supabase/Firebase auth.",
          "Payments — prioritize no monthly minimum, with tax/VAT handling. Examples: Stripe, Lemon Squeezy, Paddle.",
          "Product analytics — prioritize a large free event allowance that bundles replay + flags. Examples: PostHog; Plausible, Umami.",
          "Email — prioritize a free send tier, with transactional + marketing on one platform. Examples: Resend, Loops.",
          "Landing & launch — match the tool to your stage: capture first, testing later. Examples: Webflow, Framer.",
          "Design — prioritize free for individuals, with template kits. Examples: Figma.",
          "Support & comms — prioritize free team chat and basic customer messaging. Examples: Slack; shared-inbox tools.",
        ],
      },
      {
        type: "callout",
        tone: "note",
        body: "Named tools are examples to illustrate each category, not endorsements. Confirm current free-tier limits on each vendor's page.",
      },

      { type: "h2", body: "1. Build and hosting", id: "build-hosting" },
      {
        type: "p",
        body: "Where your app actually runs. Modern platforms have generous free or hobby tiers that host a real product at zero cost until you have meaningful traffic.",
      },
      {
        type: "p",
        body: "What to look for: a free tier that covers a live product, then usage-based pricing rather than a big fixed jump. Read the commercial-use terms — some hobby tiers permit personal projects only, not revenue-generating ones.",
      },
      {
        type: "p",
        body: "Examples: Netlify allows commercial use on its free tier within usage limits, which suits a real product. Vercel's Hobby tier is excellent but restricted to non-commercial use, so a revenue-generating SaaS is expected to move to its paid plan. For backend and database together, platforms like Supabase bundle database, auth, and APIs on one free tier.",
      },

      { type: "h2", body: "2. Database and backend", id: "database-backend" },
      {
        type: "p",
        body: "Storing data and running server logic. The current generation of backend-as-a-service tools collapse several categories — database, authentication, storage — into one, which is exactly what a solo founder wants.",
      },
      {
        type: "p",
        body: "What to look for: database plus auth in one free tier, so you are not stitching and paying for three services.",
      },
      {
        type: "p",
        body: "Examples: Supabase and Firebase both give you a database, authentication, and file storage on a free plan that comfortably covers early usage. One Supabase caveat worth knowing: free projects pause after about a week of inactivity, so a quiet pre-launch project can go briefly offline until you resume it.",
      },

      { type: "h2", body: "3. Authentication", id: "authentication" },
      {
        type: "p",
        body: "Letting users sign up and log in securely. Building this yourself is slow and risky; proven providers handle it, often free at low volume.",
      },
      {
        type: "p",
        body: "What to look for: a free tier measured in monthly active users, with social login and multi-factor included.",
      },
      {
        type: "p",
        body: "Examples: Clerk and auth-focused tiers inside Supabase or Firebase cover authentication for early user counts without a bill.",
      },

      { type: "h2", body: "4. Payments", id: "payments" },
      {
        type: "p",
        body: "Taking money. You do not pay a monthly fee here — you pay a percentage per transaction — so this is the one category where \"free until revenue\" is automatic.",
      },
      {
        type: "p",
        body: "What to look for: no monthly minimum, and whether the tool handles global sales tax and VAT for you. Merchant-of-record tools do that compliance work; a raw payment processor leaves it to you.",
      },
      {
        type: "p",
        body: "Examples: Stripe is the default processor and charges only per transaction. Lemon Squeezy and Paddle act as merchant of record, handling tax and VAT automatically, which saves real work as you sell internationally. Note that Stripe acquired Lemon Squeezy in 2024, though they remain separate products.",
      },

      { type: "h2", body: "5. Product analytics", id: "analytics" },
      {
        type: "p",
        body: "Understanding what users do inside your product. This is where free tiers are unusually generous right now, so there is little reason to pay early.",
      },
      {
        type: "p",
        body: "What to look for: a free event allowance large enough to last well past launch, ideally bundling analytics with session replay and feature flags so you replace several tools with one.",
      },
      {
        type: "p",
        body: "Examples: PostHog bundles analytics, session replay, and experiments on one platform with a free tier aimed at early-stage use. For lightweight, privacy-friendly web stats, Umami has a free cloud tier and is open-source if you want to self-host, while Plausible is a paid but inexpensive option in the same space.",
      },

      { type: "h2", body: "6. Email", id: "email" },
      {
        type: "p",
        body: "Two different jobs live here: transactional email (password resets, receipts) and marketing email (newsletters, launch announcements). Some tools do both.",
      },
      {
        type: "p",
        body: "What to look for: a free tier covering your early send volume, and clean developer-friendly sending for transactional mail.",
      },
      {
        type: "p",
        body: "Examples: Resend and Loops both offer non-expiring free tiers that cover early volume. Resend is transactional-first with a clean developer API — sending marketing broadcasts on the same domain is a deliverability risk, so keep those separate — while Loops is designed to handle both transactional and lifecycle/marketing email in one product.",
      },

      { type: "h2", body: "7. Landing page and launch", id: "landing-launch" },
      {
        type: "p",
        body: "The page that captures interest and, later, converts traffic. What you need here depends on your stage, which is worth separating out.",
      },
      {
        type: "ul",
        items: [
          "Pre-launch: if you are validating and collecting a waitlist, a prelaunch page and email capture is enough — simple tools stand one up in minutes.",
          "At launch and after: a proper landing-page builder with templates, and later A/B testing once you are running paid traffic. Do not buy conversion-optimization tooling before you have traffic to optimize.",
        ],
      },
      {
        type: "p",
        body: "Examples: website builders like Webflow and Framer have free plans to build and preview a page; connecting your own custom domain (which a real product needs) moves you to an inexpensive paid plan, starting around $5–10/month.",
      },

      { type: "h2", body: "8. Design", id: "design" },
      {
        type: "p",
        body: "Making it look credible without a designer. The industry-standard design tool has a free tier that covers a solo founder entirely.",
      },
      {
        type: "p",
        body: "What to look for: free for individuals, with templates and component kits so you are not starting from a blank canvas.",
      },
      {
        type: "p",
        body: "Examples: Figma offers a free plan for individual use, with a large community library of free UI kits and templates.",
      },

      { type: "h2", body: "9. Support and communication", id: "support" },
      {
        type: "p",
        body: "Talking to early users and your own team. Almost every tool here has a free tier that lasts well beyond launch.",
      },
      {
        type: "p",
        body: "What to look for: free tiers on team chat and basic customer messaging; you rarely need dedicated support software early on, so this is a category to keep deliberately light.",
      },
      {
        type: "p",
        body: "Examples: Slack's free tier handles team communication. For customer support, a shared inbox on your existing email, or a free-tier live-chat widget like Tawk.to or Crisp, covers early volume without a subscription.",
      },

      { type: "h2", body: "Sequencing: buy nothing before you need it", id: "sequencing" },
      {
        type: "p",
        body: "The cheapest stack is also the one you assemble in order, adding each tool only when the stage demands it.",
      },
      {
        type: "ul",
        items: [
          "Validating — landing page, email capture, analytics. Nothing else. You are testing demand, not running a business yet.",
          "Building — add hosting, database, auth, and design. All available free at this scale.",
          "Launching — add payments (pay-per-transaction, so no fixed cost) and transactional email.",
          "Growing — only now consider paid tiers, and only for the tools where you have hit a free-tier ceiling that is actually costing you customers.",
        ],
      },
      {
        type: "p",
        body: "Most founders over-buy by reaching for paid plans and conversion tooling before they have the traffic or revenue to justify them. The discipline is to let each bill be triggered by growth, not anticipation.",
      },

      { type: "h2", body: "A realistic cost picture", id: "cost-picture" },
      {
        type: "p",
        body: "For a typical early-stage SaaS, the fixed monthly cost of this stack can sit at or near zero: hosting, database, auth, analytics, design, and team chat all have free tiers that cover pre-revenue usage. The variable costs — payment processing fees, and occasional overages on email or analytics — only appear once you have customers, which is exactly when you can afford them. In practice, many bootstrapped founders report keeping total tooling spend well under $100/month until they are past their first revenue, though your mix will vary.",
      },
      {
        type: "p",
        body: "The one thing worth spending on earlier than feels comfortable is anything that protects customer trust or data — reliable auth and payments — because a failure there costs more than the subscription ever would.",
      },
      {
        type: "callout",
        tone: "tip",
        body: "A caution that matters more than any tool choice: the stack matters less than shipping. It is easy to spend a week comparing analytics tools instead of building the thing customers pay for. Pick a reasonable option in each category, move on, and change it later if it actually pinches.",
      },

      { type: "h2", body: "Before you commit", id: "before-you-commit" },
      {
        type: "ul",
        items: [
          "Confirm every free-tier limit on the vendor's own page — the named tools here are examples chosen to illustrate each category, not recommendations, and their limits move.",
          "Check how each paid tier scales, not just its entry price — the question that matters is what this costs at 10x your current usage.",
          "Prefer tools that collapse categories — one tool covering database, auth, and storage, or analytics, replay, and flags, is cheaper and simpler than three.",
          "Add tools in stage order — if you are not yet at the stage a tool serves, you do not need it yet.",
        ],
      },
      {
        type: "p",
        body: "The goal is not to assemble the most impressive stack. It is to spend nothing until the product earns it, and to make sure the tools you pick will not punish you for growing.",
      },
    ],
  },
  "run-claude-code-on-a-vps": {
    slug: "run-claude-code-on-a-vps",
    tagline:
      "A server that runs itself, mostly. €5–10 per month, about forty minutes to build. Claude Code handles routine administration — deploys, fixes, new projects — while you approve the decisions that matter. Afterwards you open an SSH app from any device, including your phone, and describe what you want.",
    timeEstimate: "~40 minutes to build",
    youWillNeed: [
      "A VPS with at least 4 GB of RAM, Ubuntu 20.04 or newer, x64 or ARM64 (Anthropic's stated minimum) — the cheapest 1–2 GB tier at most providers will not work",
      "A domain you control, with registrar access",
      "A Claude plan that includes Claude Code: Pro, Max, Team, Enterprise, or a Console account (the free plan doesn't include access)",
      "Free-tier Cloudflare and Tailscale accounts",
    ],
    youWillEndUpWith:
      "A server that only you can reach for administration (via Tailscale), that only Cloudflare can reach for traffic, and that documents its own security rules to the agent running it. Total added cost: €5–10/month.",
    toc: [
      { label: "The idea", id: "the-idea" },
      { label: "Who this is for", id: "who-this-is-for" },
      { label: "Before you start", id: "before-you-start" },
      { label: "Phase 1 — Buy", id: "phase-1-buy" },
      { label: "Phase 2 — Lock it down", id: "phase-2-lock-it-down" },
      { label: "Phase 3 — Install the agent", id: "phase-3-install-agent" },
      { label: "Phase 4 — Hand it over", id: "phase-4-hand-over" },
      { label: "If something breaks", id: "troubleshooting" },
      { label: "Know the limits", id: "limits" },
      { label: "What you have now", id: "what-you-have-now" },
      { label: "Resources", id: "resources" },
    ],
    body: [
      {
        type: "callout",
        tone: "note",
        body: "Documentation references checked July 2026. Provider interfaces change often, so verify each step against the vendor's own documentation as you go. This approach is widely used in the self-hosting community; what follows is our structured version of it.",
      },

      { type: "h2", body: "The idea", id: "the-idea" },
      {
        type: "p",
        body: "Two paths reach the server and they never meet. You arrive through a private mesh network. Visitors arrive through Cloudflare. The provider firewall drops everything else, so there is no public SSH port to attack. Inside the box, Claude Code runs in a persistent terminal session and handles the day-to-day administration.",
      },

      { type: "h2", body: "Who this is for", id: "who-this-is-for" },
      {
        type: "p",
        body: "Best for developers and technical founders who are comfortable in a terminal, want a real server for side projects or small production sites, and would rather not maintain one by hand.",
      },
      {
        type: "p",
        body: "Not recommended if you have never used SSH, if the server will hold customer data from day one, or if you cannot afford an hour of downtime while you learn. Step 9 closes public SSH permanently. If that sentence is unfamiliar, practise on a throwaway server first.",
      },

      { type: "h2", body: "Before you start", id: "before-you-start" },
      {
        type: "ul",
        items: [
          "A VPS with at least 4 GB of RAM, Ubuntu 20.04 or newer, x64 or ARM64 — Anthropic's stated minimum. The cheapest tier at most providers is 1–2 GB and will not work.",
          "A domain you control, with registrar access.",
          "A Claude plan that includes Claude Code: Pro, Max, Team, Enterprise, or a Console account. The free plan does not include access.",
          "Free-tier Cloudflare and Tailscale accounts.",
        ],
      },
      {
        type: "ul",
        items: [
          "VPS, 4 GB RAM — €5–10/month",
          "Cloudflare, Tailscale, Termius — free tier",
          "Claude plan — existing subscription",
          "Total added — €5–10/month",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        body: "Before you begin: this guide changes firewall and SSH configuration on a live server. Follow it on a fresh machine with no production data or traffic. Complete every Verify step before moving to the next one — skipping the gate in Phase 2 can lock you out permanently. Bitroot provides this guide for informational purposes and is not responsible for loss of access, data, or service arising from its use.",
      },

      { type: "h2", body: "Phase 1 — Buy (15 min)", id: "phase-1-buy" },
      {
        type: "ol",
        items: [
          "Create the VPS on Hetzner or DigitalOcean. Ubuntu 24.04, 4 GB RAM or more. Enable automatic backups at checkout.",
          "Generate an SSH keypair in your client. SSH is the standard way to get a command line on a remote machine, and Termius can create the keypair directly. Paste the public half into the create-server form. Keys only, never passwords.",
          "Add the domain to Cloudflare on the free plan and switch nameservers at your registrar. Cloudflare sits in front of your site, handling DNS and filtering incoming traffic. Start this now; propagation can take hours.",
        ],
      },
      {
        type: "callout",
        tone: "note",
        body: "Verify: Cloudflare marks the zone active.",
      },
      {
        type: "ol",
        items: [
          "Install an SSH client and Tailscale on both laptop and phone, signed in to the same account. Tailscale creates a private network that links only your own devices.",
        ],
      },

      { type: "h2", body: "Phase 2 — Lock it down (20 min)", id: "phase-2-lock-it-down" },
      {
        type: "p",
        body: "This phase contains the only step that can permanently cost you access. Read it through before starting.",
      },
      {
        type: "p",
        body: "Step 5 — connect and update.",
      },
      {
        type: "code",
        lang: "bash",
        source: `ssh root@YOUR_SERVER_IP
apt update && apt upgrade -y`,
      },
      {
        type: "callout",
        tone: "note",
        body: "Verify: `free -h` reports 4 GB or more. If it is lower, resize the server before continuing.",
      },
      {
        type: "p",
        body: "Step 6 — install Tailscale on the server using the official script and authenticate it.",
      },
      {
        type: "callout",
        tone: "note",
        body: "Verify: `tailscale ip -4` returns an address starting with 100. Write it down.",
      },
      {
        type: "p",
        body: "Step 7 — disable key expiry for the server in the Tailscale admin console. Skip this and the server drops off your network in ninety days, after every other route is closed.",
      },
      {
        type: "callout",
        tone: "warn",
        body: "Do not skip. Step 8 — from a second terminal, `ssh root@100.x.x.x`. Leave the first session open. Verify: you get a shell, and `who` shows two sessions. Two sessions is the pass condition — anything else means stop. Bookmark your provider's browser recovery console now. It works without SSH or Tailscale, and it is your only way back if the mesh fails.",
      },
      {
        type: "p",
        body: "Step 9 — in the provider firewall, delete every inbound rule, then allow port 443 from Cloudflare's published ranges only. Fetch the list rather than typing it. Tailscale keeps working because the tunnel is established outbound; optionally allow inbound UDP 41641 for direct rather than relayed connections.",
      },
      {
        type: "p",
        body: "If your provider does not offer a cloud firewall, apply the equivalent rules with `ufw` on the server itself, allowing inbound only on the `tailscale0` interface plus 443 from Cloudflare ranges. A host firewall is easier to lock yourself out of, so the recovery console matters more in that case.",
      },
      {
        type: "callout",
        tone: "note",
        body: "Verify: the inbound list contains exactly one TCP 443 entry. No rule mentions port 22.",
      },
      {
        type: "p",
        body: "Step 10 — test from mobile data with Tailscale off.",
      },
      {
        type: "callout",
        tone: "note",
        body: "Verify: `ssh root@YOUR_PUBLIC_IP` times out. \"Connection refused\" is not a pass — refused means something answered.",
      },
      {
        type: "p",
        body: "Step 11 — add your phone's own public key to `authorized_keys`. One key per device, so losing a phone means revoking one key.",
      },

      { type: "h2", body: "Phase 3 — Install the agent (5 min)", id: "phase-3-install-agent" },
      {
        type: "p",
        body: "Step 12 — install tmux and Claude Code. tmux keeps a terminal session alive on the server after you disconnect. The native installer needs no Node.js; other paths, including signed apt repositories, are in Anthropic's setup guide.",
      },
      {
        type: "code",
        lang: "bash",
        source: `sudo apt install tmux
curl -fsSL https://claude.ai/install.sh | bash`,
      },
      {
        type: "callout",
        tone: "note",
        body: "Verify: `claude --version` prints a version number and `claude doctor` reports no errors.",
      },
      {
        type: "p",
        body: "Step 13 — run it inside tmux so the session survives disconnects.",
      },
      {
        type: "code",
        lang: "bash",
        source: `tmux new -s claude
claude`,
      },
      {
        type: "p",
        body: "Detach with `Ctrl-b` then `d`.",
      },
      {
        type: "callout",
        tone: "note",
        body: "Verify: close the terminal, reconnect from your phone, and run `tmux attach -t claude`. The session returns where you left it.",
      },

      { type: "h2", body: "Phase 4 — Hand it over", id: "phase-4-hand-over" },
      {
        type: "p",
        body: "Step 14 — write the handover document. Claude Code reads CLAUDE.md at the start of every session. Vague instructions produce a server that surprises you.",
      },
      {
        type: "code",
        lang: "md",
        filename: "CLAUDE.md",
        source: `# Server operating rules

## Facts
- Provider, plan, region, OS version
- Live server. Real traffic depends on it.
- Preferred stack, and how I want progress reported

## Security model — INTENTIONAL, DO NOT "FIX"
- Public SSH is closed on purpose. Access is via Tailscale only.
  Never open port 22 to the internet.
- Inbound is 443 from Cloudflare ranges only. Never widen it.
- New services bind to localhost or Tailscale. Never 0.0.0.0.

## Conventions
- One project per directory: /srv/http/<domain>
- One tmux session per project, named after the domain
- Secrets in environment files, never committed

## Standing rules
- Ask before anything destructive: deletions, package removal,
  config overwrites, database drops
- Prefer read-only diagnostics first
- Append every incident and its fix to this file

## Escalate, do not decide
- Anything touching DNS, firewall, or backups`,
      },
      {
        type: "p",
        body: "Keep permission prompts on. That confirmation is the safety model.",
      },
      {
        type: "p",
        body: "Step 15 — have the agent write that file before it builds anything.",
      },
      {
        type: "callout",
        tone: "note",
        body: "Verify: ask a fresh session what the security model is. It should describe it unprompted.",
      },
      {
        type: "p",
        body: "Step 16 — backups before features. A nightly push to a private GitHub repository, excluding environment files and tokens.",
      },
      {
        type: "callout",
        tone: "note",
        body: "Verify: perform an actual restore. A backup you have not restored from is not a backup.",
      },
      {
        type: "p",
        body: "Step 17 — then let it build.",
      },
      {
        type: "p",
        body: "Caddy with the Cloudflare DNS plugin fits this architecture because the usual certificate method needs port 80 open and you have closed it; the DNS-01 challenge issues certificates over the DNS API instead. Nginx works too, but you would configure the challenge yourself.",
      },
      {
        type: "p",
        body: "SQLite is a good default here: one file on disk, already covered by your backup, and no listening service to secure. PostgreSQL or MySQL are fine if you need them — bind them to localhost or the Tailscale interface only.",
      },
      {
        type: "callout",
        tone: "note",
        body: "Verify: the domain loads over HTTPS, and the raw server IP does not respond.",
      },
      {
        type: "callout",
        tone: "warn",
        body: "The gotcha that takes sites offline: the DNS record must be proxied through Cloudflare, not DNS-only. Your firewall accepts Cloudflare ranges only, so an unproxied record points visitors at a closed door. Set SSL mode to Full (strict).",
      },

      { type: "h2", body: "If something breaks", id: "troubleshooting" },
      {
        type: "ul",
        items: [
          "Cannot SSH after step 9 — use the provider's browser recovery console, re-open port 22 temporarily, and diagnose Tailscale from there.",
          "Tailscale shows the server offline — usually expired keys; check step 7. Reconnect over the console and run `tailscale up` again.",
          "Certificate never issues — the DNS API token is missing edit permission on the zone, or is scoped to the wrong zone. Check the Caddy logs.",
          "Site times out for visitors — the DNS record is set to DNS-only instead of proxied, so traffic arrives from outside Cloudflare's ranges and the firewall drops it.",
        ],
      },

      { type: "h2", body: "Know the limits", id: "limits" },
      {
        type: "p",
        body: "Your tailnet is a single point of failure, so put multi-factor authentication on it. The agent holds real privileges on a live machine — run it as a sudo user, not root, and read commands before approving them. And this is one box: no failover, no high availability. Right for personal projects and small sites, wrong for infrastructure other people depend on.",
      },

      { type: "h2", body: "What you have now", id: "what-you-have-now" },
      {
        type: "p",
        body: "A server that only you can reach for administration, that only Cloudflare can reach for traffic, and that documents its own rules to the agent running it. From here, everything is a conversation: open the session, say what you want, approve what it proposes.",
      },

      { type: "h2", body: "Resources", id: "resources" },
      {
        type: "linklist",
        items: [
          { title: "Claude Code overview", url: "https://docs.claude.com/en/docs/claude-code/overview" },
          { title: "Claude Code setup guide", url: "https://code.claude.com/docs/en/setup" },
          { title: "Claude Code memory (CLAUDE.md)", url: "https://docs.claude.com/en/docs/claude-code/memory" },
          { title: "Claude Code permissions (IAM)", url: "https://docs.claude.com/en/docs/claude-code/iam" },
          { title: "Hetzner Cloud", url: "https://www.hetzner.com/cloud" },
          { title: "DigitalOcean", url: "https://www.digitalocean.com/" },
          { title: "Cloudflare", url: "https://www.cloudflare.com/" },
          { title: "Cloudflare full DNS setup", url: "https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/" },
          { title: "Cloudflare IP ranges", url: "https://www.cloudflare.com/ips/" },
          { title: "Cloudflare SSL — Full (strict)", url: "https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/" },
          { title: "Tailscale", url: "https://tailscale.com/" },
          { title: "Tailscale download", url: "https://tailscale.com/download" },
          { title: "Tailscale Linux install", url: "https://tailscale.com/download/linux" },
          { title: "Tailscale key expiry", url: "https://tailscale.com/kb/1028/key-expiry" },
          { title: "Termius", url: "https://termius.com/" },
          { title: "Caddy", url: "https://caddyserver.com/" },
          { title: "Caddy Cloudflare DNS plugin", url: "https://github.com/caddy-dns/cloudflare" },
          { title: "SQLite", url: "https://www.sqlite.org/" },
        ],
      },
    ],
  },
  "git-github-quick-guide": {
    slug: "git-github-quick-guide",
    tagline:
      "A minimal, high-velocity guide for daily Git and GitHub operations. Use this reference to get up to speed in minutes.",
    timeEstimate: "10 minutes to read, keep it bookmarked forever",
    youWillNeed: [
      "Git installed locally",
      "A GitHub account (or any Git remote)",
      "A terminal",
    ],
    youWillEndUpWith:
      "A working reference for the daily Git cycle — branching, committing, pushing, merging vs. rebasing, undoing mistakes, stashing, and resolving conflicts — plus a fast command cheat sheet.",
    toc: [
      { label: "1. Setup & identity", id: "setup" },
      { label: "2. Daily development cycle", id: "daily-cycle" },
      { label: "3. Merging vs. rebasing", id: "merge-vs-rebase" },
      { label: "4. Undoing mistakes", id: "undoing-mistakes" },
      { label: "5. Stashing & saving work", id: "stashing" },
      { label: "6. Resolving merge conflicts", id: "conflicts" },
      { label: "7. Fast commands reference", id: "fast-reference" },
    ],
    body: [
      { type: "h2", body: "Setup & identity", id: "setup" },
      {
        type: "p",
        body: "Configure your identity globally. This metadata is attached to all your commits.",
      },
      {
        type: "code",
        lang: "bash",
        source: `# Configure username and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Check your configuration
git config --list`,
      },
      {
        type: "callout",
        tone: "tip",
        body: "Use SSH keys for authentication instead of HTTPS to avoid entering credentials repeatedly. Generate one using: `ssh-keygen -t ed25519 -C \"your.email@example.com\"`",
      },

      { type: "h2", body: "Daily development cycle", id: "daily-cycle" },
      {
        type: "p",
        body: "Follow this lifecycle for day-to-day coding:",
      },
      {
        type: "ol",
        items: [
          "Switch branch",
          "Write code",
          "Stage changes",
          "Commit",
          "Push to GitHub",
        ],
      },
      { type: "h3", body: "Step 1: create a feature branch" },
      {
        type: "p",
        body: "Always isolate your changes on a new branch. Avoid committing directly to main.",
      },
      {
        type: "code",
        lang: "bash",
        source: `git switch -c feature/new-cool-feature`,
      },
      { type: "h3", body: "Step 2: stage & commit changes" },
      {
        type: "p",
        body: "Stage files when they reach a logical checkpoint and commit them with a descriptive message.",
      },
      {
        type: "code",
        lang: "bash",
        source: `# Stage specific files
git add path/to/file.js

# Stage all changes
git add .

# Save staged changes to history
git commit -m "feat: implement user registration form"`,
      },
      { type: "h3", body: "Step 3: push and pull" },
      {
        type: "p",
        body: "Keep your local repository in sync with GitHub.",
      },
      {
        type: "code",
        lang: "bash",
        source: `# Push your branch for the first time (sets tracking)
git push -u origin feature/new-cool-feature

# Push subsequent changes
git push

# Pull the latest changes from the remote main branch
git pull origin main`,
      },

      { type: "h2", body: "Merging vs. rebasing", id: "merge-vs-rebase" },
      {
        type: "p",
        body: "When integrating changes from main into your feature branch:",
      },
      {
        type: "ul",
        items: [
          "Merge (`git merge main`) — use when integrating finished features. Preserves detailed history; adds a merge commit.",
          "Rebase (`git rebase main`) — use when syncing your local branch with the latest main. Linearizes history; rewrites commit hashes.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        body: "The golden rule of rebasing: never rebase commits that have already been pushed to a public or shared remote repository. It will break history for others.",
      },

      { type: "h2", body: "Undoing mistakes", id: "undoing-mistakes" },
      {
        type: "ul",
        items: [
          "Discard local changes in a file — `git restore <file>` — reverts the file to its last committed state.",
          "Unstage a staged file — `git restore --staged <file>` — removes the file from staging, keeps your edits.",
          "Undo last commit, keep changes — `git reset --soft HEAD~1` — pulls the changes back into the staging area.",
          "Undo last commit, delete changes — `git reset --hard HEAD~1` — destroys all changes since the last commit.",
          "Revert a pushed commit safely — `git revert <commit-hash>` — creates a new commit that undoes the specified commit.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        body: "`git reset --hard` destroys uncommitted work with no undo. Double-check what you're about to discard before running it.",
      },

      { type: "h2", body: "Stashing & saving work", id: "stashing" },
      {
        type: "p",
        body: "Use stash to temporarily shelve your current changes if you need to switch branches quickly without committing incomplete work.",
      },
      {
        type: "code",
        lang: "bash",
        source: `# Save uncommitted changes
git stash -m "wip: auth implementation"

# List saved stashes
git stash list

# Restore your latest stash and delete it from the stash list
git stash pop

# Restore a stash but keep it in the list
git stash apply stash@{0}`,
      },

      { type: "h2", body: "Resolving merge conflicts", id: "conflicts" },
      {
        type: "p",
        body: "Conflicts occur when Git cannot auto-merge changes — for example, the same line edited on two different branches.",
      },
      {
        type: "ol",
        items: [
          "Locate conflicts — run `git status` to see conflicting files.",
          "Edit files — look for conflict markers in your code.",
          "Resolve & commit — choose which code to keep, delete the markers (`<<<<<<<`, `=======`, `>>>>>>>`), then stage and commit.",
        ],
      },
      {
        type: "code",
        lang: "js",
        source: `<<<<<<< HEAD
const URL = "https://api.production.com";
=======
const URL = "https://api.staging.com";
>>>>>>> feature/new-cool-feature`,
      },
      {
        type: "code",
        lang: "bash",
        source: `git add <resolved-file>
git commit -m "chore: resolve merge conflict"`,
      },

      { type: "h2", body: "Fast commands reference", id: "fast-reference" },
      {
        type: "ul",
        items: [
          "Initialize repo — `git init`",
          "Clone repo — `git clone <url>`",
          "Check status — `git status`",
          "View differences — `git diff`",
          "View commit history — `git log --oneline --graph`",
          "List branches — `git branch`",
          "Delete branch — `git branch -d <branch-name>`",
          "Create tag — `git tag -a v1.0.0 -m \"Release v1.0.0\"`",
          "Push tags — `git push origin --tags`",
        ],
      },
    ],
  },
  "automate-marketing-ops-with-claude-cowork": {
    slug: "automate-marketing-ops-with-claude-cowork",
    tagline:
      "A hands-on guide to automating marketing reporting and campaign builds with Claude Cowork — including the exact workflows Anthropic's own marketing operations team runs, from a weekly metrics review to end-to-end event builds.",
    timeEstimate: "1–2 hours to set up your first automation",
    youWillNeed: [
      "Claude Desktop app (Pro plan $20/month minimum; Max plan $100/month for high-volume automation)",
      "Marketing tech stack connected (HubSpot, Google Analytics, Slack, Google Drive minimum)",
      "1–2 hours to set up your first automation",
      "Basic file organization (you'll create a \"Claude Cowork\" folder structure)",
      "Willingness to iterate (first automation gets faster each time after)",
    ],
    youWillEndUpWith:
      "Fully automated weekly or monthly marketing reports (Anthropic's own case study: 1–2 days of manual work down to up to 2 hours), an automated campaign build system that processes requests on schedule, a reusable \"Skills\" library for your team's recurring tasks, and a human-in-the-loop approval system — Claude generates, you review, you ship.",
    toc: [
      { label: "1. Why teams are switching", id: "why-switching" },
      { label: "2. How Cowork actually works", id: "how-it-works" },
      { label: "3. Workflow: weekly metrics report", id: "workflow-weekly-report" },
      { label: "4. Workflow: event & campaign builds", id: "workflow-campaign-build" },
      { label: "5. Set it up, step by step", id: "setup" },
      { label: "6. Structure your folder", id: "folder-structure" },
      { label: "7. Building custom skills", id: "building-skills" },
      { label: "8. Common mistakes", id: "common-mistakes" },
      { label: "9. FAQ", id: "faq" },
      { label: "10. Your challenge", id: "challenge" },
      { label: "11. Resources", id: "resources" },
    ],
    body: [
      { type: "h2", body: "Why marketing ops teams are switching to Claude Cowork", id: "why-switching" },
      { type: "h3", body: "The gap between AI tools and embedded workflows" },
      {
        type: "p",
        body: "Most marketing teams have tried AI chat tools. Few have embedded them into actual workflows. The difference comes down to context and automation.",
      },
      {
        type: "p",
        body: "Traditional AI usage looks like this: open ChatGPT or Claude web, paste data manually, copy output, paste into Slack or email or Google Sheets, reformat to match your brand, repeat next week.",
      },
      {
        type: "p",
        body: "Claude Cowork removes the manual steps and automates the repetition. It reads your files, connects to your tools, executes multi-step sequences, and ships final deliverables — all scheduled and recurring.",
      },
      { type: "h3", body: "What makes Claude Cowork different" },
      {
        type: "p",
        body: "Anthropic launched Cowork with file-first context (upload your brand guide once, it loads on every task), tool integration (connect HubSpot, Google Analytics, Slack — Cowork queries them live), Skills (turn a successful output into a permanent, reusable automation), scheduling (run the same report every Friday at 5 AM automatically), and Projects (your folder, instructions, and task history stay between sessions).",
      },
      {
        type: "p",
        body: "Cowork isn't a chatbot with extra buttons. It's an agent that reads your stack, follows your processes, and executes autonomously.",
      },
      { type: "h3", body: "Why this matters for marketing ops" },
      {
        type: "p",
        body: "Marketing operations teams face four persistent pain points:",
      },
      {
        type: "ol",
        items: [
          "Tool sprawl: data in Salesforce, ads in Meta, email in HubSpot, analytics in GA4 — reporting requires exporting from 5+ places",
          "Brand consistency: AI outputs generic copy; your brand has specific rules about tone, length, and vocabulary",
          "Repetition: same reports, same approvals, same campaign briefs every week",
          "Handoff delays: marketing generates a brief, design waits, sales ignores the deck by Thursday",
        ],
      },
      {
        type: "p",
        body: "Cowork solves all four. Once you build the automation, it stays built.",
      },

      { type: "h2", body: "How Claude Cowork actually works (for marketing)", id: "how-it-works" },
      { type: "h3", body: "The three layers of Cowork" },
      {
        type: "p",
        body: "Layer 1: Context — your folder. Everything in your Cowork folder is context. Cowork reads it all automatically before every task, which is why outputs match your brand without you repeating the rules each time.",
      },
      {
        type: "code",
        lang: "md",
        source: `Claude Cowork/
├── ABOUT ME/
│   ├── Brand guidelines.pdf
│   ├── Campaign strategy (FY2026).txt
│   ├── Audience persona (ICP).md
│   └── KPI targets.xlsx
├── PROJECTS/
│   ├── Q3 product launch/
│   │   └── Campaign brief (draft).md
│   └── Black Friday 2026/
│       └── Email sequence outline.txt
└── TEMPLATES/
    ├── Weekly report template.md
    ├── Competitive brief skeleton.md
    └── Campaign audit checklist.txt`,
      },
      {
        type: "p",
        body: "Layer 2: Skills — reusable workflows. A \"Skill\" is a permanent recipe for a task. After your first successful report automation, you tell Claude: \"Create a Skill to remember this.\" Cowork generates a skill file that includes what data to pull, how to format it, what insights to highlight, and who to send it to. Next week, the same skill runs again — no re-explaining needed.",
      },
      {
        type: "p",
        body: "Layer 3: Connectors — live data. Connectors (via Anthropic's MCP protocol) let Cowork query your actual tools without exporting CSVs — Google Analytics for last week's traffic by channel, HubSpot for pipeline by stage, Slack for delivering the finished report, Google Drive or Sheets for reading the latest performance data and writing analysis. Without connectors, you export a CSV, Cowork analyzes it, and you re-import results. With connectors, it happens in one flow.",
      },

      { type: "h2", body: "Real workflow #1: generating the weekly marketing metrics report", id: "workflow-weekly-report" },
      { type: "h3", body: "The problem it solves (from Anthropic's case study)" },
      {
        type: "p",
        body: "In Anthropic's marketing operations, the business moves faster than a traditional reporting pipeline. Ian Chan, who prepares the weekly marketing metrics review, used to spend one to two days every week tracking down data and validating it across multiple platforms — Google Analytics for traffic metrics, HubSpot for lead generation numbers, the data warehouse for historical context, Slack for sales team priorities, and call transcripts for emerging patterns.",
      },
      {
        type: "p",
        body: "After setting up Claude Cowork automation, this workflow now takes up to two hours — primarily review and approval.",
      },
      { type: "h3", body: "How it works" },
      {
        type: "p",
        body: "Every Sunday evening at an automated time, a scheduled task runs: Cowork reads the previous week's review, checks Slack for sales team focus areas, queries the data warehouse for current metrics, checks Google Analytics and HubSpot live, and leaves a folder with metrics tables and suggested focus areas.",
      },
      {
        type: "p",
        body: "On Monday morning, Ian opens Claude Cowork and pulls the initial report. It contains metrics tables and suggested headlines and areas of focus. He reviews and confirms or adjusts the focus areas, then tells Claude to expand on the analysis with supporting details and examples. Claude generates leadership slides from the same data and narrative, and any follow-ups become Asana tasks.",
      },
      { type: "h3", body: "Key features of this workflow (from Anthropic's implementation)" },
      {
        type: "ul",
        items: [
          "Data validation: when numbers don't line up, Claude flags the mismatch instead of guessing — after a sales reorg, Claude flagged misaligned reporting structures",
          "Adaptive context: the process runs on connectors to marketing platforms and three skills — a prep skill that drives report assembly (focus, headlines, expansion), a proofreading skill that checks every number in the draft against verified sources, and an action-items skill that turns follow-ups into Asana tasks",
          "Continuous improvement: at the end of each weekly session, Ian asks Claude to summarize what should go back into the skills — new structures, corrections, framing preferences",
          "Shifted workload: the entire process, which used to take up to two days of work, now takes up to two hours — freeing Ian to focus on helping marketers frame their own questions, refine prompts, and interpret numbers they pull directly from Claude",
        ],
      },

      { type: "h2", body: "Real workflow #2: automating event builds and campaign operations", id: "workflow-campaign-build" },
      { type: "h3", body: "The problem it solves (from Anthropic's case study)" },
      {
        type: "p",
        body: "Setting up marketing campaign infrastructure is traditionally one of the most manual processes in marketing. Every event, webinar, or integrated campaign requires setup across multiple vendors — CRM (Salesforce), marketing automation platform (HubSpot), event management platform (Swoogo), email tools, and landing page builders. Each platform requires manual configuration, and integrations between them are rarely complete.",
      },
      {
        type: "p",
        body: "Before Claude Cowork, Annabel Custer, who focuses on campaign operations, picked up every request from a dedicated Slack channel and worked through the sequence manually. With Claude Cowork, this workflow is almost entirely handled by Claude, with human review at key checkpoints.",
      },
      { type: "h3", body: "The architecture: dispatcher + specialist skills" },
      {
        type: "p",
        body: "This is the \"agentic\" pattern — skills calling other skills. On request intake, a request comes in (\"Build email nurture sequence for DevOps audience\"), a dispatcher skill reads the channel and request details, and routes to the appropriate specialist skill based on request type.",
      },
      {
        type: "p",
        body: "In specialist skill execution, the specialist skill queries relevant libraries — brand guidelines, email templates, past performance — generates the output (emails, landing pages, and so on), and routes it to an audit specialist.",
      },
      {
        type: "p",
        body: "For quality assurance, the audit agent starts with no prior context: it submits a test registration on the live landing page, opens the confirmation email in Gmail, marks the Asana task complete if everything looks right, and Annabel reviews the results before they ship.",
      },
      { type: "h3", body: "The five specialist skills (from Anthropic's implementation)" },
      {
        type: "p",
        body: "Annabel has set up specialist skills for:",
      },
      {
        type: "ol",
        items: [
          "Event-build skill — handles the full sequence end-to-end: CRM campaign creation, marketing automation workflows, event platform setup, email drafting, landing page generation, and integrations",
          "Webinar-landing-page creation skill — spins up landing pages for webinars",
          "Audit skill — run by a separate fresh Claude instance, verifies output before task completion",
          "Apply-to-attend skill — handles in-flight changes to the registration flow",
          "Approval-support skill — handles event approvals and sends scheduled emails",
        ],
      },
      {
        type: "p",
        body: "Annabel also maintains a \"manager\" agent, separate from the workflow. When a run misfires, she opens the manager and asks it to analyze what happened and propose adjustments. Anything worth keeping goes back into the relevant skill.",
      },
      { type: "h3", body: "Why this matters" },
      {
        type: "p",
        body: "While these automated workflows save significant time, Annabel's primary motivation to build them was quality of work. As the marketing team scales, marketers cloning event pages from whatever template is nearby can produce bugs — confirmation emails with wrong city names, broken landing pages. With Claude Cowork, she gets consistency across builds, at scale.",
      },
      {
        type: "p",
        body: "As Claude handles repetitive tasks, Annabel can focus on strategic projects: enablement, process optimization, and campaign architecture improvements.",
      },

      { type: "h2", body: "How to set it up, step by step", id: "setup" },
      {
        type: "p",
        body: "Step 1 — create your folder structure. In your Documents folder, create an ABOUT ME folder with brand voice and KPI benchmark files, a PROJECTS folder with your last report, and a TEMPLATES folder with the report format you want Cowork to follow:",
      },
      {
        type: "code",
        lang: "md",
        source: `Claude Cowork/
├── ABOUT ME/
│   ├── Brand voice.txt
│   │   "Tone: conversational, data-driven, no hype.
│   │    Avoid: synergy, leverage, circle back.
│   │    Audience: CMOs and growth leaders."
│   └── KPI benchmarks.txt
│       "Weekly MQL target: 150
│        Weekly SQL target: 40
│        Monthly CAC target: $450"
├── PROJECTS/
│   └── Weekly reporting/
│       └── Last week's report.md
└── TEMPLATES/
    └── Weekly report format.md
        "# Weekly Marketing Report [DATE]
         ## Traffic
         - Total sessions:
         - Source breakdown:
         - Key pages:
         ## Lead Gen
         - MQLs:
         - SQLs:
         - CAC:
         ## Trends & Insights
         ## Recommended Actions"`,
      },
      {
        type: "p",
        body: "Step 2 — connect your data sources. In Claude Desktop, go to Settings → MCP Servers and enable Google Analytics (via Coupler.io MCP or a native connector), HubSpot (native MCP available), and Slack for sending the finished report. Note on Coupler.io: it provides MCP support for 400+ data sources including GA4, Meta, Google Ads, and Salesforce — useful for tools that don't have direct MCP connectors.",
      },
      {
        type: "p",
        body: "Step 3 — create your first report manually. Open Claude Cowork, select your \"Weekly reporting\" project folder, and prompt it:",
      },
      {
        type: "snippet",
        title: "Weekly report prompt",
        body: "Read my brand voice, KPI benchmarks, and last week's report template.\n\nConnect to Google Analytics and pull: total sessions, users, bounce rate for this week; top 5 pages by sessions; traffic breakdown by source (organic, direct, paid, referral).\n\nConnect to HubSpot and pull: MQLs generated this week; SQLs generated this week; deals closed this week; current pipeline value.\n\nCompare to last week and include % change for each metric, and whether we're tracking to targets.\n\nWrite analysis: what's moving? What's flat? Which channels are performing? What should we do next?\n\nFormat it exactly like the template. Use the brand voice: conversational, data-driven, no corporate jargon.\n\nSend the final report to my Slack #marketing-metrics channel.",
      },
      {
        type: "p",
        body: "Cowork will read your files, query GA4 and HubSpot live, calculate trends, write analysis in your voice, and post to Slack.",
      },
      {
        type: "p",
        body: "Step 4 — turn it into a reusable skill. Once the report looks good, tell Claude: \"Create a Skill to remember this report workflow. I want to run it every Friday at 5 AM automatically.\" Claude generates a skill file. You review it, verify it's correct, and save it to your Cowork folder.",
      },
      {
        type: "p",
        body: "Step 5 — schedule it. In Cowork, go to \"Dispatch\" (the scheduling tab) and set the frequency to every Friday, the time to 5:00 AM, the skill to Weekly Marketing Report, and the action to run and post to Slack. From now on, your report runs automatically.",
      },

      { type: "h2", body: "How to structure your Cowork folder for success", id: "folder-structure" },
      {
        type: "code",
        lang: "md",
        source: `Claude Cowork/
│
├── ABOUT ME/
│   ├── Brand voice rules.txt
│   ├── Company mission & positioning.md
│   ├── Target audience (ICP).txt
│   ├── Competitor positioning.txt
│   ├── Visual guidelines (text instructions).txt
│   └── KPI targets for 2026.xlsx
│
├── PROJECTS/
│   ├── Weekly reporting/
│   │   ├── Last week's report.md
│   │   ├── KPI targets for reporting.txt
│   │   └── Analytics snapshot.txt
│   │
│   ├── Q3 product launch/
│   │   ├── Campaign brief.md
│   │   ├── Target audience profile.txt
│   │   ├── Launch timeline.txt
│   │   └── Competitor analysis.txt
│   │
│   └── Content calendar/
│       ├── Editorial guidelines.txt
│       ├── Blog topics (backlog).txt
│       └── Publishing schedule.xlsx
│
├── TEMPLATES/
│   ├── Weekly report format.md
│   ├── Campaign brief skeleton.md
│   ├── Email sequence outline.md
│   ├── Landing page outline.md
│   ├── Competitive brief template.md
│   └── Content audit checklist.md
│
├── LIBRARY/
│   ├── Past campaigns (30 best performing).md
│   ├── Email subject line examples.txt
│   ├── CTA phrasing guide.txt
│   └── Audience segments guide.txt
│
└── CLAUDE OUTPUTS/
    ├── Weekly reports/
    ├── Campaign drafts/
    ├── Content recommendations/
    └── Analysis & audits/`,
      },
      { type: "h3", body: "What each folder does" },
      {
        type: "ul",
        items: [
          "ABOUT ME: your brand DNA. Never changes. Cowork reads this on every task to ensure consistency.",
          "PROJECTS: active work. Campaign briefs, client info, timelines. Delete or archive after shipping.",
          "TEMPLATES: reusable formats. Cowork follows these structures when producing output.",
          "LIBRARY: competitive intelligence, past successful campaigns, subject line examples. Update quarterly.",
          "CLAUDE OUTPUTS: where Cowork saves finished work. Review before shipping. Archive old work monthly.",
        ],
      },
      {
        type: "p",
        body: "Example brand voice rules.txt:",
      },
      {
        type: "code",
        lang: "md",
        filename: "Brand voice rules.txt",
        source: `Tone: Expert, accessible, no corporate jargon
Voice: Second person ("you"), active voice
Do: Be specific. Use numbers. Show, don't tell.
Don't: Use "leverage," "synergy," "empower," "seamless"
Length: Long-form blogs (1500–2500 words), social posts (<100 characters)

Example good: "We cut onboarding from 2 weeks to 3 days by
automating the intake form."

Example bad: "Our seamless integration solution unlocks
unprecedented value for forward-thinking teams."`,
      },

      { type: "h2", body: "Building custom skills for your team", id: "building-skills" },
      {
        type: "p",
        body: "A Skill is a reusable workflow file stored in your Cowork folder. When you tell Claude \"Create a Skill,\" it generates a file containing the exact steps from that successful run, plus timing and routing.",
      },
      { type: "h3", body: "How to create a skill" },
      {
        type: "ol",
        items: [
          "Do the task manually in Cowork — prompt: \"Pull GA4 data, HubSpot data, and generate a weekly report in Markdown format following my template.\" Cowork does it. You review. It looks good.",
          "Ask Claude to create a Skill — \"Create a Skill to remember this workflow. I want to run it every Friday at 5 AM and post the result to Slack.\"",
          "Claude generates the Skill file — it creates a skill file with the exact steps from that run, plus timing and routing.",
          "Save the Skill to Claude Cowork/SKILLS/Weekly Report.skill",
          "Run the Skill — next week, prompt \"Run my Weekly Report skill.\" It runs automatically.",
        ],
      },
      { type: "h3", body: "Chaining skills together" },
      {
        type: "p",
        body: "Skills gain power when chained. A Dispatcher Skill receives a campaign brief and routes it to a Content Strategy Skill (generates audience insights and messaging pillars), which feeds an Email Writer Skill (uses the pillars to write a nurture sequence), which feeds an Audit Skill (QAs the content) and ends with a Slack notification to marketers for approval. Each skill reads the output of the previous one — the final output is better than manual work because each step builds on the last with context.",
      },
      { type: "h3", body: "Updating skills" },
      {
        type: "p",
        body: "As your team learns what works, update skills. For example, your first report had 10 sections; after month 1, only 4 matter to leadership. Edit the skill: \"Remove trends and competitors sections, keep: traffic, leads, pipeline, actions.\" The next report is tighter. Edit skills directly in your folder — no need to recreate them.",
      },

      { type: "h2", body: "Common mistakes & how to fix them", id: "common-mistakes" },
      { type: "h3", body: "Mistake #1: not having a brand voice file" },
      {
        type: "p",
        body: "Problem: Cowork outputs feel generic — reads like ChatGPT, not your company. Why: you never told Claude how your company talks. Fix: spend 30 minutes writing your brand voice rules. Include it in every prompt.",
      },
      {
        type: "p",
        body: "Before: \"Write a campaign email.\" After: \"Read my brand voice rules. Write a campaign email in that voice. Use short sentences, active voice, specific numbers, no jargon.\" Result: outputs actually sound like your company.",
      },
      { type: "h3", body: "Mistake #2: feeding outdated data" },
      {
        type: "p",
        body: "Problem: you manually update a CSV each week, upload it to Cowork — the report includes old numbers. Why: manual data is stale data; by Friday, Tuesday's numbers are wrong. Fix: use connectors instead. Connect Cowork directly to GA4, HubSpot, Salesforce — it pulls live data at runtime.",
      },
      {
        type: "p",
        body: "Before: export CSV Friday morning, hope it's current. After: Cowork queries live APIs at 5 AM Friday — always current.",
      },
      { type: "h3", body: "Mistake #3: asking Cowork to do too much in one skill" },
      {
        type: "p",
        body: "Problem: \"Build a campaign, audit it, post it, and notify leadership.\" Cowork gets confused halfway through. Why: multi-step complex tasks need multiple skills chained, not one mega-skill. Fix: break it into smaller skills — one to build, one to audit, one to notify. Before: run the whole workflow in one skill (high error rate, confusing output). After: Build Skill → Audit Skill → Notify Skill (clean handoffs).",
      },
      { type: "h3", body: "Mistake #4: setting skills to run unattended, with no human review" },
      {
        type: "p",
        body: "Problem: \"Schedule it completely automated. Ship to production without review.\" Why: AI can hallucinate — a skill might generate copy with broken links, wrong product info, or brand misalignment. Fix: always add human approval. Pattern: Cowork generates → posts to Slack → marketer approves → Cowork ships.",
      },
      {
        type: "p",
        body: "Example approval flow: Cowork posts \"Campaign draft ready. Review in #campaign-audits.\" The marketer replies \"Subject line reads generic. Rewrite more curiosity-driven.\" Cowork rewrites it. The marketer says \"Perfect. Approved. Ship.\" Cowork posts live.",
      },
      {
        type: "callout",
        tone: "warn",
        body: "Human-in-the-loop takes 2 minutes. Fixing a shipped mistake takes 2 hours.",
      },
      { type: "h3", body: "Mistake #5: overloading your folder with every single file" },
      {
        type: "p",
        body: "Problem: you dump 200 files into the Cowork folder — Cowork reads all of them before each task, producing slow, confused outputs. Why: more context means slower processing, and old files introduce noise. Fix: keep your folder clean — ABOUT ME 5–8 files max (only static content), PROJECTS only active projects (archive finished ones monthly), TEMPLATES 6–10 max, LIBRARY the top 30 past campaigns rather than 500, culled quarterly. A lean folder gives fast, focused outputs.",
      },
      { type: "h3", body: "Mistake #6: never iterating on outputs" },
      {
        type: "p",
        body: "Problem: \"Cowork generated something. Not perfect, but good enough. Shipped it.\" Why: you skipped the correction loop. Fix: when an output is close but off, don't start over — tell Claude exactly what's wrong (\"the subject line is too long, make it under 20 characters; the CTA is vague, say what they get, fix both and regenerate\"). Claude reads the feedback and regenerates. This is the core muscle: prompt, review, correct, iterate. First campaign takes 3 iterations. Fifth campaign takes 1.",
      },
      { type: "h3", body: "Mistake #7: assuming Cowork can handle your entire stack" },
      {
        type: "p",
        body: "Problem: \"Why isn't Cowork pulling data from my custom internal tool?\" Why: Cowork needs a connector (MCP server) for each tool, and custom tools rarely have one. Fix: for tools without MCP, export data to a Google Sheet for Cowork to read, use Zapier to push data to Google Drive for Cowork to pick up, or use Coupler.io MCP as a universal translator covering 400+ sources. Most common tools (GA4, HubSpot, Salesforce, Slack, Google Workspace) have native MCP — niche tools don't, so plan accordingly.",
      },

      { type: "h2", body: "FAQ: marketing ops specific questions", id: "faq" },
      { type: "h3", body: "How much does Claude Cowork cost?" },
      {
        type: "p",
        body: "Claude Cowork requires a Claude Desktop subscription. Pro plan is $20/month, Max plan is $100/month. For small teams (1–2 people) doing light automation (1–2 scheduled reports), Pro is sufficient. For teams of 3+ running 5+ automated workflows daily, Max provides higher token limits and is more cost-effective.",
      },
      { type: "h3", body: "Can Cowork work with Salesforce data?" },
      {
        type: "p",
        body: "Yes. Anthropic supports Salesforce connectors via MCP — if yours is set up, Cowork queries Salesforce directly. As a workaround, you can export a Salesforce report to CSV, upload it to Google Drive, and tell Cowork to analyze the report in your Drive.",
      },
      { type: "h3", body: "What if I have sensitive customer data? Can Cowork see it?" },
      {
        type: "p",
        body: "Yes, Cowork reads files in your folder — so don't store raw PII there. Instead store aggregated data (\"250 customers in Northeast segment\"), anonymized examples (\"typical customer: mid-market SaaS, $5M ARR\"), and never raw CSVs with names, emails, or phone numbers. For compliance-heavy work, Anthropic offers enterprise deployments with self-hosted options.",
      },
      { type: "h3", body: "What if Cowork generates bad data or hallucinates in a report?" },
      {
        type: "p",
        body: "That's why humans approve before shipping. Cowork can misread a CSV, transpose numbers, or misinterpret definitions. Always review the output before sending, spot-check one number against the source, and trust but verify — it usually gets 95% right, but the 5% wrong can be costly.",
      },
      {
        type: "p",
        body: "If you spot a mistake: tell Cowork, \"The Q2 revenue should be $850K, not $805K. Fix the report.\" Cowork recalculates, you review, you ship. This approval loop takes 2 minutes per report.",
      },
      { type: "h3", body: "Can our team collaborate on Skills, or does one person own them?" },
      {
        type: "p",
        body: "Both work. Skills live in your shared Cowork folder — Person A creates a skill for email, Person B runs it and gets the output, Person C updates it based on what worked, and everyone has access. Just clarify ownership to avoid conflicts, e.g.:",
      },
      {
        type: "code",
        lang: "md",
        filename: "Email Sequence Builder Skill",
        source: `What it does: Generates 5-email nurture sequence
When to use it: Any nurture campaign, product launch emails
Input: Campaign brief (audience, goal, timeline)
Output: Markdown with 5 emails + subject lines + timing
Owner: Jane (jane@company.com) — ask before editing
Last updated: July 2026`,
      },
      { type: "h3", body: "Does Cowork integrate with Zapier or Make?" },
      {
        type: "p",
        body: "Not directly yet. But Zapier can trigger Cowork indirectly: form submission → Zapier → Google Drive upload → Cowork reads → generates → posts to Slack. It's a workaround, but it works for some flows. Anthropic is expanding integrations regularly.",
      },
      { type: "h3", body: "What happens if Cowork makes a mistake and we ship a bad campaign?" },
      {
        type: "p",
        body: "That's on the process, not the tool. Cowork generates and posts to Slack — not shipped yet. You review, catch the mistake before it goes live, ask Cowork to fix it, approve, then ship. If you skip approval and ship anyway, that's on you; the tool did its job, the process failed.",
      },
      { type: "h3", body: "Can we use Cowork for compliance/legal stuff (GDPR, CAN-SPAM)?" },
      {
        type: "p",
        body: "Cowork helps, but it's not your lawyer. It can add an \"Unsubscribe\" footer to emails, include GDPR consent language, and remind you of CAN-SPAM requirements. It can't guarantee compliance, keep up with every regulatory change, or review your specific privacy policy. Use it as a helper, not a replacement for legal review.",
      },
      { type: "h3", body: "How do we measure if Cowork is actually saving time?" },
      {
        type: "p",
        body: "Track it. Before Cowork: weekly report 90 minutes, campaign brief 2 hours, content repurposing 2 hours — 4.5 hours/week total. After Cowork (month 1): weekly report 15–30 minutes (review plus approval), campaign brief 30–45 minutes (review plus revisions), content repurposing 20–30 minutes (review) — 1–1.5 hours/week total. Time saved: 3–3.5 hours/week. This freed capacity shifts your team to higher-value work: strategy, optimization, enablement.",
      },

      { type: "h2", body: "Your challenge: build one automation this week", id: "challenge" },
      {
        type: "p",
        body: "Don't try to automate your entire ops stack tomorrow. Pick one repeating task. Best starting points: your weekly report (easiest, highest ROI), email campaigns (medium complexity, high value), or competitive briefs (medium difficulty, strategic). Don't start with full-stack marketing orchestration — too complex for week 1.",
      },
      {
        type: "ol",
        items: [
          "Download Claude Desktop",
          "Create your Cowork folder structure",
          "Write your brand voice rules (30 minutes)",
          "Build your first automation manually",
          "Turn it into a skill",
          "Schedule it",
        ],
      },
      {
        type: "p",
        body: "By next Friday, your automation is running on its own.",
      },

      { type: "h2", body: "Authoritative resources for marketing operations automation", id: "resources" },
      {
        type: "linklist",
        items: [
          {
            title: "Claude Desktop Download",
            url: "https://claude.com/download",
            meta: "macOS, Windows",
          },
          {
            title: "MCP Server List",
            url: "https://claude.com/connectors",
            meta: "official",
          },
          {
            title: "Coupler.io MCP",
            url: "https://coupler.io/",
            meta: "400+ data sources",
          },
          {
            title: "How Anthropic's marketing operations team uses Claude Cowork",
            url: "https://claude.com/blog/how-anthropics-marketing-operations-team-uses-claude-cowork-to-automate-reporting-and-campaign-builds",
            note: "Official Anthropic case study — source for the two workflows in this guide",
          },
          {
            title: "How people are using Claude Cowork",
            url: "https://claude.com/blog/how-people-are-using-claude-cowork",
            note: "Official Anthropic blog",
          },
        ],
      },
      {
        type: "p",
        body: "Suggested learning path: month 1 — set up your folder, create brand voice rules, build one automation (weekly report). Month 2 — build 2–3 more automations (campaigns, content repurposing). Month 3 — start chaining skills, refine based on actual usage. Month 4+ — optimize, share with team, expand to more workflows.",
      },
      {
        type: "callout",
        tone: "note",
        body: "This guide is adapted from and based on Anthropic's published guidance. For the official, authoritative source, see Anthropic's blog post on how its marketing operations team uses Claude Cowork, linked above.",
      },
    ],
  },
  "ship-a-waitlist-in-2-hours": {
    slug: "ship-a-waitlist-in-2-hours",
    tagline:
      "Single page. Email capture. Double opt-in. Referral counter. A real admin view. All in the time it takes to watch one Champions League match.",
    timeEstimate: "~2 hours, honestly",
    youWillNeed: [
      "A laptop with Node.js 20+",
      "A free Supabase account (10 min to create)",
      "A Resend account with one verified sending domain (DNS takes 5–30 min)",
      "A Vercel account for deploy",
      "No prior Next.js experience, but some React comfort helps",
    ],
    youWillEndUpWith:
      "A deployed waitlist at your-domain.com with working email confirmation, a referral counter per subscriber, and an admin page at /admin showing signups, sources, and CSV export.",
    toc: [
      { label: "0. Scope check", id: "scope" },
      { label: "1. Scaffold + deps", id: "scaffold" },
      { label: "2. The database", id: "db" },
      { label: "3. Signup API route", id: "signup" },
      { label: "4. Confirmation email", id: "email" },
      { label: "5. The landing page", id: "landing" },
      { label: "6. Referral tracking", id: "referrals" },
      { label: "7. Admin view", id: "admin" },
      { label: "8. Deploy", id: "deploy" },
      { label: "9. What to do next", id: "next" },
    ],
    body: [
      {
        type: "p",
        body: "This guide skips the theory. Every block below is something you actually type, run, or paste. If a step is longer than one action, it gets its own heading. If it's not essential to shipping, it's not here. If you hit an error we didn't cover, open a discussion — we'll add it.",
      },
      {
        type: "callout",
        tone: "tip",
        body: "If you want this even faster, clone the Waitlist Kit directly: `npx create-bitroot@latest my-waitlist --kit waitlist-kit`. This guide builds the same thing from scratch so you understand every line.",
      },

      { type: "h2", body: "0. Scope check", id: "scope" },
      {
        type: "p",
        body: "Before you start, make sure this is actually what you want. A waitlist is correct when:",
      },
      {
        type: "ul",
        items: [
          "You want to gauge interest before building the real thing",
          "You're running a paid ad and need a landing page that collects emails",
          "You're a month out from launch and want to warm a list",
        ],
      },
      {
        type: "p",
        body: "A waitlist is wrong when: you already have a product that works, you already have signups, or you're using it to delay a real launch. In those cases, ship the product.",
      },

      { type: "h2", body: "1. Scaffold + deps", id: "scaffold" },
      {
        type: "p",
        body: "Fresh Next.js 16 project with the App Router. The --turbopack flag is the default in 16, but it doesn't hurt to be explicit.",
      },
      {
        type: "code",
        lang: "bash",
        source: `npx create-next-app@latest my-waitlist --typescript --tailwind --app --no-src-dir
cd my-waitlist
npm install @supabase/supabase-js resend nanoid`,
      },
      {
        type: "snippet",
        title: "Or tell Claude Code to do it",
        body: "Scaffold a Next.js 16 App Router project called `my-waitlist` with TypeScript and Tailwind. Then install `@supabase/supabase-js`, `resend`, and `nanoid` as runtime deps. Keep the default Turbopack dev script. Don't add a src directory.",
      },
      {
        type: "p",
        body: "Three dependencies. Supabase is our database client, Resend sends the confirmation email, nanoid generates URL-safe referral codes. That's it. No auth library, no form library, no state manager — you don't need any of them.",
      },

      { type: "h2", body: "2. The database", id: "db" },
      {
        type: "p",
        body: "Create a Supabase project at supabase.com. Free tier is plenty. Once it's ready, grab the project URL and the service role key (Settings → API). Put them in your .env.local.",
      },
      {
        type: "code",
        lang: "dotenv",
        filename: ".env.local",
        source: `NEXT_PUBLIC_APP_URL=http://localhost:3000

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOi...

RESEND_API_KEY=re_...
RESEND_FROM_EMAIL="Your Product <hello@yourdomain.com>"

ADMIN_PASSWORD=replace-me-before-deploy`,
      },
      {
        type: "callout",
        tone: "warn",
        body: "The service role key bypasses row-level security. It must only ever be used in server-side code — never imported into a client component. We're only calling Supabase from API routes, so we're safe.",
      },
      {
        type: "p",
        body: "Now open the Supabase SQL editor and run this once. It creates the table with the fields we need plus a unique index on email so duplicate signups don't spawn duplicate rows.",
      },
      {
        type: "code",
        lang: "sql",
        filename: "supabase / sql editor",
        source: `create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  referral_code text not null unique,
  referred_by text,
  source text,
  confirmed boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists subscribers_email_unique
  on subscribers (lower(email));`,
      },

      { type: "h2", body: "3. Signup API route", id: "signup" },
      {
        type: "p",
        body: "Create a single POST route that: validates the email, generates a referral code, inserts (or upserts) the row, and kicks off a confirmation email. We'll put the Supabase client in a tiny lib file so any future route can import it.",
      },
      {
        type: "code",
        lang: "ts",
        filename: "lib/supabase.ts",
        source: `import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { persistSession: false } },
);`,
      },
      {
        type: "code",
        lang: "ts",
        filename: "app/api/subscribe/route.ts",
        source: `import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabase";
import { sendConfirmationEmail } from "@/lib/email";

const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

export async function POST(req: Request) {
  const { email, referredBy, source } = await req.json();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const referralCode = nanoid(10);

  const { data, error } = await supabase
    .from("subscribers")
    .upsert(
      {
        email: email.toLowerCase().trim(),
        referral_code: referralCode,
        referred_by: referredBy ?? null,
        source: source ?? null,
      },
      { onConflict: "email", ignoreDuplicates: false },
    )
    .select("referral_code")
    .single();

  if (error) {
    console.error("subscribe insert failed", error);
    return NextResponse.json({ error: "Try again in a moment." }, { status: 500 });
  }

  await sendConfirmationEmail(email, data.referral_code);

  return NextResponse.json({ ok: true, referralCode: data.referral_code });
}`,
      },
      {
        type: "callout",
        tone: "note",
        body: "Upsert instead of insert means re-submitting the same email is a no-op, not an error. Good UX — nobody cares that they already signed up, they just want it to work.",
      },

      { type: "h2", body: "4. Confirmation email", id: "email" },
      {
        type: "p",
        body: "Resend + a plain HTML template is all you need for the confirmation mail. Don't reach for React Email yet — one template, one style, done.",
      },
      {
        type: "code",
        lang: "ts",
        filename: "lib/email.ts",
        source: `import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendConfirmationEmail(email: string, code: string) {
  const confirmUrl = \`\${process.env.NEXT_PUBLIC_APP_URL}/api/confirm?code=\${code}\`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "One click to confirm your spot",
    html: \`
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h1 style="font-size:22px;margin:0 0 12px">You're almost in.</h1>
        <p style="color:#555;line-height:1.55">
          Tap the button below to confirm your email and lock your place on the waitlist.
        </p>
        <a href="\${confirmUrl}"
           style="display:inline-block;background:#171512;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;margin:16px 0">
          Confirm my spot →
        </a>
        <p style="color:#888;font-size:12px">If you didn't sign up, ignore this email.</p>
      </div>
    \`,
  });
}`,
      },
      {
        type: "code",
        lang: "ts",
        filename: "app/api/confirm/route.ts",
        source: `import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/", req.url));

  await supabase
    .from("subscribers")
    .update({ confirmed: true })
    .eq("referral_code", code);

  return NextResponse.redirect(
    new URL(\`/welcome?code=\${code}\`, req.url),
  );
}`,
      },

      { type: "h2", body: "5. The landing page", id: "landing" },
      {
        type: "p",
        body: "Now the actual page. One headline, one sub, one input, one button. We're going to skip marketing copy — you bring that — and focus on the mechanics of form submission and the post-submit state.",
      },
      {
        type: "code",
        lang: "tsx",
        filename: "app/page.tsx",
        source: `"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const referredBy =
      new URLSearchParams(window.location.search).get("ref") ?? undefined;
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, referredBy, source: document.referrer }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErrorMsg(data.error ?? "Try again");
      setState("error");
      return;
    }
    setState("sent");
  }

  return (
    <main className="max-w-md mx-auto py-24 px-6">
      <h1 className="text-4xl font-bold tracking-tight">Your Product Name.</h1>
      <p className="mt-3 text-neutral-600">
        One line about what you're building. Join the waitlist for early access.
      </p>

      {state === "sent" ? (
        <p className="mt-8 text-green-700">
          Check your inbox — click the link to confirm your spot.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@work.com"
            className="flex-1 border rounded-md px-3 py-2"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="bg-black text-white rounded-md px-4 py-2"
          >
            {state === "loading" ? "…" : "Join"}
          </button>
        </form>
      )}

      {state === "error" && (
        <p className="mt-3 text-red-600 text-sm">{errorMsg}</p>
      )}
    </main>
  );
}`,
      },
      {
        type: "p",
        body: "Not pretty — deliberately. You'll restyle this in the next 20 minutes. The mechanics are the point: form → POST → state transition → confirmation. Run `npm run dev` and sign up with your own email. You should receive the confirmation email within a few seconds.",
      },

      { type: "h2", body: "6. Referral tracking", id: "referrals" },
      {
        type: "p",
        body: "Referrals are tracked in two steps: (1) every subscriber has a unique code stored with their row, (2) when someone visits /?ref=CODE, we pass that code back to the API, which stores it as referred_by on the new subscriber. Our page.tsx already reads the ref param. What's left is showing the subscriber their personal referral link on the welcome page.",
      },
      {
        type: "code",
        lang: "tsx",
        filename: "app/welcome/page.tsx",
        source: `export default async function Welcome({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const link = \`\${process.env.NEXT_PUBLIC_APP_URL}/?ref=\${code ?? ""}\`;

  return (
    <main className="max-w-md mx-auto py-24 px-6">
      <h1 className="text-3xl font-bold">You're confirmed. ✓</h1>
      <p className="mt-3 text-neutral-600">
        Move up the list by sharing your personal link:
      </p>
      <code className="block mt-5 p-3 bg-neutral-100 rounded-md text-sm break-all">
        {link}
      </code>
    </main>
  );
}`,
      },
      {
        type: "p",
        body: "Next.js 16's searchParams is now a Promise — you await it. If you're on an older version you can destructure directly.",
      },

      { type: "h2", body: "7. Admin view", id: "admin" },
      {
        type: "p",
        body: "A password-gated server component that lists signups. Real admin panels are overkill for a waitlist. A protected page with a table and a CSV link is more than enough, and you'll thank yourself for not building more.",
      },
      {
        type: "code",
        lang: "tsx",
        filename: "app/admin/page.tsx",
        source: `import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function AdminPage() {
  const pass = (await cookies()).get("admin")?.value;
  if (pass !== process.env.ADMIN_PASSWORD) redirect("/admin/login");

  const { data: rows = [] } = await supabase
    .from("subscribers")
    .select("email, confirmed, source, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <main className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-2xl font-bold mb-6">
        {rows?.length ?? 0} subscribers
      </h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-neutral-500">
            <th>Email</th><th>Confirmed</th><th>Source</th><th>When</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((r) => (
            <tr key={r.email} className="border-t">
              <td className="py-2">{r.email}</td>
              <td>{r.confirmed ? "✓" : "—"}</td>
              <td className="text-neutral-500">{r.source ?? "direct"}</td>
              <td className="text-neutral-500">
                {new Date(r.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}`,
      },
      {
        type: "callout",
        tone: "warn",
        body: "Storing the admin password in a cookie this way is fine for a weekend waitlist, but don't use this pattern for anything with real user data. Upgrade to Clerk or Supabase Auth the moment it's not a waitlist anymore.",
      },

      { type: "h2", body: "8. Deploy", id: "deploy" },
      {
        type: "p",
        body: "Push to GitHub, import into Vercel, paste your env vars, hit deploy. Update NEXT_PUBLIC_APP_URL to your live URL after the first deploy and redeploy once more so confirmation links point at production.",
      },
      {
        type: "code",
        lang: "bash",
        source: `git init
git add .
git commit -m "ship waitlist"
git remote add origin git@github.com:you/my-waitlist.git
git push -u origin main

# Then at vercel.com/new:
#   1. Import the repo
#   2. Paste the env vars from .env.local (update NEXT_PUBLIC_APP_URL)
#   3. Deploy`,
      },

      { type: "h2", body: "9. What to do next", id: "next" },
      {
        type: "p",
        body: "Now go send that URL to five people who you think might care. If any of them don't confirm their email within an hour, your template or sender reputation has an issue — check Resend's dashboard for the event log and fix whatever's wrong before you share more broadly.",
      },
      {
        type: "ul",
        items: [
          "Buy a cheap domain ($10 on Porkbun) and verify it in Resend before launch — deliverability from a fresh domain is always better than sharing one",
          "Add a honey-pot field to catch bots — we skipped it, you'll want it when you post anywhere public",
          "Track conversion in Plausible (or just pageviews) so you know which sources are worth doubling down on",
          "Write 3 Twitter variations for the launch post before you launch — you'll panic otherwise",
        ],
      },
    ],
    referenced: [
      {
        slug: "waitlist-kit",
        category: "kit",
        note: "Clone-ready version of this exact build",
      },
      {
        slug: "readme-generator",
        category: "tool",
        note: "Draft a README for your new repo",
      },
    ],
  },

  "design-planning-workflow": {
    slug: "design-planning-workflow",
    tagline:
      "A single operational guide for setting up a production-ready design workflow — designer tools, Figma structure, MCP/Copilot, and the practical Antigravity ↔ Figma prompts you'll actually paste.",
    timeEstimate: "~20 min read",
    youWillNeed: [
      "An Antigravity account",
      "A Figma account",
      "A GitHub account for Copilot/MCP",
    ],
    youWillEndUpWith:
      "A fully scaffolded design workflow: Antigravity + Figma + MCP, a clean Figma page structure, a working AI-ready handoff page, and a set of reusable prompts for IA, code conversion, and audits.",
    toc: [
      { label: "A. Designer tool setup", id: "tools" },
      { label: "B. Figma setup & organization", id: "figma" },
      { label: "C. Figma + Antigravity workflow", id: "workflow" },
      { label: "Prompts you'll actually use", id: "prompts" },
    ],
    body: [
      {
        type: "p",
        body: "This is the single operational guide we use to kick off a new product's design system. Follow it top to bottom, keep the page open while you set up, and don't add ceremony that isn't here. The goal is a clean Figma file, an AI-ready handoff page, and prompts you can paste without thinking.",
      },
      {
        type: "callout",
        tone: "tip",
        body: "Designer-focused: only the parts of the toolchain that support Figma, Antigravity, and AI-assisted handoff are required. Detailed Git, Node, and backend scaffolding live in a different guide.",
      },

      { type: "h2", body: "A. Designer tool setup", id: "tools" },

      { type: "h3", body: "1. Antigravity workspace" },
      {
        type: "p",
        body: "Antigravity is the AI-assisted design workflow we run prompts and workspace context through. Install it, sign in, and confirm the workspace loads before doing anything else.",
      },
      {
        type: "ul",
        items: [
          "Download from antigravity.com and install.",
          "Launch and sign in if prompted.",
          "Confirm the workspace opens cleanly.",
        ],
      },

      { type: "h3", body: "2. Figma" },
      {
        type: "p",
        body: "Figma holds the design files, components, prototypes, and the handoff page. Get an account, install the desktop app, and create one new project file you'll point everything else at.",
      },
      {
        type: "ul",
        items: [
          "Sign up at figma.com.",
          "Install the desktop app from figma.com/downloads.",
          "Create a new project file and confirm you can edit and share it.",
        ],
      },

      { type: "h3", body: "3. MCP / GitHub Copilot configuration" },
      {
        type: "p",
        body: "MCP and Copilot are what give the AI tools real workspace context. Install the GitHub Copilot extension inside Antigravity, sign in, and enable workspace indexing.",
      },
      {
        type: "ol",
        items: [
          "Open Antigravity and click the Extensions icon.",
          "Search for `GitHub Copilot` and install it.",
          "Sign in with your GitHub account when prompted.",
          "In the Copilot/MCP settings, enable workspace context, markdown support, and file indexing.",
          "If Antigravity supports it, open Settings → Copilot → MCP and confirm the repo folder is indexed.",
          "Restart Antigravity if anything looks off.",
        ],
      },
      {
        type: "callout",
        tone: "note",
        body: "Verification: the Copilot pane is visible in the sidebar, your workspace files appear in its context, and opening this guide in the editor shows AI suggestions.",
      },

      { type: "h3", body: "4. What is not required here" },
      {
        type: "p",
        body: "These belong to the developer guide, not this one — adding them creates noise that slows the designer flow:",
      },
      {
        type: "ul",
        items: [
          "Detailed Git installation and identity setup.",
          "Node.js and package manager setup.",
          "Remote repo init and push commands.",
          "Full backend/frontend scaffolding.",
          "Anything code-environment-only.",
        ],
      },

      { type: "h2", body: "B. Figma setup & organization", id: "figma" },

      { type: "h3", body: "1. Create the file" },
      {
        type: "ol",
        items: [
          "Open figma.com.",
          "Create a new team or pick an existing one.",
          "Click `New File`.",
          "Name the file after your product.",
        ],
      },

      { type: "h3", body: "2. Page structure" },
      {
        type: "p",
        body: "Use this exact structure for every product. Numbered prefixes keep the sidebar ordered.",
      },
      {
        type: "code",
        lang: "text",
        source: `Figma Workspace
│
├── 01 Foundations
├── 02 Typography
├── 03 Colors
├── 04 Components
├── 05 Wireframes
├── 06 Screens
├── 07 Prototypes
├── 08 Assets
└── 09 Developer Handoff`,
      },

      { type: "h3", body: "3. What lives on each page" },
      {
        type: "ul",
        items: [
          "Foundations — brand, mission, product principles.",
          "Typography — font styles and heading scales.",
          "Colors — palette, states, alerts.",
          "Components — atoms, molecules, layouts.",
          "Wireframes — layout concepts and page structure.",
          "Screens — final screens and flows.",
          "Prototypes — interactive sequences.",
          "Assets — exported icons and images.",
          "Developer Handoff — design specs for engineering.",
        ],
      },

      { type: "h3", body: "4. Naming conventions" },
      {
        type: "ul",
        items: [
          "Frames: `Section / Page / Purpose`",
          "Components: `Component / State / Size`",
          "Variants: `Button / Primary / Default`",
          "Pages: `01 Foundations`, `02 Typography`, ...",
        ],
      },

      { type: "h3", body: "5. Component organisation" },
      {
        type: "p",
        body: "Group your components by purpose, and use explicit variant axes so the same component reads the same in Figma and code.",
      },
      {
        type: "ul",
        items: [
          "Groups: buttons · form fields · cards · navigation · modals · tables · notifications · avatars.",
          "Variants: `Button / Primary / Default`, `Button / Primary / Hover`, `Input / Default / Focus`, `Badge / Success / Filled`.",
        ],
      },

      { type: "h3", body: "6. Export rules" },
      {
        type: "ol",
        items: [
          "Use Dev Mode for handoff.",
          "Export icons as SVG.",
          "Export images as PNG or WEBP.",
          "Use lower-kebab-case asset names.",
          "Only use `@2x` for high-DPI raster assets.",
        ],
      },

      { type: "h3", body: "7. Developer handoff page" },
      {
        type: "ul",
        items: [
          "Design tokens",
          "Color palette",
          "Typography",
          "Spacing scale",
          "Component specs",
          "Grid and layout",
        ],
      },

      { type: "h2", body: "C. Figma + Antigravity workflow", id: "workflow" },

      { type: "h3", body: "1. Set up an AI-ready page" },
      {
        type: "ul",
        items: [
          "Create a Figma page called `AI-ready` (or reuse `Developer Handoff`).",
          "Place only the current screen or component you want to convert.",
          "Use clear frame names: `Dashboard / Overview`, `Inventory / Item Card`.",
          "Add text notes for tokens, spacing, typography, and component names.",
          "Limit each prompt target to one screen or one reusable component.",
        ],
      },

      { type: "h3", body: "2. Connect Figma to Antigravity" },
      {
        type: "ul",
        items: [
          "Use Figma MCP or the Antigravity integration to select the frame.",
          "Share the frame with the AI tool before asking the prompt.",
          "If a screenshot is easier, export only the target frame.",
          "Never send a full page with unrelated content.",
        ],
      },

      { type: "h3", body: "3. Practical prompt rules" },
      {
        type: "ul",
        items: [
          "Always name the stack — React, Tailwind, the component names.",
          "Always name the source — screenshot, Figma frame, or React component code.",
          "Always ask for exact values — colors, spacing, typography, interactive behaviours.",
          "Keep prompts short, direct, and outcome-focused.",
        ],
      },

      { type: "h3", body: "4. Review and refine" },
      {
        type: "ul",
        items: [
          "Inspect the AI output for token consistency and responsive layout.",
          "Update Figma annotations to match the final code decisions.",
          "Save the prompt output in `docs/` or on the Figma handoff page.",
          "Confirm the final component uses the design system naming from `@components/ui/Button` and other shared primitives.",
        ],
      },

      { type: "h2", body: "Prompts you'll actually use", id: "prompts" },
      {
        type: "p",
        body: "Paste these directly into Antigravity or Claude. They're written to assume the AI-ready page setup above.",
      },

      {
        type: "snippet",
        title: "Information architecture",
        body: "I am building a B2B SaaS warehouse management system. Generate a comprehensive sitemap including inventory tracking, employee shifts, logistics, and admin settings. Use a hierarchical structure.",
      },
      {
        type: "snippet",
        title: "AI-assisted design workflow",
        body: "Convert this screenshot into a responsive React component. Use Tailwind CSS. Extract the exact colors and spacing from the image. Ensure the buttons use our 'Primary' component from @components/ui/Button.",
      },
      {
        type: "snippet",
        title: "Developer handoff",
        body: "Review this Figma frame (via screenshot or MCP). Write a detailed technical specification for a developer. Include layout structure, spacing, typography, and interactive behaviors for each element.",
      },
      {
        type: "snippet",
        title: "Component documentation",
        body: "Review this React component code. Generate a README that includes: a description of the component, a list of all props with their types and defaults, and three examples of how to use it in different scenarios.",
      },
      {
        type: "snippet",
        title: "Design mistakes audit",
        body: "Review this screenshot/code of our new Dashboard. Look specifically for: 1. Poor visual hierarchy, 2. Accessibility failures (contrast/labels), 3. Inconsistent spacing, 4. Potential responsive issues. Provide a bulleted list of fixes.",
      },
    ],
    referenced: [
      {
        slug: "ai-assisted-fullstack-workflow",
        category: "guide",
        note: "The developer-side companion to this guide",
      },
    ],
  },

  "ai-assisted-fullstack-workflow": {
    slug: "ai-assisted-fullstack-workflow",
    tagline:
      "How to plan, prompt, and ship a full-stack app with AI coding tools without ending up with hallucinated code and brittle architecture. Stack, rules, PRD, vertical slices, and the exact prompts.",
    timeEstimate: "~25 min read",
    youWillNeed: [
      "Cursor, Claude Code, or another AI coding tool",
      "A stack you're willing to commit to for the whole project",
      "30 minutes of quiet to plan before you generate anything",
    ],
    youWillEndUpWith:
      "A foundation that survives AI assistance: a fixed stack, a `.cursor/rules` directory, a real PRD, and a vertical-slice plan you can hand to the agent one slice at a time.",
    toc: [
      { label: "Before you start", id: "before" },
      { label: "Recommended stacks", id: "stack" },
      { label: "Step 1 — Lock the foundation", id: "foundation" },
      { label: "Step 2 — Write AI rules", id: "rules" },
      { label: "Step 3 — Generate a PRD", id: "prd" },
      { label: "Step 4 — Vertical slice plan", id: "slices" },
    ],
    body: [
      {
        type: "p",
        body: "Most AI-assisted projects don't fail because the model is bad. They fail because the architecture is fuzzy, the rules aren't written down, prompts are too big, and nobody is documenting what shipped. This guide is the workflow we use to keep that from happening.",
      },

      { type: "h2", body: "Before you start", id: "before" },
      {
        type: "p",
        body: "AI coding tools work best when the architecture is clear, the rules are structured, the prompts are focused, and the development is iterative. They fail when you ask them to do everything at once.",
      },
      {
        type: "callout",
        tone: "warn",
        body: "Do not: generate the entire app in one prompt, randomly switch frameworks mid-build, let the AI invent project structure, skip documentation, or build giant features at once. All four of these turn AI from leverage into liability.",
      },
      {
        type: "ul",
        items: [
          "Build feature-by-feature.",
          "Use vertical slices (DB → API → UI in one go).",
          "Maintain strict project rules.",
          "Document continuously — even one line per slice.",
          "Keep prompts focused on a single outcome.",
        ],
      },

      { type: "h2", body: "Recommended stacks", id: "stack" },
      {
        type: "p",
        body: "Pick one stable stack and stay consistent. The exact choice matters less than the discipline of not switching mid-build.",
      },

      { type: "h3", body: "Frontend" },
      {
        type: "linklist",
        items: [
          { title: "Next.js", url: "https://nextjs.org", note: "App Router, RSC, the default for new SaaS work." },
          { title: "Tailwind CSS", url: "https://tailwindcss.com", note: "Utility-first styling AI tools handle well." },
          { title: "shadcn/ui", url: "https://ui.shadcn.com", note: "Copy-in components, easy to extend." },
          { title: "Tremor", url: "https://www.tremor.so", note: "Dashboards and charts on top of Tailwind." },
        ],
      },

      { type: "h3", body: "Backend" },
      {
        type: "linklist",
        items: [
          { title: "FastAPI", url: "https://fastapi.tiangolo.com", note: "Python, typed, great for AI-heavy APIs." },
          { title: "Convex", url: "https://convex.dev", note: "Reactive backend with realtime built in." },
          { title: "Laravel", url: "https://laravel.com", note: "If your team is already in PHP." },
        ],
      },

      { type: "h3", body: "Database" },
      {
        type: "linklist",
        items: [
          { title: "PostgreSQL", url: "https://www.postgresql.org", note: "Default for almost everything." },
          { title: "MongoDB", url: "https://www.mongodb.com", note: "When the data really is document-shaped." },
          { title: "Supabase", url: "https://supabase.com", note: "Postgres + auth + storage in one place." },
        ],
      },

      { type: "h3", body: "Auth" },
      {
        type: "linklist",
        items: [
          { title: "Clerk", url: "https://clerk.com", note: "Drop-in auth with great Next.js DX." },
          { title: "Auth.js", url: "https://authjs.dev", note: "Open-source, BYO providers." },
          { title: "Supabase Auth", url: "https://supabase.com/auth", note: "Bundled with Supabase Postgres." },
        ],
      },

      { type: "h3", body: "AI coding tools" },
      {
        type: "linklist",
        items: [
          { title: "Cursor", url: "https://cursor.com", note: "AI-first editor with codebase context." },
          { title: "Claude Code", url: "https://claude.com/claude-code", note: "Terminal-first agent for repo-wide work." },
          { title: "Antigravity", url: "https://antigravity.dev", note: "AI-assisted workspace + MCP integration." },
          { title: "Windsurf", url: "https://codeium.com/windsurf", note: "Agentic editor from Codeium." },
          { title: "Trae", url: "https://trae.ai", note: "Lightweight AI IDE." },
        ],
      },

      { type: "h3", body: "UI-first / prototyping tools" },
      {
        type: "linklist",
        items: [
          { title: "Lovable", url: "https://lovable.dev", note: "Generate full UIs from prompts." },
          { title: "v0", url: "https://v0.dev", note: "Vercel's generative React UI tool." },
          { title: "Bolt.new", url: "https://bolt.new", note: "Full-stack prototypes in the browser." },
          { title: "Figma Make", url: "https://www.figma.com/make", note: "Generative design inside Figma." },
        ],
      },

      { type: "h3", body: "Boilerplates" },
      {
        type: "linklist",
        items: [
          { title: "Taxonomy", url: "https://tx.shadcn.com", note: "Next.js + shadcn reference build." },
          { title: "ShipFast", url: "https://shipfa.st", note: "Paid Next.js SaaS starter." },
          { title: "Wasp", url: "https://wasp-lang.dev", note: "Declarative full-stack framework." },
        ],
      },

      { type: "h2", body: "Step 1 — Lock the foundation", id: "foundation" },
      {
        type: "p",
        body: "Before generating any code, write down the stack, the database, the auth provider, the UI library, and the folder structure. Pin them.",
      },
      {
        type: "code",
        lang: "text",
        source: `Frontend:  Next.js + Tailwind + shadcn/ui
Backend:   FastAPI
Database:  PostgreSQL
Auth:      Clerk`,
      },
      {
        type: "callout",
        tone: "warn",
        body: "Once these are set, do not mix random technologies later, change architecture midway, or let the AI decide the stack. Every switch costs you a refactor.",
      },

      { type: "h2", body: "Step 2 — Write AI rules", id: "rules" },
      {
        type: "p",
        body: "AI coding tools need explicit project rules or your code quality drifts, the folder structure goes feral, and APIs become inconsistent. Drop a `.cursor/rules/` folder at the repo root and seed it with files for naming, styling, APIs, project context, error handling, database, and auth.",
      },
      {
        type: "code",
        lang: "bash",
        source: `mkdir -p .cursor/rules
touch .cursor/rules/{naming,styling,api-conventions,project-context,error-patterns,database-rules,auth-rules}.mdc`,
      },
      {
        type: "h3",
        body: "Example rule files",
      },
      {
        type: "code",
        lang: "text",
        filename: ".cursor/rules/naming.mdc",
        source: `- Use PascalCase for components
- Use camelCase for variables
- Use kebab-case for folders
- Use descriptive filenames`,
      },
      {
        type: "code",
        lang: "text",
        filename: ".cursor/rules/api-conventions.mdc",
        source: `- Always use async/await
- Validate all inputs (Zod)
- Never trust frontend data
- Use consistent API response shapes`,
      },
      {
        type: "snippet",
        title: "Generate the rules system",
        body: "Analyze this codebase and generate a complete AI rules system. Include: naming conventions, folder structure, API conventions, database conventions, authentication handling, validation patterns, error handling, component architecture, styling conventions, and security guidelines. Optimize the project for AI-assisted development tools like Cursor, Claude Code, and Copilot. Keep the rules practical and implementation-focused.",
      },

      { type: "h2", body: "Step 3 — Generate a PRD", id: "prd" },
      {
        type: "p",
        body: "The PRD becomes the source of truth for developers, AI tools, architecture, and feature planning. A good PRD prevents the AI from inventing.",
      },
      {
        type: "ul",
        items: [
          "User roles",
          "Complete user flows",
          "Entities + permissions",
          "Validations + error states",
          "Edge cases",
          "UI behavior + API behavior",
          "Admin functionality",
          "Mobile behavior",
          "Integrations",
        ],
      },
      {
        type: "snippet",
        title: "Write the PRD",
        body: "Write a production-grade PRD for this application. Include: user roles, complete user flows, database entities, permissions, API behavior, validation rules, edge cases, error states, UI behavior, admin functionality, mobile responsiveness, and integrations. The PRD should be detailed enough for an AI coding agent to build the system without guessing. Keep the structure implementation-focused.",
      },

      { type: "h2", body: "Step 4 — Vertical slice plan", id: "slices" },
      {
        type: "p",
        body: "Never build the whole app at once. Each slice goes Database → Backend logic → API → Frontend UI → Validation → Testing. Start with auth, then core CRUD, then advanced workflows.",
      },
      {
        type: "code",
        lang: "text",
        source: `1. Authentication
2. User Profile CRUD
3. Dashboard
4. Payments
5. Notifications
6. Admin Panel`,
      },
      {
        type: "snippet",
        title: "Generate the slice plan",
        body: "Using the PRD, generate a vertical-slice implementation plan. Rules: build feature-by-feature, start with authentication, then core CRUD, then advanced workflows, keep slices small, keep dependencies logical. Each slice must include database, backend logic, API routes, frontend UI, validation, and testing.",
      },
      {
        type: "callout",
        tone: "tip",
        body: "Ship one slice end-to-end before starting the next. AI tools accelerate vertical slices; they sabotage horizontal builds where you stub everything and never come back.",
      },
    ],
    referenced: [
      {
        slug: "design-planning-workflow",
        category: "guide",
        note: "The design-side companion to this workflow",
      },
      {
        slug: "waitlist-kit",
        category: "kit",
        note: "A working vertical-slice example — DB, API, UI, all wired",
      },
    ],
  },

  "free-analytics-tools": {
    slug: "free-analytics-tools",
    tagline:
      "A field-tested list of free analytics platforms — product, web, session replay, and telemetry — with the exact 2026 free-tier volume that each one actually gives you.",
    timeEstimate: "~6 min read",
    youWillNeed: [
      "An idea of what you're tracking (events, page views, sessions, errors)",
      "An hour to wire up the first one and stop sweating analytics",
    ],
    youWillEndUpWith:
      "A short list of free tools that fit your use case, with the free-tier ceiling for each so you know when you'll need to pay (or self-host).",
    toc: [
      { label: "Product analytics & events", id: "product" },
      { label: "Privacy-first web analytics", id: "privacy" },
      { label: "Session replays & heatmaps", id: "replays" },
      { label: "Modern web-dev alternatives", id: "webdev" },
      { label: "App telemetry & observability", id: "telemetry" },
    ],
    body: [
      {
        type: "p",
        body: "Every \"free analytics\" list eventually becomes a list of trials. This one only includes tools with a genuine free tier (or AGPL self-host option) — and quotes the 2026 ceiling so you know exactly what you're getting.",
      },

      { type: "h2", body: "Product analytics & events", id: "product" },
      {
        type: "linklist",
        items: [
          {
            title: "PostHog",
            url: "https://posthog.com",
            meta: "1M events/mo",
            note: "+ 5K session recordings + 1M feature flag requests/mo. Heatmaps included.",
          },
          {
            title: "Mixpanel",
            url: "https://mixpanel.com",
            meta: "1M events/mo",
            note: "10K session replays/mo, core funnels/flows/retention, 5 saved reports per seat.",
          },
          {
            title: "Amplitude",
            url: "https://amplitude.com",
            meta: "10K MTUs · ~2M events/mo",
            note: "Includes session replay + unlimited feature flags.",
          },
          {
            title: "Heap",
            url: "https://www.heap.io",
            meta: "10K user sessions/mo",
            note: "Retroactive autocapture — no instrumentation to set events up front.",
          },
          {
            title: "OpenPanel",
            url: "https://openpanel.dev",
            meta: "Free unlimited self-hosted",
            note: "AGPL-3.0. Cloud is trial-only.",
          },
        ],
      },

      { type: "h2", body: "Privacy-first web analytics", id: "privacy" },
      {
        type: "linklist",
        items: [
          {
            title: "Plausible",
            url: "https://plausible.io",
            meta: "Free + unlimited (self-host)",
            note: "AGPL. Cloud is paid; self-hosted is free forever.",
          },
          {
            title: "Umami",
            url: "https://umami.is",
            meta: "100K events/mo · or self-host",
            note: "Free Cloud Hobby tier, or unlimited when you run it yourself.",
          },
          {
            title: "Pirsch",
            url: "https://pirsch.io",
            meta: "30-day trial only",
            note: "Included for completeness — no real free tier.",
          },
        ],
      },

      { type: "h2", body: "Session replays & heatmaps", id: "replays" },
      {
        type: "linklist",
        items: [
          {
            title: "Microsoft Clarity",
            url: "https://clarity.microsoft.com",
            meta: "100% free forever",
            note: "Zero traffic caps. Unlimited everything.",
          },
          {
            title: "Highlight.io",
            url: "https://www.highlight.io",
            meta: "500 replays + 1K errors/mo",
            note: "Open-source (Apache 2.0). Free forever tier.",
          },
        ],
      },

      { type: "h2", body: "Modern web-dev alternatives", id: "webdev" },
      {
        type: "linklist",
        items: [
          {
            title: "Vercel Analytics",
            url: "https://vercel.com/analytics",
            meta: "50K events/mo",
            note: "Hobby (free) plan. Pairs with Vercel deployments out of the box.",
          },
          {
            title: "Cloudflare Web Analytics",
            url: "https://www.cloudflare.com/web-analytics/",
            meta: "Free for unlimited sites",
            note: "Privacy-friendly, no cookies, DNS-proxied traffic.",
          },
          {
            title: "Matomo",
            url: "https://matomo.org",
            meta: "Free self-hosted",
            note: "PHP + MySQL. Mature Google-Analytics alternative.",
          },
          {
            title: "TelemetryDeck",
            url: "https://telemetrydeck.com",
            meta: "100K signals/mo",
            note: "For iOS, macOS, Android apps. Privacy-first.",
          },
        ],
      },

      { type: "h2", body: "App telemetry & observability", id: "telemetry" },
      {
        type: "linklist",
        items: [
          {
            title: "GlitchTip",
            url: "https://glitchtip.com",
            meta: "1K events/mo · or self-host",
            note: "Sentry-compatible API. Self-hosted is unlimited.",
          },
          {
            title: "Grafana Cloud",
            url: "https://grafana.com/products/cloud/",
            meta: "10K metric series · 50GB logs · 50GB traces",
            note: "Free forever. 14-day retention.",
          },
          {
            title: "New Relic",
            url: "https://newrelic.com",
            meta: "100GB ingest/mo",
            note: "1 full user + unlimited basic users. 8-day retention.",
          },
          {
            title: "Rollbar",
            url: "https://rollbar.com",
            meta: "5K errors + 1K replays/mo",
            note: "30-day retention. Unlimited users.",
          },
        ],
      },
      {
        type: "callout",
        tone: "note",
        body: "Free-tier limits change. Always re-check the pricing page before you commit a stack — this list was current as of May 2026.",
      },
    ],
  },

  "50-places-to-list-your-startup": {
    slug: "50-places-to-list-your-startup",
    tagline:
      "A working list of 50 free launch platforms, communities, and directories — annotated with audience size and a one-line note on what each is good for.",
    timeEstimate: "~8 min read",
    youWillNeed: [
      "A landing page that loads",
      "A one-line pitch and a screenshot",
      "Patience — most distribution is slow and cumulative",
    ],
    youWillEndUpWith:
      "A prioritised list of places to post your launch, grouped by audience type, with the obvious tier-one platforms separated from the long tail.",
    toc: [
      { label: "Tier 1 — high-leverage launches", id: "tier1" },
      { label: "Reddit communities", id: "reddit" },
      { label: "Directories & discovery", id: "directories" },
      { label: "B2B review sites", id: "reviews" },
      { label: "Builder & maker communities", id: "builders" },
      { label: "Niche groups (FB / Discord)", id: "groups" },
    ],
    body: [
      {
        type: "p",
        body: "Launching is mostly distribution. The handful of platforms below have moved real traffic for our products and the products of founders we know. The list is sorted into tiers — start with tier one, don't try to do all fifty in one week.",
      },

      { type: "h2", body: "Tier 1 — high-leverage launches", id: "tier1" },
      {
        type: "linklist",
        items: [
          { title: "Product Hunt", url: "https://www.producthunt.com", meta: "~5.4M/mo", note: "Strongest single-day launch platform if your category fits." },
          { title: "Hacker News", url: "https://news.ycombinator.com", meta: "~15–20M/mo", note: "Show HN — high-signal YC/startup tech audience." },
          { title: "Indie Hackers", url: "https://www.indiehackers.com", meta: "~500–600K/mo", note: "Indie founder and maker community." },
          { title: "DEV Community", url: "https://dev.to", meta: "~10M+/mo", note: "Developer-focused publishing platform." },
          { title: "AppSumo", url: "https://appsumo.com", meta: "~2.1M/mo", note: "Useful for SaaS exposure and lifetime-deal launches." },
        ],
      },

      { type: "h2", body: "Reddit communities", id: "reddit" },
      {
        type: "linklist",
        items: [
          { title: "r/Entrepreneur", url: "https://www.reddit.com/r/Entrepreneur", meta: "~5.1M members", note: "Large founder and business audience." },
          { title: "r/InternetIsBeautiful", url: "https://www.reddit.com/r/InternetIsBeautiful", meta: "~16.6M members", note: "Showcase useful/free tools." },
          { title: "r/startups", url: "https://www.reddit.com/r/startups", meta: "~1.8–2M members", note: "Startup-focused founder and builder community." },
          { title: "r/smallbusiness", url: "https://www.reddit.com/r/smallbusiness", meta: "~2M members", note: "Small business and founder audience." },
          { title: "r/webdev", url: "https://www.reddit.com/r/webdev", meta: "~3.1M members", note: "Frontend/dev-tool audience." },
          { title: "r/digitalnomad", url: "https://www.reddit.com/r/digitalnomad", meta: "~2.4M members", note: "Remote work and indie founder audience." },
          { title: "r/EntrepreneurRideAlong", url: "https://www.reddit.com/r/EntrepreneurRideAlong", meta: "~520K members", note: "Founder journey and growth discussions." },
          { title: "r/SaaS", url: "https://www.reddit.com/r/SaaS", meta: "~168K members", note: "SaaS founder and product-building audience." },
          { title: "r/SEO", url: "https://www.reddit.com/r/SEO", meta: "~328K members", note: "SEO and growth marketing community." },
          { title: "r/content_marketing", url: "https://www.reddit.com/r/content_marketing", meta: "~126K members", note: "Content marketing and growth audience." },
          { title: "r/advancedentrepreneur", url: "https://www.reddit.com/r/advancedentrepreneur", meta: "~51K members", note: "Experienced founder and operator discussions." },
          { title: "r/GrowthHacking", url: "https://www.reddit.com/r/GrowthHacking", meta: "~53K members", note: "Startup growth and experimentation audience." },
          { title: "r/nocode", url: "https://www.reddit.com/r/nocode", meta: "~42K members", note: "No-code builders and automation audience." },
          { title: "r/growmybusiness", url: "https://www.reddit.com/r/growmybusiness", meta: "~52K members", note: "Business growth and scaling discussions." },
        ],
      },

      { type: "h2", body: "Directories & discovery", id: "directories" },
      {
        type: "linklist",
        items: [
          { title: "Betalist", url: "https://betalist.com", meta: "~50–100K/mo", note: "Early-stage startup launch platform." },
          { title: "AlternativeTo", url: "https://alternativeto.net", meta: "~2.1M/mo", note: "Strong SEO-based alternative discovery." },
          { title: "FutureTools.io", url: "https://www.futuretools.io", meta: "~200K/mo", note: "AI tools discovery and showcase platform." },
          { title: "SourceForge", url: "https://sourceforge.net", meta: "~15M+/mo", note: "Strong open-source and developer visibility." },
          { title: "StackShare", url: "https://stackshare.io", meta: "~50K/mo", note: "Tech stack discovery and developer audience." },
          { title: "SideProjectors", url: "https://www.sideprojectors.com", meta: "~2–5K/mo", note: "Marketplace for side projects and indie products." },
          { title: "Dev Hunt", url: "https://devhunt.org", meta: "~1K/mo", note: "Developer-focused product launch platform." },
          { title: "Alternative.me", url: "https://alternative.me", meta: "~144K/mo", note: "Alternative product discovery platform." },
          { title: "Startup Ranking", url: "https://www.startupranking.com", meta: "~11.6K/mo", note: "Startup visibility and ranking platform." },
          { title: "Pitch Wall", url: "https://pitchwall.co", meta: "~7.2K/mo", note: "Startup showcase and visibility platform." },
          { title: "Killer Startups", url: "https://www.killerstartups.com", meta: "~3K/mo", note: "Startup showcase and product discovery." },
          { title: "F6S", url: "https://www.f6s.com", meta: "~1.7M/mo", note: "Startup ecosystem for founders, grants, and exposure." },
        ],
      },

      { type: "h2", body: "B2B review sites", id: "reviews" },
      {
        type: "linklist",
        items: [
          { title: "G2", url: "https://www.g2.com", meta: "~2.4–3.7M/mo", note: "Trusted B2B software review platform." },
          { title: "Capterra", url: "https://www.capterra.com", meta: "~2–3M/mo", note: "Popular software discovery and comparison." },
          { title: "Software Advice", url: "https://www.softwareadvice.com", meta: "~500–700K/mo", note: "Software recommendation and discovery." },
          { title: "TrustRadius", url: "https://www.trustradius.com", meta: "~500K/mo", note: "Trusted B2B software review platform." },
          { title: "Crozdesk", url: "https://crozdesk.com", meta: "~25K/mo", note: "B2B SaaS comparison and discovery platform." },
          { title: "Software Suggest", url: "https://www.softwaresuggest.com", meta: "~212K/mo", note: "Software discovery platform with India relevance." },
          { title: "Software World", url: "https://www.softwareworld.co", meta: "~6.7K/mo", note: "Software listing and comparison platform." },
          { title: "SaaSGenius", url: "https://www.saasgenius.com", meta: "~27.1K/mo", note: "SaaS software comparison and discovery." },
          { title: "AI Tools Directory", meta: "~15.9K/mo", note: "AI product discovery and listing platform — search the name to find the current canonical site." },
        ],
      },

      { type: "h2", body: "Builder & maker communities", id: "builders" },
      {
        type: "linklist",
        items: [
          { title: "Peerlist", url: "https://peerlist.io", meta: "~50K/mo", note: "Growing builder and developer professional network." },
          { title: "About.me", url: "https://about.me", meta: "~652K/mo", note: "Personal branding and founder profile platform." },
        ],
      },

      { type: "h2", body: "Niche groups (FB / Discord)", id: "groups" },
      {
        type: "p",
        body: "These are closed groups without stable public URLs — search the name inside Facebook or Discord. Included because they're worth the join even though there's no clean link to give you.",
      },
      {
        type: "linklist",
        items: [
          { title: "Startup Community (FB)", meta: "~75K members", note: "Founder networking and startup discussions." },
          { title: "Furlough (Discord)", meta: "~31K members", note: "Tech networking and founder community." },
          { title: "SaaS Growth Hacking (FB)", meta: "~31K members", note: "SaaS marketing and growth-focused community." },
          { title: "Build in Public (FB)", meta: "~55K members", note: "Builder transparency and growth community." },
          { title: "SaaS Warrior (FB)", meta: "~6.7K members", note: "Niche SaaS founder networking group." },
          { title: "Tech Startup (Discord)", meta: "~12K members", note: "Startup builders and networking community." },
          { title: "Alpha and Beta Users", meta: "~17K members", note: "Early adopter and product feedback audience." },
          { title: "Roast My Startup", meta: "~11K members", note: "Startup feedback and validation community." },
        ],
      },
      {
        type: "callout",
        tone: "tip",
        body: "Don't post the same blurb on every platform. Each one has a tone — HN wants substance, Product Hunt wants visuals, Reddit wants context and humility. Rewrite the lede each time.",
      },
    ],
  },
};
