"use client";

import { useEffect, useRef } from "react";

const PARALLAX = 0.22;
const COLS = 62;
const ROWS = 30;
const CX = COLS / 2;
const CY = ROWS / 2;

// Monospace cells are ~2:1 (height:width) — squash dy by this so circles look round
const Y_SCALE = 2;

// Density ramp — each step is denser/heavier
const RAMP = " ·:+*▪█";

type Orbit = { r: number; count: number; speed: number; size: number };
const ORBITS: Orbit[] = [
  { r: 7, count: 4, speed: 0.55, size: 1.05 },
  { r: 12, count: 7, speed: -0.36, size: 0.9 },
  { r: 18, count: 10, speed: 0.22, size: 0.75 },
];

function rampChar(intensity: number): string {
  if (intensity <= 0) return RAMP[0];
  const idx = Math.min(
    RAMP.length - 1,
    Math.floor(intensity * (RAMP.length - 1) + 0.5),
  );
  return RAMP[idx];
}

export default function AsciiCommunity() {
  const ref = useRef<HTMLPreElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Parallax (skipped under prefers-reduced-motion)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let pending = false;
    const update = () => {
      pending = false;
      const el = wrapRef.current;
      if (!el) return;
      const offset = window.scrollY * PARALLAX;
      el.style.transform = `translate3d(-50%, calc(-50% + ${offset}px), 0)`;
    };
    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    const t0 = performance.now();
    const buf = new Float32Array(COLS * ROWS);

    const drawDisc = (
      cx: number,
      cy: number,
      radius: number,
      intensity: number,
    ) => {
      const r2 = radius * radius;
      const x0 = Math.max(0, Math.floor(cx - radius - 1));
      const x1 = Math.min(COLS, Math.ceil(cx + radius + 1));
      const y0 = Math.max(0, Math.floor(cy - radius / Y_SCALE - 1));
      const y1 = Math.min(ROWS, Math.ceil(cy + radius / Y_SCALE + 1));
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const dx = x - cx;
          const dy = (y - cy) * Y_SCALE;
          const d2 = dx * dx + dy * dy;
          if (d2 <= r2) {
            const fall = 1 - d2 / r2;
            const v = intensity * (0.55 + fall * 0.45);
            const i = y * COLS + x;
            if (v > buf[i]) buf[i] = v;
          }
        }
      }
    };

    const render = () => {
      const t = reduced ? 0 : (performance.now() - t0) / 1000;
      buf.fill(0);

      // Sparse, time-jittered background dither
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const n =
            Math.sin(x * 12.9898 + y * 78.233 + t * 0.15) * 43758.5453;
          const f = n - Math.floor(n);
          if (f < 0.04) buf[y * COLS + x] = 0.12;
        }
      }

      // Dashed orbital rings
      for (const orbit of ORBITS) {
        const r = orbit.r;
        for (let y = 0; y < ROWS; y++) {
          const dy = (y - CY) * Y_SCALE;
          for (let x = 0; x < COLS; x++) {
            const dx = x - CX;
            const d = Math.sqrt(dx * dx + dy * dy);
            const distFromRing = Math.abs(d - r);
            if (distFromRing < 0.7) {
              const ang = Math.atan2(dy, dx);
              const seg = (ang + t * 0.18) / 0.22;
              const onDash = Math.floor(seg) % 3 !== 0;
              if (onDash) {
                const a = 0.18 + (1 - distFromRing / 0.7) * 0.16;
                const i = y * COLS + x;
                if (a > buf[i]) buf[i] = a;
              }
            }
          }
        }
      }

      // Orbital "people"
      for (const orbit of ORBITS) {
        for (let i = 0; i < orbit.count; i++) {
          const theta =
            (i / orbit.count) * Math.PI * 2 + t * orbit.speed;
          const px = CX + orbit.r * Math.cos(theta);
          const py = CY + (orbit.r / Y_SCALE) * Math.sin(theta);
          drawDisc(px, py, orbit.size + 0.5, 0.86);
        }
      }

      // Pulsing center figure
      const pulse = 0.9 + Math.sin(t * 1.6) * 0.1;
      drawDisc(CX, CY, 2.4, pulse);

      // Compose into text
      const lines: string[] = [];
      for (let y = 0; y < ROWS; y++) {
        let line = "";
        for (let x = 0; x < COLS; x++) {
          line += rampChar(buf[y * COLS + x]);
        }
        lines.push(line);
      }
      if (ref.current) ref.current.textContent = lines.join("\n");

      if (!reduced) raf = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="hidden lg:block absolute left-[75%] top-1/2 pointer-events-none select-none will-change-transform"
      style={{ transform: "translate3d(-50%, -50%, 0)" }}
    >
      <pre
        ref={ref}
        className="font-mono text-[12px] leading-[12px] tracking-[0.02em] whitespace-pre m-0"
        style={{ color: "var(--color-ink)" }}
      />
    </div>
  );
}
