import Container from "@/components/ui/Container";

const reels = [
  {
    title: "How founders use Bitroot",
    desc: "Real workflows. Real use cases.",
    scene: "reel-scene",
  },
  {
    title: "Shipping faster with kits",
    desc: "From idea to live.",
    scene: "reel-scene-2",
  },
  {
    title: "Picking the right tools",
    desc: "What actually works.",
    scene: "reel-scene-3",
  },
];

export default function ReelsSection() {
  return (
    <section id="watch" className="py-18">
      <Container>
        <div className="flex items-end justify-between gap-6 mb-9">
          <div>
            <span className="eyebrow-mono">watch</span>
            <h2 className="font-sans mt-2.5 text-[clamp(30px,3.4vw,42px)] font-semibold tracking-[-0.03em] leading-[1.05]">
              What we&rsquo;re sharing.
            </h2>
          </div>
          <div className="font-mono text-[12px] text-ink-4 hidden md:block">
            no signup · no fluff
          </div>
        </div>

        <div className="flex flex-col items-center md:flex-row md:justify-center gap-5">
          {reels.map((r) => (
            <button
              key={r.title}
              type="button"
              className="group relative w-full max-w-[360px] md:w-[260px] md:h-[460px] aspect-[9/16] md:aspect-auto rounded-[16px] overflow-hidden border border-line bg-ink shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex-none"
            >
              <div
                className={`absolute inset-0 ${r.scene} flex items-center justify-center`}
              >
                <span className="w-[60px] h-[60px] rounded-full bg-ink text-paper grid place-items-center text-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.25)] group-hover:scale-110 transition-transform">
                  ▶
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-paper text-left">
                <h4 className="m-0 text-[15px] font-semibold">{r.title}</h4>
                <p className="m-0 mt-0.5 text-[12px] opacity-80">{r.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
