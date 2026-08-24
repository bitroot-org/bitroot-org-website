---
date: '2026-08-14'
excerpt: 'The signs started appearing in enterprise Slack channels around mid-2024: token costs doubling while output stayed flat. Projects running $5K/month on Claude suddenly cost $8K. The same API call that consumed 2,000 tokens last month now consumed 3,500 tokens.'
image: https://techcrunch.com/wp-content/uploads/2023/09/May-Habib-Disrupt-2023.jpg?resize=1280,853
published_at: '2026-08-14T07:06:11.996Z'
sources: []
tags:
- 'Open-source'
- 'AI'
title: 'Token Burning: Why Proprietary AI Models Waste Your Money (And How Open-Source Escapes It)'
---

The signs started appearing in enterprise Slack channels around mid-2024: token costs doubling while output stayed flat. Projects running $5K/month on Claude suddenly cost $8K. The same API call that consumed 2,000 tokens last month now consumed 3,500 tokens.
 
No feature changes. No improvement in output quality. Just more tokens burned.
 
---
 
## Real Incidents: Where Token Burning Happened
 
**Incident 1: Uber's Complete Budget Burn (December 2025 – April 2026)**
 
In December 2025, Uber deployed Claude Code to its engineering organization. The rollout succeeded by every technical measure: adoption climbed from 32% to 84% of roughly 5,000 engineers by March. Seventy percent of committed code was AI-generated. Autonomous agents handled 11% of backend updates.
 
By April, the entire 2026 AI budget was gone.
 
Uber's CTO noted he'd spent $1,200 in tokens during a single 2-hour personal demo. Power users were running $500-$2,000 monthly. The deployment worked exactly as intended. The budget assumptions were simply wrong—token consumption exploded faster than any finance team predicted.
 
**Incident 2: Context Window Accumulation in Long Conversations**
 
Technical teams running 20-message coding sessions discovered something unexpected: by message 20, each API call consumed 40,000 tokens. Individual messages were short, but history accumulated. Turn 1 sent 500 tokens. Turn 10 sent 15,000 cumulative tokens per call. By turn 20, token consumption had grown tenfold despite individual message length staying constant.
 
A 20-step agentic workflow can consume over 10× the tokens that simple per-step estimates suggest.
 
**Incident 3: Enterprise Spend vs. Per-Token Price (Market-Wide)**
 
Here's the paradox the industry faces: per-token prices fell approximately 67% year-over-year (Q1 2025 to Q1 2026, from $18.40 to $6.07 per million tokens). Simultaneously, enterprise AI spend more than doubled in six months (late 2024 to mid-2025, from $3.5B to $8.4B).
 
Token volume exploded past the price reductions. The FinOps Foundation's 2026 report found that 73% of enterprises said their AI costs exceeded original projections.
 
Prices are falling. Bills are rising. That's the sign of a system whose incentives are misaligned.
 
**The pattern:** Token burning happens at scale, across industries, and even in technically sophisticated companies. It's not inefficiency. It's the inevitable result of one side optimizing for volume (model providers) while the other side doesn't yet have the infrastructure to measure it (enterprises).
 
---
 
## The Incentive Problem (Restated)
 
Here's what we identified in our previous analysis: proprietary AI labs profit from token usage.
 
More precisely: Revenue = (tokens consumed) × (price per token)
 
To maximize revenue, they can:
1. Raise price per token (visible, invites backlash)
2. Increase tokens per request (invisible, harder to detect)
**The evidence that this is happening:** Token prices have fallen 67% year-over-year. Yet enterprise AI spend doubled in six months. Prices are doing their job—they're falling. But token volume is rising faster than prices are falling. That's exactly what you'd expect from a system where one side has incentive to maximize consumption while the other side scrambles to measure it.
 
The watermarking infrastructure we discussed earlier? That's about tracking (and eventually monetizing) which companies rely on their models. But the token expansion—the gradual, invisible cost creep—is already happening.
 
Enterprises are noticing. They're leaving.
 
---
 
## Open-Source Models: Aligned Incentives
 
Here's the crucial difference with open-source:
 
**With proprietary labs:**  
Cost = (tokens used) × (price set by provider)  
Provider incentive: Maximize tokens used ↑
 
**With open-source models:**  
Cost = (inference hardware) + (engineering)  
Provider incentive: Minimize tokens used ↓
 
The incentives are now *aligned* with your cost goals, not opposed to them.
 
This isn't theoretical. It explains why enterprises are suddenly embracing open-source models they would have rejected two years ago. Not because the models got better—they did, but marginally. But because the *cost structure* finally makes sense.
 
---
 
## Enter the Efficient Harness: Writer's Play
 
On August 13, Writer launched Palmyra X6, built on Z.ai's open-source GLM-5.2 model. They paired it with harness optimization.
 
**What is "harness optimization"?**
 
The harness is your orchestration layer—how you structure prompts, manage context, handle state between agent steps, encode/reuse information. Most enterprises built their harnesses in 2023-2024 when token costs were lower. They're still padding contexts, re-encoding history, over-specifying instructions.
 
**Writer's finding (from their research paper):**  
Testing across multiple models, harness changes reduced costs an average of 40%. Not model changes. *Harness* changes.
 
Implication: The biggest cost lever isn't model selection. It's infrastructure efficiency.
 
---
 
## Why This Matters (The Pattern)
 
**Phase 1 (2023-2024):** "Use the best proprietary model"  
- Cost was secondary  
- Enterprises built wasteful harnesses (token budgets were loose)
**Phase 2 (2024-2025):** "Token costs are exploding"  
- Enterprises realized token expansion was outpacing improvement
- Open-source models caught up in capability
- The incentive misalignment became visible
**Phase 3 (2025-2026 — Now):** "Optimize infrastructure first"  
- Enterprises migrating to open-source + efficient harnesses
- Model choice becomes secondary (good-enough performance at 50% lower cost)
- Companies like Writer showing the path forward
**Phase 4 (2026-2027 — Soon):** Open-source becomes enterprise baseline  
- Proprietary models become premium tier (cutting-edge only)
- Cost optimization becomes competitive advantage (not nice-to-have)
- Harness efficiency becomes differentiator
---
 
## What This Means for Founders
 
If you're building AI applications:
 
1. **Audit your harness.** How are you managing context? Re-encoding history? Structuring prompts? 40% cost savings are probably available.
2. **Question your model choice.** Are you using Claude/GPT-4 because you need it, or because it was default when you built? Open-source + optimized harness might outperform.
3. **Lock in pricing early.** If you're still on proprietary APIs, negotiate commercial terms now. Prices will keep rising as labs try to offset enterprise migration.
4. **Build cost accountability.** Track tokens per unit of output (per customer, per feature). Visibility into token waste is how you spot the problem.
5. **Plan your exit.** Open-source models are good enough for most enterprise workloads. Know your migration path.
The token burning you've observed? It's not random. It's economic incentive playing out. The solution isn't trusting the next proprietary model. It's understanding your own infrastructure and choosing providers with aligned incentives.
 
Open-source models, by their nature, have those aligned incentives. Writer's approach—open-source + optimized harness—is the template for the next generation of AI applications.
 
For more on building cost-efficient AI applications, [visit Bitroot](https://bitroot.org).
