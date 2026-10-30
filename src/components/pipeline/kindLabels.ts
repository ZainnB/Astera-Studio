import type { StepKind } from '../../data/types'

/** Words for each kind, shown next to the icon so it never has to be guessed. */
export const kindLabels: Record<StepKind, string> = {
  excel: 'Excel file',
  database: 'Database',
  filter: 'Filter',
  join: 'Join',
  transform: 'Transform',
  output: 'Output',
}
