import { useEffect, useState } from 'react'
import type { Pipeline, Step } from '../../data/types'
import { formatCount } from '../../lib/format'
import { useApp } from '../../state/AppContext'
import { AlertIcon, RefreshIcon } from '../Icons'
import './StepDetail.css'

interface StepDetailProps {
  pipeline: Pipeline
  step: Step
  /** Jump to another step (used by the "Gets data from" chips). */
  onSelectStep: (stepId: string) => void
  /** Tells the parent whether there are unsaved edits, so it won't close this step. */
  onDirtyChange: (dirty: boolean) => void
  /** Parent sets this when the user tried to leave with unsaved edits. */
  nudge: boolean
}

// Everything about one step: error, numbers, settings (lightly editable) and
// a data preview. Shared by the phone list (inline) and the tablet/desktop
// panel, so both show exactly the same thing.
//
// Parents render it with key={step.id}: switching to another step creates a
// fresh StepDetail, so the edit draft below starts clean for each step.
export default function StepDetail({ pipeline, step, onSelectStep, onDirtyChange, nudge }: StepDetailProps) {
  const { dispatch, rerun } = useApp()
  const [editing, setEditing] = useState(false)
  const [savedNote, setSavedNote] = useState(false)
  // Draft = the values in the form, separate from the saved values in state.
  const [draft, setDraft] = useState<Record<string, string>>(() =>
    Object.fromEntries(step.fields.map((f) => [f.key, f.value])),
  )

  const dirty = step.fields.some((f) => draft[f.key] !== f.value)
  const canEdit = step.fields.some((f) => f.editable)
  const ran = step.status === 'succeeded'
  const running = pipeline.status === 'running'
  const inputSteps = step.inputs.map((id) => pipeline.steps.find((s) => s.id === id)).filter((s) => s !== undefined)

  useEffect(() => {
    onDirtyChange(dirty)
  }, [dirty, onDirtyChange])

  function save() {
    for (const f of step.fields) {
      if (draft[f.key] !== f.value) {
        dispatch({ type: 'updateStepField', pipelineId: pipeline.id, stepId: step.id, key: f.key, value: draft[f.key] })
      }
    }
    setEditing(false)
    setSavedNote(true)
  }

  function discard() {
    setDraft(Object.fromEntries(step.fields.map((f) => [f.key, f.value])))
    setEditing(false)
  }

  return (
    <div className="step-detail">
      {step.error && (
        <div className="step-detail__error" role="alert">
          <AlertIcon />
          <div>
            <p>{step.error}</p>
            {canEdit && <p className="muted">You can adjust the settings, then re-run.</p>}
          </div>
        </div>
      )}

      {/* Two columns on desktop (facts | settings), one column elsewhere. */}
      <div className="step-detail__cols">
        <div className="step-detail__col">
          {/* Numbers only make sense once the step has actually run. */}
          <dl className="step-detail__stats">
            <div>
              <dt>Rows out</dt>
              <dd>{ran ? formatCount(step.rowsOut) : '—'}</dd>
            </div>
            <div>
              <dt>Took</dt>
              <dd>{ran ? `${(step.durationMs / 1000).toFixed(1)} s` : '—'}</dd>
            </div>
          </dl>

          {inputSteps.length > 0 && (
            <div>
              <p className="step-detail__label">Gets data from</p>
              <div className="step-detail__input-list">
                {inputSteps.map((s) => (
                  <button key={s.id} className="chip" onClick={() => onSelectStep(s.id)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step.preview && ran && (
            <div>
              <p className="step-detail__label">Data preview · first {step.preview.rows.length} rows</p>
              <div className="step-detail__table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      {step.preview.columns.map((c) => (
                        <th key={c} scope="col">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {step.preview.rows.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className={`step-detail__settings ${nudge && dirty ? 'step-detail__settings--nudge' : ''}`}>
          <div className="step-detail__settings-head">
            <p className="step-detail__label">Settings</p>
            {/* Editing is a deliberate mode: on touch, nothing changes by accident. */}
            {canEdit && !editing && (
              <button className="btn btn--ghost" onClick={() => setEditing(true)} disabled={running}>
                Edit
              </button>
            )}
          </div>

          <dl className="step-detail__fields">
            {step.fields.map((f) => (
              <div key={f.key} className="step-detail__field">
                <dt>{f.label}</dt>
                <dd>
                  {editing && f.editable ? (
                    f.options ? (
                      <select aria-label={f.label} value={draft[f.key]} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}>
                        {f.options.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input aria-label={f.label} value={draft[f.key]} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
                    )
                  ) : (
                    f.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {editing && (
            <div className="step-detail__edit-bar">
              {nudge && dirty && <p className="step-detail__nudge">Save or discard your changes first.</p>}
              <button className="btn" onClick={discard}>
                {dirty ? 'Discard' : 'Cancel'}
              </button>
              <button className="btn btn--primary" onClick={save} disabled={!dirty}>
                Save
              </button>
            </div>
          )}

          {savedNote && !editing && (
            <div className="step-detail__saved">
              <p>Saved. Changes apply on the next run.</p>
              <button className="btn btn--primary" onClick={() => rerun(pipeline.id)} disabled={running}>
                <RefreshIcon />
                Re-run now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
