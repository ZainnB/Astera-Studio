import type { ChartSpec } from '../data/types'

// Number formatting in one place, so the same value always looks the same
// in a KPI, a chart axis, a tooltip and a table.

// A real minus sign (−) instead of a hyphen (-): same width as "+", lines up nicely.
const MINUS = '−'

/** 904 → "$904k", 5149 → "$5.15M" (input is in thousands of dollars). */
export function formatUsdK(k: number): string {
  if (Math.abs(k) >= 1000) return `$${(k / 1000).toFixed(2)}M`
  return `$${Math.round(k)}k`
}

/** 4.4 → "+4.4%", -9.6 → "−9.6%" */
export function formatPercent(p: number): string {
  const text = `${Math.abs(p).toFixed(1)}%`
  if (p > 0) return `+${text}`
  if (p < 0) return `${MINUS}${text}`
  return text
}

/** 12480 → "12,480" */
export function formatCount(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}

export function formatValue(unit: ChartSpec['unit'], value: number): string {
  switch (unit) {
    case 'usd-k':
      return formatUsdK(value)
    case 'percent':
      return formatPercent(value)
    case 'count':
      return formatCount(value)
  }
}
