import { formatCount, formatPercent, formatUsdK } from '../lib/format'
import { avgOrderValue, categories, categoryMix, months, regions, revenue, target } from './sales'
import type { ChartSpec, DateRange, Filters, Region } from './types'

// "Selectors" turn the raw sales tables + the current filters into exactly
// what a screen shows. Screens never do math themselves, and Chat and
// Dashboard use the same functions, so their numbers always agree.

const RANGE_MONTHS: Record<DateRange, number> = {
  'last-quarter': 3,
  'last-6-months': 6,
  'last-12-months': 12,
}

export const rangeLabels: Record<DateRange, string> = {
  'last-quarter': 'Last quarter',
  'last-6-months': 'Last 6 months',
  'last-12-months': 'Last 12 months',
}

// --- small helpers -----------------------------------------------------------

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/** Month positions (0–11) covered by a range, e.g. last quarter → [9, 10, 11]. */
function monthsIn(range: DateRange): number[] {
  const n = RANGE_MONTHS[range]
  return Array.from({ length: n }, (_, i) => 12 - n + i)
}

/** The same-length period just before, for "vs previous period". null if we have no data that far back. */
function previousMonths(range: DateRange): number[] | null {
  const n = RANGE_MONTHS[range]
  if (2 * n > 12) return null
  return Array.from({ length: n }, (_, i) => 12 - 2 * n + i)
}

function regionsFor(filters: Filters): Region[] {
  return filters.region === 'All' ? regions : [filters.region]
}

/** Total of a table (revenue or target) over some regions and months. */
function total(table: Record<Region, number[]>, rs: Region[], idx: number[]): number {
  return sum(rs.flatMap((r) => idx.map((i) => table[r][i])))
}

/** Orders = revenue ÷ average order value (revenue is in $k, so ×1000). */
function orderCount(rs: Region[], idx: number[]): number {
  return sum(rs.flatMap((r) => idx.map((i) => (revenue[r][i] * 1000) / avgOrderValue[r])))
}

const pctChange = (now: number, before: number) => (now / before - 1) * 100

// --- KPIs --------------------------------------------------------------------

export interface Kpi {
  id: string
  label: string
  value: string
  /** Second line, already formatted, e.g. "+5.2% vs previous period". */
  note: string
  /** Drives the arrow icon and color of the note. */
  trend?: 'up' | 'down'
}

export function getKpis(filters: Filters): Kpi[] {
  const rs = regionsFor(filters)
  const idx = monthsIn(filters.range)
  const prev = previousMonths(filters.range)

  const rev = total(revenue, rs, idx)
  const tgt = total(target, rs, idx)
  const orders = orderCount(rs, idx)
  const aov = (rev * 1000) / orders

  // "vs previous period" line, or the covered months when there's nothing to compare to.
  const compare = (now: number, before: number | null) => {
    if (before === null) return { note: `${months[idx[0]]} – ${months[idx[idx.length - 1]]}` }
    const change = pctChange(now, before)
    return { note: `${formatPercent(change)} vs previous period`, trend: change >= 0 ? ('up' as const) : ('down' as const) }
  }

  const prevRev = prev ? total(revenue, rs, prev) : null
  const prevOrders = prev ? orderCount(rs, prev) : null
  const prevAov = prevRev !== null && prevOrders !== null ? (prevRev * 1000) / prevOrders : null

  return [
    { id: 'revenue', label: 'Revenue', value: formatUsdK(rev), ...compare(rev, prevRev) },
    {
      id: 'attainment',
      label: 'Vs target',
      value: formatPercent(pctChange(rev, tgt)),
      note: `Target ${formatUsdK(tgt)}`,
      trend: rev >= tgt ? 'up' : 'down',
    },
    { id: 'orders', label: 'Orders', value: formatCount(orders), ...compare(orders, prevOrders) },
    { id: 'aov', label: 'Avg order value', value: `$${aov.toFixed(0)}`, ...compare(aov, prevAov) },
  ]
}

// --- Dashboard charts --------------------------------------------------------

/**
 * Revenue vs target. With "All regions" it compares regions; once a region
 * is picked (by filter or by tapping its bar) it drills down to that
 * region's months. Same card, one level deeper.
 */
export function regionChart(filters: Filters): ChartSpec {
  const idx = monthsIn(filters.range)

  if (filters.region === 'All') {
    return {
      id: 'dash-region',
      title: 'Revenue vs target by region',
      subtitle: 'Tap a region to drill down',
      kind: 'bar',
      labels: regions,
      datasets: [
        { label: 'Revenue', data: regions.map((r) => total(revenue, [r], idx)) },
        { label: 'Target', role: 'reference', data: regions.map((r) => total(target, [r], idx)) },
      ],
      unit: 'usd-k',
      pipelineId: 'sales',
    }
  }

  const r = filters.region
  return {
    id: 'dash-region',
    title: `${r}: revenue vs target by month`,
    kind: 'bar',
    labels: idx.map((i) => months[i]),
    datasets: [
      { label: 'Revenue', data: idx.map((i) => revenue[r][i]) },
      { label: 'Target', role: 'reference', data: idx.map((i) => target[r][i]) },
    ],
    unit: 'usd-k',
    timeSeries: true,
    pipelineId: 'sales',
  }
}

/** Always 12 months: a trend needs history, so the date filter doesn't shorten it. */
export function trendChart(filters: Filters): ChartSpec {
  const rs = regionsFor(filters)
  const all = months.map((_, i) => i)
  return {
    id: 'dash-trend',
    title: 'Monthly revenue, last 12 months',
    subtitle: filters.region === 'All' ? 'All regions' : filters.region,
    kind: 'line',
    labels: months,
    datasets: [
      { label: 'Revenue', data: all.map((i) => total(revenue, rs, [i])) },
      { label: 'Target', role: 'reference', data: all.map((i) => total(target, rs, [i])) },
    ],
    unit: 'usd-k',
    timeSeries: true,
    pipelineId: 'sales',
  }
}

export function categoryChart(filters: Filters): ChartSpec {
  const rs = regionsFor(filters)
  const idx = monthsIn(filters.range)
  return {
    id: 'dash-category',
    title: 'Revenue by category',
    kind: 'hbar',
    labels: categories,
    datasets: [
      {
        label: 'Revenue',
        data: categories.map((_, c) => sum(rs.map((r) => (total(revenue, [r], idx) * categoryMix[r][c]) / 100))),
      },
    ],
    unit: 'usd-k',
    pipelineId: 'sales',
  }
}

// --- Charts used by chat answers ---------------------------------------------

const Q3 = monthsIn('last-quarter')

/** % above/below target per region last quarter. Bars colored by sign. */
export function varianceChart(): ChartSpec {
  return {
    id: 'variance-q3',
    title: 'Q3 2026: % above or below target',
    kind: 'bar',
    labels: regions,
    datasets: [
      {
        label: 'Vs target',
        role: 'variance',
        data: regions.map((r) => Number(pctChange(total(revenue, [r], Q3), total(target, [r], Q3)).toFixed(1))),
      },
    ],
    unit: 'percent',
    pipelineId: 'sales',
  }
}

/** Company revenue vs target, Jan–Sep 2026. */
export function yearTrendChart(): ChartSpec {
  const idx = [3, 4, 5, 6, 7, 8, 9, 10, 11]
  return {
    id: 'trend-2026',
    title: 'Revenue vs target, 2026 so far',
    kind: 'line',
    labels: idx.map((i) => months[i]),
    datasets: [
      { label: 'Revenue', data: idx.map((i) => total(revenue, regions, [i])) },
      { label: 'Target', role: 'reference', data: idx.map((i) => total(target, regions, [i])) },
    ],
    unit: 'usd-k',
    timeSeries: true,
    pipelineId: 'sales',
  }
}

/** One region, last 6 months, revenue vs target. */
export function regionMonthlyChart(region: Region): ChartSpec {
  const idx = monthsIn('last-6-months')
  return {
    id: `monthly-${region.toLowerCase()}`,
    title: `${region}: revenue vs target, last 6 months`,
    kind: 'bar',
    labels: idx.map((i) => months[i]),
    datasets: [
      { label: 'Revenue', data: idx.map((i) => revenue[region][i]) },
      { label: 'Target', role: 'reference', data: idx.map((i) => target[region][i]) },
    ],
    unit: 'usd-k',
    timeSeries: true,
    pipelineId: 'sales',
  }
}
