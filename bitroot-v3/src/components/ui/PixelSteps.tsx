import { cn } from "@/lib/cn";

/** [col, row, width?] in grid units. */
export type PixelCell = [number, number, number?];

/**
 * Decorative pixel staircase (the reference's stepped green squares).
 * Cells are `.px-block`s, so they turn into bubbles/pills in the Baddie vibe.
 */
export default function PixelSteps({
  cells,
  unit = "clamp(16px, 3.4vw, 56px)",
  tone = "pop",
  className,
  style,
}: {
  cells: PixelCell[];
  unit?: string;
  tone?: "pop" | "paper" | "tab";
  className?: string;
  style?: React.CSSProperties;
}) {
  const cols = Math.max(...cells.map(([c, , w = 1]) => c + w));
  const rows = Math.max(...cells.map(([, r]) => r + 1));
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none", /\b(absolute|fixed|sticky)\b/.test(className ?? "") ? "" : "relative", className)}
      style={{
        ["--u" as string]: unit,
        width: `calc(var(--u) * ${cols})`,
        height: `calc(var(--u) * ${rows})`,
        ...style,
      }}
    >
      {cells.map(([c, r, w = 1], i) => (
        <span
          key={i}
          className={cn(
            "px-block absolute",
            tone === "paper" && "px-block--paper",
            tone === "tab" && "px-block--tab",
          )}
          style={{
            left: `calc(var(--u) * ${c})`,
            top: `calc(var(--u) * ${r})`,
            width: `calc(var(--u) * ${w})`,
            height: "var(--u)",
            animationDelay: `${i * 0.35}s`,
          }}
        />
      ))}
    </div>
  );
}
