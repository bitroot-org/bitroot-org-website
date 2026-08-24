/**
 * Minimal RSS 2.0 reader. No deps — we only need title/link/date/summary.
 * On any failure returns an empty list so callers can render nothing gracefully.
 */

export type NewsItem = {
  title: string;
  link: string;
  date: string; // ISO
  summary: string;
  image: string | null;
  categories: string[];
};

const FEED_URL = "https://bitroot.org/rss.xml";

function textBetween(block: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = block.match(re);
  if (!m) return null;
  return decode(stripCdata(m[1]).trim());
}

function stripCdata(s: string): string {
  return s.replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, "$1");
}

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function extractImage(block: string, description: string | null): string | null {
  const enclosure = block.match(
    /<enclosure[^>]*\burl="([^"]+)"[^>]*\btype="image\/[^"]+"/i,
  );
  if (enclosure) return enclosure[1];

  const media = block.match(
    /<media:(?:content|thumbnail)[^>]*\burl="([^"]+)"/i,
  );
  if (media) return media[1];

  if (description) {
    const img = description.match(/<img[^>]*\bsrc="([^"]+)"/i);
    if (img) return img[1];
  }

  return null;
}

function extractCategories(block: string): string[] {
  const out: string[] = [];
  const re = /<category[^>]*>([\s\S]*?)<\/category>/gi;
  let m;
  while ((m = re.exec(block)) !== null) {
    const v = decode(stripCdata(m[1]).trim());
    if (v) out.push(v);
    if (out.length >= 3) break;
  }
  return out;
}

function toIso(raw: string | null): string {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return "";
  return d.toISOString();
}

export async function fetchNews(limit = 4): Promise<NewsItem[]> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 1800 },
      headers: { accept: "application/rss+xml, application/xml, text/xml" },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const itemBlocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
    const items: NewsItem[] = [];

    for (const block of itemBlocks) {
      const title = textBetween(block, "title");
      const link = textBetween(block, "link");
      const pubDate = textBetween(block, "pubDate");
      const description = textBetween(block, "description");
      if (!title || !link) continue;
      items.push({
        title,
        link,
        date: toIso(pubDate),
        summary: description ? stripTags(description).slice(0, 140) : "",
        image: extractImage(block, description),
        categories: extractCategories(block),
      });
      if (items.length >= limit) break;
    }

    return items;
  } catch {
    return [];
  }
}
