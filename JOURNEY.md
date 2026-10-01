# Behind the Scenes of LLM Pretraining

Open `http://localhost:8722/` using the existing `serve.sh` server.
The original process view is available as `process.html`.

## Files

- `assets/journey-content.js`: **the file to edit.** Chapters, copy, figures,
  partners, places and interface strings. Nothing else holds copy.
- `assets/journey.js`: the engine — map, navigation, figure context, live feed.
  No copy, no numbers.
- `assets/data.js`: every number, shared with the process view. `null` renders
  as the orange "still to fill in" chip, never as a guess.
- `assets/journey.css`: responsive chapter bubbles and navigation.
- `live.json`: optional feed, polled every 15 minutes. Missing or invalid
  updates leave the last valid snapshot visible with its timestamp.

## Adding a chapter

Append an entry to `JOURNEY.chapters` in `journey-content.js`:

```js
{
  place: 4,                        // index into JOURNEY.places
  label: 'Evaluation',             // chapter menu and footer
  kicker: 'JUPITER · JSC / Tests',
  title: 'Does it<br>actually work?',
  text: 'One or two sentences.',   // or {nl, en} once translated
  note: 'Caveats and limits.',
  visual: 'evaluation',            // a key in JOURNEY.figures, or '' for none
  tag: 'measured',                 // measured | schematic | illustrative | null
}
```

Then add `evaluation: ({ d, num, tbd }) => \`...\`` to `JOURNEY.figures`. The
figure receives `d` (the numbers), `num`, `tbd`, `stamp`, `tokens`, `plot`,
`partners` and `groups`. Read numbers off `d` — a literal in a figure becomes a
second source of truth and goes stale silently. `num()` returns the chip rather
than `0` for a missing value, so a forgotten guard fails safe.

`{{partners}}` and `{{nextYear}}` in any text field are filled from the real
partner count and `SNAP.family.nextModelYear`.

`window.journeyMissing` lists every gap the current chapter had to leave blank.

Chapters can be linked directly, e.g. `#chapter-7` for the 32B run.
Arrow keys navigate; the menu and map pins also select chapters. Reduced-motion
preferences skip travel animation and pause the training-step illustration.

The route follows the author's supplied project narrative, not a claim that
training data physically travelled along the drawn paths. SFT/RL locations and
methods are unconfirmed. Curves and token examples are illustrative.

The introduction shows the model family: 9B (smallest), 32B (intermediate,
training now), and a larger model planned for 2027, following the author's
roadmap. Chapter 2 introduces the 21 partners currently listed on the official
project site, with locally stored logos linking to each partner's website.
Machine/operator pairs: Snellius/SURF, LUMI/CSC, MareNostrum 5/BSC,
Leonardo/Cineca and JUPITER/JSC. Map pins retain city names.

The 12-chapter journey includes Prelude (9B, 1,024 NVIDIA A100 GPUs) with its
Hugging Face link, plus a separate MultiSynt chapter at Bologna describing
multilingual synthetic pretraining data. Further MultiSynt details are pending.
The partners chapter groups smaller, evenly spaced marks on a dark background.
The supplied `assets/images/EU-cofounded.webp` image provides the EU co-funding
lockup, including the flag and text. The introduction briefly states the project's
open, EU-compliant and linguistically diverse aims.

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
