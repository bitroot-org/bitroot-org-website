import Link from "next/link";
import Container from "@/components/ui/Container";
import HeroHeadline from "./HeroHeadline";
import HeroCursors from "./HeroCursors";
import HeroCardFan from "./HeroCardFan";
import HeroCardMarquee from "./HeroCardMarquee";

export default function Hero() {
  return (
    <section className="relative -mt-16 md:-mt-20 pt-32 md:pt-40 pb-10 md:pb-0 overflow-hidden min-h-[820px] md:min-h-[900px] lg:min-h-[1020px]">
      <div aria-hidden className="absolute inset-0 square-grid-fade pointer-events-none" />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 520px at 18% 12%, rgba(186,168,255,0.32), transparent 65%), radial-gradient(820px 460px at 82% 14%, rgba(168,196,255,0.30), transparent 65%), radial-gradient(900px 540px at 12% 78%, rgba(255,206,184,0.34), transparent 65%), radial-gradient(820px 520px at 88% 80%, rgba(255,196,214,0.28), transparent 65%), radial-gradient(720px 460px at 50% 50%, rgba(255,255,255,0.55), transparent 70%)",
        }}
      />

      <Link
        href="/blog/"
        aria-label="Newslogger — open the blog"
        className="newslogger-card group absolute top-20 right-3 md:top-24 md:right-8 lg:right-12 z-30 inline-flex items-center gap-3 pl-3 pr-3.5 py-2 rounded-xl border border-line bg-paper/85 backdrop-blur-md shadow-[0_10px_28px_-16px_rgba(20,18,42,0.22)] hover-lift hover:border-ember/40 hover:shadow-[0_18px_40px_-18px_rgba(82,92,235,0.32)] transition-all"
      >
        <span
          aria-hidden
          className="relative inline-flex size-2 items-center justify-center"
        >
          <span className="absolute inline-flex size-full rounded-full bg-live/40 animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-live pulse-live" />
        </span>
        <span className="flex flex-col items-start leading-[1.15]">
          <span className="font-display text-[13px] font-semibold text-ink">
            Newslogger
          </span>
          <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-4 group-hover:text-ember transition-colors">
            Live · Blog{" "}
            <span aria-hidden className="inline-block translate-x-0 group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </span>
        </span>
      </Link>

      <HeroCursors />

      <Container>
        <div className="relative z-10 max-w-[760px] mx-auto text-center pt-6 md:pt-10">
          <span className="eyebrow-mono">early access · the founder&apos;s toolbox</span>
          <HeroHeadline />
          <p className="text-[16.5px] md:text-[17px] text-ink-3 max-w-[58ch] mx-auto text-pretty mt-5">
            Free kits, apps, guides, and tools for founders shipping their
            first product. One quiet hub. No noise.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#lanes"
              className="hover-lift inline-flex items-center gap-2 h-[40px] px-5 rounded-full bg-ink text-paper text-[14px] font-medium hover:bg-[#2a282d] transition-colors"
            >
              Explore Now <span aria-hidden>→</span>
            </a>
            <a
              href="#club"
              className="hover-lift inline-flex items-center gap-2 h-[40px] px-5 rounded-full border border-line-2 text-ink text-[14px] font-medium hover:bg-paper-2 transition-colors"
            >
              Join the Club
            </a>
          </div>

          <HeroCardMarquee />
        </div>
      </Container>

      <HeroCardFan />
    </section>
  );
}
