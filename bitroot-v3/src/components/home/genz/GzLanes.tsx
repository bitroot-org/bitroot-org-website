import Link from "next/link";
import Container from "@/components/ui/Container";
import PixelHeading from "@/components/ui/PixelHeading";
import VibeText from "@/components/vibe/VibeText";
import VibeImage from "@/components/vibe/VibeImage";
import { itemsForPersona, PERSONA_META, PERSONA_ORDER, type Persona } from "@/content/catalog";

const PHOTO: Record<Persona, { src: string; alt: string }> = {
  creators: {
    src: "/genz/persona-creators",
    alt: "A creator filming themselves on a phone under a ring light",
  },
  "vibe-coders": {
    src: "/genz/persona-vibe-coders",
    alt: "A developer coding late at night on a laptop",
  },
  founders: {
    src: "/genz/persona-founders",
    alt: "A founder on a rooftop at dusk with a coffee and a phone",
  },
};

/** Stagger the three cards like the reference's About list. */
const OFFSET = ["md:mt-0", "md:mt-20", "md:mt-40"];

/** "Pick your lane": one poster card per persona. */
export default function GzLanes() {
  return (
    <section aria-labelledby="lanes-h" className="py-[clamp(80px,10vw,140px)]">
      <Container>
        <PixelHeading id="lanes-h">
          <VibeText bruh="Pick your lane" baddie="Pick your era" /> <span aria-hidden className="emoji">🛣️</span>
        </PixelHeading>
        <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
          {PERSONA_ORDER.map((p, i) => {
            const meta = PERSONA_META[p];
            const count = itemsForPersona(p).length;
            return (
              <Link key={p} href={meta.path} className={`group block text-inherit no-underline ${OFFSET[i]}`}>
                <div className="grain relative aspect-[3/4] overflow-hidden bg-ink r-vibe-lg">
                  <VibeImage
                    src={PHOTO[p].src}
                    alt={PHOTO[p].alt}
                    sizes="(min-width: 768px) 380px, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <span className="card-tab">
                    <span aria-hidden className="emoji mr-1.5">{meta.emoji}</span>
                    {meta.short}
                  </span>
                  <span className="sticker absolute bottom-4 left-4 rotate-[-3deg] transition-transform duration-300 group-hover:rotate-[2deg]">
                    {count} {count === 1 ? "pick" : "picks"} <span aria-hidden className="emoji">→</span>
                  </span>
                </div>
                <h3 className="m-0 mt-6 font-display text-[clamp(26px,2.4vw,34px)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink transition-colors group-hover:text-ember">
                  {meta.label}
                </h3>
                <p className="m-0 mt-2 max-w-[42ch] text-[16px] leading-[1.6] text-ink-2">{meta.blurb}</p>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
