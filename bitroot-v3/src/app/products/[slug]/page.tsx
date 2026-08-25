import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Tag from "@/components/ui/Tag";
import ClubNudge from "@/components/ui/ClubNudge";
import ProductIcon from "@/components/products/ProductIcon";
import JsonLd from "@/components/JsonLd";
import {
  buildMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  softwareApplicationJsonLd,
} from "@/lib/seo";
import { products, findProduct } from "@/content/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) return {};
  return buildMetadata({
    title: `${product.name} — ${product.tagline}`,
    description: product.description,
    path: `/products/${product.slug}/`,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();

  const statusLabel =
    product.status === "live"
      ? "live"
      : product.status === "early-access"
        ? "early access"
        : "coming soon";

  return (
    <>
      {/* Breadcrumb + header */}
      <section className="pt-10 pb-8 border-b border-line bg-paper-2/40">
        <Container>
          <JsonLd
            data={breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Products", path: "/products/" },
              { name: product.name, path: `/products/${product.slug}/` },
            ])}
          />
          <JsonLd
            data={softwareApplicationJsonLd({
              name: product.name,
              description: product.description,
              path: `/products/${product.slug}/`,
              category: product.category,
            })}
          />
          {product.faq && product.faq.length > 0 && (
            <JsonLd data={faqJsonLd(product.faq)} />
          )}

          <nav className="text-[12px] font-mono text-ink-4 mb-6 flex items-center gap-1.5">
            <Link href="/" className="hover:text-ember transition-colors">
              ~
            </Link>
            <span>/</span>
            <Link
              href="/products"
              className="hover:text-ember transition-colors"
            >
              products
            </Link>
            <span>/</span>
            <span className="text-ink-3">{product.slug}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-3xl flex items-start gap-5">
              <ProductIcon
                from={product.icon.from}
                to={product.icon.to}
                glyph={product.icon.glyph}
                size={76}
                className="hidden sm:block shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember">
                    {product.category}
                  </span>
                  <span className="text-ink-4">·</span>
                  <Tag
                    variant={
                      product.status === "live"
                        ? "live"
                        : product.status === "early-access"
                          ? "ember"
                          : "muted"
                    }
                  >
                    {statusLabel}
                  </Tag>
                </div>
                <h1 className="font-display text-4xl md:text-[52px] font-extrabold text-ink leading-[1.02] tracking-tight">
                  {product.name}
                </h1>
                <p className="mt-5 text-[16px] text-ink-3 leading-relaxed max-w-2xl">
                  {product.detailTagline ?? product.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              {product.status === "live" ? (
                <a
                  href={product.url ?? "#"}
                  className="inline-flex items-center gap-2 bg-ink text-paper text-[13px] font-medium rounded-lg px-4 py-2.5 hover:bg-ink-2 transition-colors"
                >
                  Open {product.name}
                </a>
              ) : (
                <a
                  href={product.waitlistHref ?? "/products#notify"}
                  className="inline-flex items-center gap-2 bg-ink text-paper text-[13px] font-medium rounded-lg px-4 py-2.5 hover:bg-ink-2 transition-colors"
                >
                  {product.status === "early-access"
                    ? `Claim early access`
                    : `Join the waitlist`}
                </a>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* One-liner */}
      <section className="py-12">
        <Container size="narrow">
          <p className="text-[17px] text-ink-2 leading-relaxed">
            {product.description}
          </p>
        </Container>
      </section>

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <section className="py-12 border-t border-line bg-paper-2/30">
          <Container>
            <div className="mb-8">
              <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-2">
                ~/ what it does
              </div>
              <h2 className="font-display text-[30px] md:text-[36px] font-bold text-ink tracking-tight leading-[1.1]">
                Built for the whole workflow, not one step.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {product.features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-line bg-paper p-5"
                >
                  <h3 className="font-display font-semibold text-[15px] text-ink mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-[13px] text-ink-3 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Plans */}
      <section className="py-14 border-t border-line">
        <Container size="narrow">
          <div className="mb-8">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-2">
              ~/ plans
            </div>
            <h2 className="font-display text-[30px] font-bold text-ink tracking-tight leading-[1.1]">
              Free, always — community when you&apos;re ready.
            </h2>
          </div>

          <ul className="divide-y divide-line">
            <li className="py-5 flex gap-5">
              <div className="font-display font-semibold text-[16px] text-ink shrink-0 w-32">
                Free
              </div>
              <div className="text-[14px] text-ink-3 leading-relaxed flex-1">
                {product.free}
              </div>
            </li>
            <li className="py-5 flex gap-5">
              <div className="font-display font-semibold text-[16px] text-ink shrink-0 w-32">
                Community
              </div>
              <div className="text-[14px] text-ink-3 leading-relaxed flex-1">
                {product.community}
              </div>
            </li>
          </ul>
        </Container>
      </section>

      {/* FAQ */}
      {product.faq && product.faq.length > 0 && (
        <section className="py-16 border-t border-line bg-paper-2/40">
          <Container size="narrow">
            <div className="mb-10">
              <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-2">
                ~/ faq
              </div>
              <h2 className="font-display text-[30px] md:text-[38px] font-bold text-ink tracking-tight leading-[1.05]">
                Questions people actually ask.
              </h2>
            </div>

            <dl className="space-y-8">
              {product.faq.map((item) => (
                <div key={item.q}>
                  <dt className="font-display text-[17px] font-bold text-ink tracking-tight mb-2">
                    {item.q}
                  </dt>
                  <dd className="text-[14.5px] text-ink-3 leading-relaxed max-w-2xl">
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      )}

      <section className="py-14 border-t border-line">
        <Container size="narrow">
          <ClubNudge />
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[13px] font-mono text-ink-3 hover:text-ember transition-colors"
            >
              ← back to all products
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
