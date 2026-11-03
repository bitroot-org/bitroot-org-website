import Link from "next/link";
import Container from "@/components/ui/Container";
import PixelSteps from "@/components/ui/PixelSteps";
import VibeText from "@/components/vibe/VibeText";
import HeroCycler from "./HeroCycler";
import { catalog, PERSONA_META, PERSONA_ORDER, itemsForPersona } from "@/content/catalog";

/** Hero, after the reference: huge two-face headline, pixel stairs, ruled nav. */
export default function GzHero() {
  const live = catalog.filter((i) => i.status === "live").length;
  return (
    <section className="relative overflow-hidden pb-20 pt-8 sm:pb-28">
      <Container>
        <div className="flex flex-wrap justify-end gap-x-16 gap-y-2 font-mono text-[12px] leading-[1.45] text-ink-3">
          <p className="m-0">
            Bitroot™
            <br />
            Skills · Plugins · MCP · CLI
          </p>
          <p className="m-0">
            {live} picks live
            <br />
            New drops every week <span aria-hidden>✨</span>
          </p>
        </div>
      </Container>

      <PixelSteps
        cells={[[0, 0], [1, 1, 2]]}
        className="absolute right-0 top-[14%] sm:top-[18%]"
        unit="clamp(22px, 3.7vw, 56px)"
      />
      <PixelSteps
        cells={[[0, 0], [1, 1], [2, 2, 2], [4, 3]]}
        className="absolute left-0 top-[36%] hidden min-[1400px]:block"
        unit="clamp(26px, 2.3vw, 40px)"
      />

      <Container>
        <HeroCycler className="mt-[clamp(56px,10vw,150px)] text-display" />

        <div className="mt-[clamp(56px,9vw,120px)] grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <p className="m-0 font-display text-[clamp(28px,3.4vw,46px)] font-semibold leading-[1.12] tracking-[-0.03em] text-ink">
            <VibeText
              bruh={
                <>
                  Built by creators.
                  <br />
                  For <span className="font-alt">content creators</span>, <span className="font-alt">vibe coders</span> &amp;{" "}
                  <span className="font-alt">founders</span>.
                </>
              }
              baddie={
                <>
                  Main-character tools.
                  <br />
                  For <span className="font-alt">content creators</span>, <span className="font-alt">coders</span> &amp;{" "}
                  <span className="font-alt">founders</span> who serve.
                </>
              }
            />
          </p>
          <nav aria-label="Pick your lane" className="self-end">
            {PERSONA_ORDER.map((p) => (
              <Link key={p} href={PERSONA_META[p].path} className="rule-row">
                <span aria-hidden className="emoji">{PERSONA_META[p].emoji}</span>
                {PERSONA_META[p].label}
                <span className="ml-2 font-mono text-[12px] text-ink-4">{itemsForPersona(p).length}</span>
                <span className="rule-arrow" aria-hidden>
                  ⟶
                </span>
              </Link>
            ))}
            <a href="#drops" className="rule-row">
              <span aria-hidden className="emoji">👀</span>
              Browse everything
              <span className="rule-arrow" aria-hidden>
                ⟶
              </span>
            </a>
          </nav>
        </div>
      </Container>
    </section>
  );
}
