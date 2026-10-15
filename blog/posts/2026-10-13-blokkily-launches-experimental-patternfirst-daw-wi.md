---
date: '2026-10-13'
excerpt: An experimental pattern-first DAW. Contribute to andrewfader/blokkily development
  by creating an account on GitHub.
image: https://bitroot.org/blog/media/2026-10-13-blokkily-launches-experimental-patternfirst-daw-wi.png
published_at: '2026-10-13T16:37:42.153223+00:00'
sources:
- https://github.com/andrewfader/blokkily
tags:
- daW
- audio
- open-source
title: Blokkily launches experimental pattern‑first DAW with CLAP support
---

The open‑source project **Blokkily** 0.1 is now available for Linux, Windows, and macOS, delivering a pattern‑first digital audio workstation where the same pattern can be edited in a tracker, piano roll, or step grid — all synchronized in real time. Each release ships pre‑built packages for the three platforms, with Linux builds expecting Qt 6 and several audio libraries, a Windows installer or zip, and macOS DMG files that are signed ad‑hoc (requiring a manual “Open” override).

## Unified pattern workflow
Blokkily lets you edit notes, chords, inversions, strums, micro‑timing, probability, ratchets and parameter locks in any of the three editors, and you hear changes immediately during playback. Patterns can be arranged on a multi‑track timeline, with tempo steps, ramps and meter changes. A scene launcher records live pattern performances into the arrangement, and an LLM‑driven composition assistant can suggest phrases that you accept or reject as a single undo step.

## Plugin and instrument integration
The DAW supports CLAP and VST3 plugins (CLAP is required in every build), SoundFont instruments, and built‑in samplers. Plugin editors open embedded in the Blokkily window on all three OSes. The bundled CLAP synths YANES and FUZZBOI are demonstrated in a short video that builds a chiptune via the MCP bridge. Audio export compensates plugin latency and can output 16‑, 24‑ or 32‑bit WAV files.

## Building and running locally
To compile from source you need CMake 3.25+, Qt 6.5+, FluidSynth, RtAudio, RtMidi, libsndfile, libsamplerate and Rubber Band 4. The CLAP and JUCE headers are vendored, so clone the repo with `--recursive`. The CI scripts in `.github/workflows/` show the exact commands for each platform. Verification tests require a SoundFont file; the build system looks for common SF2 locations or a custom path via `-DBLOKKILY_TEST_SF2`.

## Caveats to consider
Blokkily is still experimental: comping and MIDI clock input are missing, MPE support varies by instrument format, and per‑note expression lacks an editor. On Linux, plugin windows need X11 or Wayland with XWayland support. Export always renders the full arrangement, so you must record a launcher performance before exporting. The macOS binaries are not notarized, meaning the first launch is blocked until you manually clear the quarantine flag.

**When to try it** – If you enjoy pattern‑centric composition and can tolerate the current feature gaps, download the pre‑built binaries from the [GitHub release page](https://github.com/andrewfader/blokkily). Keep an eye on future releases for comping and improved MIDI clock handling.