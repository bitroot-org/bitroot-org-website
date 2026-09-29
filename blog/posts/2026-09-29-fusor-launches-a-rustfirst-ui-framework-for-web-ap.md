---
date: '2026-09-29'
excerpt: Write your UI in HTML files. Keep state and frontend logic in Rust. No markup
  inside Rust macros.
image: null
published_at: '2026-09-29T15:17:43.246194+00:00'
sources:
- https://fusor.build
tags:
- rust
- webassembly
- ui-framework
title: Fusor launches a Rust‑first UI framework for web apps
---

Fusor hit Hacker News with a **`fusor new my-app`** command that scaffolds a Cargo project, an HTML component, and a Rust module, then runs a development server via **`fusor dev`**. The starter app includes a live counter and a search box, showing the framework’s core loop in action.

## How the stack is split
Fusor keeps markup in plain **.html** files and moves all state, methods, and imports into Rust structs. The HTML can embed double‑brace bindings and attributes like `on:click` that call Rust code. The compiler checks those bindings against the Rust module, so type errors surface early.

## Reactive updates without a full re‑render
When a Rust field (a *signal*) changes, only the bindings that read that signal re‑execute. The rest of the component stays untouched, which the site describes as “fine‑grained updates.” Async components can display a placeholder view until data arrives, and any listeners or effects are automatically cleaned up when the component unmounts.

## Tooling and requirements
Install the CLI on macOS, Linux, or Windows, then run the scaffold commands. Building requires **Rust 1.85 or newer** because Fusor relies on recent language features. The Rust code compiles to WebAssembly, which the browser runs directly. No markup lives inside Rust macros, keeping the HTML files readable.

## Caveats and missing details
The announcement does not list any pricing model or usage limits, implying the tool is free at launch, but the page provides no SLA or support guarantees. Also, the framework is tied to Rust 1.85+, which may be a barrier for teams not already using that version or for projects where compile times are a concern.

## When to give it a spin
If your startup already ships Rust services and you want to experiment with WebAssembly‑based front ends without pulling in a JavaScript framework, try the CLI on a small internal tool. Watch the **[Fusor site](https://fusor.build)** for upcoming docs on production builds and integration patterns.