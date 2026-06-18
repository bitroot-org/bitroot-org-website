import Container from "@/components/ui/Container";
import { Block, Section } from "@/components/legal/blocks";
import LegalToc from "@/components/legal/LegalToc";
import {
  estimateFrootsReadMinutes,
  type FrootsDoc,
} from "@/content/froots-content";

export default function FrootsPolicy({ doc }: { doc: FrootsDoc }) {
  const readMins = estimateFrootsReadMinutes(doc);
  const fmtDate = new Date(doc.updated).toLocaleDateString("en-GB", {
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
            <span>Last updated {fmtDate}</span>
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

        {/* Tagline card */}
        <div className="mt-10 relative border border-line rounded-lg bg-paper-2/40 p-6 sm:p-7">
          <span
            aria-hidden
            className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent"
          />
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4 mb-3 flex items-center gap-2">
            <span aria-hidden className="size-1 rounded-full bg-live" />
            The short version
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
                    href={`mailto:${doc.contactEmail}`}
                    className="prose-link font-mono"
                  >
                    {doc.contactEmail}
                  </a>
                </dd>
              </dl>
            </section>
          </article>

          <LegalToc sections={doc.sections} />
        </div>
      </div>
    </main>
  );
}
