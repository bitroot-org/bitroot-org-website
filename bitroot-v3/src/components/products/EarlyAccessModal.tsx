"use client";

import { useEffect, useState } from "react";
import ProductIcon from "@/components/products/ProductIcon";
import type { Product } from "@/content/products";
import { identify, track } from "@/lib/analytics";
import { requestEarlyAccess } from "@/lib/forms";

type Program = "core" | "creators";

type Props = {
  open: boolean;
  product: Product | null;
  onClose: () => void;
};

const initialForm = { name: "", email: "", handle: "", context: "" };

export default function EarlyAccessModal({ open, product, onClose }: Props) {
  const [program, setProgram] = useState<Program | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [form, setForm] = useState(initialForm);

  // Reset state shortly after close (so the exit animation reads clean).
  useEffect(() => {
    if (!open) {
      const t = window.setTimeout(() => {
        setProgram(null);
        setSubmitted(false);
        setSubmitting(false);
        setSubmitError(false);
        setForm(initialForm);
      }, 250);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // Lock body scroll + Esc to close.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !product) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-label={`Get early access to ${product.name}`}
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-md"
      />

      {/* panel */}
      <div
        className="relative w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-3xl border border-line bg-paper"
        style={{
          boxShadow:
            "0 30px 80px -30px rgba(20,18,42,0.45), 0 8px 24px -12px rgba(20,18,42,0.18)",
        }}
      >
        {/* header */}
        <div className="px-6 pt-6 pb-4 border-b border-line flex items-start gap-4">
          <ProductIcon
            from={product.icon.from}
            to={product.icon.to}
            glyph={product.icon.glyph}
            size={56}
          />
          <div className="flex-1 min-w-0">
            <div className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-ember mb-1">
              Get early access
            </div>
            <h2 className="font-display text-xl font-bold text-ink leading-tight">
              {product.name}
            </h2>
            <p className="text-[12.5px] text-ink-3 leading-snug mt-1">
              {product.tagline}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-lg grid place-items-center text-ink-3 hover:bg-paper-2 hover:text-ink transition-colors"
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
        </div>

        {submitted ? (
          <Confirmation
            email={form.email}
            program={program ?? "core"}
            onClose={onClose}
          />
        ) : (
          <div className="p-6">
            {/* program selection */}
            <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-4 mb-3">
              01 · pick your program
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              <ProgramCard
                active={program === "core"}
                onClick={() => setProgram("core")}
                title="Core Community"
                description="For builders and indie founders. Access to the app + monthly office hours."
              />
              <ProgramCard
                active={program === "creators"}
                onClick={() => setProgram("creators")}
                title="Creators Program"
                description="For creators and designers with an audience. Higher quotas + cross-promotion."
              />
            </div>

            {/* form */}
            <form
              className="mt-6"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!program || submitting) return;
                setSubmitting(true);
                setSubmitError(false);
                const result = await requestEarlyAccess({
                  name: form.name.trim(),
                  email: form.email.trim(),
                  product: product.slug,
                  productName: product.name,
                  program,
                  handle: form.handle.trim() || undefined,
                  context: form.context.trim() || undefined,
                });
                setSubmitting(false);
                if (!result.ok) {
                  setSubmitError(true);
                  return;
                }
                identify(
                  form.email,
                  {
                    name: form.name.trim() || undefined,
                    converted_via: "early_access",
                    converted_on_site: "bitroot.org",
                  },
                  { early_access_program: program },
                );
                track("early_access_submit", {
                  product: product.slug,
                  program,
                  name: form.name.trim() || undefined,
                  handle: form.handle.trim() || undefined,
                  context: form.context.trim() || undefined,
                });
                setSubmitted(true);
              }}
            >
              <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-4 mb-3">
                02 · tell us about you
              </div>
              <div className="grid gap-2.5">
                <Field
                  label="Full name"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  required
                />
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  required
                />
                {program === "creators" && (
                  <Field
                    label="Twitter / IG handle"
                    placeholder="@yourhandle"
                    value={form.handle}
                    onChange={(v) => setForm({ ...form, handle: v })}
                  />
                )}
                <Textarea
                  label={
                    program === "creators"
                      ? "What kind of content do you make?"
                      : "What are you building?"
                  }
                  value={form.context}
                  onChange={(v) => setForm({ ...form, context: v })}
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
                <p className="text-[11.5px] font-mono text-ink-4">
                  {submitError ? (
                    <span className="text-ember">
                      Something went wrong — please try again.
                    </span>
                  ) : (
                    <>Access lands in your inbox within 7 days.</>
                  )}
                </p>
                <button
                  type="submit"
                  disabled={!program || !form.name || !form.email || submitting}
                  className="hover-lift inline-flex items-center gap-1.5 text-[13px] font-medium bg-ink text-paper hover:bg-ink-2 rounded-full px-5 py-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Sending…" : "Request access"}
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
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Internals ────────────────────────────────────────────────────────── */

function ProgramCard({
  active,
  onClick,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "text-left rounded-2xl px-4 py-3 transition-all duration-200",
        active
          ? "text-ink bg-gradient-to-b from-paper to-paper-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_0_0_1.5px_var(--color-ember),inset_0_-1px_2px_rgba(20,18,42,0.06),0_2px_4px_-1px_rgba(20,18,42,0.10),0_8px_18px_-8px_rgba(20,18,42,0.10)]"
          : "border border-line hover:border-line-2 bg-paper-2/30",
      ].join(" ")}
    >
      <div className="flex items-start gap-2.5">
        <span
          aria-hidden
          className={[
            "mt-1 w-3.5 h-3.5 rounded-full shrink-0 transition-all",
            active
              ? "bg-paper border-[4px] border-ember"
              : "border border-line bg-paper",
          ].join(" ")}
        />
        <div>
          <div className="font-display text-[14px] font-bold text-ink leading-tight">
            {title}
          </div>
          <div className="text-[12px] text-ink-3 leading-snug mt-0.5">
            {description}
          </div>
        </div>
      </div>
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10.5px] font-mono uppercase tracking-wider text-ink-4 mb-1 block">
        {label}
        {required && <span className="text-ember"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line bg-paper px-3.5 py-2 text-[13.5px] focus:outline-none focus:border-ember"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10.5px] font-mono uppercase tracking-wider text-ink-4 mb-1 block">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-line bg-paper px-3.5 py-2 text-[13.5px] resize-none focus:outline-none focus:border-ember"
      />
    </label>
  );
}

function Confirmation({
  email,
  program,
  onClose,
}: {
  email: string;
  program: Program;
  onClose: () => void;
}) {
  const programName =
    program === "core" ? "Core Community" : "Creators Program";
  return (
    <div className="p-6">
      <div className="size-14 rounded-2xl bg-live-bg border border-green-200 grid place-items-center mb-4">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
        You&apos;re in the queue.
      </h3>
      <p className="text-[14px] text-ink-2 leading-relaxed">
        We&apos;ll send your{" "}
        <span className="font-semibold text-ink">{programName}</span> access
        link to{" "}
        <span className="font-mono text-ink">
          {email || "your inbox"}
        </span>{" "}
        within the next 7 days. Reply to that email if you need anything sooner.
      </p>
      <button
        onClick={onClose}
        className="mt-5 hover-lift inline-flex items-center gap-1.5 text-[13px] font-medium bg-ink text-paper hover:bg-ink-2 rounded-full px-5 py-2"
      >
        Close
      </button>
    </div>
  );
}
