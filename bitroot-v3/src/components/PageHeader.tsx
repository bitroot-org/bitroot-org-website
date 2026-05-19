import Link from "next/link";
import Container from "./ui/Container";

export default function PageHeader({
  breadcrumb,
  kicker,
  title,
  subtitle,
  meta,
}: {
  breadcrumb?: { label: string; href: string }[];
  kicker?: string;
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
}) {
  return (
    <header className="pt-14 pb-10 border-b border-line">
      <Container>
        {breadcrumb && (
          <nav className="flex items-center gap-1.5 text-[12px] font-mono text-ink-4 mb-5">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-line-2">/</span>}
                <Link
                  href={crumb.href}
                  className="hover:text-ember transition-colors"
                >
                  {crumb.label}
                </Link>
              </span>
            ))}
          </nav>
        )}

        {kicker && (
          <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-3">
            {kicker}
          </div>
        )}

        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink leading-[1.05]">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-4 text-[17px] text-ink-3 leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}

        {meta && <div className="mt-6">{meta}</div>}
      </Container>
    </header>
  );
}
