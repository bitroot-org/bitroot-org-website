"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type CardSlot = {
  type: "product" | "repo" | "guide" | "kit" | "blog" | "newsletter";
  href: string;
  x: number;
  y: number;
  rot: number;
  delay: number;
  z: number;
};

const slots: CardSlot[] = [
  { type: "product",    href: "/products",   x: -540, y: 50,  rot: -24, delay: 0.05, z: 1 },
  { type: "repo",       href: "/kits",       x: -330, y: 18,  rot: -14, delay: 0.45, z: 2 },
  { type: "guide",      href: "/guides",     x: -115, y: -8,  rot: -5,  delay: 0.20, z: 4 },
  { type: "kit",        href: "/kits",       x:  115, y: -8,  rot:  5,  delay: 0.55, z: 4 },
  { type: "blog",       href: "/newsletter", x:  330, y: 18,  rot:  14, delay: 0.30, z: 2 },
  { type: "newsletter", href: "/newsletter", x:  540, y: 50,  rot:  24, delay: 0.65, z: 1 },
];

const cardGlow: Record<CardSlot["type"], string> = {
  product:    "rgba(82, 92, 235, 0.55)",   // indigo
  repo:       "rgba(82, 132, 255, 0.50)",  // sky blue
  guide:      "rgba(255, 138, 170, 0.50)", // coral pink
  kit:        "rgba(255, 169, 90, 0.55)",  // amber
  blog:       "rgba(125, 167, 245, 0.50)", // periwinkle
  newsletter: "rgba(255, 130, 110, 0.55)", // sunset coral
};

const CARD_W = 240;
const CARD_H = 336;

function ProductCard() {
  return (
    <div className="relative h-full w-full p-5 flex flex-col text-paper overflow-hidden bg-gradient-to-br from-[#A6AEFF] via-[#7782ee] to-[#3a44c4]">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(255,255,255,0.40), transparent 55%), radial-gradient(120% 80% at 0% 100%, rgba(20,18,72,0.30), transparent 55%)",
        }}
      />
      <div className="relative flex items-center justify-between">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-paper/80">
          new app · early access
        </span>
        <span className="size-5 rounded-full bg-paper/15 grid place-items-center text-[9px]">●</span>
      </div>

      {/* App-icon squircle */}
      <div className="relative mt-4 flex items-center gap-3">
        <div
          className="h-14 w-14 shrink-0 rounded-[15px] grid place-items-center"
          style={{
            background: "linear-gradient(155deg, #ffffff 0%, #dde0ff 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.12), 0 8px 18px -10px rgba(20,18,72,0.45)",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
            <path
              d="M20 8c-7 0-12 4.8-12 10.8 0 3.8 2.7 6.6 6.4 6.6h2.2a2.2 2.2 0 012.2 2.2v.4c0 1.9 1.6 3.5 3.5 3.5 6.6 0 12-4.8 12-10.8C34 12.8 27.8 8 20 8z"
              stroke="#3a44c4"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle cx="14" cy="17" r="1.6" fill="#3a44c4" />
            <circle cx="20" cy="13.5" r="1.6" fill="#7782ee" />
            <circle cx="26" cy="17" r="1.6" fill="#3a44c4" />
            <circle cx="28" cy="23" r="1.6" fill="#7782ee" />
          </svg>
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-[18px] font-bold tracking-tight leading-tight">
            BitStudio
          </h3>
          <p className="text-[11.5px] text-paper/80 leading-snug mt-0.5">
            A vibe studio for your content.
          </p>
        </div>
      </div>

      <div className="relative flex-1" />
      <div className="relative flex items-center gap-2 text-[11px] font-mono">
        <span className="rounded-[5px] bg-paper/15 border border-paper/30 px-1.5 py-0.5 text-[10px] text-paper">
          Free plan
        </span>
        <span className="text-paper/75">· join waitlist ↗</span>
      </div>
    </div>
  );
}

function RepoCard() {
  return (
    <div className="relative h-full w-full p-5 flex flex-col text-ink overflow-hidden bg-gradient-to-br from-[#C5DEFF] via-[#7FA8F4] to-[#3F6CFF]">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(255,255,255,0.55), transparent 55%), radial-gradient(120% 80% at 0% 100%, rgba(20,40,108,0.22), transparent 55%)",
        }}
      />
      <div className="relative flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-ink/75">
          <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8a8 8 0 0 0-8-8z" />
        </svg>
        <span className="font-mono text-[11.5px] text-ink/75">bitroot/</span>
        <span className="font-mono text-[11.5px] font-semibold text-ink">starter</span>
      </div>
      <h3 className="relative font-display text-[18px] font-bold tracking-tight leading-tight mt-3.5">
        Open source<br />from day one
      </h3>
      <p className="relative text-[12px] text-ink/75 leading-snug mt-2.5 line-clamp-3">
        Production-ready repos. Clone tonight, ship tomorrow. Auth, billing, emails — wired.
      </p>
      <div className="relative flex-1" />
      <div className="relative flex items-center gap-3.5 text-[11.5px] font-mono text-ink/70">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#1c3fab]" /> TS
        </span>
        <span>★ 1.2k</span>
        <span>⑂ 84</span>
      </div>
    </div>
  );
}

function GuideCard() {
  return (
    <div className="relative h-full w-full p-5 flex flex-col text-ink overflow-hidden bg-gradient-to-br from-[#FFE0E9] via-[#FFB8C9] to-[#FF8AAA]">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(255,255,255,0.55), transparent 55%), radial-gradient(120% 80% at 0% 100%, rgba(160,30,70,0.18), transparent 55%)",
        }}
      />
      <div className="relative flex items-center justify-between">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[#9d2748]">
          guide · 2 hr
        </span>
        <span className="text-[11px] font-mono text-ink/60">3/7</span>
      </div>
      <h3 className="relative font-display text-[19px] font-bold tracking-tight leading-tight mt-3.5">
        Ship a waitlist in 2 hours
      </h3>
      <ul className="relative mt-3.5 space-y-2 text-[12px] text-ink/85 font-mono">
        <li className="flex items-center gap-2"><span className="text-[#9d2748]">✓</span> domain &amp; DNS</li>
        <li className="flex items-center gap-2"><span className="text-[#9d2748]">✓</span> Resend setup</li>
        <li className="flex items-center gap-2"><span className="text-[#9d2748]">✓</span> double opt-in</li>
        <li className="flex items-center gap-2"><span className="text-ink/45">○</span> admin dashboard</li>
      </ul>
      <div className="relative flex-1" />
      <div className="relative h-1.5 rounded-full bg-white/55 overflow-hidden">
        <div className="h-full w-[42%] bg-[#9d2748] rounded-full" />
      </div>
    </div>
  );
}

function KitCard() {
  return (
    <div className="relative h-full w-full p-5 flex flex-col text-ink overflow-hidden bg-gradient-to-br from-[#FFE9C7] via-[#FFCD86] to-[#FFA94D]">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(255,255,255,0.55), transparent 55%), radial-gradient(120% 80% at 0% 100%, rgba(143,68,12,0.20), transparent 55%)",
        }}
      />
      <div className="relative flex items-center justify-between">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[#8a3f0a]">
          kit · launch
        </span>
        <span className="text-[11px] font-mono text-ink/60">v1.4</span>
      </div>
      <h3 className="relative font-display text-[19px] font-bold tracking-tight leading-tight mt-3.5">
        Next.js SaaS<br />Starter
      </h3>
      <div className="relative mt-3.5 flex flex-wrap gap-1.5">
        {["Next.js", "Clerk", "Stripe", "Resend", "Postgres"].map((t) => (
          <span
            key={t}
            className="text-[10.5px] font-mono px-2 py-0.5 rounded-[5px] bg-white/70 border border-white/80 text-ink/80"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="relative flex-1" />
      <div className="relative rounded-[8px] bg-[#0f1a17]/90 text-paper px-3 py-2 font-mono text-[11.5px] flex items-center gap-2">
        <span className="text-[#9ee493]">$</span>
        <span>npx bitroot init</span>
        <span className="ml-auto cursor-blink">▌</span>
      </div>
    </div>
  );
}

function BlogCard() {
  return (
    <div className="relative h-full w-full p-5 flex flex-col text-ink overflow-hidden bg-gradient-to-br from-[#DCE8FF] via-[#A6BFF7] to-[#7FA8F4]">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(255,255,255,0.55), transparent 55%), radial-gradient(120% 80% at 0% 100%, rgba(30,52,128,0.20), transparent 55%)",
        }}
      />
      <div className="relative flex items-center justify-between">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[#1e3480]">
          dispatch
        </span>
        <span className="text-[11px] font-mono text-ink/60">apr 28</span>
      </div>
      <h3 className="relative font-display text-[19px] font-bold tracking-tight leading-tight mt-3.5">
        Issue 14
      </h3>
      <p className="relative text-[12.5px] text-ink/80 leading-snug mt-3 line-clamp-3">
        Why we ditched Webpack for <span className="font-semibold text-ink">Turbopack</span>.
      </p>
      <div className="relative flex-1" />
      <div className="relative flex items-center gap-2 text-[11px] font-mono text-ink/65">
        <span>4 min read</span>
        <span>·</span>
        <span>by Karan</span>
      </div>
    </div>
  );
}

function NewsletterCard() {
  return (
    <div className="relative h-full w-full flex flex-col text-ink overflow-hidden bg-gradient-to-br from-[#FFD0BF] via-[#FF9F8C] to-[#FF7062]">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(255,255,255,0.55), transparent 55%), radial-gradient(120% 80% at 0% 100%, rgba(140,30,15,0.22), transparent 55%)",
        }}
      />
      <div className="relative flex items-center gap-1.5 px-3.5 py-2.5 border-b border-white/45 bg-white/25 backdrop-blur-[1px]">
        <span className="size-2 rounded-full bg-[#ff5f57]" />
        <span className="size-2 rounded-full bg-[#febc2e]" />
        <span className="size-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[10.5px] text-ink/70">inbox</span>
      </div>
      <div className="relative p-4 flex flex-col flex-1">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[#8a2618]">
          sunday email
        </span>
        <h3 className="font-display text-[16px] font-bold tracking-tight leading-tight mt-2 text-balance">
          5 tools we shipped this week
        </h3>
        <p className="text-[11.5px] text-ink/75 leading-snug mt-2 line-clamp-3">
          A pricing-page generator, a fresh README maker, two new apps shipping next week, and one tiny Bun trick.
        </p>
        <div className="flex-1" />
        <div className="rounded-[8px] border border-white/55 bg-white/35 p-2 flex items-center gap-2">
          <span className="font-mono text-[11px] text-ink/65 flex-1 truncate">you@startup.dev</span>
          <span className="rounded-[5px] bg-ink text-paper text-[10.5px] font-medium px-2.5 py-1.5">
            subscribe
          </span>
        </div>
      </div>
    </div>
  );
}

const cardRenderers = {
  product: ProductCard,
  repo: RepoCard,
  guide: GuideCard,
  kit: KitCard,
  blog: BlogCard,
  newsletter: NewsletterCard,
};

export default function HeroCardFan() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const y = window.scrollY;
      const max = window.innerHeight * 0.5;
      const p = Math.min(1, Math.max(0, y / max));
      ref.current?.style.setProperty("--fan-progress", String(p));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-[-60px] z-[5] w-[1340px] h-[400px] pointer-events-none"
      style={{ ["--fan-progress" as string]: "0" }}
    >
      <div className="relative w-full h-full origin-bottom scale-[0.72] lg:scale-[0.88] xl:scale-100">
        {slots.map((slot) => {
          const Card = cardRenderers[slot.type];
          return (
            <div
              key={slot.type}
              className="fan-slot absolute left-1/2 bottom-0 pointer-events-auto"
              style={{
                width: CARD_W,
                height: CARD_H,
                transform: `translateX(calc(-50% + ${slot.x}px)) translateY(${slot.y}px)`,
                zIndex: slot.z,
              }}
            >
              <div className="card-bob w-full h-full" style={{ animationDelay: `${slot.delay}s` }}>
                <Link
                  href={slot.href}
                  className="fan-card block w-full h-full rounded-[20px] overflow-hidden border border-line shadow-[0_22px_50px_-22px_rgba(20,18,42,0.36),0_0_0_1px_rgba(255,255,255,0.6)_inset] bg-paper"
                  style={{
                    transform: `rotate(calc(${slot.rot}deg * (0.7 + 0.5 * var(--fan-progress, 0))))`,
                    ["--card-glow" as string]: cardGlow[slot.type],
                  }}
                >
                  <Card />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
