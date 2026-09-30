import { guides } from "@/content/data";
import { siteName, siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const feedTitle = `${siteName} Guides`;
const feedDescription =
  "Free step-by-step guides for founders — real code, reproducible workflows, and tactics that actually work.";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** updatedAt is an ISO date (YYYY-MM-DD); RSS wants RFC 822. */
function rfc822(date: string) {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

/**
 * RSS 2.0 feed for /guides, so feed readers and crawlers get a signal when a
 * guide is published or updated. The blog has its own feed at /rss.xml.
 */
export function GET() {
  const items = [...guides].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const lastBuildDate = items.length ? rfc822(items[0].updatedAt) : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(feedTitle)}</title>
    <link>${siteUrl}/guides/</link>
    <description>${esc(feedDescription)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/guides/feed.xml" rel="self" type="application/rss+xml" />
${items
  .map((g) => {
    const url = `${siteUrl}/guides/${g.slug}/`;
    return `    <item>
      <title>${esc(g.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(g.updatedAt)}</pubDate>
      <description>${esc(g.summary)}</description>
${g.tags.map((t) => `      <category>${esc(t)}</category>`).join("\n")}
    </item>`;
  })
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
