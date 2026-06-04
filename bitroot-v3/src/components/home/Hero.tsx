import Container from "@/components/ui/Container";
import TrackedLink from "@/components/ui/TrackedLink";
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
            <TrackedLink
              label="Explore Now"
              location="hero"
              href="#lanes"
              className="hover-lift inline-flex items-center gap-2 h-[40px] px-5 rounded-full bg-ink text-paper text-[14px] font-medium hover:bg-[#2a282d] transition-colors"
            >
              Explore Now <span aria-hidden>→</span>
            </TrackedLink>
            <TrackedLink
              label="Join the Club"
              location="hero"
              href="#club"
              className="hover-lift inline-flex items-center gap-2 h-[40px] px-5 rounded-full border border-line-2 text-ink text-[14px] font-medium hover:bg-paper-2 transition-colors"
            >
              Join the Club
            </TrackedLink>
          </div>

          <HeroCardMarquee />
        </div>
      </Container>

      <HeroCardFan />
    </section>
  );
}
