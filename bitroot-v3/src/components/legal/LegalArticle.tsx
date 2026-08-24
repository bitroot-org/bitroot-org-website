import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  estimateReadMinutes,
  legalDocs,
  legalOrder,
  type LegalDoc,
} from "@/content/legal-content";
import { Block, Section } from "./blocks";
import LegalTabs from "./LegalTabs";
import LegalToc from "./LegalToc";

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
