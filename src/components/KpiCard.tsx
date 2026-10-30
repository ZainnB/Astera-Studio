import type { Kpi } from '../data/selectors'
import { useCountUp } from '../hooks/useCountUp'
import { ArrowDownIcon, ArrowUpIcon } from './Icons'
import './KpiCard.css'

// One headline number. The trend uses an arrow *and* color *and* words,
// so it never depends on color alone.
export default function KpiCard({ kpi }: { kpi: Kpi }) {
  const shown = useCountUp(kpi.value)
  return (
    <div className="card kpi">
      <p className="kpi__label">{kpi.label}</p>
      {/* Screen readers get the final value, not every frame of the count. */}
      <p className="kpi__value" aria-label={kpi.format(kpi.value)}>
        {kpi.format(shown)}
      </p>
      <p className={`kpi__note ${kpi.trend ? `kpi__note--${kpi.trend}` : ''}`}>
        {kpi.trend === 'up' && <ArrowUpIcon aria-hidden="true" />}
        {kpi.trend === 'down' && <ArrowDownIcon aria-hidden="true" />}
        {kpi.note}
      </p>
    </div>
  )
}
