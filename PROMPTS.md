# AI prompt log

> Raw material for the "AI tools" section of the note. Delete before submission.
> Tool: Claude Code (Claude Opus 5.5) in VS Code.

## 1. Planning
**Prompt (paraphrased):** Pasted the full brief. "Let's plan first and clear out all the variables
and confusion. Ask me questions. I want to understand every decision and every part of the code:
plan v1 for the basics, then plan v2 to go above and beyond."

**Outcome:** AI asked about stack, charts, work mode, visual style, delivery, language, styling and
how to decide on the pipeline UX. I chose React + Vite + TS, Chart.js, plain CSS, clean light/dark.
AI flagged that a normal Vite build shows a blank page from `file://` → we added a single-file build.

## 2. Pipeline phone UX
**Prompt:** "A as you said, and also if the user clicks a step it drops longer to show details and
then gets back smaller on another click (outside of things he might want to edit) or on scroll
out of box, or whatever you think best."

**Outcome / my change:** Replaced the planned bottom sheet with **inline expand** on phone (my idea).
Agreed with AI to collapse on header tap / another step / outside tap, but **not** on scroll
(layout jump), and to keep the step open while it has unsaved edits.

## Hand fixes / things I changed
- (fill in as we go)
