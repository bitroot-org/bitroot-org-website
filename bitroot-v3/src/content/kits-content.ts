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
    github: "https://github.com/rutvapai14/Gmail-Cleaner-",
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
};