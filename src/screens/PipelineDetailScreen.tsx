import { useCallback, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { BackIcon, RefreshIcon } from '../components/Icons'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import StepCanvas from '../components/pipeline/StepCanvas'
import StepDetail from '../components/pipeline/StepDetail'
import { kindLabels } from '../components/pipeline/kindLabels'
import StepKindIcon from '../components/pipeline/StepKindIcon'
import StepList from '../components/pipeline/StepList'
import type { Pipeline } from '../data/types'
import { useBreakpoint } from '../hooks/useMediaQuery'
import { formatRelative } from '../lib/time'
import { useApp, usePipeline } from '../state/AppContext'
import './PipelineDetailScreen.css'

// One pipeline. The structure differs by device, so we switch components
// (not just CSS) based on screen size:
//   phone:   vertical step list, details expand inline
//   tablet/desktop: canvas on top, details panel below it (two columns on desktop)
//
// The selected step lives in the URL (?step=read-targets). So links can open
// a pipeline with a step already selected, and rotating an iPad keeps the
// same step open while the layout switches.
export default function PipelineDetailScreen() {
  const { pipelineId } = useParams()
  const pipeline = usePipeline(pipelineId)
  const { rerun } = useApp()
  const breakpoint = useBreakpoint()
  const [params, setParams] = useSearchParams()
  const [dirty, setDirty] = useState(false)
  const [nudge, setNudge] = useState(false)

  const selectedId = params.get('step')
  // replace: selecting steps shouldn't fill up the browser's Back history.
  const select = useCallback((id: string | null) => setParams(id ? { step: id } : {}, { replace: true }), [setParams])

  if (!pipeline) {
    return (
      <>
        <PageHeader title="Pipeline not found" />
        <Link to="/pipelines">Back to all pipelines</Link>
      </>
    )
  }

  const failedStep = pipeline.steps.find((s) => s.status === 'failed')
  const running = pipeline.status === 'running'

  // On bigger screens there's room to always show a step: default to the
  // failed one, then the running one, then the first.
  const panelStep =
    pipeline.steps.find((s) => s.id === selectedId) ??
    failedStep ??
    pipeline.steps.find((s) => s.status === 'running') ??
    pipeline.steps[0]

  // Panel (tablet/desktop) guards unsaved edits the same way the phone list does.
  const selectInPanel = (id: string) => {
    if (dirty && id !== panelStep.id) {
      setNudge(true)
      return
    }
    setNudge(false)
    select(id)
  }

  return (
    <>
      <Link to="/pipelines" className="btn btn--ghost detail__back">
        <BackIcon />
        Pipelines
      </Link>

      <PageHeader
        title={pipeline.name}
        subtitle={pipeline.description}
        actions={
          <button className={`btn ${pipeline.status === 'failed' ? 'btn--primary' : ''}`} onClick={() => rerun(pipeline.id)} disabled={running}>
            <RefreshIcon className={running ? 'spin' : undefined} />
            {running ? 'Running…' : pipeline.status === 'failed' ? 'Re-run pipeline' : 'Run now'}
          </button>
        }
      />

      <Meta pipeline={pipeline} />

      {failedStep && (
        <div className="card detail__alert" role="alert">
          <p>
            <strong>“{failedStep.label}” failed.</strong> The steps after it were skipped, so the dashboard still shows data from{' '}
            {formatRelative(pipeline.lastSuccessAt)}.
          </p>
          {breakpoint === 'phone' && selectedId !== failedStep.id && (
            <button className="btn" onClick={() => select(failedStep.id)}>
              Show step
            </button>
          )}
        </div>
      )}

      {breakpoint === 'phone' ? (
        <StepList pipeline={pipeline} selectedId={selectedId} onSelect={select} />
      ) : (
        <div className={`detail__layout detail__layout--${breakpoint}`}>
          <StepCanvas pipeline={pipeline} selectedId={panelStep.id} onSelect={selectInPanel} />
          <aside className="card detail__panel" aria-label="Step details">
            <header className="detail__panel-header">
              <StepKindIcon kind={panelStep.kind} />
              <div>
                <p className="detail__panel-kind">{kindLabels[panelStep.kind]}</p>
                <h2 className="detail__panel-title">{panelStep.label}</h2>
                <p className="muted">{panelStep.detail}</p>
              </div>
              <StatusBadge status={panelStep.status} />
            </header>
            <StepDetail
              key={panelStep.id}
              pipeline={pipeline}
              step={panelStep}
              onSelectStep={selectInPanel}
              onDirtyChange={setDirty}
              nudge={nudge}
            />
          </aside>
        </div>
      )}
    </>
  )
}

/** Status, schedule and freshness in one scannable row. */
function Meta({ pipeline }: { pipeline: Pipeline }) {
  return (
    <dl className="detail__meta">
      <div>
        <dt>Status</dt>
        <dd>
          <StatusBadge status={pipeline.status} />
        </dd>
      </div>
      <div>
        <dt>Data as of</dt>
        <dd>{formatRelative(pipeline.lastSuccessAt)}</dd>
      </div>
      <div>
        <dt>Last run</dt>
        <dd>{formatRelative(pipeline.lastRunAt)}</dd>
      </div>
      <div>
        <dt>Schedule</dt>
        <dd>{pipeline.schedule}</dd>
      </div>
    </dl>
  )
}
