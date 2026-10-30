# Design note: Astera Studio mockup

**Zain Baig · FAST · Batch 2026** · Live: https://zainnb.github.io/astera-studio/

## Main design ideas

**1. Trust before numbers.** The dashboard opens with a freshness strip: which pipeline feeds it, its status, and how old the data is ("Last refresh failed 2 hours ago. Showing data from yesterday."). Every chart's footer repeats this and links to its pipeline, and the fix (*Re-run*, *View pipeline*) sits right beside the warning.

**2. Restructure, don't shrink.** The tab bar on iPhone becomes an icon rail on iPad and a sidebar on desktop. On a phone the dashboard is one column in priority order (status, KPIs 2×2, then the chart that answers "who missed target?"), with filters in a draggable bottom sheet.

**3. Pipeline detail: a list for thumbs, a diagram for screens.** A zoomable canvas is the wrong tool for a thumb, so on iPhone the pipeline is a **vertical "subway line"** of full-width step cards.
- **Tap a step to expand it in place.** It shows the error, row counts, settings and a data preview, and the neighbouring steps stay in view.
- **The line is drawn only where data flows.** A gap marks a new source, and a join reads *"Combines A + B"*, so branching survives in one column.
- **One step is open at a time.** It closes on a second tap, another step, or a tap outside, but **never on scroll**, since that makes the page jump. It also stays open while edits are unsaved.
- **Editing is explicit** (*Edit → Save → Re-run*), so nothing changes by accident. The demo fix, raising a database timeout, is a realistic light edit from a phone.

On iPad and desktop the same data draws an auto-laid-out diagram. The selected step lives in the URL, so the dashboard links straight to the failed step and rotating an iPad keeps your place.

**4. Actions where the question comes up.** All five examples from the brief are included:
- re-run a failed pipeline
- change the date or region filter
- ask the chat to change a chart (it won't draw regions as a line, since a line implies a sequence)
- view the pipeline behind a chart
- drill down by tapping a region's bar

**5. Calm, touch-first.** One indigo hue in shades; status colors only for status, always with an icon and a word. Targets are at least 44px, nothing depends on hover, tooltips open on tap, and every chart has a table view.

## An idea I tried and dropped

**A details panel docked beside the diagram on desktop,** as in most desktop pipeline tools. With the sidebar plus a 360px panel, a five-step pipeline no longer fit at 1440px, so the diagram scrolled sideways on the largest screen. Pipelines flow left to right, which makes the diagram wide and short, so the panel moved below it. On the phone I also dropped a pinch-zoom canvas (tiny targets) and a bottom sheet for step details (it hides the neighbouring steps).

## AI tools

I used **Claude Code (Claude Opus 5.5)** in VS Code. We built it in small chunks, and I reviewed each before continuing. Key prompts, lightly edited:

1. *"Plan first and clear out all the confusion. Ask me questions; I want to understand every decision."* This set the stack and a phased plan. It also caught that a normal Vite build shows a blank page when opened from a zip, which is why the zip has one self-contained file.
2. *"If the user taps a step, expand it to show details, then shrink it back on another tap or a tap outside, but not while they're editing."* This replaced the planned bottom sheet and set the rules above.
3. *"Make it premium and minimal: shades of one colour, apart from statuses."* This produced the one-hue color system.

**What I changed or fixed myself:**
- **Found by testing in Chrome DevTools (375, 768, 1024, 1440px)**, then had fixed:
  - row counts overflowing the diagram boxes and hiding step names
  - a region dropdown that didn't match the design
  - side-by-side charts that didn't line up
  - a footer that was too heavy
- **My decisions:**
  - inline expansion
  - making the date filter drive the trend chart (overriding an "always 12 months" default)
  - stronger status colors
  - adding the header and footer
- **By hand:** the account details and photo, repo setup, GitHub Pages deployment.
