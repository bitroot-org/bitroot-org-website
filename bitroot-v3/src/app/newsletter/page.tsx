import Container from "@/components/ui/Container";
import NewsletterForm from "@/components/NewsletterForm";
import ClubNudge from "@/components/ui/ClubNudge";

export const metadata = {
  title: "Newsletter — bitroot.org",
  description:
    "One email a week. Tools we actually use, guides we just shipped, and the stuff that broke on us. No lifestyle takes.",
};

const pastIssues = [
  {
    n: 34,
    date: "Apr 07, 2026",
    title: "Waitlist kit v2, Stripe gotchas, and a faster RSC mental model",
    blurb:
      "The rebuilt waitlist kit ships with referral tracking. Plus a Stripe webhook edge case that ate 3 hours and our new favorite RSC explainer.",
  },
  {
    n: 33,
    date: "Mar 31, 2026",
    title: "Analytics that actually matter + Neon vs Turso in Q2",
    blurb:
      "Five events worth tracking, one dashboard layout, and a real benchmark between two serverless Postgres options for an AI side project.",
  },
  {
    n: 32,
    date: "Mar 24, 2026",
    title: "The React Email deliverability checklist",
    blurb:
      "DNS, SPF, DKIM, DMARC — explained once, forever. Plus a bad-state test you can run in 10 seconds.",
  },
  {
    n: 31,
    date: "Mar 17, 2026",
    title: "Weekend MVP stack update and a cold-email template that worked",
    blurb:
      "Why we swapped Mailgun for Resend (finally), and the five-line cold email that got us 3 replies out of 12 sends last week.",
  },
  {
    n: 30,
    date: "Mar 10, 2026",
    title: "A pricing experiment, a landing page teardown, and a new guide",
    blurb:
      "We doubled our hobby-tier price and nothing bad happened. Plus the full teardown of a subscriber's landing page.",
  },
];

export default function NewsletterPage() {
  return (
    <>
      <section className="pt-16 pb-14 border-b border-line relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--color-ink) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <Container size="narrow">
          <div className="relative text-center">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-4">
              ~/ the weekly dispatch
            </div>
            <h1 className="font-display text-4xl md:text-[60px] font-extrabold text-ink leading-[1.02] tracking-tight">
              One email<span className="text-ember">.</span><br />
              Every Sunday<span className="text-ember">.</span>
            </h1>
            <p className="mt-6 text-[16px] text-ink-3 leading-relaxed max-w-xl mx-auto">
              What we shipped. What broke. What&apos;s new in the toolbox.
              No fluff, no lifestyle takes, no &ldquo;5 mindsets of successful
              founders.&rdquo;
            </p>

            <div className="mt-10 max-w-md mx-auto">
              <NewsletterForm />
            </div>

            <div className="mt-6 flex items-center justify-center gap-x-5 gap-y-2 flex-wrap text-[11.5px] font-mono text-ink-4">
              <span>∼2,100 founders reading</span>
              <span>·</span>
              <span>archive public</span>
              <span>·</span>
              <span>unsubscribe anytime</span>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container size="narrow">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-line" />
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-4">
              past issues
            </span>
            <div className="h-px flex-1 bg-line" />
          </div>

          <ol className="space-y-1">
            {pastIssues.map((issue) => (
              <li
                key={issue.n}
                className="group rounded-xl px-5 py-5 hover:bg-paper-2/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-6">
                  <div className="shrink-0 pt-0.5 w-28 text-[11px] font-mono text-ink-4 uppercase tracking-wider">
                    #{issue.n} · {issue.date}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-[17px] font-semibold text-ink group-hover:text-ember transition-colors leading-tight">
                      {issue.title}
                    </h3>
                    <p className="text-[13px] text-ink-3 leading-relaxed mt-1.5">
                      {issue.blurb}
                    </p>
                  </div>
                  <div className="shrink-0 text-ink-4 group-hover:text-ember transition-colors pt-1">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 pt-8 border-t border-dashed border-line">
            <p className="text-[13px] text-ink-3 leading-relaxed italic">
              Every back issue lives on a permanent URL. We don&apos;t gate the
              archive. If you just want to read a few to decide — scroll the
              list above.
            </p>
          </div>

          <ClubNudge>
            <>
              Subscribers occasionally get a heads-up when{" "}
              <a
                href="https://bitroot.club"
                className="prose-link not-italic"
                target="_blank"
                rel="noreferrer"
              >
                bitroot.club
              </a>{" "}
              has a build slot open. That&apos;s as commercial as this list
              gets. →
            </>
          </ClubNudge>
        </Container>
      </section>
    </>
  );
}
