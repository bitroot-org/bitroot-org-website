import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/JsonLd";
import PixelHeading from "@/components/ui/PixelHeading";
import { cn } from "@/lib/cn";
import {
  breadcrumbJsonLd,
  buildMetadata,
  softwareApplicationJsonLd,
} from "@/lib/seo";
import {
  AGENT_LABELS,
  catalog,
  catalogBySlug,
  findCatalogItem,
  itemPath,
  itemsOfType,
  PERSONA_META,
  TIER_LABELS,
  TYPE_META,
  typeBadge,
  type CatalogItem,
  type CatalogType,
} from "@/content/catalog";
import PixelArt from "./PixelArt";
import InstallBox from "./InstallBox";
import NotifyForm from "./NotifyForm";
import CatalogCard from "./CatalogCard";

type Params = { params: Promise<{ slug: string }> };

/** Route helpers so /skills, /plugins, /mcp, /cli and /packs share one template. */
export function itemStaticParams(type: CatalogType) {
  return itemsOfType(type).map((i) => ({ slug: i.slug }));
}

export async function itemMetadata(type: CatalogType, { params }: Params) {
  const { slug } = await params;
  const item = findCatalogItem(type, slug);
  if (!item) return {};
  const soon = item.status === "coming-soon" ? " (coming soon)" : "";
  return buildMetadata({
    title: `${item.name}${soon}: ${TYPE_META[type].singular} for ${item.personas
      .map((p) => PERSONA_META[p].short)
      .join(", ")}`,
    description: `${item.summary} ${item.description}`.slice(0, 300),
    path: itemPath(item),
  });
}

function related(item: CatalogItem) {
  const inPack = (item.packItems ?? [])
    .map((s) => catalogBySlug(s))
    .filter((i): i is CatalogItem => !!i);
  if (inPack.length) return { title: "What's inside", items: inPack };
  const packs = catalog.filter((i) => i.packItems?.includes(item.slug));
  const peers = catalog.filter(
    (i) =>
      i.slug !== item.slug &&
      i.type !== "pack" &&
      i.personas.some((p) => item.personas.includes(p)),
  );
  // Same job group first, then live picks before coming-soon ones.
  const job = item.jobs[item.personas[0]];
  peers.sort(
    (a, b) =>
      Number(b.jobs[item.personas[0]] === job) - Number(a.jobs[item.personas[0]] === job) ||
      Number(a.status === "coming-soon") - Number(b.status === "coming-soon"),
  );
  return { title: "Works well with", items: [...packs, ...peers].slice(0, 3) };
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 border-b-[1.5px] border-ink/15 py-3.5 text-[15px] last:border-b-0">
      <dt className="flex items-center gap-2.5 text-ink-3">
        <span className="sq-bullet text-pop" />
        {label}
      </dt>
      <dd className="m-0 min-w-0 break-words text-ink">{children}</dd>
    </div>
  );
}

export async function ItemDetailPage({ type, params }: { type: CatalogType } & Params) {
  const { slug } = await params;
  const item = findCatalogItem(type, slug);
  if (!item) notFound();

  const meta = TYPE_META[type];
  const soon = item.status === "coming-soon";
  const rel = related(item);
  const path = itemPath(item);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: meta.label, path: meta.path },
          { name: item.name, path },
        ])}
      />
      {item.tier !== "paid" && !soon && (
        <JsonLd
          data={softwareApplicationJsonLd({
            name: item.name,
            description: item.summary,
            path,
            category: "DeveloperApplication",
          })}
        />
      )}

      <Container className="pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="font-mono text-[12px] text-ink-4">
          <Link href="/" className="hover:text-ember">Home</Link>
          <span className="mx-2">/</span>
          <Link href={meta.path} className="hover:text-ember">{meta.label}</Link>
          <span className="mx-2">/</span>
          <span className="text-ink-3">{item.name}</span>
        </nav>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="r-pill bg-tab px-3 py-1 text-[13px] font-semibold text-[var(--vibe-ink)]">
                {typeBadge(item)}
              </span>
              <span className="r-pill border-[1.5px] border-ink px-3 py-[3px] text-[13px] font-medium text-ink">
                {TIER_LABELS[item.tier]}
              </span>
              {item.builtByBitroot ? (
                <span className="r-pill bg-ink px-3 py-1 text-[13px] font-medium text-paper">Built by Bitroot</span>
              ) : (
                <span className="r-pill border-[1.5px] border-ink/25 px-3 py-[3px] text-[13px] text-ink-2">
                  Picked by Bitroot
                </span>
              )}
              {soon && (
                <span className="r-pill bg-pop px-3 py-1 text-[13px] font-semibold text-pop-ink">Coming soon <span aria-hidden className="emoji">⏳</span></span>
              )}
            </div>
            <h1 className="mt-5 font-display text-[clamp(44px,7vw,92px)] font-bold leading-[0.95] tracking-[-0.045em] text-display">
              {item.name}
            </h1>
            <p className="mt-5 max-w-[30ch] text-[clamp(20px,2.2vw,26px)] font-medium leading-[1.3] text-ink">
              {item.summary}
            </p>
            <p className="mt-3 text-[14px] text-ink-3">
              For{" "}
              {item.personas.map((p, i) => (
                <span key={p}>
                  {i > 0 && (i === item.personas.length - 1 ? " and " : ", ")}
                  <Link href={PERSONA_META[p].path} className="text-ink underline underline-offset-4 hover:text-ember">
                    {PERSONA_META[p].label}
                  </Link>
                </span>
              ))}
              {" "}· by {item.author}
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden r-vibe-lg">
            <span className="card-tab">{typeBadge(item)}</span>
            <PixelArt seed={item.slug} dark />
          </div>
        </div>

        {/* Install */}
        <section aria-labelledby="install" className="mt-14 max-w-[820px]">
          <h2 id="install" className="font-display text-[26px] font-bold tracking-[-0.03em]">
            {soon ? "Get it when it ships" : "Install"}
          </h2>
          <div className="mt-4">
            {soon ? (
              <>
                <p className="mb-4 mt-0 max-w-[60ch] text-[16px] leading-[1.6] text-ink-2">
                  We&apos;re building this now. Leave your email and you&apos;ll get it the day it ships
                  {item.tier === "paid" ? ", with the launch price" : ", free"}.
                </p>
                <NotifyForm slug={item.slug} name={item.name} />
              </>
            ) : item.install.length ? (
              <>
                <InstallBox steps={item.install} item={item} />
                {item.installSource && (
                  <p className="mt-3 text-[13px] text-ink-3">
                    Command from the author&apos;s docs:{" "}
                    <a href={item.installSource} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-ember">
                      {new URL(item.installSource).hostname}
                    </a>
                    . Check it there if it fails.
                  </p>
                )}
              </>
            ) : (
              <a
                href={item.source}
                target="_blank"
                rel="noreferrer"
                className="rule-row max-w-[480px]"
              >
                <span className="sq-bullet" />
                Install steps in the author&apos;s docs
                <span className="rule-arrow" aria-hidden>→</span>
              </a>
            )}
          </div>
        </section>

        {/* About + check */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <section aria-labelledby="what">
            <h2 id="what" className="font-display text-[26px] font-bold tracking-[-0.03em]">What it does</h2>
            <p className="mt-3 max-w-[62ch] text-[17px] leading-[1.7] text-ink-2">{item.description}</p>
            {item.whenNot && (
              <div className="mt-6 border-l-[5px] border-pop pl-5">
                <h3 className="text-[18px] font-semibold">When not to use it</h3>
                <p className="mt-1.5 max-w-[60ch] text-[16px] leading-[1.65] text-ink-2">{item.whenNot}</p>
              </div>
            )}
          </section>
          <section aria-labelledby="check">
            <h2 id="check" className="font-display text-[26px] font-bold tracking-[-0.03em]">The Bitroot check</h2>
            <dl className="mt-3">
              <Row label="Tested">
                {item.checkedAt ? (
                  item.checkedAt
                ) : (
                  <span className="text-ink-3">Not yet. Our hands-on check is pending.</span>
                )}
              </Row>
              <Row label="Works in">
                {item.agents.map((a) => AGENT_LABELS[a]).join(", ")}
              </Row>
              <Row label="Made by">{item.author}</Row>
              {item.license && <Row label="Licence">{item.license}</Row>}
              {!item.builtByBitroot && (
                <Row label="Source">
                  <a href={item.source} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-ember">
                    {item.source.replace(/^https?:\/\//, "")}
                  </a>
                </Row>
              )}
            </dl>
          </section>
        </div>
      </Container>

      {rel.items.length > 0 && (
        <section className="mt-24 bg-tint py-20" aria-labelledby="related">
          <Container>
            <PixelHeading id="related" className="text-[clamp(34px,4.6vw,56px)]">
              {rel.title}
            </PixelHeading>
            <div className={cn("mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3")}>
              {rel.items.map((r, i) => (
                <CatalogCard key={r.slug} item={r} artIndex={i} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
