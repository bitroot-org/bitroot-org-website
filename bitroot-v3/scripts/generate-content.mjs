/**
 * Build-time content generation for bitroot.org.
 *
 * Guides, kits and product launches are managed in the TeamLife dashboard
 * (/tools/content) and stored in TeamLife's Neon DB. This script runs as a
 * `prebuild` step: it reads the published rows through a read-only role and
 * writes them into src/content/generated/{catalog,products}.json, which the
 * content layer imports.
 *
 * Fallback-safe: if CONTENT_DATABASE_URL is not set (local dev, or a build
 * without DB access) it does nothing and the committed JSON / TS fallbacks
 * stand — the build never fails on a missing DB.
 */
import { neon } from "@neondatabase/serverless";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "content",
  "generated",
);

const url = process.env.CONTENT_DATABASE_URL;
if (!url) {
  console.log("[generate-content] CONTENT_DATABASE_URL not set — keeping committed content.");
  process.exit(0);
}

const sql = neon(url);

function itemFrom(row) {
  const item = {
    slug: row.slug,
    category: row.category,
    title: row.title,
    summary: row.summary,
    tags: row.tags ?? [],
    updatedAt: row.content_date,
    href: `/${row.category}s/${row.slug}`,
  };
  if (row.cost) item.cost = row.cost;
  if (row.difficulty) item.difficulty = row.difficulty;
  return item;
}

async function main() {
  // Cast date columns to text so they serialize as 'YYYY-MM-DD', not full timestamps.
  const catalogRows = await sql`
    select slug, category, title, summary, body, tags, difficulty, cost,
           content_date::text as content_date, sort_order
    from site_catalog
    where published = true
    order by sort_order asc, title asc`;

  const guides = catalogRows.filter((r) => r.category === "guide").map(itemFrom);
  const kits = catalogRows.filter((r) => r.category === "kit").map(itemFrom);

  // Long-form markdown bodies, keyed "category:slug" — only rows that have one.
  // Kept out of the catalog cards so listing pages stay lean.
  const bodies = {};
  for (const r of catalogRows) {
    if (r.body && r.body.trim()) bodies[`${r.category}:${r.slug}`] = r.body;
  }

  const productRows = await sql`
    select id, slug, name, tagline, description, category, status,
           icon_from, icon_to, icon_glyph, free, community, url, waitlist_href,
           launched_at::text as launched_at, featured_launch, sort_order
    from site_products
    where published = true
    order by sort_order asc, name asc`;

  const releaseRows = await sql`
    select product_id, version, date::text as date, note, highlights, sort_order
    from site_releases
    order by date desc, sort_order asc`;

  const byProduct = new Map();
  for (const r of releaseRows) {
    const list = byProduct.get(r.product_id) ?? [];
    const rel = { version: r.version, date: r.date, note: r.note };
    if (r.highlights && r.highlights.length) rel.highlights = r.highlights;
    list.push(rel);
    byProduct.set(r.product_id, list);
  }

  const products = productRows.map((p) => {
    const prod = {
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      category: p.category,
      status: p.status,
      icon: { from: p.icon_from, to: p.icon_to, glyph: p.icon_glyph },
      free: p.free,
      community: p.community,
    };
    if (p.url) prod.url = p.url;
    if (p.waitlist_href) prod.waitlistHref = p.waitlist_href;
    if (p.launched_at) prod.launchedAt = p.launched_at;
    if (p.featured_launch) prod.featuredLaunch = true;
    const rels = byProduct.get(p.id);
    if (rels && rels.length) prod.releases = rels;
    return prod;
  });

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "catalog.json"), JSON.stringify({ guides, kits }, null, 2) + "\n");
  writeFileSync(join(OUT_DIR, "products.json"), JSON.stringify(products, null, 2) + "\n");
  writeFileSync(join(OUT_DIR, "bodies.json"), JSON.stringify(bodies, null, 2) + "\n");
  console.log(
    `[generate-content] wrote ${guides.length} guides, ${kits.length} kits, ` +
      `${products.length} products, ${Object.keys(bodies).length} markdown bodies.`,
  );
}

main().catch((err) => {
  // Do not fail the build on a transient DB hiccup — fall back to committed JSON.
  console.error("[generate-content] failed, keeping committed content:", err.message);
  process.exit(0);
});
