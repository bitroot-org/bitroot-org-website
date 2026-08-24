"use client";

import { useState } from "react";
import { identify, today, track } from "@/lib/analytics";
import { sendContactMessage } from "@/lib/forms";

const topics = [
  "General question",
  "Feedback / correction",
  "Stale guide",
  "Partnership",
  "Something else",
];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !message.trim() || state === "loading") return;
    setState("loading");
    const result = await sendContactMessage({
      name: name.trim() || undefined,
      email: email.trim(),
      topic: topic ?? undefined,
      message: message.trim(),
    });
    if (!result.ok) {
      setState("error");
      return;
    }
    identify(
      email,
      {
        name: name.trim() || undefined,
        converted_via: "contact",
        converted_on_site: "bitroot.org",
      },
      { first_contact_date: today() },
    );
    track("contact_submit", {
      topic: topic ?? undefined,
      location: "contact_page",
    });
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-line bg-paper p-6">
        <div className="size-12 rounded-xl bg-live-bg border border-green-200 grid place-items-center mb-4">
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
        <h2 className="font-display text-xl font-bold text-ink leading-tight mb-2">
          Got it. It&apos;s in the inbox.
        </h2>
        <p className="text-[14px] text-ink-2 leading-relaxed">
          We just sent a confirmation to{" "}
          <span className="font-mono text-ink">{email.trim()}</span> and
          we&apos;ll reply within one business day. Reply to that email if you
          want to add anything.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-paper p-6">
      <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-4 mb-3">
        01 · what&apos;s it about?
      </div>
      <div className="flex flex-wrap gap-2">
        {topics.map((t) => {
          const active = topic === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(active ? null : t)}
              aria-pressed={active}
              className={[
                "text-[12px] font-medium rounded-full px-3.5 py-1.5 transition-all duration-200",
                active
                  ? "bg-ink text-paper"
                  : "border border-line text-ink-3 hover:border-line-2 hover:text-ink bg-paper-2/30",
              ].join(" ")}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-4 mt-6 mb-3">
        02 · the message
      </div>
      <div className="grid gap-2.5">
        <div className="grid sm:grid-cols-2 gap-2.5">
          <label className="block">
            <span className="text-[10.5px] font-mono uppercase tracking-wider text-ink-4 mb-1 block">
              Name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-xl border border-line bg-paper px-3.5 py-2 text-[13.5px] placeholder:text-ink-4 focus:outline-none focus:border-ember"
            />
          </label>
          <label className="block">
            <span className="text-[10.5px] font-mono uppercase tracking-wider text-ink-4 mb-1 block">
              Email<span className="text-ember"> *</span>
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="founder@yoursaas.com"
              className="w-full rounded-xl border border-line bg-paper px-3.5 py-2 text-[13.5px] font-mono placeholder:text-ink-4 focus:outline-none focus:border-ember"
            />
          </label>
        </div>
        <label className="block">
          <span className="text-[10.5px] font-mono uppercase tracking-wider text-ink-4 mb-1 block">
            Message<span className="text-ember"> *</span>
          </span>
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            maxLength={5000}
            placeholder="What's on your mind? Links welcome."
            className="w-full rounded-xl border border-line bg-paper px-3.5 py-2 text-[13.5px] resize-none placeholder:text-ink-4 focus:outline-none focus:border-ember"
          />
        </label>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-[11.5px] font-mono text-ink-4">
          {state === "error" ? (
            <span className="text-ember">
              Something went wrong — please try again in a moment.
            </span>
          ) : (
            <>We reply within one business day.</>
          )}
        </p>
        <button
          type="submit"
          disabled={!email || !message.trim() || state === "loading"}
          className="hover-lift inline-flex items-center gap-1.5 text-[13px] font-medium bg-ink text-paper hover:bg-ink-2 rounded-full px-5 py-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {state === "loading" ? "Sending…" : "Send message"}
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
