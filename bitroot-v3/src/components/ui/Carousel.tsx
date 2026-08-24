"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type CarouselProps = {
  children: ReactNode;
  ariaLabel: string;
  slideClassName?: string;
  className?: string;
};

export default function Carousel({
  children,
  ariaLabel,
  slideClassName,
  className,
}: CarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const page = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  const slides = Children.toArray(children);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scrollerRef}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        className={cn(
          "flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className={cn("snap-start shrink-0", slideClassName)}
          >
            {slide}
          </div>
        ))}
      </div>

      <div className="hidden md:flex absolute -top-12 right-0 items-center gap-2">
        <button
          type="button"
          onClick={() => page(-1)}
          disabled={atStart}
          aria-label="Previous"
          className={cn(
            "hover-lift h-9 w-9 inline-flex items-center justify-center rounded-full border bg-paper transition-all",
            atStart
              ? "border-line/60 text-ink-4 cursor-not-allowed"
              : "border-line text-ink-2 hover:border-ink-3 hover:text-ink",
          )}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M13 8H3m0 0l4-4m-4 4l4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => page(1)}
          disabled={atEnd}
          aria-label="Next"
          className={cn(
            "hover-lift h-9 w-9 inline-flex items-center justify-center rounded-full border bg-paper transition-all",
            atEnd
              ? "border-line/60 text-ink-4 cursor-not-allowed"
              : "border-line text-ink-2 hover:border-ink-3 hover:text-ink",
          )}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10m0 0l-4-4m4 4l-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
