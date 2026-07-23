---
date: '2026-07-23'
excerpt: The Storm Gauge, an open‑source TradingView indicator that applies a GARCH
  volatility model, is now installable via a one‑line Claude Code command and shows
  early backtest gains on Bitcoin.
image: https://pbs.twimg.com/amplify_video_thumb/2080163505848950784/img/Ly9lhCXQvLWTWnhv.jpg
published_at: '2026-07-23T11:02:28.818932+00:00'
sources:
- https://x.com/milesdeutscher/status/2080163535250948523
tags:
- tradingview
- garch
- volatility
- open-source
title: Storm Gauge GARCH indicator for TradingView released as open-source
video: media/2026-07-23-storm-gauge-garch-indicator-for-tradingview-releas.mp4
---

Miles Deutscher just released the Storm Gauge, a TradingView indicator built with Claude Code & Fable 5, and made it available via a one‑line install command in the open‑source repo [Storm Gauge repo](http://github.com/milesdeutscher/garchmethod).

## How it works
The indicator implements a GARCH volatility model, a Nobel‑Prize‑winning framework used by professional quant desks. It combines baseline volatility, the previous day’s shock, and the prior volatility level to produce a single “risk” number for the next trading day. It does **not** predict price direction, only the expected market turbulence.

## Installing it
Two paths are documented in the repo.  
* **Plugin command** – copy the command shown in `garchmethod.md` and paste it into Claude Code; the plugin installs automatically.  
* **Manual config** – copy the entire `garchmethod.md` contents into Claude Code, which fetches the skill files and validates the strategy.  
After installation, copy the Pine Script file from the repo’s `pine` folder into TradingView’s Pine Editor, save, and refresh to see the gauge live.

## Early results and caveats
Backtesting the same EMA‑cross strategy on 15 years of BTC data gave a final equity of $21,205 with Storm Gauge sizing versus $17,957 with fixed sizing, showing fewer drawdowns. The test is limited to Bitcoin and a single strategy; GARCH assumptions may not hold for all assets, and the model can produce noisy forecasts during low‑volatility regimes. It also requires manual Pine Script deployment, which adds friction for teams looking for a turnkey solution.

## When to try it
Add the indicator to a demo TradingView chart and monitor its volatility readout for a week before using it for position sizing. Because it’s free and open source, the risk is low, but treat the forecasts as one input among many.

[Source tweet](https://x.com/milesdeutscher/status/2080163535250948523)