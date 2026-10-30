# Astera Studio: mobile & desktop mockup

A clickable mockup of **Astera Studio**, a chat-first analytics tool. It shows how business users ask questions, read dashboards, and check on or lightly edit the data pipelines behind them, from an iPhone, an iPad or a desktop.

**Live:** https://zainnb.github.io/Astera_Flow/
**Offline:** open `index.html` in the zip (double-click; no install, no internet needed).

All data is made up. There is no backend; state resets when you reload.

## Try this (2 minutes)

1. **Chat:** tap *"Which regions missed their sales target last quarter?"*. You get a chart and a short answer. Then tap a follow-up (*Sort highest first*), and **Pin** the answer.
2. **Dashboard:** the red strip says the data is stale because the *Sales vs target* pipeline failed. Your pinned chart is at the bottom.
   - Tap a **region's bar** to drill down to its months; *All regions* goes back.
   - Change the **date range / region** (on a phone: the *Filters* button).
   - Tap **the table icon** on any chart to see exact numbers.
3. **Fix the pipeline:** tap *View pipeline*. The failed step opens with its error.
   - Tap **Edit**, change *Timeout* to 60 s, **Save**, then **Re-run now**. The steps turn green one by one, and the dashboard says the data is up to date.
4. **Resize the window** (or use DevTools device mode) through 375px → 768px → 1024px → 1440px. Each size has its own layout, not a shrunk one.

## How each screen adapts

| | iPhone (< 700px) | iPad (700–1199px) | Desktop (≥ 1200px) |
|---|---|---|---|
| Navigation | Bottom tab bar | Icon rail | Sidebar |
| Dashboard | Freshness → KPIs 2×2 → charts by priority; filters in a bottom sheet | KPIs in a row, charts in 2 columns, inline filters | 3-column grid |
| Pipeline | Vertical step list; tap a step to expand it inline | Diagram + details panel below | Diagram + two-column details panel |

Touch: every control is at least 44px, nothing depends on hover, chart tooltips open on tap, inputs are 16px so iOS doesn't zoom, and the layout respects the iPhone notch and home bar.

## Run the code

```bash
npm install
npm run dev            # local dev server
npm run build          # dist/: the GitHub Pages build
npm run build:single   # dist-single/index.html: one self-contained file
npm run package        # release/ZainBaig_FAST_2026.zip
```

**Client photo:** drop an image named `avatar.jpg` (or `.png` / `.webp`) into `src/assets/` and rebuild; the header picks it up automatically. Until then it shows initials.

Stack: React 19, TypeScript, Vite, React Router (hash routing so it works from `file://`), Chart.js. Styling is plain CSS with design tokens (`src/styles/tokens.css`), light/dark/auto themes, and the Geist font (bundled, SIL OFL).

```
src/
  screens/        Chat, Dashboard, Pipelines list, Pipeline detail
  components/     Shared UI (nav, chart card, status badge, bottom sheet…)
  components/pipeline/   Step list (phone), canvas (tablet/desktop), step detail, auto-layout
  data/           Types, made-up sales + pipelines, selectors, chat script
  state/          App state (React context + reducer), simulated re-runs
  charts/         Chart.js setup and theme colors
```

See **NOTE.md** for the design reasoning.
