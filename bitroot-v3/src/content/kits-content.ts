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
    github: "https://github.com/bitroot-org/latex-invoice-kit",
    tagline: "Generate professional PDF invoices with LaTeX templates.",
    oneLiner:
      "Create beautiful, customizable invoices using LaTeX templates. Perfect for freelancers and small businesses who want professional-looking invoices without design work.",
    stack: [
      { name: "Next.js 16", why: "API routes for PDF generation, static pages for the UI." },
      { name: "LaTeX", why: "Professional typesetting for invoices that look like they came from a Fortune 500." },
      { name: "Supabase", why: "Store invoice data, client info, and track payment status." },
    ],
    features: [
      {
        icon: "ui",
        title: "Beautiful LaTeX templates",
        description:
          "Multiple professional invoice templates. Customize colors, fonts, and layouts to match your brand.",
      },
      {
        icon: "db",
        title: "Client & invoice management",
        description:
          "Store clients, track invoices, and manage payment status. Export to PDF with one click.",
      },
      {
        icon: "email",
        title: "Email invoices directly",
        description:
          "Send invoices via email with Resend integration. Track when clients open and download.",
      },
    ],
    installCommand: `npx create-bitroot@latest my-invoices --kit latex-invoice-kit
cd my-invoices
cp .env.example .env.local
npm run dev`,
    envExample: `NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbG...
RESEND_API_KEY=re_...`,
    walkthrough: [
      {
        title: "1. Set up Supabase",
        body: "Create a Supabase project and run the seed script to set up tables for clients, invoices, and line items.",
        code: {
          lang: "bash",
          source: `npm run db:seed`,
        },
      },
      {
        title: "2. Install LaTeX dependencies",
        body: "The kit uses node-latex to compile templates. Make sure you have a LaTeX distribution installed locally or use our Docker setup.",
        code: {
          lang: "bash",
          source: `# macOS
brew install --cask mactex

# Ubuntu/Debian
sudo apt-get install texlive-full`,
        },
      },
      {
        title: "3. Configure email (optional)",
        body: "Add your Resend API key to send invoices directly. Skip this if you only want to download PDFs.",
      },
    ],
    gotchas: [
      "LaTeX compilation can be slow on first run. We cache compiled templates to speed up subsequent generations.",
      "Special characters in invoice data (like &, %, $) need to be escaped for LaTeX. The kit handles this automatically.",
      "If PDFs aren't generating, check that your LaTeX installation is in your PATH.",
    ],
    whyNot:
      "If you need accounting software with tax calculations, recurring billing, or payment processing, use QuickBooks or FreshBooks. This kit is for generating beautiful one-off invoices.",
    license: "MIT",
  },
};
