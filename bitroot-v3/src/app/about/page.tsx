import Link from "next/link";
import Container from "@/components/ui/Container";
import ClubNudge from "@/components/ui/ClubNudge";

export const metadata = {
  title: "About — bitroot.org",
  description:
    "Why bitroot.org exists, who runs it, and how we keep it free. A short, honest manifesto.",
};

export default function AboutPage() {
  return (
    <>
      <section className="pt-14 pb-8 border-b border-line bg-paper-2/40">
        <Container size="narrow">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-3">
            ~/ about
          </div>
          <h1 className="font-display text-4xl md:text-[56px] font-extrabold text-ink leading-[1.02] tracking-tight">
            A toolbox<span className="text-ember">,</span><br /> not a funnel
            <span className="text-ember">.</span>
          </h1>
          <p className="mt-5 text-[17px] text-ink-3 leading-relaxed">
            bitroot.org is a free resource hub for founders building their
            first few products. No lead magnets, no email wall, no course at
            the end of the tunnel.
          </p>
        </Container>
      </section>

      {/* The manifesto */}
      <section id="why" className="py-14">
        <Container size="narrow">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-3">
            ~/ why this exists
          </div>
          <h2 className="font-display text-[32px] font-bold text-ink tracking-tight leading-[1.1] mb-6">
            We got tired of the same three problems.
          </h2>

          <div className="space-y-5 text-[15.5px] text-ink-2 leading-[1.75]">
            <p>
              The first is that every useful guide on the internet is gated
              behind an email, a trial, or a YouTube personality. The second
              is that when you&apos;re stuck at 11pm trying to get Stripe
              webhooks to verify, you don&apos;t want philosophy — you want
              someone to show you the exact four lines that fix it.
            </p>
            <p>
              The third is subtler. Most &ldquo;founder content&rdquo; is
              optimized for the person who reads it, not the person who ships
              it. We wanted the opposite: tactical, reproducible, dated, and
              honest about what we&apos;d actually use this quarter — not what
              would maximize engagement.
            </p>
            <p>
              So we started writing the toolbox we wish we&apos;d had. Every
              kit is something we&apos;ve shipped. Every app is one we use
              ourselves. Every guide is a sequence you can
              reproduce from a blank directory. Everything is free, forever.
            </p>
          </div>
        </Container>
      </section>

      {/* Who */}
      <section className="py-14 border-t border-line bg-paper-2/30">
        <Container size="narrow">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-3">
            ~/ who writes this
          </div>
          <h2 className="font-display text-[30px] font-bold text-ink tracking-tight leading-[1.1] mb-6">
            A small team. Real bylines.
          </h2>

          <p className="text-[15px] text-ink-2 leading-[1.75] mb-8">
            Bitroot is run by a handful of people who also build software for
            a living. Everything we publish here is written by someone with
            their name on it — no SEO farm, no AI-generated listicles, no
            ghostwritten &ldquo;thought leadership.&rdquo; If you open a guide
            and the byline is Rohan, Rohan wrote it.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-line bg-paper p-5">
              <div className="font-display font-bold text-ink text-[17px] mb-1">
                Rohan K.
              </div>
              <div className="text-[11px] font-mono text-ink-4 uppercase tracking-wider mb-3">
                writes: kits · guides
              </div>
              <p className="text-[13px] text-ink-3 leading-relaxed">
                Built three SaaS products. Still loses an afternoon to Stripe
                webhooks once a year.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-paper p-5">
              <div className="font-display font-bold text-ink text-[17px] mb-1">
                Priya S.
              </div>
              <div className="text-[11px] font-mono text-ink-4 uppercase tracking-wider mb-3">
                writes: tools · products
              </div>
              <p className="text-[13px] text-ink-3 leading-relaxed">
                Former infra engineer. Has opinions about Postgres. Mostly
                correct ones.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* How it stays free */}
      <section className="py-14 border-t border-line">
        <Container size="narrow">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-3">
            ~/ how it stays free
          </div>
          <h2 className="font-display text-[30px] font-bold text-ink tracking-tight leading-[1.1] mb-6">
            The honest answer.
          </h2>

          <div className="space-y-5 text-[15px] text-ink-2 leading-[1.75]">
            <p>
              bitroot.org costs us about $40 a month to run. It takes roughly
              6 hours a week to maintain — writing new material, updating old
              guides, and keeping the tools working. That&apos;s time
              we&apos;re donating because we think the public web is better
              with a few more honest resource hubs.
            </p>
            <p>
              We fund the upkeep through{" "}
              <a href="https://bitroot.club" className="prose-link">
                bitroot.club
              </a>
              , our product studio — when founders need custom development
              work, they hire us there. We&apos;ve kept the two sides
              deliberately separate: .org is free content, .club is paid work,
              and we don&apos;t pipe one into the other.
            </p>
            <p>
              The only place .club is mentioned inside content here is a
              single italic line at the bottom of most pages, for readers who
              explicitly need done-for-you help. That&apos;s the trade.
            </p>
          </div>
        </Container>
      </section>

      {/* Contribute */}
      <section
        id="contribute"
        className="py-14 border-t border-line bg-paper-2/30"
      >
        <Container size="narrow">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-3">
            ~/ contribute
          </div>
          <h2 className="font-display text-[30px] font-bold text-ink tracking-tight leading-[1.1] mb-6">
            Four ways to help.
          </h2>

          <div className="rounded-2xl border border-line bg-paper divide-y divide-line/80 overflow-hidden">
            {[
              {
                k: "01",
                title: "Fix a typo or broken command",
                body: "Every guide has an 'edit on GitHub' link. Small PRs merged within a day.",
                href: "https://github.com/bitroot/bitroot",
                handle: "github.com/bitroot",
              },
              {
                k: "02",
                title: "Suggest a guide or kit",
                body: "Open a discussion with a clear 'here's what I'd want' brief. We turn the best ones into new content every month.",
                href: "https://github.com/bitroot/bitroot/discussions",
                handle: "discussions",
              },
              {
                k: "03",
                title: "Tell us when we're wrong",
                body: "Guides go stale. If you hit a bug we didn't predict, open an issue tagged `stale` and we'll fix it that week.",
                href: "https://github.com/bitroot/bitroot/issues",
                handle: "issues",
              },
              {
                k: "04",
                title: "Share one link",
                body: "If a guide saved your afternoon, share it with the next founder in your DMs. That's genuinely how this grows.",
                href: "/guides",
                handle: "/guides",
              },
            ].map((c) => (
              <a
                key={c.k}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex items-start gap-5 px-6 py-5 hover:bg-paper-2/40 transition-colors"
              >
                <span className="font-mono text-[11px] text-ember font-semibold shrink-0 mt-1">
                  {c.k}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-[16px] font-bold text-ink group-hover:text-ember transition-colors">
                    {c.title}
                  </div>
                  <p className="text-[13px] text-ink-3 leading-relaxed mt-1">
                    {c.body}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[11px] text-ink-4 group-hover:text-ember transition-colors pt-1">
                  {c.handle} →
                </span>
              </a>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-dashed border-line text-[13px] text-ink-3 leading-relaxed italic">
            One last thing: the content on this site is licensed for you to
            copy, adapt, and share — attribution appreciated but not
            required. Take what helps. Ship your thing.{" "}
            <Link href="/" className="prose-link not-italic">
              back home
            </Link>{" "}
            ↩
          </div>

          <ClubNudge />
        </Container>
      </section>
    </>
  );
}
