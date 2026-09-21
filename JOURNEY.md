# European Pretraining Journey

Open `http://localhost:8722/` using the existing `serve.sh` server.
The original process view is available as `process.html`.

## Files

- `assets/journey.js`: chapters, interactions, canvas geography and live feed.
- `assets/journey.css`: responsive chapter bubbles and navigation.
- `assets/data.js`: shared run snapshot. No counters are extrapolated.
- `live.json`: optional feed, polled every 15 minutes. Missing or invalid
  updates leave the last valid snapshot visible with its timestamp.

Chapters can be linked directly, e.g. `#chapter-6` for the 32B run.
Arrow keys navigate; the menu and map pins also select chapters. Reduced-motion
preferences skip travel animation and pause the training-step illustration.

The route follows the author's supplied project narrative, not a claim that
training data physically travelled along the drawn paths. SFT/RL locations and
methods are unconfirmed. Curves and token examples are illustrative.

The introduction shows the model family: 9B (smallest), 32B (intermediate,
training now), and a larger model planned for 2027, following the author's
roadmap. Chapter 2 introduces the 21 partners currently listed on the official
project site, with locally stored logos linking to each partner's website.
The displayed country list is illustrative, not an exhaustive consortium list.
Machine/operator pairs: Snellius/SURF, LUMI/CSC, MareNostrum 5/BSC,
Leonardo/Cineca and JUPITER/JSC. Map pins retain city names.

## Assets

Map boundaries: Natural Earth, public domain, 1:110m countries, downloaded from
https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson

Icons: Lucide 0.468.0, ISC license, vendored as `assets/lucide.min.js` with license
notice in the distribution. https://lucide.dev/license

Visual reference: https://openeurollm.eu/ (checked 2026-09-21): dark backgrounds,
Roboto, bright blue and orange accents. The official logo is stored locally in
`assets/openeurollm-logo.svg` and links to the project website.

Partner sources: the logos and organization links in `assets/partners/` were
mirrored from the official OpenEuroLLM partner section on 2026-09-21. The site
currently exposes 18 partner marks as optimized WebP and 3 as original SVG.

Fonts: Roboto via Google Fonts, with local sans-serif fallbacks.
The map and icons do not require a third-party service at runtime.
