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
}: {
  title: string;
  description: string;
  path: string;
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
