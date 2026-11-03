"use client";

import { cn } from "@/lib/cn";
import { setVibe, VIBE_LABELS, type Vibe } from "@/lib/vibe";
import { useVibe } from "./useVibe";

const VIBES: Vibe[] = ["bruh", "baddie"];

/** Two-way "Bruh | Baddie" switch. Re-skins the whole site in one click. */
export default function VibeToggle({
  location = "navbar",
  className,
  round = false,
}: {
  location?: string;
  className?: string;
  /** Force capsule corners (e.g. inside the pill navbar) in every vibe. */
  round?: boolean;
}) {
  const vibe = useVibe();
  return (
    <div
      role="group"
      aria-label="Site vibe"
      className={cn(
        "relative inline-flex items-center border-[1.5px] border-ink bg-paper p-[3px]",
        round ? "rounded-full" : "r-pill",
        className,
      )}
    >
      {VIBES.map((v) => {
        const on = v === vibe;
        return (
          <button
            key={v}
            type="button"
            aria-pressed={on}
            onClick={() => setVibe(v, location)}
            className={cn(
              "relative h-8 px-3.5 text-[13px] font-semibold leading-none transition-colors duration-200",
              round ? "rounded-full" : "r-pill",
              on ? "bg-ink text-paper" : "text-ink hover:bg-ink/[0.07]",
            )}
          >
            <span className={cn(v === "baddie" ? "font-serif italic text-[15px] font-normal" : "font-pixel text-[13px]")}>
              {VIBE_LABELS[v]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
