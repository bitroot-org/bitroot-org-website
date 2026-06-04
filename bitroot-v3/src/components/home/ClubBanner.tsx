import Container from "@/components/ui/Container";
import TrackedLink from "@/components/ui/TrackedLink";

const benefits = [
  {
    title: "BitSupport · priority tickets",
    sub: "Tier-based help, from quick fixes to ongoing support.",
  },
  {
    title: "Direct access to operators",
    sub: "Book calls and office hours with people who've shipped what you're building.",
  },
  {
    title: "Member-only drops",
    sub: "New apps, kits, tools, and deals — before they go public.",
  },
];

const memberAvatars = [
  { initials: "JK", grad: "from-[#7782ee] to-[#3d3b40]" },
  { initials: "RM", grad: "from-[#bfcfe7] to-[#525ceb]" },
  { initials: "SA", grad: "from-[#c9cef5] to-[#525ceb]" },
  { initials: "EL", grad: "from-[#a8a5cf] to-[#3d3b40]" },
  { initials: "TN", grad: "from-[#525ceb] to-[#3d3b40]" },
];

export default function ClubBanner() {
  return (
    <section id="club" className="py-18">
      <Container>
        <div
          className="relative overflow-hidden rounded-[22px] text-[#eae6f5] px-7 py-10 sm:px-12 sm:py-14 lg:p-16 shadow-[0_30px_80px_-30px_rgba(20,18,42,0.6),0_0_0_1px_rgba(82,92,235,0.18)]"
          style={{
            background:
              "radial-gradient(900px 600px at 12% 0%, rgba(82,92,235,0.40), transparent 60%), radial-gradient(700px 500px at 100% 100%, rgba(119,130,238,0.22), transparent 60%), linear-gradient(160deg, #14132b 0%, #1c1a3a 50%, #211e44 100%)",
          }}
        >
          <div
            className="absolute inset-0 club-grid pointer-events-none opacity-90"
            aria-hidden
          />
          <div
            className="absolute -top-40 -left-20 w-[420px] h-[420px] rounded-full pointer-events-none blur-3xl"
            style={{ background: "rgba(82,92,235,0.30)" }}
            aria-hidden
          />

          <div className="relative grid gap-12 lg:grid-cols-[1.2fr_1fr] items-center">
            <div>
              <span
                className="eyebrow-mono"
                style={{ color: "#c9cef5" }}
              >
                community
              </span>
              <h2 className="font-sans mt-3.5 mb-4 text-white text-[clamp(38px,4.6vw,56px)] font-semibold tracking-[-0.03em] leading-[1.02]">
                Bitroot Club <span className="serif-em">→</span>
              </h2>
              <p className="text-[16px] text-[#c9c2dd] leading-[1.55] m-0 max-w-[44ch]">
                A members-only room for founders building thoughtfully. Real
                feedback, no LinkedIn voice.
              </p>

              <ul className="m-0 mt-7 p-0 list-none flex flex-col gap-3.5">
                {benefits.map((b) => (
                  <li
                    key={b.title}
                    className="flex items-start gap-3 text-[15px] text-[#e0d9ee] leading-[1.45]"
                  >
                    <span className="flex-none w-2 h-2 rounded-[2px] bg-ember mt-1.5 shadow-[0_0_10px_rgba(82,92,235,0.7)]" />
                    <span className="flex-1 min-w-0">
                      <strong className="font-semibold text-white">
                        {b.title}
                      </strong>
                      <small className="block mt-1 text-[13px] text-[#a8a3bf] leading-[1.5]">
                        {b.sub}
                      </small>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex items-center gap-3.5 flex-wrap">
                <TrackedLink
                  label="Join the Club"
                  location="club_banner"
                  href="https://bitroot.club"
                  className="inline-flex items-center gap-2 h-[38px] px-5 rounded-full bg-ember text-paper text-[14px] font-medium hover:bg-ember-2 transition-colors"
                >
                  Join the Club <span aria-hidden>→</span>
                </TrackedLink>
                <a
                  href="#stories"
                  className="inline-flex items-center gap-2 h-[38px] px-5 rounded-full border border-white/20 text-white text-[14px] font-medium hover:bg-white/5 hover:border-white/30 transition-colors"
                >
                  See who&apos;s inside
                </a>
              </div>
            </div>

            <div
              className="rounded-[14px] p-6 flex flex-col gap-5 backdrop-blur-sm border border-[rgba(199,206,245,0.22)] shadow-[0_20px_50px_-20px_rgba(82,92,235,0.45),inset_0_1px_0_rgba(255,255,255,0.06)]"
              style={{
                background:
                  "linear-gradient(160deg, rgba(82,92,235,0.16) 0%, rgba(82,92,235,0.06) 60%, rgba(20,18,42,0.35) 100%)",
              }}
            >
              <div className="flex items-center justify-between font-mono text-[12px] text-[#b6b0c8]">
                <span>members</span>
                <b className="text-white font-medium">412 / 500</b>
              </div>
              <div className="flex items-center">
                {memberAvatars.map((a, i) => (
                  <div
                    key={a.initials}
                    className={`w-[32px] h-[32px] rounded-full border-2 border-[#191638] bg-gradient-to-br ${a.grad} grid place-items-center font-mono text-[10px] text-white font-medium shadow-[0_0_12px_rgba(82,92,235,0.4)] ${i === 0 ? "" : "-ml-2"}`}
                  >
                    {a.initials}
                  </div>
                ))}
                <div className="w-[32px] h-[32px] rounded-full border-2 border-[#191638] bg-[rgba(82,92,235,0.22)] text-white font-mono text-[10px] grid place-items-center -ml-2">
                  +407
                </div>
              </div>
              <div className="flex items-center justify-between font-mono text-[12px] text-[#b6b0c8]">
                <span>this week</span>
                <b className="text-white font-medium">
                  14 new deals · 3 office hours
                </b>
              </div>
              <div className="flex items-center justify-between border-t border-[rgba(199,206,245,0.16)] pt-4 font-mono text-[12px]">
                <span className="text-[#8e8aa8]">$ bitroot · join</span>
                <span className="text-ember drop-shadow-[0_0_8px_rgba(82,92,235,0.8)]">●</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
