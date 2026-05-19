"use client";

import { useState } from "react";

type Variant = "dark" | "ember";

const styles: Record<Variant, string> = {
  dark:
    "border-white/10 bg-white/5 backdrop-blur-sm text-[#a8a299] hover:bg-white/10 hover:text-white opacity-0 group-hover:opacity-100",
  ember:
    "border-ember-line bg-paper/80 text-ember hover:bg-ember hover:text-paper",
};

export default function CopyButton({
  text,
  variant = "dark",
  label = "Copy",
}: {
  text: string;
  variant?: Variant;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className={`absolute top-3 right-3 transition-all px-2.5 py-1 rounded-md border text-[10px] font-mono ${styles[variant]}`}
      aria-label={label}
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}
