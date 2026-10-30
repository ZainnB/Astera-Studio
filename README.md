# Astera Studio: responsive mockup

A clickable HTML mockup of **Astera Studio** for iPhone, iPad and desktop. It covers the chat, the dashboard, the pipeline detail screen, and checking on and lightly editing pipelines from a phone or tablet.

**Zain Baig · FAST · Batch 2026**

- **Live:** https://zainnb.github.io/astera-studio/
- **Offline:** open `index.html` in this folder. It's one self-contained file: no install, no internet needed.
- **Source:** https://github.com/ZainnB/astera-studio (also in `source/`)
- **Design note:** `NOTE.md`

All data is made up and there is no backend. Changes you make reset when you reload.

## A 3-minute tour

1. **Chat:** tap *"Which regions missed their sales target last quarter?"* You get a chart with a short summary.
   - Tap *Sort highest first* to have the chat change the chart.
   - Tap **Pin** to add it to the dashboard.
2. **Dashboard:** the top strip shows that the *Sales vs target* pipeline **failed** and the data is from yesterday.
   - Tap a **region's bar** to drill into its months.
   - Change the **date range or region** (on a phone: *Filters*, a bottom sheet you can drag down).
   - Tap the **table icon** on a chart for exact numbers. Your pinned chart is at the bottom.
3. **Pipeline:** tap *View pipeline*. The failed step opens with its error.
   - Tap **Edit**, change *Timeout* to 60 s, **Save**, then **Re-run now**.
   - The steps turn green one by one, and the dashboard reports fresh data.
4. **Resize** from 375px to 768px, 1024px and 1440px, or use DevTools device mode. Each size has its own layout.

## The brief, and where to find each part

| Brief | In the mockup |
|---|---|
| **Chat:** answer as a chart with a short summary, pinnable | Chat screen: summary first, then the chart. **Pin** sends it to the dashboard's "Pinned from chat" section. |
| **Dashboard:** KPIs, charts, data freshness, pipeline status | 4 KPIs, 3 charts, and a status strip ("Last refresh failed 2 hours ago. Showing data from yesterday."). Every chart's footer names its pipeline and data age. All four statuses appear on the Pipelines screen. |
| **Dashboard on a phone** | One column in priority order: status → KPIs 2×2 → key chart → rest. Filters move into a bottom sheet. |
| **Pipeline detail:** steps and how they connect | iPhone: a vertical step list; tap a step to expand it in place. iPad and desktop: an auto-laid-out diagram with a details panel. |
| **Graph actions** | All five examples from the brief: re-run a failed pipeline · change the date or region filter · ask the chat to change a chart · view the pipeline behind a chart (chart footer) · drill down (tap a region bar). |
| **Light pipeline edits from iPad/iPhone** | *Edit → Save* on step settings, guarded against losing unsaved changes, then *Re-run*. |
| **375 / 768–1024 / 1440px, adapt, not shrink** | See the next table. |
| **Touch, no hover-only features** | Targets ≥ 44px, chart tooltips on tap, hover used only as extra polish on mouse devices, 16px inputs (no iOS zoom), notch and home-bar safe areas. |

## How each screen adapts

| | iPhone (< 700px) | iPad (700–1199px) | Desktop (≥ 1200px) |
|---|---|---|---|
| Navigation | Bottom tab bar | Icon rail | Sidebar |
| Dashboard | Single column, filters in a draggable sheet | KPIs in a row, 2-column charts, inline filters | 3-column grid |
| Pipeline | Step list, details expand inline | Diagram + details panel below | Diagram + two-column details panel |

Extras: light / dark / auto theme, screen transitions, and a status shown by icon + word, never by color alone.

## Run it from source

```bash
cd source
npm install
npm run dev            # local dev server
npm run build:single   # dist-single/index.html: the self-contained file
```

Built with React 19, TypeScript, Vite, React Router (hash routing, so it works from `file://`) and Chart.js. Styling is plain CSS with design tokens (`src/styles/tokens.css`) and the bundled Geist font (SIL OFL).
