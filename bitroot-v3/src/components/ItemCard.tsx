import Link from "next/link";
import type { Item } from "@/content/data";
import Tag from "./ui/Tag";
import PriceBadge from "./ui/PriceBadge";

const categoryLabel: Record<Item["category"], string> = {
  kit: "Kit",
  guide: "Guide",
  product: "Product",
  tool: "Tool",
};

export default function ItemCard({
  item,
  size = "default",
}: {
  item: Item;
  size?: "default" | "compact";
}) {
  return (
    <Link
      href={item.href}
      className="repo-card group block rounded-xl border border-line bg-paper p-5 h-full"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.12em] text-ink-4">
          {categoryLabel[item.category]}
        </span>
        <span className="text-[10px] font-mono text-ink-4">
          {item.updatedAt}
        </span>
      </div>

      <h3 className="font-display font-semibold text-[17px] text-ink leading-snug mb-1.5 group-hover:text-ember transition-colors">
        {item.title}
      </h3>

      {size === "default" && (
        <p className="text-[13px] text-ink-3 leading-relaxed mb-4">
          {item.summary}
        </p>
      )}

      {size === "compact" && (
        <p className="text-[12.5px] text-ink-3 leading-relaxed mb-3 line-clamp-2">
          {item.summary}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {item.tags.slice(0, size === "compact" ? 2 : 4).map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
        {item.cost && <PriceBadge cost={item.cost} size="sm" />}
      </div>
    </Link>
  );
}
