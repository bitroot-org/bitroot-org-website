import Link from "next/link";
import Container from "./ui/Container";

const sections = [
  {
    title: "Resources",
    links: [
      { label: "Kits", href: "/kits" },
      { label: "Guides", href: "/guides" },
      { label: "Products", href: "/products" },
      { label: "Tools", href: "/tools" },
      { label: "Newsletter", href: "/newsletter" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Newsletter", href: "/newsletter" },
      { label: "Discord", href: "/community" },
      { label: "Office Hours", href: "/community#office-hours" },
      { label: "GitHub", href: "https://github.com/bitroot" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Who we are", href: "/about" },
      { label: "Why .org exists", href: "/about#why" },
      { label: "Contribute", href: "/about#contribute" },
      { label: "Contact", href: "/contact" },
      { label: "RSS", href: "/rss.xml" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/company/81849632/" },
      { label: "Instagram", href: "https://www.instagram.com/bitroot.official/" },
      { label: "Substack", href: "https://substack.com/@bitrootindia" },
      { label: "Medium", href: "https://medium.com/@bitrootcoder" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line mt-24 bg-paper-2/40">
      <Container>
        <div className="pt-14 pb-10 grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="font-display text-[17px] font-bold text-ink tracking-tight">
              bitroot<span className="text-ember">.org</span>
            </div>
            <p className="text-[13.5px] text-ink-3 leading-relaxed mt-3 max-w-xs">
              A free toolbox for founders shipping their first products.
              Opinionated, tactical, maintained. Everything here is free.
            </p>
            <div className="mt-5 flex items-center gap-2 text-[11px] font-mono text-ink-4">
              <span className="w-1.5 h-1.5 rounded-full bg-live pulse-live" />
              Maintained weekly
            </div>
          </div>

          {sections.map((s) => (
            <div key={s.title}>
              <h4 className="font-display text-[13px] font-semibold text-ink mb-3">
                {s.title}
              </h4>
              <ul className="space-y-2">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-ink-3 hover:text-ember transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="dotted-line" />

        <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-[11px] font-mono text-ink-4">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Bitroot · MIT for content where
            noted · No cookie walls, no popups, promise.
          </div>
          <div className="text-[11px] font-mono text-ink-4 flex items-center gap-2">
            <Link
              href="/legal/privacy/"
              className="hover:text-ember transition-colors"
            >
              Privacy
            </Link>
            <span aria-hidden>·</span>
            <Link
              href="/legal/terms/"
              className="hover:text-ember transition-colors"
            >
              Terms
            </Link>
            <span aria-hidden>·</span>
            <Link
              href="/legal/refund/"
              className="hover:text-ember transition-colors"
            >
              Refund
            </Link>
          </div>
          <div className="text-[11px] font-mono text-ink-4">
            Need this built for you?{" "}
            <a
              href="https://bitroot.club"
              className="text-ink-2 hover:text-ember underline decoration-line-2 hover:decoration-ember underline-offset-2 transition-colors"
            >
              bitroot.club →
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}