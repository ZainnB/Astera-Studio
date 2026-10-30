# Astera Studio mockup: working plan

> Working doc. Delete or condense before submission.
> Deadline: **Sat 31 Oct, 6:00 PM**. Zip name: **ZainBaig_FAST_2026**

## Decisions

| Area | Choice | Why |
|---|---|---|
| Stack | React + Vite + TypeScript | Component model, and types document the data shapes |
| Charts | Chart.js + react-chartjs-2 (npm) | Touch tooltips built in; works offline (no CDN) |
| Styling | Plain CSS + CSS variables (`src/styles/tokens.css`) | One place for colors/spacing; dark mode = swap variables |
| Routing | `HashRouter` (`#/dashboard`) | Works from `file://` and GitHub Pages with no server config |
| State | React Context + `useReducer` | Small shared state; Redux is overkill |
| Delivery | GitHub Pages (live) + `vite-plugin-singlefile` build in zip | Reviewer can open either way |
| Font | System font stack | Native feel on iOS/macOS/Windows, nothing to download |
| Status colors | Succeeded green, Failed red, **Running amber**, Scheduled grey | Running ≠ accent blue; always icon + text, never color alone |
| Breakpoints | phone < 700, tablet 700–1199, desktop ≥ 1200 | iPad portrait 768 + landscape 1024 both land in "tablet" |

## Navigation per device
- Desktop: left sidebar with labels
- iPad: slim icon rail
- iPhone: bottom tab bar (Chat · Dashboard · Pipelines)

## Screens
1. **Chat**: suggestion chips, keyword-matched canned answers, answer card with chart + summary + Pin / View pipeline / Change chart
2. **Dashboard**: KPIs, 3–4 charts, freshness + pipeline status strip, date/region filters.
   Phone: status strip on top, KPIs 2×2, charts stacked by priority, filters in a bottom sheet
3. **Pipeline detail**: Option A (see below)
4. **Actions (v1)**: re-run failed pipeline, change filter, chart → pipeline, pin chat answer

## Pipeline detail: Option A (chosen)
- **Phone:** vertical "subway line" of steps. Tap a step to **expand it inline** (accordion) and show config, light edits, data preview and error.
  - One step open at a time
  - Collapse by tapping its header again, opening another step, or tapping empty space outside the cards
  - **Not** on scroll-away: collapsing content above the viewport makes the page jump (bad on iOS Safari)
  - Unsaved edits → ignore outside taps, show Save / Discard
  - Join's second input shown inline on the join step ("◀ Targets DB")
- **iPad + desktop:** auto-laid-out canvas (from `inputs`), details panel **below** it (two columns on desktop).
  Changed during build: a side panel beside the canvas made the 5-step pipeline scroll at 1440px.
- **Dropped:** Option B (one step per screen, loses overview) and Option C (pinch-zoom canvas on phone; tiny tap targets). C becomes the note's "tried and dropped" idea

## Data model (`src/data/types.ts`)
Steps list their `inputs`, so the same data drives both the vertical list and canvas edges.

## Build order: v1
- [x] 0. Scaffold: Vite + TS, deps, single-file config, tokens, Pages workflow
- [x] 1. App shell: routing + 3 nav layouts
- [x] 2. Types, mock data, context
- [x] 3. Dashboard
- [x] 4. Chat
- [x] 5. Pipeline detail + step expand/panel + light edit
- [x] 6. Wire actions
- [x] 7. Ship: build, deploy, readme, note, zip

## Built in v1 beyond the original list
Drill-down (tap region bar → its months) · chat follow-ups that redraw/sort a chart (refuses a line for
non-time data) · table view on every chart · selected step kept in URL (`?step=`) · mini step track on list

## v2 (detail after v1)
Drill-down on bars · chat follow-up changes a chart · transitions/skeletons/streaming text ·
draggable bottom sheet · Running animation · reduced motion · ARIA/keyboard · safe-area insets ·
`preview.html` with iPhone/iPad/desktop frames side by side · final note with screenshots

## Commands
```
npm run dev            # local dev server
npm run build          # dist/ (GitHub Pages)
npm run build:single   # dist-single/index.html (for the zip; opens by double-click)
npm run lint
npm run package       # release/ZainBaig_FAST_2026.zip (index.html + README + NOTE + source)
```
