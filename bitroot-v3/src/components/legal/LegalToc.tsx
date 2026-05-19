import type { LegalSection } from "@/content/legal-content";

function TocList({
  sections,
  className = "",
}: {
  sections: LegalSection[];
  className?: string;
}) {
  return (
    <ol className={`space-y-2.5 ${className}`}>
      {sections.map((s) => (
        <li key={s.id} className="flex items-baseline gap-3">
          <span
            aria-hidden
            className="font-mono text-[10.5px] text-ink-4 tabular-nums shrink-0"
          >
            {s.number}
          </span>
          <a
            href={`#${s.id}`}
            className="text-[12.5px] text-ink-2 hover:text-ember transition-colors leading-snug"
          >
            {/* eslint-disable-next-line react/no-danger */}
            <span dangerouslySetInnerHTML={{ __html: s.title }} />
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function LegalToc({ sections }: { sections: LegalSection[] }) {
  return (
    <>
      {/* Mobile / tablet — collapsible at top of body */}
      <details className="lg:hidden group mb-8 border border-line rounded-lg bg-paper-2/40">
        <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
          <span className="flex items-center gap-2">
            <span aria-hidden className="size-1.5 rounded-full bg-ember" />
            Contents · {sections.length} sections
          </span>
          <svg
            aria-hidden
            className="size-3.5 transition-transform group-open:rotate-180"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M3 4.5L6 7.5L9 4.5" strokeLinecap="round" />
          </svg>
        </summary>
        <div className="px-4 pb-4 pt-1">
          <TocList sections={sections} />
        </div>
      </details>

      {/* Desktop — sticky right rail */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-4 mb-3 flex items-center gap-2">
            <span aria-hidden className="size-1 rounded-full bg-ember" />
            On this page
          </div>
          <TocList sections={sections} />
        </div>
      </aside>
    </>
  );
}
