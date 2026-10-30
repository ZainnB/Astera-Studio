import { useCallback, useMemo, useReducer, type ReactNode } from 'react'
import { pipelines } from '../data/pipelines'
import { AppContext } from './AppContext'
import { reducer, type AppState } from './reducer'

const initialState: AppState = {
  pipelines,
  pinned: [],
  filters: { range: 'last-quarter', region: 'All' },
  chat: [],
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Holds the app state and makes it available to every component below it.
// No backend: state lives in memory and resets on page reload, which is fine
// for a clickable mockup.
export default function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Simulated re-run. Real Studio would call an API and poll for progress;
  // here we walk through the steps on a timer so the user sees them go
  // pending → running → succeeded in order.
  const rerun = useCallback(
    async (pipelineId: string) => {
      const pipeline = state.pipelines.find((p) => p.id === pipelineId)
      if (!pipeline || pipeline.status === 'running') return

      dispatch({ type: 'runStarted', pipelineId, at: new Date().toISOString() })
      for (const step of pipeline.steps) {
        dispatch({ type: 'stepStarted', pipelineId, stepId: step.id })
        await sleep(900)
        dispatch({ type: 'stepSucceeded', pipelineId, stepId: step.id })
      }
      dispatch({ type: 'runSucceeded', pipelineId, at: new Date().toISOString() })
    },
    [state.pipelines],
  )

  // useMemo: only create a new context object when something in it changed,
  // so components using useApp() don't re-render for no reason.
  const value = useMemo(() => ({ state, dispatch, rerun }), [state, rerun])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
