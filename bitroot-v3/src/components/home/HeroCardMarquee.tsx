"use client";

import Link from "next/link";
import { OfferingChip, offerings, type OfferingType } from "./OfferingPill";

type Row = { type: OfferingType; href: string }[];

const topRow: Row = [
  { type: "product", href: "/products" },
  { type: "guide",   href: "/guides" },
  { type: "blog",    href: "/newsletter" },
];

const bottomRow: Row = [
  { type: "repo",       href: "/kits" },
  { type: "kit",        href: "/kits" },
  { type: "newsletter", href: "/newsletter" },
];

function Track({ items, reverse }: { items: Row; reverse?: boolean }) {
  // Triple the list so it always fills the viewport and loops seamlessly.
  const list = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden -mx-5">
      <ul
        className="marquee-track flex items-center gap-3 whitespace-nowrap will-change-transform px-5"
        style={{
          animationDuration: "26s",
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {list.map((slot, i) => (
          <li key={`${slot.type}-${i}`} className="shrink-0">
            <Link
              href={slot.href}
              className="block rounded-full"
              style={{
                boxShadow: `0 8px 18px -10px ${offerings[slot.type].glow}`,
              }}
            >
              <OfferingChip type={slot.type} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HeroCardMarquee() {
  return (
    <div className="md:hidden mt-10 space-y-3" aria-hidden>
      <Track items={topRow} />
      <Track items={bottomRow} reverse />
    </div>
  );
}
