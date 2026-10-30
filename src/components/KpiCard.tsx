import type { Kpi } from '../data/selectors'
import { ArrowDownIcon, ArrowUpIcon } from './Icons'
import './KpiCard.css'

// One headline number. The trend uses an arrow *and* color *and* words,
// so it never depends on color alone.
export default function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="card kpi">
      <p className="kpi__label">{kpi.label}</p>
      <p className="kpi__value">{kpi.value}</p>
      <p className={`kpi__note ${kpi.trend ? `kpi__note--${kpi.trend}` : ''}`}>
        {kpi.trend === 'up' && <ArrowUpIcon aria-hidden="true" />}
        {kpi.trend === 'down' && <ArrowDownIcon aria-hidden="true" />}
        {kpi.note}
      </p>
    </div>
  )
}
