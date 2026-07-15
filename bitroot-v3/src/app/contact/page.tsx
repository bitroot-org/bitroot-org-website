import Container from "@/components/ui/Container";
import ContactForm from "@/components/ContactForm";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact — talk to a human at Bitroot",
  description:
    "Question, correction, or partnership idea? Send us a message — a real person replies within one business day.",
  path: "/contact/",
});

const otherChannels = [
  {
    title: "Bug in a guide or kit",
    body: "Fastest path is a GitHub issue — we triage those daily and tag fixes for the week.",
    href: "https://github.com/bitroot/bitroot/issues",
    handle: "github issues →",
  },
  {
    title: "Suggest new content",
    body: "Open a discussion with a 'here's what I'd want' brief. The best ones become guides.",
    href: "https://github.com/bitroot/bitroot/discussions",
    handle: "discussions →",
  },
  {
    title: "Quick question, live",
    body: "The Discord is small but responsive. Office hours run monthly.",
    href: "/community",
    handle: "/community →",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="pt-14 pb-8 border-b border-line bg-paper-2/40">
        <Container size="narrow">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-ember mb-3">
            ~/ contact
          </div>
          <h1 className="font-display text-4xl md:text-[56px] font-extrabold text-ink leading-[1.02] tracking-tight">
            Talk to a human<span className="text-ember">.</span>
          </h1>
          <p className="mt-5 text-[17px] text-ink-3 leading-relaxed">
            No ticket queue, no chatbot maze. Messages land in a real inbox
            read by the same people who write the guides.
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container size="narrow">
          <ContactForm />

          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-line" />
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-4">
                faster for some things
              </span>
              <div className="h-px flex-1 bg-line" />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {otherChannels.map((c) => (
                <a
                  key={c.title}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group rounded-xl border border-line bg-paper p-5 hover:bg-paper-2/40 transition-colors"
                >
                  <div className="font-display text-[15px] font-bold text-ink group-hover:text-ember transition-colors leading-tight">
                    {c.title}
                  </div>
                  <p className="text-[12.5px] text-ink-3 leading-relaxed mt-1.5">
                    {c.body}
                  </p>
                  <div className="mt-3 font-mono text-[11px] text-ink-4 group-hover:text-ember transition-colors">
                    {c.handle}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
