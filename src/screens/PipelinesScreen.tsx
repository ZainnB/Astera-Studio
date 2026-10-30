import { Link } from 'react-router'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import type { RunStatus } from '../data/types'
import { formatRelative } from '../lib/time'
import { useApp } from '../state/AppContext'
import './PipelinesScreen.css'

// Problems first: someone checking on a phone wants to see what needs
// attention without scrolling.
const ATTENTION_ORDER: Record<RunStatus, number> = { failed: 0, running: 1, scheduled: 2, succeeded: 3 }

const SUMMARY_LABELS: Record<RunStatus, string> = {
  failed: 'failed',
  running: 'running',
  scheduled: 'scheduled',
  succeeded: 'healthy',
}

export default function PipelinesScreen() {
  const { state } = useApp()
  const sorted = [...state.pipelines].sort((a, b) => ATTENTION_ORDER[a.status] - ATTENTION_ORDER[b.status])

  // "1 failed · 1 running · …" at a glance.
  const summary = (Object.keys(ATTENTION_ORDER) as RunStatus[])
    .map((status) => ({ status, count: state.pipelines.filter((p) => p.status === status).length }))
    .filter((s) => s.count > 0)
    .map((s) => `${s.count} ${SUMMARY_LABELS[s.status]}`)
    .join(' · ')

  return (
    <>
      <PageHeader title="Pipelines" subtitle={summary} />
      <ul className="pipelines">
        {sorted.map((p) => {
          const done = p.steps.filter((s) => s.status === 'succeeded').length
          return (
            <li key={p.id}>
              {/* The whole card is one link: one big tap target. */}
              <Link to={`/pipelines/${p.id}`} className={`card pipeline-card pipeline-card--${p.status}`}>
                <span className="pipeline-card__head">
                  <span className="pipeline-card__name">{p.name}</span>
                  <StatusBadge status={p.status} />
                </span>
                <span className="pipeline-card__desc">{p.description}</span>

                {/* Mini progress track: one segment per step, colored by status. */}
                <span className="pipeline-card__track" role="img" aria-label={`${done} of ${p.steps.length} steps succeeded`}>
                  {p.steps.map((s) => (
                    <span key={s.id} className={`pipeline-card__seg step--${s.status}`} />
                  ))}
                </span>

                <span className="pipeline-card__meta">
                  <span>Data {formatRelative(p.lastSuccessAt)}</span>
                  <span>Next run {formatRelative(p.nextRunAt)}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}
