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

export default function HeroHeadline() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setI((n) => (n + 1) % variants.length),
      INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  const v = variants[i];

  return (
    <h1 className="font-sans text-[clamp(44px,6vw,72px)] font-semibold tracking-[-0.035em] leading-[1.02] text-balance mt-3 min-h-[1.04em]">
      <span key={i} className="word-swap inline-block">
        {v.before}{" "}
        <span className="serif-em">{v.em}</span>
        {v.after.startsWith(".") ? v.after : ` ${v.after}`}
        {v.afterBreak && (
          <>
            <br />
            {v.afterBreak}
          </>
        )}
      </span>
    </h1>
  );
}
