/**
 * Products by Bitroot. The page adapts to two kinds of news:
 *   - a fresh launch (use `launchedAt` + `featuredLaunch: true`)
 *   - a new release on an existing product (push to `releases[]`)
 *
 * Taglines/descriptions below are placeholders — edit as each product
 * firms up. Slugs are stable; they're used as anchors on /products.
 */

import generatedProducts from "./generated/products.json";

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

export type ProductFeature = { title: string; description: string };
export type ProductFaq = { q: string; a: string };

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
  /** Detail-page-only content — optional so other catalog products don't need it yet. */
  detailTagline?: string;
  features?: ProductFeature[];
  faq?: ProductFaq[];
};

const productsFallback: Product[] = [
  {
    slug: "bitstudio",
    name: "BitStudio",
    tagline: "A vibe studio for your content.",
    description:
      "AI marketing partner. Reels, photoshoots, posts, ads and planning — one app, trained on your brand.",
    category: "Content studio",
    status: "early-access",
    icon: { from: "#7782ee", to: "#3a44c4", glyph: "studio" },
    free: "Unlimited drafts on one vibe, forever",
    community: "All vibes, custom presets, cohort templates",
    waitlistHref: "#waitlist",
    launchedAt: "2026-05-17",
    featuredLaunch: true,
    detailTagline:
      "The AI image generator, AI logo generator, and AI photo generator for your brand — trained once, applied to every post, ad, and photoshoot.",
    features: [
      {
        title: "AI photo & product shoots",
        description:
          "Turn one product shot into a full AI photoshoot. BitStudio's AI photo generator and AI picture generator create studio-quality images without a camera or a studio.",
      },
      {
        title: "AI image generator for every post",
        description:
          "Generate AI images and text-to-image AI content matched to your brand's visual mood — from Reels covers to carousel posts, one image generator that understands your identity.",
      },
      {
        title: "AI logo generator & brand assets",
        description:
          "Need a fresh mark? BitStudio's AI logo generator and AI logo maker create AI-generated logo options in your brand palette — an AI logo creator built into the same app as your content.",
      },
      {
        title: "Free AI image generator to start",
        description:
          "Try it as a free AI image generator — unlimited drafts on your first vibe, forever, before you commit to a paid plan.",
      },
      {
        title: "Ads, Reels & planning in one app",
        description:
          "One of the few AI image generators built for teams who need ads, Reels, and a content calendar in one place instead of five separate tools.",
      },
      {
        title: "Trained on your brand, not a generic prompt",
        description:
          "Unlike a generic AI logo creator or image generator AI, BitStudio learns your brand's mood once, so every AI-created image and AI-generated image stays consistent — no re-prompting every time.",
      },
    ],
    faq: [
      {
        q: "Is BitStudio a free AI image generator?",
        a: "Yes — BitStudio's free plan includes unlimited drafts on one brand vibe, forever. Paid plans unlock more vibes, custom presets, and cohort templates.",
      },
      {
        q: "Can BitStudio generate AI images from an existing photo?",
        a: "Yes. Upload a product photo or reference image and BitStudio generates AI images from your image, matched to your chosen visual mood — a faster starting point than prompting from scratch in a tool like Midjourney AI.",
      },
      {
        q: "Does BitStudio include an AI logo generator?",
        a: "Yes. BitStudio's AI logo generator and logo maker create AI-generated logo concepts in your brand colors, alongside your social content, so your identity and your posts stay consistent.",
      },
      {
        q: "What's the difference between BitStudio and other AI image generators?",
        a: "Most AI image generators create one-off images from a prompt. BitStudio is trained on your brand's specific visual mood, so every image, logo, post, and ad it generates matches — not just a single AI picture.",
      },
    ],
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
    tagline: "Plan your perfect trip in minutes.",
    description:
      "AI trip planner for Indian passport holders — visa-free and visa-on-arrival countries, real day-by-day itineraries, and every cost shown in INR.",
    category: "Travel",
    status: "live",
    icon: { from: "#7ec8ff", to: "#1e6fd9", glyph: "trip" },
    free: "Three trips a month, forever",
    community: "Group trips + private founder retreats",
    url: "https://tripsky.bitroot.in/",
    detailTagline:
      "Day-by-day plans with real costs in INR — the AI itinerary planner built around visa-free and visa-on-arrival countries for Indian passport holders.",
    features: [
      {
        title: "Visa-smart destinations",
        description:
          "Filter destinations by visa-free travel for Indian passport, visa on arrival, and e-visa countries — so you never shortlist a trip that needs a visa you don't have time to get.",
      },
      {
        title: "AI itineraries, built with Gemini",
        description:
          "Answer a few questions and Trips.ky's AI trip planner generates a detailed day-by-day itinerary — flights, hotels, and restaurants, without the open tabs.",
      },
      {
        title: "Every cost shown in INR",
        description:
          "Every flight, hotel, meal, and activity is priced in Indian Rupees from the start — no mental currency conversion, no surprises.",
      },
      {
        title: "Smart date planning",
        description:
          "Flexible date selection with ideal-timing recommendations, so you know the best window to travel before you book anything.",
      },
      {
        title: "Safety advisories",
        description:
          "Real-time travel alerts with India-specific guidance for every destination you're considering.",
      },
      {
        title: "Weather intelligence & packing",
        description:
          "Temperature, rainfall, and packing recommendations built into every itinerary, tuned to your travel dates.",
      },
      {
        title: "Veg-friendly restaurant filtering",
        description:
          "Filter restaurant picks by Pure Veg, Veg Priority, or Non-Veg — dietary preferences built into the plan, not an afterthought.",
      },
      {
        title: "Multi-country & overseas trip planning",
        description:
          "Works as a multi-country trip planner and international trip planner alike — plan a single-country getaway or a multi-stop overseas trip in the same flow.",
      },
    ],
    faq: [
      {
        q: "Which countries can Indian passport holders visit without a visa?",
        a: "Indian passport holders have visa-free or visa-on-arrival access to around 58 countries, including several in Asia, Africa, and the Pacific. Trips.ky filters destinations by visa-free, visa-on-arrival, and e-visa status for Indian passports, so you can shortlist trips that don't need a visa you'd have to apply for in advance.",
      },
      {
        q: "Is there a free AI trip planner for Indian travelers?",
        a: "Yes — Trips.ky is free to start, no card needed. You get a full account for the complete AI-generated plan, with three trips a month on the free tier.",
      },
      {
        q: "Does Trips.ky show visa-on-arrival countries for Indian passport holders?",
        a: "Yes. Trips.ky's destination filters are built specifically around visa-on-arrival and visa-free countries for Indian passports, so you can plan around where you can actually go without a pre-approved visa.",
      },
      {
        q: "Can Trips.ky plan a multi-country international trip?",
        a: "Yes — Trips.ky works as a multi-country trip planner and international trip planner, generating a single day-by-day itinerary across multiple destinations, with flights, hotels, and restaurants priced in INR throughout.",
      },
    ],
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

/**
 * Products/launches are managed in TeamLife (/tools/content) and written into
 * `generated/products.json` at build time. Populated → source of truth; empty
 * (local dev / no DB) → fall back to the committed list above.
 */
export const products: Product[] = generatedProducts.length
  ? (generatedProducts as Product[])
  : productsFallback;

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
