"use client";

import { useMemo, useState } from "react";
import {
  PERSONA_META,
  PERSONA_ORDER,
  TYPE_META,
  TYPE_ORDER,
  type CatalogItem,
} from "@/content/catalog";
import CatalogCard from "./CatalogCard";

type FilterBy = "type" | "persona";

/**
 * Ruled two-column filter list (the reference's Projects filter) above a
 * card grid. Filters are plain state; the full list is in the static HTML.
 */
export default function CatalogBrowser({
  items,
  filterBy = "type",
  limit,
  idPrefix = "drops",
}: {
  items: CatalogItem[];
  filterBy?: FilterBy;
  limit?: number;
  idPrefix?: string;
}) {
  const [active, setActive] = useState<string>("all");

  const options = useMemo(() => {
    const keys =
      filterBy === "type"
        ? TYPE_ORDER.filter((t) => items.some((i) => i.type === t))
        : PERSONA_ORDER.filter((p) => items.some((i) => i.personas.includes(p)));
    return [
      { key: "all", label: "All", count: items.length },
      ...keys.map((k) => ({
        key: k,
        label:
          filterBy === "type"
            ? TYPE_META[k as keyof typeof TYPE_META].label
            : PERSONA_META[k as keyof typeof PERSONA_META].label,
        count: items.filter((i) =>
          filterBy === "type" ? i.type === k : i.personas.includes(k as never),
        ).length,
      })),
    ];
  }, [items, filterBy]);

  const shown = useMemo(() => {
    const list =
      active === "all"
        ? items
        : items.filter((i) =>
            filterBy === "type" ? i.type === active : i.personas.includes(active as never),
          );
    return limit ? list.slice(0, limit) : list;
  }, [items, active, filterBy, limit]);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter"
        className="grid grid-cols-1 gap-x-5 sm:grid-cols-2"
      >
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            aria-pressed={active === o.key}
            aria-controls={`${idPrefix}-grid`}
            onClick={() => setActive(o.key)}
            className="rule-row w-full cursor-pointer bg-transparent text-left"
          >
            <span className="sq-bullet" />
            <span>{o.label}</span>
            <span className="ml-auto font-mono text-[12px] text-ink-4">{o.count}</span>
          </button>
        ))}
      </div>

      <div
        id={`${idPrefix}-grid`}
        aria-live="polite"
        className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        {shown.map((item, i) => (
          <CatalogCard key={`${item.type}-${item.slug}`} item={item} artIndex={i} />
        ))}
      </div>
      {shown.length === 0 && (
        <p className="mt-10 text-ink-3">Nothing here yet. Try another filter.</p>
      )}
    </div>
  );
}
