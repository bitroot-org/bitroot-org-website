---
date: '2026-09-24'
excerpt: 'Meta announced avatar, Mac control, and 1,500 connectors on Sept 23. But do these updates fix Muse''s real gaps? An honest assessment for founders evaluating agent platforms.'
image: https://techcrunch.com/wp-content/uploads/2026/09/mark-zuckerberg-meta-connect.jpg?resize=1200,799
published_at: '2026-09-24T06:31:10.093Z'
sources: []
tags:
- 'AI'
- 'Agents'
- 'Founder Strategy'
- 'Meta'
- 'MUSE'
title: 'Muse''s September 23 Updates: What Actually Changed for Founders'
---

Meta came to its Connect event on September 23 with a message: Muse is everywhere. A digital avatar named Jolly. Mac control. Your glasses. Its own email address. One thousand five hundred new integrations applied for in a week.
 
It's a lot. And if you're a founder evaluating whether Muse is worth your stack, the announcements probably raised a question: does any of this actually fix the things that make Muse feel incomplete?
 
The answer is more complicated than the hype suggests.
 
## What Meta Actually Announced (Sept 23)
 
Here's what shipped or is coming in the "coming months," per [Meta's keynote at Connect 2026](https://techcrunch.com/2026/09/23/everything-new-coming-to-metas-ai-agent-muse/):
 
**Shipping or imminent:**
- Muse Realtime Avatar: A digital face (Jolly) you can video chat with
- Mac control via computer use (like Claude and OpenAI agents)
- Shopping partnerships: Shopify, Stripe, Shop Pay, Best Buy, Gap, Sephora, Walmart, Wayfair, Expedia, Instacart
- Connector developer platform (1,500 applications in week one)
- GitHub, Granola, Notion integrations
**Coming in "coming months" (no timeline):**
- Muse on Meta smart glasses (wake word activation)
- Muse email address (so it can send/receive on your behalf)
- Muse background operation (persistent tasks without you watching)
Mark Zuckerberg positioned all of this as steps toward "personal superintelligence," a term he used eight times in the keynote. The subtext: Meta is betting everything on the idea that Muse will become the foundational AI layer across your apps, devices, and digital life. And this week's announcements are the evidence.
 
## What Actually Matters
 
Let's separate signal from noise.
 
**The real load-bearing features:**
 
Email address. This is the one that matters. Right now, Muse can't autonomously handle your email. If you want the agent to work while you sleep, it needs a way to receive requests and log work. An email address solves that. That's different from an avatar (nice, but cosmetic) or glasses integration (nice, but distant).
 
Mac control. Here's where Muse becomes comparable to what [Claude and OpenAI agents already do](https://techcrunch.com/2026/08/24/openai-is-building-an-ai-agent-for-everything-will-everyone-use-them/). You delegate a task, Muse operates your desktop. The use case: personal assistant work, small business automation, research delegation. This closes a gap. Claude and Anthropic have been shipping computer use for months. Muse is now in that conversation.
 
Connectors. 1,500 applications in a week. This matters not because all 1,500 will be good, but because it signals that Meta is turning Muse into a platform. Developers see a moment. Early builders [already shipped things like stylist apps, customer support routing, and email automation](https://bitroot.org/blog/2026-09-22-how-to-build-a-personal-stylist-app-with-muse-ai-a/) with Muse. Now there's an official way to build connectors. That's platformization. That's different from a one-off feature. That's Meta's real bet.
 
**The noise:**
 
Avatar. It's delightful. Video chatting with Jolly might be the most Metaverse thing Meta's done in three years. But it's not a capability upgrade. It's a UX refinement. Does a face make you trust the agent more? Maybe. Does it make the agent smarter or more autonomous? No. (Though Meta's Alexandr Wang hinted that avatar development taught them things about AI personhood that might matter later.)
 
Glasses. Coming "in the coming months" with no date. In Silicon Valley time, that's code for "we're not sure when this ships." It's also code for "this is strategically important but technically hard." Muse on your Ray-Bans is a 2027 story, not a September 2026 story.
 
## The Real Gaps Remain Unsolved
 
Here's what Meta didn't announce. And what founders actually care about.
 
**Data security and privacy model.** Muse lives in a virtual machine, per Meta. But where does your task history live? If I ask Muse to "email the CEO that we hit $5M ARR," where does that datapoint sit? Amazon's S3 bucket? Meta's servers? Can I delete it? Can Meta see it? The keynote had no answer. [Meta's official documentation on Muse](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/) says it follows their data policies, but that's not the same as "we promise this is private." Founders are still guessing.
 
**Cost model clarity.** Zuckerberg said "free tokens for a huge number, then we take a small transaction fee." Translation: Meta hasn't decided how much Muse costs yet. Until that's transparent, teams can't model ROI. Compare that to Claude ($4/M input, $20/M output) or GPT-5.6 ($2/M, $12/M). You can budget. Muse? Still unknown.
 
**Reliability benchmarks.** Muse Spark 1.3 is Meta's reasoning model for agents. But where are the benchmarks? How often does it succeed vs fail at multi-step tasks? Does it know when to ask for help? Does it hallucinate? The keynote showed a demo. Demos always work. Real-world automation always fails sometimes. Where's the failure analysis? Still waiting.
 
## When These Updates Matter
 
The updates move Muse closer to viable in specific scenarios:
 
**Personal assistant work.** If you want Muse to book your calendar, log expenses, and handle email on behalf of a busy founder, Mac control plus email address plus background operation gets you there. That's real. September 23 makes that plausible.
 
**Small business automation.** A Shopify store owner who wants Muse to handle inventory and customer follow-up now has Shopify + Muse + connector platform. That's tooling. The 1,500 connectors signal that builders see use cases. Some will be real.
 
**Vertical agents.** The stylist app pattern is becoming real. Muse as a white-label agent layer for specific jobs. That's a platform play. September 23 accelerates that.
 
**Research and knowledge work.** Mac control means Muse can operate your research tools, pull data, and write reports. That's a productivity upgrade over chat-only agents. But only if reliability improves (back to benchmarks).
 
## What's Still Missing
 
The gaps September 23 didn't close:
 
**Multi-tenant security.** If Muse controls your Mac, how do you stop it from reading files it shouldn't? Claude has this problem too, but Anthropic's approach is at least documentable. Meta's approach is still vague.
 
**Skill composition.** Muse can't yet (as far as we know) run another agent's skill or delegate upward. If your assistant hits a wall, it fails rather than escalating. That's okay for basic tasks. Bad for anything that needs conditional logic or human handoff.
 
**Honest failure modes.** We don't know what Muse is bad at. Every agent platform has blindspots. OpenAI documented theirs. Anthropic documented theirs. Meta hasn't. Until they do, early adopters are beta testers in a beta.
 
## Comparison to Real Alternatives
 
How does September 23 stack up?
 
**vs Claude agents.** Claude's computer use ships with benchmarks, documented failure modes, and transparent pricing. Muse now has Mac control (catch up). Claude has Claude Opus 5.5 at $4/M input (cheaper than GPT-5.6). Muse's pricing is still unknown. Edge: Claude, until Muse prices clarify.
 
**vs OpenAI agents.** OpenAI has been shipping agent features since May. GPT-4 Agents are in the wild. They have documented performance (success rates, latency, error types). Muse is newer and catching up. Edge: OpenAI (maturity), but Muse is closing the gap.
 
**vs Jev System One.** Jev is a different category (decision models, not agentic work). But founders evaluating "which routing layer do I build on" now have three options: LLMs (Claude, OpenAI), agentic platforms (Muse, OpenAI), or decision models (Jev). Muse's September 23 updates don't change that tradeoff.
 
## Honest Assessment: Should You Re-Evaluate Muse?
 
If you were considering Muse in August, September 23 changes the question slightly.
 
**Yes, re-evaluate if you:**
- Need Mac control for multi-step research or automation (new capability)
- Want email-based task delegation (coming soon, real pain point solved)
- Are building a vertical agent with connectors (platform now real enough)
**Stay put if you:**
- Need transparent cost modeling (still waiting)
- Require documented reliability benchmarks (still waiting)
- Want a privacy-first architecture (still not the story)
- Are fine with Claude agents today (mature, documented, cheaper)
The pattern: September 23 makes Muse viable for early builders and automation-focused teams. It doesn't yet make it the default for conservative enterprises or cost-sensitive startups. Meta is still 12–18 months away from "Muse is the obvious choice for agents."
 
## The Real Play
 
The connector strategy is Meta's bet. Zuckerberg didn't spend eight minutes on avatars. He spent time on "developers can now build connectors." That's the platform play. 1,500 applications in a week means the market believes the thing could happen.
 
If 5% of those become real connectors, that's 75 new integrations for founders to work with. If 20% become real (optimistic), that's 300. By December, Muse could have more third-party connectors than Claude or OpenAI agents. That changes the tradeoff.
 
Until then, September 23 is "Muse is getting there." Not "Muse is the answer."
 
---
 
Want to build an agent instead of choosing between platforms? [Get the step-by-step guide for building AI agents with Claude Code](https://bitroot.org/guides/build-ai-agent-claude-code-no-code-setup/) — no advanced setup required.
 
Already decided on Muse? [Explore Bitroot's other founder guides](https://bitroot.org/guides/) for implementation patterns across all platforms.
