"use client";

import { useState } from "react";
import { identify, today, track } from "@/lib/analytics";
import { subscribeNewsletter } from "@/lib/forms";
import { unlockGate } from "@/lib/gate";

export default function GateEmailForm({
  location,
  ctaLabel = "Unlock",
  onSuccess,
}: {
  location: string;
  ctaLabel?: string;
  onSuccess?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || state === "loading") return;
    setState("loading");
    const result = await subscribeNewsletter(email, location);
    if (!result.ok) {
      setState("error");
      return;
    }
    identify(
      email,
      { newsletter_subscriber: true },
      { newsletter_signup_date: today() },
    );
    track("newsletter_signup", { location });
    track("signup_gate_submit", { location });
    unlockGate();
    onSuccess?.();
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@yourstartup.com"
          className="flex-1 bg-paper border border-line rounded-lg px-3.5 py-2.5 text-[13px] text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink-3 transition-colors font-mono"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="bg-ink text-paper text-[13px] font-medium rounded-lg px-4 py-2.5 hover:bg-ink-2 disabled:opacity-60 transition-colors shrink-0"
        >
          {state === "loading" ? "…" : ctaLabel}
        </button>
      </form>
      {state === "error" && (
        <p className="mt-2 text-[12px] text-ember">
          Something went wrong — please try again in a moment.
        </p>
      )}
      <p className="mt-2 text-[11px] font-mono text-ink-4">
        No spam. Unsubscribe with one click.
      </p>
    </div>
  );
}
