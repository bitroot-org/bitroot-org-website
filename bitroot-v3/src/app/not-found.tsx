import Link from "next/link";
import Container from "@/components/ui/Container";

export const metadata = {
  title: "Page not found",
  robots: { index: false },
};

const places = [
  { href: "/kits/", label: "Starter Kits", blurb: "clone-and-ship boilerplates" },
  { href: "/guides/", label: "Guides", blurb: "tactical walkthroughs" },
  { href: "/tools/", label: "Free Tools", blurb: "zero-signup utilities" },
];

export default function NotFound() {
  return (
    <section className="py-24">
      <Container>
        <p className="text-[12px] font-mono text-ink-4 mb-3">404</p>
        <h1 className="font-display text-[32px] md:text-[44px] font-bold text-ink leading-tight mb-4">
          This page doesn&apos;t exist.
        </h1>
        <p className="text-ink-2 max-w-xl mb-10">
          The link is broken or the page moved. The toolbox is still here —
          start from one of these:
        </p>
        <ul className="grid gap-3 max-w-md">
          {places.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="flex items-baseline justify-between gap-4 border border-line rounded-md px-4 py-3 hover:border-ember transition-colors"
              >
                <span className="font-semibold text-ink">{p.label}</span>
                <span className="text-[13px] text-ink-3">{p.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
