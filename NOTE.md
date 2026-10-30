# Design note: Astera Studio mockup

**Zain Baig · FAST · 2026**

## Main ideas

**1. Trust before numbers.** Everything a user sees depends on a pipeline, so the dashboard opens with a freshness strip: which pipeline feeds it, its status, and how old the data is ("Last refresh failed 2 hours ago. Showing data from yesterday."). Every chart repeats this in its footer, and that footer links to the pipeline behind the chart. A failure is never hidden in another screen; the fix (*Re-run*, *View pipeline*) sits right next to the warning.

**2. Same content, different structure per device.** I didn't shrink the desktop layout. Each size gets the structure that suits it. Navigation is a bottom tab bar on iPhone, an icon rail on iPad and a sidebar on desktop. On a phone the dashboard becomes one column in priority order (freshness, KPIs as a 2×2 grid, then the chart that answers "who missed target?"), and filters move into a bottom sheet.

**3. Pipeline detail: a list on phones, a diagram on bigger screens.** A drag-and-zoom canvas is the wrong tool for a thumb, so on iPhone the pipeline is a **vertical "subway line"** of steps:
- Each step is a full-width card showing its status, row count and type. Tapping it **expands it in place**, showing the error, numbers, settings and a data preview.
- The line between steps is drawn only where data actually flows. A gap means a new source starts there. A join says *"Combines A + B"*. So the branching is still readable in one column.
- Only one step is open at a time. It closes when you tap it again, open another, or tap outside, but **not on scroll**, because collapsing content above you makes the page jump. It also won't close while you have unsaved edits; it highlights *Save / Discard* instead.
- Editing is a deliberate mode (*Edit → Save*), so nothing changes by an accidental tap. The demo's fix (raising a database timeout, then *Re-run*) is a realistic "light edit" from a phone.

On iPad and desktop the same data draws a **diagram**, laid out automatically from each step's inputs, with a details panel. Pipelines flow left to right, so the diagram is wide and short. I put the panel *below* it instead of beside it, which keeps the whole flow visible without sideways scrolling. The selected step is kept in the URL, so links can open a pipeline at the failed step, and rotating an iPad keeps your place.

**4. Touch first.** Every target is at least 44px, nothing depends on hover (hover only adds polish on mouse devices), chart tooltips open on tap, every chart has a table view, and status is always shown with an icon and a word, never color alone.

## An idea I tried and dropped

**A details panel docked beside the diagram on desktop.** That's the familiar layout from desktop pipeline tools, and I built it first. But with a 240px sidebar and a 360px panel, a five-step pipeline no longer fit at 1440px, so the diagram scrolled sideways on the biggest screen. Moving the panel below the diagram (with two columns inside it) kept the whole flow visible.

Two phone ideas also didn't survive planning:
- **A pinch-to-zoom canvas.** Nodes are tiny at 375px, and tapping while panning misfires.
- **A bottom sheet for step details.** It covers the pipeline, so you lose sight of the neighbouring steps. Inline expansion keeps them in view.

## AI tools

I used **Claude Code (Claude Opus 5.5)** in VS Code to plan and write the code. We built it in small chunks, and I went through each one before moving on so I can explain the decisions. Key prompts:

1. *"Let's plan first and clear out all the variables and confusion. Ask me questions. I want to understand every decision: plan v1 for the basics, then v2 to go above and beyond."* This produced the stack questions, the phased plan, and a warning that a normal Vite build shows a blank page when opened from a zip, which led to the single-file build.
2. *"Option A, and if the user taps a step it should expand to show details, then collapse on another tap, outside what they might edit…"* This is where the inline-expand design and its closing rules came from.
3. *"Next, do chunks 3–7 in one go."* This built the dashboard, chat, pipeline screens and packaging.

**What I changed or decided myself:** chose the stack (React + TypeScript, Chart.js); replaced the planned bottom sheet with inline expansion; asked for stronger status-pill colors in light mode; renamed the repo and set up GitHub Pages.
<!-- TODO(Zain): add how you tested (DevTools sizes, your own phone/iPad), any edits you made by hand, and anything you changed after testing. Then delete this comment. -->
