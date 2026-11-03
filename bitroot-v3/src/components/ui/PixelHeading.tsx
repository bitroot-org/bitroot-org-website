import { cn } from "@/lib/cn";

/** Section heading: the two-square glyph + a big title in the vibe's alt face. */
export default function PixelHeading({
  children,
  as: Tag = "h2",
  id,
  className,
  tone = "display",
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  tone?: "display" | "paper";
}) {
  return (
    <Tag
      id={id}
      className={cn(
        "flex items-center gap-4 font-alt leading-none text-[clamp(40px,6vw,76px)]",
        tone === "display" ? "text-display" : "text-paper",
        className,
      )}
    >
      <span aria-hidden className="relative inline-block size-[0.62em] shrink-0">
        <span className="px-block absolute left-0 bottom-0 size-1/2" style={{ background: "currentColor" }} />
        <span className="px-block absolute right-0 top-0 size-1/2" style={{ background: "currentColor" }} />
      </span>
      <span>{children}</span>
    </Tag>
  );
}
