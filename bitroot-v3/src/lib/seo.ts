import type { Metadata } from "next";

export const siteUrl = "https://bitroot.org";
export const siteName = "Bitroot";

/**
 * Per-page metadata with its own canonical + Open Graph block.
 * `path` is the route path with trailing slash, e.g. "/kits/waitlist-kit/".
 * Relative URLs resolve against `metadataBase` set in the root layout.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: { url: string; alt: string };
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · ${siteName}`,
      description,
      url: path,
      siteName,
      type: "website",
      locale: "en",
      ...(image && {
        images: [{ url: image.url, width: 1200, height: 630, alt: image.alt }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      site: "@BitrootIndia",
      ...(image && { images: [{ url: image.url, alt: image.alt }] }),
    },
  };
}

/** BreadcrumbList JSON-LD mirroring a visual breadcrumb trail. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

/**
 * CollectionPage JSON-LD for a listing route, with the list of entries
 * embedded as its `mainEntity` ItemList. One node covers both types and
 * keeps them linked (vs. two loose top-level scripts).
 */
export function collectionPageJsonLd({
  name,
  description,
  path,
  items,
}: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
}) {
  const url = `${siteUrl}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    isPartOf: { "@type": "WebSite", name: siteName, url: `${siteUrl}/` },
    mainEntity: {
      "@type": "ItemList",
      name,
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: `${siteUrl}${item.path}`,
      })),
    },
  };
}

/** FAQPage JSON-LD for rich-result eligibility and LLM citability. */
export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

/** SoftwareApplication JSON-LD for a product detail page. */
export function softwareApplicationJsonLd(app: {
  name: string;
  description: string;
  path: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.description,
    url: `${siteUrl}${app.path}`,
    applicationCategory: app.category,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
