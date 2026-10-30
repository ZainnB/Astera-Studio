// The shapes of all mock data. Screens and state import these, so if a field
// changes here, TypeScript points at every place that needs updating.

/** Status of a whole pipeline run. These are the four states from the brief. */
export type RunStatus = 'running' | 'succeeded' | 'failed' | 'scheduled'

/**
 * Status of one step inside a run. Two extra states a pipeline doesn't have:
 *   pending: waiting for earlier steps in the current run
 *   skipped: not run because an earlier step failed
 */
export type StepStatus = 'running' | 'succeeded' | 'failed' | 'pending' | 'skipped'

export type StepKind = 'excel' | 'database' | 'filter' | 'join' | 'transform' | 'output'

/** One setting of a step, shown in its detail view. Some can be edited lightly. */
export interface StepField {
  key: string
  label: string
  value: string
  editable?: boolean
  /** If present, edit with a dropdown of these choices instead of a text box. */
  options?: string[]
}

/** A small sample of the data coming out of a step. */
export interface DataPreview {
  columns: string[]
  rows: (string | number)[][]
}

export interface Step {
  id: string
  kind: StepKind
  label: string
  /** Short detail line, e.g. the file or table it reads. */
  detail: string
  status: StepStatus
  /**
   * Ids of the steps feeding into this one. Usually one; a join has two.
   * This one field is enough to draw both the phone list and the desktop canvas.
   */
  inputs: string[]
  /** Rows produced by the last successful run of this step. */
  rowsOut: number
  durationMs: number
  fields: StepField[]
  error?: string
  preview?: DataPreview
}

export interface Pipeline {
  id: string
  name: string
  description: string
  status: RunStatus
  /** Human-readable schedule, e.g. "Daily at 6:00 AM". */
  schedule: string
  /** ISO timestamps. */
  lastRunAt: string
  /** When data last refreshed successfully. This is what "freshness" means. */
  lastSuccessAt: string
  nextRunAt: string
  /** Steps are stored in run order (every step comes after its inputs). */
  steps: Step[]
}

export type Region = 'North' | 'South' | 'East' | 'West' | 'Central'

/** A chart, as stored in a chat answer or pinned to the dashboard. */
export interface ChartSpec {
  id: string
  title: string
  kind: 'bar' | 'line' | 'doughnut'
  labels: string[]
  datasets: { label: string; data: number[] }[]
  /** How to print values: $k amounts, percentages or plain counts. */
  unit: 'usd-k' | 'percent' | 'count'
  /** The pipeline this chart's data comes from. */
  pipelineId: string
}
