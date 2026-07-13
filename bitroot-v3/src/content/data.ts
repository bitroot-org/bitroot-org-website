/**
 * Central source-of-truth for all content surfaces.
 */

import { products as productCatalog } from "./products";

export type Category = "kit" | "guide" | "product" | "tool";

export type Price = { usd: string; inr: string };

export type Item = {
  slug: string;
  category: Category;
  title: string;
  summary: string;
  tags: string[];
  updatedAt: string; // ISO date
  href: string;
  cost?: Price;
  difficulty?: "starter" | "intermediate" | "advanced";
};

export const kits: Item[] = [
  {
    slug: "waitlist-kit",
    category: "kit",
    title: "Waitlist Kit",
    summary:
      "Single-page waitlist with email capture, referral counter, and a real admin dashboard. Ship a landing page in an hour.",
    tags: ["Next.js", "Resend", "Supabase"],
    updatedAt: "2026-05-19",
    href: "/kits/waitlist-kit",
    difficulty: "starter",
  },
  {
    slug: "latex-invoice-kit",
    category: "kit",
    title: "Modern LaTeX Invoice Generator Kit",
    summary:
      "Generate pixel-perfect invoices with LaTeX templates. Customizable, PDF-ready, and built for freelancers who care about presentation.",
    tags: ["Next.js", "LaTeX", "Node.js"],
    updatedAt: "2026-07-08",
    href: "/kits/latex-invoice-kit",
    difficulty: "intermediate",
  },
  {
    slug: "captchas-kit",
    category: "kit",
    title: "CAPTCHAs Kit",
    summary:
      "Generate and validate CAPTCHAs on your own server. Image generation, audio fallback, and rate limiting built in. Privacy-first, no tracking.",
    tags: ["Next.js", "Node.js", "Redis"],
    updatedAt: "2026-07-09",
    href: "/kits/captchas-kit",
    difficulty: "intermediate",
  },
  {
    slug: "sitewatch-kit",
    category: "kit",
    title: "SiteWatch – Website Change Detection Kit",
    summary:
      "Self-hosted website change detection — visual selectors, scheduled checks, and alerts over Discord, Slack, Telegram, email, and 100+ other channels via Apprise.",
    tags: ["Python", "Flask", "Docker"],
    updatedAt: "2026-07-10",
    href: "/kits/sitewatch-kit",
    difficulty: "intermediate",
  },
  {
    slug: "inboxvault-kit",
    category: "kit",
    title: "InboxVault – Email Backup & Archive Kit",
    summary:
      "Self-hosted email backup and search. IMAP sync, full-text search with Meilisearch, and a clean web UI to browse years of mail. Own your archive.",
    tags: ["SvelteKit", "PostgreSQL", "Meilisearch"],
    updatedAt: "2026-07-11",
    href: "/kits/inboxvault-kit",
    difficulty: "intermediate",
  },
  {
    slug: "pulsedash-kit",
    category: "kit",
    title: "PulseDash – Analytics Dashboard Kit",
    summary:
      "Self-hosted personal and team dashboard for organizing links, resources, bookmarks, and tools in one place — customizable widgets, instant Ctrl+K search, and a built-in RSS reader.",
    tags: ["Next.js", "PocketBase", "Tailwind CSS"],
    updatedAt: "2026-07-13",
    href: "/kits/pulsedash-kit",
    difficulty: "intermediate",
  },
];

export const guides: Item[] = [
  {
    slug: "ship-a-waitlist-in-2-hours",
    category: "guide",
    title: "Ship a waitlist in 2 hours",
    summary:
      "A zero-fluff walkthrough for shipping a waitlist with email capture, double opt-in, and a real admin view. Real code, reproducible.",
    tags: ["Next.js", "Resend", "Supabase"],
    updatedAt: "2026-04-09",
    href: "/guides/ship-a-waitlist-in-2-hours",
    difficulty: "starter",
  },
  {
    slug: "design-planning-workflow",
    category: "guide",
    title: "Set up a production-ready design workflow",
    summary:
      "A single operational guide for kicking off design — Antigravity, Figma, MCP/Copilot, AI-ready handoff, and the prompts you'll actually use.",
    tags: ["Design", "Figma", "AI", "Handoff"],
    updatedAt: "2026-05-19",
    href: "/guides/design-planning-workflow",
    difficulty: "starter",
  },
  {
    slug: "ai-assisted-fullstack-workflow",
    category: "guide",
    title: "An AI-assisted full-stack workflow that doesn't get messy",
    summary:
      "Plan, prompt, and ship with AI coding tools without ending up with hallucinated code. Stack, rules, PRD, vertical slices, and the exact prompts.",
    tags: ["AI", "Next.js", "Workflow", "Architecture"],
    updatedAt: "2026-05-19",
    href: "/guides/ai-assisted-fullstack-workflow",
    difficulty: "intermediate",
  },
  {
    slug: "free-analytics-tools",
    category: "guide",
    title: "18 free analytics tools, ranked by their real free tiers",
    summary:
      "A field-tested list of free analytics platforms — product, web, session replay, telemetry — with the exact 2026 free-tier limits.",
    tags: ["Analytics", "Tools", "Free tier"],
    updatedAt: "2026-05-19",
    href: "/guides/free-analytics-tools",
    difficulty: "starter",
  },
  {
    slug: "50-places-to-list-your-startup",
    category: "guide",
    title: "50 free places to list your startup",
    summary:
      "Launch platforms, communities, and directories — annotated with audience size and a one-line note on what each is good for.",
    tags: ["Launch", "Marketing", "Distribution"],
    updatedAt: "2026-05-19",
    href: "/guides/50-places-to-list-your-startup",
    difficulty: "starter",
  },
];

/** Items derived from the products catalog so listings/tickers can surface them. */
export const products: Item[] = productCatalog.map((p) => ({
  slug: p.slug,
  category: "product" as const,
  title: p.name,
  summary: p.tagline,
  tags: [p.category],
  updatedAt: p.releases?.[0]?.date ?? p.launchedAt ?? "2026-05-01",
  href: `/products#${p.slug}`,
}));

export const tools: Item[] = [
  {
    slug: "og-image-maker",
    category: "tool",
    title: "OG Image Maker",
    summary:
      "Generate a clean Open Graph image for any page in seconds. No signup. Download as PNG.",
    tags: ["Open Graph", "Design"],
    updatedAt: "2026-04-10",
    href: "/tools/og-image-maker",
  },
  {
    slug: "favicon-generator",
    category: "tool",
    title: "Favicon Generator",
    summary:
      "Drop an image, get every favicon size, plus the manifest and HTML snippet to paste into your <head>.",
    tags: ["Favicon", "Design"],
    updatedAt: "2026-03-28",
    href: "/tools/favicon-generator",
  },
  {
    slug: "pricing-page-generator",
    category: "tool",
    title: "Pricing Page Generator",
    summary:
      "Answer 5 questions and we'll draft a 3-tier pricing layout with copy you can paste. No account needed.",
    tags: ["Pricing", "SaaS"],
    updatedAt: "2026-03-20",
    href: "/tools/pricing-page-generator",
  },
  {
    slug: "domain-brainstormer",
    category: "tool",
    title: "Domain Brainstormer",
    summary:
      "Put in a seed word, get 50 brandable domain ideas with .com/.dev/.io availability. Free forever.",
    tags: ["Domains", "Naming"],
    updatedAt: "2026-04-04",
    href: "/tools/domain-brainstormer",
  },
  {
    slug: "readme-generator",
    category: "tool",
    title: "README Generator",
    summary:
      "A structured README builder for your open-source kit or side project. Markdown out.",
    tags: ["README", "Docs"],
    updatedAt: "2026-03-02",
    href: "/tools/readme-generator",
  },
];

export const allItems: Item[] = [...kits, ...guides, ...products, ...tools];

/** Most recently updated across all categories */
export function recentlyUpdated(limit = 8): Item[] {
  return [...allItems]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, limit);
}

export const pillars = [
  {
    key: "kits" as const,
    title: "Kits",
    subtitle: "Clone-and-ship boilerplates",
    description:
      "Production-ready repos you can clone tonight. Auth, billing, emails, dashboards — already wired.",
    href: "/kits",
    items: kits,
  },
  {
    key: "guides" as const,
    title: "Guides",
    subtitle: "Tactical, reproducible",
    description:
      "Step-by-step walkthroughs you can follow at 11pm on a Tuesday. Real code, screenshots, timestamps.",
    href: "/guides",
    items: guides,
  },
  {
    key: "products" as const,
    title: "Products",
    subtitle: "Tiny apps for builders",
    description:
      "Apps from the Bitroot team. Every one ships with a free plan and a community program — waitlist for the first cohort.",
    href: "/products",
    items: products,
  },
  {
    key: "tools" as const,
    title: "Tools",
    subtitle: "Zero-signup utilities",
    description:
      "Tiny in-browser utilities that don't ask for your email. Bookmark one, share the rest.",
    href: "/tools",
    items: tools,
  },
];

export function findItem(slug: string, category?: Category): Item | undefined {
  return allItems.find(
    (item) => item.slug === slug && (!category || item.category === category),
  );
}

/**
 * Featured on the homepage showcase. Hand-curated — order controls preference.
 */
export const featuredHome: { slug: string; category: Category; eyebrow: string }[] = [
  { slug: "waitlist-kit", category: "kit", eyebrow: "this week's kit" },
  { slug: "ship-a-waitlist-in-2-hours", category: "guide", eyebrow: "from-scratch companion" },
  { slug: "bitstudio", category: "product", eyebrow: "now launching" },
];
