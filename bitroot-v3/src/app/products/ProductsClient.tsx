"use client";

import { useState } from "react";
import { identify, today, track } from "@/lib/analytics";
import Container from "@/components/ui/Container";
import Tag from "@/components/ui/Tag";
import ProductIcon from "@/components/products/ProductIcon";
import EarlyAccessModal from "@/components/products/EarlyAccessModal";
import {
  products,
  spotlight,
  recentReleases,
  daysSince,
  type Product,
  type Release,
  type Spotlight,
} from "@/content/products";

const earlyAccessCount = products.filter((p) => p.status === "early-access")
  .length;
const comingSoonCount = products.filter((p) => p.status === "waitlist").length;

export default function ProductsClient() {
  const spot = spotlight();
  const releases = recentReleases(6);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  const openModal = (p: Product) => setModalProduct(p);
  const closeModal = () => setModalProduct(null);

  return (
    <>
      {/* Hero — full-bleed, recessed inner-shadow stage. */}
      <section
        className="relative -mt-16 md:-mt-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #ebedfc 0%, #eef1fb 38%, #fae8ed 100%)",
          boxShadow:
            "inset 0 14px 30px -16px rgba(20,18,42,0.18), inset 0 -18px 36px -18px rgba(20,18,42,0.14)",
        }}
      >
        <div className="absolute inset-0 square-grid-fade opacity-55 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(820px 520px at 10% 0%, rgba(82,92,235,0.18), transparent 65%)," +
              "radial-gradient(920px 600px at 92% 14%, rgba(247,168,184,0.28), transparent 65%)," +
              "radial-gradient(900px 540px at 50% 120%, rgba(255,255,255,0.7), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: "160px 160px",
          }}
        />

        <Container>
          <div className="relative pt-32 sm:pt-40 lg:pt-44 pb-10 text-center">
            {spot && (
              <div className="mb-6 flex justify-center">
                <RibbonChip spot={spot} onOpen={openModal} />
              </div>
            )}
            <div className="inline-flex eyebrow-mono mb-4">
              ~/ products · {earlyAccessCount} in early access · {comingSoonCount} coming soon
            </div>
            <h1 className="font-display text-[42px] sm:text-6xl lg:text-[78px] font-extrabold text-ink leading-[1.02] tracking-tight">
              Tiny apps <em className="serif-em">for</em> builders
              <span className="text-ember">.</span>
            </h1>
            <p className="mt-5 sm:mt-6 text-[15.5px] sm:text-[17px] text-ink-2 leading-relaxed max-w-[640px] mx-auto">
              Apps from me and the Bitroot team. Each one ships with a generous
              free plan and a community program — early access starts with a
              small cohort.
            </p>
            <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-2.5">
              {spot && spot.product.status === "early-access" && (
                <button
                  type="button"
                  onClick={() => openModal(spot.product)}
                  className="hover-lift inline-flex items-center gap-1.5 text-[13.5px] font-medium bg-ink text-paper hover:bg-ink-2 rounded-full px-5 py-2.5 shadow-[0_10px_24px_-12px_rgba(20,18,42,0.45)]"
                >
                  Get early access to {spot.product.name}
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
              <a
                href="#catalog"
                className="hover-lift inline-flex items-center gap-1.5 text-[13.5px] font-medium border border-line bg-paper/70 backdrop-blur text-ink-2 hover:border-ink-3 hover:text-ink rounded-full px-5 py-2.5"
              >
                Browse apps
              </a>
            </div>
          </div>

          {/* App dock — fanned squircles */}
          <div className="relative pb-14 sm:pb-20 lg:pb-24">
            <div className="flex items-end justify-center gap-2.5 sm:gap-4 px-4 sm:px-6">
              {products.map((p, i) => {
                const mid = (products.length - 1) / 2;
                const offset = i - mid;
                const angle = offset * 5;
                const lift = Math.abs(offset) * 7;
                return (
                  <a
                    key={p.slug}
                    href={`#${p.slug}`}
                    aria-label={p.name}
                    title={p.name}
                    className="transition-transform duration-500 hover:-translate-y-2"
                    style={{
                      transform: `translateY(${lift}px) rotate(${angle}deg)`,
                      zIndex: 10 - Math.abs(offset),
                    }}
                  >
                    <div className="hidden sm:block">
                      <ProductIcon
                        from={p.icon.from}
                        to={p.icon.to}
                        glyph={p.icon.glyph}
                        size={88}
                      />
                    </div>
                    <div className="sm:hidden">
                      <ProductIcon
                        from={p.icon.from}
                        to={p.icon.to}
                        glyph={p.icon.glyph}
                        size={56}
                      />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Spotlight — now launching */}
      {spot && <NowLaunching spot={spot} onOpen={openModal} />}

      {/* Catalog */}
      <section id="catalog" className="py-14 md:py-20">
        <Container>
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-ink-4 mb-2">
                / catalog
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
                All apps
              </h2>
            </div>
            <div className="text-[12px] font-mono text-ink-4 hidden sm:block">
              {earlyAccessCount} live · {comingSoonCount} coming soon
            </div>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} onOpen={openModal} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Releases rail */}
      {releases.length > 0 && <Changelog releases={releases} />}

      {/* Promise strip */}
      <section className="py-14 border-y border-line bg-paper-2/50">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            <Promise
              num="01"
              title="Free, always"
              body="Every product has a real free plan you can use forever — not a 14-day trial dressed up as one."
            />
            <Promise
              num="02"
              title="Community before scale"
              body="The first cohort joins by request. Small group, real conversations, direct line to the team."
            />
            <Promise
              num="03"
              title="Built in public"
              body="Roadmaps, decisions, and pricing live in the open. If you don't like where it's going, you can tell us before it ships."
            />
          </div>
        </Container>
      </section>

      {/* Notify section — generic future-launches capture */}
      <section id="notify" className="py-16 md:py-24">
        <Container>
          <div className="rounded-3xl border border-line bg-paper p-8 md:p-12 relative overflow-hidden">
            <div
              className="absolute -right-20 -top-20 w-[360px] h-[360px] rounded-full opacity-40 pointer-events-none"
              style={{
                background:
                  "radial-gradient(closest-side, var(--color-ember-bg), transparent 70%)",
              }}
            />
            <div className="relative max-w-2xl">
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-ember mb-3">
                / heads-up list
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
                Get a ping when the next app launches.
              </h2>
              <p className="mt-4 text-[15.5px] text-ink-3 leading-relaxed">
                One email per launch. Not a drip campaign. Unsubscribe whenever.
              </p>
              <HeadsUpForm />
              <p className="mt-3 text-[11.5px] font-mono text-ink-4">
                No spam. Unsubscribe with one click.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <EarlyAccessModal
        open={!!modalProduct}
        product={modalProduct}
        onClose={closeModal}
      />
    </>
  );
}

/* ─── Heads-up (launch notify) form ────────────────────────────────────── */

function HeadsUpForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="mt-6 flex items-center gap-2 text-[14px] text-live">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 8.5l2.5 2.5L12 5.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        You&apos;re on the list — we&apos;ll ping you at the next launch.
      </div>
    );
  }

  return (
    <form
      className="mt-6 flex flex-col sm:flex-row gap-2 max-w-lg"
      onSubmit={(e) => {
        e.preventDefault();
        if (!email) return;
        identify(
          email,
          { newsletter_subscriber: true },
          { newsletter_signup_date: today() },
        );
        track("newsletter_signup", { location: "products_heads_up" });
        setDone(true);
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@yourstartup.com"
        className="flex-1 rounded-full border border-line bg-paper px-4 py-2.5 text-[14px] placeholder:text-ink-4 focus:outline-none focus:border-ember"
      />
      <button
        type="submit"
        className="hover-lift rounded-full bg-ink text-paper px-5 py-2.5 text-[13.5px] font-medium hover:bg-ink-2 transition-colors"
      >
        Notify me
      </button>
    </form>
  );
}

/* ─── Ribbon chip ──────────────────────────────────────────────────────── */

function RibbonChip({
  spot,
  onOpen,
}: {
  spot: Spotlight;
  onOpen: (p: Product) => void;
}) {
  const { product, release } = spot;
  const launchDays = product.launchedAt ? daysSince(product.launchedAt) : null;
  const isLaunch =
    !!product.featuredLaunch && launchDays !== null && launchDays <= 30;
  const canTrigger = product.status === "early-access";

  const label = isLaunch ? "New launch" : "Just shipped";
  const message = isLaunch
    ? `${product.name} is in early access`
    : release
      ? `${product.name} v${release.version} · ${release.note}`
      : `${product.name}`;

  const className =
    "group inline-flex items-center gap-2 rounded-full border border-line bg-paper/70 backdrop-blur px-2 py-1 text-[12px] shadow-[0_8px_20px_-12px_rgba(20,18,42,0.25)] hover:border-ember/50 transition-colors";

  const content = (
    <>
      <span className="font-mono uppercase tracking-[0.14em] text-[10px] bg-ember text-paper rounded-full px-2 py-0.5 inline-flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-paper/80 pulse-live" />
        {label}
      </span>
      <span className="text-ink-2 truncate">{message}</span>
      <span className="text-ink-4 group-hover:text-ember transition-colors inline-flex items-center pr-1">
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </>
  );

  return canTrigger ? (
    <button type="button" onClick={() => onOpen(product)} className={className}>
      {content}
    </button>
  ) : (
    <a href={`#${product.slug}`} className={className}>
      {content}
    </a>
  );
}

/* ─── Now launching — large spotlight panel ────────────────────────────── */

function NowLaunching({
  spot,
  onOpen,
}: {
  spot: Spotlight;
  onOpen: (p: Product) => void;
}) {
  const { product, release } = spot;
  const days = product.launchedAt ? daysSince(product.launchedAt) : null;
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
              : `shipped on ${product.launchedAt}`;

  return (
    <section id={product.slug} className="py-14 md:py-20">
      <Container>
        <div
          className="relative rounded-[28px] overflow-hidden border border-line bg-paper"
          style={{
            boxShadow:
              "0 30px 80px -40px rgba(20,18,42,0.18), 0 8px 24px -16px rgba(20,18,42,0.08)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(700px 360px at 0% 0%, ${product.icon.from}22, transparent 60%), radial-gradient(560px 360px at 100% 100%, ${product.icon.to}1f, transparent 60%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, var(--color-ink) 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />

          <div className="relative grid lg:grid-cols-[auto_1fr] gap-8 lg:gap-12 p-8 md:p-12 items-start">
            <div className="relative flex justify-start">
              <div
                className="absolute -inset-8 rounded-[40px] blur-2xl opacity-50 pointer-events-none"
                style={{
                  background: `radial-gradient(closest-side, ${product.icon.from}55, transparent 70%)`,
                }}
              />
              <div
                className="relative"
                style={{ transform: "rotate(-6deg)" }}
              >
                <ProductIcon
                  from={product.icon.from}
                  to={product.icon.to}
                  glyph={product.icon.glyph}
                  size={156}
                />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="font-mono uppercase tracking-[0.14em] text-[10px] bg-ember text-paper rounded-full px-2 py-0.5">
                  Now launching
                </span>
                <StatusTag status={product.status} />
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

              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-ink leading-[1.02] tracking-tight">
                {product.name}
                <span className="text-ember">.</span>
              </h2>
              <p className="mt-3 text-[16px] md:text-[17px] text-ink-2 leading-relaxed max-w-2xl">
                {product.tagline}
              </p>
              <p className="mt-3 text-[14px] text-ink-3 leading-relaxed max-w-2xl">
                {product.description}
              </p>

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

              <div className="mt-7 flex flex-wrap items-center gap-2">
                <PrimaryAction product={product} onOpen={onOpen} />
                <a
                  href="#releases"
                  className="hover-lift inline-flex items-center gap-1.5 text-[13.5px] font-medium border border-line bg-paper text-ink-2 hover:border-ink-3 hover:text-ink rounded-full px-5 py-2.5"
                >
                  See release notes
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function PrimaryAction({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: (p: Product) => void;
}) {
  if (product.status === "live") {
    return (
      <a
        href={product.url ?? "#"}
        className="hover-lift inline-flex items-center gap-1.5 text-[13.5px] font-medium bg-ink text-paper hover:bg-ink-2 rounded-full px-5 py-2.5"
      >
        Open {product.name}
        <Arrow />
      </a>
    );
  }
  if (product.status === "early-access") {
    return (
      <button
        type="button"
        onClick={() => onOpen(product)}
        className="hover-lift inline-flex items-center gap-1.5 text-[13.5px] font-medium bg-ink text-paper hover:bg-ink-2 rounded-full px-5 py-2.5"
      >
        Claim early access
        <Arrow />
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[13.5px] font-medium border border-line text-ink-3 bg-paper-2/60 rounded-full px-5 py-2.5">
      Coming soon
    </span>
  );
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

/* ─── Changelog rail ───────────────────────────────────────────────────── */

function Changelog({
  releases,
}: {
  releases: Array<{ product: Product; release: Release }>;
}) {
  return (
    <section id="releases" className="py-14 md:py-16 border-t border-line">
      <Container>
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-ink-4 mb-2">
              / changelog
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
              Shipped recently
            </h2>
          </div>
          <a
            href="#notify"
            className="text-[12.5px] font-mono text-ember hover:text-ink transition-colors hidden sm:inline-flex items-center gap-1"
          >
            Subscribe to release notes
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div className="platter-scroll -mx-5 px-5 overflow-x-auto">
          <ul className="flex gap-4 min-w-max pb-3">
            {releases.map(({ product, release }) => (
              <li
                key={`${product.slug}-${release.version}`}
                className="w-[300px] sm:w-[320px] shrink-0"
              >
                <a
                  href={`#${product.slug}`}
                  className="repo-card group block h-full rounded-2xl border border-line bg-paper p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <ProductIcon
                      from={product.icon.from}
                      to={product.icon.to}
                      glyph={product.icon.glyph}
                      size={48}
                    />
                    <div className="min-w-0">
                      <div className="font-display text-[15px] font-semibold text-ink leading-tight group-hover:text-ember transition-colors truncate">
                        {product.name}
                      </div>
                      <div className="font-mono text-[10.5px] text-ink-4 flex items-center gap-1.5 mt-0.5">
                        <span className="bg-paper-3 text-ink-2 rounded px-1 py-0.5">
                          v{release.version}
                        </span>
                        <span>·</span>
                        <span>{release.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[13px] text-ink-2 leading-snug">
                    {release.note}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* ─── Product card ─────────────────────────────────────────────────────── */

function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: (p: Product) => void;
}) {
  const release = product.releases?.[0];
  const fresh = release ? daysSince(release.date) <= 14 : false;
  const launched =
    product.launchedAt && daysSince(product.launchedAt) <= 30
      ? daysSince(product.launchedAt)
      : null;

  return (
    <article
      id={product.slug}
      className="repo-card group h-full flex flex-col rounded-2xl border border-line bg-paper p-5 relative overflow-hidden"
    >
      {launched !== null && (
        <span className="absolute top-3 right-3 font-mono uppercase tracking-wider text-[9.5px] bg-ember text-paper rounded-full px-2 py-0.5 shadow-[0_4px_10px_-4px_rgba(82,92,235,0.55)]">
          new launch
        </span>
      )}

      <div className="flex items-start gap-4">
        <ProductIcon
          from={product.icon.from}
          to={product.icon.to}
          glyph={product.icon.glyph}
          size={76}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <StatusTag status={product.status} />
            {fresh && launched === null && (
              <Tag variant="ember">v{release!.version} · fresh</Tag>
            )}
          </div>
          <h3 className="font-display text-[19px] font-bold text-ink leading-tight group-hover:text-ember transition-colors">
            {product.name}
          </h3>
          <p className="mt-0.5 text-[12.5px] text-ink-3 leading-snug">
            {product.tagline}
          </p>
        </div>
      </div>

      <p className="mt-4 text-[13px] text-ink-3 leading-relaxed line-clamp-3">
        {product.description}
      </p>

      <div className="mt-4 grid gap-2">
        <PlanRow label="Free" body={product.free} variant="free" />
        <PlanRow label="Community" body={product.community} variant="club" />
      </div>

      <div className="mt-4 pt-4 border-t border-line/80 flex items-center justify-between">
        <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-4">
          {product.category}
        </span>
        <CardAction product={product} onOpen={onOpen} />
      </div>
    </article>
  );
}

function CardAction({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: (p: Product) => void;
}) {
  if (product.status === "live") {
    return (
      <a
        href={product.url ?? "#"}
        className="inline-flex items-center gap-1 text-[12px] font-medium text-ember hover:text-ink transition-colors"
      >
        Open
        <Arrow />
      </a>
    );
  }
  if (product.status === "early-access") {
    return (
      <button
        type="button"
        onClick={() => onOpen(product)}
        className="inline-flex items-center gap-1 text-[12px] font-medium text-ember hover:text-ink transition-colors"
      >
        Get early access
        <Arrow />
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11.5px] font-mono uppercase tracking-wider text-ink-4">
      Coming soon
    </span>
  );
}

function PlanRow({
  label,
  body,
  variant,
}: {
  label: string;
  body: string;
  variant: "free" | "club";
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={[
          "mt-0.5 inline-flex items-center justify-center w-[84px] h-5 px-2 rounded-full font-mono text-[10px] font-semibold tracking-wider uppercase shrink-0",
          variant === "free"
            ? "bg-live-bg text-live border border-green-200"
            : "bg-ember-bg text-ember border border-ember-line",
        ].join(" ")}
      >
        {label}
      </span>
      <span className="text-[12.5px] text-ink-2 leading-snug">{body}</span>
    </div>
  );
}

function StatusTag({ status }: { status: Product["status"] }) {
  if (status === "live") {
    return (
      <Tag variant="live">
        <span className="w-1.5 h-1.5 rounded-full bg-live pulse-live" />
        live
      </Tag>
    );
  }
  if (status === "early-access") {
    return <Tag variant="ember">early access</Tag>;
  }
  return <Tag variant="muted">coming soon</Tag>;
}

function Promise({
  num,
  title,
  body,
}: {
  num: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="font-mono text-[11px] text-ember tracking-wider mb-2">
        {num}
      </div>
      <h3 className="font-display text-lg font-bold text-ink mb-1.5">{title}</h3>
      <p className="text-[13.5px] text-ink-3 leading-relaxed">{body}</p>
    </div>
  );
}
