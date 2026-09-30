"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track } from "@/lib/analytics";

type Props = ComponentProps<typeof Link> & {
  /** Human label for the CTA, e.g. the card title. */
  label: string;
  /** Where on the site this link lives, e.g. "kits_listing". */
  location: string;
};

/**
 * next/link that fires the canonical `cta_click` event. Use for internal
 * links that need client-side navigation (TrackedLink is a plain <a>).
 */
export default function TrackedNextLink({
  label,
  location,
  onClick,
  href,
  ...rest
}: Props) {
  return (
    <Link
      {...rest}
      href={href}
      onClick={(e) => {
        track("cta_click", { label, location, href: String(href) });
        onClick?.(e);
      }}
    />
  );
}
