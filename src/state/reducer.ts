import type { ChartSpec, ChatMessage, Filters, Pipeline, Step } from '../data/types'

// All app-wide state and every way it can change, in one pure function.
// "Pure" = no timers, no fetching, no randomness: given the same state and
// action it always returns the same new state. That makes it easy to reason
// about, and the async parts (like a fake re-run) live in AppProvider instead.

export interface AppState {
  pipelines: Pipeline[]
  /** Charts pinned from chat; shown on the dashboard. */
  pinned: ChartSpec[]
  filters: Filters
  /** Chat history lives here (not in ChatScreen) so it survives switching tabs. */
  chat: ChatMessage[]
}

export type Action =
  | { type: 'setFilters'; filters: Partial<Filters> }
  | { type: 'chatAdd'; message: ChatMessage }
  | { type: 'pinChart'; chart: ChartSpec }
  | { type: 'unpinChart'; chartId: string }
  | { type: 'updateStepField'; pipelineId: string; stepId: string; key: string; value: string }
  | { type: 'runStarted'; pipelineId: string; at: string }
  | { type: 'stepStarted'; pipelineId: string; stepId: string }
  | { type: 'stepSucceeded'; pipelineId: string; stepId: string }
  | { type: 'runSucceeded'; pipelineId: string; at: string }

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'setFilters':
      return { ...state, filters: { ...state.filters, ...action.filters } }

    case 'chatAdd':
      return { ...state, chat: [...state.chat, action.message] }

    case 'pinChart':
      // Ignore double-pins of the same chart.
      if (state.pinned.some((c) => c.id === action.chart.id)) return state
      return { ...state, pinned: [...state.pinned, action.chart] }

    case 'unpinChart':
      return { ...state, pinned: state.pinned.filter((c) => c.id !== action.chartId) }

    case 'updateStepField':
      return updateStep(state, action.pipelineId, action.stepId, (step) => ({
        ...step,
        fields: step.fields.map((f) => (f.key === action.key ? { ...f, value: action.value } : f)),
      }))

    case 'runStarted':
      // Every step goes back to "waiting"; old errors are cleared.
      return updatePipeline(state, action.pipelineId, (p) => ({
        ...p,
        status: 'running',
        lastRunAt: action.at,
        steps: p.steps.map((s) => ({ ...s, status: 'pending', error: undefined })),
      }))

    case 'stepStarted':
      return updateStep(state, action.pipelineId, action.stepId, (s) => ({ ...s, status: 'running' }))

    case 'stepSucceeded':
      return updateStep(state, action.pipelineId, action.stepId, (s) => ({ ...s, status: 'succeeded' }))

    case 'runSucceeded':
      return updatePipeline(state, action.pipelineId, (p) => ({
        ...p,
        status: 'succeeded',
        lastSuccessAt: action.at,
      }))
  }
}

// Helpers: React needs *new* objects to notice a change, so instead of editing
// a pipeline in place we copy the list and replace just the one that changed.

function updatePipeline(state: AppState, pipelineId: string, change: (p: Pipeline) => Pipeline): AppState {
  return {
    ...state,
    pipelines: state.pipelines.map((p) => (p.id === pipelineId ? change(p) : p)),
  }
}

function updateStep(state: AppState, pipelineId: string, stepId: string, change: (s: Step) => Step): AppState {
  return updatePipeline(state, pipelineId, (p) => ({
    ...p,
    steps: p.steps.map((s) => (s.id === stepId ? change(s) : s)),
  }))
}
