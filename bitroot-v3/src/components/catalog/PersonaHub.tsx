import Link from "next/link";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/JsonLd";
import PixelHeading from "@/components/ui/PixelHeading";
import PixelSteps from "@/components/ui/PixelSteps";
import { breadcrumbJsonLd, buildMetadata, collectionPageJsonLd, faqJsonLd } from "@/lib/seo";
import { kits, guides, products, tools } from "@/content/data";
import {
  itemPath,
  itemsForPersona,
  PERSONA_META,
  PERSONA_ORDER,
  type CatalogItem,
  type Persona,
} from "@/content/catalog";
import CatalogCard from "./CatalogCard";

const TITLES: Record<Persona, string> = {
  creators: "Claude Skills & MCP Servers for Content Creators: Video, Images, Motion",
  "vibe-coders": "MCP Servers, Skills, SDKs & CLIs for Vibe Coders",
  founders: "Claude Skills, Kits & Guides for Founders",
};

export function personaMetadata(persona: Persona) {
  return buildMetadata({
    title: TITLES[persona],
    description: PERSONA_META[persona].blurb,
    path: PERSONA_META[persona].path,
  });
}

function orderPicks(list: CatalogItem[]) {
  return [...list].sort(
    (a, b) =>
      Number(a.status === "coming-soon") - Number(b.status === "coming-soon") ||
      Number(!!b.trending) - Number(!!a.trending),
  );
}

export default function PersonaHub({ persona }: { persona: Persona }) {
  const meta = PERSONA_META[persona];
  const picks = itemsForPersona(persona);
  const packs = picks.filter((i) => i.type === "pack");
  const starter = packs.find((p) => p.tier !== "paid");
  const pro = packs.find((p) => p.tier === "paid");
  const singles = picks.filter((i) => i.type !== "pack");

  const groups = meta.jobs
    .map((job) => ({
      ...job,
      items: orderPicks(singles.filter((i) => i.jobs[persona] === job.key)),
    }))
    .filter((g) => g.items.length);

  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          name: TITLES[persona],
          description: meta.blurb,
          path: meta.path,
          items: picks.map((i) => ({ name: i.name, path: itemPath(i) })),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: meta.label, path: meta.path },
        ])}
      />
      <JsonLd data={faqJsonLd(meta.faq)} />

      {/* Hero */}
      <section className="relative overflow-hidden pt-14 pb-20 sm:pt-20">
        <PixelSteps cells={[[0, 0], [1, 1, 2]]} className="absolute right-0 top-8 hidden sm:block" />
        <PixelSteps cells={[[0, 0], [1, 1], [2, 2, 2], [4, 3]]} className="absolute -left-2 bottom-4 hidden lg:block" unit="clamp(14px,2.4vw,40px)" />
        <Container>
          <p className="font-mono text-[13px] text-ink-3">
            <span aria-hidden className="emoji mr-1.5">{meta.emoji}</span>For {meta.label.toLowerCase()}
          </p>
          <h1 className="mt-4 font-display text-[clamp(52px,10vw,136px)] font-bold leading-[0.9] tracking-[-0.05em] text-display">
            {meta.short}
          </h1>
          <p className="mt-2 font-alt text-[clamp(30px,4.6vw,64px)] leading-[1.05] text-ink">
            {meta.tagline}
          </p>
          <p className="mt-8 max-w-[58ch] text-[clamp(17px,1.6vw,20px)] leading-[1.55] text-ink-2">
            {meta.blurb}
          </p>
          <nav aria-label="Jump to" className="mt-10 grid max-w-[720px] grid-cols-1 gap-x-5 sm:grid-cols-2">
            {groups.map((g) => (
              <a key={g.key} href={`#${g.key}`} className="rule-row">
                <span className="sq-bullet" />
                {g.label}
                <span className="rule-arrow" aria-hidden>→</span>
              </a>
            ))}
            {persona === "founders" && (
              <a href="#founders-corner" className="rule-row">
                <span className="sq-bullet" />
                Kits, guides & products
                <span className="rule-arrow" aria-hidden>→</span>
              </a>
            )}
          </nav>
        </Container>
      </section>

      {/* Starter pack band */}
      {starter && (
        <section className="relative overflow-hidden bg-pop py-16 text-pop-ink sm:py-20">
          <PixelSteps cells={[[0, 0], [1, 1], [2, 2]]} tone="paper" className="absolute right-0 top-0" unit="clamp(20px,3.4vw,52px)" />
          <Container>
            <p className="font-mono text-[13px] font-medium uppercase tracking-[0.1em]">Start here</p>
            <h2 className="mt-3 max-w-[18ch] font-display text-[clamp(34px,5vw,64px)] font-bold leading-[1] tracking-[-0.04em]">
              {starter.name}
            </h2>
            <p className="mt-4 max-w-[52ch] text-[18px] leading-[1.55]">{starter.description}</p>
            <Link
              href={itemPath(starter)}
              className="mt-8 inline-flex items-center gap-3 border-b-[2px] border-current pb-1.5 text-[18px] font-semibold text-pop-ink no-underline"
            >
              <span className="sq-bullet" />
              {starter.status === "coming-soon" ? "Get it when it ships" : "Install the pack"}
              <span aria-hidden>→</span>
            </Link>
          </Container>
        </section>
      )}

      {/* Picks by job */}
      {groups.map((g, gi) => (
        <section
          key={g.key}
          id={g.key}
          aria-labelledby={`${g.key}-h`}
          className={gi % 2 === 0 ? "py-20" : "bg-tint py-20"}
        >
          <Container>
            <PixelHeading id={`${g.key}-h`} className="text-[clamp(34px,4.6vw,60px)]">
              {g.label}
            </PixelHeading>
            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((item, i) => (
                <CatalogCard key={item.slug} item={item} artIndex={i} />
              ))}
            </div>
          </Container>
        </section>
      ))}

      {/* Founders: the existing kits, guides, tools and products */}
      {persona === "founders" && (
        <section id="founders-corner" aria-labelledby="corner-h" className="py-20">
          <Container>
            <PixelHeading id="corner-h" className="text-[clamp(34px,4.6vw,60px)]">
              Kits, guides & products
            </PixelHeading>
            <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
              {[
                { label: "Kits", href: "/kits/", items: kits },
                { label: "Guides", href: "/guides/", items: guides },
                { label: "Tools", href: "/tools/", items: tools },
                { label: "Products", href: "/products/", items: products },
              ].map((col) => (
                <div key={col.label} className="min-w-0">
                  <h3 className="flex items-baseline justify-between font-display text-[22px] font-bold">
                    {col.label}
                    <Link href={col.href} className="text-[14px] font-medium text-ember underline underline-offset-4">
                      All {col.items.length}
                    </Link>
                  </h3>
                  <ul className="m-0 mt-2 list-none p-0">
                    {col.items.slice(0, 4).map((it) => (
                      <li key={it.slug}>
                        <Link href={it.href} className="rule-row">
                          <span className="sq-bullet" />
                          <span className="min-w-0 truncate">{it.title}</span>
                          <span className="rule-arrow" aria-hidden>→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Paid pack */}
      {pro && (
        <section className="py-20" aria-labelledby="pro-h">
          <Container>
            <div className="grid items-center gap-10 r-vibe-lg border-[1.5px] border-ink p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-ink-3">Paid · coming soon</p>
                <h2 id="pro-h" className="mt-3 font-display text-[clamp(30px,4vw,48px)] font-bold leading-[1.02] tracking-[-0.04em]">
                  {pro.name}
                </h2>
                <p className="mt-4 max-w-[52ch] text-[17px] leading-[1.6] text-ink-2">{pro.description}</p>
                <Link
                  href={itemPath(pro)}
                  className="mt-6 inline-flex items-center gap-3 border-b-[2px] border-current pb-1 text-[17px] font-semibold text-ink no-underline hover:text-ember"
                >
                  <span className="sq-bullet" />
                  Get the launch price
                  <span aria-hidden>→</span>
                </Link>
              </div>
              <div className="flex justify-center">
                <PixelSteps cells={[[0, 0], [2, 0], [1, 1], [0, 2], [2, 2], [3, 3]]} unit="clamp(22px,4vw,48px)" />
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-tint py-20" aria-labelledby="faq-h">
        <Container size="narrow">
          <PixelHeading id="faq-h" className="text-[clamp(34px,4.6vw,56px)]">
            FAQ
          </PixelHeading>
          <dl className="mt-10">
            {meta.faq.map((f) => (
              <div key={f.q} className="border-b-[1.5px] border-ink py-6">
                <dt className="text-[19px] font-semibold text-ink">{f.q}</dt>
                <dd className="m-0 mt-2 text-[16px] leading-[1.65] text-ink-2">{f.a}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12 flex flex-wrap gap-3">
            {PERSONA_ORDER.filter((p) => p !== persona).map((p) => (
              <Link
                key={p}
                href={PERSONA_META[p].path}
                className="r-pill border-[1.5px] border-ink px-4 py-2 text-[15px] font-medium text-ink no-underline transition-colors hover:bg-ink hover:text-paper"
              >
                Also: {PERSONA_META[p].label} →
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
