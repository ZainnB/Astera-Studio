import type { Pipeline } from '../../data/types'
import { formatCount } from '../../lib/format'
import StatusBadge from '../StatusBadge'
import { layoutSteps } from './layout'
import { kindLabels } from './kindLabels'
import StepKindIcon from './StepKindIcon'
import './StepCanvas.css'

// Node size and spacing in px. The canvas size is computed from these, so
// short pipelines stay compact and long ones scroll sideways (one finger,
// native scrolling, never pinch-zoom). Sized so the 5-column sales pipeline
// still fits an iPad in landscape: 2×16 + 5×148 + 4×28 = 884px.
const W = 148
const H = 128
const GAP_X = 28
const GAP_Y = 24
const PAD = 16

interface StepCanvasProps {
  pipeline: Pipeline
  selectedId: string | null
  onSelect: (stepId: string) => void
}

// TABLET/DESKTOP view of a pipeline: steps as boxes, arrows showing how data
// flows between them. Every box is a real <button> (focusable, tappable,
// announced by screen readers), not just pixels on a canvas.
export default function StepCanvas({ pipeline, selectedId, onSelect }: StepCanvasProps) {
  const { placed, cols, rows } = layoutSteps(pipeline.steps)
  const width = PAD * 2 + cols * W + (cols - 1) * GAP_X
  const height = PAD * 2 + rows * H + (rows - 1) * GAP_Y
  const x = (col: number) => PAD + col * (W + GAP_X)
  const y = (row: number) => PAD + row * (H + GAP_Y)
  const byId = new Map(placed.map((p) => [p.step.id, p]))

  return (
    <div className="canvas" role="group" aria-label="Pipeline diagram">
      <div className="canvas__inner" style={{ width, height }}>
        {/* Arrows first, so the boxes are drawn on top of them. */}
        <svg className="canvas__edges" width={width} height={height} aria-hidden="true">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0L10 5L0 10z" className="canvas__arrowhead" />
            </marker>
          </defs>
          {placed.flatMap(({ step, col, row }) =>
            step.inputs.map((inputId) => {
              const from = byId.get(inputId)
              if (!from) return null
              const x1 = x(from.col) + W
              const y1 = y(from.row) + H / 2
              const x2 = x(col)
              const y2 = y(row) + H / 2
              const bend = (x2 - x1) / 2
              // Solid = data has flowed along this arrow in the latest run.
              const flowed = from.step.status === 'succeeded'
              return (
                <path
                  key={`${inputId}-${step.id}`}
                  d={`M${x1} ${y1} C${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2 - 2} ${y2}`}
                  className={`canvas__edge ${flowed ? 'canvas__edge--flowed' : ''}`}
                  markerEnd="url(#arrow)"
                />
              )
            }),
          )}
        </svg>

        {placed.map(({ step, col, row }) => (
          <button
            key={step.id}
            className={`canvas__node step--${step.status}`}
            style={{ left: x(col), top: y(row), width: W, height: H }}
            aria-pressed={step.id === selectedId}
            onClick={() => onSelect(step.id)}
          >
            {/* Stacked lines, each with the full width, so nothing can collide:
                kind · name · rows produced · status. */}
            <span className="canvas__node-kind">
              <StepKindIcon kind={step.kind} />
              {kindLabels[step.kind]}
            </span>
            <span className="canvas__node-label" title={step.label}>
              {step.label}
            </span>
            <span className="canvas__node-rows">
              {step.status === 'succeeded' ? `${formatCount(step.rowsOut)} rows` : '\u00a0'}
            </span>
            <StatusBadge status={step.status} />
          </button>
        ))}
      </div>
    </div>
  )
}
