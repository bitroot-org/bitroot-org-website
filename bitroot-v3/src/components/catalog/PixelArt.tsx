import { cn } from "@/lib/cn";

// FNV-1a — stable across server/client, so the art never mismatches.
function hash(input: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Deterministic mirrored pixel pattern per slug (an identicon), used as the
 * catalog card image until items get real demo art. Squares in Bruh,
 * bubbles in Baddie (cells are .px-block).
 */
export default function PixelArt({
  seed,
  label,
  className,
  cols = 10,
  rows = 6,
  dark = false,
  tone,
}: {
  seed: string;
  label?: string;
  className?: string;
  cols?: number;
  rows?: number;
  /** Shorthand for tone="ink". */
  dark?: boolean;
  /** ink: accent pixels on ink · pop: light pixels on accent (like the logo) · tint: accent on tint. */
  tone?: "ink" | "pop" | "tint";
}) {
  const t = tone ?? (dark ? "ink" : "tint");
  const half = Math.ceil(cols / 2);
  const cells: [number, number][] = [];
  let h = hash(seed);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < half; c++) {
      h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d) >>> 0;
      if ((h & 0xff) < 92) {
        cells.push([c, r]);
        if (cols - 1 - c !== c) cells.push([cols - 1 - c, r]);
      }
    }
  }
  return (
    <div
      aria-hidden
      className={cn(
        "relative h-full w-full overflow-hidden",
        t === "ink" ? "bg-ink" : t === "pop" ? "bg-pop" : "bg-tint",
        className,
      )}
    >
      <div className="absolute inset-[12%] flex items-center justify-center">
      <div
        className="grid w-full max-h-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          aspectRatio: `${cols} / ${rows}`,
          gap: "3%",
        }}
      >
        {cells.map(([c, r]) => (
          <span
            key={`${c}-${r}`}
            className="px-block"
            style={{
              gridColumn: c + 1,
              gridRow: r + 1,
              background: t === "pop" ? "var(--vibe-tint)" : undefined,
              animation: "none",
            }}
          />
        ))}
      </div>
      </div>
      {label && (
        <span
          className={cn(
            "absolute bottom-3 right-4 font-alt text-[clamp(28px,4vw,46px)] leading-none",
            t === "ink" ? "text-paper" : "text-ink",
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
