import type { Step } from '../../data/types'

// Works out where each step sits on the canvas, purely from `inputs`.
//   column = how far along the flow the step is (left → right)
//   row    = which lane it's in (the main line is row 0; extra inputs of a
//            join get the rows below)
// No positions are stored in the data, so any pipeline lays itself out.

export interface Placed {
  step: Step
  col: number
  row: number
}

export function layoutSteps(steps: Step[]): { placed: Placed[]; cols: number; rows: number } {
  const col = new Map<string, number>()
  const row = new Map<string, number>()

  // Columns: one more than the furthest input. Steps are stored in run
  // order, so a step's inputs always have a column already.
  for (const s of steps) {
    col.set(s.id, s.inputs.length ? Math.max(...s.inputs.map((id) => col.get(id) ?? 0)) + 1 : 0)
  }

  // A source that only feeds a later step (e.g. a lookup table read just
  // before a join) moves right to sit next to that step, so its arrow is short.
  for (const s of steps) {
    if (s.inputs.length > 0) continue
    const users = steps.filter((u) => u.inputs.includes(s.id))
    if (users.length) col.set(s.id, Math.min(...users.map((u) => col.get(u.id) ?? 0)) - 1)
  }

  // Rows: walk backwards from the final step. Its first input stays in the
  // same lane; a second input (a join's other side) goes one lane down.
  for (let i = steps.length - 1; i >= 0; i--) {
    const s = steps[i]
    if (!row.has(s.id)) row.set(s.id, 0)
    const r = row.get(s.id) ?? 0
    s.inputs.forEach((id, k) => {
      if (!row.has(id)) row.set(id, r + k)
    })
  }

  const placed = steps.map((step) => ({ step, col: col.get(step.id) ?? 0, row: row.get(step.id) ?? 0 }))
  return {
    placed,
    cols: Math.max(...placed.map((p) => p.col)) + 1,
    rows: Math.max(...placed.map((p) => p.row)) + 1,
  }
}
