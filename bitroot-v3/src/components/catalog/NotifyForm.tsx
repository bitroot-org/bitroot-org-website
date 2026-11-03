"use client";

import { useState } from "react";
import { identify, today, track } from "@/lib/analytics";
import { subscribeNewsletter } from "@/lib/forms";

/**
 * "Tell me when it ships" for coming-soon catalog items. Signs the visitor up
 * to the newsletter (same Worker, same `newsletter_signup` event) and tags the
 * item they asked about.
 */
export default function NotifyForm({ slug, name }: { slug: string; name: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    const result = await subscribeNewsletter(email, "catalog_item");
    if (!result.ok) {
      setState("error");
      return;
    }
    identify(email, { newsletter_subscriber: true }, { newsletter_signup_date: today() });
    track("newsletter_signup", { location: "catalog_item", item_slug: slug });
    setState("done");
  }

  if (state === "done") {
    return (
      <p className="m-0 r-vibe-lg bg-tint px-5 py-4 text-[15px] text-ink">
        You&apos;re on the list. We&apos;ll email you when {name} ships.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
      <label htmlFor={`notify-${slug}`} className="sr-only">
        Email
      </label>
      <input
        id={`notify-${slug}`}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="h-12 min-w-0 flex-1 r-pill border-[1.5px] border-ink bg-paper px-4 text-[15px] text-ink outline-none placeholder:text-ink-4 focus:border-ember"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="h-12 shrink-0 r-pill bg-ink px-5 text-[15px] font-semibold text-paper transition-opacity disabled:opacity-60"
      >
        {state === "loading" ? "Adding…" : "Tell me when it ships"}
      </button>
      {state === "error" && (
        <p role="alert" className="m-0 text-[13px] text-ember sm:basis-full">
          That didn&apos;t go through. Check the email and try again.
        </p>
      )}
    </form>
  );
}
