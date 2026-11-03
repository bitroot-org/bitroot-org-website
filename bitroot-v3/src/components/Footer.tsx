import Link from "next/link";
import Logo from "./ui/Logo";
import Container from "./ui/Container";
import PixelSteps from "./ui/PixelSteps";
import VibeText from "./vibe/VibeText";
import VibeToggle from "./vibe/VibeToggle";
import FooterSignup from "./home/genz/FooterSignup";

const sections = [
  {
    title: "Shelves",
    links: [
      { label: "Creators", href: "/creators/" },
      { label: "Vibe Coders", href: "/vibe-coders/" },
      { label: "Founders", href: "/founders/" },
      { label: "Skills", href: "/skills/" },
      { label: "MCP servers", href: "/mcp/" },
      { label: "Packs", href: "/packs/" },
    ],
  },
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
    <footer className="mt-24 px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="relative overflow-hidden bg-pop text-pop-ink r-vibe-lg">
        <PixelSteps
          cells={[[0, 0], [1, 1], [2, 2, 2], [4, 3, 2], [6, 2], [7, 1, 2], [9, 0]]}
          tone="paper"
          className="absolute right-[6%] top-0 hidden sm:block"
          unit="clamp(18px, 3vw, 46px)"
        />
        <Container>
          <h2 className="m-0 pt-[clamp(72px,10vw,140px)] font-alt text-[clamp(64px,12vw,170px)] leading-[0.92]">
            <VibeText
              bruh={
                <>
                  Get the
                  <br />
                  drops <span aria-hidden className="emoji text-[0.6em]">📬</span>
                </>
              }
              baddie={
                <>
                  Stay in
                  <br />
                  the loop <span aria-hidden className="emoji text-[0.6em]">💌</span>
                </>
              }
            />
          </h2>

          <div className="mt-12">
            <FooterSignup />
          </div>

          <div className="mt-20 grid gap-10 sm:grid-cols-3 lg:grid-cols-5">
            {sections.map((s) => (
              <div key={s.title}>
                <h3 className="m-0 mb-3 font-mono text-[12px] font-medium uppercase tracking-[0.12em]">
                  {s.title}
                </h3>
                <ul className="m-0 list-none space-y-2 p-0">
                  {s.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-[15px] text-pop-ink no-underline decoration-2 underline-offset-4 hover:underline"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col gap-6 border-t-[1.5px] border-pop-ink/25 py-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex bg-paper px-3.5 py-2.5 r-vibe">
                <Logo height={28} />
              </span>
              <div className="mt-3 text-[12px]">
                © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Bitroot · MIT for content
                where noted ·{" "}
                <Link href="/legal/privacy/" className="text-pop-ink underline underline-offset-2">Privacy</Link>{" "}
                · <Link href="/legal/terms/" className="text-pop-ink underline underline-offset-2">Terms</Link>{" "}
                · <Link href="/legal/refund/" className="text-pop-ink underline underline-offset-2">Refund</Link>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a href="https://bitroot.club" className="text-[14px] font-semibold text-pop-ink underline underline-offset-4">
                Need this built for you? bitroot.club →
              </a>
              <VibeToggle location="footer" />
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
