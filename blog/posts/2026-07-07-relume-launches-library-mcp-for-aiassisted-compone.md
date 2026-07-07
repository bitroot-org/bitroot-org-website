---
date: '2026-07-07'
excerpt: Relume’s new Library MCP puts 1,000+ production‑ready UI components inside
  popular AI assistants, letting engineers pull and restyle elements without leaving
  the prompt.
image: https://pbs.twimg.com/amplify_video_thumb/2073929458160168960/img/5Iq96DAnkzEbrXpo.jpg
published_at: '2026-07-07T18:07:23.005301+00:00'
sources:
- https://x.com/i/status/2074222854183514438
tags:
- relume
- component library
- ai tools
title: Relume launches Library MCP for AI‑assisted component selection
video: media/2026-07-07-relume-launches-library-mcp-for-aiassisted-compone.mp4
---

Relume announced the Library MCP on X, adding over 1,000 production‑ready components that can be accessed directly from AI tools like Cursor, Claude, Windsurf, Lovable, or any MCP‑compatible client [link](https://x.com/i/status/2074222854183514438). The integration promises a single‑prompt workflow: plan the page, generate copy, ask the AI to match a component, pull it in, and restyle it to your brand.

## Plug‑and‑play component lookup
The MCP client exposes a searchable catalog inside the AI chat window. When you ask the assistant for a “hero section with a CTA”, it returns a matching Relume component, complete with markup and style tokens. This eliminates the back‑and‑forth between design system docs and code editors, shaving minutes off each layout iteration.

## How it fits into a startup dev stack
Because the library lives in the same process as the LLM, there’s no separate HTTP request or API key to manage. Teams already using AI‑driven copy generation can extend the same prompt to UI scaffolding, keeping the workflow inside tools they already trust. The component files are ready to drop into React, Vue, or plain HTML projects, and you can apply your own CSS variables after import.

## Limitations to keep in mind
The catalog is static at launch; custom components or updates to the design system must still be added manually. False positives can appear if the AI misinterprets ambiguous copy, pulling a component that doesn’t match the intended layout. Also, the MCP client is currently limited to the listed AI assistants, so teams on other LLM platforms will need a workaround or wait for broader support.

## When to give it a try
If your startup already uses an AI assistant for copy or code generation, spin up a test page with the Library MCP to see how quickly you can prototype a UI without opening a design tool. Watch for any mismatches in component selection and plan a brief validation step before committing to production code.