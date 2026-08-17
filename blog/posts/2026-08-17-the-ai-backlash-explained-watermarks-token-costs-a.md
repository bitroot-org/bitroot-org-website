---
date: '2026-08-17'
excerpt: 'Dario Amodei, CEO of Anthropic, recently responded to criticism that his warnings about AI risks have fueled public backlash against the technology. His diagnosis was precise: "I think it is fundamentally a crisis of trust. Ordinary people don''t trust companies, governments, or the tech industry and always suspect that we are cooking up some new way to screw them over."'
image: https://techcrunch.com/wp-content/uploads/2026/02/GettyImages-2261514463.jpg
published_at: '2026-08-17T06:40:47.319Z'
sources: []
tags:
- 'AI'
title: 'The AI Backlash Explained: Watermarks, Token Costs, and Misaligned Incentives'
---

Dario Amodei, CEO of Anthropic, recently responded to criticism that his warnings about AI risks have fueled public backlash against the technology. His diagnosis was precise: "I think it is fundamentally a crisis of trust. Ordinary people don't trust companies, governments, or the tech industry and always suspect that we are cooking up some new way to screw them over."
 
His diagnosis resonates. But his root-cause analysis may be incomplete.
 
The crisis of trust may not stem primarily from messaging or perception. Instead, evidence suggests structural incentive misalignment between AI companies and their users. The pattern is reflected not in words, but in actions.
 
---
 
## The Timeline: How Incentive Misalignment Eroded Trust
 
**2023-2024: The Promise Era**
 
AI companies articulated a future where advanced AI would be "democratized," accessible to everyone, and aligned with human flourishing. OpenAI promised "superintelligence benefits all of humanity." Anthropic committed to building AI systems that are "interpretable, steerable, and robust." Google announced open-sourcing models for the common good.
 
These statements reflected genuine aspirations. But they rested on an implicit assumption: that AI companies' incentives would align with public benefit.
 
Over time, structural economics created tension with these aspirations. Proprietary AI models generate revenue through token consumption. This creates incentive to maximize tokens per request. Users' interests align differently—they want predictable costs and efficiency. The incentive structures diverged from the stated mission.
 
**2024-2025: The Cost Explosion**
 
Token prices fell 67% year-over-year. Meanwhile, enterprise AI spending doubled in six months. This pattern suggests an economic dynamic: proprietary AI labs have revenue model tied to token consumption. When tokens consumed rise faster than prices fall, total revenue still grows.
 
Enterprises observed this. Uber deployed Claude Code to 5,000 engineers in December 2025. By April, the entire 2026 AI budget was spent. Seventy percent of code was AI-generated—the deployment functioned as intended. But token consumption exceeded every budget projection. Finance teams noted a structural pattern: the business model creates incentive to maximize tokens per request, and visibility into cost drivers is limited. (We detailed this dynamic in our [token burning](https://bitroot.org/blog/2026-08-14-token-burning-why-proprietary-ai-models-waste-your/) analysis, including Uber's case study.)
 
This dynamic contributed to growing skepticism about AI economics.
 
**2025-2026: The Infrastructure Play**
 
In August 2026, Anthropic announced watermarking all Claude outputs. Stated rationale: EU transparency requirements. Technical effect: each watermarked output creates a data point documenting Claude's use at scale and across applications. The watermark is imperceptible to users but detectable to Anthropic.
 
Why does this matter? Because it creates capability for attribution. Usage data could potentially support future arguments about value contribution or pricing arrangements. Consider the economic logic: if you can document which customers used Claude at what scale, you create the technical foundation for usage-based commercial discussions. (We explored this dynamic in detail in our [watermark economy](https://bitroot.org/blog/2026-08-13-the-watermark-economy-how-ai-companies-could-claim/) analysis.)
 
This isn't speculation about hidden motives. It's straightforward incentive analysis: the infrastructure being constructed now could theoretically enable future value-attribution claims.
 
Observers noted this pattern: the watermarking announcement creates capability that could support usage-based pricing negotiations. This observation contributed to skepticism about long-term transparency and cost predictability.
 
**2026: The Regulatory Tension**
 
Amodei also stated that Anthropic proposes regulation carefully: "We try very hard to make proposals that disadvantage (slow down) frontier AI companies while advantaging smaller competitors."
 
Consider the structural incentive here: Anthropic is itself a frontier AI company. Regulation that disproportionately burdens frontier competitors could raise barriers to entry for smaller players—potentially concentrating rather than distributing market power. When framed as principled, this creates an apparent tension between stated intent and potential market effect.
 
This structural tension may contribute to skepticism. When a company proposes regulatory frameworks that align with its own market interests while being framed as principled, stakeholders reasonably scrutinize whether the principle or the competitive interest is primary.
 
---
 
## Why Messaging Alone May Not Address This
 
Amodei's proposed solution is better communication. Anthropic publishes essays about "machines of loving grace" and emphasizes being "about equally balanced between risks and benefits" in its public statements.
 
But a structural tension exists: when stated commitments and implementation patterns appear misaligned, messaging efforts face credibility challenges.
 
Consider the patterns:
 
**Pattern 1: Watermarks**  
Public framing: Transparency and EU compliance  
Infrastructure implication: Capability to track usage at scale
 
**Pattern 2: Token consumption**  
Public framing: Model capabilities improvement  
Economic reality: Higher token consumption increases revenue
 
**Pattern 3: Regulatory proposals**  
Public framing: Leveling the competitive playing field  
Structural effect: Regulation that burdens frontier competitors could raise barriers to entry
 
Each pattern individually could reflect legitimate business decisions. Collectively, they may suggest: the company's actions align with its market interests, even while messaging emphasizes broader public benefit.
 
This pattern may contribute to trust erosion. When stakeholders perceive tension between stated values and incentive structures, messaging efforts often face headwinds. Trust may require not just communication changes, but incentive alignment.
 
---
 
## Comparison: Open-Source and Alternative Structures
 
Contrast this dynamic with open-source models (GLM-5.2, Llama, Mistral) and smaller players like Writer.
 
Open-source models operate without per-token revenue models. This structural difference removes one incentive: there's no direct financial benefit to maximizing token consumption. No built-in mechanism to expand usage for revenue growth. The business model (when present) typically centers on services, deployment support, or fine-tuning—not on usage tracking and future value claims.
 
This difference reflects different economic structures, not virtue differences. When infrastructure costs decline with efficiency, the business incentive shifts: lower token consumption = reduced costs = improved margins.
 
Writer's 2026 announcement (Palmyra X6 + harness optimization for 50% cost reduction) illustrates this dynamic. The company's interests align with customer cost reduction. No built-in mechanism to expand tokens per request. Just parallel incentives toward efficiency.
 
This structural difference may contribute to different trust perceptions: when a company's revenue doesn't depend on maximizing usage, it can afford transparency about efficiency. This isn't inherent to open-source projects—it's structural economics making transparency economically rational.
 
---
 
## The Gap Between Diagnosis and Solution
 
Amodei said: "The most accurate criticism of AI companies including Anthropic is that we haven't yet delivered on our big promises to benefit the world. That is totally on us."
 
His diagnosis of the problem is compelling. But his proposed solutions—better messaging and more principled regulation—may not address the underlying mechanism.
 
The gap may reflect a structural challenge: AI companies have revenue incentives to:
- Increase tokens consumed per request (larger transaction size)
- Track usage at scale (establish value-attribution capability)
- Concentrate power through regulation (raise competitor barriers)
These incentives can coexist with public commitment to broader benefit. But they create structural tension.
 
True incentive alignment would require:
- Cost structures that benefit from efficiency (not token expansion)
- Minimal usage tracking infrastructure (limit future leverage capability)
- Open competition (not regulatory concentration)
- Long-term customer relationship alignment (not short-term extraction)
Such changes would likely rebuild trust. But they would also materially change revenue structures and competitive positioning.
 
---
 
## The Pattern and Its Implications
 
The public skepticism around AI may reflect more than messaging concerns. Evidence suggests it correlates with observable patterns of incentive misalignment: token expansion accelerating past price decreases, infrastructure deployed to enable future usage-based claims, regulation proposed that aligns with company competitive interests.
 
We've explored these dynamics across three recent analyses: how [watermarks establish economic leverage](https://bitroot.org/blog/2026-08-13-the-watermark-economy-how-ai-companies-could-claim/), why [token costs explode](https://bitroot.org/blog/2026-08-14-token-burning-why-proprietary-ai-models-waste-your/) faster than prices fall, and now how these patterns may contribute to the current trust crisis. Together, they reveal a coherent story: structural incentive misalignment between AI companies and their users.
 
Companies that have built trust—open-source projects, cooperatives, companies structured around user cost efficiency—share a different incentive structure. Revenue doesn't depend on maximizing usage metrics. This may enable different approaches to transparency and cost predictability.
 
Amodei correctly identifies a trust crisis. His analysis of causation focuses on perception and messaging. But evidence suggests the crisis may reflect deeper structural economic incentives. Resolving it may require more than communication changes—it may require fundamental incentive realignment.
 
Until—or if—those incentives change, communication efforts may face structural headwinds. Trust in companies with misaligned incentives is difficult to rebuild through messaging alone.
 
For more on AI economics and incentive misalignment, [visit Bitroot](https://bitroot.org).
