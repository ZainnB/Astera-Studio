import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import type { ChartSpec } from '../data/types'
import { formatValue } from '../lib/format'
import { formatRelative } from '../lib/time'
import { usePipeline } from '../state/AppContext'
import ChartView from './ChartView'
import { BarChartIcon, TableIcon } from './Icons'
import StatusBadge from './StatusBadge'
import './ChartCard.css'

interface ChartCardProps {
  chart: ChartSpec
  /** Extra buttons in the card header (pin, back to all regions…). */
  actions?: ReactNode
  onSelectLabel?: (label: string) => void
  className?: string
}

// The frame every chart sits in: title, legend, chart/table switch, and a
// footer that says which pipeline feeds it and how fresh the data is.
// The footer link is the "view the pipeline behind this chart" action.
export default function ChartCard({ chart, actions, onSelectLabel, className = '' }: ChartCardProps) {
  const [asTable, setAsTable] = useState(false)
  const pipeline = usePipeline(chart.pipelineId)

  return (
    <section className={`card chart-card ${className}`} aria-label={chart.title}>
      <header className="chart-card__header">
        <div className="chart-card__titles">
          <h3 className="chart-card__title">{chart.title}</h3>
          {chart.subtitle && <p className="muted">{chart.subtitle}</p>}
        </div>
        <div className="chart-card__actions">
          {actions}
          <button
            className="btn btn--ghost btn--icon"
            onClick={() => setAsTable(!asTable)}
            aria-label={asTable ? 'Show as chart' : 'Show as table'}
            title={asTable ? 'Show as chart' : 'Show as table'}
          >
            {asTable ? <BarChartIcon /> : <TableIcon />}
          </button>
        </div>
      </header>

      {/* Legend only when there's more than one series. Text stays in text
          color; only the swatch carries the series color. */}
      {chart.datasets.length > 1 && (
        <ul className="chart-card__legend">
          {chart.datasets.map((d) => (
            <li key={d.label}>
              <span className={`swatch ${d.role === 'reference' ? 'swatch--ref' : ''} ${chart.kind === 'line' ? 'swatch--line' : ''}`} />
              {d.label}
            </li>
          ))}
        </ul>
      )}

      {asTable ? (
        <ChartTable chart={chart} />
      ) : (
        <div className={`chart-card__canvas chart-card__canvas--${chart.kind}`}>
          <ChartView chart={chart} onSelectLabel={onSelectLabel} />
        </div>
      )}

      {pipeline && (
        <Link to={`/pipelines/${pipeline.id}`} className="chart-card__source">
          <span>
            From <strong>{pipeline.name}</strong> · data {formatRelative(pipeline.lastSuccessAt)}
          </span>
          {pipeline.status !== 'succeeded' && <StatusBadge status={pipeline.status} />}
        </Link>
      )}
    </section>
  )
}

/** Same numbers as a table: exact values, and readable without seeing color. */
function ChartTable({ chart }: { chart: ChartSpec }) {
  return (
    <div className="chart-card__table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col"></th>
            {chart.datasets.map((d) => (
              <th key={d.label} scope="col">
                {d.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chart.labels.map((label, i) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              {chart.datasets.map((d) => (
                <td key={d.label}>{formatValue(chart.unit, d.data[i])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
