import Link from "next/link";
import Container from "@/components/ui/Container";
import Tag from "@/components/ui/Tag";
import ProductIcon from "@/components/products/ProductIcon";
import { products, daysSince, type ProductStatus } from "@/content/products";

function StatusTag({ status }: { status: ProductStatus }) {
  if (status === "live") {
    return <Tag variant="live">LIVE</Tag>;
  }
  if (status === "early-access") {
    return <Tag variant="ember">EARLY ACCESS</Tag>;
  }
  return <Tag variant="muted">WAITLIST</Tag>;
}

function Arrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BitStudioSpotlight() {
  const bitStudio = products.find((p) => p.slug === "bitstudio");

  if (!bitStudio) return null;

  const release = bitStudio.releases?.[0];
  const days = bitStudio.launchedAt ? daysSince(bitStudio.launchedAt) : null;
  const dayLabel =
    days === null
      ? null
      : days === 0
        ? "shipped today"
        : days === 1
          ? "shipped yesterday"
          : days < 7
            ? `shipped ${days} days ago`
            : days < 14
              ? "shipped this week"
              : `shipped on ${bitStudio.launchedAt}`;

  return (
    <section id="bitstudio-spotlight" className="py-18">
      <Container>
        {/* Section header — eyebrow + headline + subtext */}
        <div className="flex items-end justify-between gap-6 mb-9">
          <div>
            {/* Eyebrow: "-/" prefix matches the site pattern (not "~/") */}
            <span className="eyebrow-mono">-/ now launching</span>
            <h2 className="font-sans mt-2.5 text-[clamp(30px,3.4vw,42px)] font-semibold tracking-[-0.03em] leading-[1.05]">
              Meet <span className="serif-em" style={{ color: "#7782ee" }}>BitStudio.</span>
            </h2>
            <p className="text-[15px] text-ink-3 mt-3 max-w-[560px]">
              Our first product is live in early access.
            </p>
          </div>
        </div>

        {/* Product card — exact structure from ProductsClient.tsx ProductCard */}
        <div
          className="relative rounded-[28px] overflow-hidden border border-line bg-paper"
          style={{
            boxShadow:
              "0 30px 80px -40px rgba(20,18,42,0.18), 0 8px 24px -16px rgba(20,18,42,0.08)",
          }}
        >
          {/* Radial gradient bleed — same as products page */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(700px 360px at 0% 0%, ${bitStudio.icon.from}22, transparent 60%), radial-gradient(560px 360px at 100% 100%, ${bitStudio.icon.to}1f, transparent 60%)`,
            }}
          />
          {/* Dot grid — same as products page */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, var(--color-ink) 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />

          <div className="relative grid lg:grid-cols-[auto_1fr] gap-8 lg:gap-12 p-8 md:p-12 items-start">
            {/* Icon column */}
            <div className="relative flex justify-start">
              <div
                className="absolute -inset-8 rounded-[40px] blur-2xl opacity-50 pointer-events-none"
                style={{
                  background: `radial-gradient(closest-side, ${bitStudio.icon.from}55, transparent 70%)`,
                }}
              />
              <div className="relative" style={{ transform: "rotate(-6deg)" }}>
                <ProductIcon
                  from={bitStudio.icon.from}
                  to={bitStudio.icon.to}
                  glyph={bitStudio.icon.glyph}
                  size={156}
                />
              </div>
            </div>

            {/* Content column */}
            <div className="min-w-0">
              {/* Badges row — "NOW LAUNCHING" pill + StatusTag + metadata */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {/* "NOW LAUNCHING" orange pill — matches products page exactly */}
                <span className="font-mono uppercase tracking-[0.14em] text-[10px] bg-ember text-paper rounded-full px-2 py-0.5">
                  Now launching
                </span>
                <StatusTag status={bitStudio.status} />
                {dayLabel && (
                  <span className="text-[11px] font-mono text-ink-4">
                    · {dayLabel}
                  </span>
                )}
                {release && (
                  <span className="font-mono text-[11px] text-ink-3">
                    · v{release.version}
                  </span>
                )}
              </div>

              {/* Product name */}
              <h3 className="font-display text-4xl md:text-5xl font-extrabold text-ink leading-[1.02] tracking-tight">
                {bitStudio.name}
                <span className="text-ember">.</span>
              </h3>

              {/* Tagline */}
              <p className="mt-3 text-[16px] md:text-[17px] text-ink-2 leading-relaxed max-w-2xl">
                {bitStudio.tagline}
              </p>

              {/* Description */}
              <p className="mt-3 text-[14px] text-ink-3 leading-relaxed max-w-2xl">
                {bitStudio.description}
              </p>

              {/* "What's in v0.5" checklist — rendered only when highlights exist */}
              {release?.highlights && release.highlights.length > 0 && (
                <div className="mt-6">
                  <div className="font-mono text-[11px] text-ink-4 uppercase tracking-wider mb-2">
                    What&apos;s in v{release.version}
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                    {release.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2 text-[13.5px] text-ink-2"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="mt-0.5 shrink-0 text-ember"
                        >
                          <path
                            d="M3 8.5l3 3 7-7"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-2">
                {/* Primary: redirects to /products/ landing at the BitStudio card */}
                <Link
                  href="/products/#bitstudio"
                  className="hover-lift inline-flex items-center gap-1.5 text-[13.5px] font-medium bg-ink text-paper hover:bg-ink-2 rounded-full px-5 py-2.5"
                >
                  Claim early access
                  <Arrow />
                </Link>
                {/* Secondary: redirects to /products/#releases (absolute, we are on homepage) */}
                <Link
                  href="/products/#releases"
                  className="hover-lift inline-flex items-center gap-1.5 text-[13.5px] font-medium border border-line bg-paper text-ink-2 hover:border-ink-3 hover:text-ink rounded-full px-5 py-2.5"
                >
                  See release notes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}