import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import CodeBlock from "@/components/ui/CodeBlock";
import Tag from "@/components/ui/Tag";
import ClubNudge from "@/components/ui/ClubNudge";
import { kits, findItem } from "@/content/data";
import { kitsContent } from "@/content/kits-content";
import type { KitFeature } from "@/content/kits-content";

export function generateStaticParams() {
  return kits.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kit = findItem(slug, "kit");
  if (!kit) return {};
  return {
    title: `${kit.title} — bitroot Kits`,
    description: kit.summary,
  };
}

const iconMap: Record<NonNullable<KitFeature["icon"]>, string> = {
  auth: "M8 1.5l6 3v4c0 4-2.5 6.5-6 7-3.5-.5-6-3-6-7v-4l6-3z",
  billing: "M2 5h12M2 9h12M2 13h8",
  email: "M2 4h12v8H2zM2 4l6 5 6-5",
  db: "M8 2c3.3 0 6 1 6 2.5v7c0 1.5-2.7 2.5-6 2.5s-6-1-6-2.5v-7C2 3 4.7 2 8 2zM2 7c0 1.5 2.7 2.5 6 2.5s6-1 6-2.5M2 11c0 1.5 2.7 2.5 6 2.5s6-1 6-2.5",
  ui: "M2 3h12v10H2zM2 6h12M5 3v10",
  deploy: "M3 11l5-8 5 8M5.5 11h5M6 14h4",
  ai: "M8 2v3M8 11v3M2 8h3M11 8h3M5 5l2 2M9 9l2 2M5 11l2-2M9 7l2-2",
};

export default async function KitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kit = findItem(slug, "kit");
  if (!kit) notFound();

  const content = kitsContent[slug];

  return (
    <>
      {/* Breadcrumb + header */}
      <section className="pt-10 pb-8 border-b border-line bg-paper-2/40">
        <Container>
          <nav className="text-[12px] font-mono text-ink-4 mb-6 flex items-center gap-1.5">
            <Link href="/" className="hover:text-ember transition-colors">
              ~
            </Link>
            <span>/</span>
            <Link href="/kits" className="hover:text-ember transition-colors">
              kits
            </Link>
            <span>/</span>
            <span className="text-ink-3">{kit.slug}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember">
                  kit
                </span>
                {kit.difficulty && (
                  <>
                    <span className="text-ink-4">·</span>
                    <span className="text-[11px] font-mono text-ink-3 uppercase tracking-wider">
                      {kit.difficulty}
                    </span>
                  </>
                )}
                <span className="text-ink-4">·</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-ink-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-live pulse-live" />
                  updated {kit.updatedAt}
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-[52px] font-extrabold text-ink leading-[1.02] tracking-tight">
                {kit.title}
              </h1>
              <p className="mt-5 text-[16px] text-ink-3 leading-relaxed max-w-2xl">
                {content?.tagline ?? kit.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {kit.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>

            {content && (
              <div className="flex flex-wrap gap-2">
                <a
                  href={content.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-ink text-paper text-[13px] font-medium rounded-lg px-4 py-2.5 hover:bg-ink-2 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0a8 8 0 00-2.5 15.6c.4.1.6-.2.6-.4v-1.5c-2.2.5-2.7-1-2.7-1-.3-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 2 .9 2.5.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1 0-.2-.4-1 .1-2.2 0 0 .7-.2 2.2.8a7.6 7.6 0 014 0c1.5-1 2.2-.8 2.2-.8.4 1.2.1 2 .1 2.2.5.5.8 1.2.8 2.1 0 3.1-1.9 3.8-3.6 4 .3.3.5.8.5 1.5v2.2c0 .2.2.5.6.4A8 8 0 008 0z" />
                  </svg>
                  View on GitHub
                </a>
                {content.demo && (
                  <a
                    href={content.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-paper border border-line text-ink text-[13px] font-medium rounded-lg px-4 py-2.5 hover:border-ink-3 transition-colors"
                  >
                    Live demo →
                  </a>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>

      {content ? (
        <>
          {/* One-liner */}
          <section className="py-12">
            <Container size="narrow">
              <p className="text-[17px] text-ink-2 leading-relaxed">
                {content.oneLiner}
              </p>
            </Container>
          </section>

          {/* Install */}
          <section className="pb-12">
            <Container size="narrow">
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="font-display text-[26px] font-bold text-ink tracking-tight">
                  Install
                </h2>
                <span className="text-[11px] font-mono text-ink-4 uppercase tracking-wider">
                  ~60 seconds
                </span>
              </div>
              <CodeBlock
                code={content.installCommand}
                lang="bash"
                filename="terminal"
              />
            </Container>
          </section>

          {/* What's inside */}
          <section className="py-12 border-t border-line bg-paper-2/30">
            <Container>
              <div className="mb-8">
                <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-2">
                  ~/ what&apos;s inside
                </div>
                <h2 className="font-display text-[30px] md:text-[36px] font-bold text-ink tracking-tight leading-[1.1]">
                  Already wired, so you can skip to features.
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {content.features.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-xl border border-line bg-paper p-5"
                  >
                    <div className="flex items-start gap-3">
                      {feature.icon && (
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-ember-bg border border-ember-line flex items-center justify-center">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="text-ember"
                          >
                            <path
                              d={iconMap[feature.icon]}
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-display font-semibold text-[15px] text-ink mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-[13px] text-ink-3 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </section>

          {/* The stack */}
          <section className="py-14 border-t border-line">
            <Container size="narrow">
              <div className="mb-8">
                <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-2">
                  ~/ the stack behind it
                </div>
                <h2 className="font-display text-[30px] font-bold text-ink tracking-tight leading-[1.1]">
                  Every dependency has a reason.
                </h2>
              </div>

              <ul className="divide-y divide-line">
                {content.stack.map((item) => (
                  <li key={item.name} className="py-5 flex gap-5">
                    <div className="font-display font-semibold text-[16px] text-ink shrink-0 w-48">
                      {item.name}
                    </div>
                    <div className="text-[14px] text-ink-3 leading-relaxed flex-1">
                      {item.why}
                    </div>
                  </li>
                ))}
              </ul>
            </Container>
          </section>

          {/* Environment */}
          <section className="py-14 border-t border-line bg-paper-2/30">
            <Container size="narrow">
              <div className="mb-6">
                <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-2">
                  ~/ environment
                </div>
                <h2 className="font-display text-[30px] font-bold text-ink tracking-tight leading-[1.1]">
                  Here&apos;s every env var, labeled.
                </h2>
                <p className="mt-3 text-[14px] text-ink-3 leading-relaxed">
                  Copy to <code className="font-mono text-[0.88em] bg-paper-2 border border-line px-[0.35em] py-[0.08em] rounded-[4px] text-ink-2">.env.local</code>. The
                  included first-run script refuses to boot if any of them are
                  missing — you&apos;ll know immediately.
                </p>
              </div>
              <CodeBlock
                code={content.envExample}
                lang="dotenv"
                filename=".env.example"
              />
            </Container>
          </section>

          {/* Walkthrough */}
          <section className="py-16 border-t border-line">
            <Container size="narrow">
              <div className="mb-10">
                <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-2">
                  ~/ walkthrough
                </div>
                <h2 className="font-display text-[30px] md:text-[38px] font-bold text-ink tracking-tight leading-[1.05]">
                  Zero to first deploy.
                </h2>
                <p className="mt-3 text-[14px] text-ink-3 leading-relaxed">
                  This is the exact sequence we&apos;d run from a blank
                  directory. Steps are reproducible — if one fails, we want to
                  know.
                </p>
              </div>

              <ol className="space-y-10">
                {content.walkthrough.map((step) => (
                  <li key={step.title}>
                    <h3 className="font-display text-[20px] font-bold text-ink tracking-tight mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[14.5px] text-ink-3 leading-relaxed max-w-2xl">
                      {step.body}
                    </p>
                    {step.code && (
                      <CodeBlock
                        code={step.code.source}
                        lang={step.code.lang}
                        filename={step.code.filename}
                      />
                    )}
                  </li>
                ))}
              </ol>
            </Container>
          </section>

          {/* Gotchas */}
          <section className="py-14 border-t border-line bg-paper-2/40">
            <Container size="narrow">
              <div className="mb-6">
                <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-2">
                  ~/ known gotchas
                </div>
                <h2 className="font-display text-[28px] font-bold text-ink tracking-tight leading-[1.1]">
                  The stuff that ate our afternoons.
                </h2>
                <p className="mt-3 text-[14px] text-ink-3 leading-relaxed">
                  Things we&apos;d have wanted a heads-up on. Logged as we
                  hit them.
                </p>
              </div>

              <ul className="space-y-3">
                {content.gotchas.map((g, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-lg border border-line bg-paper px-4 py-3"
                  >
                    <span className="font-mono text-[11px] text-ember mt-[3px] shrink-0">
                      !
                    </span>
                    <span className="text-[13.5px] text-ink-2 leading-relaxed">
                      {g}
                    </span>
                  </li>
                ))}
              </ul>
            </Container>
          </section>

          {/* When not */}
          <section className="py-14 border-t border-line">
            <Container size="narrow">
              <div className="flex gap-4 rounded-xl border border-line bg-paper p-6">
                <div className="shrink-0 font-mono text-[12px] text-ink-4 uppercase tracking-wider mt-0.5">
                  when not
                </div>
                <p className="text-[14.5px] text-ink-2 leading-relaxed">
                  {content.whyNot}
                </p>
              </div>

              <div className="mt-6 text-[12px] font-mono text-ink-4 flex items-center gap-3">
                <span>license: {content.license}</span>
                <span className="text-ink-4">·</span>
                <a
                  href={content.github}
                  className="hover:text-ember transition-colors inline-flex items-center gap-1"
                >
                  star on github →
                </a>
              </div>

              <ClubNudge />
            </Container>
          </section>
        </>
      ) : (
        <section className="py-20">
          <Container size="narrow">
            <div className="rounded-2xl border border-dashed border-line bg-paper-2/40 p-10 text-center">
              <div className="text-[11px] font-mono text-ink-4 uppercase tracking-wider mb-2">
                detailed writeup in progress
              </div>
              <h2 className="font-display text-[24px] font-bold text-ink mb-3">
                This kit exists — the long-form writeup is on the way.
              </h2>
              <p className="text-[14px] text-ink-3 leading-relaxed max-w-md mx-auto mb-6">
                The repo is live. We&apos;re still writing the walkthrough
                in the same format as our other kits. In the meantime, the code
                is self-documenting.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <a
                  href={`https://github.com/bitroot/${kit.slug}`}
                  className="inline-flex items-center gap-2 bg-ink text-paper text-[13px] font-medium rounded-lg px-4 py-2.5"
                >
                  GitHub repo →
                </a>
                <Link
                  href="/kits"
                  className="inline-flex items-center gap-2 text-[13px] font-mono text-ink-3 hover:text-ember transition-colors"
                >
                  ← back to all kits
                </Link>
              </div>
            </div>
            <ClubNudge />
          </Container>
        </section>
      )}
    </>
  );
}
