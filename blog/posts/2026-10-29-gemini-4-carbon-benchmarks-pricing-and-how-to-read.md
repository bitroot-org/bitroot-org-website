---
date: '2026-10-29'
excerpt: 'Google''s Gemini 4 Carbon claims top scores on several tests. Here''s how it compares with Argon, what the pricing really costs, and how to read self-reported benchmarks before you switch models.'
image: https://pbs.twimg.com/card_img/2115508936493408256/hMcvop7k?format=jpg&name=small
published_at: '2026-10-29T06:27:11.646Z'
sources: []
tags:
- 'Gemini 4 Carbon'
- 'Gemini 4 Argon'
- 'LLM benchmarks'
- 'AI API pricing'
- 'model evaluation'
- 'AI cost planning'
title: 'Gemini 4 Carbon: Benchmarks, Pricing and How to Read Them'
---

**Google's Gemini 4 Carbon arrived on October 28 with a strong set of self-reported scores, and the pricing looks familiar.** Google's **[launch post](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/)**, written by Koray Kavukcuoglu, claims Carbon ranks first on the Artificial Analysis Intelligence Index v5.0 with a score of 59. The model is not yet open to most developers, so the numbers you can act on today are the price and the access terms. Read the benchmarks as Google's account until an independent test confirms them.
 
## How Carbon and Argon Compare
 
**Carbon is the newer and more cautious release.** Gemini 4 Argon reached general availability on October 13, about two weeks after Google first gave it to a small group of cyber defenders, according to a **[Computing for Geeks review](https://computingforgeeks.com/gemini-4-argon-released-features-benchmarks/)**. Carbon followed on October 28, and it is the model Google is positioning for security work.
 
**Google's own comparisons are relative, not a full table.** The launch post says Carbon has more than twice Argon's secure-code success rate and cuts unsupported claims by about half. It also reports overreach down 26% and under-service down 29%, along with a near-80% drop in high-severity misalignment alerts during live coding. Those comparisons are useful, but they lack the base numbers and test setup, so you can't rebuild them.
 
**The two models' published scores use different tests.** Argon's figures come from Google's model card, as covered by the Computing for Geeks review. They include 68.9% on the Vals Index and 84.2% on GraphWalks at the longest context tested. Carbon's post lists different tests, including SEC-bench Pro at 88.2%, ExploitGym at 54.8% and CWE-bench at 71.0%. Because the two sets rarely overlap, don't rank them on a single leaderboard from these posts alone.
 
**Independent comparison data exists for Argon against GPT-6.1 Sol.** The **[Vals AI comparison page](https://www.vals.ai/comparisons/google_gemini-4-argon-vs-openai_gpt-6.1-sol)** covers 28 shared benchmarks. Argon leads on 18 of them and GPT-6.1 Sol leads on nine, including Terminal-Bench-Science (44.29% for Argon against 52.86% for Sol). The page doesn't include Carbon, so it can't settle the Carbon question. It does show that Argon's Vals Index is 69.24%, while Google's table lists 68.9%. The gap is small, but it's a reminder that two sources can report the same test differently.
 
**The index figures point the same way, with one caveat.** Carbon scores 59 on Artificial Analysis v5.0, and Argon scores 53 on the same index, according to the Computing for Geeks review. The two numbers come from different sources, and I could not open the Artificial Analysis page to confirm Carbon's entry directly. Treat the gap as a lead to check, not a settled ranking. For another head-to-head that tests models on a single real task, read our **[Astra vs Fable comparison](https://bitroot.org/blog/2026-09-04-gpt-6-astra-vs-fable-5-1-for-blender-which-ai-mode/)**.
 
## What the Pricing Looks Like
 
**Both models start at the same introductory rate.** Google lists Carbon at $2 per million input tokens and $10 per million output tokens during an introductory period. After that, the rate rises to $4 input and $20 output.
 
**Carbon's end date is not stated.** Google's post gives the price step but no date for when the introductory rate ends. The Computing for Geeks review says Argon's introductory rate runs until November 30 and the higher rate starts December 1. Don't assume Carbon follows the same schedule until Google confirms it.
 
**Cached input is the lever to model.** Google says cached input costs 95% less than standard input. For a product that resends the same long system prompt on each call, cached input can outweigh the headline rate. Run your own token counts before you budget.
 
**Output tokens drive most of the cost.** At $10 or $20 per million, output is five times the input price. Count the length of the answers your product produces, not just the prompts you send.
 
## How to Read Self-Reported Benchmarks
 
**Check the conditions first.** Google says its external benchmarks were "evaluated without guardrails." That is a fair test of raw capability, but your product will run with guardrails, so the scores may not carry over. The post doesn't say which thinking setting was used for its internal tests.
 
**Notice which tests are named.** Some results come with test names and comparison scores, such as WebDev Arena at 1768 Elo, ranked fourth. Others, like the claim that Carbon "performed more than 10X better" than an unnamed lab's frontier model, can't be checked. Weight the named results more heavily.
 
**Compare the same test across sources.** The Vals page and Google's Argon table give slightly different scores for the same test, as noted above. Before you rely on a gap of a few points, find the same test in a second source.
 
**Watch for self-computed rows.** The Computing for Geeks review notes that some of Google's rows were computed by Google, not by the benchmark's owner, and that one test used a longer verifier timeout than usual. Look for the same pattern in Carbon's numbers.
 
**Test your own workload.** A benchmark measures the tests it contains. The same review's hands-on check found that Argon's Kubernetes manifests passed the linter but crashed on a real cluster. Run your real prompts, with your real checks, against both models and against your current one.
 
## Recommendation Blocks
 
**Evaluate Carbon now if:**
- Your product does security analysis and you qualify for the early access program
- You can wait for independent results before you commit production traffic
**Wait on Carbon if:**
- You need broad access for developers or customers, since Google has not set a date
- Your budget depends on a price that Google has not dated
**Keep your current model if:**
- Your workload already meets its quality target at the current price
- You can't afford to run a two-week test across your own prompts
## A Decision Framework
 
**Step 1: Confirm access.** Check whether your account can use Carbon, and whether Argon is available to you as an alternative.
 
**Step 2: Model the price.** Calculate cost with the introductory rate, the post-intro rate and cached input, using your real token counts.
 
**Step 3: Build a test set.** Collect fifty to a hundred real tasks, with clear pass or fail checks.
 
**Step 4: Run the comparison.** Test Carbon, Argon and your current model on the same set, with the same settings.
 
**Step 5: Decide on the gap.** Switch only if the win is large enough to justify the cost, the new access terms and the effort to migrate.
 
## Bottom Line
 
**Carbon looks strong on Google's own tests, but the evidence you can use today is its price and its access terms.** The benchmark results are self-reported, the Argon comparisons use different test sets, and the wider release has no date. Model your own costs with the rates Google has published, and run a test on your workload before you move any traffic.
 
This isn't financial advice. Confirm current pricing on the provider's pricing page before you budget.
 
---
 
## Explore More on Automation Opportunities
 
Visit **[Bitroot's homepage](https://bitroot.org/)** for founder guides, tools, and automation resources built for early-stage SaaS teams.
