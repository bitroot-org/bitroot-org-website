---
date: '2026-02-17'
excerpt: Ollama now supports subagents and web search in Claude Code.
image: https://ollama.com/public/og.png
published_at: '2026-02-17T13:10:54.324309+00:00'
sources:
- https://ollama.com/blog/web-search-subagents-claude-code
tags:
- Ollama
- Claude Code
- Subagents
- Web Search
title: 'Revolutionizing Coding: Ollama Unveils Subagents and Web Search in Claude
  Code'
---


## Introduction to Subagents and Web Search
We just spotted an exciting update from Ollama that's worth sharing with the community - the introduction of subagents and web search in Claude Code. This powerful feature allows developers to run tasks in parallel, such as file search, code exploration, and research, each in their own context.

## What are Subagents?
Subagents can be triggered naturally by certain models or forced by telling the model to 'use/spawn/create subagents'. This enables longer coding sessions to stay productive, without side tasks filling the context with noise. Some example prompts include:
* spawn subagents to explore the auth flow, payment integration, and notification system
* audit security issues, find performance bottlenecks, and check accessibility in parallel with subagents
* create subagents to map the database queries, trace the API routes, and catalog error handling patterns

## Web Search Integration
Ollama's web search is now built into the Anthropic compatibility layer, allowing models to retrieve current information without additional configuration. Subagents can leverage web search to research topics in parallel and come back with actionable results. For instance:
* research the postgres 18 release notes, audit our queries for deprecated patterns, and create migration tasks
* create 3 research agents to research how our top 3 competitors price their API tiers, compare against our current pricing, and draft recommendations
* study how top open source projects handle their release process, review our CI/CD pipeline, and draft improvements

## Implications and Use Cases
The introduction of subagents and web search in Claude Code has significant implications for developers. It enables them to work more efficiently, stay informed, and tackle complex tasks with ease. With this feature, developers can:
* Run multiple tasks in parallel, reducing the time spent on research and development
* Stay up-to-date with the latest information, without leaving the coding environment
* Improve productivity and focus, by minimizing context switching and noise

## Getting Started
To get started with subagents and web search in Claude Code, simply launch Ollama with the minimax-m2.5:cloud model. This will enable you to experience the power of parallel task execution and seamless web search integration. Recommended cloud models include:
* minimax-m2.5:cloud
* glm-5:cloud
* kimi-k2.5:cloud