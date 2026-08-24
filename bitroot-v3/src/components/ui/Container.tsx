import { cn } from "@/lib/cn";

export default function Container({
  children,
  className,
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-10",
        size === "narrow" && "max-w-3xl",
        size === "default" && "max-w-[1240px]",
        size === "wide" && "max-w-[1440px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
