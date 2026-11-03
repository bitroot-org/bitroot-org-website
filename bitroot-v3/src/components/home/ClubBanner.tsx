import VibeImage from "@/components/vibe/VibeImage";
import Container from "@/components/ui/Container";
import PixelSteps from "@/components/ui/PixelSteps";
import TrackedLink from "@/components/ui/TrackedLink";

const MEMBER_AVATARS = ["JK", "RM", "SA", "EL"];

/**
 * Bitroot Club banner in the genz system: an ink card with a grainy
 * poster-burn photo, pixel steps and pill CTAs. Links, copy, the member count
 * and the `cta_click` tracking (label "Join the Club", location "club_banner")
 * are unchanged from the previous banner.
 */
export default function ClubBanner() {
  return (
    <section id="club" className="py-[clamp(48px,7vw,96px)]">
      <Container>
        <div className="grain relative isolate grid overflow-hidden bg-ink text-paper r-vibe-lg md:grid-cols-[1.08fr_1fr]">
          {/* Photo panel */}
          <div className="relative order-first min-h-[260px] md:order-last md:min-h-[460px]">
            <VibeImage
              src="/genz/club-crew"
              alt="A small crew of creators and developers working around a table at night"
              sizes="(min-width: 768px) 560px, 100vw"
              className="object-cover object-[22%_60%]"
            />
            {/* Fade the photo into the ink card on the copy side. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent md:bg-gradient-to-r md:from-ink md:via-ink/0 md:to-transparent"
            />
            <PixelSteps
              cells={[[0, 0], [1, 1], [2, 2]]}
              tone="pop"
              className="absolute right-0 top-0"
              unit="clamp(18px, 2.6vw, 40px)"
              style={{ transform: "scaleX(-1)" }}
            />
            <span className="sticker absolute bottom-5 right-5 rotate-[-6deg] md:bottom-8 md:right-8">
              <span aria-hidden className="emoji">✨</span> Drops before they go public
            </span>
          </div>

          {/* Copy */}
          <div className="relative z-[1] flex flex-col justify-center gap-6 px-6 py-10 sm:px-10 md:py-14 lg:px-14">
            <p className="m-0 font-mono text-[12px] uppercase tracking-[0.16em] text-paper/70">
              <span aria-hidden className="emoji mr-2">🫂</span>-/ community
            </p>
            <h2 className="m-0 leading-[0.92]">
              <span className="block font-display text-[clamp(44px,6vw,84px)] font-bold tracking-[-0.045em]">
                Bitroot
              </span>
              <span className="block pl-[10%] font-alt text-[clamp(44px,6vw,84px)] text-tab">
                Club <span aria-hidden className="emoji text-[0.55em]">🪩</span>
              </span>
            </h2>
            <div className="flex max-w-[46ch] flex-col gap-2">
              <p className="m-0 text-[17px] leading-[1.55] text-paper">
                Priority support, new apps, kits, tools, and deals before they go public.
              </p>
              <p className="m-0 text-[15px] leading-[1.55] text-paper/70">
                Everything you need to design, build, launch, and grow your product, in one place.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <TrackedLink
                label="Join the Club"
                location="club_banner"
                href="https://bitroot.club"
                className="inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full bg-pop px-6 text-[15px] font-semibold text-pop-ink no-underline transition-transform hover:-translate-y-0.5"
              >
                Join the Club <span aria-hidden className="emoji">🚀</span>
              </TrackedLink>
              <a
                href="https://bitroot.club/members"
                className="inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full border-[1.5px] border-paper/40 px-6 text-[15px] font-semibold text-paper no-underline transition-colors hover:border-paper hover:bg-paper/10"
              >
                See who&apos;s inside <span aria-hidden className="emoji">👀</span>
              </a>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center" aria-hidden>
                {MEMBER_AVATARS.map((initials, i) => (
                  <span
                    key={initials}
                    className={`grid size-9 place-items-center rounded-full border-2 border-ink font-mono text-[10px] font-semibold ${
                      i % 2 ? "bg-tab text-[var(--vibe-ink)]" : "bg-pop text-pop-ink"
                    } ${i === 0 ? "" : "-ml-2.5"}`}
                  >
                    {initials}
                  </span>
                ))}
              </div>
              <span className="text-[14px] font-medium text-paper">412 members</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
