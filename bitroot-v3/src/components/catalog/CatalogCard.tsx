import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  itemPath,
  itemsOfType,
  TIER_LABELS,
  typeBadge,
  worksWith,
  type CatalogItem,
} from "@/content/catalog";
import VibeImage from "@/components/vibe/VibeImage";
import AgentLogos from "./AgentLogos";

/**
 * Three poster photos per type. With a grid position, the variant shifts by
 * one per row of 3, so cells next to each other (across or down) never get
 * the same photo. Without one, items of a type take turns.
 */
function cardArt(item: CatalogItem, artIndex?: number) {
  const n =
    artIndex !== undefined
      ? artIndex + Math.floor(artIndex / 3)
      : Math.max(0, itemsOfType(item.type).findIndex((x) => x.slug === item.slug));
  return `/genz/cards/${item.type}-${"abc"[n % 3]}`;
}

/** Catalog tile: tab label + notch over a poster photo, underlined name below. */
export default function CatalogCard({
  item,
  artIndex,
  size = "md",
  className,
}: {
  item: CatalogItem;
  /** Position in the grid, used to keep neighbouring photos different. */
  artIndex?: number;
  size?: "md" | "lg";
  className?: string;
}) {
  const soon = item.status === "coming-soon";
  return (
    <Link
      href={itemPath(item)}
      className={cn("group block min-w-0 text-inherit no-underline vibe-wobble", className)}
    >
      <div
        className={cn(
          "grain relative overflow-hidden bg-ink r-vibe-lg",
          size === "lg" ? "aspect-[16/11]" : "aspect-[4/3]",
        )}
      >
        <VibeImage
          src={cardArt(item, artIndex)}
          alt=""
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        <span className="card-tab">{typeBadge(item)}</span>
        <div className="absolute right-3 top-3 z-[2] flex flex-col items-end gap-1.5">
          {soon && (
            <span className="r-pill bg-ink px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-paper">
              Coming soon <span aria-hidden className="emoji">⏳</span>
            </span>
          )}
          {item.builtByBitroot && (
            <span className="r-pill bg-paper px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink">
              By Bitroot
            </span>
          )}
        </div>
      </div>
      <div className="mt-3.5 flex items-baseline justify-between gap-4">
        <h3
          className={cn(
            "m-0 font-display font-bold tracking-[-0.025em] text-ink underline decoration-[2px] underline-offset-[5px] transition-colors group-hover:text-ember",
            size === "lg" ? "text-[clamp(22px,2.4vw,30px)]" : "text-[21px]",
          )}
        >
          {item.name}
        </h3>
        <span className="shrink-0 text-[14px] text-ink-2">{TIER_LABELS[item.tier]}</span>
      </div>
      <p className="m-0 mt-1.5 line-clamp-2 text-[15px] leading-[1.5] text-ink-3">{item.summary}</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <AgentLogos works={worksWith(item)} />
        <p className="m-0 font-mono text-[12px] text-ink-4">by {item.author}</p>
      </div>
    </Link>
  );
}
