"use client";

import { useEffect, useRef } from "react";

const CELL = 12; // mini square cell size, px
const FILL_BASE_ALPHA = 0.04;
const FILL_HOVER_ALPHA = 0.55;
const STROKE = "rgba(82, 92, 235, 0.18)";

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

    let raf = 0;
    const tick = () => {
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

      for (let i = bursts.length - 1; i >= 0; i--) {
        bursts[i].r += 6;
        if (bursts[i].r > Math.max(cssW, cssH) * 1.2) bursts.splice(i, 1);
      }

      raf = requestAnimationFrame(tick);
    };

    sizeCanvas();
    tick();

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
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);

    const ro = new ResizeObserver(sizeCanvas);
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
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
