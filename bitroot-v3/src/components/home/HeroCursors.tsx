type CursorKey = "aryan" | "robert" | "priya" | "marcus" | "aanya" | "jessica";

type Cursor = {
  name: string;
  key: CursorKey;
  color: string;
  textColor?: string;
  /** Tailwind classes for top/left/right at desktop sizes (md+). */
  desktop: string;
  /** Tailwind classes for mobile (<md). Omit to hide on mobile. */
  mobile?: string;
  typeText?: string;
};

const cursors: Cursor[] = [
  {
    name: "Aryan",
    key: "aryan",
    color: "#0d9488",
    desktop: "md:top-[14%] md:left-[6%]",
    mobile: "top-[1%] left-[3%]",
  },
  {
    name: "Robert",
    key: "robert",
    color: "#f59e0b",
    textColor: "#1a1106",
    desktop: "md:top-[18%] md:right-[7%] md:left-auto",
    // Anchor with `left:` on mobile so Robert's positive-X path drift
    // (up to +36 px) stays inside the viewport instead of pushing off-screen.
    mobile: "top-[1%] left-[55%]",
  },
  {
    name: "Priya",
    key: "priya",
    color: "#e11d48",
    desktop: "md:top-[38%] md:left-[4%]",
    typeText: "naming…",
  },
  {
    name: "Marcus",
    key: "marcus",
    color: "#0284c7",
    desktop: "md:top-[44%] md:right-[5%]",
  },
  {
    name: "Aanya",
    key: "aanya",
    color: "#7c3aed",
    desktop: "md:top-[60%] md:left-[13%]",
    // Below the mobile marquee in the empty band before the next section.
    mobile: "top-[78%] left-[8%]",
  },
  {
    name: "Jessica",
    key: "jessica",
    color: "#db2777",
    desktop: "md:top-[62%] md:right-[12%] md:left-auto",
    // `left:` anchor so Jessica's positive-X drift (+28px) stays on-screen.
    mobile: "top-[80%] left-[60%]",
  },
];

function CursorArrow({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="18"
      viewBox="0 0 14 18"
      fill={color}
      className="drop-shadow-[0_2px_4px_rgba(20,18,42,0.18)]"
    >
      <path d="M1.4 1L1.4 13.5L4.6 10.5L6.6 15.4L8.6 14.6L6.6 9.8L11 9.8Z" />
    </svg>
  );
}

function ActionVisual({ c }: { c: Cursor }) {
  const styleColor = { color: c.color };
  switch (c.key) {
    case "aryan":
      return <span className="aryan-select-box" style={styleColor} />;
    case "robert":
      return <span className="robert-click-ring" style={styleColor} />;
    case "priya":
      return (
        <span className="priya-bubble" style={styleColor}>
          <span className="priya-text">{c.typeText}</span>
          <span className="type-caret-bar" />
        </span>
      );
    case "marcus":
      return <span className="marcus-chip" style={styleColor} />;
    case "aanya":
      return (
        <span className="aanya-dots" style={styleColor}>
          <span /><span /><span />
        </span>
      );
    case "jessica":
    default:
      return null;
  }
}

export default function HeroCursors() {
  return (
    <div aria-hidden className="hidden md:block absolute inset-0 pointer-events-none z-[6]">
      {cursors.map((c) => {
        const visibility = c.mobile ? "" : "hidden md:block";
        const positionClasses = `${c.mobile ?? ""} ${c.desktop}`.trim();
        return (
          <div
            key={c.name}
            className={`absolute cursor-${c.key} ${visibility} ${positionClasses}`}
          >
            <div className="relative">
              {/* Action overlays are heavy on mobile — they're what bled into
                  the headline. Show them only at md+ where there's room. */}
              <div className="hidden md:block">
                <ActionVisual c={c} />
              </div>
              <div className="relative flex items-center gap-1">
                <CursorArrow color={c.color} />
                <span
                  className="font-medium text-[11px] leading-none px-2 py-1 rounded-[7px] shadow-[0_2px_8px_-2px_rgba(20,18,42,0.18)]"
                  style={{ background: c.color, color: c.textColor ?? "#fff" }}
                >
                  {c.name}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
