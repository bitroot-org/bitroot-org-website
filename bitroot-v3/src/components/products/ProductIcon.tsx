import type { ProductGlyph } from "@/content/products";

type Props = {
  from: string;
  to: string;
  glyph: ProductGlyph;
  size?: number;
  className?: string;
};

export default function ProductIcon({
  from,
  to,
  glyph,
  size = 88,
  className,
}: Props) {
  const radius = Math.round(size * 0.235);
  const glyphScale = size / 88;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `linear-gradient(155deg, ${from} 0%, ${to} 100%)`,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.55)",
          "inset 0 -1px 0 rgba(0,0,0,0.18)",
          "inset 0 0 0 0.5px rgba(255,255,255,0.18)",
          "0 1px 1px rgba(20,18,42,0.06)",
          "0 6px 14px -6px rgba(20,18,42,0.22)",
          "0 18px 36px -14px rgba(20,18,42,0.30)",
        ].join(", "),
      }}
    >
      {/* top gloss */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.05) 38%, rgba(255,255,255,0) 60%)",
          pointerEvents: "none",
        }}
      />
      {/* bottom seat */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(0,0,0,0.18) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* diagonal sheen */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(125deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 35%)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* glyph */}
      <div
        className="absolute inset-0 grid place-items-center text-white"
        style={{ transform: `scale(${glyphScale})`, transformOrigin: "center" }}
      >
        <Glyph kind={glyph} />
      </div>
    </div>
  );
}

function Glyph({ kind }: { kind: ProductGlyph }) {
  const stroke = "rgba(255,255,255,0.96)";
  const soft = "rgba(255,255,255,0.45)";
  const common = {
    width: 40,
    height: 40,
    viewBox: "0 0 40 40",
    fill: "none" as const,
    style: { filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.18))" },
  };

  switch (kind) {
    case "studio":
      return (
        <svg {...common}>
          {/* palette + spark — a maker studio */}
          <path
            d="M20 6c-8 0-14 5.6-14 12.5 0 4.4 3.2 7.5 7.5 7.5h2.5a2.5 2.5 0 012.5 2.5v.5c0 2.2 1.8 4 4 4 7.7 0 14-5.6 14-12.5C36 11.6 28.8 6 20 6z"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="13" cy="16" r="1.8" fill={stroke} />
          <circle cx="20" cy="12" r="1.8" fill={soft} />
          <circle cx="27" cy="16" r="1.8" fill={stroke} />
          <circle cx="29" cy="23" r="1.8" fill={soft} />
        </svg>
      );
    case "trip":
      return (
        <svg {...common}>
          {/* map pin with horizon line */}
          <path
            d="M20 6c5 0 9 3.8 9 8.6 0 6-9 15.4-9 15.4S11 20.6 11 14.6C11 9.8 15 6 20 6z"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="14.5" r="2.8" stroke={soft} strokeWidth="2" />
          <path
            d="M8 33h24"
            stroke={soft}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2 3"
          />
        </svg>
      );
    case "ascii":
      return (
        <svg {...common}>
          {/* monospace grid of glyphs */}
          {[
            ["#", ".", "#", "."],
            [".", "#", ".", "#"],
            ["#", ".", "#", "."],
            [".", "#", ".", "#"],
          ].map((row, ry) =>
            row.map((char, cx) => (
              <text
                key={`${ry}-${cx}`}
                x={8 + cx * 8}
                y={12 + ry * 7}
                fontFamily="ui-monospace, monospace"
                fontSize="8"
                fontWeight="700"
                fill={char === "#" ? stroke : soft}
                textAnchor="middle"
              >
                {char}
              </text>
            )),
          )}
        </svg>
      );
    case "prompt":
      return (
        <svg {...common}>
          {/* chat bubble with typing caret */}
          <path
            d="M8 12a4 4 0 014-4h16a4 4 0 014 4v10a4 4 0 01-4 4H18l-6 6v-6h-0a4 4 0 01-4-4V12z"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M14 15h12M14 19h8"
            stroke={soft}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M23 19h1.5"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "tidy":
      return (
        <svg {...common}>
          {/* sparkle + sort lines */}
          <path
            d="M10 14h18M10 20h12M10 26h16"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M30 8l1.4 3 3 1.4-3 1.4-1.4 3-1.4-3-3-1.4 3-1.4z"
            fill={soft}
          />
          <path
            d="M9 30l0.9 1.9 1.9 0.9-1.9 0.9L9 35.6l-0.9-1.9L6.2 32.8l1.9-0.9z"
            fill={stroke}
          />
        </svg>
      );
    case "ticket":
      return (
        <svg {...common}>
          {/* ticket stub */}
          <path
            d="M6 14a2 2 0 012-2h24a2 2 0 012 2v3a3 3 0 000 6v3a2 2 0 01-2 2H8a2 2 0 01-2-2v-3a3 3 0 000-6v-3z"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M22 12v4M22 20v4M22 28v0"
            stroke={soft}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="1 3"
          />
        </svg>
      );
    case "career":
      return (
        <svg {...common}>
          {/* briefcase with rising arrow */}
          <rect
            x="6"
            y="14"
            width="28"
            height="18"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
          />
          <path
            d="M15 14v-3a2 2 0 012-2h6a2 2 0 012 2v3"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M14 24l4-4 4 3 6-7"
            stroke={soft}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 13l4 0 0 4"
            stroke={soft}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "space":
      return (
        <svg {...common}>
          {/* workspace — split panels */}
          <rect
            x="6"
            y="8"
            width="28"
            height="24"
            rx="2"
            stroke={stroke}
            strokeWidth="2"
          />
          <path d="M6 15h28" stroke={stroke} strokeWidth="2" />
          <path d="M16 15v17" stroke={soft} strokeWidth="2" />
          <circle cx="10" cy="11.5" r="0.9" fill={soft} />
          <circle cx="13" cy="11.5" r="0.9" fill={soft} />
        </svg>
      );
  }
}
