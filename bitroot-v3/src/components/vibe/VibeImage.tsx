import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * A `fill` image graded per vibe: `<src>.webp` (Bitroot blue) for Bruh and
 * `<src>-baddie.webp` (hot pink) for Baddie. Both are in the HTML; CSS hides
 * the other one, and lazy images that are display:none never download.
 */
export default function VibeImage({
  src,
  alt,
  sizes,
  className,
  priority,
}: {
  /** Path without extension, e.g. "/genz/club-crew". */
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image src={`${src}.webp`} alt={alt} fill sizes={sizes} priority={priority} className={cn("vibe-only-bruh", className)} />
      <Image src={`${src}-baddie.webp`} alt={alt} fill sizes={sizes} className={cn("vibe-only-baddie", className)} />
    </>
  );
}
