"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";

type Lane = {
  key: string;
  num: string;
  glyph: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  expanded: {
    keyLabel: string;
    count: string;
    headline: React.ReactNode;
    desc: string;
    cases: string[];
    primaryCta: string;
    secondaryCta: string;
    ribbon: string;
    chips: string[];
    note: string;
  };
};

const lanes: Lane[] = [
  {
    key: "kits",
    num: "01",
    glyph: "$_",
    title: "Kits",
    desc: "Open-source repos you can clone tonight. Right now: a working Waitlist Kit with email capture, referrals, and a real admin dashboard.",
    cta: "Explore kits",
    href: "/kits",
    expanded: {
      keyLabel: "$_ KITS",
      count: "1 kit · open source",
      headline: (
        <>
          A real waitlist <span className="serif-em">in an hour.</span>
        </>
      ),
      desc: "Clone the repo, set three env vars, push to Vercel. Email capture with double opt-in, referrals, and an admin view — all wired.",
      cases: [
        "Clone the Waitlist Kit and ship a signup page tonight.",
        "Push to GitHub, deploy on Vercel, point a domain — live in an hour.",
        "MIT licensed. Fork it, brand it, sell on it.",
      ],
      primaryCta: "Explore kits",
      secondaryCta: "open on GitHub ↗",
      ribbon: "1:10 · clone walkthrough",
      chips: ["Next.js", "Resend"],
      note: "watch a one-minute clone-to-deploy",
    },
  },
  {
    key: "guides",
    num: "02",
    glyph: "◆",
    title: "Guides",
    desc: "Short walkthroughs you can finish in one sitting. Real code, real distribution lists, AI workflows that don't fall apart.",
    cta: "Explore guides",
    href: "/guides",
    expanded: {
      keyLabel: "◆ GUIDES",
      count: "5 guides",
      headline: (
        <>
          Field notes from <span className="serif-em">builders.</span>
        </>
      ),
      desc: "Tactical write-ups: shipping, AI-assisted dev, design workflows, distribution. Each one is reproducible from a blank repo or a blank doc.",
      cases: [
        "Ship a waitlist in two hours — DB, email, admin view, all wired.",
        "An AI-assisted full-stack workflow that doesn't get messy.",
        "18 free analytics tools, ranked by what their free tier really gives you.",
      ],
      primaryCta: "Explore guides",
      secondaryCta: "all 5 ↗",
      ribbon: "0:55 · waitlist demo",
      chips: ["Tactical", "Reproducible"],
      note: "see the waitlist guide in 60s",
    },
  },
  {
    key: "products",
    num: "03",
    glyph: "❖",
    title: "Products",
    desc: "Tiny apps from the Bitroot team. BitStudio is in early access; seven more are coming soon. Every one ships with a free plan.",
    cta: "Explore products",
    href: "/products",
    expanded: {
      keyLabel: "❖ PRODUCTS",
      count: "1 live · 7 coming soon",
      headline: (
        <>
          Apps that ship with a{" "}
          <span className="serif-em">free tier.</span>
        </>
      ),
      desc: "Early access starts with a small cohort — Core Community or Creators Program. The free plan stays generous, forever.",
      cases: [
        "BitStudio — pick a mood, ship a full social calendar.",
        "Trips.ky — go from idea to itinerary in five minutes.",
        "ascii.gen, prompt.bit, tidy.bit, and four more on the way.",
      ],
      primaryCta: "Explore products",
      secondaryCta: "claim early access ↗",
      ribbon: "1:30 · BitStudio tour",
      chips: ["Free tier", "Cohort"],
      note: "see the catalog in 90s",
    },
  },
  {
    key: "tools",
    num: "04",
    glyph: "◉",
    title: "Tools",
    desc: "Tiny in-browser utilities. No signup, no email gate, no upsell. Bookmark one, share the rest.",
    cta: "Explore tools",
    href: "/tools",
    expanded: {
      keyLabel: "◉ TOOLS",
      count: "5 tools · zero signups",
      headline: (
        <>
          Quick utilities that <span className="serif-em">just work.</span>
        </>
      ),
      desc: "Each tool does one thing and gets out of the way. No accounts, no popups, no tracking pixel chasing you around the internet.",
      cases: [
        "Generate an Open Graph image and download it as PNG.",
        "Drop an image into the favicon generator, get every size + the HTML.",
        "Answer five questions, get a 3-tier pricing page draft.",
      ],
      primaryCta: "Explore tools",
      secondaryCta: "all 5 ↗",
      ribbon: "0:40 · OG demo",
      chips: ["Free", "No signup"],
      note: "watch the OG maker run in 30s",
    },
  },
];

export default function LaneSection() {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handlePointerMove = (
    e: React.PointerEvent<HTMLDivElement>,
  ) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--mx",
      `${((e.clientX - r.left) / r.width) * 100}%`,
    );
    e.currentTarget.style.setProperty(
      "--my",
      `${((e.clientY - r.top) / r.height) * 100}%`,
    );
  };

  const handlePointerLeave = (
    e: React.PointerEvent<HTMLDivElement>,
  ) => {
    e.currentTarget.style.removeProperty("--mx");
    e.currentTarget.style.removeProperty("--my");
  };

  const active = lanes.find((l) => l.key === activeKey) ?? null;

  return (
    <section id="lanes" className="pt-8 pb-18">
      <Container>
        <div className="flex items-end justify-between gap-6 mb-9">
          <div>
            <span className="eyebrow-mono">what&apos;s inside</span>
            <h2 className="font-sans mt-2.5 text-[clamp(30px,3.4vw,42px)] font-semibold tracking-[-0.03em] leading-[1.05]">
              Kits, guides, products, and{" "}
              <span className="serif-em">tools.</span>
            </h2>
            <p className="text-[15px] text-ink-3 mt-3 max-w-[560px]">
              Tap a lane to open a focused shelf. Everything else fades out.
            </p>
          </div>
          <div className="font-mono text-[12px] text-ink-4 hidden md:block">
            tap one · the rest get out of the way
          </div>
        </div>

        <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {lanes.map((lane) => {
            const isActive = activeKey === lane.key;
            return (
              <div
                key={lane.key}
                role="button"
                tabIndex={0}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("a, button")) return;
                  setActiveKey(isActive ? null : lane.key);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveKey(isActive ? null : lane.key);
                  }
                  if (e.key === "Escape") setActiveKey(null);
                }}
                className={`lane-card flex flex-col min-h-[220px] bg-paper border rounded-[22px] px-6 pt-7 pb-6 ${
                  isActive ? "is-active" : "border-line"
                }`}
              >
                <span className="lane-num">{lane.num}</span>
                <h3 className="font-sans text-[26px] font-semibold tracking-[-0.025em] mt-3.5 mb-1.5 flex items-baseline gap-2">
                  <span className="lane-glyph text-[18px]">{lane.glyph}</span>
                  <span>{lane.title}</span>
                </h3>
                <p className="text-[14px] text-ink-3 leading-[1.5] flex-1">
                  {lane.desc}
                </p>
                <span className="lane-cta-line self-start mt-4 font-mono text-[12px] text-ink-2 inline-flex items-center gap-1.5">
                  {lane.cta}{" "}
                  <span className="lane-cta-arr" aria-hidden>
                    →
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Inline drawer */}
        <div className={`lane-drawer ${active ? "open" : ""}`}>
          <div className="lane-drawer-inner">
            {active && (
              <div className="relative">
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setActiveKey(null)}
                  className="absolute top-4 right-4 w-[30px] h-[30px] rounded-[8px] border border-line bg-transparent grid place-items-center text-ink-3 hover:bg-paper-2 hover:text-ink hover:border-line-2 transition-colors z-10"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
                <div className="p-9 flex flex-col gap-4">
                  <div className="flex items-center gap-2.5 font-mono text-[12px] text-ink-4">
                    <span className="text-ember">
                      {active.expanded.keyLabel}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-ember" />
                    <span>{active.expanded.count}</span>
                  </div>
                  <h3 className="font-sans text-[36px] font-semibold tracking-[-0.03em] leading-[1.04] m-0">
                    {active.expanded.headline}
                  </h3>
                  <p className="text-[16px] text-ink-3 leading-[1.55] m-0 max-w-[48ch]">
                    {active.expanded.desc}
                  </p>
                  <ul className="m-0 p-0 list-none flex flex-col gap-2.5 mt-1">
                    {active.expanded.cases.map((c) => (
                      <li
                        key={c}
                        className="flex items-start gap-2.5 text-[14.5px] text-ink-2"
                      >
                        <span className="inline-block flex-none w-[7px] h-[7px] rounded-[2px] bg-ember mt-2" />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex items-center gap-3.5">
                    <Link
                      href={active.href}
                      className="inline-flex items-center gap-2 h-[38px] px-5 rounded-full bg-ink text-paper text-[14px] font-medium hover:bg-[#2a282d] transition-colors"
                    >
                      {active.expanded.primaryCta}{" "}
                      <span aria-hidden>→</span>
                    </Link>
                    <Link
                      href={active.href}
                      className="text-[14px] text-ink-2 hover:text-ember transition-colors"
                    >
                      {active.expanded.secondaryCta}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
