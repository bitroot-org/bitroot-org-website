// Typed content for the /froots/privacy page. Reuses the LegalBlock /
// LegalSection block model so the Froots policy renders with the same
// design system as the /legal/* pages. Strings may contain inline
// <strong>, <em>, <a>, <code> — rendered via dangerouslySetInnerHTML in
// the shared block renderer. Content is curated (not user input).

import type { LegalBlock, LegalSection } from "@/content/legal-content";

export type FrootsDoc = {
  title: string;
  shortTitle: string;
  kicker: string;
  tagline: string; // hero plain-English intro
  updated: string; // ISO date — "last updated"
  intro: LegalBlock[];
  sections: LegalSection[];
  contactEmail: string;
};

export const frootsPrivacy: FrootsDoc = {
  title: "Froots — Privacy Policy",
  shortTitle: "Froots Privacy",
  kicker: "~/ froots / privacy",
  tagline:
    "Froots keeps everything on your device and sends none of your data to us or anyone else. No account, no sign-in, no server, no analytics.",
  updated: "2026-06-18",
  intro: [
    {
      type: "p",
      body: 'Froots (&ldquo;the extension&rdquo;) is a new-tab Chrome extension published by Bitroot. This policy explains exactly what data Froots handles. The short version: <strong>Froots keeps everything on your device and sends none of your data to us or anyone else.</strong>',
    },
  ],
  sections: [
    {
      number: "01",
      id: "what-froots-stores",
      title: "What Froots stores (locally, on your device)",
      summary: "Your settings, saved stories, plan, and a cached feed — all in your browser.",
      blocks: [
        {
          type: "p",
          body: "Froots uses Chrome's local storage (<code>chrome.storage.local</code>) to remember:",
        },
        {
          type: "ul",
          items: [
            "Your <strong>settings</strong> (theme, density, reduce-motion).",
            "The <strong>stories you save</strong>.",
            "Your <strong>plan selection</strong> (Free / Pro / Club).",
            "A <strong>cached copy of the Bitroot news feed</strong>, so new tabs open instantly.",
          ],
        },
        {
          type: "p",
          body: "This data never leaves your browser. We cannot see it. There is no account, no sign-in, and no server that receives it.",
        },
      ],
    },
    {
      number: "02",
      id: "network-requests",
      title: "Network requests Froots makes",
      summary: "Two, both for public content: the Bitroot feed and article thumbnails.",
      blocks: [
        {
          type: "ol",
          items: [
            "<strong>The Bitroot feed.</strong> Froots fetches <code>https://bitroot.org/rss.xml</code> to display the latest stories. This is an ordinary outbound request for public content; no personal information about you is included.",
            "<strong>Article thumbnail images.</strong> Story thumbnails are loaded directly from the websites that host them (for example, the original publishers' image servers). As with loading any image on any web page, your browser's request reveals your IP address to that image host. Froots does not control those third-party servers and shares nothing else with them.",
          ],
        },
        {
          type: "p",
          body: "Froots does <strong>not</strong> collect, transmit, or sell your browsing history, identity, saved items, or settings. There are <strong>no analytics, no tracking pixels, and no advertising</strong> in Froots.",
        },
      ],
    },
    {
      number: "03",
      id: "permissions",
      title: "Permissions and why we ask for them",
      summary: "The narrowest set the extension needs to work.",
      blocks: [
        {
          type: "ul",
          items: [
            "<strong>storage</strong> &mdash; to save your settings, saved stories, and the cached feed on your device.",
            "<strong>alarms</strong> &mdash; to refresh the cached feed periodically in the background.",
            "<strong>Host access to <code>bitroot.org</code></strong> &mdash; to fetch the news feed.",
          ],
        },
        {
          type: "p",
          body: "These are the narrowest permissions needed for the extension to work.",
        },
      ],
    },
    {
      number: "04",
      id: "chrome-web-store-policy",
      title: "Chrome Web Store User Data Policy",
      blocks: [
        {
          type: "p",
          body: 'Our handling of any user data complies with the <a href="https://developer.chrome.com/docs/webstore/program-policies/user-data-faq">Chrome Web Store User Data Policy</a>, including the Limited Use requirements.',
        },
      ],
    },
    {
      number: "05",
      id: "changes",
      title: "Changes",
      blocks: [
        {
          type: "p",
          body: 'If this policy changes, we will update this page and the &ldquo;last updated&rdquo; date above.',
        },
      ],
    },
  ],
  contactEmail: "support@bitroot.org",
};

// Rough words-per-minute reading estimate.
export function estimateFrootsReadMinutes(doc: FrootsDoc): number {
  const flattenBlock = (b: LegalBlock): string => {
    switch (b.type) {
      case "p":
      case "h3":
      case "callout":
        return b.body;
      case "ul":
      case "ol":
        return b.items.join(" ");
      case "kv":
        return b.rows.map((r) => `${r.key} ${r.value}`).join(" ");
    }
  };
  const text = [
    ...doc.intro.map(flattenBlock),
    ...doc.sections.flatMap((s) => [
      s.title,
      s.summary ?? "",
      ...s.blocks.map(flattenBlock),
    ]),
  ].join(" ");
  const words = text.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
