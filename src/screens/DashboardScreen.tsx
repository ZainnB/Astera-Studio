import { useState } from 'react'
import { Link } from 'react-router'
import BottomSheet from '../components/BottomSheet'
import ChartCard from '../components/ChartCard'
import FilterControls from '../components/FilterControls'
import { BackIcon, SlidersIcon } from '../components/Icons'
import KpiCard from '../components/KpiCard'
import PageHeader from '../components/PageHeader'
import PipelineStatusStrip from '../components/PipelineStatusStrip'
import { categoryChart, getKpis, rangeLabels, regionChart, trendChart } from '../data/selectors'
import type { Region } from '../data/types'
import { useApp } from '../state/AppContext'
import './DashboardScreen.css'

// Phone vs desktop is handled in DashboardScreen.css, not here: the order of
// elements below IS the phone priority order (freshness → KPIs → the chart
// that answers "who missed target?" → the rest). Bigger screens rearrange
// the same elements into a grid.
export default function DashboardScreen() {
  const { state, dispatch } = useApp()
  const { filters, pinned } = state
  const [filtersOpen, setFiltersOpen] = useState(false)

  const regionLabel = filters.region === 'All' ? 'All regions' : filters.region
  const setRegion = (region: Region | 'All') => dispatch({ type: 'setFilters', filters: { region } })

  return (
    <>
      <PageHeader
        title="Sales overview"
        subtitle={`${rangeLabels[filters.range]} · ${regionLabel}`}
        actions={
          <>
            <FilterControls layout="inline" />
            {/* Phone only (CSS hides it on bigger screens). */}
            <button className="btn dash__filters-btn" onClick={() => setFiltersOpen(true)}>
              <SlidersIcon />
              Filters
              {filters.region !== 'All' && <span className="dash__filters-count">1</span>}
            </button>
          </>
        }
      />

      <BottomSheet open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <FilterControls layout="sheet" />
      </BottomSheet>

      <div className="dash">
        <PipelineStatusStrip pipelineId="sales" />

        <section className="dash__kpis" aria-label="Key figures">
          {getKpis(filters).map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </section>

        <div className="dash__grid">
          <ChartCard
            className="dash__region"
            chart={regionChart(filters)}
            // Drill-down: tapping a region's bar filters the whole dashboard to it.
            onSelectLabel={filters.region === 'All' ? (label) => setRegion(label as Region) : undefined}
            actions={
              filters.region !== 'All' && (
                <button className="btn btn--ghost" onClick={() => setRegion('All')}>
                  <BackIcon />
                  All regions
                </button>
              )
            }
          />
          <ChartCard className="dash__category" chart={categoryChart(filters)} />
          <ChartCard className="dash__trend" chart={trendChart(filters)} />
        </div>

        <section className="dash__pinned" aria-labelledby="pinned-title">
          <h2 id="pinned-title" className="dash__section-title">
            Pinned from chat
          </h2>
          {pinned.length === 0 ? (
            <p className="card dash__empty muted">
              Answers you pin in <Link to="/chat">Chat</Link> show up here.
            </p>
          ) : (
            <div className="dash__grid">
              {pinned.map((chart) => (
                <ChartCard
                  key={chart.id}
                  chart={chart}
                  actions={
                    <button className="btn btn--ghost" onClick={() => dispatch({ type: 'unpinChart', chartId: chart.id })}>
                      Unpin
                    </button>
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
