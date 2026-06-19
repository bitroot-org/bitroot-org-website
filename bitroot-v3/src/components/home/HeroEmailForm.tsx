"use client";

import { useRef } from "react";
import { identify, today, track } from "@/lib/analytics";

export default function HeroEmailForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <form
        className="mt-7 flex items-center gap-2 bg-paper border border-line rounded-full py-1.5 pl-4 pr-1.5 max-w-[420px] focus-within:border-ink transition-colors"
        onSubmit={(e) => {
          e.preventDefault();
          const email = emailRef.current?.value ?? "";
          if (email)
            identify(
              email,
              { newsletter_subscriber: true },
              { newsletter_signup_date: today() },
            );
          track("newsletter_signup", { location: "hero" });
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
          className="h-[34px] px-4 rounded-full bg-ink text-paper text-[13px] font-medium hover:bg-[#2a282d] transition-colors"
        >
          Get the Sunday email
        </button>
      </form>
      <div className="mt-2.5 font-mono text-[11px] text-ink-4 tracking-[0.02em]">
        · one email · unsubscribe in one click
      </div>
    </>
  );
}
