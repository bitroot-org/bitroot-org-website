import Link from "next/link";
import { legalOrder, legalDocs, type LegalSlug } from "@/content/legal-content";

export default function LegalTabs({ current }: { current: LegalSlug }) {
  return (
    <nav
      aria-label="Legal documents"
      className="-mx-1 mt-8 overflow-x-auto"
    >
      <ul className="flex items-stretch gap-0 min-w-max border-b border-line">
        {legalOrder.map((slug) => {
          const isCurrent = slug === current;
          const doc = legalDocs[slug];
          return (
            <li key={slug}>
              <Link
                href={`/legal/${slug}/`}
                aria-current={isCurrent ? "page" : undefined}
                className={[
                  "relative inline-flex items-center gap-2 px-4 sm:px-5 py-3",
                  "font-mono text-[12px] uppercase tracking-[0.14em]",
                  "transition-colors",
                  isCurrent
                    ? "text-ink"
                    : "text-ink-4 hover:text-ink-2",
                ].join(" ")}
              >
                <span
                  aria-hidden
                  className={[
                    "size-1.5 rounded-full transition-colors",
                    isCurrent ? "bg-ember" : "bg-line-2",
                  ].join(" ")}
                />
                {doc.shortTitle}
                {isCurrent && (
                  <span
                    aria-hidden
                    className="absolute left-3 right-3 -bottom-px h-px bg-ink"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
