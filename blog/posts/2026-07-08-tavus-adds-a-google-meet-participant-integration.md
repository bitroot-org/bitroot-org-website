---
date: '2026-07-08'
excerpt: Tavus now lets a PAL join Google Meet calls as a real participant, enabling
  custom notetakers or meeting hosts with a few clicks.
image: https://pbs.twimg.com/media/HMubm2Va8AAo-Pe.jpg
published_at: '2026-07-08T18:52:51.434143+00:00'
sources:
- https://x.com/i/status/2074894605125026072
tags:
- google meet
- ai assistant
- integration
title: Tavus adds a Google Meet participant integration
video: media/2026-07-08-tavus-adds-a-google-meet-participant-integration.mp4
---

Tavus announced a Google Meet integration that lets a PAL (personal assistant language) join a Meet as a regular attendee. The rollout is announced in a tweet that shows you can deploy a customized notetaker, personal assistant, or even a meeting host in just a few clicks [link](https://x.com/i/status/2074894605125026072).

## How the integration works
When you enable the feature, the PAL logs into the Meet using a service account and appears in the participant list like any other guest. From there you can hook into the call’s audio stream, capture live transcripts, or drive the conversation with scripted actions. The UI for creating the assistant is a web‑based builder that exports a small container image you can push to your own registry.

## What you need to run it
You’ll need a Google Cloud project with Meet API access, a Docker runtime, and a few environment variables for auth tokens. The builder abstracts most of the boilerplate, but you still have to provision the service account and grant it the `https://www.googleapis.com/auth/calendar.events.readonly` scope. No explicit pricing is listed, so expect either a free tier for low‑volume use or a usage‑based charge that could become non‑trivial for large teams.

## Caveats and trade‑offs
The assistant shows up as a participant, which means every attendee can see its name and video feed – a potential privacy concern if you’re using it for sensitive notes. Accuracy of automated note‑taking depends on the underlying speech‑to‑text model; early users report occasional transcription errors that require manual cleanup. Finally, the integration locks you into Google’s API versioning, so any breaking change could require a redeploy of your PAL container.

## When to try it
If you already ship internal tools that need meeting context – for example, a sprint‑review bot that logs decisions – spin up a test PAL in a sandbox Meet and evaluate transcript quality and cost before rolling it out to production. Keep an eye on Google’s API quota updates and Tavus’s pricing page for any changes.