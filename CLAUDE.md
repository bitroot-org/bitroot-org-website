# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Bitroot organization website (bitroot.org) - a static website for a technology and marketing company that helps startups and companies build their technology foundation.

## Development

**Local Development:**
```bash
# Start a local server (Python)
python -m http.server 8000

# Then open http://localhost:8000
```

The VS Code launch configuration is set up for Chrome debugging on port 8080.

## Architecture

This is a static HTML/CSS/JS website originally exported from Webflow:

- **HTML Pages**: Main pages are in the root directory (`index.html`, `404.html`, `401.html`, etc.)
- **Styles**: CSS files in `/css/` - `bitroot-v3.css` is the main stylesheet, with `normalize.css` and `components.css` as supporting files
- **Scripts**: JavaScript in `/js/bitroot-v3.js` (Webflow interactions and functionality)
- **Assets**: Images in `/images/`, fonts in `/fonts/`, Lottie animations in `/documents/`
- **Subpages**: Legal pages in `/legal/`, hiring pages in `/hiring-page/`

## Key Technical Details

- Uses Webflow's generated class naming conventions (e.g., `w-nav`, `w-button`, `w-container`)
- Google Fonts loaded via WebFont loader: Exo, Lato, IBM Plex Mono, Inter, Outfit, Press Start 2P
- Custom fonts: CircularStd, Switzer, Material Icons
- Analytics: Facebook Pixel, Google Tag Manager, PostHog
- Hosted on GitHub Pages with custom domain (CNAME: bitroot.org)
