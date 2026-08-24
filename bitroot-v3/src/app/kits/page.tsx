import Container from "@/components/ui/Container";
import { kits } from "@/content/data";
import KitsGrid from "@/components/kits/KitsGrid";
import ClubNudge from "@/components/ui/ClubNudge";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Starter Kits — clone-and-ship boilerplates",
  description:
    "Clone-and-ship boilerplates for founders. Next.js SaaS, AI wrappers, waitlists, Chrome extensions, and more. Free, opinionated, maintained.",
  path: "/kits/",
});

export default function KitsPage() {
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
              ~/ kits
            </div>
            <h1 className="font-display text-4xl md:text-[56px] font-extrabold text-ink leading-[1.02] tracking-tight">
              Starter Kits<span className="text-ember">.</span>
            </h1>
            <p className="mt-5 text-[16px] text-ink-3 leading-relaxed max-w-2xl">
              Clone, add your features, ship. Each kit is something we&apos;d
              (or did) use to start a real project — auth wired, payments
              wired, emails wired. No &ldquo;TODO: implement login&rdquo; waiting
              for you at 2am.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] font-mono text-ink-3">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-live pulse-live" />
                {kits.length} kits · last updated {kits[0].updatedAt}
              </span>
              <span className="text-ink-4">·</span>
              <span>MIT licensed</span>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-16">
        <Container>
          <KitsGrid kits={kits} />

          <ClubNudge>
            <>
              Need a kit customized, branded, or merged with your existing
              codebase?{" "}
              <a
                href="https://bitroot.club"
                className="prose-link not-italic"
                target="_blank"
                rel="noreferrer"
              >
                bitroot.club
              </a>{" "}
              does that as paid work. Everything here stays free, either way. →
            </>
          </ClubNudge>
        </Container>
      </section>
    </>
  );
}
