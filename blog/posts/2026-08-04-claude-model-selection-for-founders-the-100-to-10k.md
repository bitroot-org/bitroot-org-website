---
date: '2026-08-04'
excerpt: 'This guide is for solo founders, pre-seed teams, and anyone building on
  runway. It answers the question you actually need answered: "Which Claude model
  can I afford right now, and when do I upgrade?"'
image: null
published_at: '2026-08-04T08:52:55.675Z'
sources:
- https://claude.com/blog/claude-models-explained-choosing-the-best-model-for-your-use-case
tags:
- AI
- Claude
- API
title: 'Claude Model Selection for Founders: The $100-to-$10K Runways'
---

One bad API choice can cost you three months of runway.
 
Here's why: If your product makes 100K API requests daily and you default to Opus, your monthly bill hits $2,250. If you accidentally used Fable instead, it would be $23K. The same product built with Haiku and Sonnet routing? Under $400/month. The difference isn't product quality—it's model selection.
 
This guide is for solo founders, pre-seed teams, and anyone building on runway. It answers the question you actually need answered: "Which Claude model can I afford right now, and when do I upgrade?"
 
---
 
## The Four Model Tiers (And What They Cost)
 
**Haiku** — $1 input / $5 output per million tokens  
**Sonnet** — $2 input / $10 output per million tokens (through August 31, 2026; then $3/$15)  
**Opus** — $5 input / $25 output per million tokens  
**Fable** — $10 input / $50 output per million tokens
 
What does this mean? One million tokens is roughly 750,000 words. If your product generates one response per user request (average 500 words), Haiku costs $0.0025 per request. Sonnet costs $0.015. Opus costs $0.025. Fable costs $0.10.
 
At 100 daily requests:
- Haiku: $7.50/month
- Sonnet: $45/month
- Opus: $75/month
- Fable: $300/month
At 1,000 daily requests:
- Haiku: $75/month
- Sonnet: $450/month
- Opus: $750/month
- Fable: $3,000/month
The founder who hit $23K per month? They were running 100K daily requests on Opus. Simple math: Sonnet would have cost $4,500. Fable would have cost $30K. Haiku would have cost $750. Same product. Same user experience. Different tier decision at the start.
 
---
 
## The Founder Tier Strategy
 
**If you have 12 months of runway: Start with Haiku**
 
Haiku is faster than Sonnet and costs 80% less. For many early-stage tasks—summarization, classification, routing, support drafts, email generation—Haiku delivers sufficient quality. The mental model: use Haiku until it fails on a specific task, then escalate to Sonnet for that type of work.
 
Cost: ~$10-50/month until you hit 10K daily requests.
 
**If you have 6 months of runway: Haiku + Sonnet hybrid**
 
Haiku for high-volume, repetitive work (customer emails, tagging, routing). Sonnet for anything that requires reasoning: code generation, complex analysis, multi-step workflows. This is the sweet spot for most bootstrapped SaaS in 2026.
 
Cost: ~$200-400/month until you hit 50K daily requests.
 
**If you have 3 months of runway: Sonnet only**
 
Speed matters. You need to ship fast, iterate on user feedback, and prove the idea works. Sonnet trades cost for capability: roughly 2-3x more reasoning depth than Haiku at 2-3x the expense. It handles coding, writing, multi-step analysis, and agents without routing complexity.
 
Cost: ~$300-800/month until you hit 100K daily requests.
 
**If you've closed funding: Route and optimize**
 
Now you can afford the engineering lift. Use Haiku for 80% of requests (cheap, fast). Route complex tasks to Sonnet (reasoning-heavy). Reserve Opus or Fable for customer-facing magic moments (the things that build word-of-mouth).
 
Cost: $1K-5K/month optimized across all tiers.
 
---
 
## When to Upgrade Tiers
 
**Move to Sonnet when:**
- Haiku starts giving you wrong answers on core product tasks
- Customer complaints spike around AI quality
- You're shipping a feature where the AI output directly impacts retention
- You hit 5K daily requests (economies of scale make Sonnet cheaper per outcome)
**Move to Opus when:**
- Sonnet is struggling on your hardest tasks (code generation, multi-step agents)
- You're building autonomous workflows that need to get it right the first time
- You hit 50K daily requests and routing becomes worth the engineering overhead
- You have funding and need to compete on capability
**Don't move to Fable unless:**
- You've raised Series A and can afford the 2x Opus / 5x Sonnet cost premium
- You're building long-running autonomous agents where frontier capability matters
- You're directly competing on AI capability and competitors are using Fable
- Your product's value proposition depends on frontier-level performance
---
 
## Three Quick Wins to Save 50% on API Costs
 
**1. Enable prompt caching (90% discount)**
 
If you're asking Claude the same system prompt repeatedly (customer support, code review, content analysis), enable caching. The first request pays full price. Every subsequent request pays 10% of the input cost for the cached prefix. A 5,000-token system prompt costs $0.015 on Sonnet. Cached, it costs $0.0015. At 1,000 requests per day, that's $45/day saved.
 
**2. Route by complexity**
 
Don't send everything to your most capable model. Use a one-sentence classifier: "Is this task simple (Haiku), medium (Sonnet), or hard (Opus)?" Most SaaS products are 70% simple, 25% medium, 5% hard. A classifier takes 2K tokens and costs $0.006. Save $30+ per 1,000 requests by routing correctly.
 
**3. Use batch processing (50% discount)**
 
If your customers don't need instant responses, send requests through the Batch API instead of the regular API. It takes 24 hours but costs half as much. Perfect for overnight report generation, weekly summaries, background analysis.
 
---
 
## FAQ
 
**Q: Should I start with Haiku or Sonnet?**  
A: Haiku if you have 12+ months runway and time to iterate on when it fails. Sonnet if you have 3-6 months and need to ship fast. The "right" choice depends on whether you can afford to learn where each model breaks.
 
**Q: Will Haiku make my product feel cheap?**  
A: No. Haiku 4.5 is competitive with budget alternatives on coding and instruction-following, though it's weaker on mathematical reasoning. Test your specific use cases before committing. Users notice output quality, not price tier.
 
**Q: How do I know when to route to a more expensive model?**  
A: Try Haiku first. Log every task it fails on. When failures hit 5% of production requests, route those specific tasks to Sonnet. Don't over-engineer routing—start simple.
 
**Q: Can I mix models in one product?**  
A: Yes. Use Haiku for customer-facing, high-volume tasks (email drafts, tagging). Sonnet for internal tools and complex logic. Most bootstrapped teams end up here eventually.
 
**Q: What's the deal with Fable?**  
A: Fable is the most capable model but costs roughly 2x Opus and 5x Sonnet (with current intro pricing). Unless you're building long-running autonomous agents or competing directly on frontier capabilities, Fable is premature spending.
 
**Q: How do I prevent another $23K month?**  
A: Set up cost alerts. Cap daily request volume. Don't move to a more expensive tier without first testing it on 5% of traffic. A $5K test could save $20K in mistakes.
 
**Q: Should I switch to DeepSeek or another cheaper model?**  
A: Claude models are optimized for reasoning and code. DeepSeek is cheaper but less reliable for complex tasks. Don't sacrifice product quality for $200/month savings. Optimize within Claude first.
 
---
 
## Disclaimer
 
*This guide reflects Claude model pricing and capabilities as of August 2026. Pricing changes quarterly—verify current rates on Anthropic's pricing page before making production decisions. Model performance varies by task; benchmark your specific use cases before migrating traffic. Bitroot makes no warranty about model selection accuracy or cost projections for your product.*
