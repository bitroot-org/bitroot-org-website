import Link from "next/link";
import Container from "@/components/ui/Container";
import Tag from "@/components/ui/Tag";
import ClubNudge from "@/components/ui/ClubNudge";
import { tools } from "@/content/data";

export const metadata = {
  title: "Free Tools — bitroot.org",
  description:
    "Zero-signup, in-browser utilities for founders. OG images, favicons, pricing pages, domain brainstorming, README generation.",
};

export default function ToolsPage() {
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
              ~/ tools
            </div>
            <h1 className="font-display text-4xl md:text-[56px] font-extrabold text-ink leading-[1.02] tracking-tight">
              No signup, ever<span className="text-ember">.</span>
            </h1>
            <p className="mt-5 text-[16px] text-ink-3 leading-relaxed max-w-2xl">
              Tiny in-browser utilities. Zero accounts, zero emails, zero
              upsells to &ldquo;pro.&rdquo; Bookmark the one you need most,
              share the rest.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] font-mono text-ink-3">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-live pulse-live" />
                runs in your browser
              </span>
              <span className="text-ink-4">·</span>
              <span>no data leaves the page</span>
              <span className="text-ink-4">·</span>
              <span>source on github</span>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-16">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <Link
                key={t.slug}
                href={t.href}
                className="repo-card group block rounded-2xl border border-line bg-paper p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-ember"
                  >
                    <path
                      d="M11 2l3 3-7 7H4v-3l7-7zM9 4l3 3"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-mono text-[11px] text-ink-4 uppercase tracking-wider">
                    tool / {t.slug}
                  </span>
                </div>

                <h3 className="font-display text-[18px] font-bold text-ink group-hover:text-ember transition-colors leading-tight mb-2">
                  {t.title}
                </h3>
                <p className="text-[13px] text-ink-3 leading-relaxed mb-4 line-clamp-3 min-h-[3em]">
                  {t.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {t.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>

                <div className="dotted-line mb-3" />
                <div className="flex items-center justify-between text-[11px] font-mono text-ink-4">
                  <span>free · no signup</span>
                  <span className="inline-flex items-center gap-1 text-ink-3 group-hover:text-ember transition-colors">
                    open
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
              </Link>
            ))}
          </div>

          <ClubNudge>
            <>
              Have an idea for a tool you&apos;d use every week? Open an issue
              on{" "}
              <a
                href="https://github.com/bitroot/bitroot"
                className="prose-link not-italic"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              . Want custom internal tooling for your team?{" "}
              <a
                href="https://bitroot.club"
                className="prose-link not-italic"
                target="_blank"
                rel="noreferrer"
              >
                bitroot.club
              </a>{" "}
              does that. →
            </>
          </ClubNudge>
        </Container>
      </section>
    </>
  );
}
