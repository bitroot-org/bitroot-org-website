"use client";

import { useState } from "react";
import EarlyAccessModal from "@/components/products/EarlyAccessModal";
import FadeLink from "@/components/ui/FadeLink";
import type { Product } from "@/content/products";

function Arrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * CTA row for the home-page BitStudio spotlight: the early-access request
 * opens the modal right here (no detour to /products), and the secondary
 * action fade-navigates to the full catalog.
 */
export default function BitStudioCTA({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mt-7 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="hover-lift inline-flex items-center gap-1.5 text-[13.5px] font-medium bg-ink text-paper hover:bg-ink-2 rounded-full px-5 py-2.5"
        >
          Claim early access
          <Arrow />
        </button>
        <FadeLink
          href="/products/"
          className="hover-lift inline-flex items-center gap-1.5 text-[13.5px] font-medium border border-line bg-paper text-ink-2 hover:border-ink-3 hover:text-ink rounded-full px-5 py-2.5"
        >
          Explore other products
          <Arrow />
        </FadeLink>
      </div>

      <EarlyAccessModal
        open={open}
        product={product}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
