import { Link } from 'react-router'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { formatRelative } from '../lib/time'
import { useApp } from '../state/AppContext'

// Temporary list for chunk 2: proves state flows from AppProvider into screens.
// Gets its real design in chunk 5.
export default function PipelinesScreen() {
  const { state, rerun } = useApp()

  return (
    <>
      <PageHeader title="Pipelines" subtitle="The data flows that feed your charts." />
      <ul style={{ display: 'grid', gap: 'var(--s-3)', padding: 0, listStyle: 'none' }}>
        {state.pipelines.map((p) => (
          <li key={p.id} style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to={`/pipelines/${p.id}`}>{p.name}</Link>
            <StatusBadge status={p.status} />
            <span className="muted">fresh {formatRelative(p.lastSuccessAt)}</span>
            {p.status === 'failed' && <button onClick={() => rerun(p.id)}>Re-run</button>}
          </li>
        ))}
      </ul>
    </>
  )
}
