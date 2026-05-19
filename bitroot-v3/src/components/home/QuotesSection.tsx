import Container from "@/components/ui/Container";

const quotes = [
  {
    body: "I closed eight tabs the day I found Bitroot. The deals alone paid for the year. The Sunday email is the only one I read on a phone.",
    initials: "JK",
    name: "Jules Kim",
    role: "founder · Pinned",
    grad: "from-[#7782ee] to-[#3d3b40]",
  },
  {
    body: "Picked the SaaS kit on a Friday, had Stripe, auth, and a billing page running by Monday. I'd built the same thing four times before. No more.",
    initials: "RM",
    name: "Ravi Menon",
    role: "founder · Slate",
    grad: "from-[#bfcfe7] to-[#525ceb]",
  },
  {
    body: "The Club is the quiet room I didn't know I needed. Real founders, real feedback, no LinkedIn voice. Worth it on day one.",
    initials: "SA",
    name: "Sara Aluko",
    role: "founder · Loop",
    grad: "from-[#c9cef5] to-[#525ceb]",
  },
];

export default function QuotesSection() {
  return (
    <section id="stories" className="py-18">
      <Container>
        <div className="flex items-end justify-between gap-6 mb-9">
          <div>
            <span className="eyebrow-mono">words from founders</span>
            <h2 className="font-sans mt-2.5 text-[clamp(30px,3.4vw,42px)] font-semibold tracking-[-0.03em] leading-[1.05]">
              What people <span className="serif-em">actually</span> say.
            </h2>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          {quotes.map((q) => (
            <div
              key={q.name}
              className="border-t border-line pt-7 flex flex-col gap-[18px]"
            >
              <p className="text-[17px] leading-[1.5] text-ink-2 tracking-[-0.005em] text-pretty">
                &ldquo;{q.body}&rdquo;
              </p>
              <div className="flex items-center gap-2.5 mt-auto">
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${q.grad} text-paper font-mono text-[11px] font-medium grid place-items-center flex-none`}
                >
                  {q.initials}
                </div>
                <div className="text-[13px]">
                  <b className="font-medium text-ink block leading-tight">
                    {q.name}
                  </b>
                  <span className="text-ink-4 font-mono text-[11.5px]">
                    {q.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
