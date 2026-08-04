---
date: '2026-07-21'
excerpt: The open‑source last30days skill queries Reddit, X, YouTube, HN, Polymarket,
  TikTok and more in parallel, ranking results by actual engagement. It plugs into
  Claude Code, Codex, Cursor and Gemini CLI at no cost.
image: https://pbs.twimg.com/media/HNua-chagAAfqU7.jpg?name=orig
published_at: '2026-07-21T10:58:19.768840+00:00'
sources:
- https://x.com/heyashishsaini/status/2079426058496119186
tags:
- ai agents
- open source
- social media research
title: last30days skill lets AI agents fetch real‑engagement data from socials
---

The **last30days** skill, posted on GitHub, can research any topic across Reddit, X, YouTube, Hacker News, Polymarket, TikTok and other platforms in parallel, then rank the results by real engagement instead of editorial curation. The repo is available at https://github.com/mvanhorn/last30days-skill and the announcement tweet is https://x.com/heyashishsaini/status/2079426058496119186.

## How it works
The skill spawns API calls (or scrapes where public APIs exist) to each source, collects the top‑N posts from the last 30 days, and applies a simple engagement metric (likes, up‑votes, retweets, view counts). The aggregated list is returned to the calling LLM, which can then cite the most popular items. Compatibility layers exist for Claude Code, Codex, Cursor and the Gemini CLI, letting developers drop the skill into existing AI‑agent pipelines with minimal boilerplate.

## Cost and integration effort
Because the project is MIT‑licensed, the software itself is free. However, each upstream service may require its own API key or rate‑limit quota, so operational costs depend on usage volume. The skill’s dependencies are lightweight Python packages, and a typical setup adds ~30 seconds of latency per query batch.

## Caveats to keep in mind
Ranking by raw engagement can surface click‑bait or echo‑chamber content, especially on platforms like TikTok where virality often outpaces quality. The skill does not normalize for audience size, so a post from a small subreddit may be undervalued. Additionally, the tool currently omits platforms without public metrics (e.g., Instagram), limiting coverage for some research topics.

## When to try it
If your startup already runs an LLM‑based assistant that needs up‑to‑date public sentiment or trend data, hook the last30days skill into a sandbox environment and monitor the signal‑to‑noise ratio over a week. If the engagement‑driven results align with your quality expectations, consider rolling it into production; otherwise, you may need a custom ranking filter.

**What to watch**: upcoming updates that add normalization heuristics and support for additional APIs could reduce bias and broaden the skill’s applicability.