"use client";

import { useEffect, useState } from "react";
import { useVibe } from "@/components/vibe/useVibe";
import { cn } from "@/lib/cn";

type Line = readonly [top: string, bottom: string, emoji: string];

/** Hero headlines that rotate, one list per vibe. Keep each top line about as
 *  long as "Free AI add-ons" so the hero never reflows. */
const LINES: Record<"bruh" | "baddie", readonly Line[]> = {
  bruh: [
    ["Free AI add\u2011ons", "for creators", "✌️"],
    ["One command,", "zero fluff", "🙌"],
    ["Skills, plugins,", "MCP & CLIs", "🧠"],
    ["Your agent,", "levelled up", "🆙"],
    ["By creators,", "for creators", "🤝"],
    ["Tested picks,", "no hype", "🧪"],
  ],
  baddie: [
    ["Your agent,", "but iconic", "💅"],
    ["Tools that", "actually slay", "✨"],
    ["No gatekeeping,", "just drops", "🎀"],
    ["Main character", "energy only", "💖"],
    ["Copy, paste,", "serve", "💋"],
    ["Low effort,", "high glow", "🌸"],
  ],
};

const HOLD_MS = 2000;

/**
 * Visual-only rotating headline. The real <h1> text lives in a sibling
 * `sr-only` span so crawlers and screen readers get one stable heading.
 * Every line is stacked in one grid cell, so the box is always as tall as the
 * tallest line: no layout shift. The outgoing line slides up while the next
 * rises in. Pauses on a hidden tab and the pause button, and never auto-plays
 * under prefers-reduced-motion.
 */
export default function HeroCycler({
  className,
  heading = "Free AI add-ons for creators",
}: {
  className?: string;
  /** The stable, crawlable headline. */
  heading?: string;
}) {
  const vibe = useVibe();
  const lines = LINES[vibe];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const running = !paused && !reduced;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => i + 1);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [running]);

  const active = index % lines.length;
  const leaving = index > 0 ? (index - 1) % lines.length : -1;

  return (
    <>
      <h1 className={className}>
        <span className="sr-only">{heading}</span>
        <span
          aria-hidden
          className="vibe-text hero-cycler grid"
        >
          {lines.map(([top, bottom, emoji], i) => (
            <span
              key={`${vibe}-${i}`}
              data-state={i === active ? "in" : i === leaving ? "out" : undefined}
              className="hero-cycler__item [grid-area:1/1]"
            >
              <span className="hero-cycler__top block font-display text-[clamp(40px,10.2vw,140px)] font-bold leading-[0.88] tracking-[-0.055em]">
                {top}
              </span>
              <span className="hero-cycler__bottom mt-[0.12em] block pl-[8%] sm:pl-[12%] font-alt text-[clamp(36px,9.4vw,132px)] leading-[0.95]">
                {bottom}{" "}
                <span className="emoji align-[0.08em] text-[0.72em]">{emoji}</span>
              </span>
            </span>
          ))}
        </span>
      </h1>
      {!reduced && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={
            paused ? "Play headline rotation" : "Pause headline rotation"
          }
          className={cn(
            "mt-5 inline-flex items-center gap-2 font-mono text-[12px] text-ink-3 hover:text-ember",
            "focus-visible:outline-2 focus-visible:outline-offset-4",
          )}
        >
          <span aria-hidden className="sq-bullet text-[10px]" />
          {paused ? "Play" : "Pause"}
          <span className="tabular-nums">
            {String(active + 1).padStart(2, "0")}/
            {String(lines.length).padStart(2, "0")}
          </span>
        </button>
      )}
    </>
  );
}
