import type { ChartData, ChartOptions } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import '../charts/setup'
import { useChartColors } from '../charts/useChartColors'
import type { ChartSpec } from '../data/types'
import { formatValue } from '../lib/format'

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
        backgroundColor: color,
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
      // Variance bars: blue above zero, red below. Others: one color per series.
      backgroundColor: d.role === 'variance' ? d.data.map((v) => (v < 0 ? colors.negative : colors.series)) : color,
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
    animation: { duration: 300 },
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

  // react-chartjs-2 types Bar and Line separately, hence the casts; the
  // options above are valid for both.
  return isLine ? (
    <Line data={data as ChartData<'line'>} options={options as ChartOptions<'line'>} />
  ) : (
    <Bar data={data as ChartData<'bar'>} options={options} />
  )
}
