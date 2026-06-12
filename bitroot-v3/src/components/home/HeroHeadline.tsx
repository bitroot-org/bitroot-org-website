"use client";

import { useEffect, useState } from "react";

const variants: {
  before: string;
  em: string;
  after: string;
  afterBreak?: string;
}[] = [
  { before: "Everything a", em: "founder", after: "needs." },
  { before: "Open source,", em: "from day one", after: "." },
  { before: "A", em: "community", after: "that builds with you." },
  { before: "", em: "Free", after: "to start.", afterBreak: "Forever." },
];

const INTERVAL_MS = 3500;

function Slogan({ v }: { v: (typeof variants)[number] }) {
  return (
    <>
      {v.before}{" "}
      <span className="serif-em">{v.em}</span>
      {v.after.startsWith(".") ? v.after : ` ${v.after}`}
      {v.afterBreak && (
        <>
          <br />
          {v.afterBreak}
        </>
      )}
    </>
  );
}

export default function HeroHeadline() {
  const [i, setI] = useState(0);

  useEffect(() => {
    let id: number | null = null;
    const start = () => {
      if (id === null) {
        id = window.setInterval(
          () => setI((n) => (n + 1) % variants.length),
          INTERVAL_MS,
        );
      }
    };
    const stop = () => {
      if (id !== null) {
        window.clearInterval(id);
        id = null;
      }
    };
    // Pause the rotation while the tab is hidden — no point burning timers
    // (and re-renders) on a page nobody can see.
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, []);

  return (
    // Grid-stack every variant invisibly so the h1 always reserves the height
    // of the tallest slogan (the last one wraps to two lines) — otherwise each
    // rotation shifted everything below the hero (CLS).
    <h1 className="font-sans text-[clamp(44px,6vw,72px)] font-semibold tracking-[-0.035em] leading-[1.02] text-balance mt-3 grid">
      {variants.map((v, n) => (
        <span
          key={n}
          aria-hidden
          className="invisible col-start-1 row-start-1"
        >
          <Slogan v={v} />
        </span>
      ))}
      <span key={`active-${i}`} className="word-swap col-start-1 row-start-1">
        <Slogan v={variants[i]} />
      </span>
    </h1>
  );
}
