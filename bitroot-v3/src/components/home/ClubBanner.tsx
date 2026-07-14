"use client";

import { useEffect, useRef, useState } from "react";
import Container from "@/components/ui/Container";
import TrackedLink from "@/components/ui/TrackedLink";

const MEMBER_AVATARS = [
  { initials: "JK", grad: "from-[#7782ee] to-[#3d3b40]" },
  { initials: "RM", grad: "from-[#bfcfe7] to-[#525ceb]" },
  { initials: "SA", grad: "from-[#c9cef5] to-[#525ceb]" },
  { initials: "EL", grad: "from-[#a8a5cf] to-[#3d3b40]" },
];

export default function ClubBanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Use a ref (not state) for isVisible so the animation loop reads the latest
  // value without needing to be recreated whenever visibility changes.
  const isVisibleRef = useRef(false);
  const frameRef = useRef<number>();
  const starsRef = useRef<Array<{ x: number; y: number; r: number; speed: number; opacity: number }>>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  // canvasReady prevents a white flash before the canvas gradient is painted.
  const [canvasReady, setCanvasReady] = useState(false);

  // ── Detect prefers-reduced-motion ────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // ── Single starfield effect: setup + animation loop in one useEffect ─────
  // This avoids the AI's bug where a second useEffect re-initialised stars on
  // every isVisible change, causing stutter and redundant RAF loops.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext("2d");
    } catch (_) {
      // Canvas not supported — fallback background via CSS is already applied.
      return;
    }
    if (!ctx) return;

    setCanvasReady(true);

    const initStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 8000);
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.3,
      }));
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initStars();
    };

    // Single RAF loop — pauses drawing (but keeps the loop alive) when
    // the banner is not in the viewport, as required by the ticket.
    const draw = () => {
      if (ctx && canvas && isVisibleRef.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        starsRef.current.forEach(star => {
          star.y += star.speed;
          if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
          }
          ctx!.beginPath();
          ctx!.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(199, 206, 245, ${star.opacity})`;
          ctx!.fill();
        });
      }
      frameRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);

    // IntersectionObserver — pause animation when scrolled out of view.
    const observer = new IntersectionObserver(
      entries => { isVisibleRef.current = entries[0]?.isIntersecting ?? false; },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [prefersReducedMotion]);

  // Dark background applied via CSS when canvas is not yet ready or when
  // prefers-reduced-motion is on — ensures the content is always visible.
  const fallbackBg = "linear-gradient(160deg, #14132b 0%, #1c1a3a 50%, #211e44 100%)";

  return (
    <section id="club" className="py-12">
      <Container>
        <div
          className="relative overflow-hidden rounded-[22px] text-[#eae6f5] px-8 py-14 shadow-[0_30px_80px_-30px_rgba(20,18,42,0.6),0_0_0_1px_rgba(82,92,235,0.18)]"
          style={{
            minHeight: "280px",
            // Show fallback gradient when canvas not ready or motion reduced
            background: !canvasReady || prefersReducedMotion ? fallbackBg : "transparent",
          }}
        >
          {/* Starfield canvas — full-bleed, sits behind all content */}
          {!prefersReducedMotion && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ background: fallbackBg }}
              aria-hidden="true"
            />
          )}

          {/* Subtle grid overlay (matches the reference GIF) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(82,92,235,0.06) 1px, transparent 1px)," +
                "linear-gradient(90deg, rgba(82,92,235,0.06) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center gap-6">
            {/* Heading block */}
            <div className="flex flex-col items-center gap-3">
              {/* Eyebrow — monospace, small caps style matching the GIF */}
              <span
                className="font-mono text-[11px] tracking-[0.18em] uppercase"
                style={{ color: "#c9cef5" }}
              >
                -/ community
              </span>

              <h2 className="font-sans text-white text-[clamp(30px,4vw,46px)] font-bold tracking-[-0.03em] leading-[1.05] m-0">
                Bitroot Club
              </h2>

              {/* Body copy — matches ticket description + reference GIF exactly */}
              <div className="flex flex-col gap-1.5 max-w-[640px]">
                <p className="text-white text-[15px] leading-[1.55] m-0">
                  Priority support, new apps, kits, tools, and deals before they go public.
                </p>
                <p className="text-[14px] leading-[1.5] m-0" style={{ color: "#c9c2dd" }}>
                  Everything you need to design, build, launch, and grow your product, in one place.
                </p>
              </div>
            </div>

            {/* Action row — wraps cleanly on mobile per ticket requirements */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* Primary CTA */}
              <TrackedLink
                label="Join the Club"
                location="club_banner"
                href="https://bitroot.club"
                className="inline-flex items-center gap-2 h-[42px] px-6 rounded-full bg-[#525ceb] text-white text-[14px] font-medium hover:bg-[#4350d9] transition-colors whitespace-nowrap"
              >
                Join the Club <span aria-hidden="true">→</span>
              </TrackedLink>

              {/* Secondary CTA — keeping original destination */}
              <a
                href="https://bitroot.club/members"
                className="inline-flex items-center gap-2 h-[42px] px-6 rounded-full border border-white/25 text-white text-[14px] font-medium hover:bg-white/[0.06] hover:border-white/40 transition-colors whitespace-nowrap"
              >
                See who&apos;s inside
              </a>

              {/* Thin vertical divider — hidden on small screens when row wraps */}
              <div
                className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent flex-shrink-0"
                aria-hidden="true"
              />

              {/* Member avatars + count */}
              <div className="flex items-center gap-3">
                <div className="flex items-center" aria-label="Member avatars">
                  {MEMBER_AVATARS.map((a, i) => (
                    <div
                      key={a.initials}
                      className={`w-[34px] h-[34px] rounded-full border-2 border-[#191638] bg-gradient-to-br ${a.grad} grid place-items-center font-mono text-[10px] text-white font-medium shadow-[0_0_10px_rgba(82,92,235,0.35)] ${i === 0 ? "" : "-ml-2"}`}
                      aria-hidden="true"
                    >
                      {a.initials}
                    </div>
                  ))}
                </div>
                <span className="text-white text-[14px] font-medium">412 members</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}