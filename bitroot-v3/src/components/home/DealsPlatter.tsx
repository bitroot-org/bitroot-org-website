import Container from "@/components/ui/Container";

type Deal = {
  brand: string;
  brandAccent: string;
  badge: string;
  title: string;
  blurb: string;
  save: string;
  href: string;
};

const deals: Deal[] = [
  {
    brand: "linear",
    brandAccent: ".",
    badge: "Up to $9k",
    title: "Linear",
    blurb: "6 months free on Standard plans for new teams under 10.",
    save: "save $720",
    href: "#",
  },
  {
    brand: "vercel",
    brandAccent: "▲",
    badge: "3 months",
    title: "Vercel Pro",
    blurb: "Three months of Pro on the house. Push, preview, ship.",
    save: "save $60",
    href: "#",
  },
  {
    brand: "resend",
    brandAccent: "@",
    badge: "12 months",
    title: "Resend",
    blurb: "50k transactional emails monthly — full year, on us.",
    save: "save $240",
    href: "#",
  },
  {
    brand: "posthog",
    brandAccent: "●",
    badge: "$50k credits",
    title: "PostHog",
    blurb: "Analytics, session replay, flags. $50k startup credits.",
    save: "save $50k",
    href: "#",
  },
  {
    brand: "retool",
    brandAccent: "▢",
    badge: "6 months",
    title: "Retool",
    blurb: "Build internal tools in an afternoon. Half a year free.",
    save: "save $1.8k",
    href: "#",
  },
  {
    brand: "notion",
    brandAccent: "▣",
    badge: "$1k credit",
    title: "Notion",
    blurb: "Plus plan credits for the whole team for a year.",
    save: "save $1k",
    href: "#",
  },
];

export default function DealsPlatter() {
  return (
    <section id="deals" className="py-18">
      <Container>
        <div className="flex items-end justify-between gap-6 mb-9">
          <div>
            <span className="eyebrow-mono">deals · platter</span>
            <h2 className="font-sans mt-2.5 text-[clamp(30px,3.4vw,42px)] font-semibold tracking-[-0.03em] leading-[1.05]">
              Free credits &amp; deals for your{" "}
              <span className="serif-em">stack.</span>
            </h2>
          </div>
          <div className="font-mono text-[12px] text-ink-4 hidden md:block">
            refreshed every Monday
          </div>
        </div>
      </Container>

      <Container>
        <div className="platter-scroll flex gap-4 overflow-x-auto pb-2 -mx-5 sm:-mx-8 lg:-mx-10 px-5 sm:px-8 lg:px-10 snap-x snap-mandatory">
          {deals.map((d) => (
            <a
              key={d.title}
              href={d.href}
              className="group flex-none w-[280px] bg-paper border border-line rounded-[16px] overflow-hidden text-inherit no-underline hover:border-line-2 hover:-translate-y-0.5 transition-all snap-start"
            >
              <div className="relative aspect-[16/9] bg-paper-2 border-b border-line flex items-center justify-center">
                <span className="font-mono font-semibold text-[18px] text-ink tracking-[-0.01em]">
                  {d.brand}
                  <span className="text-ember">{d.brandAccent}</span>
                </span>
                <span className="absolute top-2.5 right-2.5 bg-ink text-paper font-mono text-[10px] tracking-[0.04em] uppercase px-2 py-1 rounded">
                  {d.badge}
                </span>
              </div>
              <div className="p-4 pt-3.5">
                <h4 className="m-0 mb-1 text-[15px] font-semibold tracking-[-0.01em]">
                  {d.title}
                </h4>
                <p className="m-0 mb-3 text-[13px] text-ink-3 leading-[1.45]">
                  {d.blurb}
                </p>
                <div className="flex items-center justify-between font-mono text-[11.5px]">
                  <span className="text-ember font-medium">{d.save}</span>
                  <span className="text-ink-2 group-hover:text-ember group-hover:translate-x-1 transition-all">
                    claim →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
