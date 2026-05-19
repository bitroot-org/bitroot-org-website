import type { Price } from "@/content/data";
import { cn } from "@/lib/cn";

type PriceBadgeProps = {
  cost: Price;
  size?: "sm" | "md";
  className?: string;
};

export default function PriceBadge({
  cost,
  size = "md",
  className,
}: PriceBadgeProps) {
  const base =
    size === "sm"
      ? "text-[10.5px] px-1.5 py-0.5"
      : "text-[11px] px-2 py-0.5";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono font-medium rounded-[5px] border tabular-nums",
        "bg-ember-bg border-ember-line text-ember",
        base,
        className,
      )}
    >
      <span className="font-semibold">{cost.usd}</span>
      <span aria-hidden className="text-ember/40">·</span>
      <span className="text-ember/75">{cost.inr}</span>
    </span>
  );
}
