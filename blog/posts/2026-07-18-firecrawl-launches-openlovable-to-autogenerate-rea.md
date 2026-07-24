---
date: '2026-07-18'
excerpt: Firecrawl’s new open‑lovable tool can clone any website into a modern React
  app with an AI‑driven chat interface, but it requires an API key and the generated
  code may need cleanup.
image: https://pbs.twimg.com/media/HNe8E3KWUAAh1nt.jpg?name=orig
published_at: '2026-07-18T10:13:22.167538+00:00'
sources:
- https://x.com/N0V4Dev/status/2078336551696626102
tags:
- react
- ai tools
- open source
title: Firecrawl launches open‑lovable to auto‑generate React sites
---

Firecrawl just released **open‑lovable**, an open‑source project that can clone and recreate any website as a modern React app in seconds via a conversational AI interface. The tool ships with a TypeScript codebase, uses pnpm for dependency management, and lets you pick a sandbox host – Vercel or E2B – for rapid prototyping. You’ll need a Firecrawl API key to fetch the source data, and it supports LLM back‑ends like Gemini, Anthropic, OpenAI, and Groq.

## How it works
The workflow is simple: point the tool at a URL, start a chat session, and ask the AI to shape the React components. Under the hood, Firecrawl scrapes the target site, feeds the markup to the selected LLM, and returns a ready‑to‑run React project. The generated code includes routing, styling, and basic data fetching, giving you a starting point that you can iterate on directly in the chat.

## Integration flexibility
Because the core is just a TypeScript library, you can drop it into existing pipelines or use the provided CLI for ad‑hoc conversions. The sandbox option lets you spin up a preview on Vercel with a single command, while E2B offers a container‑based environment for more isolated testing. This flexibility makes it useful for internal tooling, quick demos, or as a reference when building AI‑powered developer utilities.

## Caveats and cost considerations
The reliance on a Firecrawl API key introduces a recurring cost that scales with the number of pages you scrape – a factor to weigh against the time saved. The AI‑generated code is functional but not production‑ready; you’ll often need to refactor styling or resolve edge‑case bugs, especially for complex layouts. Additionally, the quality of the output varies with the chosen LLM, so testing across providers may be necessary to find the best fit.

## When to try it
If you frequently need to bootstrap front‑ends from existing sites – for internal dashboards, MVPs, or documentation portals – give open‑lovable a spin on a low‑stakes project and evaluate the trade‑off between speed and manual cleanup. Keep an eye on the repo for updates and community contributions that may improve LLM prompts and reduce post‑generation work. 

[Source tweet](https://x.com/N0V4Dev/status/2078336551696626102) | [GitHub repo](https://github.com/firecrawl/open-lovable)