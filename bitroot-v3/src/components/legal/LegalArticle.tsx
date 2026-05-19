import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  estimateReadMinutes,
  legalDocs,
  legalOrder,
  type LegalBlock,
  type LegalDoc,
  type LegalSection,
} from "@/content/legal-content";
import LegalTabs from "./LegalTabs";
import LegalToc from "./LegalToc";

// ── Inline-HTML helper ─────────────────────────────────────────────
// Content strings may contain <strong>, <em>, <a>. Content is curated.
function Html({
  html,
  as: Tag = "span",
  className,
}: {
  html: string;
  as?: "span" | "p";
  className?: string;
}) {
  // eslint-disable-next-line react/no-danger
  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ── Block renderer ─────────────────────────────────────────────────
function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "p":
      return (
        <Html
          as="p"
          html={block.body}
          className={
            block.lead
              ? "font-serif italic text-[18px] text-ink-2 leading-[1.6]"
              : undefined
          }
        />
      );

    case "h3":
      return (
        <h3
          id={block.id}
          className="font-display text-[18px] font-semibold text-ink mt-10 mb-3 tracking-tight"
        >
          {block.body}
        </h3>
      );

    case "ul":
      return (
        <ul className="space-y-2 my-4 pl-0 list-none">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="relative pl-6 text-[15px] text-ink-2 leading-[1.75]"
            >
              <span
                aria-hidden
                className="absolute left-0 top-[0.65em] inline-block size-1 rounded-full bg-ember"
              />
              <Html html={item} />
            </li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol className="space-y-2 my-4 pl-0 list-none">
          {block.items.map((item, i) => {
            const n = (block.start ?? 1) + i;
            return (
              <li
                key={i}
                className="relative pl-9 text-[15px] text-ink-2 leading-[1.75]"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-[0.15em] font-mono text-[12px] tabular-nums text-ink-4"
                >
                  {String(n).padStart(2, "0")}
                </span>
                <Html html={item} />
              </li>
            );
          })}
        </ol>
      );

    case "kv":
      return (
        <dl className="my-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[14px]">
          {block.rows.map((r, i) => (
            <div key={i} className="contents">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-4 pt-0.5">
                {r.key}
              </dt>
              <dd className="text-ink-2 leading-[1.6]">{r.value}</dd>
            </div>
          ))}
        </dl>
      );

    case "callout":
      return (
        <aside
          className={[
            "my-6 p-4 sm:p-5 rounded-md border-l-2",
            block.tone === "warn"
              ? "border-ember bg-ember-bg/40"
              : "border-ink-4 bg-paper-2/60",
          ].join(" ")}
        >
          <div className="flex items-center gap-2 mb-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-3">
            <span
              aria-hidden
              className={[
                "size-1.5 rounded-full",
                block.tone === "warn" ? "bg-ember" : "bg-live",
              ].join(" ")}
            />
            {block.tone === "warn" ? "Note" : "Good to know"}
          </div>
          <Html as="p" html={block.body} />
        </aside>
      );
  }
}

// ── Section renderer ────────────────────────────────────────────────
function Section({ section }: { section: LegalSection }) {
  return (
    <section
      id={section.id}
      className="scroll-mt-28 mt-16 first:mt-0 fade-up"
    >
      {/* Number band — mono number + dotted rule */}
      <div className="flex items-center gap-4">
        <span className="font-mono text-[12px] text-ember tabular-nums">
          {section.number}
        </span>
        <span aria-hidden className="dotted-line flex-1" />
      </div>

      {/* Title */}
      <h2 className="font-display text-[26px] sm:text-[30px] font-bold text-ink mt-3 leading-[1.15] tracking-tight">
        <Html html={section.title} />{" "}
        <a
          href={`#${section.id}`}
          aria-label={`Link to ${section.title}`}
          className="text-ink-4 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity text-[18px] font-mono align-middle"
        >
          #
        </a>
      </h2>

      {/* Plain-English summary */}
      {section.summary && (
        <p className="mt-3 font-serif italic text-[17px] text-ink-3 leading-[1.55]">
          {section.summary}
        </p>
      )}

      {/* Blocks */}
      <div className="mt-6 space-y-4 text-[15px] text-ink-2 leading-[1.8]">
        {section.blocks.map((b, i) => (
          <Block key={i} block={b} />
        ))}
      </div>
    </section>
  );
}

// ── Pager nav ─────────────────────────────────────────────────────
function PagerNav({ currentSlug }: { currentSlug: LegalDoc["slug"] }) {
  const idx = legalOrder.indexOf(currentSlug);
  const prev = idx > 0 ? legalDocs[legalOrder[idx - 1]] : null;
  const next =
    idx < legalOrder.length - 1 ? legalDocs[legalOrder[idx + 1]] : null;

  return (
    <nav
      aria-label="Other legal documents"
      className="mt-16 pt-8 border-t border-line grid grid-cols-1 sm:grid-cols-2 gap-3"
    >
      {prev ? (
        <Link
          href={`/legal/${prev.slug}/`}
          className="group flex flex-col gap-1 rounded-md border border-line p-4 hover:border-ink-3 transition-colors"
        >
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
            ← Previous
          </span>
          <span className="font-display text-[16px] text-ink group-hover:text-ember transition-colors">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/legal/${next.slug}/`}
          className="group flex flex-col gap-1 rounded-md border border-line p-4 hover:border-ink-3 transition-colors sm:text-right"
        >
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-4">
            Next →
          </span>
          <span className="font-display text-[16px] text-ink group-hover:text-ember transition-colors">
            {next.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

// ── Main article ──────────────────────────────────────────────────
export default function LegalArticle({ doc }: { doc: LegalDoc }) {
  const readMins = estimateReadMinutes(doc);
  const fmtDate = new Date(doc.effective).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <main className="pb-24">
      {/* Page header */}
      <Container size="narrow">
        <header className="pt-14 sm:pt-20">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ember flex items-center gap-2">
            <span aria-hidden className="size-1.5 rounded-full bg-ember" />
            {doc.kicker}
          </div>

          <h1 className="font-display text-[40px] sm:text-[56px] font-extrabold text-ink mt-4 leading-[1.04] tracking-tight">
            {doc.title}
            <span className="text-ember">.</span>
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11.5px] text-ink-4 tabular-nums">
            <span>Effective {fmtDate}</span>
            <span aria-hidden className="text-line-2">
              ·
            </span>
            <span>{doc.sections.length} sections</span>
            <span aria-hidden className="text-line-2">
              ·
            </span>
            <span>~{readMins} min read</span>
          </div>
        </header>

        {/* Tabs */}
        <LegalTabs current={doc.slug} />

        {/* Tagline card */}
        <div className="mt-10 relative border border-line rounded-lg bg-paper-2/40 p-6 sm:p-7">
          <span
            aria-hidden
            className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent"
          />
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4 mb-3 flex items-center gap-2">
            <span aria-hidden className="size-1 rounded-full bg-live" />
            Plain English
          </div>
          <p className="font-serif italic text-[18px] sm:text-[19px] text-ink-2 leading-[1.55]">
            {doc.tagline}
          </p>
        </div>
      </Container>

      {/* Body — TOC + Article */}
      <div className="mx-auto w-full px-5 sm:px-8 lg:px-10 max-w-[1080px] mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] lg:gap-16 gap-0">
          <article className="min-w-0 legal-prose group">
            {/* Intro */}
            {doc.intro.length > 0 && (
              <div className="space-y-4 text-[15px] text-ink-2 leading-[1.8]">
                {doc.intro.map((b, i) => (
                  <Block key={`intro-${i}`} block={b} />
                ))}
              </div>
            )}

            {/* Sections */}
            <div className="mt-12">
              {doc.sections.map((s) => (
                <Section key={s.id} section={s} />
              ))}
            </div>

            {/* Contact card */}
            <section
              id="contact"
              className="scroll-mt-28 mt-20 ruled-paper rounded-lg p-6 sm:p-8 border border-line bg-paper"
            >
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ember mb-3 flex items-center gap-2">
                <span aria-hidden className="size-1.5 rounded-full bg-ember" />
                Get in touch
              </div>
              <h2 className="font-display text-[22px] font-bold text-ink mb-4">
                Questions about this policy?
              </h2>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[14px]">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-4 pt-0.5">
                  Email
                </dt>
                <dd className="text-ink-2">
                  <a
                    href={`mailto:${doc.contact.email}`}
                    className="prose-link font-mono"
                  >
                    {doc.contact.email}
                  </a>
                </dd>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-4 pt-0.5">
                  Postal
                </dt>
                <dd className="text-ink-2 leading-[1.55]">
                  {doc.contact.postal}
                </dd>
              </dl>
            </section>

            {/* Pager */}
            <PagerNav currentSlug={doc.slug} />
          </article>

          <LegalToc sections={doc.sections} />
        </div>
      </div>
    </main>
  );
}
