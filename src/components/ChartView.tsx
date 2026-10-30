import type { Chart, ChartData, ChartOptions, ScriptableContext } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import '../charts/setup'
import { useChartColors } from '../charts/useChartColors'
import type { ChartSpec } from '../data/types'
import { formatValue } from '../lib/format'

/** '#3349ad' + 0.5 → 'rgba(51, 73, 173, 0.5)' (canvas gradients need explicit alpha). */
function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.replace('#', ''), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

/**
 * Area fill under a line: from transparent at the bottom of the plot to a
 * light tint at the top. Chart.js calls this while drawing; on the very first
 * pass the plot area isn't measured yet, so we return the plain color.
 */
function areaGradient(chart: Chart, color: string) {
  const area = chart.chartArea
  if (!area) return color
  const g = chart.ctx.createLinearGradient(0, area.bottom, 0, area.top)
  g.addColorStop(0, withAlpha(color, 0))
  g.addColorStop(1, withAlpha(color, 0.18))
  return g
}

/**
 * One gradient per bar, from its baseline (lighter) to its own end (full
 * color). Per bar, not per chart: otherwise short bars would only get the
 * pale part and look as if their color meant something.
 */
function barGradient(ctx: ScriptableContext<'bar'>, color: string, horizontal: boolean) {
  const { chart, dataset, dataIndex } = ctx
  if (!chart.chartArea) return color
  const scale = horizontal ? chart.scales.x : chart.scales.y
  const base = scale.getPixelForValue(0)
  const end = scale.getPixelForValue(Number(dataset.data[dataIndex]))
  if (Math.abs(end - base) < 1) return color
  const g = horizontal ? chart.ctx.createLinearGradient(base, 0, end, 0) : chart.ctx.createLinearGradient(0, base, 0, end)
  g.addColorStop(0, withAlpha(color, 0.6))
  g.addColorStop(1, withAlpha(color, 1))
  return g
}

interface ChartViewProps {
  chart: ChartSpec
  /** If given, tapping a bar calls this with the bar's label (used for drill-down). */
  onSelectLabel?: (label: string) => void
}

// Turns our simple ChartSpec into a Chart.js chart. All styling decisions
// (thin lines, rounded bar ends, grey reference series, recessive grid) live
// here, so every chart in the app looks consistent.
export default function ChartView({ chart, onSelectLabel }: ChartViewProps) {
  const colors = useChartColors()
  const isLine = chart.kind === 'line'
  const horizontal = chart.kind === 'hbar'
  const format = (v: number) => formatValue(chart.unit, v)

  const datasets = chart.datasets.map((d) => {
    const isRef = d.role === 'reference'
    const color = isRef ? colors.reference : colors.series

    if (isLine) {
      return {
        label: d.label,
        data: d.data,
        borderColor: color,
        // Main line gets a soft area fill fading to nothing at the bottom.
        fill: isRef ? false : 'start',
        backgroundColor: isRef ? color : (ctx: ScriptableContext<'line'>) => areaGradient(ctx.chart, color),
        borderWidth: 2,
        borderDash: isRef ? [6, 4] : [], // dashed = "plan", solid = "actual"
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHitRadius: 20, // generous invisible hit area for fingers
        tension: 0.3,
      }
    }

    return {
      label: d.label,
      data: d.data,
      // Variance bars: blue above zero, red below. Reference: flat tint.
      // Main series: a gradient that deepens toward the data end of each bar.
      backgroundColor:
        d.role === 'variance'
          ? d.data.map((v) => (v < 0 ? colors.negative : colors.series))
          : isRef
            ? color
            : (ctx: ScriptableContext<'bar'>) => barGradient(ctx, color, horizontal),
      borderRadius: 4,
      borderSkipped: 'start' as const, // round the data end, keep the baseline end square
      maxBarThickness: 36,
      categoryPercentage: 0.7,
      barPercentage: 0.9, // small gap between paired bars
    }
  })

  const valueAxis = {
    beginAtZero: !isLine, // bars must start at 0 to be honest; lines may zoom in on the trend
    grid: { color: colors.grid },
    border: { display: false },
    ticks: { color: colors.text, maxTicksLimit: 5, callback: (v: string | number) => format(Number(v)) },
  }
  const categoryAxis = {
    grid: { display: false },
    border: { color: colors.grid },
    ticks: { color: colors.text, autoSkip: true, maxRotation: 0 },
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false, // the card decides the height, the chart fills it
    animation: { duration: 700, easing: 'easeOutQuart' }, // bars grow up from the baseline on load
    indexAxis: horizontal ? 'y' : 'x',
    // index + intersect:false: tapping anywhere in a column shows that column's
    // values, so you don't have to hit a thin bar or line exactly.
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false }, // ChartCard draws an HTML legend instead
      tooltip: {
        backgroundColor: colors.tooltipBg,
        titleColor: colors.tooltipText,
        bodyColor: colors.tooltipText,
        padding: 10,
        cornerRadius: 8,
        displayColors: chart.datasets.length > 1,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${format(Number(horizontal ? ctx.parsed.x : ctx.parsed.y))}`,
        },
      },
    },
    scales: horizontal ? { x: valueAxis, y: categoryAxis } : { x: categoryAxis, y: valueAxis },
    onClick: onSelectLabel
      ? (_event, elements) => {
          if (elements.length > 0) onSelectLabel(chart.labels[elements[0].index])
        }
      : undefined,
  }

  const data = { labels: chart.labels, datasets }

  // react-chartjs-2 types Bar and Line separately, and our datasets mix both
  // shapes, hence the casts. The objects above are valid for each chart type.
  return isLine ? (
    <Line data={data as unknown as ChartData<'line'>} options={options as ChartOptions<'line'>} />
  ) : (
    <Bar data={data as unknown as ChartData<'bar'>} options={options} />
  )
}
