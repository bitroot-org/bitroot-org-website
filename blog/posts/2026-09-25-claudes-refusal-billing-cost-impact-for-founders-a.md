---
date: '2026-09-25'
excerpt: 'Anthropic charges for some refusals starting Sept 23. But what''s the actual cost? A founder''s breakdown with budget modeling framework and false positive analysis.'
image: https://pbs.twimg.com/card_img/2100951169808171009/WH4SuF2U?format=png&name=small
published_at: '2026-09-25T07:21:10.691Z'
sources: []
tags:
- 'AI'
- 'Pricing'
- 'Technical'
- 'Anthropic'
- 'Claude'
title: 'Claude''s Refusal Billing: Cost Impact for Founders (And How to Avoid It)'
---

[Anthropic announced something on September 23](https://x.com/claudedevs) that most founders glossed over: Claude now charges for some refusals.
 
Not all refusals. Three specific categories: biology, frontier LLM development, and reasoning extraction. The others (cybersecurity work, general harms) stay free. And if your safety classifier catches a request before Claude even tries to answer — 99.7% of blocked requests — you don't pay.
 
But here's the question nobody answered: what does that actually cost you?
 
## What Changed on Sept 23
 
Anthropic implemented a billing change to refusals that arrive *before* any output. The policy:
 
**Charged refusals** (you pay):
- `bio` — requests that could enable biological harm
- `frontier_llm` — requests related to competing AI model development
- `reasoning_extraction` — asking Claude to expose its internal reasoning as text
**Free refusals** (you don't pay):
- `cyber` — cybersecurity and hacking requests
- `general_harms` — everything else (violence, misinformation, illegal activity, etc.)
The reasoning: bio, frontier_llm, and reasoning_extraction are the categories where Anthropic measures low false positive rates. Anthropic is confident the classifier is right in these areas. The others (cyber especially) have higher false positive rates, so Anthropic eats the cost.
 
Why charge at all? According to Claude Developers, "to disrupt attempts to circumvent Anthropic's safeguards at scale." Translation: if someone builds an automated probe trying 10,000 variations of "help me make bioweapons," Anthropic wants them to feel the cost, not hide behind free infrastructure.
 
## The Real Math: How Much Does 0.3% Cost?
 
Here's what nobody broke down in the announcement.
 
Anthropic says 99.7% of requests using Claude Code, Claude.ai, or Cowork didn't hit these "newly billable blocks." That's 99.7% success. Which means 0.3% false positives.
 
On a small app, 0.3% is noise. On a high-volume app, 0.3% is real dollars.
 
**Example: Chatbot with 100K requests/month**
 
```
100,000 requests × 0.3% false positive rate = 300 false positives
300 refusals × $0.01 avg refusal cost = $3/month impact
Cost: negligible
```
 
**Example: Automation tool with 10M requests/month**
 
```
10M requests × 0.3% false positive rate = 30,000 false positives
30,000 refusals × $0.01 avg refusal cost = $300/month impact
Cost: noticeable, but manageable
```
 
**Example: High-frequency inference (researcher, researcher with reasoning models)**
 
```
50M requests/month × 0.3% false positive rate = 150,000 false positives
150,000 refusals × $0.01–$0.10 cost = $1,500–$15,000/month impact
Cost: significant (now worth implementing fallback)
```
 
The actual refusal cost depends on which category triggers and which model you're using. A false positive on frontier_llm (e.g., accidentally asking Claude about LLM architecture safety) hits you the same as a real attempt. A false positive on reasoning_extraction (e.g., "explain your step-by-step reasoning" as part of a legitimate prompt) also costs.
 
## Model-by-Model: Which Claude Charges You
 
The charging applies across all Claude models: Fable 5.1, Fable 5, Opus 4.8, and earlier versions. [Here's the full refusal billing breakdown in the official docs](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback#how-refusals-are-billed). [When you're selecting which Claude to use](https://bitroot.org/blog/2026-08-04-claude-model-selection-for-founders-the-100-to-10k/), the refusal billing is now part of the equation.
 
Fable 5 (at $10/M input, $50/M output) is Anthropic's most capable tier and carries higher per-token refusal costs. Opus 4.8 (at $5/M input, $25/M output) sits in the middle. Sonnet 5 (at $3/M input, $15/M output) is cheaper. The tradeoff:
 
- Using Sonnet for cost savings + hitting false positive on frontier_llm = cheap false positive
- Using Fable for quality + hitting false positive on frontier_llm = expensive false positive per occurrence, but fewer false positives overall
You're trading false positive frequency (Fable) against false positive cost (Opus). Neither is obviously better.
 
## When This Actually Matters vs. When It Doesn't
 
**Cost is negligible if you:**
- Build chatbots or Q&A assistants (most requests succeed, 0.3% false positive = acceptable)
- Use Claude for writing, summarization, or analysis (refusal triggers are rare in these workflows)
- Have <5M requests/month (0.3% of 5M = 15K refusals; at $0.01–$0.10 each = $150–$1,500/month)
- Don't use reasoning extraction or frontier_llm features (two of the three billed categories)
**Cost is worth addressing if you:**
- Run automation or agent systems at scale (high request volume, higher refusal risk)
- Use reasoning models frequently (reasoning_extraction is a named category)
- Are close to hitting API rate limits (means you're high-volume enough to feel 0.3%)
- Build compliance, security, or bio-adjacent tools (frontier_llm and bio false positives are real)
For most bootstrapped founders (<$1M ARR), the answer is: cost is negligible. For Series A teams running high-volume automaton, the answer is: implement fallback.
 
## The Fallback Strategy: Worth It or Not?
 
Anthropic makes fallback easy. When Claude refuses a request, you can automatically retry on a different model (like Opus 5.5) and get the answer. The cost: one extra API call (input tokens re-billed, output tokens from the fallback model).
 
**Cost-benefit of fallback:**
 
```
Fallback costs you: Another full API call (input tokens re-billed + output from fallback model)
 
If average request is ~500 input tokens + 200 output tokens:
- Fallback to Sonnet: 500 × $3M + 200 × $15M = $0.0015 + $0.003 = $0.0045 per fallback
- Fallback to Opus: 500 × $5M + 200 × $25M = $0.0025 + $0.005 = $0.0075 per fallback
 
If you have 30,000 false positives/month at mid-range cost ($0.01 each):
- Do nothing: 30K × $0.01 = $300/month
- Implement fallback to Sonnet: (30K × $0.0045 fallback cost) = $135/month
- Savings: $165/month
 
For high-volume apps, fallback is a no-brainer. For low-volume apps, skip it.
```
 
The other cost: engineering time to implement fallback correctly. Anthropic provides SDK middleware that wraps it all, so setup is straightforward. If your monthly savings exceed your engineering cost, implement it.
 
## Budget Modeling Framework: Predict Your Refusal Costs
 
Use this framework to estimate your refusal cost impact.
 
**Step 1: Estimate your monthly request volume**
- Count all API calls you make to Claude across all products
- Example: 100K requests/month
**Step 2: Estimate your false positive rate**
- Anthropic's baseline: 0.3% for bio, frontier_llm, reasoning_extraction combined
- Your baseline: likely similar unless you're aggressively probing safeguards
- Conservative assumption: use 0.5% (higher than Anthropic's 99.7% success baseline)
- Example: 100K × 0.5% = 500 false positives/month
**Step 3: Estimate refusal cost**
- Refusal before any output = charged only for bio, frontier_llm, reasoning_extraction
- Cost varies by model: Haiku ($0.001–$0.005), Sonnet ($0.003–$0.015), Opus ($0.005–$0.025), Fable ($0.01–$0.05)
- Assume mid-range for your model; example uses $0.005: 500 × $0.005 = $2.50/month
**Step 4: Decide on fallback**
- If refusal cost < $50/month: skip fallback, absorb the cost
- If refusal cost > $50/month: implement fallback (payoff in 1–3 months)
- Example: $2.50/month → skip fallback
**Step 5: Compare to your total Claude spend**
- Refusal cost as % of total API spend
- Example: $2.50 / $500/month = 0.5% (negligible)
For most founders, refusal cost is <1% of total spend. For high-volume automation teams, it's 2–5%. Only in extreme cases (researcher with 50M+/month requests) does it hit 5–10%.
 
## Honest Assessment: Does This Change Your Claude Decision?
 
No, for most founders. Here's why:
 
**What this doesn't change:**
- Choosing Fable vs Opus (quality/cost tradeoff is still the primary factor)
- Whether to use Claude at all (refusal cost is small vs token cost)
- Building with Claude (99.7% of requests aren't affected)
**What this might change:**
- How you architect for scale (fallback becomes a cheap insurance at 10M+/month)
- Your budget buffer (add 1–2% to your Claude API budget forecast)
- Your choice of Claude model if you're close between two (Opus slightly more attractive due to lower false positive rate)
The bigger pattern: Anthropic is making refusals more expensive only for categories where they're confident (bio, frontier_llm, reasoning_extraction have low false positive rates). It's a signal that Anthropic's classifier is getting better, not a sudden cost explosion.
 
Compare this to [early 2026 when API usage limits were a bottleneck](https://bitroot.org/blog/2026-05-07-claude-partners-with-spacex-to-raise-api-usage-lim/). That was a real constraint. This is a rounding error for most teams.
 
## What You Should Do Now
 
1. **Estimate your refusal cost** using the framework above
2. **If <$50/month impact:** do nothing, add 1% buffer to your Claude budget forecast
3. **If >$50/month impact:** implement fallback (Anthropic's SDK middleware makes this straightforward)
4. **Monitor your refusals** — emit a metric per refusal in production so you catch surprises
That's it. Anthropic's refusal billing is a small cost increase for a small set of categories. The rest of your Claude strategy stays the same.
 
---
 
Get your Claude API refusal cost calculator. Answer 5 questions about your workload and see your monthly false positive impact. [Use the guide](https://bitroot.org/guides/reduce-claude-api-costs/).
 
Just want the answer? For most founders <$1M ARR, refusal cost is <1% of your Claude budget. Skip this unless you're at 10M+/month requests.
