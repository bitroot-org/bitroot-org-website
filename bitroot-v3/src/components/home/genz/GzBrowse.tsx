import Link from "next/link";
import Container from "@/components/ui/Container";
import PixelHeading from "@/components/ui/PixelHeading";
import VibeImage from "@/components/vibe/VibeImage";
import AgentLogos from "@/components/catalog/AgentLogos";
import { itemsOfType, TYPE_META, TYPE_ORDER, worksWithType, type WorksWith } from "@/content/catalog";
import { guides, kits, tools } from "@/content/data";

/** Browse by type: a portrait grid (the reference's team grid) of every shelf. */
export default function GzBrowse() {
  const tiles: { key: string; label: string; emoji: string; href: string; count: number; works?: WorksWith }[] = [
    ...TYPE_ORDER.map((t) => ({
      works: worksWithType(t),
      key: t,
      label: TYPE_META[t].label,
      emoji: TYPE_META[t].emoji,
      href: TYPE_META[t].path,
      count: itemsOfType(t).length,
    })),
    { key: "kits", label: "Kits", emoji: "🧰", href: "/kits/", count: kits.length },
    { key: "guides", label: "Guides", emoji: "📚", href: "/guides/", count: guides.length },
    { key: "tools", label: "Tools", emoji: "🛠️", href: "/tools/", count: tools.length },
  ];
  return (
    <section aria-labelledby="browse-h" className="bg-paper py-[clamp(80px,10vw,140px)]">
      <Container>
        <PixelHeading id="browse-h">
          Browse the shelves <span aria-hidden className="emoji">🛒</span>
        </PixelHeading>
        <ul className="m-0 mt-14 grid list-none grid-cols-2 gap-x-6 gap-y-10 p-0 sm:grid-cols-4">
          {tiles.map((t) => (
            <li key={t.key}>
              <Link href={t.href} className="group block text-center text-inherit no-underline vibe-wobble">
                <div className="grain relative aspect-square overflow-hidden bg-ink r-vibe-lg">
                  <VibeImage
                    src={`/genz/shelves/${t.key}`}
                    alt=""
                    sizes="(min-width: 640px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <span aria-hidden className="px-block px-block--paper absolute right-0 top-0 z-[3] size-[16%]" />
                  <span aria-hidden className="px-block px-block--paper absolute right-[16%] top-[16%] z-[3] size-[12%]" />
                  <span
                    aria-hidden
                    className="absolute bottom-3 left-3 z-[3] grid size-12 place-items-center rounded-full bg-paper text-[24px] shadow-[0_6px_20px_-8px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
                  >
                    <span className="emoji">{t.emoji}</span>
                  </span>
                </div>
                <h3 className="m-0 mt-4 font-display text-[20px] font-bold tracking-[-0.02em] text-ink group-hover:text-ember">
                  {t.label}
                </h3>
                <p className="m-0 mt-1 text-[14px] text-ink-3">{t.count} {t.count === 1 ? "pick" : "picks"}</p>
                {t.works && <AgentLogos works={t.works} className="mt-3 justify-center" />}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
