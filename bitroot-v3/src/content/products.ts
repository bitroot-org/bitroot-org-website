/**
 * Products by Bitroot. The page adapts to two kinds of news:
 *   - a fresh launch (use `launchedAt` + `featuredLaunch: true`)
 *   - a new release on an existing product (push to `releases[]`)
 *
 * Taglines/descriptions below are placeholders — edit as each product
 * firms up. Slugs are stable; they're used as anchors on /products.
 */

export type ProductStatus = "live" | "waitlist" | "early-access";

export type ProductGlyph =
  | "studio"
  | "trip"
  | "ascii"
  | "prompt"
  | "tidy"
  | "ticket"
  | "career"
  | "space";

export type Release = {
  version: string;
  date: string; // ISO
  note: string;
  highlights?: string[];
};

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  status: ProductStatus;
  icon: {
    from: string;
    to: string;
    glyph: ProductGlyph;
  };
  free: string;
  community: string;
  url?: string;
  waitlistHref?: string;
  launchedAt?: string;
  featuredLaunch?: boolean;
  releases?: Release[];
};

export const products: Product[] = [
  {
    slug: "bitstudio",
    name: "BitStudio",
    tagline: "A vibe studio for your content.",
    description:
      "Pick the visual mood, choose your format and settings, and BitStudio spits out social-media-ready posts that match. Less design grind, more creative direction.",
    category: "Content studio",
    status: "early-access",
    icon: { from: "#7782ee", to: "#3a44c4", glyph: "studio" },
    free: "Unlimited drafts on one vibe, forever",
    community: "All vibes, custom presets, cohort templates",
    waitlistHref: "#waitlist",
    launchedAt: "2026-05-17",
    featuredLaunch: true,
    releases: [
      {
        version: "0.5",
        date: "2026-05-17",
        note: "First public early-access build.",
        highlights: [
          "Pick a vibe — set the mood once, every post matches",
          "Format presets for Twitter, Instagram, LinkedIn, and stories",
          "One-click export — captions and assets together",
        ],
      },
    ],
  },
  {
    slug: "tripsky",
    name: "Trips.ky",
    tagline: "Plan your next trip in five minutes.",
    description:
      "A travel planner that gets you from idea to itinerary fast. Skip the spreadsheets and the open tabs — answer a few questions and walk away with a plan.",
    category: "Travel",
    status: "waitlist",
    icon: { from: "#7ec8ff", to: "#1e6fd9", glyph: "trip" },
    free: "Three trips a month, forever",
    community: "Group trips + private founder retreats",
    waitlistHref: "#waitlist",
  },
  {
    slug: "ascii-gen",
    name: "ascii.gen",
    tagline: "Generate beautiful ASCII art.",
    description:
      "Type a prompt or drop an image, get ASCII you'd actually paste into a README. Multiple styles, copyable in one click.",
    category: "Creative",
    status: "waitlist",
    icon: { from: "#9be38f", to: "#1f8b3a", glyph: "ascii" },
    free: "Unlimited generations, forever",
    community: "Custom style packs + commercial licence",
    waitlistHref: "#waitlist",
  },
  {
    slug: "prompt-bit",
    name: "prompt.bit",
    tagline: "Your prompt library, versioned and shared.",
    description:
      "Save the prompts that actually work. Tag them, version them, share them with your team or your cohort — without losing them in chat history.",
    category: "AI workflow",
    status: "waitlist",
    icon: { from: "#c9a8ff", to: "#6e3ad6", glyph: "prompt" },
    free: "Personal prompt library, forever",
    community: "Cohort-shared prompts + team libraries",
    waitlistHref: "#waitlist",
  },
  {
    slug: "tidy-bit",
    name: "tidy.bit",
    tagline: "Sweep your codebase clean.",
    description:
      "A tidy-up agent for the parts of your repo nobody wants to touch — dead code, stale imports, duplicate utilities. Runs as a PR, you review and merge.",
    category: "Cleanup",
    status: "waitlist",
    icon: { from: "#7ee2c8", to: "#178b7a", glyph: "tidy" },
    free: "One repo, monthly sweeps",
    community: "Unlimited repos + scheduled sweeps",
    waitlistHref: "#waitlist",
  },
  {
    slug: "boleo",
    name: "Boleo",
    tagline: "Tickets without the platform tax.",
    description:
      "Run small events, paid workshops, and indie meetups without giving away a third of your revenue. Bring your own Stripe, keep your audience.",
    category: "Events",
    status: "waitlist",
    icon: { from: "#ff9a8a", to: "#d54a4a", glyph: "ticket" },
    free: "Up to 50 tickets per event, forever",
    community: "Unlimited events + email broadcasts",
    waitlistHref: "#waitlist",
  },
  {
    slug: "career-ops",
    name: "career-ops",
    tagline: "Run your career like a startup.",
    description:
      "Track opportunities, conversations, and offers as a single pipeline. Designed for builders who switch roles deliberately — not when desperate.",
    category: "Career",
    status: "waitlist",
    icon: { from: "#ffd27d", to: "#e07a1f", glyph: "career" },
    free: "Personal pipeline + reminders",
    community: "Coaching circles + warm intros",
    waitlistHref: "#waitlist",
  },
  {
    slug: "bitspace",
    name: "bitspace",
    tagline: "A quiet co-working space for builders.",
    description:
      "Drop into a room with other founders, set a two-hour goal, ship together. No webcams. No standups. Just heads-down work alongside other people doing the same.",
    category: "Co-working",
    status: "waitlist",
    icon: { from: "#a8b3d6", to: "#3d456b", glyph: "space" },
    free: "Two rooms a day, forever",
    community: "Private rooms + accountability circles",
    waitlistHref: "#waitlist",
  },
];

export function findProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export type Spotlight = { product: Product; release?: Release };

export function spotlight(): Spotlight | null {
  const featured = products.find((p) => p.featuredLaunch && p.launchedAt);
  if (featured) {
    return { product: featured, release: featured.releases?.[0] };
  }
  const ranked = products
    .filter((p) => p.launchedAt)
    .sort((a, b) => (a.launchedAt! < b.launchedAt! ? 1 : -1));
  const top = ranked[0];
  return top ? { product: top, release: top.releases?.[0] } : null;
}

export function recentReleases(
  limit = 6,
): Array<{ product: Product; release: Release }> {
  return products
    .flatMap((p) => (p.releases ?? []).map((release) => ({ product: p, release })))
    .sort((a, b) => (a.release.date < b.release.date ? 1 : -1))
    .slice(0, limit);
}

export function daysSince(
  iso: string,
  // Build-time date (inlined by next.config.ts) so static HTML and hydration
  // agree; falls back to the real clock outside the Next build.
  today = new Date(process.env.NEXT_PUBLIC_BUILD_DATE ?? Date.now())
): number {
  const then = new Date(iso).getTime();
  return Math.max(0, Math.round((today.getTime() - then) / 86400000));
}
