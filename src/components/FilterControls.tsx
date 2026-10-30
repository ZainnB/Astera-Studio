import { rangeLabels } from '../data/selectors'
import { regions } from '../data/sales'
import type { DateRange, Region } from '../data/types'
import { useApp } from '../state/AppContext'
import ChipGroup from './ChipGroup'
import './FilterControls.css'

const rangeOptions = (Object.keys(rangeLabels) as DateRange[]).map((value) => ({ value, label: rangeLabels[value] }))
const regionOptions: { value: Region | 'All'; label: string }[] = [
  { value: 'All', label: 'All regions' },
  ...regions.map((r) => ({ value: r, label: r })),
]

// Same filters, two layouts:
//   inline: in the dashboard header (tablet/desktop). Region is a native
//           <select>, which opens a touch-friendly picker on iPad.
//   sheet:  inside the phone bottom sheet. Everything becomes big chips,
//           easy to hit with a thumb.
export default function FilterControls({ layout }: { layout: 'inline' | 'sheet' }) {
  const { state, dispatch } = useApp()
  const { range, region } = state.filters
  const setRange = (value: DateRange) => dispatch({ type: 'setFilters', filters: { range: value } })
  const setRegion = (value: Region | 'All') => dispatch({ type: 'setFilters', filters: { region: value } })

  if (layout === 'sheet') {
    return (
      <div className="filters filters--sheet">
        <fieldset>
          <legend>Date range</legend>
          <ChipGroup label="Date range" options={rangeOptions} value={range} onChange={setRange} />
        </fieldset>
        <fieldset>
          <legend>Region</legend>
          <ChipGroup label="Region" options={regionOptions} value={region} onChange={setRegion} />
        </fieldset>
      </div>
    )
  }

  return (
    <div className="filters filters--inline">
      <ChipGroup label="Date range" options={rangeOptions} value={range} onChange={setRange} />
      <label className="filters__select">
        <span className="sr-only">Region</span>
        <select value={region} onChange={(e) => setRegion(e.target.value as Region | 'All')}>
          {regionOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
