import Container from "@/components/ui/Container";
import PixelSteps from "@/components/ui/PixelSteps";
import VibeText from "@/components/vibe/VibeText";

/** Full-bleed accent band with the one-paragraph manifesto. */
export default function GzManifesto() {
  return (
    <section className="relative overflow-hidden bg-pop text-pop-ink">
      <PixelSteps
        cells={[[0, 0], [1, 1], [2, 2]]}
        tone="paper"
        className="absolute right-0 top-0"
        unit="clamp(22px, 3.7vw, 56px)"
        style={{ transform: "scaleX(-1)" }}
      />
      <PixelSteps
        cells={[[0, 0], [1, 1, 2]]}
        tone="paper"
        className="absolute bottom-0 left-0"
        unit="clamp(22px, 3.7vw, 56px)"
      />
      <Container>
        <p className="m-0 max-w-[30ch] py-[clamp(72px,11vw,150px)] font-display text-[clamp(28px,3.6vw,50px)] font-semibold leading-[1.22] tracking-[-0.03em]">
          <VibeText
            bruh={
              <>
                Bitroot exists <span aria-hidden>/</span> to hand creators the AI tools worth
                installing: <span className="font-alt">skills</span>, plugins,{" "}
                <span className="font-alt">MCP servers</span> and CLIs, sorted by what you make, with{" "}
                <span className="band-caret">one command</span> to install <span aria-hidden>☺</span>
              </>
            }
            baddie={
              <>
                Bitroot is your plug <span aria-hidden>✦</span> for AI tools that actually slay:{" "}
                <span className="font-alt">skills</span>, plugins, <span className="font-alt">MCP servers</span>{" "}
                and CLIs, picked for what you make, with <span className="band-caret">one tap</span> to
                copy <span aria-hidden>♡</span>
              </>
            }
          />
        </p>
      </Container>
    </section>
  );
}
