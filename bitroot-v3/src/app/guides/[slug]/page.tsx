import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import CodeBlock from "@/components/ui/CodeBlock";
import ClubNudge from "@/components/ui/ClubNudge";
import CopyButton from "@/components/ui/CopyButton";
import Tag from "@/components/ui/Tag";
import { guides, findItem } from "@/content/data";
import {
  guidesContent,
  type GuideNode,
  type GuideReference,
} from "@/content/guides-content";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";

const referencedCategoryLabel = {
  kit: "kit",
  guide: "guide",
  product: "product",
  tool: "tool",
} as const;

function ReferencedList({ refs }: { refs: GuideReference[] }) {
  const resolved = refs
    .map((ref) => ({ ref, item: findItem(ref.slug, ref.category) }))
    .filter((r): r is { ref: GuideReference; item: NonNullable<typeof r.item> } => !!r.item);

  if (resolved.length === 0) return null;

  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-4 mb-3">
        tools in this guide
      </div>
      <ul className="space-y-2">
        {resolved.map(({ ref, item }) => (
          <li key={`${ref.category}-${ref.slug}`}>
            <Link
              href={item.href}
              className="repo-card block rounded-lg border border-line bg-paper px-4 py-3 group"
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.12em] text-ember">
                  {referencedCategoryLabel[ref.category]}
                </span>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-ink-4 group-hover:text-ember transition-colors"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="font-display text-[13.5px] font-semibold text-ink leading-snug group-hover:text-ember transition-colors">
                {item.title}
              </div>
              {ref.note && (
                <div className="text-[11.5px] text-ink-3 leading-snug mt-1">
                  {ref.note}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = findItem(slug, "guide");
  if (!guide) return {};
  return buildMetadata({
    title: guide.title,
    description: guide.summary,
    path: `/guides/${guide.slug}/`,
  });
}

async function renderNode(node: GuideNode, idx: number) {
  switch (node.type) {
    case "h2":
      return (
        <h2
          key={idx}
          id={node.id}
          className="scroll-mt-24 font-display text-[28px] md:text-[32px] font-bold text-ink tracking-tight mt-14 mb-4 leading-[1.15]"
        >
          <span className="text-ember font-mono text-[18px] mr-2">§</span>
          {node.body}
        </h2>
      );
    case "h3":
      return (
        <h3
          key={idx}
          className="font-display text-[20px] font-bold text-ink tracking-tight mt-8 mb-3"
        >
          {node.body}
        </h3>
      );
    case "p":
      return (
        <p
          key={idx}
          className="text-[15.5px] text-ink-2 leading-[1.75] my-4"
          dangerouslySetInnerHTML={{ __html: inlineFormat(node.body) }}
        />
      );
    case "ul":
      return (
        <ul key={idx} className="my-5 space-y-2.5 pl-2">
          {node.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 text-[15px] text-ink-2 leading-[1.7]"
            >
              <span className="text-ember mt-[0.6em] text-[6px]">●</span>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={idx} className="my-5 space-y-2.5 pl-2 counter-reset-ol">
          {node.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 text-[15px] text-ink-2 leading-[1.7]"
            >
              <span className="font-mono text-ember text-[13px] shrink-0 mt-[0.1em]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ol>
      );
    case "callout": {
      const tones = {
        note: {
          border: "border-line",
          bg: "bg-paper-2/60",
          label: "note",
          color: "text-ink-3",
        },
        warn: {
          border: "border-ember-line",
          bg: "bg-ember-bg",
          label: "watch out",
          color: "text-ember",
        },
        tip: {
          border: "border-green-200",
          bg: "bg-live-bg",
          label: "tip",
          color: "text-live",
        },
      } as const;
      const tone = tones[node.tone];
      return (
        <aside
          key={idx}
          className={`my-6 rounded-xl border ${tone.border} ${tone.bg} px-5 py-4`}
        >
          <div
            className={`text-[10px] font-mono uppercase tracking-[0.16em] mb-1 ${tone.color}`}
          >
            {tone.label}
          </div>
          <p
            className="text-[14px] text-ink-2 leading-[1.65]"
            dangerouslySetInnerHTML={{ __html: inlineFormat(node.body) }}
          />
        </aside>
      );
    }
    case "code":
      return (
        <div key={idx} className="my-6">
          <CodeBlock
            code={node.source}
            lang={node.lang}
            filename={node.filename}
          />
        </div>
      );
    case "snippet":
      return (
        <aside
          key={idx}
          className="relative my-7 rounded-xl border border-ember-line bg-ember-bg/60 px-5 pt-4 pb-5"
        >
          <div className="flex items-center justify-between mb-2 gap-4">
            <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-ember">
              ~/ snippet
            </div>
          </div>
          {node.title && (
            <div className="font-display text-[15px] font-bold text-ink leading-snug mb-2">
              {node.title}
            </div>
          )}
          <div className="relative group rounded-lg border border-ember-line/70 bg-paper/80 px-4 py-3 font-mono text-[12.5px] text-ink-2 leading-[1.65] whitespace-pre-wrap">
            {node.body}
            <CopyButton text={node.body} variant="ember" label="Copy" />
          </div>
        </aside>
      );
    case "linklist":
      return (
        <ul
          key={idx}
          className="my-6 grid gap-2 list-none p-0"
        >
          {node.items.map((item, i) => {
            const inner = (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-line bg-paper transition-colors group-hover:border-ink-3">
                <span className="font-mono text-[11px] text-ink-4 w-6 shrink-0 mt-0.5 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-display text-[14.5px] font-semibold text-ink leading-snug group-hover:text-ember transition-colors">
                      {item.title}
                    </span>
                    {item.meta && (
                      <span className="text-[10.5px] font-mono text-ink-4 tracking-wide">
                        {item.meta}
                      </span>
                    )}
                  </div>
                  {item.note && (
                    <div className="text-[12.5px] text-ink-3 leading-snug mt-0.5">
                      {item.note}
                    </div>
                  )}
                </div>
                {item.url ? (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-ink-4 group-hover:text-ember mt-1 shrink-0 transition-colors"
                    aria-hidden
                  >
                    <path
                      d="M5 11l6-6M6 5h5v5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span
                    className="text-[10px] font-mono text-ink-4 mt-1 shrink-0"
                    title="No public URL — search by name"
                  >
                    no link
                  </span>
                )}
              </div>
            );
            return (
              <li key={`${item.title}-${i}`}>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="repo-card group block rounded-xl"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="group block rounded-xl">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      );
    case "divider":
      return <div key={idx} className="dotted-line my-8" />;
  }
}

/** Very small inline-formatter: handles `code` backticks only. No deps. */
function inlineFormat(s: string) {
  const escaped = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(
    /`([^`]+)`/g,
    '<code class="font-mono text-[0.88em] bg-paper-2 border border-line px-[0.35em] py-[0.08em] rounded-[4px] text-ink-2">$1</code>',
  );
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = findItem(slug, "guide");
  if (!guide) notFound();

  const content = guidesContent[slug];

  return (
    <>
      {/* Header */}
      <section className="pt-10 pb-12 border-b border-line bg-paper-2/40">
        <Container size="narrow">
          <JsonLd
            data={breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Guides", path: "/guides/" },
              { name: guide.title, path: `/guides/${guide.slug}/` },
            ])}
          />
          <nav className="text-[12px] font-mono text-ink-4 mb-6 flex items-center gap-1.5">
            <Link href="/" className="hover:text-ember transition-colors">
              ~
            </Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-ember transition-colors">
              guides
            </Link>
            <span>/</span>
            <span className="text-ink-3 truncate">{guide.slug}</span>
          </nav>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember">
              guide
            </span>
            {guide.difficulty && (
              <>
                <span className="text-ink-4">·</span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-ink-3">
                  {guide.difficulty}
                </span>
              </>
            )}
            <span className="text-ink-4">·</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-ink-3">
              <span className="w-1.5 h-1.5 rounded-full bg-live pulse-live" />
              updated {guide.updatedAt}
            </span>
            {content && (
              <>
                <span className="text-ink-4">·</span>
                <span className="text-[11px] font-mono text-ink-3">
                  {content.timeEstimate}
                </span>
              </>
            )}
          </div>

          <h1 className="font-display text-4xl md:text-[54px] font-extrabold text-ink leading-[1.02] tracking-tight">
            {guide.title}
          </h1>
          <p className="mt-5 text-[17px] text-ink-3 leading-relaxed">
            {content?.tagline ?? guide.summary}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {guide.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </Container>
      </section>

      {content ? (
        <>
          {/* You will need + you will end up with */}
          <section className="py-10 border-b border-line bg-paper">
            <Container size="narrow">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="rounded-xl border border-line bg-paper-2/40 p-5">
                  <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-4 mb-2">
                    you&apos;ll need
                  </div>
                  <ul className="space-y-2">
                    {content.youWillNeed.map((req, i) => (
                      <li
                        key={i}
                        className="flex gap-2.5 text-[13.5px] text-ink-2 leading-relaxed"
                      >
                        <span className="text-ember mt-[0.45em] text-[6px]">
                          ●
                        </span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-ember-line bg-ember-bg/50 p-5">
                  <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-ember mb-2">
                    you&apos;ll end up with
                  </div>
                  <p className="text-[13.5px] text-ink-2 leading-[1.65]">
                    {content.youWillEndUpWith}
                  </p>
                </div>
              </div>
            </Container>
          </section>

          {/* Main: TOC + Article */}
          <section className="py-14">
            <Container>
              <div className="grid lg:grid-cols-[1fr_680px_1fr] gap-8">
                {/* Left TOC */}
                <aside className="hidden lg:block">
                  <div className="sticky top-24">
                    <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-4 mb-3">
                      on this page
                    </div>
                    <nav className="space-y-1.5">
                      {content.toc.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className="block text-[12.5px] text-ink-3 hover:text-ember transition-colors leading-snug"
                        >
                          {item.label}
                        </a>
                      ))}
                    </nav>

                    <div className="mt-8 pt-5 border-t border-line">
                      <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-4 mb-2">
                        found a bug?
                      </div>
                      <a
                        href={`https://github.com/bitroot/bitroot/edit/main/src/content/guides-content.ts`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[12px] text-ink-3 hover:text-ember transition-colors"
                      >
                        edit on github →
                      </a>
                    </div>
                  </div>
                </aside>

                {/* Article */}
                <article className="min-w-0 max-w-[680px] mx-auto w-full">
                  {content.body.map((node, i) => renderNode(node, i))}

                  {/* Mobile/tablet: referenced tools collapse below the article */}
                  {content.referenced && content.referenced.length > 0 && (
                    <div className="lg:hidden mt-12 pt-8 border-t border-line">
                      <ReferencedList refs={content.referenced} />
                    </div>
                  )}

                  <ClubNudge>
                    <>
                      Shipped it but want a second pair of eyes on your
                      copy, DNS, or email deliverability?{" "}
                      <a
                        href="https://bitroot.club"
                        className="prose-link not-italic"
                        target="_blank"
                        rel="noreferrer"
                      >
                        bitroot.club
                      </a>{" "}
                      does a $0 launch review for anyone who followed this
                      guide. →
                    </>
                  </ClubNudge>
                </article>

                {/* Right sidebar: tools referenced in this guide */}
                <aside className="hidden lg:block">
                  {content.referenced && content.referenced.length > 0 && (
                    <div className="sticky top-24">
                      <ReferencedList refs={content.referenced} />
                    </div>
                  )}
                </aside>
              </div>
            </Container>
          </section>
        </>
      ) : (
        <section className="py-20">
          <Container size="narrow">
            <div className="rounded-2xl border border-dashed border-line bg-paper-2/40 p-10 text-center">
              <div className="text-[11px] font-mono text-ink-4 uppercase tracking-wider mb-2">
                draft in progress
              </div>
              <h2 className="font-display text-[24px] font-bold text-ink mb-3">
                Writing this one up now.
              </h2>
              <p className="text-[14px] text-ink-3 leading-relaxed max-w-md mx-auto mb-6">
                We don&apos;t publish guides until they&apos;ve been walked
                through from zero on a fresh machine. Check back soon.
              </p>
              <Link
                href="/guides"
                className="inline-flex items-center gap-2 text-[13px] font-mono text-ink-3 hover:text-ember transition-colors"
              >
                ← back to all guides
              </Link>
            </div>
            <ClubNudge />
          </Container>
        </section>
      )}
    </>
  );
}
