import { Link } from 'react-router'
import { formatRelative } from '../lib/time'
import { useApp, usePipeline } from '../state/AppContext'
import { RefreshIcon } from './Icons'
import StatusBadge from './StatusBadge'
import './PipelineStatusStrip.css'

// The answer to "can I trust these numbers?", shown above the dashboard:
// how fresh the data is, and the status of the pipeline that feeds it.
// Its wording and actions change with the status.
export default function PipelineStatusStrip({ pipelineId }: { pipelineId: string }) {
  const { rerun } = useApp()
  const pipeline = usePipeline(pipelineId)
  if (!pipeline) return null

  const failedStep = pipeline.steps.find((s) => s.status === 'failed')
  const runningIndex = pipeline.steps.findIndex((s) => s.status === 'running')

  let message: string
  switch (pipeline.status) {
    case 'failed':
      message = `Last refresh failed ${formatRelative(pipeline.lastRunAt)}. Showing data from ${formatRelative(pipeline.lastSuccessAt)}.`
      break
    case 'running':
      message = `Refreshing now: step ${runningIndex + 1} of ${pipeline.steps.length}. Showing data from ${formatRelative(pipeline.lastSuccessAt)}.`
      break
    case 'succeeded':
      message = `Data is up to date, refreshed ${formatRelative(pipeline.lastSuccessAt)}.`
      break
    case 'scheduled':
      message = `Data from ${formatRelative(pipeline.lastSuccessAt)}. Next refresh ${formatRelative(pipeline.nextRunAt)}.`
      break
  }

  // Deep link: open the pipeline with the failed step already expanded.
  const pipelineLink = `/pipelines/${pipeline.id}${failedStep ? `?step=${failedStep.id}` : ''}`

  return (
    <section className={`card strip strip--${pipeline.status}`} aria-live="polite" aria-label="Data freshness">
      <div className="strip__text">
        <p className="strip__title">
          <StatusBadge status={pipeline.status} />
          <span>{pipeline.name}</span>
        </p>
        <p className="strip__message">{message}</p>
        {failedStep && <p className="strip__error">“{failedStep.label}” failed: {failedStep.error}</p>}
      </div>
      <div className="strip__actions">
        <Link to={pipelineLink} className="btn">
          View pipeline
        </Link>
        {pipeline.status === 'failed' && (
          <button className="btn btn--primary" onClick={() => rerun(pipeline.id)}>
            <RefreshIcon />
            Re-run
          </button>
        )}
      </div>
    </section>
  )
}
