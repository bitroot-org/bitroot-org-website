import { readFile } from "node:fs/promises";
import path from "node:path";
import Container from "@/components/ui/Container";
import FeedCardImage from "./FeedCardImage";
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

function MetaRow({ post, light = false }: { post: Post; light?: boolean }) {
  const cat = post.categories[0] ?? "notes";
  return (
    <div
      className={`flex items-center gap-2.5 font-mono text-[11px] tracking-[0.04em] ${
        light ? "text-paper/60" : "text-ink-4"
      }`}
    >
      <span className={`uppercase ${light ? "text-paper" : "text-ember"}`}>{cat}</span>
      <span aria-hidden>·</span>
      <span>{fmtDate(post.pubDate)}</span>
    </div>
  );
}

export default async function NewsloggerSection() {
  const posts = await getPosts(6);
  if (posts.length === 0) return null;

  const [featured, reader, side, media, ...rest] = posts;
  const topics = Array.from(
    new Set(posts.flatMap((p) => p.categories)),
  ).slice(0, 8);

  return (
    <section id="newslogger" className="relative py-18 overflow-hidden">
      <SquareGrid className="hidden md:block absolute inset-0 opacity-80 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <Container className="relative">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <span className="eyebrow-mono">newslogger</span>
            <h2 className="mt-3 text-[clamp(44px,6.5vw,84px)] font-bold tracking-[-0.045em] leading-[0.92]">
              News<span className="serif-em">logger.</span>
            </h2>
            <p className="text-[15px] text-ink-3 mt-4 max-w-[560px]">
              Tools, models, and shipped things from the founder feed —
              short notes, real sources, no hot takes.
            </p>
          </div>
          <a
            href="https://bitroot.org/blog"
            target="_blank"
            rel="noreferrer"
            className="group hidden md:inline-flex shrink-0 items-center gap-2 font-mono text-[12px] text-ink-2 bg-paper-2 border border-line rounded-full px-5 py-3 hover:border-ink-3 transition-colors"
          >
            view full feed
            <span className="group-hover:translate-x-1 transition-transform" aria-hidden>
              →
            </span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Featured — full-bleed image, title on a cut-out plate */}
          <a
            href={featured.link}
            target="_blank"
            rel="noreferrer"
            className="group relative lg:col-span-5 lg:row-span-2 min-h-[380px] lg:min-h-[560px] rounded-[22px] overflow-hidden border border-line bg-paper-2 no-underline text-inherit"
          >
            <FeedCardImage
              src={featured.image}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="notch-plate max-w-[88%] pt-5 pr-7 pb-1">
              <MetaRow post={featured} />
              <h3 className="mt-2.5 text-[clamp(22px,2.2vw,30px)] font-semibold leading-[1.12] tracking-[-0.025em] text-ink group-hover:text-ember transition-colors line-clamp-3">
                {featured.title}
              </h3>
            </div>
          </a>

          {/* Reading card — tinted, headline-led, with two follow-up rows */}
          {reader && (
            <div className="lg:col-span-4 flex flex-col rounded-[22px] border border-ember-line bg-ember-bg p-6">
              <a
                href={reader.link}
                target="_blank"
                rel="noreferrer"
                className="group no-underline text-inherit"
              >
                <div className="flex items-start justify-between gap-4">
                  <MetaRow post={reader} />
                  <span
                    className="grid place-items-center w-9 h-9 shrink-0 rounded-full bg-paper text-ember transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  >
                    ↗
                  </span>
                </div>
                <h3 className="mt-1 text-[clamp(21px,1.9vw,27px)] font-semibold leading-[1.15] tracking-[-0.025em] text-ink group-hover:text-ember transition-colors line-clamp-3">
                  {reader.title}
                </h3>
                <p className="mt-3 text-[13.5px] text-ink-2 leading-[1.55] line-clamp-3 m-0">
                  {reader.description}
                </p>
              </a>
              {rest.length > 0 && (
                <div className="mt-auto pt-5">
                  {rest.map((p) => (
                    <a
                      key={p.link}
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between gap-4 border-t border-ember-line py-3.5 no-underline text-inherit"
                    >
                      <span className="text-[13.5px] font-semibold text-ink leading-[1.3] tracking-[-0.01em] group-hover:text-ember transition-colors line-clamp-1">
                        {p.title}
                      </span>
                      <span
                        className="shrink-0 text-ember group-hover:translate-x-1 transition-transform"
                        aria-hidden
                      >
                        →
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Side card — text over, image anchored below */}
          {side && (
            <a
              href={side.link}
              target="_blank"
              rel="noreferrer"
              className="group lg:col-span-3 flex flex-col rounded-[22px] overflow-hidden border border-line bg-paper no-underline text-inherit hover:border-line-2 transition-colors"
            >
              <div className="p-5">
                <MetaRow post={side} />
                <h3 className="mt-2.5 text-[19px] font-semibold leading-[1.2] tracking-[-0.02em] text-ink group-hover:text-ember transition-colors line-clamp-3">
                  {side.title}
                </h3>
              </div>
              <FeedCardImage
                src={side.image}
                className="w-full flex-1 min-h-[160px] object-cover mt-auto bg-paper-2"
              />
            </a>
          )}

          {/* Media card — image-led with meta under */}
          {media && (
            <a
              href={media.link}
              target="_blank"
              rel="noreferrer"
              className="group lg:col-span-4 flex flex-col rounded-[22px] overflow-hidden border border-line bg-paper no-underline text-inherit hover:border-line-2 transition-colors"
            >
              <FeedCardImage
                src={media.image}
                className="w-full h-44 object-cover bg-paper-2 border-b border-line"
              />
              <div className="p-5">
                <MetaRow post={media} />
                <h3 className="mt-2.5 text-[17px] font-semibold leading-[1.25] tracking-[-0.015em] text-ink group-hover:text-ember transition-colors line-clamp-2">
                  {media.title}
                </h3>
              </div>
            </a>
          )}

          {/* Topics — dark anchor card */}
          <div className="lg:col-span-3 flex flex-col rounded-[22px] bg-ink text-paper p-6">
            <span className="font-mono text-[11px] tracking-[0.04em] uppercase text-paper/60">
              in the feed
            </span>
            <div className="flex flex-wrap gap-2 mt-4">
              {topics.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[11px] tracking-[0.03em] border border-paper/25 rounded-full px-3 py-1.5"
                >
                  {t}
                </span>
              ))}
            </div>
            <a
              href="https://bitroot.org/blog"
              target="_blank"
              rel="noreferrer"
              className="group mt-auto pt-6 flex items-center justify-between no-underline text-inherit"
            >
              <span className="text-[15px] font-semibold tracking-[-0.01em]">
                view full feed
              </span>
              <span
                className="grid place-items-center w-9 h-9 rounded-full bg-ember text-paper transition-transform group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
