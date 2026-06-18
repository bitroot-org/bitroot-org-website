import type { LegalBlock, LegalSection } from "@/content/legal-content";

// ── Inline-HTML helper ─────────────────────────────────────────────
// Content strings may contain <strong>, <em>, <a>, <code>. Content is
// curated (not user input), so no sanitization here.
export function Html({
  html,
  as: Tag = "span",
  className,
}: {
  html: string;
  as?: "span" | "p";
  className?: string;
}) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

// ── Block renderer ─────────────────────────────────────────────────
export function Block({ block }: { block: LegalBlock }) {
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
export function Section({ section }: { section: LegalSection }) {
  return (
    <section id={section.id} className="scroll-mt-28 mt-16 first:mt-0 fade-up">
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
