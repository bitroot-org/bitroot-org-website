"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const PARALLAX = 0.28; // 0 = no parallax, 1 = locked to viewport


export default function HeroPhone() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let pending = false;

    const update = () => {
      pending = false;
      const el = ref.current;
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

  return (
    <div
      ref={ref}
      aria-hidden
      className="hidden lg:block absolute left-[75%] top-1/2 w-[220px] xl:w-[260px] pointer-events-none select-none will-change-transform"
      style={{ transform: "translate3d(-50%, -50%, 0)" }}
    >
      {/* Faded mini square grid behind the phone — larger surface */}
      <div
        className="absolute -inset-y-[55%] -inset-x-[80%] [mask-image:radial-gradient(ellipse,black_25%,transparent_72%)] [-webkit-mask-image:radial-gradient(ellipse,black_25%,transparent_72%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(82,92,235,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(82,92,235,0.28) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />

      {/* Ambient purple glow under the phone */}
      <div
        className="absolute -inset-10 rounded-[40%] blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, rgba(120, 60, 220, 0.30), rgba(82, 92, 235, 0.12) 40%, transparent 75%)",
        }}
      />

      {/* Phone */}
      <Image
        src="/hero-phone.png"
        alt="Bitroot Founder's Kit"
        width={2112}
        height={4563}
        sizes="(min-width: 1280px) 260px, 220px"
        priority
        className="relative w-full h-auto"
        style={{
          filter:
            "drop-shadow(0 18px 30px rgba(40,18,80,0.25)) drop-shadow(0 40px 70px rgba(40,18,80,0.30))",
        }}
      />
    </div>
  );
}
