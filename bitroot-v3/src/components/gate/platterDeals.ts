/**
 * Deal copy restored from the archived home/DealsPlatter.tsx list. No deal
 * has an individual claim URL in this repo — platter.bitroot.org is the
 * single source of truth for live offers, so every card links there.
 */
export type PlatterDeal = {
  brand: string;
  brandAccent: string;
  badge: string;
  title: string;
  save: string;
};

export const platterDeals: PlatterDeal[] = [
  { brand: "linear", brandAccent: ".", badge: "Up to $9k", title: "Linear", save: "save $720" },
  { brand: "vercel", brandAccent: "▲", badge: "3 months", title: "Vercel Pro", save: "save $60" },
  { brand: "resend", brandAccent: "@", badge: "12 months", title: "Resend", save: "save $240" },
  { brand: "posthog", brandAccent: "●", badge: "$50k credits", title: "PostHog", save: "save $50k" },
];

export const platterUrl = "https://platter.bitroot.org";
