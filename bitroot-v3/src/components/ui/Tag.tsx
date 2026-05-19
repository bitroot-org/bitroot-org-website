import { cn } from "@/lib/cn";

type Variant = "default" | "ember" | "live" | "muted";

export default function Tag({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-[5px] border",
        variant === "default" && "bg-paper-2 border-line text-ink-3",
        variant === "ember" && "bg-ember-bg border-ember-line text-ember",
        variant === "live" && "bg-live-bg border-green-200 text-live",
        variant === "muted" && "border-line text-ink-4 bg-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}
