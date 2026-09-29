"use client";

import { useEffect, useState } from "react";

// Prev/next buttons for a horizontal rail identified by `railId`.
export default function RailArrows({ railId, label }: { railId: string; label: string }) {
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const rail = document.getElementById(railId);
    if (!rail) return;
    const update = () => {
      setAtStart(rail.scrollLeft <= 4);
      setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4);
    };
    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [railId]);

  const go = (dir: number) => {
    const rail = document.getElementById(railId);
    rail?.scrollBy({ left: dir * rail.clientWidth * 0.85, behavior: "smooth" });
  };

  const btn =
    "grid place-items-center w-[38px] h-[38px] rounded-full border border-line bg-paper text-ink transition-colors enabled:hover:border-ink disabled:opacity-35 disabled:cursor-default";

  return (
    <div className="hidden sm:flex items-center gap-2">
      <button type="button" className={btn} onClick={() => go(-1)} disabled={atStart} aria-label={`Scroll ${label} left`}>
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button type="button" className={btn} onClick={() => go(1)} disabled={atEnd} aria-label={`Scroll ${label} right`}>
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
