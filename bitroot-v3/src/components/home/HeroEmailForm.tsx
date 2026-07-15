"use client";

import { useRef, useState } from "react";
import { identify, today, track } from "@/lib/analytics";
import { subscribeNewsletter } from "@/lib/forms";

export default function HeroEmailForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  if (state === "done") {
    return (
      <div className="mt-7 text-[14px] text-live">
        You&apos;re in — the next dispatch lands Sunday. Check your inbox.
      </div>
    );
  }

  return (
    <>
      <form
        className="mt-7 flex items-center gap-2 bg-paper border border-line rounded-full py-1.5 pl-4 pr-1.5 max-w-[420px] focus-within:border-ink transition-colors"
        onSubmit={async (e) => {
          e.preventDefault();
          const email = emailRef.current?.value ?? "";
          if (!email || state === "loading") return;
          setState("loading");
          const result = await subscribeNewsletter(email, "hero");
          if (!result.ok) {
            setState("error");
            return;
          }
          identify(
            email,
            { newsletter_subscriber: true },
            { newsletter_signup_date: today() },
          );
          track("newsletter_signup", { location: "hero" });
          setState("done");
        }}
      >
        <input
          ref={emailRef}
          type="email"
          aria-label="Email"
          placeholder="you@startup.dev"
          className="flex-1 h-9 bg-transparent border-0 outline-none text-[14px] text-ink placeholder:text-ink-4"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="h-[34px] px-4 rounded-full bg-ink text-paper text-[13px] font-medium hover:bg-[#2a282d] disabled:opacity-60 transition-colors"
        >
          {state === "loading" ? "…" : "Get the Sunday email"}
        </button>
      </form>
      <div className="mt-2.5 font-mono text-[11px] text-ink-4 tracking-[0.02em]">
        {state === "error" ? (
          <span className="text-ember">
            Something went wrong — please try again.
          </span>
        ) : (
          <>· one email · unsubscribe in one click</>
        )}
      </div>
    </>
  );
}
