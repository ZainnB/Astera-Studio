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

## 3. Build the rest
**Prompt:** "all good, next do chunk 4, 5, 6 and 7 all in this go" (chunk 3 hadn't been built, so AI did 3–7).

**Outcome:** dashboard, chat, pipeline list + detail, packaging, README, NOTE draft.
Decisions AI made during the build that I should be able to defend:
- Desktop pipeline panel moved **below** the canvas (side panel made the canvas scroll at 1440px)
- Chat refuses "show as line" for regions/categories (a line implies continuity, which only time has)
- Trend chart always shows 12 months, even with the "last quarter" filter (a trend needs history)
- "Tap outside" listens to `click`, not `pointerdown`, so starting a scroll never collapses a step
- Selected step lives in the URL so dashboard links can open the failed step directly

## 4. Canvas bug + premium look (start of v2)
**Prompt:** "The numbers after the status in the pipeline graph boxes go out of the box if more than two
digits, fix that. What do those numbers even mean? … Give the full website a premium, elite but
professional and minimalistic look. Not too many colours, shades of the same colour other than statuses."

**Outcome:** The number was "rows out" with no label → now its own line, "12,480 rows". Whole UI moved
to one indigo hue in shades + faintly tinted neutrals; status colors are the only other hues. Chart
pair (main + target) validated as a one-hue light→dark ramp with the dataviz palette script.
Red/amber backgrounds removed from banners (thin status edge + badge instead); frosted iOS tab bar.

## 5. Fixes + v2 features
**Prompt:** "Step headings hide underneath the numbers, maybe change box sizes. 'All regions' doesn't fit
its box and the dropdown is out of the general design. Fix these, then v2: light/dark toggle, draggable
bottom sheet, smooth transitions between screens."

**Outcome:**
- Canvas boxes 148×128 and `flex: none` on each line (content was ~119px in a 112px box, so flexbox squeezed the name)
- Region select restyled as a pill like the chips (`appearance: none` + own chevron); native picker kept
- Theme toggle Auto → Light → Dark, saved in localStorage; inline script in index.html prevents a white flash; colors fade during the switch
- Bottom sheet: drag the handle/header down; >100px or a quick flick dismisses, otherwise springs back; every close slides down
- Screens fade up on navigation (`key={pathname}`); enter-only so nothing delays the user

## Hand fixes / things I changed
- Light-mode status pill backgrounds darker
- Repo renamed to Astera_Flow, Pages source set to GitHub Actions
