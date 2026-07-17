---
date: '2026-07-17'
excerpt: '用 Tauri 2 打造的桌面端 Skills 管理工具，聚合 skills sh、LobeHub、SkillHub cn 等来源的 AI 技能，并一键安装/卸载/重装到
  Codex、Claude、Cursor、Gemini CLI 等十余种 AI 工具的本地目录。


  https://github.com/cpcc/SkillsPlusPlus'
image: https://pbs.twimg.com/media/HNRPouKaUAAgQIF.jpg?name=orig
published_at: '2026-07-17T10:40:08.618750+00:00'
sources:
- https://x.com/QingQ77/status/2077991939404603697
tags:
- ai tools
- desktop app
- tauri
title: Tauri‑2 based SkillsPlusPlus adds one‑click AI tool integration
---

A desktop‑first skills manager called **SkillsPlusPlus** was released, built on Tauri 2. It pulls skill definitions from sources such as skills.sh, LobeHub, and SkillHub cn, then offers one‑click install, uninstall, or reinstall into the local directories of over ten AI tools—including Codex, Claude, Cursor, and Gemini CLI. The project lives on [GitHub](https://github.com/cpcc/SkillsPlusPlus).

## How it works
The app scans the selected AI tool’s plugin folder and copies the appropriate skill files, handling version mismatches automatically. Users can toggle individual skills on or off, and the UI shows which tools are currently synchronized. Because Tauri compiles to a native binary, the installer runs on Windows, macOS, and Linux without heavyweight runtimes.

## Why it matters for fast‑moving teams
Startup engineers often prototype with multiple LLM back‑ends. Manually copying skill files across each CLI can be error‑prone and time‑consuming. SkillsPlusPlus reduces that friction to a single button press, making it easier to experiment with new prompt templates or tool‑specific extensions. The open‑source license means there’s no subscription cost; the only expense is developer time to evaluate and possibly contribute back.

## Caveats and trade‑offs
The tool currently targets only the AI CLIs listed in its documentation, so teams using niche or custom wrappers won’t benefit out of the box. Tauri 2 is still maturing, and early adopters may encounter platform‑specific bugs or need to rebuild the binary after OS updates. Additionally, the skill repositories it aggregates are community‑maintained, so quality and compatibility can vary, potentially leading to false‑positive prompts or broken integrations.

## When to try it
Engineers who already juggle two or more LLM CLI tools and need a quick way to keep skill sets in sync should clone the repo and run the pre‑built binary on a test machine. Monitoring the GitHub issue tracker for compatibility updates will help avoid surprise breakages. If the workflow aligns with your current stack, a short pilot can reveal whether the one‑click model saves enough friction to justify its adoption.