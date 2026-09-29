import { readFile } from "node:fs/promises";
import path from "node:path";
import Container from "@/components/ui/Container";
import FeedCardImage from "./FeedCardImage";
import RailArrows from "./RailArrows";

// Mirrors the /blog resource-hub layout: category chips, Featured (one large
// + two stacked), then a horizontal "Latest" rail.
//
// The site is a static export, so this runs at BUILD time only. Read the
// freshly-committed blog/posts/index.json from the repo working tree (one
// level above the Next project) rather than the live URL — at build time the
// deployed index is still the previous one. It carries the curated
// `categories` that build_index.py assigns, so chips here match /blog.
const LOCAL_INDEX_PATH = path.join(process.cwd(), "..", "blog", "posts", "index.json");
const INDEX_URL = "https://bitroot.org/blog/posts/index.json";
const BLOG_URL = "https://bitroot.org/blog";

// Same keys + labels as CATEGORIES in blog/scripts/build_index.py.
const CATEGORIES: Record<string, string> = {
  models: "AI Models",
  agents: "Agents & Dev Tools",
  founders: "Founders & Business",
  opensource: "Open Source",
  design: "Design & Media",
  engineering: "Engineering",
};

type IndexPost = {
  slug: string;
  url?: string;
  title: string;
  date: string;
  published_at?: string;
  tags?: string[];
  excerpt?: string;
  image?: string;
  readTime?: string;
  categories?: string[];
};

type Post = {
  title: string;
  link: string;
  excerpt: string;
  date: string;
  label: string;
  readTime: string;
  image: string | null;
};

function absImage(image?: string): string | null {
  if (!image) return null;
  if (/^https?:\/\//.test(image)) return image;
  if (image.startsWith("/")) return `https://bitroot.org${image}`;
  return `${BLOG_URL}/${image}`;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  // "28 Sep 2026" — same as the /blog cards (en-GB would print "Sept").
  return `${d.getUTCDate()} ${d.toLocaleString("en-US", { month: "short", timeZone: "UTC" })} ${d.getUTCFullYear()}`;
}

async function readIndex(): Promise<{ metadata?: IndexPost[] } | null> {
  try {
    return JSON.parse(await readFile(LOCAL_INDEX_PATH, "utf8"));
  } catch {
    try {
      const res = await fetch(INDEX_URL, { next: { revalidate: 3600 } });
      return res.ok ? await res.json() : null;
    } catch {
      return null;
    }
  }
}

async function getPosts(limit: number): Promise<Post[]> {
  const idx = await readIndex();
  const list = (idx?.metadata ?? []).slice().sort((a, b) => {
    const d = String(b.date).localeCompare(String(a.date));
    return d !== 0 ? d : String(b.slug).localeCompare(String(a.slug));
  });
  return list.slice(0, limit).map((p) => {
    const cat = p.categories?.[0];
    return {
      title: p.title,
      link: `${BLOG_URL}/${p.slug}/`,
      excerpt: p.excerpt ?? "",
      date: fmtDate(p.published_at || p.date),
      label: (cat && CATEGORIES[cat]) || p.tags?.[0] || "News",
      readTime: p.readTime ?? "5 min",
      image: absImage(p.image),
    };
  });
}

function Arrow({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function Card({
  post,
  size = "md",
}: {
  post: Post;
  size?: "lg" | "sm" | "md";
}) {
  const lg = size === "lg";
  return (
    <a href={post.link} className="group flex min-w-0 flex-col gap-3.5 no-underline text-inherit">
      <div
        className={`relative overflow-hidden bg-paper-2 ${
          lg ? "aspect-[16/9.6] rounded-[22px]" : "aspect-video rounded-[18px]"
        }`}
      >
        <FeedCardImage
          src={post.image}
          className="h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
        />
      </div>
      <div className="flex items-start justify-between gap-4">
        <h3
          className={`m-0 text-ink line-clamp-2 transition-colors group-hover:text-ember ${
            lg
              ? "font-display text-[clamp(22px,2.3vw,30px)] font-bold leading-[1.15] tracking-[-0.025em]"
              : "text-[17px] font-semibold leading-[1.38] tracking-[-0.012em]"
          }`}
        >
          {post.title}
        </h3>
        <span className="shrink-0 text-ink transition-all group-hover:text-ember group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <Arrow className={lg ? "w-7 h-7" : "w-5 h-5 mt-0.5"} />
        </span>
      </div>
      {lg && post.excerpt && (
        <p className="m-0 -mt-1 max-w-[62ch] text-[15px] leading-[1.6] text-ink-3 line-clamp-2">
          {post.excerpt}
        </p>
      )}
      <div className="-mt-1 flex items-center gap-2.5 overflow-hidden whitespace-nowrap font-mono text-[12px] text-ink-4">
        <span className="truncate rounded-full bg-ember-bg px-2.5 py-1 font-sans text-[12px] font-semibold text-ember">
          {post.label}
        </span>
        <span>
          {post.date} · {post.readTime} read
        </span>
      </div>
    </a>
  );
}

export default async function NewsloggerSection() {
  const posts = await getPosts(9);
  if (posts.length === 0) return null;

  const [lead, ...others] = posts;
  const side = others.slice(0, 2);
  const latest = others.slice(2);

  return (
    <section id="newslogger" className="relative py-18">
      <Container>
        {/* Header */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="eyebrow-mono">newslogger</span>
            <h2 className="mt-3 text-[clamp(44px,6.5vw,84px)] font-bold tracking-[-0.045em] leading-[0.92]">
              News<span className="serif-em">logger.</span>
            </h2>
            <p className="text-[16px] text-ink-3 mt-4 max-w-[560px] leading-[1.55]">
              Daily AI and tech news for founders and builders. What shipped,
              what it costs, and whether it matters to you.
            </p>
          </div>
          <a
            href={`${BLOG_URL}/`}
            className="group hidden md:inline-flex shrink-0 items-center gap-1 border-b-[1.5px] border-current pb-0.5 text-[15px] font-medium text-ink no-underline hover:text-ember transition-colors"
          >
            View all
            <Arrow className="w-4 h-4" />
          </a>
        </div>

        {/* Category chips → filtered /blog views */}
        <nav
          aria-label="Newslogger categories"
          className="mt-8 -mx-5 flex gap-1.5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <a
            href={`${BLOG_URL}/`}
            className="shrink-0 rounded-[10px] bg-ink px-3.5 py-2.5 text-[14px] font-medium leading-none text-paper no-underline"
          >
            All
          </a>
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <a
              key={key}
              href={`${BLOG_URL}/?c=${key}`}
              className="shrink-0 whitespace-nowrap rounded-[10px] px-3.5 py-2.5 text-[14px] font-medium leading-none text-ink no-underline transition-colors hover:bg-ink/[0.07]"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Featured: one large + two stacked */}
        <div className="mt-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2.05fr)_minmax(0,1fr)]">
          <Card post={lead} size="lg" />
          {side.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-[30px]">
              {side.map((p) => (
                <Card key={p.link} post={p} size="sm" />
              ))}
            </div>
          )}
        </div>
      </Container>

      {/* Latest: full-bleed horizontal rail aligned to the container */}
      {latest.length > 0 && (
        <div className="mt-16">
          <Container>
            <div className="mb-6 flex items-end justify-between gap-4">
              <h3 className="m-0 font-display text-[clamp(28px,3.2vw,40px)] font-bold leading-[1.05] tracking-[-0.03em] text-ink">
                Latest
              </h3>
              <div className="flex items-center gap-2">
                <RailArrows railId="newslogger-latest" label="latest posts" />
                <a
                  href={`${BLOG_URL}/`}
                  className="ml-2 inline-flex items-center gap-1 border-b-[1.5px] border-current pb-0.5 text-[15px] font-medium text-ink no-underline hover:text-ember transition-colors"
                >
                  View all
                  <Arrow className="w-4 h-4" />
                </a>
              </div>
            </div>
          </Container>
          <div id="newslogger-latest" className="newslogger-rail">
            {latest.map((p) => (
              <Card key={p.link} post={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
