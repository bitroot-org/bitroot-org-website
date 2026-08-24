"use client";

import { track } from "@/lib/analytics";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Human label for the CTA, e.g. "Join the Club". */
  label: string;
  /** Where on the site this CTA lives, e.g. "hero", "club_banner". */
  location: string;
  /** Event name to fire. Defaults to the canonical "cta_click". */
  event?: string;
};

/**
 * Anchor that fires an explicit `cta_click` (or custom) event on click, so
 * primary CTAs are tracked reliably regardless of the project autocapture
 * setting. Usable inside server components since it's a client island.
 */
export default function TrackedLink({
  label,
  location,
  event = "cta_click",
  onClick,
  children,
  ...rest
}: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track(event, { label, location, href: rest.href });
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
