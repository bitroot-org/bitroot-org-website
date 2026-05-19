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
};
