"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import {
  hasSeenPopupThisSession,
  isGateUnlocked,
  markPopupSeenThisSession,
  onGateUnlocked,
} from "@/lib/gate";
import GateEmailForm from "./GateEmailForm";
import PlatterDealsStrip from "./PlatterDealsStrip";

const DWELL_MS = 25_000;
const SCROLL_DEPTH = 0.5;

export default function SignupGatePopup() {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (isGateUnlocked() || hasSeenPopupThisSession()) return;

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setVisible(true);
      markPopupSeenThisSession();
      track("signup_gate_view", { location: "popup" });
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return;
      if (doc.scrollTop / scrollable >= SCROLL_DEPTH) show();
    };

    const timer = window.setTimeout(show, DWELL_MS);
    window.addEventListener("scroll", onScroll, { passive: true });

    const unsubscribe = onGateUnlocked(() => setVisible(false));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVisible(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label="Get free Platter deals"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={() => setVisible(false)}
        className="absolute inset-0 bg-ink/40 backdrop-blur-md"
      />

      <div
        className="relative w-full max-w-[440px] rounded-3xl border border-line bg-paper p-6"
        style={{
          boxShadow:
            "0 30px 80px -30px rgba(20,18,42,0.45), 0 8px 24px -12px rgba(20,18,42,0.18)",
        }}
      >
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-lg grid place-items-center text-ink-3 hover:bg-paper-2 hover:text-ink transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {done ? (
          <div>
            <div className="size-12 rounded-2xl bg-live-bg border border-green-200 grid place-items-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12.5L10 17.5L19.5 7"
                  stroke="var(--color-live)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-ink leading-tight mb-2">
              You&apos;re in.
            </h3>
            <p className="text-[14px] text-ink-2 leading-relaxed">
              Check your inbox to confirm — every guide, kit, and Platter deal
              is unlocked on this device from now on.
            </p>
            <button
              onClick={() => setVisible(false)}
              className="mt-5 hover-lift inline-flex items-center gap-1.5 text-[13px] font-medium bg-ink text-paper hover:bg-ink-2 rounded-full px-5 py-2"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-ember mb-1.5">
              free · no card needed
            </div>
            <h2 className="font-display text-2xl font-bold text-ink leading-tight mb-2 pr-8">
              Unlock every guide, kit &amp; Platter deal.
            </h2>
            <p className="text-[13.5px] text-ink-3 leading-relaxed mb-4">
              One email gets you the full library plus live discounts on the
              tools you already use.
            </p>
            <div className="mb-5">
              <PlatterDealsStrip />
            </div>
            <GateEmailForm
              location="signup_gate_popup"
              ctaLabel="Unlock"
              onSuccess={() => setDone(true)}
            />
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="mt-3 text-[12px] font-mono text-ink-4 hover:text-ink-3 transition-colors"
            >
              Maybe later
            </button>
          </>
        )}
      </div>
    </div>
  );
}
