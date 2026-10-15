---
date: '2026-10-13'
excerpt: 'SolidCraft: an open-source parametric 3D CAD application built in pure Rust.
  Desktop, web, and automation through MCP. - bherbruck/solidcraft'
image: https://bitroot.org/blog/media/2026-10-13-solidcraft-launches-as-an-opensource-rust-cad-with.png
published_at: '2026-10-13T16:38:19.374645+00:00'
sources:
- https://github.com/bherbruck/solidcraft
tags:
- cad
- rust
- open-source
title: SolidCraft launches as an open‑source Rust CAD with scriptable server
---

SolidCraft, an open‑source parametric 3D CAD application built in pure Rust, was released on GitHub with ready‑to‑run installers for Windows, macOS, Linux, and a browser‑based version. The Windows package includes an installer and a portable zip, while Linux users can choose an AppImage, .deb, .rpm, or a Snap package.

## Core modeling features
SolidCraft provides a feature timeline similar to commercial CAD tools: sketches can be drawn on origin, offset or planar faces using lines, circles, arcs, splines, and text. Constraints and dimensions are solved by a custom solver that supports coincident, tangent, curvature, and many other relationships. Features such as extrude, revolve, loft, fillet, shell, threads, patterns, and sheet‑metal operations are editable on the timeline, with incremental rebuilds after each change. Assemblies support nested components, joints, motion studies, and material‑aware mass properties.

## Automation through MCP
The built‑in Model Context Protocol (MCP) server runs on stdio and can be accessed via the `solidcraft-cli mcp` command. It exposes commands like `list_commands`, `execute`, `measure`, `export`, and `screenshot`, allowing AI agents or scripts to create and modify designs without a UI. Example workflows include generating a bracket with JSON commands or driving the desktop app to visualise the model in real time.

## Platform reach and installation notes
Beyond the native desktop builds, SolidCraft can be run in a browser using WebGPU (or WebGL2 with a flag). The project also supports 3Dconnexion SpaceMouse devices on Windows and Linux, though Flatpak sandboxing currently blocks HID access, limiting 3D‑mouse use to native builds. All binaries are unsigned; Windows SmartScreen will warn users, and macOS requires a manual “Open” click for the first launch.

## Caveats and when to try it
The software is labeled “early but usable for simple parts” and currently matches 75 of 76 reference part analytics; the remaining mismatch is tracked as a bug. No pricing information is provided because the tool is free under MIT or Apache‑2.0 licenses. Teams that need a fully‑featured, production‑grade CAD may want to evaluate SolidCraft on a non‑critical prototype before relying on it for large assemblies.

**What to watch**: the roadmap and issue tracker on the repository will indicate when more advanced surfacing operations and signed installers become available.