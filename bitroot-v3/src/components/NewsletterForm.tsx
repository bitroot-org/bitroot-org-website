"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

export default function NewsletterForm({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    // TODO: wire to Resend / Buttondown
    await new Promise((r) => setTimeout(r, 600));
    track("newsletter_signup", { location: "newsletter_page" });
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-2 text-[13px] text-live">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 8.5l2.5 2.5L12 5.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Thanks — check your inbox to confirm.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="founder@yoursaas.com"
        className={`flex-1 bg-paper border border-line rounded-lg px-3.5 text-[13px] text-ink placeholder:text-ink-4 focus:outline-none focus:border-ink-3 transition-colors font-mono ${
          compact ? "py-2" : "py-2.5"
        }`}
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className={`bg-ink text-paper text-[13px] font-medium rounded-lg px-4 hover:bg-ink-2 disabled:opacity-60 transition-colors ${
          compact ? "py-2" : "py-2.5"
        }`}
      >
        {state === "loading" ? "…" : "Subscribe"}
      </button>
    </form>
  );
}
