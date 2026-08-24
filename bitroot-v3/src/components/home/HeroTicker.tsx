import Link from "next/link";
import { recentlyUpdated, type Item } from "@/content/data";

const categoryLabel: Record<Item["category"], string> = {
  kit: "new kit",
  guide: "fresh guide",
  product: "new app",
  tool: "tool",
};

export default function HeroTicker() {
  const items = recentlyUpdated(10);
  if (items.length === 0) return null;

  // Duplicate the list once — the marquee keyframe translates -50%, so the
  // second copy seamlessly takes over when the first scrolls off.
  const track = [...items, ...items];

  return (
    <section
      aria-label="Recently updated"
      className="relative bg-ember text-paper overflow-hidden"
    >
      <div className="relative flex items-center">
        <span className="hidden md:inline-flex shrink-0 items-center gap-2 pl-5 pr-4 py-3 bg-[#3f48c7] text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-paper">
          <span
            className="inline-block size-1.5 rounded-full bg-live pulse-live"
            aria-hidden
          />
          live feed
        </span>

        <div className="relative flex-1 overflow-hidden">
          <ul
            className="marquee-track flex items-center gap-8 py-3 whitespace-nowrap will-change-transform"
            style={{ animationDuration: "10s" }}
          >
            {track.map((item, i) => (
              <li key={`${item.slug}-${i}`} className="flex items-center gap-3">
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-2.5"
                >
                  <span className="text-[10.5px] font-mono font-semibold uppercase tracking-[0.18em] text-paper/70 group-hover:text-paper transition-colors">
                    {categoryLabel[item.category]}
                  </span>
                  <span className="text-[13px] text-paper group-hover:underline underline-offset-4 decoration-paper/60">
                    {item.title}
                  </span>
                  <span className="text-paper/60 text-[12px]" aria-hidden>↗</span>
                </Link>
                <span className="text-paper/35" aria-hidden>·</span>
              </li>
            ))}
          </ul>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-ember to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-ember to-transparent" />
        </div>
      </div>
    </section>
  );
}
