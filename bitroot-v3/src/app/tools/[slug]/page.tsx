import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import ClubNudge from "@/components/ui/ClubNudge";
import Tag from "@/components/ui/Tag";
import ReadmeGenerator from "@/components/tools/ReadmeGenerator";
import { tools, findItem } from "@/content/data";

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = findItem(slug, "tool");
  if (!tool) return {};
  return {
    title: `${tool.title} — bitroot Tools`,
    description: tool.summary,
  };
}

const workingTools: Partial<Record<string, () => React.ReactNode>> = {
  "readme-generator": () => <ReadmeGenerator />,
};

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = findItem(slug, "tool");
  if (!tool) notFound();

  const Tool = workingTools[slug];

  return (
    <>
      <section className="pt-10 pb-8 border-b border-line bg-paper-2/40">
        <Container>
          <nav className="text-[12px] font-mono text-ink-4 mb-6 flex items-center gap-1.5">
            <Link href="/" className="hover:text-ember transition-colors">
              ~
            </Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-ember transition-colors">
              tools
            </Link>
            <span>/</span>
            <span className="text-ink-3">{tool.slug}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-3">
                ~/ tool
              </div>
              <h1 className="font-display text-3xl md:text-[44px] font-extrabold text-ink leading-[1.05] tracking-tight">
                {tool.title}
              </h1>
              <p className="mt-4 text-[15.5px] text-ink-3 leading-relaxed max-w-2xl">
                {tool.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {tool.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
            <div className="text-[11px] font-mono text-ink-4 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-live pulse-live" />
                {Tool ? "live in your browser" : "coming soon"}
              </div>
              <div className="mt-1">updated {tool.updatedAt}</div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          {Tool ? (
            <Tool />
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-paper-2/40 p-10 text-center">
              <div className="text-[11px] font-mono text-ink-4 uppercase tracking-wider mb-2">
                under construction
              </div>
              <h2 className="font-display text-[24px] font-bold text-ink mb-3">
                This one&apos;s still being built.
              </h2>
              <p className="text-[14px] text-ink-3 leading-relaxed max-w-md mx-auto mb-6">
                We only ship tools we&apos;d actually use ourselves. Our README
                generator is live today — that&apos;s the one to try while the
                rest land.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link
                  href="/tools/readme-generator"
                  className="inline-flex items-center gap-2 bg-ink text-paper text-[13px] font-medium rounded-lg px-4 py-2.5 hover:bg-ink-2 transition-colors"
                >
                  Try the README generator →
                </Link>
                <Link
                  href="/tools"
                  className="text-[13px] font-mono text-ink-3 hover:text-ember transition-colors"
                >
                  ← all tools
                </Link>
              </div>
            </div>
          )}

          <ClubNudge />
        </Container>
      </section>
    </>
  );
}
