import Link from "next/link";
import Container from "@/components/ui/Container";
import ClubNudge from "@/components/ui/ClubNudge";

export const metadata = {
  title: "Community — bitroot.org",
  description:
    "Discord, GitHub Discussions, and weekly office hours. The peer-to-peer side of the toolbox.",
};

const channels = [
  {
    name: "Discord",
    tagline: "The always-on room.",
    description:
      "A small, opinionated server. Channels for Kits, Stacks, Guides, and a #show-and-tell for weekend builds. No bots, no gated roles, no NFT tax.",
    cta: "Join the Discord",
    href: "https://discord.gg/bitroot",
    handle: "discord.gg/bitroot",
    icon: "💬",
  },
  {
    name: "GitHub Discussions",
    tagline: "Async, search-friendly.",
    description:
      "Ask longer questions, propose new guides, file kit requests, or pitch a tool. Every answer gets indexed so the next person can find it.",
    cta: "Open a discussion",
    href: "https://github.com/bitroot/bitroot/discussions",
    handle: "github.com/bitroot/bitroot",
    icon: "⌘",
  },
  {
    name: "Office Hours",
    tagline: "Live, every Thursday.",
    description:
      "One hour, public Google Meet, no agenda beyond whatever founders show up with. We screen-share, debug, and tell you which parts of your stack we&apos;d kill.",
    cta: "Grab a slot",
    href: "/community#office-hours",
    handle: "Thursdays · 5pm UTC",
    icon: "◎",
  },
];

const principles = [
  {
    k: "01",
    title: "Generous by default",
    body: "If someone new shows up with a dumb question, it isn't a dumb question. Answer with the context you wish you'd had.",
  },
  {
    k: "02",
    title: "Opinions > tone",
    body: "Disagreement is great. Condescension isn't. We'd rather you argue a pick than hedge the answer.",
  },
  {
    k: "03",
    title: "Ship over theory",
    body: "Links to running projects and working code beat links to thinkpieces. Show what you built.",
  },
  {
    k: "04",
    title: "No pitching",
    body: "Don't drop affiliate links, crypto stuff, or your course. If you have a genuine product, answer questions and people will find you.",
  },
];

export default function CommunityPage() {
  return (
    <>
      <section className="pt-14 pb-10 border-b border-line bg-paper-2/40">
        <Container size="narrow">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-3">
            ~/ community
          </div>
          <h1 className="font-display text-4xl md:text-[56px] font-extrabold text-ink leading-[1.02] tracking-tight">
            Small room,<br /> loud signal
            <span className="text-ember">.</span>
          </h1>
          <p className="mt-5 text-[16px] text-ink-3 leading-relaxed max-w-2xl">
            Three places to hang out and one rule: we&apos;d rather have 200
            founders who actually ship than 20,000 lurkers. Everything here is
            opt-in, read-only unless you want otherwise, and free forever.
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {channels.map((ch) => (
              <a
                key={ch.name}
                href={ch.href}
                target={ch.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="repo-card group block rounded-2xl border border-line bg-paper p-6"
              >
                <div className="text-2xl mb-3 opacity-80">{ch.icon}</div>
                <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-ember mb-1.5">
                  {ch.tagline}
                </div>
                <h3 className="font-display text-[22px] font-bold text-ink group-hover:text-ember transition-colors leading-tight mb-3">
                  {ch.name}
                </h3>
                <p className="text-[13.5px] text-ink-3 leading-relaxed mb-5">
                  {ch.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-line/80">
                  <span className="font-mono text-[11px] text-ink-4">
                    {ch.handle}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[12px] font-mono text-ink-3 group-hover:text-ember transition-colors">
                    {ch.cta}
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>

      <section
        id="office-hours"
        className="py-14 border-t border-line bg-paper-2/30"
      >
        <Container size="narrow">
          <div className="rounded-2xl border border-line bg-paper p-8 md:p-10">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-3">
              ~/ office hours
            </div>
            <h2 className="font-display text-[30px] md:text-[36px] font-bold text-ink tracking-tight leading-[1.1]">
              Thursdays, 5pm UTC. One hour.
            </h2>
            <p className="mt-4 text-[15px] text-ink-3 leading-relaxed">
              No agenda. Show up with a problem — a bug, a deployment mystery,
              a copy question, a pricing nerves-strike — and we&apos;ll
              screen-share through it. Every session gets a public recap in
              Discord so the takeaways don&apos;t vanish.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href="https://cal.com/bitroot/office-hours"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-ink text-paper text-[13px] font-medium rounded-lg px-4 py-2.5 hover:bg-ink-2 transition-colors"
              >
                Reserve a slot →
              </a>
              <span className="text-[12px] font-mono text-ink-4">
                free · public · 6-person cap per week
              </span>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 border-t border-line">
        <Container>
          <div className="mb-8">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-2">
              ~/ how we act here
            </div>
            <h2 className="font-display text-[30px] md:text-[36px] font-bold text-ink tracking-tight leading-[1.05]">
              Four rules. That&apos;s it.
            </h2>
          </div>

          <div className="grid gap-px bg-line border border-line rounded-2xl overflow-hidden md:grid-cols-2">
            {principles.map((p) => (
              <div key={p.k} className="bg-paper p-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-mono text-[11px] text-ink-4">
                    {p.k}
                  </span>
                  <h3 className="font-display font-bold text-ink text-[17px]">
                    {p.title}
                  </h3>
                </div>
                <p className="text-[13.5px] text-ink-3 leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <ClubNudge>
              <>
                If you need paid, private help building your product — not
                peer-to-peer advice —{" "}
                <a
                  href="https://bitroot.club"
                  className="prose-link not-italic"
                  target="_blank"
                  rel="noreferrer"
                >
                  bitroot.club
                </a>{" "}
                is the right room. This community stays founder-to-founder. →
              </>
            </ClubNudge>
          </div>
        </Container>
      </section>
    </>
  );
}
