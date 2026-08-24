export type OfferingType =
  | "product"
  | "repo"
  | "guide"
  | "kit"
  | "blog"
  | "newsletter";

type Offering = {
  color: string;
  glow: string;
  label: string;
  eyebrow: string;
  subtitle: string;
  icon: string;
};

export const offerings: Record<OfferingType, Offering> = {
  product: {
    color: "#525ceb",
    glow: "rgba(82, 92, 235, 0.55)",
    label: "Products",
    eyebrow: "tiny apps",
    subtitle: "free plan, always",
    icon: "❖",
  },
  repo: {
    color: "#0284c7",
    glow: "rgba(2, 132, 199, 0.55)",
    label: "Open Source",
    eyebrow: "clone tonight",
    subtitle: "production-ready repos",
    icon: "</>",
  },
  guide: {
    color: "#0d9488",
    glow: "rgba(13, 148, 136, 0.55)",
    label: "Guides",
    eyebrow: "step by step",
    subtitle: "reproducible playbooks",
    icon: "✓",
  },
  kit: {
    color: "#7c3aed",
    glow: "rgba(124, 58, 237, 0.55)",
    label: "Kits",
    eyebrow: "launch fast",
    subtitle: "auth, billing, emails",
    icon: "⚡",
  },
  blog: {
    color: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.55)",
    label: "Dispatch",
    eyebrow: "fresh drops",
    subtitle: "what we shipped this week",
    icon: "✦",
  },
  newsletter: {
    color: "#db2777",
    glow: "rgba(219, 39, 119, 0.55)",
    label: "Newsletter",
    eyebrow: "sunday email",
    subtitle: "one inbox · no noise",
    icon: "✉",
  },
};

export default function OfferingPill({ type }: { type: OfferingType }) {
  const o = offerings[type];
  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center gap-3 px-6 py-7 text-paper text-center"
      style={{ background: o.color }}
    >
      <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-paper/80">
        {o.eyebrow}
      </span>
      <div
        className="size-14 rounded-full grid place-items-center font-mono font-semibold text-[16px]"
        style={{ background: "rgba(255, 255, 255, 0.18)" }}
      >
        {o.icon}
      </div>
      <div>
        <div className="font-display text-[22px] font-bold leading-tight">
          {o.label}
        </div>
        <div className="text-[11px] text-paper/85 mt-1.5 font-mono">
          {o.subtitle}
        </div>
      </div>
      <span className="text-paper/80 text-[14px] font-mono mt-1">↗</span>
    </div>
  );
}

/**
 * Small horizontal pill button variant — for compact lists / marquees.
 * Auto-width based on content; height fixed for visual rhythm.
 */
export function OfferingChip({ type }: { type: OfferingType }) {
  const o = offerings[type];
  return (
    <div
      className="inline-flex items-center gap-2.5 h-12 pl-2 pr-5 rounded-full text-paper font-semibold text-[15px] tracking-tight whitespace-nowrap"
      style={{ background: o.color }}
    >
      <span
        className="inline-flex shrink-0 size-8 rounded-full items-center justify-center font-mono text-[12px] font-semibold"
        style={{ background: "rgba(255, 255, 255, 0.22)" }}
      >
        {o.icon}
      </span>
      <span>{o.label}</span>
    </div>
  );
}
