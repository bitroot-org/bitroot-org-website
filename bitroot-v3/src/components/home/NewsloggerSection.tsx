import { readFile } from "node:fs/promises";
import path from "node:path";
import Container from "@/components/ui/Container";
import SquareGrid from "./SquareGrid";

// The site is a static export, so this runs at BUILD time only. Read the
// freshly-committed rss.xml from the repo working tree rather than fetching
// the live URL — at build time the deployed feed is still the *previous*
// one, which left the homepage perpetually a post behind. Repo root is one
// level above the Next project (process.cwd() is bitroot-v3/ during build).
const LOCAL_FEED_PATH = path.join(process.cwd(), "..", "rss.xml");
const FEED_URL = "https://bitroot.org/rss.xml";

type Post = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  categories: string[];
  image: string | null;
};

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function pickTag(block: string, tag: string): string | null {
  const cdata = new RegExp(
    `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`,
  ).exec(block);
  if (cdata) return cdata[1].trim();
  const m = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`).exec(block);
  return m ? m[1].trim() : null;
}

function pickEnclosure(block: string): string | null {
  const m = /<enclosure[^>]*url="([^"]+)"[^>]*type="image\//.exec(block);
  return m ? m[1] : null;
}

function pickAllTags(block: string, tag: string): string[] {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "g");
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(block))) out.push(m[1].trim());
  return out;
}

function cleanDescription(raw: string): string {
  // Description typically: "<plain text>\n\n<p><strong>Source:</strong></p><ul>..."
  // Strip the "Source:" footer and any HTML.
  const decoded = decodeEntities(raw);
  const sourceIdx = decoded.search(/<p[^>]*>\s*<strong>\s*Source/i);
  const head = sourceIdx === -1 ? decoded : decoded.slice(0, sourceIdx);
  return head
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function readFeed(): Promise<string | null> {
  // Prefer the local repo copy (always the just-built feed). Fall back to the
  // live URL so `next dev` still works if run from an unexpected cwd.
  try {
    return await readFile(LOCAL_FEED_PATH, "utf8");
  } catch {
    try {
      const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
      if (!res.ok) return null;
      return await res.text();
    } catch {
      return null;
    }
  }
}

async function getPosts(limit = 6): Promise<Post[]> {
  try {
    const xml = await readFeed();
    if (!xml) return [];
    const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
    return blocks.slice(0, limit).map((b) => ({
      title: decodeEntities(pickTag(b, "title") ?? ""),
      link: pickTag(b, "link") ?? "#",
      description: cleanDescription(pickTag(b, "description") ?? ""),
      pubDate: pickTag(b, "pubDate") ?? "",
      categories: pickAllTags(b, "category").map((c) => decodeEntities(c)),
      image: pickEnclosure(b),
    }));
  } catch {
    return [];
  }
}

export default async function NewsloggerSection() {
  const posts = await getPosts(6);
  if (posts.length === 0) return null;

  return (
    <section id="newslogger" className="relative py-18 overflow-hidden">
      <SquareGrid className="hidden md:block absolute inset-0 opacity-80 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <Container className="relative">
        <div className="flex items-end justify-between gap-6 mb-9">
          <div>
            <span className="eyebrow-mono">newslogger</span>
            <h2 className="font-sans mt-2.5 text-[clamp(30px,3.4vw,42px)] font-semibold tracking-[-0.03em] leading-[1.05]">
              What we&rsquo;re{" "}
              <span className="serif-em">tracking.</span>
            </h2>
            <p className="text-[15px] text-ink-3 mt-3 max-w-[560px]">
              Tools, models, and shipped things from the founder feed —
              short notes, real sources, no hot takes.
            </p>
          </div>
          <a
            href="https://bitroot.org/blog"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 font-mono text-[12px] text-ink-3 hover:text-ember transition-colors"
          >
            view full feed →
          </a>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <a
              key={p.link}
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col bg-paper border border-line rounded-[16px] overflow-hidden no-underline text-inherit hover:border-line-2 hover:-translate-y-0.5 transition-all"
            >
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image}
                  alt=""
                  loading="lazy"
                  className="w-full aspect-[16/9] object-cover bg-paper-2 border-b border-line"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/placeholder-blog.png"
                  alt=""
                  loading="lazy"
                  className="w-full aspect-[16/9] object-cover bg-paper-2 border-b border-line"
                />
              )}
              <div className="p-5 flex flex-col gap-2.5 flex-1">
                {p.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.categories.slice(0, 2).map((c) => (
                      <span
                        key={c}
                        className="font-mono text-[10px] tracking-[0.04em] text-ember uppercase"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
                <h3 className="font-sans text-[17px] font-semibold text-ink leading-[1.25] tracking-[-0.015em] group-hover:text-ember transition-colors line-clamp-2">
                  {p.title}
                </h3>
                <p className="text-[13.5px] text-ink-3 leading-[1.5] line-clamp-3 m-0">
                  {p.description}
                </p>
                <div className="mt-auto pt-2 flex items-center justify-between font-mono text-[11px] text-ink-4">
                  <span>{fmtDate(p.pubDate)}</span>
                  <span className="group-hover:text-ember group-hover:translate-x-1 transition-all">
                    read →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
