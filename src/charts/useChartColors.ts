import { useMediaQuery } from '../hooks/useMediaQuery'
import { useThemePref } from '../lib/theme'

// Chart.js draws on a <canvas>, and canvas can't read CSS variables. So we
// read the current values of our tokens with getComputedStyle and hand
// Chart.js real colors.

export interface ChartColors {
  series: string
  reference: string
  negative: string
  grid: string
  text: string
  tooltipBg: string
  tooltipText: string
}

function readColors(): ChartColors {
  const css = getComputedStyle(document.documentElement)
  const v = (name: string) => css.getPropertyValue(name).trim()
  return {
    series: v('--series-1'),
    reference: v('--series-ref'),
    negative: v('--series-neg'),
    grid: v('--border'),
    text: v('--text-3'),
    // Tooltip is the inverse of the page (dark on light, light on dark).
    tooltipBg: v('--text'),
    tooltipText: v('--surface'),
  }
}

export function useChartColors(): ChartColors {
  // Subscribing to the OS dark-mode query and to the in-app theme toggle makes
  // the chart re-render (and so re-read the colors) the moment either changes.
  useMediaQuery('(prefers-color-scheme: dark)')
  useThemePref()
  return readColors()
}
