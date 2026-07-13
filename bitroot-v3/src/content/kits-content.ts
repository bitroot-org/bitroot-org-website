/**
 * Rich content for kit detail pages.
 * Each key corresponds to a kit slug from data.ts.
 * Kits without an entry here fall back to a lean "coming soon" view.
 */

export type KitFeature = {
  title: string;
  description: string;
  icon?: "auth" | "billing" | "email" | "db" | "ui" | "deploy" | "ai";
};

export type KitWalkthroughStep = {
  title: string;
  body: string;
  code?: { lang: string; filename?: string; source: string };
};

export type KitContent = {
  slug: string;
  github: string;
  demo?: string;
  tagline: string;
  oneLiner: string;
  stack: { name: string; why: string }[];
  features: KitFeature[];
  installCommand: string;
  envExample: string;
  walkthrough: KitWalkthroughStep[];
  gotchas: string[];
  whyNot: string;
  license: string;
};

export const kitsContent: Record<string, KitContent> = {
  "waitlist-kit": {
    slug: "waitlist-kit",
    github: "https://github.com/bitroot-org/waitlist-kit",
    demo: "https://waitlist-demo.bitroot.org",
    tagline: "A real waitlist page. In an hour. With referrals.",
    oneLiner:
      "Email capture, double opt-in, referral tracking, and an admin dashboard that actually shows you what's happening. Built to ship in one sitting.",
    stack: [
      { name: "Next.js 16", why: "Static landing + API routes in one project." },
      { name: "Supabase", why: "Postgres + row-level security. Free tier is generous." },
      { name: "Resend", why: "Confirmation + referral emails." },
    ],
    features: [
      {
        icon: "email",
        title: "Email capture with double opt-in",
        description:
          "Collect, confirm, and track. Nobody on your list should be there by accident.",
      },
      {
        icon: "db",
        title: "Referral tracking",
        description:
          "Each subscriber gets a unique link. We count, you rank, you reward.",
      },
      {
        icon: "ui",
        title: "Admin dashboard",
        description:
          "See signups, referrals, sources, and export to CSV. Password-protected.",
      },
    ],
    installCommand: `npx create-bitroot@latest my-waitlist --kit waitlist-kit
cd my-waitlist
cp .env.example .env.local
npm run dev`,
    envExample: `NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbG...
RESEND_API_KEY=re_...
ADMIN_PASSWORD=change-me`,
    walkthrough: [
      {
        title: "1. Create a Supabase project",
        body: "Go to supabase.com, new project, copy the URL and service key. Run our seed script to create the subscribers table.",
        code: {
          lang: "bash",
          source: `npm run db:seed`,
        },
      },
      {
        title: "2. Wire up Resend",
        body: "Verify your sending domain (5 min), drop the API key into .env.local, and ship.",
      },
    ],
    gotchas: [
      "Supabase RLS is ON by default — if the admin dashboard shows zero rows, check you're using the service key, not the anon key.",
      "Referral codes need to be URL-safe. We use nanoid, not uuid.",
    ],
    whyNot:
      "If you need scheduling, A/B testing, or a full landing page builder, this is too lean. This kit is one job: collect emails well.",
    license: "MIT",
  },
  "latex-invoice-kit": {
    slug: "latex-invoice-kit",
    github: "https://github.com/yashthakur1/Invoice-Boilerplate",
    tagline: "Professional invoices. LaTeX precision. One command.",
    oneLiner:
      "Generate pixel-perfect invoices with LaTeX templates. Customizable, PDF-ready, and built for freelancers who care about presentation.",
    stack: [
      { name: "Next.js 16", why: "Server actions + API routes for LaTeX compilation." },
      { name: "LaTeX", why: "Unmatched typographic precision for professional documents." },
      { name: "Node.js", why: "Server-side PDF generation with child_process." },
    ],
    features: [
      {
        icon: "ui",
        title: "Professional LaTeX templates",
        description:
          "Clean, customizable invoice templates with proper typography and spacing.",
      },
      {
        icon: "deploy",
        title: "PDF generation",
        description:
          "Compile LaTeX to PDF on-demand. Download or email directly to clients.",
      },
      {
        icon: "db",
        title: "Invoice history",
        description:
          "Store invoice metadata, track payments, and re-generate past invoices.",
      },
    ],
    installCommand: `npx create-bitroot@latest my-invoices --kit latex-invoice-kit
cd my-invoices
cp .env.example .env.local
npm run dev`,
    envExample: `NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://user:pass@localhost:5432/invoices
LATEX_BIN=/usr/bin/pdflatex`,
    walkthrough: [
      {
        title: "1. Install LaTeX distribution",
        body: "Install TeX Live (Linux/macOS) or MiKTeX (Windows). Verify pdflatex is in your PATH.",
        code: {
          lang: "bash",
          source: `# macOS
brew install --cask mactex

# Ubuntu/Debian
sudo apt-get install texlive-full

# Verify
pdflatex --version`,
        },
      },
      {
        title: "2. Configure database",
        body: "Point DATABASE_URL to your Postgres instance. Run migrations to create the invoices table.",
        code: {
          lang: "bash",
          source: `npm run db:migrate`,
        },
      },
      {
        title: "3. Customize templates",
        body: "Edit templates in /latex/templates/. Variables use \\VAR{} syntax. Change logo, colors, and layout to match your brand.",
      },
    ],
    gotchas: [
      "LaTeX compilation can fail silently — check logs in /tmp/ if PDFs don't generate.",
      "Special characters ($, &, %) must be escaped in invoice line items.",
      "Large LaTeX installations (3+ GB) — use a minimal scheme if disk space is tight.",
    ],
    whyNot:
      "If you need real-time collaborative editing or WYSIWYG, LaTeX is overkill. This kit is for developers who want programmatic control over document layout.",
    license: "MIT",
  },
  "captchas-kit": {
    slug: "captchas-kit",
    github: "https://github.com/yashthakur1/cap",
    tagline: "Bot protection that works. No third-party dependencies.",
    oneLiner:
      "Generate and validate CAPTCHAs on your own server. Image generation, audio fallback, and rate limiting built in. Privacy-first, no tracking.",
    stack: [
      { name: "Next.js 16", why: "API routes for CAPTCHA generation and validation." },
      { name: "Node.js", why: "Canvas API for server-side image rendering." },
      { name: "Redis", why: "Session storage and rate limiting." },
    ],
    features: [
      {
        icon: "ui",
        title: "Image and audio CAPTCHAs",
        description:
          "Generate distorted text images and audio alternatives for accessibility.",
      },
      {
        icon: "deploy",
        title: "Self-hosted validation",
        description:
          "No external API calls. Verify challenges on your own infrastructure.",
      },
      {
        icon: "db",
        title: "Rate limiting",
        description:
          "Built-in Redis integration to prevent brute-force attacks and abuse.",
      },
    ],
    installCommand: `git clone https://github.com/yashthakur1/cap.git my-captcha
cd my-captcha
npm install`,
    envExample: `NEXT_PUBLIC_APP_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379
CAPTCHA_SECRET=your-secret-key-here
SESSION_TIMEOUT=300`,
    walkthrough: [
      {
        title: "1. Install dependencies",
        body: "Clone the repo and install packages. Ensure Node.js 18+ is installed.",
        code: {
          lang: "bash",
          source: `npm install`,
        },
      },
      {
        title: "2. Set up Redis",
        body: "Install Redis locally or use a managed service. Update REDIS_URL in .env.local.",
        code: {
          lang: "bash",
          source: `# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis`,
        },
      },
      {
        title: "3. Configure environment",
        body: "Copy .env.example to .env.local and set CAPTCHA_SECRET to a random string. This key encrypts CAPTCHA sessions.",
      },
      {
        title: "4. Run development server",
        body: "Start the Next.js dev server and visit /captcha/demo to test generation and validation.",
        code: {
          lang: "bash",
          source: `npm run dev`,
        },
      },
    ],
    gotchas: [
      "Canvas library requires native dependencies — install build tools (python, make, gcc) if npm install fails.",
      "Redis must be running before starting the dev server. Check with 'redis-cli ping'.",
      "CAPTCHA_SECRET must be the same across all server instances for distributed deployments.",
      "Audio CAPTCHAs use text-to-speech — verify ffmpeg is installed for audio generation.",
    ],
    whyNot:
      "If you need advanced bot detection (behavioral analysis, risk scoring), consider a managed service like hCaptcha or Cloudflare Turnstile. This kit focuses on simple, self-hosted challenge-response.",
    license: "MIT",
  },
  "sitewatch-kit": {
    slug: "sitewatch-kit",
    github: "https://github.com/yashthakur1/Change_Detection_14",
    tagline: "Monitor any website. Get alerted the second it changes.",
    oneLiner:
      "A self-hosted fork of changedetection.io — track page content with a visual selector, run scheduled or on-demand checks, and get notified over Discord, Slack, Telegram, email, or 100+ other channels the moment something moves.",
    stack: [
      { name: "Python (Flask)", why: "Core app, web UI, and scheduler in one process — no separate frontend to deploy." },
      { name: "Docker", why: "One `docker compose up -d` gets a running instance with persistent storage." },
      { name: "Playwright / Selenium", why: "Optional headless browser fetching for JS-heavy pages a plain HTTP GET can't see." },
      { name: "Apprise", why: "Notification fan-out to 100+ services (Discord, Slack, Telegram, email, webhooks) from one config." },
    ],
    features: [
      {
        icon: "ui",
        title: "Visual selector tool",
        description:
          "Point-and-click in the browser to pick exactly which element on a page to watch — no manual CSS/XPath needed.",
      },
      {
        icon: "ai",
        title: "AI-powered change summaries",
        description:
          "Optional LLM integration (OpenAI, Gemini, Anthropic, Ollama) summarizes what actually changed instead of a raw diff.",
      },
      {
        icon: "email",
        title: "Multi-channel notifications",
        description:
          "Discord, Slack, Telegram, email, webhooks, and 100+ more via Apprise, with Jinja2-templated messages.",
      },
      {
        icon: "deploy",
        title: "Browser automation steps",
        description:
          "Script logins, form fills, and clicks before a check runs, so gated or interactive pages can be monitored too.",
      },
    ],
    installCommand: `git clone https://github.com/yashthakur1/Change_Detection_14.git sitewatch
cd sitewatch
docker compose up -d`,
    envExample: `PORT=5000
BASE_URL=http://localhost:5000
LOGGER_LEVEL=INFO
# Optional — headless browser fetching for JS-heavy pages
PLAYWRIGHT_DRIVER_URL=ws://sockpuppetbrowser:3000
# Optional — outbound proxy
HTTP_PROXY=
HTTPS_PROXY=`,
    walkthrough: [
      {
        title: "1. Start it with Docker",
        body: "Clone the repo and bring up the bundled docker-compose.yml — it maps the UI to 127.0.0.1:5000 and persists state in a named volume.",
        code: {
          lang: "bash",
          source: `docker compose up -d`,
        },
      },
      {
        title: "2. Or run it directly with Python",
        body: "No Docker? Install the requirements and run the entry point directly, pointing -d at a local data folder.",
        code: {
          lang: "bash",
          source: `pip3 install -r requirements.txt
python3 changedetection.py -d ./data -p 5000 -C`,
        },
      },
      {
        title: "3. Add your first watch",
        body: "Open http://127.0.0.1:5000, paste a URL, and use the visual selector to pick the element to track. Set a check interval and you're monitoring.",
      },
      {
        title: "4. Wire up notifications",
        body: "Add a notification URL under Settings (Apprise syntax) for Discord/Slack/Telegram/email/webhooks, and customize the alert text with Jinja2.",
      },
    ],
    gotchas: [
      "JS-heavy pages need the Playwright/Selenium browser service enabled (commented out by default in docker-compose.yml) — plain HTTP fetching won't render them.",
      "Data persists in a Docker named volume — back it up before `docker compose down -v` or you'll lose every configured watch.",
      "AI-powered change summaries require your own LLM API key (OpenAI/Gemini/Anthropic/Ollama); the feature is disabled without one.",
      "Respect target sites' terms of service and robots.txt — this can trivially be pointed at pages you don't have permission to poll on a schedule.",
    ],
    whyNot:
      "If you need uptime/availability or response-time monitoring, this isn't it — it only detects content changes, not whether a site is up. Use a dedicated uptime monitor for that.",
    license: "Custom (community edition + separate commercial license — see LICENSE.md)",
  },
  "inboxvault-kit": {
    slug: "inboxvault-kit",
    github: "https://github.com/yashthakur1/MailVault",
    tagline: "Own your email archive. Search it forever.",
    oneLiner:
      "Self-hosted email backup and search. Connect any IMAP account, sync your entire history, and search years of mail with Meilisearch-powered full-text search. Keep your archive under your control.",
    stack: [
      { name: "SvelteKit", why: "Frontend UI, server-rendered and served on its own dev port." },
      { name: "Node.js API + Workers", why: "Separate backend service plus background workers for IMAP sync — both run alongside the frontend via npm workspaces." },
      { name: "PostgreSQL + Drizzle ORM", why: "Type-safe schema and migrations for accounts, messages, and folders." },
      { name: "Meilisearch", why: "Full-text search across subjects, bodies, and attachments." },
      { name: "Valkey/Redis", why: "Backs the background job queue that drives IMAP sync." },
    ],
    features: [
      {
        icon: "email",
        title: "IMAP sync",
        description:
          "Connect Gmail, Outlook, or any IMAP provider. Sync your entire mailbox history in the background.",
      },
      {
        icon: "db",
        title: "Full-text search",
        description:
          "Meilisearch indexes subjects, bodies, and attachment names. Find any email in milliseconds.",
      },
      {
        icon: "ui",
        title: "Clean web interface",
        description:
          "Browse folders, read threads, and search your archive from a fast, responsive SvelteKit UI.",
      },
      {
        icon: "deploy",
        title: "Self-hosted",
        description:
          "Frontend, backend API, and workers all run on your own infrastructure. No third-party access to your mail.",
      },
    ],
    installCommand: `git clone https://github.com/yashthakur1/MailVault.git
cd MailVault
npm install
cp .env.example .env`,
    envExample: `DATABASE_URL=postgresql://user:pass@localhost:5432/mailvault
MEILI_HOST=http://localhost:7700
MEILI_MASTER_KEY=your-master-key-here
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secure-random-string`,
    walkthrough: [
      {
        title: "1. Clone the repository",
        body: "Clone the monorepo and move into the project directory.",
        code: {
          lang: "bash",
          source: `git clone https://github.com/yashthakur1/MailVault.git
cd MailVault`,
        },
      },
      {
        title: "2. Install dependencies",
        body: "Install all monorepo dependencies using npm workspaces — this covers the frontend, backend API, and workers in one pass.",
        code: {
          lang: "bash",
          source: `npm install`,
        },
      },
      {
        title: "3. Configure environment variables",
        body: "Copy .env.example to .env and fill in your database, search, and queue credentials — DATABASE_URL, MEILI_HOST/MEILI_MASTER_KEY, REDIS_HOST/REDIS_PORT, and a JWT_SECRET for auth.",
        code: {
          lang: "bash",
          source: `cp .env.example .env`,
        },
      },
      {
        title: "4. Run database migrations",
        body: "Generate and apply Drizzle migrations against your PostgreSQL database.",
        code: {
          lang: "bash",
          source: `npm run db:generate
npm run db:migrate`,
        },
      },
      {
        title: "5. Start the development environment",
        body: "One command concurrently runs the SvelteKit frontend (http://localhost:3000), the backend API (http://localhost:4000), and the background workers that handle email ingestion and indexing.",
        code: {
          lang: "bash",
          source: `npm run dev:oss`,
        },
      },
      {
        title: "6. Build and deploy",
        body: "Build the production bundles, then start the app server and the background workers as separate long-running processes (e.g. under pm2 or systemd).",
        code: {
          lang: "bash",
          source: `npm run build:oss
npm run start:oss

# in a separate terminal or service
npm run start:workers`,
        },
      },
    ],
    gotchas: [
      "The dev/build/start scripts are the `:oss` variants (dev:oss, build:oss, start:oss) — the plain npm run dev/build won't start the full stack in this monorepo.",
      "Workers run as a separate process from the app server — forgetting to start npm run start:workers in production means mail stops syncing even though the UI still loads.",
      "IMAP sync can be slow for large mailboxes (100k+ messages) — the initial sync runs in the background and can take hours.",
      "Gmail requires an app-specific password if you have 2FA enabled. Regular account passwords won't work.",
      "Meilisearch needs at least 1GB RAM for indexing large archives.",
    ],
    whyNot:
      "If you need a full email client with sending, calendars, and contacts, this isn't it. InboxVault is read-only archival and search, not a replacement for your mail client.",
    license: "MIT",
  },
  "archiveflow-kit": {
    slug: "archiveflow-kit",
    github: "https://github.com/yashthakur1/OpenArchiver_6",
    tagline: "Archive every mailbox. Search all of it, forever.",
    oneLiner:
      "Self-hosted email archiving platform that sits between your mail servers and storage — ingest from Google Workspace, Microsoft 365, IMAP, or EML/Mbox uploads, then search everything instantly with retention policies and legal holds for compliance.",
    stack: [
      { name: "SvelteKit", why: "Frontend UI with Tailwind CSS and Shadcn components, server-rendered on its own dev port." },
      { name: "Node.js + Express", why: "Backend API and Drizzle ORM data layer, run as a separate service from the frontend." },
      { name: "PostgreSQL + Drizzle ORM", why: "Type-safe schema and migrations for archived messages and metadata." },
      { name: "Meilisearch", why: "Full-text search across message bodies, subjects, senders, and attachments." },
      { name: "BullMQ + Valkey/Redis", why: "Distributed task queue for parallel email ingestion and indexing." },
    ],
    features: [
      {
        icon: "email",
        title: "Universal mailbox connectivity",
        description:
          "Native ingestion from Google Workspace, Microsoft 365, standard IMAP servers, or EML/Mbox file uploads.",
      },
      {
        icon: "db",
        title: "Full-text search",
        description:
          "Meilisearch indexes bodies, subjects, senders, and attachments — find any message in milliseconds.",
      },
      {
        icon: "auth",
        title: "Compliance tooling",
        description:
          "Retention policies, legal holds, and role-based access control for teams that need to prove what they kept and why.",
      },
      {
        icon: "deploy",
        title: "Distributed ingestion",
        description:
          "BullMQ task queues parallelize large mailbox imports across worker processes instead of blocking on one at a time.",
      },
    ],
    installCommand: `git clone https://github.com/yashthakur1/OpenArchiver_6.git
cd OpenArchiver_6
npm install
cp .env.example .env`,
    envExample: `DATABASE_URL=postgresql://user:pass@localhost:5432/archiveflow
MEILI_HOST=http://localhost:7700
MEILI_MASTER_KEY=your-master-key-here
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secure-random-string`,
    walkthrough: [
      {
        title: "1. Clone the repository",
        body: "Clone the monorepo and move into the project directory.",
        code: {
          lang: "bash",
          source: `git clone https://github.com/yashthakur1/OpenArchiver_6.git
cd OpenArchiver_6`,
        },
      },
      {
        title: "2. Install dependencies",
        body: "Install all monorepo dependencies using npm workspaces — this covers the frontend, backend API, and workers in one pass.",
        code: {
          lang: "bash",
          source: `npm install`,
        },
      },
      {
        title: "3. Configure environment variables",
        body: "Copy .env.example to .env and fill in your database, search, and queue credentials — DATABASE_URL, MEILI_HOST/MEILI_MASTER_KEY, REDIS_HOST/REDIS_PORT, and a JWT_SECRET for auth.",
        code: {
          lang: "bash",
          source: `cp .env.example .env`,
        },
      },
      {
        title: "4. Run database migrations",
        body: "Generate and apply Drizzle migrations against your PostgreSQL database.",
        code: {
          lang: "bash",
          source: `npm run db:generate
npm run db:migrate`,
        },
      },
      {
        title: "5. Start the development environment",
        body: "One command concurrently runs the SvelteKit frontend (http://localhost:3000), the backend API (http://localhost:4000), and the background workers that handle mailbox ingestion and indexing.",
        code: {
          lang: "bash",
          source: `npm run dev:oss`,
        },
      },
      {
        title: "6. Build and deploy",
        body: "Build the production bundles, then start the app server and the background workers as separate long-running processes (e.g. under pm2 or systemd).",
        code: {
          lang: "bash",
          source: `npm run build:oss
npm run start:oss

# in a separate terminal or service
npm run start:workers`,
        },
      },
    ],
    gotchas: [
      "The dev/build/start scripts are the `:oss` variants (dev:oss, build:oss, start:oss) — the plain npm run dev/build won't start the full stack in this monorepo.",
      "Workers run as a separate process from the app server — forgetting to start npm run start:workers in production means ingestion silently stops even though the UI still loads.",
      "Large mailbox imports (100k+ messages) run through BullMQ in the background and can take hours on first sync.",
      "Meilisearch needs at least 1GB RAM for indexing large archives — bump it for bigger imports.",
      "Retention/legal-hold policies are enforced app-side — deleting rows directly in Postgres bypasses them, so always go through the API.",
    ],
    whyNot:
      "If you need real-time collaboration, a full email client with sending, or compliance certifications (HIPAA, SOC2) out of the box, this isn't it. ArchiveFlow is read-only archival and search, not a mail client or a certified compliance platform.",
    license: "MIT",
  },
  "pulsedash-kit": {
    slug: "pulsedash-kit",
    github: "https://github.com/yashthakur1/dash",
    tagline: "Every link, tool, and bookmark. One dashboard, self-hosted.",
    oneLiner:
      "A personal and team dashboard that replaces scattered browser bookmarks — organize resources into collections, arrange a widget grid, jump to anything with Ctrl+K, and pull in an RSS reader, all backed by your own PocketBase instance.",
    stack: [
      { name: "Next.js", why: "React frontend and API routes for the dashboard UI and Ctrl+K search." },
      { name: "PocketBase", why: "Single-binary backend — SQLite storage, auth, and a real-time API with nothing extra to deploy." },
      { name: "Tailwind CSS", why: "Utility-first styling for the widget grid, collections, and theming/wallpapers." },
      { name: "Node.js jobs service", why: "Separate background process that fetches RSS feeds and runs scheduled monitoring." },
    ],
    features: [
      {
        icon: "ui",
        title: "Customizable widget dashboard",
        description:
          "Arrange bookmarks, collections, and tools into a widget grid you rearrange to match how you actually work.",
      },
      {
        icon: "db",
        title: "Collections & resource organization",
        description:
          "Group links and tools into collections instead of drowning in browser bookmarks. Backed by PocketBase/SQLite.",
      },
      {
        icon: "auth",
        title: "Built-in authentication",
        description:
          "PocketBase-backed accounts and access control, so team dashboards stay private.",
      },
      {
        icon: "deploy",
        title: "Self-hosted, single PocketBase binary",
        description:
          "No managed backend to pay for — PocketBase runs as one executable alongside the app and jobs service.",
      },
    ],
    installCommand: `git clone https://github.com/yashthakur1/dash.git pulsedash
cd pulsedash
npm install`,
    envExample: `NEXT_PUBLIC_PB_URL=http://127.0.0.1:8090
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000`,
    walkthrough: [
      {
        title: "1. Set up PocketBase (backend)",
        body: "Download the PocketBase v0.30.4 executable for your OS into the pocketbase/ directory, then run migrations and start the server — it serves the API on http://127.0.0.1:8090.",
        code: {
          lang: "bash",
          source: `./pocketbase migrate --dir ./pb_data --migrationsDir ./pocketbase/pb_migrations
./pocketbase serve --dir ./pb_data --migrationsDir ./pocketbase/pb_migrations`,
        },
      },
      {
        title: "2. Start the jobs service",
        body: "In a separate terminal, install and run the background jobs service that handles RSS fetching and monitoring.",
        code: {
          lang: "bash",
          source: `cd jobs
npm install
npm run dev`,
        },
      },
      {
        title: "3. Configure and run the Next.js app",
        body: "Back in the repo root, install dependencies, add a .env.local pointing at your PocketBase instance, and start the dev server.",
        code: {
          lang: "bash",
          source: `npm install
npm run dev`,
        },
      },
    ],
    gotchas: [
      "All three processes — PocketBase, the jobs service, and Next.js — need to be running at once, or RSS/monitoring silently stops updating even though the dashboard still loads.",
      "Run PocketBase migrate before serve on a fresh pb_data directory, or the app fails to boot with a missing-schema error.",
      "Two-factor auth ships via speakeasy — back up your PocketBase pb_data volume before rotating secrets or enabling it for a team.",
    ],
    whyNot:
      "If you just need one shared bookmarks list, this is more than you need — the collections, widgets, and RSS layer add real setup overhead (three processes to run). This kit is for people who want one page that replaces ten browser tabs.",
    license:
      "Not specified — the source repo ships no LICENSE file. Confirm terms with the author before redistributing.",
  },
  "linkforge-kit": {
    slug: "linkforge-kit",
    github: "https://github.com/yashthakur1/LinkForge",
    tagline: "Shorten, organize, and share every link — self-hosted.",
    oneLiner:
      "A self-hosted link management platform — shorten URLs, organize them into collections, share publicly or with your team, and track click stats, all from a single React + Go app you run yourself.",
    stack: [
      { name: "React + TypeScript", why: "Frontend UI built with Vite and styled with TailwindCSS." },
      { name: "Go", why: "Single compiled backend binary — serves the API and, in production, the built frontend too." },
      { name: "SQLite / PostgreSQL", why: "SQLite for zero-config single-file storage, or Postgres for a managed multi-user deployment." },
      { name: "Docker Compose", why: "One-command deployment that wires the backend, frontend, and database together." },
    ],
    features: [
      {
        icon: "deploy",
        title: "Custom short links",
        description:
          "Shorten URLs with your own custom slugs instead of random strings.",
      },
      {
        icon: "ui",
        title: "Collections & organization",
        description:
          "Group related links into collections instead of one long flat list.",
      },
      {
        icon: "auth",
        title: "Public & team sharing",
        description:
          "Share individual links or whole collections publicly, or keep them scoped to your team.",
      },
      {
        icon: "db",
        title: "Click & usage stats",
        description:
          "See how many times each link was opened, without wiring up a separate analytics tool.",
      },
    ],
    installCommand: `git clone https://github.com/yashthakur1/LinkForge.git linkforge
cd linkforge
docker-compose up -d`,
    envExample: `LINKFORGE_MODE=prod
LINKFORGE_PORT=5231
LINKFORGE_DATA=./data
LINKFORGE_DRIVER=sqlite
LINKFORGE_DSN=./data/linkforge.db`,
    walkthrough: [
      {
        title: "1. Run it with Docker (recommended)",
        body: "Clone the repo and bring up the bundled docker-compose.yml — it builds the frontend and backend together and persists data to a local volume.",
        code: {
          lang: "bash",
          source: `docker-compose up -d`,
        },
      },
      {
        title: "2. Or run frontend and backend separately",
        body: "No Docker? Install the frontend dependencies with pnpm and start the Vite dev server in one terminal, then run the Go backend in a second.",
        code: {
          lang: "bash",
          source: `# Terminal 1 — frontend
cd frontend/web && pnpm install && pnpm dev

# Terminal 2 — backend
go run ./bin/slash/main.go --mode dev --port 8082`,
        },
      },
      {
        title: "3. Build for production",
        body: "Build the frontend, copy the static output into the backend's route directory, then compile a single Go binary that serves both.",
        code: {
          lang: "bash",
          source: `cd frontend/web && pnpm build
cp -r dist ../../server/route/frontend/
go build -o ./build/linkforge ./bin/slash/main.go
./build/linkforge --mode prod`,
        },
      },
    ],
    gotchas: [
      "The dev frontend (Vite) and backend run on different ports — hitting the wrong one locally is the most common 'nothing loads' issue.",
      "Production mode expects the frontend's built dist/ folder already copied into server/route/frontend/ — skip that step and the Go binary serves a 404 for the UI.",
      "SQLite is the default driver; switch LINKFORGE_DRIVER to postgres and set LINKFORGE_DSN to a connection string for multi-user/production use.",
    ],
    whyNot:
      "If you just need a single quick redirect link, this is overkill — collections, sharing, and stats add real setup (frontend build + Go binary + a database) for something a free URL shortener does in one click. This kit is for teams who want to own their link data.",
    license:
      "Not specified — the source repo ships no LICENSE file. Confirm terms with the author before redistributing.",
  },
};
