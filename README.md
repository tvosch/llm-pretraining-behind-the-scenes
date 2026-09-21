# Training OpenEuroLLM — public pretraining explainer

A self-hosted static site that shows a general audience what pretraining a
language model involves, using the two runs currently going on European
supercomputers. Dutch and English, dark and light, no build step.

```
./serve.sh            # http://localhost:8722/
./serve.sh 9000       # another port
```

`index.html` is the journey (see `JOURNEY.md`); `process.html` is the original
process map. This directory is the published site: see **Deployment** below.

## Layout

| File | What it holds |
|---|---|
| `process.html` | The process view's shell: top bar, language/theme switches, five empty sections. Stamps the theme before first paint. |
| `assets/data.js` | **All numbers**, in one `SNAP` object. `null` renders as a "still to fill in" chip. |
| `assets/content.js` | **All copy**, as `L(nl, en)` pairs. |
| `assets/process.js` | The opening diagram. Exports `window.drawPretrainingProcess(host, ui)`. |
| `assets/app.js` | Renders content against data: the fold, the detail panels, the interactives. |
| `assets/style.css` | Design tokens and layout. |
| `assets/journey-content.js` | The journey's chapters, copy and figures — see `JOURNEY.md`. |
| `assets/journey.js` | The journey's engine: map, navigation, live feed. Holds no copy. |

## How it works

The diagram distinguishes final pretraining (annealing, quality data and context
extension where scheduled), the base model, SFT, and preference/reward training.
The latter method is explicitly unconfirmed. Evaluation spans the stages.
Sources/rights and cleaning open contextual explanations, not compliance badges.
Training-recipe experiments focus on global batch size and learning rate.

The model is labelled 32B. Its illustrative animation advances through prediction,
error calculation, backpropagation and parameter updates. "One training step"
runs one complete cycle then pauses. Rebuilding the map disposes its timer.
Stable routes 12 and 13 open reward training and training-recipe details.

The opening is a clickable diagram in three areas — prepare text, pretraining,
finish — with the model inside a predict → compare → adjust loop, and GPUs and
checkpoints supporting it from below. Measured 32B progress and the pending 9B
status sit inside the drawing. Above it is a compact stats strip; below it, a
line of activity labels.

Project-specific evidence appears below the diagram: the measured checkpoint,
planned 9B annealing budget, and the author's stated involvement. Actual author
observations can be added to `C.project.notes` as `{step, text: L(nl, en), date,
approved: true}`. No dated personal observations have been invented.

Dashed connectors link scaling experiments to model design and evaluation to
checkpoints. Monitoring opens directly from the map. All components are also
available on mobile; the loop has an actual pausable animation and enlarged
click targets. WebKit checks cover desktop side panels, mobile overflow and
label intersections, keyboard activation, lesson tabs and pause state.

Clicking a region folds the diagram down and opens a detail panel:

1. The panel opens with a role note and three key figures.
2. **"How this works"** opens the explanation.
3. The interactives follow, the first open and the rest folded behind a `+`.

At 1440px and wider the diagram keeps its own column on the left, sticky, at
full size, with the panel beside it. Below that width the panel stacks
underneath and the diagram caps at 240px. On phones the diagram splits into
three stacked sections, the running model first.

- Routed on the hash: `#/stap/7`, `#/werk/ingrijpen`, `#/open`.
- Keyboard: `1`–`9` open a component, `←` `→` move, `Esc` closes.
- Console hook: `OELLM.open("step", 7)`, `OELLM.close()`, `OELLM.lang("en")`.
- The diagram animation is illustrative, pausable, and respects
  `prefers-reduced-motion`.

> **Note on provenance.** The original `process.js` was overwritten without a
> backup during an experiment with a different diagram. What is here now was
> rebuilt from a full-resolution render of the original, so the composition,
> colours and copy match but the coordinates are new. If anything looks a few
> pixels off against the old screenshots, that is why.

## Honesty rules

Counters show **measured** values only — there is no extrapolation. Every figure
carries a tag:

- `gemeten / measured` — read off the running job or the repo config
- `schematisch / schematic` — right shape, approximate values
- `illustratief / illustrative` — invented to show a mechanism

Unknowns are `null` in `data.js` and render as a chip, never a plausible guess.
The register at the bottom of the page is derived from the data itself, so it
stays complete.

First-person `notes` in `content.js` render **only** with `approved: true`.
Nothing is approved right now, so no personal claims are published.

## Going live

When served over HTTP the page polls `live.json` every 15 minutes and deep-merges
it over `SNAP`; if it is absent or malformed the snapshot in `data.js` stands. A
valid update needs at least `meta.takenAt` and a numeric `m32.step`:

```json
{ "meta": { "takenAt": "2026-09-19T14:57:00+02:00" },
  "m32": { "step": 82775, "loss": 1.40, "secPerStep": 5.8 },
  "m9":  { "annealProgress": 0.42 } }
```

The exporter runs on the Pi (`../pi/publish_live.py`, outside this repo) and
commits `live.json` here once a day. It reads the run's slurm log directly,
because the progress tracker's `log_glob` entries in `config/config.yaml` point
at older run directories for both models and its numbers are stale.

## Deployment

GitHub Pages serves this directory from `main`; `.github/workflows/pages.yml`
deploys on every push. Nothing is built, so a push is the whole deploy.

Before publishing, keep it true that no internal detail ships: `assets/data.js`
goes to every visitor in full, so no cluster hostnames, run directories, job
paths, log filenames or usernames belong in it. `HANDOFF.md` stays outside this
repo for the same reason.

## Checking it

Two harnesses, both outside the repo in the session scratchpad:

- **`tools-render-svg.js`** serialises a diagram to a standalone SVG with the
  theme tokens resolved; `qlmanage -t` rasterises it to PNG.
- **A WebKit driver** (`/private/tmp/oellm-browser.swift`, `swiftc -O -o
  oellm-browser oellm-browser.swift`) loads the page at 1440px or 390px, runs
  assertions (overflow, label overlap, keyboard activation, lesson tabs, the
  pause control) and writes a screenshot. Arguments: `mobile`, `nl`, `light`,
  `panel`.

Last run: no horizontal overflow, no label overlaps, 28 components, all
interaction assertions passing in both languages and both themes.

## Known gaps

- The `live.json` exporter.
- The site has two names: `C.project.title` ("Training OpenEuroLLM", the same in
  both languages) drives the page title and heading, while `C.ui.title` drives
  the top bar. `index.html` hardcodes a third string as the pre-JS fallback.
- The eleven first-person notes in `content.js` are written but unapproved, so
  the personal voice does not appear anywhere on the site.
