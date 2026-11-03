"use client";

import { useState } from "react";
import { identify, today, track } from "@/lib/analytics";
import { subscribeNewsletter } from "@/lib/forms";

/** Newsletter signup on the accent footer band. Same Worker + event as the rest. */
export default function FooterSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    const result = await subscribeNewsletter(email, "footer");
    if (!result.ok) {
      setState("error");
      return;
    }
    identify(email, { newsletter_subscriber: true }, { newsletter_signup_date: today() });
    track("newsletter_signup", { location: "footer" });
    setState("done");
  }

  if (state === "done") {
    return <p className="m-0 text-[18px] font-semibold">You&apos;re in. Check your inbox to confirm.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="max-w-[520px]">
      <label htmlFor="footer-email" className="flex items-center gap-3 text-[clamp(18px,1.8vw,22px)] font-semibold">
        <span className="sq-bullet" />
        One email a week. New picks, no spam.
      </label>
      <div className="mt-3 flex items-center gap-3 border-b-[2.5px] border-current pb-2">
        <input
          id="footer-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="min-w-0 flex-1 bg-transparent text-[18px] text-pop-ink outline-none placeholder:text-pop-ink/55"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          aria-label="Subscribe"
          className="shrink-0 text-[26px] leading-none transition-transform hover:translate-x-1 disabled:opacity-50"
        >
          ⟶
        </button>
      </div>
      {state === "error" && (
        <p role="alert" className="m-0 mt-2 text-[14px] font-medium">
          That didn&apos;t go through. Try again in a moment.
        </p>
      )}
    </form>
  );
}
