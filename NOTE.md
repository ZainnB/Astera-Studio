# Design note: Astera Studio mockup

**Zain Baig · FAST · Batch 2026** · Live: https://zainnb.github.io/astera-studio/

## 1. My main design ideas, and why

**Show if the data can be trusted, before showing the data.** A chart is only as good as the pipeline behind it. So the dashboard starts with a small strip: which pipeline feeds it, its status, and how old the data is. If it failed, *Re-run* and *View pipeline* are right there. Every chart also says where its data comes from, and tapping that takes you to the pipeline.

**Change the layout per screen, don't just shrink it.** On a phone the menu becomes a bottom tab bar where your thumb is. The dashboard turns into one column in order of importance: status, then the KPIs as a 2×2 grid, then the chart that answers "who missed target?". The filters slide up from the bottom. iPad gets an icon rail, and desktop gets a sidebar and a wider grid.

**The pipeline screen (the hardest part).** A drag-and-zoom canvas works with a mouse, not with a thumb. So on a phone the pipeline is a **vertical list of steps joined by a line, like a subway map**:
- Each step is a full-width card with its name, status and row count, so it's easy to read and to tap.
- Tap a step and it **opens in place** to show the error, the settings and a data preview. The steps around it stay visible, so you don't lose your place.
- The line only joins steps where data really flows. A gap means a new source starts, and a join says *"Combines A + B"*. So you still see the pipeline's shape in one column.
- One step opens at a time. It closes on a second tap, on another step, or on a tap outside, but not on scroll (the page would jump) and not with unsaved changes.
- Editing is a clear *Edit → Save → Re-run*, so nothing changes by accident. In the demo you fix a timed-out step by raising its timeout and re-running it from your phone.

On iPad and desktop there's room for a real diagram. It draws itself from the pipeline data, and tapping a step shows its details underneath.

## 2. An idea I tried and dropped

**"Previous / next" on the phone.** My first idea was one step per screen, with *Previous* / *Next* buttons and dots on top, like flipping through photos. Each step gets the whole screen, but you can never see the whole pipeline. To find where it broke, you'd tap through step after step. The subway line shows every step and its status at once, and the full details are still one tap away.

**Details beside the diagram on desktop.** I first put the step details in a panel to the right of the diagram, like most desktop tools. But pipelines flow left to right, so the diagram is wide. With the sidebar and the panel both taking space, a five-step pipeline didn't fit, even at 1440px, and you had to scroll sideways. Moving the details **below** the diagram keeps the whole flow visible and gives the details more room.

## 3. AI tools, key prompts, and what I changed by hand

I used **Claude Code (Claude Opus 5.5)** in VS Code. We built it in small parts, and I went through each one before moving on, because I wanted to understand every decision, not just get code.

Key prompts (lightly cleaned up):
1. *"Let's plan first and clear out all the confusion. Ask me questions. I want to understand every decision."* This gave a step-by-step plan. It also caught that a normal React build shows a blank page when opened from a zip, so the zip has one self-contained `index.html`.
2. *"If the user taps a step it should open to show details, then close on another tap or outside, but not while they're editing."* This replaced the planned pop-up sheet with the step list you see now.
3. *"Make it premium and minimal: shades of one colour apart from the statuses."* This is why everything is indigo, and green, red and amber only ever mean a status.

**What I found, changed or fixed myself:**
- **Testing in Chrome at 375, 768, 1024 and 1440px, I found and got fixed:**
  - numbers spilling out of the diagram boxes
  - a dropdown that didn't match the design
  - side-by-side charts not lining up
  - *Edit* closing the step on a phone
  - a misplaced dropdown arrow
  - a footer that was too heavy
- **My calls:**
  - steps opening in place instead of in a sheet
  - the date filter also controlling the monthly chart
  - stronger status colours
  - adding the header and footer
- **By hand:** the account details and photo, the GitHub repo and renames, and the GitHub Pages deployment.
