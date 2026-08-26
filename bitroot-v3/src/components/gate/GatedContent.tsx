"use client";

import { useSyncExternalStore } from "react";
import { isGateUnlocked, onGateUnlocked } from "@/lib/gate";
import GateEmailForm from "./GateEmailForm";
import PlatterDealsStrip from "./PlatterDealsStrip";

// getServerSnapshot always reports "unlocked" so SSR output (and crawlers,
// which never run client JS) always render the full content. Submitting the
// gate form calls unlockGate(), which fires the subscribed event below and
// flips every mounted gate on the page back to unlocked without a reload.
function useGateUnlocked() {
  return useSyncExternalStore(onGateUnlocked, isGateUnlocked, () => true);
}

export default function GatedContent({
  children,
  kind,
}: {
  children: React.ReactNode;
  kind: "guide" | "kit";
}) {
  const unlocked = useGateUnlocked();

  if (unlocked) return <>{children}</>;

  return (
    <div className="relative">
      <div
        aria-hidden
        className="max-h-[480px] overflow-hidden pointer-events-none select-none blur-[3px]"
        style={{
          maskImage: "linear-gradient(to bottom, black 25%, transparent 92%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 25%, transparent 92%)",
        }}
      >
        {children}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-center pb-2">
        <div className="w-full max-w-[440px] rounded-2xl border border-line bg-paper p-5 mx-4 shadow-[0_20px_50px_-20px_rgba(20,18,42,0.35)]">
          <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-ember mb-1.5">
            unlock the full {kind}
          </div>
          <h3 className="font-display text-[17px] font-bold text-ink leading-tight mb-2">
            One email — the rest of this {kind}, plus live Platter deals.
          </h3>
          <div className="mb-4">
            <PlatterDealsStrip compact />
          </div>
          <GateEmailForm location={`content_gate_${kind}`} ctaLabel="Unlock" />
        </div>
      </div>
    </div>
  );
}
