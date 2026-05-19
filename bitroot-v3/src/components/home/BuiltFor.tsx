"use client";

import Image from "next/image";
import { useRef, type MouseEvent } from "react";
import Container from "@/components/ui/Container";

type Bullet = {
  lead: string;
  body: string;
};

type Persona = {
  key: "founders" | "developers" | "designers";
  label: string;
  bullets: Bullet[];
  image: string;
  imageAlt: string;
  /** Subtle full-card gradient. */
  bg: string;
  /** Color used for the persona word in the title and the Deal button bg. */
  accent: string;
  /** Soft tint behind the 3D asset for extra depth. */
  glow: string;
  /** Per-persona base scale for the 3D asset (some PNGs read small). */
  imageScale?: number;
};

const personas: Persona[] = [
  {
    key: "founders",
    label: "founders",
    bullets: [
      {
        lead: "Ship a waitlist in 2 hours.",
        body: "A zero-fluff walkthrough. Double opt-in, referrals, admin view — reproducible from a blank repo.",
      },
      {
        lead: "BitStudio · free plan.",
        body: "A vibe studio for your content — pick the mood, get social-media-ready posts that match.",
      },
      {
        lead: "50 places to list your startup.",
        body: "A working distribution list — audience size and a one-line note per platform.",
      },
    ],
    image: "/personas/founders.png",
    imageAlt: "Indigo crystal star — freebies for founders",
    bg: "linear-gradient(155deg, #EFEBFF 0%, #DCD3FF 55%, #C4B7FF 100%)",
    glow: "radial-gradient(60% 50% at 60% 75%, rgba(99,76,255,0.28), transparent 70%)",
    accent: "#5b3fb8",
  },
  {
    key: "developers",
    label: "Developers",
    bullets: [
      {
        lead: "Waitlist Kit.",
        body: "Open-source repo — email capture, referrals, admin dashboard. Clone, push, live.",
      },
      {
        lead: "AI-assisted full-stack workflow.",
        body: "Plan, prompt, and ship with AI tools without ending up with hallucinated code.",
      },
      {
        lead: "tidy.bit · coming soon.",
        body: "A cleanup agent that opens PRs for dead code, stale imports, and duplicate utilities.",
      },
    ],
    image: "/personas/developers.png",
    imageAlt: "Teal 3D code brackets — freebies for developers",
    bg: "linear-gradient(155deg, #E5FBF6 0%, #C4F2E8 55%, #92E3D2 100%)",
    glow: "radial-gradient(60% 50% at 55% 75%, rgba(20,184,166,0.30), transparent 70%)",
    accent: "#0d9488",
    imageScale: 1.28,
  },
  {
    key: "designers",
    label: "Designers",
    bullets: [
      {
        lead: "Production-ready design workflow.",
        body: "Antigravity, Figma, MCP/Copilot, and the exact handoff prompts you'll paste.",
      },
      {
        lead: "BitStudio · free plan.",
        body: "A vibe studio for your content — pick the mood, get social-media-ready posts that match.",
      },
      {
        lead: "ascii.gen · free plan.",
        body: "Beautiful ASCII art for READMEs, decks, and social posts. Unlimited generations.",
      },
    ],
    image: "/personas/designers.png",
    imageAlt: "Orange 3D pen tool — freebies for designers",
    bg: "linear-gradient(155deg, #FFF4E1 0%, #FFE2BA 55%, #FFCB85 100%)",
    glow: "radial-gradient(60% 50% at 55% 75%, rgba(234,108,20,0.30), transparent 70%)",
    accent: "#ea6c14",
  },
];

/** How far the image is allowed to drift on parallax pan, in px. */
const PAN_RANGE = 18;
/** Tilt range in degrees, applied around X/Y axes for the twist. */
const TILT_RANGE = 7;

function PersonaImage({ persona }: { persona: Persona }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const baseScale = persona.imageScale ?? 1;

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    const inner = imgRef.current;
    if (!el || !inner) return;
    const rect = el.getBoundingClientRect();
    // Normalize cursor pos to [-1, 1] within the card
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    const tx = nx * PAN_RANGE;
    const ty = ny * PAN_RANGE;
    const ry = nx * TILT_RANGE; // yaw — left/right twist
    const rx = -ny * TILT_RANGE; // pitch — up/down tilt
    inner.style.transform = `perspective(900px) translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) scale(${baseScale * 1.08})`;
  };

  const reset = () => {
    const inner = imgRef.current;
    if (!inner) return;
    inner.style.transform = `perspective(900px) translate3d(0,0,0) rotateX(0deg) rotateY(0deg) scale(${baseScale})`;
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="pointer-events-auto absolute -bottom-10 -right-10 w-[260px] h-[260px]"
    >
      <div
        ref={imgRef}
        className="relative h-full w-full will-change-transform transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: `perspective(900px) translate3d(0,0,0) rotateX(0deg) rotateY(0deg) scale(${baseScale})`,
          transformOrigin: "bottom right",
        }}
      >
        <Image
          src={persona.image}
          alt={persona.imageAlt}
          fill
          sizes="(max-width: 768px) 60vw, 260px"
          className="object-contain object-right-bottom pointer-events-none select-none drop-shadow-[0_28px_40px_rgba(20,18,42,0.18)]"
          priority={false}
        />
      </div>
    </div>
  );
}

export default function BuiltFor() {
  return (
    <section id="built-for" className="py-18">
      <Container>
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <span className="eyebrow-mono">built for founders</span>
            <h2 className="font-sans mt-2.5 text-[clamp(30px,3.4vw,42px)] font-semibold tracking-[-0.03em] leading-[1.05]">
              Pick what you need.
            </h2>
            <p className="text-[15px] text-ink-3 mt-3 max-w-[560px]">
              Kits, guides, tools, and tiny apps — surfaced for the role
              you&apos;re playing today.
            </p>
          </div>
          <div className="font-mono text-[12px] text-ink-4 hidden md:block">
            we&apos;ll surface what fits
          </div>
        </div>

        <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
          {personas.map((p) => (
            <article
              key={p.key}
              className="persona-card relative rounded-[24px] overflow-hidden flex flex-col min-h-[520px] p-7 transition-transform duration-300 ease-out hover:-translate-y-1"
              style={{ background: p.bg }}
            >
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{ background: p.glow }}
              />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none rounded-[24px]"
                style={{
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 0 0 1px rgba(255,255,255,0.35)",
                }}
              />

              <h3 className="relative font-sans text-[26px] font-semibold tracking-[-0.02em] leading-tight text-ink">
                Freebies for{" "}
                <span style={{ color: p.accent }}>{p.label}</span>
              </h3>

              <ul className="relative mt-5 space-y-3.5">
                {p.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 text-[13.5px] leading-[1.55] text-ink-2"
                  >
                    <span
                      aria-hidden
                      className="mt-2 size-1 shrink-0 rounded-full"
                      style={{ background: p.accent, opacity: 0.85 }}
                    />
                    <span>
                      <span className="font-semibold text-ink">{b.lead}</span>{" "}
                      {b.body}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="relative flex-1" />

              <PersonaImage persona={p} />
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
