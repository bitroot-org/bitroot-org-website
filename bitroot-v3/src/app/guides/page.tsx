import Link from "next/link";
import Container from "@/components/ui/Container";
import Tag from "@/components/ui/Tag";
import ClubNudge from "@/components/ui/ClubNudge";
import { guides } from "@/content/data";

export const metadata = {
  title: "Guides — bitroot.org",
  description:
    "Zero-fluff tactical walkthroughs for founders. Real code, reproducible steps, actual timestamps.",
};

const difficultyStyle = {
  starter: "bg-live-bg border-green-200 text-live",
  intermediate: "bg-ember-bg border-ember-line text-ember",
  advanced: "bg-paper-2 border-line text-ink-3",
} as const;

export default function GuidesPage() {
  return (
    <>
      <section className="pt-14 pb-10 border-b border-line bg-paper-2/40 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--color-ink) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <Container>
          <div className="relative">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-3">
              ~/ guides
            </div>
            <h1 className="font-display text-4xl md:text-[56px] font-extrabold text-ink leading-[1.02] tracking-tight">
              Tactical walkthroughs<span className="text-ember">.</span>
            </h1>
            <p className="mt-5 text-[16px] text-ink-3 leading-relaxed max-w-2xl">
              The stuff we wish existed when we were stuck at 11pm. Every guide
              is a reproducible sequence — real code, timestamps, screenshots
              where they help. No &ldquo;5 ways to think about…&rdquo; No
              listicles. Just the 20 minutes we&apos;d save you.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] font-mono text-ink-3">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-live pulse-live" />
                {guides.length} guides live
              </span>
              <span className="text-ink-4">·</span>
              <span>copy-pasteable</span>
              <span className="text-ink-4">·</span>
              <span>last-checked dates</span>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-16">
        <Container>
          <div className="rounded-2xl border border-line bg-paper overflow-hidden">
            {guides.map((guide, i) => (
              <Link
                key={guide.slug}
                href={guide.href}
                className={`group block px-7 py-6 hover:bg-paper-2/40 transition-colors ${
                  i !== 0 ? "border-t border-line/80" : ""
                }`}
              >
                <div className="flex items-start gap-6">
                  <div className="shrink-0 font-mono text-[11px] text-ink-4 uppercase tracking-wider w-24 pt-1">
                    {guide.updatedAt}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {guide.difficulty && (
                        <span
                          className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] border ${
                            difficultyStyle[guide.difficulty]
                          }`}
                        >
                          {guide.difficulty}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-ink-4 uppercase tracking-wider">
                        guide
                      </span>
                    </div>
                    <h3 className="font-display text-[20px] md:text-[22px] font-bold text-ink group-hover:text-ember transition-colors leading-tight">
                      {guide.title}
                    </h3>
                    <p className="mt-2 text-[13.5px] text-ink-3 leading-relaxed max-w-2xl">
                      {guide.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {guide.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 text-ink-4 group-hover:text-ember transition-colors pt-2">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
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
              </Link>
            ))}
          </div>

          <ClubNudge>
            <>
              Stuck on something these guides don&apos;t cover yet? Open a
              thread on{" "}
              <a
                href="https://github.com/bitroot/bitroot/discussions"
                className="prose-link not-italic"
                target="_blank"
                rel="noreferrer"
              >
                GitHub Discussions
              </a>{" "}
              — we turn the best questions into new guides. Need it done for
              you instead?{" "}
              <a
                href="https://bitroot.club"
                className="prose-link not-italic"
                target="_blank"
                rel="noreferrer"
              >
                bitroot.club
              </a>
              . →
            </>
          </ClubNudge>
        </Container>
      </section>
    </>
  );
}
