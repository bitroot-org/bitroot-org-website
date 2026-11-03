import Link from "next/link";
import Container from "@/components/ui/Container";
import PixelHeading from "@/components/ui/PixelHeading";
import VibeText from "@/components/vibe/VibeText";
import CatalogBrowser from "@/components/catalog/CatalogBrowser";
import { catalog } from "@/content/catalog";

/** Fresh drops: the catalog with type filters (the reference's Projects). */
export default function GzDrops() {
  const items = [...catalog].sort(
    (a, b) =>
      Number(a.status === "coming-soon") - Number(b.status === "coming-soon") ||
      Number(!!b.trending) - Number(!!a.trending),
  );
  return (
    <section id="drops" aria-labelledby="drops-h" className="scroll-mt-20 bg-tint py-[clamp(80px,10vw,140px)]">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <PixelHeading id="drops-h">
            <VibeText bruh="Fresh drops" baddie="It girls" /> <span aria-hidden className="emoji">🔥</span>
          </PixelHeading>
          <p className="m-0 max-w-[40ch] text-[16px] leading-[1.55] text-ink-2">
            Every pick has its install command and a link to the source. Our own builds are marked By Bitroot. No gatekeeping <span aria-hidden>🤝</span>
          </p>
        </div>
        <div className="mt-12">
          <CatalogBrowser items={items} filterBy="type" limit={9} idPrefix="home-drops" />
        </div>
        <div className="mt-14 flex flex-wrap gap-3">
          <Link href="/skills/" className="r-pill bg-ink px-5 py-3 text-[15px] font-semibold text-paper no-underline">
            All skills →
          </Link>
          <Link href="/mcp/" className="r-pill border-[1.5px] border-ink px-5 py-[10px] text-[15px] font-semibold text-ink no-underline hover:bg-ink hover:text-paper">
            All MCP servers →
          </Link>
          <Link href="/packs/" className="r-pill border-[1.5px] border-ink px-5 py-[10px] text-[15px] font-semibold text-ink no-underline hover:bg-ink hover:text-paper">
            Packs →
          </Link>
        </div>
      </Container>
    </section>
  );
}
