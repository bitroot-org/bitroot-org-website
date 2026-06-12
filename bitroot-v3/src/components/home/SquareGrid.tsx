"use client";

import { useEffect, useRef } from "react";

const CELL = 12; // mini square cell size, px
const FILL_BASE_ALPHA = 0.04;
const FILL_HOVER_ALPHA = 0.55;
const STROKE = "rgba(82, 92, 235, 0.18)";
// Cap the loop at ~30fps — plenty for a background effect, half the work.
const FRAME_MS = 1000 / 30;
// Burst wavefront speed in px/sec (the old loop stepped 6px per 60fps frame).
const BURST_SPEED = 360;

type Burst = { x: number; y: number; r: number };

export default function SquareGrid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Decorative-only; skip on mobile and when reduced motion is preferred.
    // The full-grid RAF was thrashing mobile GPUs and triggering browser OOM.
    if (typeof window !== "undefined") {
      if (window.matchMedia("(max-width: 767px)").matches) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointer = { x: -1e6, y: -1e6 };
    const bursts: Burst[] = [];
    let cssW = 0;
    let cssH = 0;

    const sizeCanvas = () => {
      const rect = wrap.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
    };

    const drawCell = (
      cx: number,
      cy: number,
      size: number,
      fill: string,
      stroke: string,
    ) => {
      const half = size / 2;
      ctx.beginPath();
      ctx.rect(cx - half, cy - half, size, size);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    };

    const drawFrame = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      const cols = Math.ceil(cssW / CELL) + 2;
      const rows = Math.ceil(cssH / CELL) + 2;

      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const cx = c * CELL + CELL / 2;
          const cy = r * CELL + CELL / 2;

          const pdx = cx - pointer.x;
          const pdy = cy - pointer.y;
          const proximity = Math.exp(-(pdx * pdx + pdy * pdy) / 4500);

          let burstAlpha = 0;
          let dispX = 0;
          let dispY = 0;
          for (const b of bursts) {
            const bdx = cx - b.x;
            const bdy = cy - b.y;
            const dist = Math.hypot(bdx, bdy);
            const wave = Math.exp(-Math.abs(dist - b.r) / 28);
            if (dist > 0.001) {
              dispX += (bdx / dist) * wave * 8;
              dispY += (bdy / dist) * wave * 8;
            }
            burstAlpha = Math.max(burstAlpha, wave);
          }

          const alpha = Math.min(
            FILL_BASE_ALPHA + proximity * FILL_HOVER_ALPHA + burstAlpha * 0.4,
            0.78,
          );
          const size =
            CELL * 0.92 * (1 + proximity * 0.12 + burstAlpha * 0.08);
          const stroke =
            proximity > 0.05 || burstAlpha > 0.05
              ? `rgba(82, 92, 235, ${0.22 + proximity * 0.5})`
              : STROKE;

          drawCell(
            cx + dispX,
            cy + dispY,
            size,
            `rgba(82, 92, 235, ${alpha})`,
            stroke,
          );
        }
      }
    };

    const advanceBursts = (dt: number) => {
      const step = (BURST_SPEED * dt) / 1000;
      for (let i = bursts.length - 1; i >= 0; i--) {
        bursts[i].r += step;
        if (bursts[i].r > Math.max(cssW, cssH) * 1.2) bursts.splice(i, 1);
      }
    };

    // The loop only runs while the section is on screen AND there is
    // something to animate (an active burst or the pointer over the section).
    // Once idle, the final frame already painted the static base grid, so we
    // simply stop scheduling frames.
    let raf = 0;
    let running = false;
    let onScreen = false;
    let lastFrame = 0;

    const isIdle = () => bursts.length === 0 && pointer.x < -1e5;

    const tick = (t: number) => {
      if (!onScreen) {
        running = false;
        raf = 0;
        return;
      }
      if (t - lastFrame < FRAME_MS) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const dt = lastFrame === 0 ? FRAME_MS : Math.min(t - lastFrame, 100);
      lastFrame = t;
      drawFrame();
      advanceBursts(dt);
      if (isIdle()) {
        running = false;
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (running || !onScreen) return;
      running = true;
      lastFrame = 0;
      raf = requestAnimationFrame(tick);
    };

    sizeCanvas();
    // Paint the static grid immediately so the section never flashes blank
    // before the IntersectionObserver fires.
    drawFrame();

    const insideRect = (cx: number, cy: number) => {
      const rect = wrap.getBoundingClientRect();
      return (
        cx >= rect.left &&
        cx <= rect.right &&
        cy >= rect.top &&
        cy <= rect.bottom
      );
    };

    const onMove = (e: PointerEvent) => {
      if (!insideRect(e.clientX, e.clientY)) {
        pointer.x = -1e6;
        pointer.y = -1e6;
        return;
      }
      const rect = wrap.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      if (!insideRect(e.clientX, e.clientY)) return;
      if (
        (e.target as HTMLElement)?.closest(
          "[data-sticker], a, button, input, [role='button']",
        )
      ) {
        return;
      }
      const rect = wrap.getBoundingClientRect();
      bursts.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        r: 0,
      });
      wake();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) wake();
      },
      { rootMargin: "120px" },
    );
    io.observe(wrap);

    const ro = new ResizeObserver(() => {
      sizeCanvas();
      // Resizing clears the canvas; repaint the static grid if the loop is
      // parked (a running loop repaints on its next frame anyway).
      if (!running) drawFrame();
    });
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
