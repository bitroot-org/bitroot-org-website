---
date: '2026-09-16'
excerpt: 'Diogo Almeida''s Jev is 40–400x cheaper and 20–200x faster than Claude. For decision models, not chatbots. Cost breakdown and when to use.'
image: https://pbs.twimg.com/card_img/2099924718921097216/XvBM0XUg?format=jpg&name=small
published_at: '2026-09-16T12:09:00.878Z'
sources: []
tags:
- 'AI Models'
- 'Founders'
- 'Cost Optimization'
title: 'Jev vs Claude: $0.042 Per Million Tokens (Sept 2026)'
---

ChatGPT co-inventor Diogo Almeida just [launched Jev](https://x.com/CompleteSkeptic/status/2099925682726002904), a fundamentally different kind of frontier AI. It's not a chatbot. It doesn't generate text. And it costs 40–400x less than Claude or GPT-6 Astra while running 20–200x faster.
 
For founders building D2C, SaaS, or high-frequency decision systems, this is worth understanding. Not because Jev replaces Claude. But because it reveals something about how AI actually moves from research to product: text generation was step one. Decision-making is step two.
 
## What Changed: System One vs System Two
 
Claude, GPT-6 Astra, and Fable 5.1 are all designed the same way: they take text in, generate text out, one token at a time. This is called System Two thinking—deliberate, slow, thorough. It's why Claude can write essays, debug code, and reason through complex problems.
 
Jev is the opposite. It's a System One model, built on a training method Almeida calls RLCD (Reinforcement Learning for Calibrated Decisions). It takes messy state in—an email, a log line, a support ticket, a JSON blob—and returns a typed probabilistic decision out.
 
Not: "Here's my analysis of your support ticket."
 
Instead: "probability=0.94, confidence=0.87" for the decision you asked for.
 
TypeSafe trained Jev over two years in stealth, funded by $40 million led by DCVC. [The company launched today](https://www.theneuron.ai/digest/everything-that-happened-in-ai-today-tuesday-september-15-2026/) (September 15, 2026) with early access via waitlist.
 
## Real Specs: Speed and Cost
 
Jev's core specs are aggressive:
 
**Speed:**
- Response time: 70–500 milliseconds (p50: ~150ms, p95: ~350ms)
- 20–200x faster than Claude, GPT-6 Astra, or Fable 5.1
- Latency matters because if AI returns in 150ms, developers can call it inside the software loop instead of after-the-fact
**Cost:**
- Input: $0.042 per million tokens
- Output: FREE
- 40–400x cheaper than frontier models (Claude Opus runs $5/$25 per million)
- [Early tester ran 5,000 requests](https://aisocratic.org/news/chatgpt-co-inventor-diogo-almeida-launches-jev-a-decision-model-he-says-is-20200x-faster-than-frontier-llms) for roughly $2
**Accuracy:**
- No independent benchmark yet (no paper published)
- TypeSafe's own testing shows calibration (confidence scores match actual accuracy)
- Launches with closed weights on US-hosted API
## Use Cases: Where Jev Actually Wins
 
Jev excels at decision tasks, not reasoning tasks. For founders, this means:
 
**Routing and classification:**
- Customer support ticket routing (which team? which tier?)
- Intent detection (is this refund request or feature request?)
- [Content moderation decisions](https://x.com/AGTPinsights/status/2099946094570733605) (is this review fake or legitimate?)
**Real-time decisions inside software:**
- Fraud detection (is this transaction risky? Score + probability)
- Product recommendations (which variant should this user see?)
- Workflow steering (should we escalate or resolve?)
**Chaining with LLMs:**
- Run Jev first to route/classify (cheap, fast, 150ms)
- Call Claude only if needed (expensive, slow, necessary for reasoning)
- Run Jev again after Claude to tag/score output (safety check)
The economic insight: if you're currently calling Claude for every decision, you're paying $5 per million input tokens. If you can do 90% of decisions with Jev first ($0.042 per million), you've just dropped costs by 100x on that 90%.
 
## Cost Breakdown: Jev vs Claude vs GPT-6 Astra
 
| Scenario | Jev | Claude Opus | GPT-6 Astra | Savings |
|----------|-----|------------|------------|---------|
| 1M classification decisions | $42 | $5,000 | $10,000 | 100–240x |
| 1M routing calls | $42 | $5,000 | $7,500 | 120–180x |
| Mixed (70% routing, 30% Claude) | $31 + $1,500 Claude | $3,500 | $5,000 | ~30% |
 
**The math:** If you route 1 million support tickets per month, Jev costs $42. Claude costs $5,000. Running Jev first, then Claude for complex cases, drops your total cost from $5,000 to ~$1,542.
 
## When Jev Wins vs When Claude Wins
 
**Jev wins when:**
- You have a pre-defined schema (classification, yes/no, scoring, selection)
- Latency is critical (<500ms preferred)
- You're making the same decision thousands of times
- You can't afford to call Claude for every decision
- You need confidence scores to know when to escalate to humans
**Claude wins when:**
- You need free-form reasoning (why this decision, not just what)
- You need explanation or justification (regulatory, customer-facing)
- The decision is genuinely novel (not pattern-matching)
- You need error handling outside a schema
- You can afford 2–5 second latency
**Honest tension:** Jev can't generate an answer outside the schema you defined. It can only choose the wrong option inside it. Claude can hallucinate entirely new answers. For high-stakes decisions (financial, legal, medical), this schema constraint is actually a feature. For creative work, it's a liability.
 
## The Architecture Question: Why TypeSafe Built This
 
Diogo's founding question: "Why have superhuman chat models not led to AGI?"
 
His answer isn't a bigger chat model. It's recognizing that AGI-adjacent progress doesn't come from better text generation. It comes from AI that can sit inside decision loops, at 150ms latency, and cost $0.042 per million tokens.
 
[Frontier models](https://anthonymaio.substack.com/p/jev-the-language-model-that-wont) (Claude, GPT-6, Fable 5.1) optimized for reasoning. Jev optimized for throughput and latency. These are different optimization targets.
 
The implication: the next wave of AI economics isn't "replace humans with AI." It's "embed AI into every decision, call it thousands of times per day, and make it cost-invisible."
 
## When NOT to Use Jev
 
**Don't use Jev if:**
- You're doing reasoning-heavy work (complex analysis, debugging, planning)
- You need explanation for regulatory compliance
- Your decision schema isn't pre-defined
- You can afford 2–5 second latency
- [You're evaluating something genuinely novel](https://www.modemguides.com/blogs/ai-news/jev-typesafe-reality-check-run-locally) to the model
Jev is a specialized tool. Useful for production workflows. Not a replacement for Claude.
 
## Practical Decision: Jev vs Claude for Your Stack
 
**If you're a founder handling 10K+ decisions/month in your product:**
1. Write your decision schema (is this spam? Low/Medium/High risk?)
2. Test Jev on 1,000 examples (~$0.05)
3. If accuracy >90%, use Jev for all decisions
4. If accuracy <90%, use Jev + Claude (Jev routes, Claude decides)
**Cost impact:**
- 10K decisions/month with Claude: $50
- Same with Jev: $0.50
- Jev + Claude hybrid (90/10 split): $5
---
 
Want to understand how AI models move from research to product? This is the moment. Jev represents a shift from optimizing for reasoning to optimizing for scale, cost, and latency. For founders, that shift changes how you architect every decision layer in your product.
