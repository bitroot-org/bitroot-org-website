---
date: '2026-05-17'
excerpt: Anthropic’s new official plugin reads an entire codebase and suggests which
  tools, frameworks, and configs to enable. It promises smoother onboarding but may
  add noise for larger projects.
image: https://pbs.twimg.com/ext_tw_video_thumb/2055830586330357760/pu/img/KaxltSjnODsRprow.jpg
published_at: '2026-05-17T18:50:12.896988+00:00'
sources:
- https://x.com/i/status/2055830602683998718
tags:
- anthropic
- claude code
- plugin
title: Anthropic adds auto‑stack detection plugin for Claude Code
video: media/2026-05-17-anthropic-adds-autostack-detection-plugin-for-clau.mp4
---

Anthropic announced an official plugin for Claude Code that automatically detects the tech stack of a repository and returns configuration suggestions. The plugin is available now and can be installed with a single command from the Claude UI.

## How the plugin works
The plugin scans the whole project directory, builds a lightweight model of dependencies, and then prompts Claude Code with a summary. It then suggests specific workflows—such as enabling linting, adding CI steps, or configuring environment variables—based on the detected stack. The goal is to replace the manual onboarding phase where developers had to describe their setup to Claude.

## Immediate benefits
* **Zero‑setup detection** – No need to list languages or frameworks; the plugin infers them.
* **Targeted advice** – Claude Code can suggest enabling a TypeScript strict mode check or a Dockerfile lint rule that matches the project.
* **Faster iteration** – Early‑stage prompts become more relevant, reducing the back‑and‑forth with the model.

## Caveats to keep in mind
The plugin runs a full file scan, which can be slow on monorepos larger than a few hundred megabytes. It also relies on heuristics that may misclassify obscure libraries, leading to false‑positive suggestions. The feature is currently limited to languages that Claude Code already understands well (JavaScript, Python, Go, etc.), so teams using niche stacks may see little impact. Finally, the plugin is tied to Anthropic’s hosted Claude service, so any future pricing changes could affect cost.

## When to try it
If your startup’s codebase fits within the supported languages and you’re already using Claude Code for code assistance, install the plugin and run it on a feature branch to gauge the relevance of the suggestions. Watch for any performance impact on CI pipelines and be ready to filter out low‑value recommendations.

---
Source: [Divyansh Tiwari’s tweet](https://x.com/i/status/2055830602683998718)