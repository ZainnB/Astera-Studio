import { useCallback, useEffect, useRef, useState } from 'react'
import type { Pipeline } from '../../data/types'
import { formatCount } from '../../lib/format'
import { ChevronDownIcon } from '../Icons'
import StatusBadge from '../StatusBadge'
import StepDetail from './StepDetail'
import StepKindIcon from './StepKindIcon'
import './StepList.css'

interface StepListProps {
  pipeline: Pipeline
  selectedId: string | null
  onSelect: (stepId: string | null) => void
}

// PHONE view of a pipeline: a vertical "subway line" of steps.
// Tapping a step expands it in place to show its details (accordion).
//
// Closing rules:
//   - tap the open step's header again, or open another step (one open at a time)
//   - tap anywhere outside the list
//   - NOT on scroll: collapsing content above you makes the page jump
//   - never while it has unsaved edits: we nudge the user to save or discard
export default function StepList({ pipeline, selectedId, onSelect }: StepListProps) {
  const listRef = useRef<HTMLOListElement>(null)
  const [dirty, setDirty] = useState(false)
  const [nudge, setNudge] = useState(false)

  const request = useCallback(
    (stepId: string | null) => {
      if (dirty) {
        setNudge(true)
        return
      }
      setNudge(false)
      onSelect(stepId)
    },
    [dirty, onSelect],
  )

  // "Tap outside closes". We listen for `click`, not `pointerdown`: a click
  // only fires for a real tap, never at the start of a scroll gesture.
  useEffect(() => {
    if (!selectedId) return
    function onClick(e: MouseEvent) {
      if (!listRef.current?.contains(e.target as Node)) request(null)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [selectedId, request])

  // When a step opens, make sure its header is on screen (it may have moved
  // because the previously open step above it collapsed).
  useEffect(() => {
    if (!selectedId) return
    const el = listRef.current?.querySelector(`[data-step-id="${selectedId}"]`)
    requestAnimationFrame(() => el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
  }, [selectedId])

  const steps = pipeline.steps

  return (
    <ol ref={listRef} className="step-list" aria-label="Pipeline steps">
      {steps.map((step, i) => {
        const open = step.id === selectedId
        const prev = steps[i - 1]
        const next = steps[i + 1]
        // Draw the connecting line only where data really flows between
        // neighbours. A gap in the line = a new, separate source starts here.
        const lineAbove = prev !== undefined && step.inputs.includes(prev.id)
        const lineBelow = next !== undefined && next.inputs.includes(step.id)
        const merges = step.inputs.length > 1

        return (
          <li
            key={step.id}
            data-step-id={step.id}
            className={`step-list__item step--${step.status} ${open ? 'step--open' : ''}`}
          >
            <div className="step-list__rail" aria-hidden="true">
              <span className={`step-list__line step-list__line--top ${lineAbove ? '' : 'is-hidden'}`} />
              <span className="step-list__dot" />
              <span className={`step-list__line step-list__line--bottom ${lineBelow ? '' : 'is-hidden'}`} />
            </div>

            <div className="card step-list__card">
              <button
                className="step-list__header"
                aria-expanded={open}
                aria-controls={`detail-${step.id}`}
                onClick={() => request(open ? null : step.id)}
              >
                <StepKindIcon kind={step.kind} />
                <span className="step-list__titles">
                  <span className="step-list__title">{step.label}</span>
                  <span className="step-list__sub">
                    {step.status === 'succeeded' ? `${formatCount(step.rowsOut)} rows` : step.detail}
                  </span>
                </span>
                <StatusBadge status={step.status} />
                <ChevronDownIcon className="step-list__chevron" aria-hidden="true" />
              </button>

              {/* A join has two inputs; say so, since a single line can't show it. */}
              {merges && !open && (
                <p className="step-list__merge">
                  Combines {step.inputs.map((id) => steps.find((s) => s.id === id)?.label).join(' + ')}
                </p>
              )}

              {open && (
                <div id={`detail-${step.id}`} className="step-list__detail">
                  <p className="muted step-list__detail-line">{step.detail}</p>
                  <StepDetail
                    key={step.id}
                    pipeline={pipeline}
                    step={step}
                    onSelectStep={(id) => request(id)}
                    onDirtyChange={setDirty}
                    nudge={nudge}
                  />
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
