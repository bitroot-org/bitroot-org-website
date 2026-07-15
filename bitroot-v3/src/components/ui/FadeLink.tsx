"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const FADE_MS = 200;
const FADE_CLASS = "page-fading";

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Link that fades the page out before a client-side navigation, so the route
 * change reads as a deliberate transition. Pair with <PageFadeReset /> in the
 * root layout, which fades the destination back in.
 */
export default function FadeLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        if (reducedMotion()) {
          router.push(href);
          return;
        }
        document.body.classList.add(FADE_CLASS);
        window.setTimeout(() => router.push(href), FADE_MS);
      }}
    >
      {children}
    </a>
  );
}

/** Mounted once in the root layout; lifts the fade after every navigation. */
export function PageFadeReset() {
  const pathname = usePathname();
  useEffect(() => {
    document.body.classList.remove(FADE_CLASS);
  }, [pathname]);
  return null;
}
