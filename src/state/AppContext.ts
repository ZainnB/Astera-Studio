import { createContext, useContext, type Dispatch } from 'react'
import type { Action, AppState } from './reducer'

// What every component can reach through useApp().
export interface AppContextValue {
  state: AppState
  dispatch: Dispatch<Action>
  /** Fake a full re-run: steps turn green one by one. */
  rerun: (pipelineId: string) => void
}

export const AppContext = createContext<AppContextValue | null>(null)

/** Read shared state from any component inside <AppProvider>. */
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  // Fails loudly if a component is rendered outside the provider by mistake,
  // instead of silently getting `null`.
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}

/** Convenience: one pipeline by id (undefined if the id is unknown). */
export function usePipeline(pipelineId: string | undefined) {
  return useApp().state.pipelines.find((p) => p.id === pipelineId)
}
